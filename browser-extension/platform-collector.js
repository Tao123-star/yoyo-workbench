(function () {
  "use strict";

  function number(value) {
    var text = String(value || "").replace(/,/g, "").trim();
    var match = text.match(/-?\d+(?:\.\d+)?/);
    if (!match) return 0;
    var result = Number(match[0]);
    if (/亿/.test(text)) result *= 100000000;
    else if (/万/.test(text)) result *= 10000;
    else if (/[kK]/.test(text)) result *= 1000;
    return Math.max(0, Math.round(result));
  }

  function sumWorks(works) {
    return works.reduce(function (total, work) {
      Object.keys(work.metrics || {}).forEach(function (key) { total[key] = (total[key] || 0) + number(work.metrics[key]); });
      return total;
    }, { views: 0, likes: 0, comments: 0, saves: 0, shares: 0 });
  }

  function stableId(prefix, values) {
    var text = values.join("|");
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return prefix + "-" + (hash >>> 0).toString(16);
  }

  function xhsId(card, index) {
    var raw = card.getAttribute("data-impression") || "";
    var match = raw.match(/noteId[^a-z0-9]+([a-z0-9]{12,})/i);
    return match ? match[1] : "xhs-" + index;
  }

  async function loadXhsCards() {
    var oldTop = window.scrollY;
    var previous = 0;
    for (var attempt = 0; attempt < 5; attempt += 1) {
      var count = document.querySelectorAll(".note-card").length;
      if (count >= 50 || (attempt > 1 && count === previous)) break;
      previous = count;
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise(function (resolve) { setTimeout(resolve, 900); });
    }
    window.scrollTo(0, oldTop);
  }

  async function collectXhs() {
    var bodyText = document.body ? document.body.innerText : "";
    if (/扫码登录|验证码登录|登录创作服务平台/.test(bodyText)) throw new Error("登录已失效，请重新登录创作者后台");
    await loadXhsCards();
    var cards = Array.from(document.querySelectorAll(".note-card")).slice(0, 100);
    if (!cards.length) throw new Error("没有读取到作品，请打开“笔记管理”后重试");
    var works = cards.map(function (card) {
      var stats = Array.from(card.querySelectorAll(".note-card__stat")).map(function (node) { return number(node.textContent); });
      var id = xhsId(card, index);
      return {
        id: id,
        title: (card.querySelector(".note-card__title") || {}).textContent || "未命名笔记",
        publishedAt: (card.querySelector(".note-card__time") || {}).textContent || "",
        duration: (card.querySelector(".play_time") || {}).textContent || "",
        sourceUrl: /^[a-z0-9]{12,}$/i.test(id) ? "https://www.xiaohongshu.com/explore/" + id : "",
        metrics: { views: stats[0] || 0, comments: stats[1] || 0, likes: stats[2] || 0, saves: stats[3] || 0, shares: stats[4] || 0 }
      };
    });
    var accountNode = document.querySelector('[class*="user-name"], [class*="account-name"], [class*="nickname"]');
    return { platform: "xiaohongshu", accountName: accountNode ? accountNode.textContent.trim() : "桃子的小红书", period: "最近作品", syncedAt: Date.now(), summary: sumWorks(works), works: works };
  }

  function normalizeDouyinDate(value) {
    var text = String(value || "").trim();
    var match = text.match(/(\d{4})\s*[年\/.\-]\s*(\d{1,2})\s*[月\/.\-]\s*(\d{1,2})(?:\s*日)?(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!match) return "";
    function pad(part) { return String(part || "0").padStart(2, "0"); }
    return match[1] + "-" + pad(match[2]) + "-" + pad(match[3]) + (match[4] ? " " + pad(match[4]) + ":" + pad(match[5]) : "");
  }

  function douyinCardNodes() {
    var exact = Array.from(document.querySelectorAll("[class*='video-card-new-'], [class*='video-card-v2-']"));
    if (exact.length) return exact;
    var selectors = ["[class*='content-card']", "[class*='work-card']", "[class*='manage-item']", "[class*='content-item']"];
    var candidates = [];
    selectors.forEach(function (selector) { candidates = candidates.concat(Array.from(document.querySelectorAll(selector))); });
    return candidates.filter(function (node, index, list) {
      var text = (node.innerText || "").trim();
      return text.length > 8 && /\d{4}\s*[年\/.\-]\s*\d{1,2}\s*[月\/.\-]\s*\d{1,2}/.test(text) && list.indexOf(node) === index;
    });
  }

  async function loadDouyinCards() {
    var scroller = document.querySelector("[class*='list-scroll-']");
    if (!scroller) return;
    var oldTop = scroller.scrollTop;
    var previous = 0;
    var unchanged = 0;
    for (var attempt = 0; attempt < 8; attempt += 1) {
      var count = douyinCardNodes().length;
      if (count >= 100 || unchanged >= 2) break;
      unchanged = count === previous ? unchanged + 1 : 0;
      previous = count;
      scroller.scrollTop = scroller.scrollHeight;
      await new Promise(function (resolve) { setTimeout(resolve, 900); });
    }
    scroller.scrollTop = oldTop;
  }

  function douyinMetricMap(card) {
    var metrics = { views: 0, likes: 0, comments: 0, saves: 0, shares: 0 };
    var keys = { "播放": "views", "点赞": "likes", "评论": "comments", "收藏": "saves", "分享": "shares" };
    Array.from(card.querySelectorAll("[class*='metric-label-']")).forEach(function (label) {
      var key = keys[(label.textContent || "").trim()];
      if (!key || !label.parentElement) return;
      var value = label.parentElement.querySelector("[class*='metric-value-']");
      if (value) metrics[key] = number(value.textContent);
    });
    return metrics;
  }

  async function collectDouyin() {
    var bodyText = document.body ? document.body.innerText : "";
    if (/扫码登录|验证码登录|密码登录/.test(bodyText)) throw new Error("登录已失效，请重新登录创作者后台");
    await loadDouyinCards();
    var cards = douyinCardNodes().slice(0, 100);
    if (!cards.length) throw new Error("没有读取到作品，抖音页面结构可能已更新");
    var works = cards.map(function (card, index) {
      var lines = (card.innerText || "").split("\n").map(function (line) { return line.trim(); }).filter(Boolean);
      var dateText = ((card.querySelector("[class*='info-time-']") || {}).textContent || lines.find(function (line) { return /\d{4}\s*[年\/.\-]\s*\d{1,2}\s*[月\/.\-]\s*\d{1,2}/.test(line); }) || "").trim();
      var titleNode = card.querySelector("[class*='info-title-text-']");
      var title = (titleNode ? titleNode.textContent : "").trim() || "未命名作品";
      var duration = lines.find(function (line) { return /^\d{1,2}:\d{2}(?::\d{2})?$/.test(line); }) || "";
      var publishedAt = normalizeDouyinDate(dateText);
      return { id: stableId("douyin", [title, publishedAt]), title: title, publishedAt: publishedAt, duration: duration, sourceUrl: "", metrics: douyinMetricMap(card) };
    });
    var accountNode = document.querySelector('[class*="nickname"], [class*="user-name"], [class*="account-name"]');
    return { platform: "douyin", accountName: accountNode ? accountNode.textContent.trim() : "桃子的抖音", period: "最近作品", syncedAt: Date.now(), summary: sumWorks(works), works: works };
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || message.type !== "YOYO_COLLECT_PLATFORM") return;
    var collect = location.hostname === "creator.xiaohongshu.com" ? collectXhs : collectDouyin;
    Promise.resolve().then(collect).then(function (snapshot) {
      sendResponse({ ok: true, snapshot: snapshot });
    }).catch(function (error) {
      sendResponse({ ok: false, error: error.message || "平台数据读取失败" });
    });
    return true;
  });
})();
