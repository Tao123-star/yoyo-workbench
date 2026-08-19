const PLATFORM_HOSTS = {
  douyin: ["douyin.com"],
  xiaohongshu: ["xiaohongshu.com"]
};

const METRIC_KEYS = [
  "exposures", "views", "likes", "comments", "saves", "shares",
  "followers", "followerGain", "visitors", "coverClickRate", "completionRate"
];

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanMetric(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(number, 1_000_000_000_000);
}

function cleanDate(value) {
  const text = cleanText(value, 32);
  const match = text.match(/^(\d{4}-\d{2}-\d{2})(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/);
  return match ? text : "";
}

function cleanSourceUrl(value, platform) {
  const text = cleanText(value, 1000);
  if (!text) return "";
  let url;
  try { url = new URL(text); } catch { return ""; }
  if (url.protocol !== "https:") return "";
  const hosts = PLATFORM_HOSTS[platform] || [];
  if (!hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) return "";
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function cleanMetrics(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const metrics = {};
  for (const key of METRIC_KEYS) metrics[key] = cleanMetric(source[key]);
  return metrics;
}

export function sanitizePlatformSnapshot(input, now = Date.now()) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("平台数据格式不正确");
  const platform = cleanText(input.platform, 20).toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(PLATFORM_HOSTS, platform)) throw new Error("暂不支持这个平台");
  if (!Array.isArray(input.works) || input.works.length > 100) throw new Error("作品数据最多保留 100 条");
  const works = input.works.map((work, index) => {
    const title = cleanText(work && work.title, 200);
    if (!title) throw new Error(`第 ${index + 1} 条作品缺少标题`);
    return {
      id: cleanText(work.id, 160) || `${platform}-${index + 1}`,
      title,
      publishedAt: cleanDate(work.publishedAt),
      duration: cleanText(work.duration, 20),
      sourceUrl: cleanSourceUrl(work.sourceUrl, platform),
      metrics: cleanMetrics(work.metrics)
    };
  });
  const syncedAt = Number(input.syncedAt);
  return {
    platform,
    accountName: cleanText(input.accountName, 80),
    period: cleanText(input.period, 80),
    syncedAt: Number.isFinite(syncedAt) && syncedAt > 0 && syncedAt <= now + 5 * 60 * 1000 ? syncedAt : now,
    summary: cleanMetrics(input.summary),
    works
  };
}

export function platformLabel(platform) {
  return platform === "douyin" ? "抖音" : platform === "xiaohongshu" ? "小红书" : platform;
}
