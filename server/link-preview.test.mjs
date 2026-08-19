import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { extractLinkPreview, isPrivateAddress } from "./link-preview.mjs";

async function fixtureServer(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve) => server.close(resolve))
  };
}

test("extracts metadata and readable article text without running scripts", async (t) => {
  const fixture = await fixtureServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`<!doctype html><html><head>
      <title>页面标题</title><meta name="author" content="桃子">
      <meta property="og:site_name" content="桃子工作室">
      <meta property="og:description" content="这是一段可核验的网页摘要">
      <meta property="og:image" content="/cover.jpg">
      <meta property="article:published_time" content="2026-08-14T08:00:00+08:00">
    </head><body><article><h1>正文标题</h1><p>这是正文第一段，内容足够长，供 Readability 判断文章主体并生成正文预览。</p><p>这是正文第二段，自动提取结果只进入预览，仍然需要用户确认之后才会保存。</p></article>
    <script>globalThis.__shouldNeverRun = true</script></body></html>`);
  });
  t.after(fixture.close);
  const preview = await extractLinkPreview(fixture.url, { allowPrivate: true });
  assert.equal(preview.title, "页面标题");
  assert.equal(preview.author, "桃子");
  assert.equal(preview.publisher, "桃子工作室");
  assert.match(preview.description, /网页摘要/);
  assert.equal(preview.image, `${fixture.url}/cover.jpg`);
  assert.match(preview.textContent, /确认之后才会保存/);
  assert.equal(globalThis.__shouldNeverRun, undefined);
});

test("falls back to hostname when a page has no title", async (t) => {
  const fixture = await fixtureServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.end("<html><body><p>没有标题的短页面</p></body></html>");
  });
  t.after(fixture.close);
  const preview = await extractLinkPreview(fixture.url, { allowPrivate: true });
  assert.equal(preview.title, "127.0.0.1");
});

test("rejects non-html, oversized and timed-out responses", async (t) => {
  const fixture = await fixtureServer((req, res) => {
    if (req.url === "/json") {
      res.setHeader("Content-Type", "application/json");
      return res.end("{}");
    }
    if (req.url === "/large") {
      res.setHeader("Content-Type", "text/html");
      return res.end("<p>" + "x".repeat(200) + "</p>");
    }
    setTimeout(() => {
      res.setHeader("Content-Type", "text/html");
      res.end("<p>late</p>");
    }, 100);
  });
  t.after(fixture.close);
  await assert.rejects(extractLinkPreview(`${fixture.url}/json`, { allowPrivate: true }), /不是可解析的网页/);
  await assert.rejects(extractLinkPreview(`${fixture.url}/large`, { allowPrivate: true, maxPageBytes: 64 }), /网页内容过大/);
  await assert.rejects(extractLinkPreview(`${fixture.url}/slow`, { allowPrivate: true, timeoutMs: 20 }), /网页读取超时/);
});

test("blocks localhost, private addresses and credential-bearing URLs", async () => {
  assert.equal(isPrivateAddress("127.0.0.1"), true);
  assert.equal(isPrivateAddress("10.0.0.1"), true);
  assert.equal(isPrivateAddress("169.254.169.254"), true);
  assert.equal(isPrivateAddress("::1"), true);
  assert.equal(isPrivateAddress("8.8.8.8"), false);
  await assert.rejects(extractLinkPreview("http://127.0.0.1/"), /本机或内部网络/);
  await assert.rejects(extractLinkPreview("https://user:pass@example.com/"), /不能包含账号或密码/);
});
