import http from "node:http";
import https from "node:https";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import createMetascraper from "metascraper";
import author from "metascraper-author";
import date from "metascraper-date";
import description from "metascraper-description";
import image from "metascraper-image";
import publisher from "metascraper-publisher";
import title from "metascraper-title";
import canonicalUrl from "metascraper-url";

const scrapeMetadata = createMetascraper([
  author(),
  date(),
  description(),
  image(),
  publisher(),
  title(),
  canonicalUrl()
]);

const MAX_PAGE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const FETCH_TIMEOUT_MS = 10_000;

function isPrivateIpv4(address) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19 || b === 51)) ||
    (a === 203 && b === 0) || a >= 224;
}

function isPrivateIpv6(address) {
  const value = address.toLowerCase().split("%")[0];
  if (value === "::" || value === "::1") return true;
  if (value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") || value.startsWith("ff")) return true;
  if (value.startsWith("2001:db8:")) return true;
  const mapped = value.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? isPrivateIpv4(mapped[1]) : false;
}

export function isPrivateAddress(address) {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) return isPrivateIpv6(address);
  return true;
}

function parseTarget(rawUrl) {
  let target;
  try { target = new URL(String(rawUrl || "").trim()); } catch { throw new Error("链接格式不正确"); }
  if (target.protocol !== "http:" && target.protocol !== "https:") throw new Error("只支持 http 或 https 链接");
  if (target.username || target.password) throw new Error("链接不能包含账号或密码");
  return target;
}

async function resolveTarget(target, allowPrivate) {
  const hostname = target.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    throw new Error("不能读取本机或内部网络地址");
  }
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error("域名无法解析");
  if (!allowPrivate && addresses.some((item) => isPrivateAddress(item.address))) throw new Error("不能读取本机或内部网络地址");
  return addresses[0];
}

function requestHtml(target, resolved, options = {}) {
  const maxPageBytes = Number(options.maxPageBytes) > 0 ? Number(options.maxPageBytes) : MAX_PAGE_BYTES;
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : FETCH_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const client = target.protocol === "https:" ? https : http;
    const request = client.request({
      protocol: target.protocol,
      hostname: resolved.address,
      family: resolved.family,
      port: target.port || (target.protocol === "https:" ? 443 : 80),
      path: target.pathname + target.search,
      method: "GET",
      servername: target.hostname,
      headers: {
        Host: target.host,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "identity",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
      }
    }, (response) => {
      const status = Number(response.statusCode || 0);
      if (status >= 300 && status < 400 && response.headers.location) {
        response.resume();
        resolve({ redirect: new URL(response.headers.location, target).toString() });
        return;
      }
      if (status < 200 || status >= 300) {
        response.resume();
        reject(new Error(`网页返回状态 ${status}`));
        return;
      }
      const contentType = String(response.headers["content-type"] || "").toLowerCase();
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        response.resume();
        reject(new Error("这个链接不是可解析的网页"));
        return;
      }
      const declaredLength = Number(response.headers["content-length"] || 0);
      if (declaredLength > maxPageBytes) {
        response.resume();
        reject(new Error("网页内容过大，无法自动解析"));
        return;
      }
      const chunks = [];
      let total = 0;
      response.on("data", (chunk) => {
        total += chunk.length;
        if (total > maxPageBytes) {
          response.destroy(new Error("网页内容过大，无法自动解析"));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => resolve({ html: Buffer.concat(chunks).toString("utf8") }));
      response.on("error", reject);
    });
    request.setTimeout(timeoutMs, () => request.destroy(new Error("网页读取超时")));
    request.on("error", reject);
    request.end();
  });
}

async function fetchHtml(rawUrl, options = {}) {
  let target = parseTarget(rawUrl);
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const resolved = await resolveTarget(target, !!options.allowPrivate);
    const result = await requestHtml(target, resolved, options);
    if (!result.redirect) return { html: result.html, finalUrl: target.toString() };
    target = parseTarget(result.redirect);
  }
  throw new Error("网页重定向次数过多");
}

function clean(value, maxLength) {
  return String(value || "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, maxLength);
}

function safeWebUrl(value, fallback = "") {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : fallback;
  } catch {
    return fallback;
  }
}

export async function extractLinkPreview(rawUrl, options = {}) {
  const { html, finalUrl } = await fetchHtml(rawUrl, options);
  const metadata = await scrapeMetadata({ html, url: finalUrl });
  const dom = new JSDOM(html, { url: finalUrl, contentType: "text/html" });
  let article = null;
  try { article = new Readability(dom.window.document.cloneNode(true), { charThreshold: 80 }).parse(); } finally { dom.window.close(); }
  const fallbackTitle = new URL(finalUrl).hostname.replace(/^www\./, "");
  return {
    url: clean(safeWebUrl(metadata.url, finalUrl), 2048),
    title: clean(metadata.title || article?.title || fallbackTitle, 240),
    author: clean(metadata.author || article?.byline, 160),
    publisher: clean(metadata.publisher || article?.siteName, 160),
    publishedAt: clean(metadata.date || article?.publishedTime, 80),
    description: clean(metadata.description || article?.excerpt, 1200),
    image: clean(safeWebUrl(metadata.image), 2048),
    textContent: clean(article?.textContent, 30_000)
  };
}
