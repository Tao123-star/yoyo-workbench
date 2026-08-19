const PLATFORM_HOSTS = {
  douyin: new Set(["creator.douyin.com", "www.douyin.com", "douyin.com", "www.iesdouyin.com"]),
  xiaohongshu: new Set(["creator.xiaohongshu.com", "www.xiaohongshu.com", "xiaohongshu.com"])
};

export function chinaDay(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normalizePlatformUrl(value, platform) {
  let parsed;
  try { parsed = new URL(String(value || "")); } catch { throw new Error("平台来源链接格式不正确"); }
  if (parsed.protocol !== "https:" || !PLATFORM_HOSTS[platform]?.has(parsed.hostname.toLowerCase())) {
    throw new Error(`来源链接不是${platform === "douyin" ? "抖音" : "小红书"}平台`);
  }
  parsed.username = "";
  parsed.password = "";
  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function normalizeRows(rows, platform, capturedAt) {
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 10) {
    throw new Error(`${platform === "douyin" ? "抖音" : "小红书"}平台信号需要 1–10 条`);
  }
  const prefix = platform === "douyin" ? "dy" : "xhs";
  return rows.map((row, index) => {
    const title = cleanText(row.title, 100);
    const signalTitle = cleanText(row.signalTitle || row.title, 120);
    const angle = cleanText(row.angle, 220);
    if (!title || !signalTitle || !angle) throw new Error("平台信号缺少标题或创作角度");
    return {
      id: `${prefix}-platform-${chinaDay(new Date(capturedAt))}-${index + 1}`,
      title,
      angle,
      signalTitle,
      sourceName: platform === "douyin" ? "抖音" : "小红书",
      sourceType: cleanText(row.sourceType || (platform === "douyin" ? "创作者中心" : "站内 AI 内容"), 40),
      sourceUrl: normalizePlatformUrl(row.sourceUrl, platform),
      metric: cleanText(row.metric, 60),
      capturedAt
    };
  });
}

export function buildPlatformSnapshot({ douyin, xiaohongshu, now = new Date() }) {
  const capturedAt = now.getTime();
  return {
    updatedAt: chinaDay(now),
    generatedAt: capturedAt,
    source: "抖音创作者中心 + 小红书站内 AI 内容",
    official: false,
    sourceNative: true,
    collectionMode: "authenticated-platform-snapshot",
    stale: false,
    douyin: normalizeRows(douyin, "douyin", capturedAt),
    xiaohongshu: normalizeRows(xiaohongshu, "xiaohongshu", capturedAt)
  };
}
