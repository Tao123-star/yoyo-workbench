/* ============================================================
   桃子工作台数据层 — 空白初始数据 + 云端同步
   localStorage 作为当前设备快取缓存，线上账号的业务数据以云端为准。
   ============================================================ */
window.YOYO = window.YOYO || {};

(function () {
  "use strict";

  var LS = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem("yoyo_" + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, val) {
      try {
        var storageKey = "yoyo_" + key;
        localStorage.setItem(storageKey, JSON.stringify(val));
        if (YOYO.cloud) YOYO.cloud.saveKey(storageKey, val);
      } catch (e) {}
    },
    remove: function (key) {
      try {
        var storageKey = "yoyo_" + key;
        localStorage.removeItem(storageKey);
        if (YOYO.cloud) YOYO.cloud.saveKey(storageKey, null);
      } catch (e) {}
    }
  };

  /* 业务模块默认保持为空，避免把展示内容误认为真实数据。 */
  var topics = [];
  var contents = LS.get("contents", []);
  var publishMasters = [];
  var assets = [];
  var clients = LS.get("clients", []);
  var projects = [];
  var knowledge = [];
  var titleBank = [];
  var tasks = LS.get("tasks", []);
  var followClients = clients.filter(function (client) { return client.followAt; });
  var upcoming = LS.get("upcoming", []);
  var aiInsights = [];

  /* 平台热点只接受经登录页面核实的快照；没有快照时保持为空。 */
  var aiHotTopics = {
    updatedAt: "—",
    source: "等待已核实的平台热点",
    sourceNative: true,
    stale: true,
    douyin: [],
    xiaohongshu: []
  };

  var pipeline = [
    { key: "spark", label: "灵感", count: 0, color: "#F7A8C4" },
    { key: "ready", label: "待创作", count: 0, color: "#FFC93C" },
    { key: "creating", label: "创作中", count: 0, color: "#F89C3C" },
    { key: "scheduled", label: "待发布", count: 0, color: "#7FC4E8" },
    { key: "published", label: "已发布", count: 0, color: "#B5D951" }
  ];

  var stats = {
    weekPosts: 0,
    views: "0", viewsDelta: "",
    engagement: "0", engagementDelta: "",
    saves: "0", savesDelta: "",
    fans: "0", fansDelta: "",
    spark: [0, 0, 0, 0, 0, 0, 0],
    bars: [0, 0, 0, 0, 0, 0, 0],
    best: null
  };

  function persistBusinessData() {
    LS.set("contents", contents);
    LS.set("clients", clients);
    LS.set("tasks", tasks);
    LS.set("upcoming", upcoming);
  }

  function replaceList(target, next) {
    target.splice.apply(target, [0, target.length].concat(next));
  }

  function updateHomeSection(section, rows) {
    if (section === "tasks") replaceList(tasks, rows.map(function (row, i) {
      return { id: "task" + Date.now() + i, title: row.title, due: row.due || "", overdue: false };
    }));
    if (section === "upcoming") replaceList(upcoming, rows.map(function (row) {
      return { title: row.title, when: row.when || "" };
    }));
    if (section === "clients") {
      replaceList(clients, rows.map(function (row, i) {
        return { id: "client" + Date.now() + i, name: row.name, company: "", project: "", contact: "", stage: row.stage || "待跟进", price: "", lastTouch: "", nextAction: row.note || "", followAt: row.when || "" };
      }));
      replaceList(followClients, clients.filter(function (client) { return client.followAt || client.nextAction; }));
    }
    if (section === "creating" || section === "scheduled") {
      var statuses = section === "creating" ? ["draft", "ready"] : ["scheduled"];
      for (var i = contents.length - 1; i >= 0; i--) {
        if (statuses.indexOf(contents[i].status) > -1 && !contents[i].metrics) contents.splice(i, 1);
      }
      rows.forEach(function (row, i) {
        contents.push({ id: "content" + Date.now() + i, title: row.title, platform: row.platform || "未设置", status: section === "creating" ? "draft" : "scheduled", date: row.date || new Date().toISOString().slice(0, 10), format: "", grade: "", metrics: null, assetsReady: 0 });
      });
    }
    persistBusinessData();
    refreshStats();
  }

  function refreshStats() {
    var published = contents.filter(function (content) { return content.metrics; });
    var totals = published.reduce(function (sum, content) {
      sum.views += Number(content.metrics.views) || 0;
      sum.engagement += (Number(content.metrics.likes) || 0) + (Number(content.metrics.comments) || 0);
      sum.saves += Number(content.metrics.saves) || 0;
      sum.fans += Number(content.metrics.fans) || 0;
      return sum;
    }, { views: 0, engagement: 0, saves: 0, fans: 0 });
    stats.weekPosts = published.length;
    stats.views = String(totals.views);
    stats.engagement = String(totals.engagement);
    stats.saves = String(totals.saves);
    stats.fans = String(totals.fans);
    var best = published.slice().sort(function (a, b) { return b.metrics.views - a.metrics.views; })[0];
    stats.best = best ? { id: best.id, title: best.title, platform: best.platform, views: String(best.metrics.views), saves: String(best.metrics.saves || 0), fans: String(best.metrics.fans || 0) } : null;
    pipeline.forEach(function (item) {
      item.count = item.key === "spark" ? 0 : contents.filter(function (content) {
        if (item.key === "creating") return content.status === "draft" || content.status === "ready";
        return content.status === item.key;
      }).length;
    });
  }

  function importReviewRows(rows) {
    rows.forEach(function (row, i) {
      contents.push({
        id: "review" + Date.now() + i,
        title: row.title || row["内容标题"] || "未命名内容",
        platform: row.platform || row["平台"] || "未设置",
        status: "published",
        date: row.date || row["发布日期"] || new Date().toISOString().slice(0, 10),
        format: row.format || row["形式"] || "",
        grade: row.grade || row["等级"] || "",
        metrics: {
          views: Number(row.views || row["播放"] || 0), likes: Number(row.likes || row["点赞"] || 0),
          comments: Number(row.comments || row["评论"] || 0), saves: Number(row.saves || row["收藏"] || 0),
          fans: Number(row.fans || row["涨粉"] || 0)
        }
      });
    });
    persistBusinessData();
    refreshStats();
    return rows.length;
  }

  refreshStats();

  function getExtraTopics() { return LS.get("topics_extra", []); }
  function getIgnored() { return LS.get("ignored_topics", []); }
  function getCaptures() { return LS.get("captures", []); }
  function firstDraftLine(value, maxLength) {
    var lines = String(value || "").split(/\n+/).map(function (line) { return line.trim(); }).filter(Boolean);
    return (lines[0] || "").slice(0, maxLength || 120);
  }
  function normalizeStudioDraft(draft) {
    var next = Object.assign({}, draft || {});
    var body = String(next.body || "").trim();
    var topic = String(next.topic || "").trim();
    var title = String(next.title || "").trim();
    var bodyCompact = body.replace(/\s+/g, " ");
    var topicCompact = topic.replace(/\s+/g, " ");
    if (body && topic && (topicCompact === bodyCompact || (topic.length > 240 && bodyCompact.indexOf(topicCompact.slice(0, 180)) === 0))) {
      next.topic = firstDraftLine(body, 120) || title || "未命名选题";
    }
    if (body && title && title.replace(/\s+/g, " ") === bodyCompact) {
      next.title = (String(next.topic || "").length <= 120 ? String(next.topic || "") : "") || firstDraftLine(body, 80) || "未命名初稿";
    }
    return next;
  }
  function getStudioDrafts() {
    var drafts = LS.get("studio_drafts", []);
    var normalized = drafts.map(normalizeStudioDraft);
    var changed = JSON.stringify(drafts) !== JSON.stringify(normalized);
    if (changed) LS.set("studio_drafts", normalized);
    return normalized;
  }
  function getStudioWorkingDraft() { return LS.get("studio_working_draft", null); }
  function getMyTitles() { return LS.get("titles", []); }
  function getSettings() { return LS.get("settings", { name: "桃子" }); }
  function getGhCache() { return LS.get("gh_cache", null); }
  function setGhCache(list) { LS.set("gh_cache", { list: list, ts: Date.now() }); }
  function getHotCache() { return LS.get("hot_cache", null); }
  function setAiHotTopics(payload) {
    if (!payload || !payload.sourceNative || !Array.isArray(payload.douyin) || !Array.isArray(payload.xiaohongshu) ||
        payload.douyin.length < 1 || payload.douyin.length > 10 || payload.xiaohongshu.length < 1 || payload.xiaohongshu.length > 10) return false;
    Object.keys(aiHotTopics).forEach(function (key) { delete aiHotTopics[key]; });
    Object.assign(aiHotTopics, payload);
    LS.set("hot_cache", payload);
    return true;
  }

  function extractSharedUrl(value) {
    var text = String(value || "").trim();
    if (!text) return "";
    var match = text.match(/https?:\/\/[^\s<>"'，。；！？、）】》,;!?)}\]]+/i);
    if (!match) match = text.match(/(?:v\.douyin\.com|xhslink\.com|b23\.tv)\/[^\s<>"'，。；！？、）】》,;!?)}\]]+/i);
    if (!match) return "";
    var candidate = match[0].replace(/[),.;!?，。；！？）】》]+$/g, "");
    if (!/^https?:\/\//i.test(candidate)) candidate = "https://" + candidate;
    try {
      var parsed = new URL(candidate);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
    } catch (error) { return ""; }
  }

  function saveTopic(topic) {
    var extra = getExtraTopics();
    var existing = extra.filter(function (x) { return x.id === topic.id || (x.title || "").trim() === (topic.title || "").trim(); })[0];
    if (existing) return existing;
    var next = {
      id: topic.id,
      title: topic.title,
      source: topic.source || "手动添加",
      heat: topic.heat || "",
      tags: topic.tags || [],
      url: topic.url || "",
      summary: (topic.analysis && topic.analysis.summary) || topic.summary || "",
      angle: topic.analysis ? topic.analysis.angle : (topic.angle || ""),
      platforms: topic.analysis ? topic.analysis.platforms : (topic.platforms || []),
      scores: topic.analysis ? topic.analysis.scores : (topic.scores || null),
      starsN: topic.analysis ? topic.analysis.starsN : (topic.stars || 0),
      status: "watching",
      savedAt: Date.now()
    };
    extra.unshift(next);
    LS.set("topics_extra", extra);
    return next;
  }
  function removeTopic(id) {
    LS.set("topics_extra", getExtraTopics().filter(function (x) { return x.id !== id; }));
  }
  function isTopicSaved(id) {
    return getExtraTopics().some(function (x) { return x.id === id; });
  }
  function ignoreTopic(id) {
    var ignored = getIgnored();
    if (ignored.indexOf(id) === -1) ignored.push(id);
    LS.set("ignored_topics", ignored);
  }
  function saveCapture(input, routedTo, imageData) {
    var captures = getCaptures();
    var now = Date.now();
    var source = typeof input === "string" ? { text: input, title: input } : (input || {});
    var next = {
      id: source.id || "cap" + now,
      text: source.text || source.content || source.title || "",
      title: source.title || source.text || "未命名记录",
      type: source.type || (routedTo === "asset" ? "网站" : "灵感"),
      platform: source.platform || "",
      url: source.url || "",
      content: source.content || "",
      author: source.author || "",
      publisher: source.publisher || "",
      publishedAt: source.publishedAt || "",
      description: source.description || "",
      coverImage: source.coverImage || "",
      note: source.note || "",
      tags: Array.isArray(source.tags) ? source.tags : [],
      routedTo: source.routedTo || routedTo || "idea",
      fav: !!source.fav,
      createdAt: now,
      updatedAt: now
    };
    if (imageData) {
      next.imageKey = "capture_image_" + next.id;
      LS.set(next.imageKey, imageData);
    }
    captures.unshift(next);
    LS.set("captures", captures);
    return next;
  }
  function getCaptureImage(imageKey) { return imageKey ? LS.get(imageKey, "") : ""; }
  function saveStudioDraft(draft) {
    var drafts = getStudioDrafts();
    var now = Date.now();
    var next = normalizeStudioDraft({
      id: draft.id || "draft" + now,
      topicId: draft.topicId || "",
      topic: draft.topic || "",
      title: draft.title || "",
      body: draft.body || "",
      douyin: draft.douyin || "",
      xiaohongshu: draft.xiaohongshu || "",
      wechatChannels: draft.wechatChannels || "",
      coverTitle: draft.coverTitle || "",
      coverSubtitle: draft.coverSubtitle || "",
      coverBrief: draft.coverBrief || "",
      updatedAt: now
    });
    var index = drafts.findIndex(function (item) { return item.id === next.id; });
    if (index > -1) drafts[index] = next;
    else drafts.unshift(next);
    LS.set("studio_drafts", drafts);
    var linkedContent = getContentByDraftId(next.id);
    if (linkedContent) {
      linkedContent.topicId = next.topicId;
      linkedContent.title = next.title || next.topic || "未命名内容";
      linkedContent.updatedAt = now;
      persistBusinessData();
      refreshStats();
    }
    return next;
  }
  function getContentByDraftId(draftId) {
    return contents.filter(function (content) { return content.draftId === draftId; })[0] || null;
  }
  function promoteDraftToContent(draftId) {
    var draft = getStudioDrafts().filter(function (item) { return item.id === draftId; })[0];
    if (!draft) return null;
    var existing = getContentByDraftId(draftId);
    var now = Date.now();
    if (existing) {
      existing.topicId = draft.topicId || "";
      existing.title = draft.title || draft.topic || "未命名内容";
      existing.updatedAt = now;
    } else {
      existing = {
        id: "content" + now,
        topicId: draft.topicId || "",
        draftId: draft.id,
        title: draft.title || draft.topic || "未命名内容",
        platform: "多平台",
        status: "draft",
        date: new Date().toISOString().slice(0, 10),
        format: "",
        grade: "",
        metrics: null,
        assetsReady: 0,
        createdAt: now,
        updatedAt: now
      };
      contents.unshift(existing);
    }
    persistBusinessData();
    refreshStats();
    return existing;
  }
  function updateContentStatus(contentId, status, patch) {
    var allowed = {
      draft: ["ready"],
      ready: ["draft", "scheduled"],
      scheduled: ["ready", "published"],
      published: []
    };
    var content = contents.filter(function (item) { return item.id === contentId; })[0];
    if (!content || !allowed[content.status] || allowed[content.status].indexOf(status) === -1) return null;
    Object.keys(patch || {}).forEach(function (key) { content[key] = patch[key]; });
    content.status = status;
    content.updatedAt = Date.now();
    if (status === "published" && !content.metrics) {
      content.metrics = { views: 0, likes: 0, comments: 0, saves: 0, fans: 0 };
    }
    persistBusinessData();
    refreshStats();
    return content;
  }
  function saveContentChanges() {
    persistBusinessData();
    refreshStats();
  }
  function removeStudioDraft(id) {
    LS.set("studio_drafts", getStudioDrafts().filter(function (draft) { return draft.id !== id; }));
  }
  function saveStudioWorkingDraft(draft) {
    var copy = Object.assign({}, draft, { workingCopy: true, autosavedAt: Date.now() });
    LS.set("studio_working_draft", copy);
    return copy;
  }
  function clearStudioWorkingDraft() { LS.remove("studio_working_draft"); }
  function saveTitle(title) {
    var titles = getMyTitles();
    titles.unshift(title);
    LS.set("titles", titles);
  }
  function saveSettings(settings) { LS.set("settings", settings); }
  function exportAll() {
    var dump = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("yoyo_") === 0) dump[key] = LS.get(key.slice(5), null);
    }
    return JSON.stringify(dump, null, 2);
  }
  function clearAll() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("yoyo_") === 0) keys.push(key);
    }
    keys.forEach(function (key) { localStorage.removeItem(key); });
    if (YOYO.cloud) YOYO.cloud.clearAll().catch(function () {});
  }
  function syncNow() {
    return YOYO.cloud ? YOYO.cloud.syncAll() : Promise.resolve();
  }

  YOYO.data = {
    topics: topics,
    contents: contents,
    publishMasters: publishMasters,
    assets: assets,
    clients: clients,
    projects: projects,
    knowledge: knowledge,
    titleBank: titleBank,
    pipeline: pipeline,
    tasks: tasks,
    followClients: followClients,
    upcoming: upcoming,
    stats: stats,
    aiInsights: aiInsights,
    aiHotTopics: aiHotTopics,
    getIgnored: getIgnored,
    getCaptures: getCaptures,
    getStudioDrafts: getStudioDrafts,
    getStudioWorkingDraft: getStudioWorkingDraft,
    getMyTitles: getMyTitles,
    getSettings: getSettings,
    getGhCache: getGhCache,
    setGhCache: setGhCache,
    getHotCache: getHotCache,
    setAiHotTopics: setAiHotTopics,
    extractSharedUrl: extractSharedUrl,
    saveTopic: saveTopic,
    removeTopic: removeTopic,
    isTopicSaved: isTopicSaved,
    ignoreTopic: ignoreTopic,
    saveCapture: saveCapture,
    getCaptureImage: getCaptureImage,
    saveStudioDraft: saveStudioDraft,
    getContentByDraftId: getContentByDraftId,
    promoteDraftToContent: promoteDraftToContent,
    updateContentStatus: updateContentStatus,
    saveContentChanges: saveContentChanges,
    removeStudioDraft: removeStudioDraft,
    saveStudioWorkingDraft: saveStudioWorkingDraft,
    clearStudioWorkingDraft: clearStudioWorkingDraft,
    saveTitle: saveTitle,
    saveSettings: saveSettings,
    exportAll: exportAll,
    clearAll: clearAll,
    syncNow: syncNow,
    getExtraTopics: getExtraTopics,
    updateHomeSection: updateHomeSection,
    importReviewRows: importReviewRows
  };
})();
