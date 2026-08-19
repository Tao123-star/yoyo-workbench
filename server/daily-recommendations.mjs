const DAY_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 9_000;

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

function cleanText(value, maxLength = 80) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeKey(value) {
  return cleanText(value, 200).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
}

function parseGithub(payload) {
  return (payload?.items || []).map((item) => ({
    title: cleanText(item.full_name || item.name),
    description: cleanText(item.description, 160),
    sourceName: "GitHub",
    sourceUrl: item.html_url,
    score: Number(item.stargazers_count) || 0
  })).filter((item) => item.title && /^https:\/\/github\.com\//i.test(String(item.sourceUrl || "")));
}

function parseHackerNews(payload) {
  return (payload?.hits || []).map((item) => ({
    title: cleanText(item.title || item.story_title),
    description: "",
    sourceName: "Hacker News",
    sourceUrl: item.url || item.story_url || (item.objectID ? `https://news.ycombinator.com/item?id=${item.objectID}` : ""),
    score: Number(item.points) || 0
  })).filter((item) => item.title && /^https?:\/\//i.test(String(item.sourceUrl || "")));
}

async function fetchJson(fetchImpl, url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "YOYO-Workbench/1.0 (+https://workbench.taozipipi.cn)"
      }
    });
    if (!response.ok) throw new Error(`signal source returned ${response.status}`);
    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

function uniqueSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = normalizeKey(signal.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((left, right) => right.score - left.score);
}

const DOUYIN_TEMPLATES = [
  (topic) => `实测 ${topic}：普通人现在能用它做什么`,
  (topic) => `${topic} 火了，我用一个真实任务验证它`,
  (topic) => `别只看发布消息：${topic} 到底好不好用`,
  (topic) => `${topic} 现场上手，3 分钟看懂核心变化`,
  (topic) => `我把 ${topic} 放进工作流，结果怎么样`,
  (topic) => `${topic} 能省哪一步？完整录屏告诉你`,
  (topic) => `零基础第一次用 ${topic}，踩了哪些坑`,
  (topic) => `${topic} 前后对比：效率真的提升了吗`,
  (topic) => `今天值得关注的 AI 信号：${topic}`,
  (topic) => `${topic} 值不值得学？先看这次实测`
];

const XHS_TEMPLATES = [
  (topic) => `${topic} 上手笔记｜适合自媒体人的 3 个用法`,
  (topic) => `我实测了 ${topic}，整理成一份避坑清单`,
  (topic) => `${topic} 新手教程：从安装到第一个结果`,
  (topic) => `关于 ${topic}，发布消息里没说清的细节`,
  (topic) => `${topic} 工作流复盘｜步骤、耗时与失败点`,
  (topic) => `非程序员看懂 ${topic}：一张清单讲明白`,
  (topic) => `${topic} 真实体验：哪些人适合、哪些人不适合`,
  (topic) => `用 ${topic} 做内容，我保留了这套可复制模板`,
  (topic) => `今天的 AI 行业信号：${topic} 值得关注吗`,
  (topic) => `${topic} 实测对比｜效果、成本、学习门槛`
];

function makeRows(signals, platform, day) {
  const templates = platform === "douyin" ? DOUYIN_TEMPLATES : XHS_TEMPLATES;
  return signals.slice(0, 10).map((signal, index) => ({
    id: `${platform === "douyin" ? "dy" : "xhs"}-daily-${day}-${index + 1}`,
    title: templates[index](cleanText(signal.title, 54)),
    angle: platform === "douyin"
      ? `围绕“${cleanText(signal.title, 48)}”录屏验证，展示实际结果、失败点和结论。`
      : `围绕“${cleanText(signal.title, 48)}”整理步骤、适用人群和可复制清单。`,
    signalTitle: signal.title,
    sourceName: signal.sourceName,
    sourceUrl: signal.sourceUrl
  }));
}

export function buildRecommendationsFromSignals(inputSignals, day = chinaDay()) {
  const signals = uniqueSignals(inputSignals);
  if (signals.length < 10) throw new Error("not enough verified public signals");
  const used = signals.slice(0, 10);
  const sourceNames = [...new Set(used.map((signal) => signal.sourceName))];
  return {
    updatedAt: day,
    generatedAt: Date.now(),
    source: `公开 AI 行业信号：${sourceNames.join(" + ")}`,
    official: false,
    stale: false,
    douyin: makeRows(used, "douyin", day),
    xiaohongshu: makeRows(used, "xiaohongshu", day)
  };
}

export async function buildDailyRecommendations({ fetchImpl = fetch, now = new Date() } = {}) {
  const since = new Date(now.getTime() - 7 * DAY_MS).toISOString().slice(0, 10);
  const githubUrl = "https://api.github.com/search/repositories?" + new URLSearchParams({
    q: `AI in:name,description created:>=${since}`,
    sort: "stars",
    order: "desc",
    per_page: "30"
  });
  const hackerNewsUrl = "https://hn.algolia.com/api/v1/search_by_date?" + new URLSearchParams({
    query: "AI",
    tags: "story",
    numericFilters: "points>2",
    hitsPerPage: "40"
  });
  const results = await Promise.allSettled([
    fetchJson(fetchImpl, githubUrl).then(parseGithub),
    fetchJson(fetchImpl, hackerNewsUrl).then(parseHackerNews)
  ]);
  const signals = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  return buildRecommendationsFromSignals(signals, chinaDay(now));
}
