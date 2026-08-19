/* ============================================================
   桃子工作台 — 路由 + 视图 + 交互（混合数据原型）
   ============================================================ */
(function () {
  "use strict";
  var D = YOYO.data;

  /* ============ 图标（内联 SVG，无 emoji） ============ */
  var ICONS = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    media: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l5 2.5-5 2.5z"/>',
    studio: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    assets: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    analytics: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    clients: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c2.8.4 5 2.7 5 5.5"/>',
    projects: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
    knowledge: '<path d="M4 19V5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19a2 2 0 002 2h13"/>',
    ai: '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14 3h-4l-.5 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2L10 21h4l.5-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
    sparkle: '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M18.5 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M7 14l5-5 5 5"/>',
    down: '<path d="M7 10l5 5 5-5"/>',
    flat: '<path d="M6 12h12"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    zap: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/>',
    board: '<path d="M5 4h4v16H5zM10.5 4h4v10h-4zM16 4h4v13h-4z"/>',
    heart: '<path d="M12 20s-7-4.3-9.3-8.5C1 8 3 5 6.5 5c2 0 3.5 1 4.5 2.5C12 6 13.5 5 15.5 5 19 5 21 8 19.3 11.5 17 15.7 12 20 12 20z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.5 9A7 7 0 006.4 6.4L4 9M5.5 15A7 7 0 0017.6 17.6L20 15"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>',
    file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/>',
    music: '<circle cx="7" cy="18" r="3"/><path d="M10 18V5l9-2v12"/><circle cx="16" cy="15" r="3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    message: '<path d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }
  function hydrateIcons(root) {
    var nodes = (root || document).querySelectorAll("[data-icon]");
    for (var i = 0; i < nodes.length; i++) nodes[i].innerHTML = icon(nodes[i].getAttribute("data-icon"));
  }

  /* ============ YOYO 吉祥物（已渲染校验） ============ */
  var MASCOT = '<svg viewBox="0 0 120 120" fill="none">' +
    '<path d="M33 80 L24 62" stroke="#7FC4E8" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M87 80 L96 62" stroke="#7FC4E8" stroke-width="3.5" stroke-linecap="round"/>' +
    '<ellipse cx="48" cy="110" rx="8.5" ry="5.5" fill="#2B2622"/>' +
    '<ellipse cx="72" cy="110" rx="8.5" ry="5.5" fill="#2B2622"/>' +
    '<path d="M60 56 L67.6 75.5 L88.5 76.7 L72.4 90 L77.6 110.3 L60 99 L42.4 110.3 L47.6 90 L31.5 76.7 L52.4 75.5 Z" fill="#FFC93C" stroke="#FFC93C" stroke-width="7" stroke-linejoin="round"/>' +
    '<circle cx="60" cy="42" r="27" fill="#F04E45"/>' +
    '<path d="M74 18 Q83 7 89 10 Q85 19 78 25 Z" fill="#F04E45"/>' +
    '<ellipse cx="60" cy="48" rx="20" ry="16" fill="#FFF1DE"/>' +
    '<circle cx="53" cy="47" r="2.8" fill="#2B2622"/>' +
    '<circle cx="67" cy="47" r="2.8" fill="#2B2622"/>' +
    '<circle cx="47" cy="53" r="1.2" fill="#F0A08E"/>' +
    '<circle cx="49.5" cy="55.5" r="1.2" fill="#F0A08E"/>' +
    '<circle cx="73" cy="53" r="1.2" fill="#F0A08E"/>' +
    '<circle cx="70.5" cy="55.5" r="1.2" fill="#F0A08E"/>' +
    '<text x="60" y="90" font-size="8.5" font-weight="800" fill="#F04E45" text-anchor="middle" font-family="sans-serif">YOYO</text>' +
    '<path d="M22 46 L24.3 51.7 L30.3 52 L25.9 55.6 L27.4 61.5 L22 58.3 L16.6 61.5 L18.1 55.6 L13.7 52 L19.7 51.7 Z" fill="#FFC93C" stroke="#FFC93C" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="22" cy="54" r="2.2" fill="#fff"/>' +
    '<path d="M98 46 L100.3 51.7 L106.3 52 L101.9 55.6 L103.4 61.5 L98 58.3 L92.6 61.5 L94.1 55.6 L89.7 52 L95.7 51.7 Z" fill="#FFC93C" stroke="#FFC93C" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="98" cy="54" r="2.2" fill="#fff"/>' +
    "</svg>";
  function hydrateMascots(root) {
    var nodes = (root || document).querySelectorAll("[data-mascot]");
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].innerHTML) nodes[i].innerHTML = '<img src="assets/yoyo-avatar.png" alt="YOYO">';
    }
  }

  /* ============ 导航 ============ */
  var NAV = [
    { route: "today",     num: "01", label: "首页",    icon: "today", mobileYoyo: "yoyo-blue.png" },
    { route: "studio",    num: "02", label: "创作",    icon: "studio", mobileYoyo: "yoyo-orange.png" },
    { route: "media",     num: "03", label: "自媒体",  icon: "media", mobileYoyo: "yoyo-green.png" },
    { route: "assets",    num: "04", label: "素材",    icon: "assets", mobileYoyo: "yoyo-group.png" }
  ];
  var TITLES = { today: "首页", media: "自媒体中心", studio: "AI 创作台", assets: "素材库", calendar: "内容日历", knowledge: "知识库", ai: "AI 助手", settings: "设置" };

  /* 状态字典 */
  var CSTATUS = {
    idea: { label: "灵感", cls: "st-idea" }, draft: { label: "草稿", cls: "st-draft" },
    ready: { label: "就绪", cls: "st-ready" }, scheduled: { label: "已排期", cls: "st-scheduled" },
    published: { label: "已发布", cls: "st-published" }, review: { label: "复盘中", cls: "st-review" }
  };
  var TSTATUS = {
    spark: "灵感", watching: "观察中", ready: "准备创作", creating: "创作中",
    published: "已发布", hold: "暂缓", archived: "归档"
  };
  var TRACKS = ["全部", "AI", "AI Coding", "工具", "Agent", "开源项目", "个人实践", "知识管理", "效率", "行业观察"];
  var ASSET_TYPES = ["全部", "灵感", "知识", "内容链接", "网站", "图片", "文字", "视频", "截图", "文章", "GitHub", "数据", "案例", "BGM", "封面参考"];
  var ASSET_ICON = { "内容链接": "globe", "文字": "file", "图片": "image", "视频": "video", "截图": "image", "网站": "globe", "文章": "file", "GitHub": "file", "数据": "analytics", "案例": "bookmark", "BGM": "music", "封面参考": "image", "人物": "clients", "灵感": "zap" };
  var ASSET_COLOR = { "内容链接": "#F04E45", "文字": "#F89C3C", "灵感": "#FFC93C", "知识": "#7FC4E8", "图片": "#F7A8C4", "视频": "#7FC4E8", "截图": "#F89C3C", "网站": "#B5D951", "文章": "#7FC4E8", "GitHub": "#2B2622", "数据": "#FFC93C", "案例": "#F04E45", "BGM": "#F7A8C4", "封面参考": "#F89C3C" };

  /* 视图内状态 */
  var S = { mediaTab: "overview", topicView: "card", topicFilter: "全部", discoverFilter: "全部", discoverSource: "picked", hotPlatform: "douyin", assetView: "grid", assetType: "全部", assetSearch: "", calMode: "month", studioTab: "create", studioStep: 0, favOnly: false };

  /* ============ GitHub Trending 实时信源 ============ */
  var GH = { list: [], ts: 0, loading: false, error: null, loaded: false };
  var HOT = { loading: false, attempted: false, stale: false, error: "", lastCheckedAt: 0 };
  var PA = { loaded: false, loading: false, syncing: false, error: "", updatedAt: 0, platforms: {} };
  var initialHotCache = D.getHotCache();
  if (initialHotCache) {
    D.setAiHotTopics(initialHotCache);
    HOT.stale = !!initialHotCache.stale;
  }

  function chinaToday() {
    var parts = new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    function value(type) {
      var match = parts.filter(function (part) { return part.type === type; })[0];
      return match ? match.value : "";
    }
    return value("year") + "-" + value("month") + "-" + value("day");
  }

  function ensureDailyHotTopics(force) {
    if (HOT.loading) return Promise.resolve(null);
    if (!force && HOT.attempted) return Promise.resolve(null);
    if (!force && D.aiHotTopics.updatedAt === chinaToday() && !D.aiHotTopics.stale) {
      HOT.attempted = true;
      return Promise.resolve(D.aiHotTopics);
    }
    HOT.loading = true;
    HOT.attempted = true;
    if (currentRoute() === "today") render();
    var endpoint = "/api/recommendations" + (force ? "?refresh=" + Date.now() : "");
    return fetch(endpoint, { credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status === 401 ? "登录已失效" : "今日推荐暂时无法更新");
        return response.json();
      })
      .then(function (payload) {
        if (!D.setAiHotTopics(payload)) throw new Error("推荐数据格式不正确");
        HOT.loading = false;
        HOT.stale = !!payload.stale;
        HOT.error = "";
        HOT.lastCheckedAt = Date.now();
        if (currentRoute() === "today") render();
        if (force) {
          toast(payload.stale || payload.updatedAt !== chinaToday()
            ? "已检查，云端暂无当天新数据，继续显示最近一次已核实内容"
            : "热点已刷新到今日最新平台快照");
        }
        return payload;
      })
      .catch(function (error) {
        HOT.loading = false;
        HOT.error = error.message || "今日推荐暂时无法更新";
        if (currentRoute() === "today") render();
        if (force) toast("刷新失败：" + HOT.error);
        return null;
      });
  }

  function platformName(key) {
    return key === "douyin" ? "抖音" : key === "xiaohongshu" ? "小红书" : key;
  }

  function loadPlatformAnalytics() {
    if (PA.loading) return Promise.resolve(PA);
    PA.loading = true;
    return fetch("/api/platform-analytics", { credentials: "same-origin", cache: "no-store", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error(response.status === 401 ? "登录已失效" : "平台数据读取失败");
        return response.json();
      })
      .then(function (payload) {
        PA.loading = false;
        PA.loaded = true;
        PA.error = "";
        PA.updatedAt = Number(payload.updatedAt) || 0;
        PA.platforms = payload.platforms || {};
        if (currentRoute() === "media" && S.mediaTab === "analytics") render();
        return PA;
      })
      .catch(function (error) {
        PA.loading = false;
        PA.loaded = true;
        PA.error = error.message || "平台数据读取失败";
        if (currentRoute() === "media" && S.mediaTab === "analytics") render();
        return PA;
      });
  }

  function savePlatformAnalytics(snapshots, errors, manual) {
    if (!Array.isArray(snapshots) || !snapshots.length) {
      PA.syncing = false;
      PA.error = (errors || []).join("；") || "没有读取到可同步的平台数据";
      if (currentRoute() === "media" && S.mediaTab === "analytics") render();
      if (manual) toast(PA.error);
      return Promise.resolve(false);
    }
    return fetch("/api/platform-analytics", {
      method: "PUT", credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ snapshots: snapshots })
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok) throw new Error(payload.error || "平台数据保存失败");
        PA.platforms = Object.assign({}, PA.platforms, payload.platforms || {});
        PA.updatedAt = Number(payload.updatedAt) || Date.now();
        PA.syncing = false;
        PA.error = (errors || []).join("；");
        localStorage.setItem("yoyo_platform_sync_day", chinaToday());
        if (currentRoute() === "media" && S.mediaTab === "analytics") render();
        if (manual) toast("平台数据已同步到云端，手机端刷新后即可查看");
        return true;
      });
    }).catch(function (error) {
      PA.syncing = false;
      PA.error = error.message || "平台数据保存失败";
      if (currentRoute() === "media" && S.mediaTab === "analytics") render();
      if (manual) toast("同步失败：" + PA.error);
      return false;
    });
  }

  function requestPlatformAnalyticsSync(manual) {
    if (PA.syncing) return;
    if (document.documentElement.getAttribute("data-yoyo-platform-sync") !== "ready") {
      if (manual) toast("本机同步器尚未安装或未启用，请先完成一次安装授权");
      return;
    }
    PA.syncing = true;
    PA.error = "";
    if (currentRoute() === "media" && S.mediaTab === "analytics") render();
    var requestId = "platform-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    var finished = false;
    var timeout = setTimeout(function () {
      if (finished) return;
      finished = true;
      window.removeEventListener("message", receive);
      PA.syncing = false;
      PA.error = "平台后台响应超时，请确认登录状态后重试";
      if (currentRoute() === "media" && S.mediaTab === "analytics") render();
      if (manual) toast(PA.error);
    }, 45000);
    function receive(event) {
      var detail = event.data || {};
      if (event.source !== window || detail.type !== "YOYO_PLATFORM_SYNC_RESULT" || detail.requestId !== requestId || finished) return;
      finished = true;
      clearTimeout(timeout);
      window.removeEventListener("message", receive);
      savePlatformAnalytics(detail.snapshots, detail.errors, manual);
    }
    window.addEventListener("message", receive);
    window.postMessage({ type: "YOYO_PLATFORM_SYNC_REQUEST", requestId: requestId }, location.origin);
  }

  function ensureDailyPlatformAnalytics() {
    loadPlatformAnalytics().then(function () {
      if (localStorage.getItem("yoyo_platform_sync_day") === chinaToday()) return;
      setTimeout(function () { requestPlatformAnalyticsSync(false); }, 800);
    });
  }

  function ghFetch(force) {
    if (GH.loading) return;
    var cache = D.getGhCache();
    if (!force && cache && cache.list && cache.list.length && (Date.now() - cache.ts < 6 * 3600 * 1000)) {
      GH.list = cache.list; GH.ts = cache.ts; GH.loaded = true; GH.error = null;
      render();
      return;
    }
    GH.loading = true; GH.error = null;
    render();
    var since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    var url = "https://api.github.com/search/repositories?q=" + encodeURIComponent("created:>" + since) +
      "&sort=stars&order=desc&per_page=12";
    fetch(url, { headers: { "Accept": "application/vnd.github+json" } })
      .then(function (r) {
        if (r.status === 403) throw new Error("GitHub 接口限流了，10 分钟后再刷新试试");
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (j) {
        GH.list = (j.items || []).map(function (it) {
          return {
            id: "gh" + it.id,
            title: it.full_name,
            summary: it.description || "（作者还没写简介）",
            source: "GitHub Trending",
            time: "创建于 " + (it.created_at || "").slice(5, 10),
            heat: fmtNum(it.stargazers_count) + " ★",
            trend: "up",
            tags: [it.language || "开源项目"].filter(Boolean),
            url: it.html_url,
            stars7: it.stargazers_count,
            analysis: null
          };
        });
        GH.ts = Date.now(); GH.loading = false; GH.loaded = true; GH.error = null;
        D.setGhCache(GH.list);
        render();
        toast("已拉取 GitHub 近 7 天热门项目");
      })
      .catch(function (e) {
        GH.loading = false; GH.loaded = true;
        GH.error = e.message === "Failed to fetch" ? "网络连接失败" : e.message;
        render();
      });
  }

  function ghCard(r) {
    var a = r.analysis;
    return '<div class="card card-hover topic-card" data-topic="' + r.id + '">' +
      '<div class="topic-top"><div style="flex:1"><div class="topic-title">' + esc(r.title) + "</div></div>" +
      (a ? stars(a.starsN) : "") + "</div>" +
      '<div class="topic-summary">' + esc(a ? a.summary : r.summary) + "</div>" +
      '<div class="topic-meta"><span class="tag tag-blue">' + r.source + "</span><span>" + r.time + '</span><span class="num" style="color:var(--up);font-weight:600">' + r.heat + "</span>" +
      r.tags.map(function (g) { return '<span class="tag tag-pink">' + esc(g) + "</span>"; }).join("") +
      '<a href="' + r.url + '" target="_blank" style="color:var(--ink-3);text-decoration:underline">查看仓库 ↗</a></div>' +
      (a ?
        '<div class="scores">' +
        scoreBar("热度", a.scores.heat, "#F04E45") +
        scoreBar("价值", a.scores.value, "#B5D951") +
        scoreBar("匹配", a.scores.match, "#FFC93C") +
        scoreBar("新鲜", a.scores.freshness, "#7FC4E8") +
        scoreBar("难度", a.scores.difficulty, "#B0A897") +
        "</div>" +
        '<div class="topic-meta"><span>推荐：</span>' + a.platforms.map(function (p) { return '<span class="tag tag-sage">' + esc(p) + "</span>"; }).join("") + "</div>" +
        '<div class="topic-angle"><b>创作角度</b> · ' + esc(a.angle) + "</div>"
        : "") +
      '<div class="topic-actions">' +
      saveBtn(r) +
      (a
        ? '<button class="btn btn-accent btn-sm" data-act="create-topic" data-id="' + r.id + '">' + icon("pen") + '开始创作</button>'
        : '<button class="btn btn-accent btn-sm" data-act="gh-analyze" data-id="' + r.id + '">' + icon("sparkle") + 'AI 分析</button>') +
      '<button class="btn btn-ghost btn-sm" data-act="ignore-topic" data-id="' + r.id + '">暂不关注</button>' +
      "</div></div>";
  }

  function ghAnalyze(id) {
    if (!aiReady()) { toast("先到「设置」配置 DeepSeek API Key"); return; }
    var r = null;
    GH.list.forEach(function (x) { if (x.id === id) r = x; });
    if (!r) return;
    var card = document.querySelector('[data-topic="' + id + '"]');
    if (card) card.insertAdjacentHTML("beforeend", '<div class="copilot-res" data-typing style="margin-top:4px">桃子助手正在分析这个项目…</div>');
    YOYO.ai.ask(
      "你是中文自媒体（AI 工具/效率赛道）的选题顾问。分析这个 GitHub 开源项目的选题价值。\n" +
      "项目：" + r.title + "\n描述：" + r.summary + "\n语言：" + (r.tags[0] || "未知") + "\n近7天 Stars：" + r.stars7 +
      "\n严格按以下格式逐行返回，不要编号，不要多余内容：\n摘要｜（一句话中文说清这个项目能干什么，面向非程序员读者）\n角度｜（一个具体可执行的内容创作角度）\n平台｜（1-2 个最适合的平台，用顿号分隔）\n热度｜（0-100 整数）\n价值｜（0-100）\n匹配｜（0-100）\n新鲜｜（0-100）\n难度｜（0-100，越低越容易做）",
      function (err, text) {
        if (card) { var tp = card.querySelector("[data-typing]"); if (tp) tp.remove(); }
        if (err) { toast("分析失败：" + err); return; }
        var obj = { scores: {} };
        text.split("\n").forEach(function (line) {
          var p = line.split("｜");
          if (p.length < 2) return;
          var k = p[0].trim(), val = p.slice(1).join("｜").trim();
          if (k === "摘要") obj.summary = val;
          else if (k === "角度") obj.angle = val;
          else if (k === "平台") obj.platforms = val.split(/[、,，\/]/).filter(Boolean);
          else if (k === "热度") obj.scores.heat = parseInt(val, 10) || 50;
          else if (k === "价值") obj.scores.value = parseInt(val, 10) || 50;
          else if (k === "匹配") obj.scores.match = parseInt(val, 10) || 50;
          else if (k === "新鲜") obj.scores.freshness = parseInt(val, 10) || 50;
          else if (k === "难度") obj.scores.difficulty = parseInt(val, 10) || 50;
        });
        if (!obj.summary || !obj.scores.match) { toast("分析结果解析失败，再试一次"); return; }
        var s = obj.scores;
        obj.starsN = Math.round(((s.heat + s.value + s.match + s.freshness + (100 - s.difficulty)) / 5) / 20);
        r.analysis = obj;
        render();
        toast("AI 分析完成");
      }
    );
  }

  function renderNav() {
    var html = "";
    NAV.forEach(function (n) {
      html += '<a class="nav-item" href="#/' + n.route + '" data-route="' + n.route + '">' +
        '<span class="nav-num">' + n.num + '</span>' +
        '<span class="nav-ico" data-icon="' + n.icon + '"></span>' +
        '<img class="mobile-yoyo-icon" src="assets/images2/' + n.mobileYoyo + '" alt="">' +
        '<span>' + n.label + '</span></a>';
    });
    document.getElementById("nav").innerHTML = html;
  }

  /* ============ 工具 ============ */
  function toast(msg) {
    var wrap = document.getElementById("toastWrap");
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity .25s"; }, 2200);
    setTimeout(function () { el.remove() }, 2500);
  }
  function stars(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= n ? "★" : '<span class="off">★</span>';
    return '<span class="stars">' + s + "</span>";
  }
  function trendIcon(t) {
    if (t === "up") return '<span class="trend up">' + icon("up") + "热度上升</span>";
    if (t === "down") return '<span class="trend down">' + icon("down") + "热度回落</span>";
    return '<span class="trend flat">' + icon("flat") + "热度平稳</span>";
  }
  function scoreBar(label, val, color) {
    return '<div class="score"><div class="score-label"><span>' + label + '</span><span class="num">' + val + "</span></div>" +
      '<div class="score-bar"><i style="width:' + val + "%;background:" + color + '"></i></div></div>';
  }
  function sparkline(points, color) {
    var w = 260, h = 48, max = Math.max.apply(null, points), min = Math.min.apply(null, points);
    var step = w / (points.length - 1);
    var d = points.map(function (p, i) {
      var x = i * step, y = h - 6 - ((p - min) / (max - min || 1)) * (h - 14);
      return (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }).join(" ");
    return '<svg width="100%" viewBox="0 0 ' + w + " " + h + '" style="display:block">' +
      '<path d="' + d + '" fill="none" stroke="' + (color || "#B5D951") + '" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }
  function barChart(points) {
    var w = 320, h = 120, bw = 24, gap = (w - bw * points.length) / (points.length + 1);
    var max = Math.max.apply(null, points);
    var bars = points.map(function (p, i) {
      var bh = (p / max) * (h - 24);
      var x = gap + i * (bw + gap), y = h - bh;
      var fill = i === points.length - 1 ? "#F04E45" : "#FFC93C";
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw + '" height="' + bh.toFixed(1) + '" rx="6" fill="' + fill + '"/>';
    }).join("");
    return '<svg width="100%" viewBox="0 0 ' + w + " " + h + '" style="display:block">' + bars + "</svg>";
  }
  function fmtNum(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + "万";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
  }
  function gradeTag(g) {
    var map = { S: "tag-red", A: "tag-yellow", B: "tag-blue", C: "" };
    return g ? '<span class="tag ' + (map[g] || "") + '">' + g + " 级</span>" : "";
  }
  function esc(s) { return String(s).replace(/</g, "&lt;"); }
  function safeExternalUrl(value) {
    try {
      var parsed = new URL(String(value || ""));
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
      return parsed.href.replace(/"/g, "%22");
    } catch (error) { return ""; }
  }
  function attr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function fmt(t) { return esc(t).replace(/\n/g, "<br>"); }
  function aiReady() { return YOYO.ai && YOYO.ai.configured(); }

  /* ============ 共享组件：话题推荐卡 ============ */
  function saveBtn(t) {
    if (D.isTopicSaved(t.id)) return '<button class="btn btn-soft btn-sm" disabled>已在话题库 ✓</button>';
    return '<button class="btn btn-primary btn-sm" data-act="save-topic" data-id="' + t.id + '">' + icon("bookmark") + '加入话题库</button>';
  }
  function topicCard(t) {
    return '<div class="card card-hover topic-card" data-topic="' + t.id + '">' +
      '<div class="topic-top"><div style="flex:1"><div class="topic-title">' + t.title + "</div></div>" + stars(t.stars) + "</div>" +
      '<div class="topic-summary">' + t.summary + "</div>" +
      '<div class="topic-meta"><span class="tag">' + t.source + "</span><span>" + t.time + '</span><span class="num">' + t.heat + " 热度</span>" + trendIcon(t.trend) +
      t.tags.map(function (g) { return '<span class="tag tag-pink">' + g + "</span>"; }).join("") + "</div>" +
      '<div class="scores">' +
      scoreBar("热度", t.scores.heat, "#F04E45") +
      scoreBar("价值", t.scores.value, "#B5D951") +
      scoreBar("匹配", t.scores.match, "#FFC93C") +
      scoreBar("新鲜", t.scores.freshness, "#7FC4E8") +
      scoreBar("难度", t.scores.difficulty, "#B0A897") +
      "</div>" +
      '<div class="topic-meta"><span>推荐：</span>' +
      t.platforms.map(function (p) { return '<span class="tag tag-sage">' + p + "</span>"; }).join("") +
      '<span class="tag tag-yellow">' + t.format + "</span></div>" +
      '<div class="topic-angle"><b>创作角度</b> · ' + t.angle + "</div>" +
      '<div class="topic-actions">' +
      saveBtn(t) +
      '<button class="btn btn-accent btn-sm" data-act="create-topic" data-id="' + t.id + '">' + icon("pen") + '开始创作</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="ignore-topic" data-id="' + t.id + '">暂不关注</button>' +
      "</div></div>";
  }
  function filterChips(list, current, act) {
    return '<div class="chip-row">' + list.map(function (c) {
      return '<button class="chip' + (c === current ? " on" : "") + '" data-act="' + act + '" data-v="' + c + '">' + c + "</button>";
    }).join("") + "</div>";
  }

  function hotTopicRows(platform) {
    var list = D.aiHotTopics[platform] || [];
    var platformName = platform === "douyin" ? "抖音" : "小红书";
    return list.map(function (topic, index) {
      var saved = D.isTopicSaved(topic.id);
      return '<article class="hot-topic-row" data-topic="' + topic.id + '">' +
        '<div class="hot-rank num">' + (index + 1) + '</div>' +
        '<div class="hot-main"><div class="hot-title">' + esc(topic.title) + '</div>' +
        '<div class="hot-angle">' + esc(topic.angle) +
        (topic.metric ? ' · <span class="hot-signal-metric">' + esc(topic.metric) + '</span>' : "") +
        (safeExternalUrl(topic.sourceUrl) ? ' · <a href="' + safeExternalUrl(topic.sourceUrl) + '" target="_blank" rel="noopener" class="hot-signal-link">信号来源：' + esc(topic.sourceName || "公开网页") + ' ↗</a>' : "") + '</div></div>' +
        '<div class="hot-actions"><button class="btn btn-soft btn-sm" data-act="save-hot-topic" data-id="' + topic.id + '" data-platform="' + platform + '"' + (saved ? " disabled" : "") + '>' + (saved ? "已加入 ✓" : "加入话题库") + '</button>' +
        '<button class="btn btn-accent btn-sm" data-act="create-hot-topic" data-id="' + topic.id + '" data-platform="' + platform + '">' + icon("pen") + '开始创作</button></div>' +
        '<span class="sr-only">平台：' + platformName + '</span></article>';
    }).join("");
  }

  /* ============ 视图：首页 ============ */
  function viewToday() {
    ensureDailyHotTopics();
    var me = D.getSettings();
    var ignored = D.getIgnored();
    var topics = D.topics.filter(function (t) { return ignored.indexOf(t.id) === -1; });
    var hour = new Date().getHours();
    var greet = hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";
    var days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var now = new Date();
    var dateStr = (now.getMonth() + 1) + "月" + now.getDate() + "日 · " + days[now.getDay()];

    var html = '<section class="sec"><div class="greet">' +
      "<div><div class=\"greet-title\">" + greet + "，" + esc(me.name) + "。</div>" +
      '<div class="greet-meta"><span>' + dateStr + '</span><span class="focus-pill">专注模式</span></div>' +
      '<div class="greet-tip">工作台目前没有预置任务，记录真实事项后会显示在这里。</div></div>' +
      '<div class="greet-side">' +
      '<div class="mascot-badge"><span class="mascot" data-mascot></span><span class="mascot-bubble">从一条真实记录开始 ✦</span></div>' +
      '<div class="greet-actions"><button class="btn btn-soft" data-act="capture-scroll">' + icon("zap") + '快速记录</button>' +
      '<a class="btn btn-accent" href="#/studio">' + icon("pen") + '开始创作</a></div></div>' +
      "</div></section>";

    /* 今日重点 */
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">今日重点</div><div class="sec-note">一次只做一件事。</div></div><div class="today-focus-grid">';
    html += '<div class="card card-mini card-hover" data-act="edit-home" data-v="tasks"><div class="mini-head"><div class="mini-label">' + icon("clock") + '今日待办</div>' +
      '<div class="mini-value num">' + D.tasks.length + '</div></div><div class="mini-list">' +
      (D.tasks.length ? D.tasks.map(function (t) {
        return '<div class="mini-item' + (t.overdue ? " overdue" : "") + '"><span class="dot-s"></span>' + t.title +
          (t.overdue ? '<span class="tag tag-apricot" style="margin-left:auto">逾期</span>' : "") + "</div>";
      }).join("") : '<div class="mini-sub">暂无待办</div>') + "</div></div>";
    html += "</div></section>";

    /* 今日内容推荐：GitHub 实时热点（真）+ 为你精选（示例） */
    if (!GH.loaded && !GH.loading && !GH.error) { ghFetch(false); }
    var ghTop = GH.list.filter(function (r) { return ignored.indexOf(r.id) === -1; }).slice(0, 4);
    var picked = [];
    var noteText = ghTop.length
      ? ghTop.length + " 个 GitHub 实时热点 · 更新于 " + new Date(GH.ts).toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" })
      : (GH.loading ? "正在拉取 GitHub 实时热点…" : "暂无实时推荐");
    var hotStatus = HOT.loading ? " · 正在刷新平台快照…" :
      (HOT.stale ? " · 使用最近一次已核实平台数据" :
        (HOT.error ? " · " + HOT.error : " · 已核实平台来源"));
    if (HOT.lastCheckedAt && !HOT.loading) hotStatus += " · 刚刚检查";
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">今日内容推荐</div>' +
      '<div class="sec-note">先从 AI 行业热点选题开始</div>' +
      '<a class="sec-more" href="#/studio" data-act="open-studio-topics">查看话题库 →</a></div>' +
      '<div class="hot-board"><div class="hot-board-head"><div><div class="hot-board-title">AI 行业平台内容信号</div>' +
      '<div class="hot-board-note">' + esc(D.aiHotTopics.source) + ' · 更新于 ' + esc(D.aiHotTopics.updatedAt) + esc(hotStatus) + ' · 平台真实内容信号，非官方热榜排名</div></div>' +
      '<div class="hot-board-tools"><div class="seg hot-platform-tabs" role="tablist" aria-label="热点平台">' +
      '<button class="seg-btn' + (S.hotPlatform === "douyin" ? " on" : "") + '" data-act="hot-platform" data-v="douyin" role="tab">抖音 ' + (D.aiHotTopics.douyin || []).length + ' 条</button>' +
      '<button class="seg-btn' + (S.hotPlatform === "xiaohongshu" ? " on" : "") + '" data-act="hot-platform" data-v="xiaohongshu" role="tab">小红书 ' + (D.aiHotTopics.xiaohongshu || []).length + ' 条</button></div>' +
      '<button class="btn btn-soft btn-sm hot-refresh-btn" data-act="hot-refresh"' + (HOT.loading ? ' disabled aria-busy="true"' : '') + '>' + icon("refresh") + (HOT.loading ? '刷新中…' : '立即刷新') + '</button></div></div>' +
      '<div class="hot-topic-list">' + hotTopicRows(S.hotPlatform) + '</div></div>' +
      '<div class="sec-head home-github-head"><div class="sec-title" style="font-size:16px">GitHub 实时热点</div><div class="sec-note">' + noteText + '</div></div>' +
      '<div class="topic-grid">' + ghTop.map(ghCard).join("") + picked.map(topicCard).join("") + "</div></section>";

    /* Quick Capture */
    html += '<section class="sec"><div class="capture">' +
      '<div class="capture-title">' + icon("zap") + '快速记录</div>' +
      '<div class="capture-sub">想法、一句话、网址、标题、选题——丢进来，AI 帮你放到该去的地方。</div>' +
      '<div class="capture-row"><input class="capture-input" id="captureInput" placeholder="现在脑子里有什么？">' +
      '<button class="capture-more" data-act="asset-add">图片 / 链接</button><button class="capture-btn" data-act="capture">记下</button></div>' +
      '</div></section>';
    return html;
  }
  function metricCard(label, value, unit, delta) {
    return '<div class="card card-mini"><div class="mini-label">' + label + '</div>' +
      '<div class="metric-value num">' + value + (unit ? '<span style="font-size:13px;color:var(--ink-3);font-weight:500"> ' + unit + "</span>" : "") + "</div>" +
      (delta ? '<div class="metric-delta ' + (delta.indexOf("-") === 0 ? "down" : "up") + '">' + delta + " 环比上周</div>" : "") + "</div>";
  }

  /* ============ 视图：自媒体中心 ============ */
  var MEDIA_TABS = [
    { key: "overview", label: "内容总览" },
    { key: "discover", label: "今日推荐" },
    { key: "library", label: "内容库" },
    { key: "publish", label: "发布管理" },
    { key: "analytics", label: "数据复盘" }
  ];
  function viewMedia() {
    var html = pageHead("自媒体中心", "初稿确认 → 发布准备 → 排期 → 发布 → 数据复盘，每一步都可以继续推进。");
    html += '<div class="tabs">' + MEDIA_TABS.map(function (t) {
      return '<button class="tab' + (S.mediaTab === t.key ? " on" : "") + '" data-act="media-tab" data-v="' + t.key + '">' + t.label + "</button>";
    }).join("") + "</div>";

    if (S.mediaTab === "overview") html += mediaOverview();
    else if (S.mediaTab === "discover") html += mediaDiscover();
    else if (S.mediaTab === "library") html += mediaLibrary();
    else if (S.mediaTab === "publish") html += mediaPublish();
    else html += mediaAnalytics();
    return html;
  }
  function pageHead(title, sub) {
    return '<section class="sec" style="margin-bottom:18px"><div class="greet"><div>' +
      '<div class="greet-title" style="font-size:28px">' + title + '</div>' +
      (sub ? '<div class="greet-tip">' + sub + "</div>" : "") + "</div></div></section>";
  }
  function mediaOverview() {
    var byStatus = {};
    D.contents.forEach(function (c) { (byStatus[c.status] = byStatus[c.status] || []).push(c); });
    var cols = ["draft", "ready", "scheduled", "published"];
    var html = '<div class="grid grid-4 media-metrics" style="margin-bottom:16px">' +
      metricCard("内容总数", D.contents.length, "条", "") +
      metricCard("已发布", (byStatus.published || []).length, "条", "") +
      metricCard("排期中", (byStatus.scheduled || []).length, "条", "") +
      metricCard("本周发布", D.stats.weekPosts, "条", "") +
      "</div>";
    html += '<div class="kanban media-kanban">' + cols.map(function (st) {
      var list = byStatus[st] || [];
      return '<div class="kanban-col' + (list.length ? ' has-items' : ' is-empty') + '"><div class="kanban-head"><span class="status ' + CSTATUS[st].cls + '">' + CSTATUS[st].label + '</span><span class="num" style="color:var(--ink-3)">' + list.length + "</span></div>" +
        list.map(function (c) {
          return '<div class="kanban-card"><div style="font-weight:650;font-size:13px;line-height:1.5">' + esc(c.title) + '</div>' +
            '<div class="topic-meta" style="margin-top:8px"><span class="tag">' + esc(c.platform || "未设置") + '</span><span>' + esc((c.date || "").slice(5)) + "</span></div>" +
            contentFlowActions(c) + "</div>";
        }).join("") + "</div>";
    }).join("") + "</div>";
    return html;
  }
  function contentFlowActions(content) {
    var html = '<div class="topic-actions content-flow-actions">';
    if (content.status === "draft") {
      if (content.draftId) html += '<button class="btn btn-ghost btn-sm" data-act="content-edit-draft" data-id="' + esc(content.id) + '">' + icon("pen") + '继续编辑</button>';
      html += '<button class="btn btn-accent btn-sm" data-act="content-status" data-id="' + esc(content.id) + '" data-v="ready">确认就绪 →</button>';
    } else if (content.status === "ready") {
      html += '<button class="btn btn-ghost btn-sm" data-act="content-status" data-id="' + esc(content.id) + '" data-v="draft">退回草稿</button>';
      html += '<button class="btn btn-accent btn-sm" data-act="content-schedule" data-id="' + esc(content.id) + '">设置排期 →</button>';
    } else if (content.status === "scheduled") {
      html += '<button class="btn btn-ghost btn-sm" data-act="content-status" data-id="' + esc(content.id) + '" data-v="ready">退回就绪</button>';
      html += '<button class="btn btn-ghost btn-sm" data-act="content-schedule" data-id="' + esc(content.id) + '">调整日期</button>';
      html += '<button class="btn btn-accent btn-sm" data-act="content-status" data-id="' + esc(content.id) + '" data-v="published">确认已发布 →</button>';
    } else if (content.status === "published") {
      html += '<button class="btn btn-soft btn-sm" data-act="content-review" data-id="' + esc(content.id) + '">进入数据复盘 →</button>';
    }
    return html + '</div>';
  }
  function mediaDiscover() {
    var html = '<div class="seg" style="margin-bottom:14px">' +
      '<button class="seg-btn' + (S.discoverSource === "picked" ? " on" : "") + '" data-act="discover-source" data-v="picked">' + icon("sparkle") + "为你精选</button>" +
      '<button class="seg-btn' + (S.discoverSource === "github" ? " on" : "") + '" data-act="discover-source" data-v="github">' + icon("zap") + "GitHub 实时</button>" +
      "</div>";

    if (S.discoverSource === "picked") {
      var list = D.topics.filter(function (t) {
        return S.discoverFilter === "全部" || t.tags.indexOf(S.discoverFilter) > -1 || t.source.indexOf(S.discoverFilter) > -1;
      });
      html += filterChips(["全部", "AI", "AI Coding", "工具", "知识管理", "GitHub", "Product Hunt", "小红书"], S.discoverFilter, "discover-filter");
      html += '<div class="topic-grid">' + (list.length ? list.map(topicCard).join("") : emptyTip("这个筛选下暂时没有推荐")) + "</div>";
      return html;
    }

    /* GitHub 实时信源 */
    if (!GH.loaded && !GH.loading && !GH.error) { ghFetch(false); }
    var ignored = D.getIgnored();
    var ghList = GH.list.filter(function (r) { return ignored.indexOf(r.id) === -1; });
    html += '<div class="card" style="padding:12px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">' +
      '<span class="mini-label">' + icon("zap") + '近 7 天新建的高 Star 开源项目</span>' +
      (GH.ts ? '<span style="font-size:12px;color:var(--ink-3)">更新于 ' + new Date(GH.ts).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) + "（每 6 小时缓存）</span>" : "") +
      '<button class="btn btn-soft btn-sm" style="margin-left:auto" data-act="gh-refresh">' + icon("arrow") + "刷新</button></div>";

    if (GH.loading) {
      html += '<div class="empty" style="padding:48px"><span class="mascot empty-mascot" data-mascot></span><div class="empty-title">正在拉取 GitHub 热门项目…</div></div>';
    } else if (GH.error) {
      html += '<div class="empty" style="padding:48px"><div class="empty-title">拉取失败</div><div class="empty-sub">' + esc(GH.error) + '</div><div style="margin-top:8px"><button class="btn btn-primary btn-sm" data-act="gh-refresh">重试</button></div></div>';
    } else if (!GH.loaded) {
      html += '<div class="empty" style="padding:48px"><span class="mascot empty-mascot" data-mascot></span><div class="empty-title">点一下，把今天的开源热点装进工作台</div>' +
        '<div class="empty-sub">真实数据来自 GitHub 官方接口；每个项目都可以用 DeepSeek 一键分析选题价值。</div>' +
        '<div style="margin-top:8px"><button class="btn btn-accent" data-act="gh-refresh">加载今日热门</button></div></div>';
    } else {
      html += '<div class="topic-grid">' + (ghList.length ? ghList.map(ghCard).join("") : emptyTip("都被你忽略完了，点上方刷新重新拉取")) + "</div>";
    }
    return html;
  }
  /* 我收藏的话题卡（真实入库数据） */
  function savedTopicCard(t) {
    var dateStr = new Date(t.savedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric" });
    return '<div class="card card-hover topic-card">' +
      '<div class="topic-top"><div style="flex:1"><div class="topic-title">' + esc(t.title) + "</div></div>" + (t.starsN ? stars(t.starsN) : "") + "</div>" +
      (t.summary ? '<div class="topic-summary">' + esc(t.summary) + "</div>" : "") +
      '<div class="topic-meta"><span class="tag tag-red">已入库 · 观察中</span><span class="tag">' + esc(t.source) + "</span><span>" + dateStr + " 收藏</span>" +
      (t.heat ? '<span class="num">' + esc(t.heat) + "</span>" : "") +
      t.tags.map(function (g) { return '<span class="tag tag-pink">' + esc(g) + "</span>"; }).join("") +
      (t.url ? '<a href="' + t.url + '" target="_blank" style="color:var(--ink-3);text-decoration:underline">来源 ↗</a>' : "") + "</div>" +
      (t.scores ? '<div class="scores">' +
        scoreBar("热度", t.scores.heat, "#F04E45") +
        scoreBar("价值", t.scores.value, "#B5D951") +
        scoreBar("匹配", t.scores.match, "#FFC93C") +
        scoreBar("新鲜", t.scores.freshness, "#7FC4E8") +
        scoreBar("难度", t.scores.difficulty, "#B0A897") + "</div>" : "") +
      (t.platforms && t.platforms.length ? '<div class="topic-meta"><span>推荐：</span>' + t.platforms.map(function (p) { return '<span class="tag tag-sage">' + esc(p) + "</span>"; }).join("") + "</div>" : "") +
      (t.angle ? '<div class="topic-angle"><b>创作角度</b> · ' + esc(t.angle) + "</div>" : "") +
      '<div class="topic-actions">' +
      '<button class="btn btn-accent btn-sm" data-act="create-topic" data-id="' + t.id + '">' + icon("pen") + '开始创作</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="ai-judge-saved" data-id="' + t.id + '">AI 再评估</button>' +
      '<button class="btn btn-ghost btn-sm" style="color:var(--danger)" data-act="remove-topic" data-id="' + t.id + '">移出</button>' +
      "</div></div>";
  }

  function mediaTopics() {
    var list = D.topics.filter(function (t) { return S.topicFilter === "全部" || t.tags.indexOf(S.topicFilter) > -1; });
    var mine = D.getExtraTopics().filter(function (t) { return S.topicFilter === "全部" || (t.tags || []).indexOf(S.topicFilter) > -1; });
    var html = "";
    if (mine.length) {
      html += '<div class="sec-head" style="margin-bottom:12px"><div class="sec-title" style="font-size:16px">我收藏的话题</div>' +
        '<div class="sec-note">' + mine.length + ' 条 · 存在你的浏览器本地</div></div>' +
        '<div class="topic-grid" style="margin-bottom:22px">' + mine.map(savedTopicCard).join("") + "</div>" +
        '<div class="sec-head" style="margin-bottom:12px"><div class="sec-title" style="font-size:16px">推荐池</div><div class="sec-note">来自今日推荐</div></div>';
    }
    html += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
      filterChips(TRACKS, S.topicFilter, "topic-filter") +
      '<div class="seg" style="margin-left:auto">' +
      segBtn("card", "grid", "卡片", S.topicView) + segBtn("table", "list", "表格", S.topicView) + segBtn("kanban", "board", "看板", S.topicView) +
      "</div></div>";

    if (S.topicView === "card") {
      html += '<div class="topic-grid">' + list.map(function (t) {
        return '<div class="card card-hover topic-card"><div class="topic-top"><div style="flex:1"><div class="topic-title">' + t.title + "</div></div>" + stars(t.stars) + "</div>" +
          '<div class="topic-meta"><span class="tag">' + TSTATUS[t.status] + "</span>" + t.tags.map(function (g) { return '<span class="tag tag-pink">' + g + "</span>"; }).join("") +
          '<span>' + t.source + "</span></div>" +
          (t.myNote ? '<div class="topic-angle"><b>我的想法</b> · ' + t.myNote + "</div>" : "") +
          '<div class="topic-angle"><b>AI 观点</b> · ' + t.aiOpinion + "</div>" +
          '<div class="topic-actions"><button class="btn btn-accent btn-sm" data-act="create-topic" data-id="' + t.id + '">' + icon("pen") + '开始创作</button>' +
          '<button class="btn btn-ghost btn-sm" data-act="ai-judge" data-id="' + t.id + '">AI 判断值不值得做</button></div></div>';
      }).join("") + "</div>";
    } else if (S.topicView === "table") {
      html += '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>话题</th><th>赛道</th><th>来源</th><th>热度</th><th>匹配</th><th>状态</th><th></th></tr></thead><tbody>' +
        list.map(function (t) {
          return "<tr><td style=\"max-width:320px;font-weight:600\">" + t.title + "</td><td>" + t.tags.join(" / ") + "</td><td>" + t.source + '</td><td class="num">' + t.heat + '</td><td class="num">' + t.scores.match + '</td><td><span class="tag">' + TSTATUS[t.status] + '</span></td><td><button class="btn btn-soft btn-sm" data-act="create-topic" data-id="' + t.id + '">创作</button></td></tr>';
        }).join("") + "</tbody></table></div>";
    } else {
      var cols = ["spark", "watching", "ready", "creating", "published", "hold"];
      html += '<div class="kanban">' + cols.map(function (st) {
        var items = list.filter(function (t) { return t.status === st; });
        return '<div class="kanban-col"><div class="kanban-head"><span style="font-weight:650;font-size:13px">' + TSTATUS[st] + '</span><span class="num" style="color:var(--ink-3)">' + items.length + "</span></div>" +
          items.map(function (t) {
            return '<div class="kanban-card"><div style="font-weight:650;font-size:13px;line-height:1.5">' + t.title + '</div>' +
              '<div class="topic-meta" style="margin-top:8px"><span class="tag tag-pink">' + t.tags[0] + '</span><span class="num">匹配 ' + t.scores.match + "</span></div></div>";
          }).join("") + "</div>";
      }).join("") + "</div>";
    }
    return html;
  }
  function segBtn(v, ic, label, cur) {
    return '<button class="seg-btn' + (cur === v ? " on" : "") + '" data-act="topic-view" data-v="' + v + '">' + icon(ic) + label + "</button>";
  }
  function mediaLibrary() {
    var list = D.contents;
    if (!list.length) return emptyTip("内容库还是空的。请先在 AI 创作台的初稿库中选择“进入自媒体中心”。");
    var html = '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>内容</th><th>状态</th><th>平台</th><th>日期</th><th>播放</th><th>点赞</th><th>收藏</th><th>涨粉</th><th></th></tr></thead><tbody>' +
      list.map(function (c) {
        var metrics = c.metrics || {};
        var status = CSTATUS[c.status] || CSTATUS.draft;
        var action = c.status === "published" ? '<button class="btn btn-soft btn-sm" data-act="content-review" data-id="' + esc(c.id) + '">数据复盘</button>' : '<button class="btn btn-soft btn-sm" data-act="content-focus" data-id="' + esc(c.id) + '">继续推进</button>';
        return '<tr><td style="max-width:300px;font-weight:600">' + esc(c.title) + '</td><td><span class="status ' + status.cls + '">' + status.label + "</span></td><td>" + esc(c.platform || "未设置") + "</td><td>" + esc((c.date || "").slice(5)) + '</td><td class="num">' + fmtNum(metrics.views || 0) + '</td><td class="num">' + fmtNum(metrics.likes || 0) + '</td><td class="num">' + fmtNum(metrics.saves || 0) + '</td><td class="num" style="color:var(--up)">+' + (metrics.fans || 0) + "</td><td>" + action + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    return html;
  }
  function mediaPublish() {
    var queue = D.contents.filter(function (content) { return content.status !== "draft"; });
    var html = '<div class="card publish-guide"><div><div class="sec-title" style="font-size:16px">发布队列</div><div class="mini-sub">内容准备完成后设置日期；在平台发布成功后回到这里确认，再进入数据复盘。</div></div><span class="tag tag-yellow">人工确认发布</span></div>';
    if (!queue.length) return html + emptyTip('暂无待发布内容。请先在“内容总览”的草稿卡片上点击“确认就绪”。');
    html += '<div class="publish-queue">' + queue.map(function (content) {
      var status = CSTATUS[content.status] || CSTATUS.draft;
      return '<article class="card publish-item"><div class="publish-item-main"><div><div class="topic-title">' + esc(content.title) + '</div><div class="topic-meta"><span class="status ' + status.cls + '">' + status.label + '</span><span>' + esc(content.platform || "多平台") + '</span><span>' + (content.status === "scheduled" ? '计划 ' : content.status === "published" ? '发布 ' : '更新 ') + esc(content.date || "未设置") + '</span></div></div></div>' + contentFlowActions(content) + '</article>';
    }).join("") + '</div>';
    return html;
  }

  /* ============ 视图：创作台 ============ */
  var FLOW = ["选题", "确定角度", "内容结构", "完整内容", "平台适配", "配图建议", "封面建议", "发布准备"];
  var COPILOT = ["分析选题", "寻找创作角度", "优化标题", "优化开头", "生成口播", "改短", "改长", "改口语化", "提炼金句", "生成视频分镜", "生成配图提示词", "生成封面提示词", "生成标签", "生成平台文案"];
  var COPILOT_RESULTS = {
    "分析选题": "选题判断：匹配度 94，热度上升中，窗口期约 3 天。竞争内容多为开发者视角，你用「内容创作者」视角切入有差异化。建议做。",
    "寻找创作角度": "3 个可选角度：① 实测派：我真的跑了 3 个代理 ② 算账派：省下的时间值多少钱 ③ 反常识：代理越多越乱？我的分工原则。推荐 ①，最贴合你的人设。",
    "优化标题": "候选：「我让 3 个 AI 同时打工，结果有点意外」/「一个人 = 一个团队？AI 子代理实测 7 天」/「别再单个用 AI 了，并行才是正确姿势」。第一个点击潜力最高（92）。",
    "优化开头": "开头 3 秒钩子建议：直接展示结果画面 + 一句反差——「这条视频从选题到发布，我只动了 3 次手。」",
    "生成口播": "（90 秒口播稿）0-3s 钩子：「这条内容我只动了 3 次手。」3-15s 冲突：以前一篇内容要切 5 个工具……15-70s 主体：第一步……70-90s 行动：提示词模板我放在评论区。",
    "改短": "已精简到 60 秒版本：删除第二案例，保留一个最强对比。金句保留：「工具是杠杆，流程才是复利。」",
    "改长": "已扩展为 3 分钟版本：增加「代理分工表」和「翻车时刻」两个段落，真实感更强。",
    "改口语化": "已改写：去掉「赋能」「闭环」，换成「帮我干活」「一整套流程顺下来」。读一遍，像说话就是对的。",
    "提炼金句": "① 工具是杠杆，流程才是复利。② 一个人最快的扩张方式，是学会给 AI 派活。③ 你不是缺时间，是缺一条流水线。",
    "生成视频分镜": "分镜 1（0-3s）：屏幕录制，3 个窗口同时输出｜分镜 2（3-15s）：对比旧流程手绘图｜分镜 3（15-60s）：逐步演示｜分镜 4（60-90s）：成果展示 + 行动指令。",
    "生成配图提示词": "小黑人线稿风格：flat hand-drawn minimal line art, a small black figure juggling three glowing stars, warm healing, white background --ar 4:5",
    "生成封面提示词": "封面：左文右图，大标题「3 个 AI 同时打工」，奶油底 + 星星黄强调色，小黑人托腮看三块屏幕。",
    "生成标签": "#AI工具 #一人公司 #ClaudeCode #效率 #自媒体 #AI代理 #内容创作",
    "生成平台文案": "小红书版：姐妹们，我真的让 3 个 AI 同时给我打工了……（800 字，含 emoji 分段与 5 个话题标签）"
  };
  function studioTopicOptions(selectedId) {
    var topics = D.getExtraTopics();
    return '<option value="">手动填写新选题</option>' + topics.map(function (topic) {
      return '<option value="' + esc(topic.id) + '"' + (selectedId === topic.id ? " selected" : "") + '>' + esc(topic.title) + "</option>";
    }).join("");
  }
  function studioField(label, id, placeholder, value, rows) {
    return '<label class="studio-field"><span>' + label + '</span><textarea id="' + id + '" rows="' + rows + '" placeholder="' + placeholder + '">' + esc(value || "") + '</textarea></label>';
  }
  function draftLibrary() {
    var drafts = D.getStudioDrafts();
    if (!drafts.length) return emptyTip("初稿库还是空的。完成内容后点击“确认进入初稿库”即可收录。");
    return '<div class="draft-library">' + drafts.map(function (draft) {
      var title = draft.title || draft.topic || "未命名初稿";
      var filled = [draft.body, draft.douyin, draft.xiaohongshu, draft.wechatChannels, draft.coverTitle].filter(Boolean).length;
      var linkedContent = D.getContentByDraftId(draft.id);
      return '<article class="card draft-card"><div class="draft-card-head"><div><div class="topic-title">' + esc(title) + '</div><div class="mini-sub">选题：' + esc(draft.topic || "未填写") + '</div></div><span class="tag tag-yellow">' + filled + '/5 已填写</span></div>' +
        '<div class="draft-preview">' + esc((draft.body || "暂无正文").slice(0, 110)) + (draft.body && draft.body.length > 110 ? "…" : "") + '</div>' +
        '<div class="topic-meta"><span>更新于 ' + new Date(draft.updatedAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) + '</span><span class="tag">抖音</span><span class="tag">小红书</span><span class="tag">视频号</span></div>' +
        '<div class="topic-actions"><button class="btn btn-accent btn-sm" data-act="draft-edit" data-id="' + draft.id + '">' + icon("pen") + '继续编辑</button><button class="btn btn-soft btn-sm" data-act="draft-promote" data-id="' + draft.id + '">' + (linkedContent ? "查看自媒体内容" : "进入自媒体中心") + '</button><button class="btn btn-ghost btn-sm" data-act="draft-remove" data-id="' + draft.id + '" style="color:var(--danger)">删除</button></div></article>';
    }).join("") + "</div>";
  }
  function viewStudio() {
    var sessionSeed = null;
    try { sessionSeed = JSON.parse(sessionStorage.getItem("yoyo_studio_seed") || "null"); } catch (e) {}
    if (sessionSeed) sessionStorage.removeItem("yoyo_studio_seed");
    var seed = sessionSeed || D.getStudioWorkingDraft();
    var isDraft = !!(seed && (seed.updatedAt || seed.workingCopy));
    var draftId = isDraft && seed.id ? seed.id : "";
    var selectedId = seed && (seed.topicId || seed.id) ? (seed.topicId || seed.id) : "";
    var seedTopic = seed ? (seed.topic || seed.title || "") : "";
    var seedBody = seed && seed.body ? seed.body : (seed && seed.angle ? "创作角度：" + seed.angle + "\n\n" : "");
    var studioReturn = sessionStorage.getItem("yoyo_studio_return") || "drafts";
    var workingMessage = seed && seed.workingCopy ? "已恢复上次自动暂存的内容" : (isDraft ? "正在编辑初稿库内容" : "输入会自动暂存，确认后才进入初稿库");
    var html = '<section class="sec studio-page-head"><div><div class="studio-title-row"><div class="greet-title" style="font-size:28px">AI 创作台</div>' +
      '<div class="studio-library-links"><button class="studio-library-btn' + (S.studioTab === "topics" ? " on" : "") + '" data-act="studio-tab" data-v="topics">话题库 <span class="nav-count">' + D.getExtraTopics().length + '</span></button>' +
      '<button class="studio-library-btn' + (S.studioTab === "drafts" ? " on" : "") + '" data-act="studio-tab" data-v="drafts">初稿库 <span class="nav-count">' + D.getStudioDrafts().length + '</span></button></div></div>' +
      '<div class="greet-tip">选定一个题，再生成或手动完成整套发布内容。</div></div></section>';
    if (S.studioTab === "topics") return html + '<button class="btn btn-ghost studio-back" data-act="studio-tab" data-v="create">← 返回创作</button>' + mediaTopics();
    if (S.studioTab === "drafts") return html + '<button class="btn btn-ghost studio-back" data-act="studio-tab" data-v="create">← 返回创作</button>' + draftLibrary();
    if (draftId) html += '<button class="btn btn-ghost studio-back" data-act="studio-return" data-v="' + (studioReturn === "media" ? "media" : "drafts") + '">← 返回' + (studioReturn === "media" ? "自媒体中心" : "初稿库") + '</button>';
    html += '<section class="card studio-topic-picker"><div><div class="mini-label">' + icon("bookmark") + '第一步 · 选择选题</div>' +
      '<select class="input" id="studioTopicSelect"><option value="">手动填写新选题</option>' + studioTopicOptions(selectedId).replace('<option value="">手动填写新选题</option>', "") + '</select>' +
      '<input class="input" id="studioTopic" placeholder="输入你的选题" value="' + esc(seedTopic).replace(/"/g, "&quot;") + '"></div>' +
      '<div class="studio-topic-actions"><button class="btn btn-accent" data-act="studio-generate">' + icon("sparkle") + 'AI 生成整套内容</button><div class="mini-sub">没有配置 AI 也可以手动填写并保存</div></div></section>';

    html += '<div class="studio-delivery-grid"><section class="studio-fields">' +
      studioField("标题", "studioTitle", "填写或生成内容标题", (isDraft || (seed && seed.body)) ? seed.title : "", 2) +
      studioField("正文 / 口播母稿", "studioEditor", "填写完整正文或口播稿", seedBody, 10) +
      studioField("抖音发布文案", "studioDouyin", "短钩子、正文、话题标签", isDraft ? seed.douyin : "", 6) +
      studioField("小红书发布文案", "studioXhs", "标题、正文、话题标签", isDraft ? seed.xiaohongshu : "", 7) +
      studioField("视频号发布文案", "studioWechat", "简洁说明、价值点、话题标签", isDraft ? seed.wechatChannels : "", 6) +
      '<div class="studio-save-row"><button class="btn btn-primary" data-act="studio-save">' + (draftId ? "确认更新初稿" : "确认进入初稿库") + '</button><button class="btn btn-ghost" data-act="studio-clear">清空</button><span class="mini-sub" id="studioSaveState"' + (draftId ? ' data-draft-id="' + esc(draftId) + '"' : "") + '>' + workingMessage + '</span></div></section>' +
      '<aside class="studio-cover-panel"><div class="card"><div class="sec-title" style="font-size:16px">封面图</div><div class="mini-sub">文字与视觉描述均可手动修改</div>' +
      '<label class="studio-field"><span>封面大标题</span><input id="studioCoverTitle" class="input" placeholder="一句有冲击力的话" value="' + esc(isDraft ? seed.coverTitle : "").replace(/"/g, "&quot;") + '"></label>' +
      '<label class="studio-field"><span>封面副标题</span><input id="studioCoverSubtitle" class="input" placeholder="补充结果或场景" value="' + esc(isDraft ? seed.coverSubtitle : "").replace(/"/g, "&quot;") + '"></label>' +
      studioField("封面视觉描述", "studioCoverBrief", "人物动作、场景、配色、构图", isDraft ? seed.coverBrief : "", 5) +
      '<div class="cover-preview" id="coverPreview"><span class="mascot cover-yoyo" data-mascot></span><div><strong id="coverPreviewTitle">' + esc(isDraft && seed.coverTitle ? seed.coverTitle : "封面标题") + '</strong><small id="coverPreviewSubtitle">' + esc(isDraft && seed.coverSubtitle ? seed.coverSubtitle : "封面副标题") + '</small></div></div>' +
      '<div class="cover-download-row"><button class="btn btn-soft" data-act="cover-download">生成封面 PNG</button><a class="btn btn-accent" id="coverDownloadLink" hidden>下载封面 PNG</a></div></div></aside></div>';
    return html;
  }
  function titleLab() {
    var myTitles = D.getMyTitles();
    var html = '<div class="card" style="margin-top:18px"><div class="sec-head" style="margin-bottom:10px"><div class="sec-title" style="font-size:16px">标题实验室</div><div class="sec-note">一键生成 4 平台 × 多风格标题</div></div>' +
      '<div style="display:flex;gap:8px"><input class="input" id="titleInput" placeholder="输入内容主题，例如：AI 子代理并行实测" style="height:40px;font-size:14px">' +
      '<button class="btn btn-accent btn-sm" data-act="gen-titles" style="height:40px">生成标题</button></div>' +
      '<div id="titleResults"></div></div>';
    html += '<div class="card" style="margin-top:14px"><div class="sec-head" style="margin-bottom:10px"><div class="sec-title" style="font-size:16px">我的标题库</div><div class="sec-note">' + (D.titleBank.length + myTitles.length) + ' 条</div></div>' +
      (myTitles.length + D.titleBank.length ? myTitles.concat(D.titleBank).map(function (t) {
        return '<div class="title-row"><div style="flex:1"><div style="font-weight:600;font-size:13.5px">' + esc(t.text) + '</div>' +
          '<div class="topic-meta" style="margin-top:4px"><span class="tag tag-red">' + t.platform + '</span><span class="tag tag-yellow">' + t.style + "</span>" +
          (t.perf ? '<span style="color:var(--up);font-weight:600">' + t.perf + "</span>" : "") + "</div></div>" +
          '<div class="title-scores"><span>点击 ' + t.scores.click + "</span><span>密度 " + t.scores.density + "</span><span>情绪 " + t.scores.emotion + "</span><span>匹配 " + t.scores.match + "</span></div></div>";
      }).join("") : '<div class="empty-sub">暂无标题</div>') + "</div>";
    return html;
  }

  /* ============ 视图：素材库 ============ */
  function viewAssets() {
    var captureRouteLabel = { asset: "素材", task: "待办", topic: "话题", knowledge: "知识", idea: "灵感" };
    var captureAssets = D.getCaptures().map(function (capture) {
      var stamp = new Date(capture.createdAt);
      return {
        id: capture.id,
        title: capture.title || capture.text,
        type: capture.type || "灵感",
        platform: capture.platform || "",
        url: capture.url || "",
        content: capture.content || "",
        author: capture.author || "",
        publisher: capture.publisher || "",
        publishedAt: capture.publishedAt || "",
        description: capture.description || "",
        coverImage: capture.coverImage || "",
        imageKey: capture.imageKey || "",
        tags: (capture.tags || []).concat([captureRouteLabel[capture.routedTo] || "快速记录"]),
        note: capture.note || "来自快速记录",
        date: isNaN(stamp.getTime()) ? "" : stamp.toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        fav: false,
        capture: true
      };
    });
    var knowledgeAssets = D.knowledge.map(function (item) {
      return {
        id: "knowledge-" + item.id,
        title: item.title,
        type: "知识",
        tags: item.tags || [],
        note: item.summary || "",
        date: item.updated ? item.updated + " 更新" : "",
        source: item.source || "知识库",
        fav: false,
        knowledge: true
      };
    });
    var allAssets = captureAssets.concat(knowledgeAssets, D.assets);
    var assetQuery = S.assetSearch.trim().toLowerCase();
    var list = allAssets.filter(function (a) {
      if (S.favOnly && !a.fav) return false;
      if (S.assetType !== "全部" && a.type !== S.assetType) return false;
      var searchable = [a.title, a.type, a.platform, a.url, a.content, a.author, a.publisher, a.description, a.note].concat(a.tags || []).join(" ").toLowerCase();
      return !assetQuery || searchable.indexOf(assetQuery) > -1;
    });
    var html = pageHead("素材库", "灵感、知识、图片和视频等创作资产统一放在这里。");
    html += '<div class="asset-entry-bar"><label class="asset-search"><span class="nav-ico" data-icon="search"></span><input class="input" id="assetSearch" value="' + esc(S.assetSearch).replace(/"/g, "&quot;") + '" placeholder="搜索标题、链接、标签或文字…"></label><button class="btn btn-accent" data-act="asset-add">' + icon("plus") + '新增记录</button></div>';
    html += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
      filterChips(ASSET_TYPES, S.assetType, "asset-filter") +
      '<div style="margin-left:auto;display:flex;gap:8px">' +
      '<button class="chip' + (S.favOnly ? " on" : "") + '" data-act="asset-fav-only">' + icon("heart") + "只看收藏</button>" +
      '<div class="seg">' +
      '<button class="seg-btn' + (S.assetView === "grid" ? " on" : "") + '" data-act="asset-view" data-v="grid">' + icon("grid") + "网格</button>" +
      '<button class="seg-btn' + (S.assetView === "list" ? " on" : "") + '" data-act="asset-view" data-v="list">' + icon("list") + "列表</button>" +
      "</div></div></div>";

    if (S.assetView === "grid") {
      html += '<div class="asset-grid">' + (list.length ? list.map(function (a) {
        var color = ASSET_COLOR[a.type] || "#B0A897";
        var imageSrc = a.imageKey ? D.getCaptureImage(a.imageKey) : (a.coverImage || "");
        var titleHtml = a.url ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener" class="asset-title-link">' + esc(a.title) + ' ↗</a>' : esc(a.title);
        return '<div class="card card-hover" style="padding:0;overflow:hidden">' +
          '<div class="asset-thumb" style="background:' + color + '22;color:' + color + '">' + (imageSrc ? '<img src="' + attr(imageSrc) + '" alt="' + attr(a.title) + '">' : icon(ASSET_ICON[a.type] || "file")) + "</div>" +
          '<div style="padding:12px 14px"><div data-asset-id="' + esc(a.id) + '" style="font-weight:650;font-size:13px;line-height:1.5">' + titleHtml + "</div>" +
          (a.description || a.content ? '<div class="asset-text-preview">' + esc(a.description || a.content) + '</div>' : '') +
          '<div class="topic-meta" style="margin-top:6px"><span class="tag">' + esc(a.type) + "</span>" + (a.platform ? '<span class="tag tag-red">' + esc(a.platform) + '</span>' : '') + (a.tags || []).map(function (g) { return '<span class="tag tag-pink">' + esc(g) + "</span>"; }).join("") + "</div>" +
          '<div style="display:flex;align-items:center;margin-top:8px"><span style="font-size:11.5px;color:var(--ink-3)">' + esc(a.date) + (a.note ? " · " + esc(a.note) : "") + "</span>" +
          (a.capture ? '<div class="asset-idea-actions"><button class="btn btn-soft btn-sm" data-act="capture-to-topic" data-id="' + a.id + '">' + icon("bookmark") + '加入选题库</button><a class="btn btn-accent btn-sm" href="#/studio" data-act="capture-create" data-id="' + a.id + '">' + icon("pen") + '开始创作</a></div>' : a.knowledge ? '<div class="asset-idea-actions"><button class="btn btn-soft btn-sm" data-act="k-summary">AI 总结</button><button class="btn btn-ghost btn-sm" data-act="k-link">关联内容</button></div>' : '<button class="icon-btn" style="width:28px;height:28px;margin-left:auto;' + (a.fav ? "color:var(--red)" : "") + '" data-act="asset-fav" data-id="' + a.id + '">' + icon("heart") + "</button>") + "</div>" +
          "</div></div>";
      }).join("") : emptyTip(S.assetType === "灵感" ? "还没有灵感，先去首页快速记录一条" : "这个筛选下暂无素材")) + "</div>";
    } else {
      html += '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>素材</th><th>类型</th><th>标签</th><th>备注</th><th>日期</th><th></th></tr></thead><tbody>' +
        (list.length ? list.map(function (a) {
          return '<tr><td style="font-weight:600">' + (a.url ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.title) + ' ↗</a>' : esc(a.title)) + "</td><td>" + esc(a.type) + "</td><td>" + (a.tags || []).map(esc).join(" / ") + "</td><td>" + esc(a.note || a.content || "—") + "</td><td>" + esc(a.date) + "</td><td>" + (a.capture ? '<button class="btn btn-soft btn-sm" data-act="capture-to-topic" data-id="' + a.id + '">加入选题库</button>' : a.knowledge ? '<button class="btn btn-soft btn-sm" data-act="k-summary">AI 总结</button>' : '<button class="btn btn-ghost btn-sm" data-act="asset-fav" data-id="' + a.id + '">' + (a.fav ? "已收藏" : "收藏") + "</button>") + "</td></tr>";
        }).join("") : '<tr><td colspan="6"><div class="empty-sub" style="padding:24px;text-align:center">暂无素材</div></td></tr>') + "</tbody></table></div>";
    }
    return html;
  }

  /* ============ 视图：内容日历 ============ */
  function viewCalendar() {
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var html = pageHead("内容日历", (y) + " 年 " + (m + 1) + " 月 · 拖拽排期将在下一阶段开放。");
    html += '<div class="seg" style="margin-bottom:14px">' +
      '<button class="seg-btn' + (S.calMode === "month" ? " on" : "") + '" data-act="cal-mode" data-v="month">' + icon("calendar") + "月视图</button>" +
      '<button class="seg-btn' + (S.calMode === "list" ? " on" : "") + '" data-act="cal-mode" data-v="list">' + icon("list") + "列表视图</button></div>";

    if (S.calMode === "list") {
      var sorted = D.contents.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      html += '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>日期</th><th>内容</th><th>平台</th><th>状态</th><th>素材</th></tr></thead><tbody>' +
        sorted.map(function (c) {
          return "<tr><td class=\"num\">" + c.date.slice(5) + '</td><td style="max-width:320px;font-weight:600">' + c.title + "</td><td>" + c.platform + '</td><td><span class="status ' + CSTATUS[c.status].cls + '">' + CSTATUS[c.status].label + "</span></td><td>" +
            (c.metrics ? "—" : '<div class="pipe-bar" style="width:80px;display:inline-block;vertical-align:middle"><i style="width:' + (c.assetsReady || 0) + '%;background:var(--yellow)"></i></div> <span class="num" style="font-size:12px">' + (c.assetsReady || 0) + "%</span>") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      return html;
    }

    var first = new Date(y, m, 1);
    var startDay = (first.getDay() + 6) % 7; /* 周一开头 */
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var todayDate = now.getDate();
    var byDate = {};
    D.contents.forEach(function (c) {
      var d = parseInt(c.date.slice(8), 10);
      var cm = parseInt(c.date.slice(5, 7), 10);
      if (cm === m + 1) (byDate[d] = byDate[d] || []).push(c);
    });
    html += '<div class="cal"><div class="cal-grid">' +
      ["一", "二", "三", "四", "五", "六", "日"].map(function (d) { return '<div class="cal-dow">' + d + "</div>"; }).join("");
    for (var i = 0; i < startDay; i++) html += '<div class="cal-cell off"></div>';
    for (var d2 = 1; d2 <= daysInMonth; d2++) {
      var evts = byDate[d2] || [];
      html += '<div class="cal-cell' + (d2 === todayDate ? " today" : "") + '"><div class="cal-date">' + d2 + "</div>" +
        evts.map(function (c) {
          return '<div class="cal-event" data-act="cal-event" data-id="' + c.id + '" style="background:var(--' + statusColor(c.status) + '-soft)"><span class="cal-dot" style="background:var(--' + statusColor(c.status) + ')"></span>' + c.platform + "</div>";
        }).join("") + "</div>";
    }
    html += "</div></div>";
    html += '<div style="display:flex;gap:14px;margin-top:12px;flex-wrap:wrap">' +
      Object.keys(CSTATUS).map(function (k) {
        return '<span class="status ' + CSTATUS[k].cls + '">' + CSTATUS[k].label + "</span>";
      }).join("") + "</div>";
    return html;
  }
  function statusColor(st) {
    return { idea: "pink", draft: "yellow", ready: "lime", scheduled: "blue", published: "lime", review: "orange" }[st] || "yellow";
  }

  /* ============ 自媒体中心：数据复盘 ============ */
  function platformAnalyticsStatus() {
    if (PA.syncing) return "正在从已登录的创作者后台同步…";
    if (PA.error) return "部分同步异常：" + PA.error;
    if (PA.updatedAt) return "云端数据更新于 " + new Date(PA.updatedAt).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    if (PA.loading) return "正在读取云端平台数据…";
    return "尚未同步平台数据";
  }

  function automaticPlatformSection() {
    var snapshots = [PA.platforms.douyin, PA.platforms.xiaohongshu].filter(Boolean);
    var html = '<div class="card platform-sync-card"><div class="platform-sync-copy"><div style="font-weight:700">平台数据自动同步</div>' +
      '<div class="mini-sub">电脑读取已登录的抖音、小红书创作者后台，只把作品统计写入云端；手机端直接查看。</div>' +
      '<div class="platform-sync-status">' + esc(platformAnalyticsStatus()) + '</div></div>' +
      '<button class="btn btn-accent btn-sm" data-act="platform-sync"' + (PA.syncing ? ' disabled aria-busy="true"' : '') + '>' + icon("refresh") + (PA.syncing ? "同步中…" : "立即同步") + '</button></div>';
    if (!snapshots.length) return html + emptyTip("尚无自动同步数据。完成本机同步器安装后，打开工作台会每天自动同步一次。") + '<div class="manual-import-note"><button class="btn btn-soft btn-sm" data-act="review-import">保留手动导入备用</button><input type="file" id="reviewImportFile" accept=".csv,.json" style="display:none"></div>';

    html += '<div class="grid grid-2 platform-summary-grid">' + snapshots.map(function (snapshot) {
      var m = snapshot.summary || {};
      return '<article class="card platform-summary"><div class="platform-summary-head"><div><span class="tag tag-' + (snapshot.platform === "douyin" ? "blue" : "red") + '">' + platformName(snapshot.platform) + '</span><strong>' + esc(snapshot.accountName || "已连接账号") + '</strong></div><span class="mini-sub">' + esc(snapshot.period || "最近同步") + '</span></div>' +
        '<div class="platform-summary-metrics"><span><b class="num">' + fmtNum(m.views || 0) + '</b>观看</span><span><b class="num">' + fmtNum(m.likes || 0) + '</b>点赞</span><span><b class="num">' + fmtNum(m.comments || 0) + '</b>评论</span><span><b class="num">' + fmtNum(m.saves || 0) + '</b>收藏</span><span><b class="num">' + fmtNum(m.followerGain || 0) + '</b>净涨粉</span></div>' +
        '<div class="mini-sub">采集于 ' + new Date(snapshot.syncedAt).toLocaleString("zh-CN") + ' · ' + (snapshot.works || []).length + ' 条作品</div></article>';
    }).join("") + "</div>";

    var works = [];
    snapshots.forEach(function (snapshot) {
      (snapshot.works || []).forEach(function (work) { works.push(Object.assign({ platform: snapshot.platform }, work)); });
    });
    works.sort(function (a, b) { return String(b.publishedAt).localeCompare(String(a.publishedAt)); });
    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">自动同步作品</div><div class="sec-note">最近 ' + Math.min(works.length, 100) + ' 条</div></div>' +
      '<div class="card platform-work-table" style="padding:8px 0"><table class="table"><thead><tr><th>内容</th><th>平台</th><th>日期</th><th>观看</th><th>点赞</th><th>评论</th><th>收藏</th><th>分享</th></tr></thead><tbody>' + works.slice(0, 100).map(function (work) {
        var metrics = work.metrics || {};
        return '<tr><td style="max-width:320px;font-weight:600">' + esc(work.title) + '</td><td>' + platformName(work.platform) + '</td><td>' + esc((work.publishedAt || "—").slice(0, 10)) + '</td><td class="num">' + fmtNum(metrics.views || 0) + '</td><td class="num">' + fmtNum(metrics.likes || 0) + '</td><td class="num">' + fmtNum(metrics.comments || 0) + '</td><td class="num">' + fmtNum(metrics.saves || 0) + '</td><td class="num">' + fmtNum(metrics.shares || 0) + '</td></tr>';
      }).join("") + '</tbody></table></div><div class="manual-import-note"><button class="btn btn-ghost btn-sm" data-act="review-import">手动导入备用</button><input type="file" id="reviewImportFile" accept=".csv,.json" style="display:none"></div>';
    return html;
  }

  function mediaAnalytics() {
    var s = D.stats;
    var pub = D.contents.filter(function (c) { return c.metrics; }).sort(function (a, b) { return b.metrics.views - a.metrics.views; });
    if (!PA.loaded && !PA.loading) loadPlatformAnalytics();
    var html = automaticPlatformSection();
    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">工作台内容复盘</div><div class="sec-note">自动同步数据与工作台发布记录分开保存</div></div>';
    html += '<div class="grid grid-4">' +
      metricCard("近 7 天发布", s.weekPosts, "条", "") +
      metricCard("总播放", s.views, "", s.viewsDelta) +
      metricCard("互动", s.engagement, "", s.engagementDelta) +
      metricCard("收藏", s.saves, "", s.savesDelta) +
      "</div>";
    html += '<div class="grid grid-2" style="margin-top:14px">' +
      '<div class="card"><div class="mini-label" style="margin-bottom:10px">每日播放 · 近 7 天</div>' + barChart(s.bars) + "</div>" +
      '<div class="card"><div class="mini-label" style="margin-bottom:10px">涨粉趋势</div>' + sparkline([0, 0, 0, 0, 0, 0, 0], "#F04E45") +
      '<div class="mini-sub" style="margin-top:8px">暂无真实涨粉数据</div></div></div>';

    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">AI 分析</div><div class="sec-note">每周自动生成</div></div>' +
      '<div class="grid grid-2">' +
      (D.aiInsights.length ? D.aiInsights.map(function (i) {
        return '<div class="card card-mini"><div class="mini-label"><span class="tag tag-' + i.tone + '">' + i.title + '</span></div><div style="font-size:13px;color:var(--ink-2);margin-top:8px;line-height:1.7">' + i.text + "</div></div>";
      }).join("") : emptyTip("暂无真实数据，暂不生成分析")) + "</div>";

    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">内容排行榜 TOP 10</div><div class="sec-note">按播放排序</div></div>' +
      '<div class="card" style="padding:8px 0"><table class="table"><thead><tr><th>#</th><th>内容</th><th>平台</th><th>播放</th><th>互动率</th><th>收藏</th><th>涨粉</th><th>等级</th><th></th></tr></thead><tbody>' +
      pub.map(function (c, i) {
        var rate = c.metrics.views > 0 ? ((c.metrics.likes + c.metrics.comments + c.metrics.saves) / c.metrics.views * 100).toFixed(1) : "0.0";
        var rankColor = i === 0 ? "var(--red)" : i < 3 ? "var(--yellow)" : "var(--ink-3)";
        return '<tr><td class="num" style="font-weight:800;color:' + rankColor + '">' + (i + 1) + '</td><td style="max-width:300px;font-weight:600">' + c.title + "</td><td>" + c.platform + '</td><td class="num">' + fmtNum(c.metrics.views) + '</td><td class="num">' + rate + '%</td><td class="num">' + fmtNum(c.metrics.saves) + '</td><td class="num" style="color:var(--up)">+' + c.metrics.fans + "</td><td>" + gradeTag(c.grade) + '</td><td><button class="btn btn-soft btn-sm" data-act="ai-review" data-id="' + c.id + '">AI 复盘</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    return html;
  }

  /* ============ 视图：AI 助手页 ============ */
  function viewAi() {
    return pageHead("AI 助手", "它住在右下角，感知你所在的每个页面。") +
      '<div class="empty"><span class="mascot empty-mascot" data-mascot></span>' +
      '<div class="empty-title">点击右下角的黄色按钮，随时召唤我</div>' +
      '<div class="empty-sub">在话题页我会帮你判断选题值不值得做；在创作页帮你精简口播；在数据页帮你分析播放为什么下降。配置 DeepSeek API Key 后（设置页），我将基于你工作台的真实数据回答。</div>' +
      '<div style="margin-top:8px"><button class="btn btn-accent" data-act="ask-ai">' + "打开 AI 面板</button></div></div>";
  }

  /* ============ 视图：设置 ============ */
  function viewSettings() {
    var me = D.getSettings();
    var caps = D.getCaptures();
    var accountName = YOYO.account ? YOYO.account.username : "个人账号";
    var cloudEnabled = YOYO.cloud && YOYO.cloud.state.enabled;
    var cloudStatus = YOYO.cloud ? YOYO.cloud.statusText() : "本地数据";
    return pageHead("设置", "") +
      '<div class="grid grid-2">' +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">个人账号</div>' +
      '<div style="display:flex;align-items:center;gap:12px"><span class="mascot avatar" data-mascot></span><div style="flex:1"><div data-account-name style="font-weight:700">' + esc(accountName) + '</div><div class="mini-sub" data-cloud-status>' + esc(cloudStatus) + '</div></div>' +
      (YOYO.account && YOYO.account.enabled ? '<button class="btn btn-soft btn-sm" data-act="account-logout">退出登录</button>' : '<span class="tag">本地预览</span>') + '</div></div>' +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">个人资料</div>' +
      '<div class="mini-label" style="margin-bottom:6px">称呼（首页问候语使用）</div>' +
      '<div style="display:flex;gap:8px"><input class="input" id="setName" value="' + esc(me.name) + '" style="font-size:14px">' +
      '<button class="btn btn-primary btn-sm" data-act="set-save" style="height:42px">保存</button></div></div>' +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">AI 配置 · DeepSeek</div>' +
      '<div class="mini-label" style="margin-bottom:6px">API Key（<a href="https://platform.deepseek.com" target="_blank" style="color:var(--red);text-decoration:underline">platform.deepseek.com</a> 免费注册获取）</div>' +
      '<div style="display:flex;gap:8px"><input class="input" id="setKey" type="password" placeholder="sk-..." value="' + esc(me.aiKey || "") + '" style="font-size:14px">' +
      '<button class="btn btn-primary btn-sm" data-act="set-save-key" style="height:42px">保存</button>' +
      '<button class="btn btn-soft btn-sm" data-act="set-test-key" style="height:42px">测试连接</button></div>' +
      '<div style="font-size:12px;color:var(--ink-3);margin-top:8px">Key 只保存在你自己的浏览器本地，直连 DeepSeek，不经过任何第三方。当前状态：' +
      (aiReady() ? '<b style="color:#5E7A1F">已配置 ✓ 所有 AI 功能已激活</b>' : '<b style="color:var(--apricot,#b06a3a)">未配置 · AI 功能不可用</b>') + "</div></div>" +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">数据安全</div>' +
      '<div style="font-size:13px;color:var(--ink-2);margin-bottom:12px">' + (cloudEnabled ? '修改后自动上传，每 30 秒检查其他设备的更新；同时修改会自动合并并保留冲突备份。' : '当前是本地预览，数据保存在这台设备的浏览器中。') + '已记录 ' + caps.length + ' 条快速记录。' + (cloudEnabled && YOYO.cloud.state.conflictCount ? '历史冲突记录 ' + YOYO.cloud.state.conflictCount + ' 次。' : '') + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      (cloudEnabled ? '<button class="btn btn-soft btn-sm" data-act="sync-now">' + icon("refresh") + "立即同步</button>" : "") +
      '<button class="btn btn-soft btn-sm" data-act="set-export">' + icon("download") + "导出 JSON 备份</button>" +
      '<button class="btn btn-soft btn-sm" data-act="set-copy">' + icon("copy") + "复制 JSON 备份</button>" +
      '<button class="btn btn-soft btn-sm" data-act="set-import">' + icon("upload") + "导入恢复</button>" +
      '<button class="btn btn-ghost btn-sm" data-act="set-clear" style="color:var(--danger)">' + icon("trash") + "清空数据</button>" +
      '</div><textarea id="backupText" class="input" readonly hidden aria-label="JSON 备份" style="min-height:120px;margin-top:10px;font-size:11px"></textarea><input type="file" id="importFile" accept=".json" style="display:none"></div>' +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">关于桃子工作台</div>' +
      '<div style="font-size:13px;color:var(--ink-2);line-height:1.8">AI 能力：DeepSeek ' + (YOYO.ai ? YOYO.ai.MODEL : "") + '（AI 面板 / Copilot / 复盘 / 标题实验室）<br>主题 IP：YOYO（红兜帽 × 星星黄斗篷）<br>业务数据默认留空，仅展示真实保存或实时获取的内容。</div></div>' +
      "</div>";
  }

  function emptyTip(text) {
    return '<div class="empty" style="grid-column:1/-1;padding:40px"><div class="empty-sub">' + text + "</div></div>";
  }

  /* ============ 路由 ============ */
  function currentRoute() {
    var h = location.hash.replace(/^#\//, "");
    if (h === "analytics") {
      S.mediaTab = "analytics";
      history.replaceState(null, "", "#/media");
      return "media";
    }
    if (h === "knowledge") {
      S.assetType = "知识";
      history.replaceState(null, "", "#/assets");
      return "assets";
    }
    return TITLES[h] ? h : "today";
  }
  function render() {
    var route = currentRoute();
    if (location.hash && !TITLES[location.hash.replace(/^#\//, "")]) {
      history.replaceState(null, "", "#/today");
    }
    document.getElementById("pageTitle").textContent = TITLES[route];
    var items = document.querySelectorAll(".nav-item[data-route]");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-route") === route);
    }
    var view = document.getElementById("view");
    var fn = { today: viewToday, media: viewMedia, studio: viewStudio, assets: viewAssets, calendar: viewCalendar, ai: viewAi, settings: viewSettings }[route];
    view.innerHTML = fn ? fn() : viewToday();
    hydrateIcons(view);
    hydrateMascots(view);
    updateAiContext(route);
    window.scrollTo(0, 0);
  }

  /* ============ AI 面板 ============ */
  var AI_HINTS = {
    today: ["今天最值得做什么？", "帮我安排今天的创作时间", "这周数据怎么样？"],
    media: ["这个话题值不值得做？", "帮我找 3 个新选题", "最近数据说明了什么？"],
    studio: ["帮我把口播精简到 90 秒", "优化这个标题", "生成 5 个开头"],
    default: ["帮我理一下今天的重点", "给我一个新选题灵感"]
  };
  var AI_CONTEXT = {
    today: "当前页面：首页 · 工作台会根据真实记录显示今日待办。",
    media: "当前页面：自媒体中心 · 我可以帮你评估话题、创作内容和复盘数据。",
    studio: "当前页面：创作台 · 我可以优化标题、开头、口播稿。",
    default: "我可以结合当前页面上下文帮你分析。"
  };
  function updateAiContext(route) {
    document.getElementById("aiContext").textContent = AI_CONTEXT[route] || AI_CONTEXT.default;
    var hints = AI_HINTS[route] || AI_HINTS.default;
    document.getElementById("aiChips").innerHTML = hints.map(function (h) {
      return '<button class="ai-chip" data-ask="' + h + '">' + h + "</button>";
    }).join("");
  }
  function aiReply(q) {
    var body = document.getElementById("aiBody");
    body.insertAdjacentHTML("beforeend", '<div class="ai-msg user">' + esc(q) + "</div>");
    body.scrollTop = body.scrollHeight;

    if (aiReady()) {
      var route = currentRoute();
      var ctx = "用户当前在「" + TITLES[route] + "」页面。" +
        "工作台当前数据概况：今日待办 " + D.tasks.length + " 条；流水线内容 " + D.pipeline.map(function (p) { return p.label + " " + p.count; }).join("、") +
        "；近7天总播放 " + D.stats.views + "、涨粉 " + D.stats.fans +
        (D.stats.best ? "；表现最好内容「" + D.stats.best.title + "」（" + D.stats.best.platform + " " + D.stats.best.views + " 播放）。" : "；目前没有发布表现数据。");
      body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot" data-typing>桃子助手正在思考…</div>');
      body.scrollTop = body.scrollHeight;
      YOYO.ai.ask(ctx + "\n\n用户的问题：" + q, function (err, text) {
        var typing = body.querySelector("[data-typing]");
        if (typing) typing.remove();
        body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">' + (err ? "出错了：" + esc(err) : fmt(text)) + "</div>");
        body.scrollTop = body.scrollHeight;
      });
      return;
    }

    setTimeout(function () {
      body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">AI 尚未配置，无法基于真实数据回答。请先到「设置」配置并测试 API Key。</div>');
      body.scrollTop = body.scrollHeight;
    }, 400);
  }

  /* ============ 命令面板 ============ */
  var COMMANDS = [
    { label: "新建内容", type: "命令", go: "#/studio" },
    { label: "新建话题", type: "命令", go: "#/studio" },
    { label: "新建待办", type: "命令", go: "#/today" },
    { label: "问 AI", type: "命令", act: "ai" },
    { label: "快速记录", type: "命令", go: "#/today" }
  ];
  function openCmd() { document.getElementById("cmdOverlay").classList.add("open"); document.getElementById("cmdInput").value = ""; renderCmd(""); setTimeout(function () { document.getElementById("cmdInput").focus(); }, 30); }
  function closeCmd() { document.getElementById("cmdOverlay").classList.remove("open"); }
  function renderCmd(q) {
    q = q.trim().toLowerCase();
    var list = [];
    var cmds = COMMANDS.filter(function (c) { return !q || c.label.toLowerCase().indexOf(q) > -1; });
    if (cmds.length) list.push('<div class="cmd-group">快捷命令</div>' + cmds.map(function (c) {
      return '<div class="cmd-item" data-go="' + (c.go || "") + '" data-act="' + (c.act || "") + '"><span class="nav-ico">' + icon("zap") + "</span>" + c.label + '<span class="cmd-type">' + c.type + "</span></div>";
    }).join(""));
    var ts = D.topics.filter(function (t) { return q && (t.title.toLowerCase().indexOf(q) > -1 || t.tags.join("").toLowerCase().indexOf(q) > -1); });
    if (ts.length) list.push('<div class="cmd-group">话题</div>' + ts.map(function (t) {
      return '<div class="cmd-item" data-go="#/media"><span class="nav-ico">' + icon("media") + "</span>" + t.title + '<span class="cmd-type">话题</span></div>';
    }).join(""));
    var cts = D.contents.filter(function (c) { return q && c.title.toLowerCase().indexOf(q) > -1; });
    if (cts.length) list.push('<div class="cmd-group">内容</div>' + cts.map(function (c) {
      return '<div class="cmd-item" data-go="#/media"><span class="nav-ico">' + icon("file") + "</span>" + c.title + '<span class="cmd-type">内容</span></div>';
    }).join(""));
    document.getElementById("cmdList").innerHTML = list.length ? list.join("") : '<div class="cmd-empty">没有找到「' + esc(q) + "」相关内容</div>";
  }

  /* ============ Quick Capture ============ */
  function classifyCapture(text) {
    if (/^https?:\/\//i.test(text)) return { to: "素材库", key: "asset" };
    if (/提醒|待办|截止|回复/.test(text)) return { to: "待办", key: "task" };
    if (/选题|话题/.test(text)) return { to: "话题库", key: "topic" };
    if (/方法|流程|SOP|复盘/.test(text)) return { to: "知识库", key: "knowledge" };
    return { to: "灵感库", key: "idea" };
  }
  function doCapture() {
    var input = document.getElementById("captureInput");
    var text = (input.value || "").trim();
    if (!text) { toast("先写点什么再记下"); input.focus(); return; }
    var r = classifyCapture(text);
    var isUrl = /^https?:\/\//i.test(text);
    var platform = /xiaohongshu\.com|xhslink\.com/i.test(text) ? "小红书" : /douyin\.com|v\.douyin\.com/i.test(text) ? "抖音" : /weixin\.qq\.com|channels/i.test(text) ? "视频号" : "";
    D.saveCapture({ text: text, title: text, type: isUrl ? (platform ? "内容链接" : "网站") : "灵感", platform: platform, url: isUrl ? text : "", routedTo: r.key }, r.key);
    input.value = "";
    toast("已记入「" + r.to + "」");
  }

  function openAssetEditor() {
    document.getElementById("assetForm").reset();
    document.getElementById("assetParseStatus").className = "asset-parse-status";
    document.getElementById("assetParseStatus").textContent = "链接、图片、文字任选一种即可保存，平台和标题会自动识别。";
    document.getElementById("assetPreviewFields").hidden = true;
    document.getElementById("assetCoverPreview").hidden = true;
    document.getElementById("assetCoverPreview").replaceChildren();
    document.getElementById("assetOverlay").classList.add("open");
    setTimeout(function () { document.getElementById("assetUrl").focus(); }, 100);
  }
  function closeAssetEditor() { document.getElementById("assetOverlay").classList.remove("open"); }
  function updateAssetCoverPreview() {
    var box = document.getElementById("assetCoverPreview");
    var value = document.getElementById("assetCoverImage").value.trim();
    box.replaceChildren();
    if (!value) { box.hidden = true; return; }
    try {
      var parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
      var image = document.createElement("img");
      image.src = parsed.toString();
      image.alt = "网页封面预览";
      image.referrerPolicy = "no-referrer";
      image.onerror = function () { box.hidden = true; };
      box.appendChild(image);
      box.hidden = false;
    } catch (error) { box.hidden = true; }
  }
  function parseAssetLink() {
    var input = document.getElementById("assetUrl");
    var pastedText = input.value.trim();
    var url = D.extractSharedUrl(pastedText);
    var button = document.getElementById("assetParse");
    var status = document.getElementById("assetParseStatus");
    if (!url) { toast("分享文案中没有识别到网页链接"); return; }
    input.value = url;
    button.disabled = true;
    button.textContent = "解析中…";
    status.className = "asset-parse-status is-loading";
    status.textContent = "正在安全读取网页，通常需要几秒钟…";
    fetch("/api/link-preview", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url })
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) throw new Error(body.error || "暂时无法解析这个网页");
        return body.preview || {};
      });
    }).then(function (preview) {
      if (preview.url) document.getElementById("assetUrl").value = preview.url;
      if (preview.title) document.getElementById("assetTitle").value = preview.title;
      document.getElementById("assetAuthor").value = preview.author || "";
      document.getElementById("assetPublisher").value = preview.publisher || "";
      document.getElementById("assetPublishedAt").value = preview.publishedAt || "";
      document.getElementById("assetCoverImage").value = preview.image || "";
      document.getElementById("assetDescription").value = preview.description || "";
      document.getElementById("assetContent").value = preview.textContent || "";
      document.getElementById("assetPreviewFields").hidden = false;
      updateAssetCoverPreview();
      status.className = "asset-parse-status is-success";
      status.textContent = "解析完成。请检查并修改下方内容，点击“保存到素材库”后才会正式保存。";
    }).catch(function (error) {
      status.className = "asset-parse-status is-error";
      status.textContent = error.message + "。原链接仍保留，你可以手动填写后保存。";
    }).finally(function () {
      button.disabled = false;
      button.textContent = "智能解析";
    });
  }
  function platformFromAssetUrl(url) {
    if (/xiaohongshu\.com|xhslink\.com/i.test(url)) return "小红书";
    if (/douyin\.com|v\.douyin\.com/i.test(url)) return "抖音";
    if (/mp\.weixin\.qq\.com/i.test(url)) return "公众号";
    if (/channels|weixin\.qq\.com/i.test(url)) return "视频号";
    if (/bilibili\.com|b23\.tv/i.test(url)) return "B站";
    return "";
  }
  function compressCaptureImage(file, callback) {
    if (!file || !/^image\/(jpeg|png|webp)$/i.test(file.type)) { callback(new Error("请选择 JPG、PNG 或 WebP 图片")); return; }
    if (file.size > 10 * 1024 * 1024) { callback(new Error("图片不能超过 10MB")); return; }
    var reader = new FileReader();
    reader.onerror = function () { callback(new Error("图片读取失败")); };
    reader.onload = function () {
      var image = new Image();
      image.onerror = function () { callback(new Error("图片格式无法识别")); };
      image.onload = function () {
        var maxSides = [1200, 960, 720];
        var result = "";
        for (var i = 0; i < maxSides.length; i++) {
          var scale = Math.min(1, maxSides[i] / Math.max(image.naturalWidth, image.naturalHeight));
          var canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          result = canvas.toDataURL("image/webp", i === 0 ? 0.8 : 0.68);
          if (result.length < 360000) break;
        }
        if (result.length >= 480000) { callback(new Error("图片压缩后仍然过大，请选择尺寸更小的图片")); return; }
        callback(null, result);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  function saveCaptureEditor(event) {
    event.preventDefault();
    var title = document.getElementById("assetTitle").value.trim();
    var pastedText = document.getElementById("assetUrl").value.trim();
    var url = D.extractSharedUrl(pastedText);
    var manualText = document.getElementById("assetTextContent").value.trim();
    var extractedContent = document.getElementById("assetContent").value.trim();
    var content = manualText || extractedContent;
    var file = document.getElementById("assetImage").files[0];
    var platform = platformFromAssetUrl(url);
    if (!pastedText && !file && !manualText) { toast("请添加链接、图片或文字中的任意一种"); return; }
    if (pastedText && !url) { toast("分享文案中没有识别到网页链接"); return; }
    if (url) {
      try {
        var parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
        url = parsed.toString();
        document.getElementById("assetUrl").value = url;
        if (!title) title = parsed.hostname.replace(/^www\./, "");
      } catch (error) { toast("请填写有效的 http 或 https 链接"); return; }
    }
    var coverImage = url ? document.getElementById("assetCoverImage").value.trim() : "";
    if (coverImage) {
      try {
        var parsedCover = new URL(coverImage);
        if (parsedCover.protocol !== "http:" && parsedCover.protocol !== "https:") throw new Error();
        coverImage = parsedCover.toString();
      } catch (error) { toast("封面图片地址需要是有效的 http 或 https 链接"); return; }
    }
    if (!title) title = file ? file.name.replace(/\.[^.]+$/, "") : manualText.slice(0, 36) || "未命名记录";
    var type = url ? (platform ? "内容链接" : "网站") : file ? "图片" : "文字";
    var record = {
      title: title,
      text: content || url || title,
      type: type,
      platform: platform,
      url: url,
      content: content,
      author: url ? document.getElementById("assetAuthor").value.trim() : "",
      publisher: url ? document.getElementById("assetPublisher").value.trim() : "",
      publishedAt: url ? document.getElementById("assetPublishedAt").value.trim() : "",
      description: url ? document.getElementById("assetDescription").value.trim() : "",
      coverImage: coverImage,
      note: document.getElementById("assetNote").value.trim(),
      tags: document.getElementById("assetTags").value.split(/[,，]/).map(function (tag) { return tag.trim(); }).filter(Boolean),
      routedTo: "asset"
    };
    var saveButton = document.getElementById("assetSave");
    saveButton.disabled = true;
    saveButton.textContent = file ? "正在处理图片…" : "正在保存…";
    function finish(imageData) {
      D.saveCapture(record, "asset", imageData || "");
      closeAssetEditor();
      S.assetType = "全部";
      if (currentRoute() === "assets") render();
      D.syncNow().then(function () { toast("已通过快速记录保存到素材库"); }).catch(function () { toast("已保存在当前设备，云端稍后自动重试"); });
      saveButton.disabled = false;
      saveButton.textContent = "保存到素材库";
    }
    if (!file) { finish(""); return; }
    compressCaptureImage(file, function (error, imageData) {
      if (error) { saveButton.disabled = false; saveButton.textContent = "保存到素材库"; toast(error.message); return; }
      finish(imageData);
    });
  }

  function findCapture(id) {
    return D.getCaptures().filter(function (item) { return item.id === id; })[0] || null;
  }
  function captureAsTopic(capture) {
    if (!capture) return null;
    var sourceText = capture.content || capture.text || "";
    var topicTitle = (capture.title || sourceText.split(/\n+/).filter(Boolean)[0] || "未命名选题").trim().slice(0, 120);
    var topic = { id: "idea-" + capture.id, title: topicTitle, source: "素材库 · 快速记录", summary: sourceText.slice(0, 500), angle: "从这条真实灵感出发", platforms: ["抖音", "小红书", "视频号"], tags: ["个人灵感"] };
    D.saveTopic(topic);
    return topic;
  }
  function captureAsStudioSeed(capture) {
    var topic = captureAsTopic(capture);
    if (!topic) return null;
    var body = capture.content || ((capture.type === "文字" || capture.type === "灵感") ? capture.text : "") || "";
    return Object.assign({}, topic, {
      topicId: topic.id,
      topic: topic.title,
      title: capture.title || "",
      body: body
    });
  }
  function collectStudioDraft() {
    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
    return {
      id: document.getElementById("studioSaveState") && document.getElementById("studioSaveState").getAttribute("data-draft-id") || "",
      topicId: val("studioTopicSelect"), topic: val("studioTopic"), title: val("studioTitle"), body: val("studioEditor"),
      douyin: val("studioDouyin"), xiaohongshu: val("studioXhs"), wechatChannels: val("studioWechat"),
      coverTitle: val("studioCoverTitle"), coverSubtitle: val("studioCoverSubtitle"), coverBrief: val("studioCoverBrief")
    };
  }
  var studioAutosaveTimer = null;
  var STUDIO_FIELD_IDS = ["studioTopic", "studioTitle", "studioEditor", "studioDouyin", "studioXhs", "studioWechat", "studioCoverTitle", "studioCoverSubtitle", "studioCoverBrief"];
  function studioHasContent(draft) {
    return STUDIO_FIELD_IDS.some(function (id) {
      var field = document.getElementById(id);
      return field && field.value.trim();
    }) || !!draft.topicId;
  }
  function persistStudioWorkingCopy() {
    if (!document.getElementById("studioTopic")) return;
    var draft = collectStudioDraft();
    if (!studioHasContent(draft)) { D.clearStudioWorkingDraft(); return; }
    var copy = D.saveStudioWorkingDraft(draft);
    var saveState = document.getElementById("studioSaveState");
    if (saveState) saveState.textContent = "已自动暂存 · " + new Date(copy.autosavedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  }
  function scheduleStudioAutosave() {
    clearTimeout(studioAutosaveTimer);
    studioAutosaveTimer = setTimeout(persistStudioWorkingCopy, 500);
  }
  function fillStudioResult(result) {
    var map = { studioTitle: "title", studioEditor: "body", studioDouyin: "douyin", studioXhs: "xiaohongshu", studioWechat: "wechatChannels", studioCoverTitle: "coverTitle", studioCoverSubtitle: "coverSubtitle", studioCoverBrief: "coverBrief" };
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el && result[map[id]]) el.value = result[map[id]]; });
    updateCoverPreview();
    persistStudioWorkingCopy();
  }
  function updateCoverPreview() {
    var title = document.getElementById("studioCoverTitle"), subtitle = document.getElementById("studioCoverSubtitle");
    var pt = document.getElementById("coverPreviewTitle"), ps = document.getElementById("coverPreviewSubtitle");
    if (pt) pt.textContent = title && title.value.trim() || "封面标题";
    if (ps) ps.textContent = subtitle && subtitle.value.trim() || "封面副标题";
  }
  function parseAiPackage(text) {
    var clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    var start = clean.indexOf("{"), end = clean.lastIndexOf("}");
    if (start < 0 || end < start) throw new Error("AI 返回格式无法识别");
    return JSON.parse(clean.slice(start, end + 1));
  }
  function downloadCover() {
    var d = collectStudioDraft();
    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    canvas.width = 1080; canvas.height = 1440;
    function finish(image) {
      ctx.fillStyle = "#FAF7F1"; ctx.fillRect(0, 0, 1080, 1440);
      ctx.fillStyle = "#FFC93C"; ctx.beginPath(); ctx.arc(880, 190, 230, 0, Math.PI * 2); ctx.fill();
      if (image) {
        var ratio = Math.min(320 / image.naturalWidth, 320 / image.naturalHeight);
        var w = image.naturalWidth * ratio, h = image.naturalHeight * ratio;
        ctx.drawImage(image, 860 - w / 2, 160 - h / 2, w, h);
      }
      ctx.fillStyle = "#F04E45"; ctx.fillRect(72, 90, 190, 52);
      ctx.fillStyle = "#fff"; ctx.font = "700 27px sans-serif"; ctx.fillText("桃子 AI 重启", 92, 126);
      ctx.fillStyle = "#2B2622"; ctx.font = "800 76px sans-serif";
      var title = d.coverTitle || d.title || d.topic || "我的 AI 项目";
      var chars = Array.from(title), lines = [], line = "";
      chars.forEach(function (ch) { if (ctx.measureText(line + ch).width > 850) { lines.push(line); line = ch; } else line += ch; });
      if (line) lines.push(line);
      lines.slice(0, 4).forEach(function (l, i) { ctx.fillText(l, 80, 360 + i * 105); });
      ctx.fillStyle = "#F04E45"; ctx.font = "700 40px sans-serif"; ctx.fillText(d.coverSubtitle || "真实项目 · 真实复盘", 82, 860);
      ctx.fillStyle = "#716A63"; ctx.font = "32px sans-serif"; ctx.fillText((d.coverBrief || "AI 创作工作流").slice(0, 42), 82, 1260);
      canvas.toBlob(function (blob) {
      if (!blob) { toast("封面生成失败，请重试"); return; }
      var url = URL.createObjectURL(blob);
      var a = document.getElementById("coverDownloadLink");
      if (!a) { URL.revokeObjectURL(url); return; }
      if (a.getAttribute("data-url")) URL.revokeObjectURL(a.getAttribute("data-url"));
      a.download = "taozi-cover-" + new Date().toISOString().slice(0, 10) + ".png";
      a.href = url;
      a.setAttribute("data-url", url);
      a.hidden = false;
      toast("封面 PNG 已生成，可点击下载");
      }, "image/png");
    }
    var yoyo = new Image();
    yoyo.onload = function () { finish(yoyo); };
    yoyo.onerror = function () { finish(null); };
    yoyo.src = "assets/yoyo-avatar.png";
  }

  var editingHomeSection = "";
  var HOME_EDIT = {
    tasks: { title: "编辑今日待办", help: "每行一条：事项 | 截止时间", fields: ["title", "due"] },
    creating: { title: "编辑创作中", help: "每行一条：内容标题 | 平台 | 日期", fields: ["title", "platform", "date"] },
    scheduled: { title: "编辑待发布", help: "每行一条：内容标题 | 平台 | 发布日期", fields: ["title", "platform", "date"] },
    upcoming: { title: "编辑即将到来", help: "每行一条：事项 | 时间", fields: ["title", "when"] }
  };
  function homeRows(section) {
    if (section === "tasks") return D.tasks;
    if (section === "upcoming") return D.upcoming;
    return D.contents.filter(function (c) {
      return section === "creating" ? (c.status === "draft" || c.status === "ready") : c.status === "scheduled";
    });
  }
  function openHomeEditor(section) {
    var config = HOME_EDIT[section];
    if (!config) return;
    editingHomeSection = section;
    document.getElementById("editTitle").textContent = config.title;
    document.getElementById("editHelp").textContent = config.help + "。删除一行即可删除该项。";
    document.getElementById("editText").value = homeRows(section).map(function (row) {
      return config.fields.map(function (field) {
        if (field === "name") return row.name || "";
        if (field === "note") return row.note || row.nextAction || "";
        if (field === "when") return row.when || row.followAt || "";
        return row[field] || "";
      }).join(" | ");
    }).join("\n");
    document.getElementById("editOverlay").classList.add("open");
  }
  function closeHomeEditor() { document.getElementById("editOverlay").classList.remove("open"); }
  function saveHomeEditor() {
    var config = HOME_EDIT[editingHomeSection];
    var rows = document.getElementById("editText").value.split("\n").map(function (line) { return line.trim(); }).filter(Boolean).map(function (line) {
      var parts = line.split("|").map(function (part) { return part.trim(); });
      var row = {};
      config.fields.forEach(function (field, i) { row[field] = parts[i] || ""; });
      return row;
    });
    D.updateHomeSection(editingHomeSection, rows);
    closeHomeEditor(); render(); toast("已保存 " + rows.length + " 条真实记录");
  }

  function parseCsv(text) {
    var lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(function (line) { return line.trim(); });
    if (lines.length < 2) return [];
    function cells(line) { return line.split(",").map(function (cell) { return cell.trim().replace(/^"|"$/g, ""); }); }
    var headers = cells(lines.shift());
    return lines.map(function (line) {
      var values = cells(line), row = {};
      headers.forEach(function (header, i) { row[header] = values[i] || ""; });
      return row;
    });
  }
  function importReviewFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var rows = file.name.toLowerCase().endsWith(".json") ? JSON.parse(reader.result) : parseCsv(reader.result);
        if (!Array.isArray(rows) || !rows.length) throw new Error("文件里没有可导入的数据行");
        var count = D.importReviewRows(rows);
        render(); toast("已导入 " + count + " 条复盘数据");
      } catch (err) { toast("导入失败：" + err.message); }
    };
    reader.readAsText(file);
  }

  /* ============ 标题生成 ============ */
  var TITLE_TPL = [
    { platform: "抖音", style: "冲突型", tpl: "别再一个个用 AI 了，{k} 才是正确姿势" },
    { platform: "抖音", style: "结果型", tpl: "实测 {k} 7 天，结果有点意外" },
    { platform: "小红书", style: "教程型", tpl: "保姆级教程：{k}（附完整提示词）" },
    { platform: "小红书", style: "结果型", tpl: "我用{k}，一个人做完一个团队的活" },
    { platform: "视频号", style: "观点型", tpl: "关于{k}，90% 的人都搞错了方向" },
    { platform: "视频号", style: "故事型", tpl: "从熬夜剪片到准点下班：{k}改变了我" },
    { platform: "公众号", style: "信息差型", tpl: "2026 最新：{k}的完整方法与其他人没告诉你的细节" },
    { platform: "公众号", style: "好奇型", tpl: "{k}到底值不值得学？我测了 30 天" }
  ];
  function genTitles() {
    var inp = document.getElementById("titleInput");
    var k = (inp.value || "").trim() || "AI 子代理并行";
    var box = document.getElementById("titleResults");

    if (aiReady()) {
      box.innerHTML = '<div class="copilot-tip">桃子助手正在生成标题…</div>';
      YOYO.ai.ask(
        "请围绕主题「" + k + "」生成 8 个标题，覆盖抖音/小红书/视频号/公众号四个平台，风格涵盖：信息差型、冲突型、好奇型、观点型、结果型、教程型、故事型。" +
        "严格要求：每行一个标题，格式为「平台｜风格｜标题」，不要编号，不要任何额外说明。",
        function (err, text) {
          if (err) { box.innerHTML = '<div class="copilot-tip">出错了：' + esc(err) + "</div>"; return; }
          var lines = text.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l.indexOf("｜") > -1; });
          if (!lines.length) { box.innerHTML = '<div class="copilot-res">' + fmt(text) + "</div>"; return; }
          box.innerHTML = lines.map(function (l, i) {
            var parts = l.split("｜");
            var platform = (parts[0] || "").trim(), style = (parts[1] || "").trim(), title = parts.slice(2).join("｜").trim();
            var sc = { click: 65 + ((i * 13) % 33), density: 60 + ((i * 17) % 35), emotion: 55 + ((i * 19) % 40), match: 72 + ((i * 11) % 26) };
            return '<div class="title-row"><div style="flex:1"><div style="font-weight:600;font-size:13.5px">' + esc(title) + '</div>' +
              '<div class="topic-meta" style="margin-top:4px"><span class="tag tag-red">' + esc(platform) + '</span><span class="tag tag-yellow">' + esc(style) + "</span></div></div>" +
              '<div class="title-scores"><span>点击 ' + sc.click + "</span><span>密度 " + sc.density + "</span><span>情绪 " + sc.emotion + "</span><span>匹配 " + sc.match + "</span></div>" +
              '<button class="btn btn-soft btn-sm" data-act="save-title" data-text="' + esc(title) + '" data-platform="' + esc(platform) + '" data-style="' + esc(style) + '">收藏</button></div>';
          }).join("");
          toast("AI 已生成 " + lines.length + " 个候选标题");
        }
      );
      return;
    }

    box.innerHTML = '<div class="copilot-tip">AI 尚未配置，无法生成标题。</div>';
    toast("请先到设置配置并测试 API Key");
  }

  /* ============ AI 复盘 ============ */
  function aiReview(id) {
    var c = null;
    D.contents.forEach(function (x) { if (x.id === id) c = x; });
    if (!c || !c.metrics) { toast("这条内容还没有数据"); return; }
    openAi();
    var body = document.getElementById("aiBody");
    body.insertAdjacentHTML("beforeend", '<div class="ai-msg user">帮我复盘：' + esc(c.title) + "</div>");

    if (aiReady()) {
      body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot" data-typing>桃子助手正在复盘这条内容…</div>');
      body.scrollTop = body.scrollHeight;
      var rate = c.metrics.views > 0 ? ((c.metrics.likes + c.metrics.comments + c.metrics.saves) / c.metrics.views * 100).toFixed(1) : "0.0";
      YOYO.ai.ask(
        "请复盘我发布的这条内容。\n标题：" + c.title + "\n平台：" + c.platform + "（" + c.format + "）\n发布日期：" + c.date +
        "\n数据：播放 " + c.metrics.views + "，点赞 " + c.metrics.likes + "，评论 " + c.metrics.comments + "，收藏 " + c.metrics.saves + "，涨粉 " + c.metrics.fans + "，互动率 " + rate + "%" +
        "\n请从以下维度分析：1.整体判断 2.标题分析 3.选题分析 4.可能的开头/结构问题 5.下一条内容的具体建议 6.可以沉淀进方法库的经验（一句话）。",
        function (err, text) {
          var typing = body.querySelector("[data-typing]");
          if (typing) typing.remove();
          body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">' + (err ? "出错了：" + esc(err) : fmt(text)) + "</div>");
          body.scrollTop = body.scrollHeight;
        }
      );
      return;
    }

    body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">AI 尚未配置，无法生成复盘。请先到「设置」配置并测试 API Key。</div>');
    body.scrollTop = body.scrollHeight;
  }

  /* ============ 全局事件 ============ */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act], [data-fill], [data-ask], [data-go]");
    if (!t) {
      if (e.target.id === "cmdOverlay") closeCmd();
      return;
    }
    var act = t.getAttribute("data-act");
    var id = t.getAttribute("data-id");
    var v = t.getAttribute("data-v");

    if (t.hasAttribute("data-fill")) {
      var inp = document.getElementById("captureInput");
      if (inp) { inp.value = t.getAttribute("data-fill"); inp.focus(); }
      return;
    }
    if (t.hasAttribute("data-ask")) { aiReply(t.getAttribute("data-ask")); return; }
    if (t.hasAttribute("data-go") && t.classList.contains("cmd-item")) {
      closeCmd();
      if (t.getAttribute("data-act") === "ai") { openAi(); return; }
      var go = t.getAttribute("data-go");
      if (go) location.hash = go;
      return;
    }

    switch (act) {
      case "edit-home": openHomeEditor(v); break;
      case "open-studio-topics": S.studioTab = "topics"; break;
      case "review-import": document.getElementById("reviewImportFile").click(); break;
      case "platform-sync": requestPlatformAnalyticsSync(true); break;
      case "save-topic":
        var topic = null;
        D.topics.forEach(function (x) { if (x.id === id) topic = x; });
        if (!topic) GH.list.forEach(function (x) { if (x.id === id) topic = x; });
        if (!topic) break;
        D.saveTopic(topic);
        t.textContent = "已加入 ✓";
        t.disabled = true;
        toast("已加入话题库 · 状态：观察中");
        break;
      case "hot-platform": S.hotPlatform = v; render(); break;
      case "hot-refresh": ensureDailyHotTopics(true); break;
      case "save-hot-topic":
        var hotList = D.aiHotTopics[t.getAttribute("data-platform")] || [];
        var hotTopic = hotList.filter(function (x) { return x.id === id; })[0];
        if (!hotTopic) break;
        D.saveTopic({ id: hotTopic.id, title: hotTopic.title, source: "AI 热点选题 · " + (t.getAttribute("data-platform") === "douyin" ? "抖音" : "小红书") + (hotTopic.sourceName ? " · " + hotTopic.sourceName : ""), url: hotTopic.sourceUrl || "", summary: hotTopic.angle, angle: hotTopic.angle, platforms: [t.getAttribute("data-platform") === "douyin" ? "抖音" : "小红书"], tags: ["AI", "热点选题"] });
        t.textContent = "已加入 ✓";
        t.disabled = true;
        toast("已加入话题库 · 状态：观察中");
        break;
      case "create-hot-topic":
        var createList = D.aiHotTopics[t.getAttribute("data-platform")] || [];
        var createTopic = createList.filter(function (x) { return x.id === id; })[0];
        if (createTopic) sessionStorage.setItem("yoyo_studio_seed", JSON.stringify(createTopic));
        toast("已带入选题，正在进入创作台…");
        setTimeout(function () { location.hash = "#/studio"; }, 350);
        break;
      case "create-topic":
        var savedSeed = D.getExtraTopics().filter(function (x) { return x.id === id; })[0] || D.topics.filter(function (x) { return x.id === id; })[0];
        if (savedSeed) sessionStorage.setItem("yoyo_studio_seed", JSON.stringify(savedSeed));
        toast("已带入选题，正在进入创作台…");
        setTimeout(function () { S.studioTab = "create"; if (currentRoute() === "studio") render(); else location.hash = "#/studio"; }, 500);
        break;
      case "ignore-topic":
        D.ignoreTopic(id);
        var card = document.querySelector('[data-topic="' + id + '"]');
        if (card) { card.style.transition = "opacity .25s"; card.style.opacity = "0"; setTimeout(function () { card.remove(); }, 260); }
        toast("已忽略，今天不再推荐");
        break;
      case "capture": doCapture(); break;
      case "capture-to-topic":
        var captureTopic = captureAsTopic(findCapture(id));
        if (captureTopic) { t.textContent = "已加入 ✓"; t.disabled = true; toast("灵感已加入选题库"); }
        break;
      case "capture-create":
        var captureSeed = captureAsStudioSeed(findCapture(id));
        if (captureSeed) sessionStorage.setItem("yoyo_studio_seed", JSON.stringify(captureSeed));
        break;
      case "capture-scroll":
        var cap = document.querySelector(".capture-input");
        if (cap) { cap.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { cap.focus(); }, 400); }
        break;
      case "review-best": if (D.stats.best && D.stats.best.id) aiReview(D.stats.best.id); break;
      case "ai-review": aiReview(id); break;
      case "ask-ai": openAi(); break;
      case "remove-topic":
        D.removeTopic(id);
        render();
        toast("已移出话题库");
        break;
      case "ai-judge-saved":
        var st = null;
        D.getExtraTopics().forEach(function (x) { if (x.id === id) st = x; });
        openAi();
        aiReply("帮我再次评估这个话题现在的价值：" + (st ? st.title + "（来源 " + st.source + "，摘要：" + st.summary + "）" : id));
        break;
      case "ai-judge":
        var jt = null;
        D.topics.forEach(function (x) { if (x.id === id) jt = x; });
        openAi();
        aiReply("帮我判断这个话题值不值得做：" + (jt ? jt.title + "（来源 " + jt.source + "，热度 " + jt.heat + "，趋势" + (jt.trend === "up" ? "上升" : jt.trend === "down" ? "回落" : "平稳") + "，摘要：" + jt.summary + "）" : id));
        break;
      case "media-tab": S.mediaTab = v; render(); break;
      case "discover-filter": S.discoverFilter = v; render(); break;
      case "discover-source":
        S.discoverSource = v;
        render();
        break;
      case "gh-refresh": ghFetch(true); break;
      case "gh-analyze": ghAnalyze(id); break;
      case "topic-filter": S.topicFilter = v; render(); break;
      case "topic-view": S.topicView = v; render(); break;
      case "asset-add": openAssetEditor(); break;
      case "asset-filter": S.assetType = v; render(); break;
      case "asset-view": S.assetView = v; render(); break;
      case "asset-fav-only": S.favOnly = !S.favOnly; render(); break;
      case "asset-fav":
        D.assets.forEach(function (a) { if (a.id === id) a.fav = !a.fav; });
        render();
        toast("已更新收藏");
        break;
      case "cal-mode": S.calMode = v; render(); break;
      case "cal-event":
        var cc = null;
        D.contents.forEach(function (x) { if (x.id === id) cc = x; });
        if (cc) toast(cc.date.slice(5) + " · " + cc.platform + " · " + CSTATUS[cc.status].label + "：" + cc.title);
        break;
      case "studio-tab":
        if (v !== "create") persistStudioWorkingCopy();
        S.studioTab = v;
        render();
        break;
      case "draft-edit":
        var editDraft = D.getStudioDrafts().filter(function (draft) { return draft.id === id; })[0];
        if (!editDraft) break;
        sessionStorage.setItem("yoyo_studio_seed", JSON.stringify(editDraft));
        sessionStorage.setItem("yoyo_studio_return", "drafts");
        S.studioTab = "create";
        render();
        toast("已载入初稿，可继续编辑");
        break;
      case "draft-promote":
        var promotedContent = D.promoteDraftToContent(id);
        if (!promotedContent) { toast("没有找到这条初稿"); break; }
        t.disabled = true;
        D.syncNow().then(function () {
          S.mediaTab = "overview";
          if (location.hash === "#/media") render();
          else location.hash = "#/media";
          toast("已进入自媒体中心 · 状态：草稿");
        }).catch(function (error) {
          t.disabled = false;
          toast("已保存在当前设备，云端同步失败：" + error.message);
        });
        break;
      case "content-edit-draft":
        var linkedContent = D.contents.filter(function (content) { return content.id === id; })[0];
        if (!linkedContent || !linkedContent.draftId) { toast("这条内容没有关联初稿"); break; }
        var linkedDraft = D.getStudioDrafts().filter(function (draft) { return draft.id === linkedContent.draftId; })[0];
        if (!linkedDraft) { toast("关联初稿不存在"); break; }
        sessionStorage.setItem("yoyo_studio_seed", JSON.stringify(linkedDraft));
        sessionStorage.setItem("yoyo_studio_return", "media");
        S.studioTab = "create";
        if (location.hash === "#/studio") render();
        else location.hash = "#/studio";
        break;
      case "studio-return":
        persistStudioWorkingCopy();
        sessionStorage.removeItem("yoyo_studio_return");
        if (v === "media") {
          S.mediaTab = "overview";
          if (location.hash === "#/media") render();
          else location.hash = "#/media";
        } else {
          S.studioTab = "drafts";
          render();
        }
        break;
      case "content-status":
        var statusPatch = {};
        if (v === "published") {
          if (!confirm("确认这条内容已经在平台发布了吗？确认后将进入数据复盘。")) break;
          statusPatch.date = new Date().toISOString().slice(0, 10);
        }
        var changedContent = D.updateContentStatus(id, v, statusPatch);
        if (!changedContent) { toast("当前状态不能执行这个操作"); break; }
        render();
        D.syncNow().then(function () { toast("内容状态已更新并同步"); }).catch(function () { toast("状态已保存在当前设备，云端稍后自动重试"); });
        break;
      case "content-schedule":
        var scheduleContent = D.contents.filter(function (content) { return content.id === id; })[0];
        if (!scheduleContent) break;
        var scheduleDate = prompt("请输入计划发布日期（YYYY-MM-DD）", scheduleContent.date || new Date().toISOString().slice(0, 10));
        if (scheduleDate === null) break;
        scheduleDate = scheduleDate.trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduleDate) || isNaN(new Date(scheduleDate + "T00:00:00").getTime())) { toast("日期格式不正确，请按 YYYY-MM-DD 填写"); break; }
        var scheduledContent = scheduleContent.status === "ready" ? D.updateContentStatus(id, "scheduled", { date: scheduleDate }) : scheduleContent;
        if (scheduleContent.status === "scheduled") {
          scheduleContent.date = scheduleDate;
          scheduleContent.updatedAt = Date.now();
          D.saveContentChanges();
          scheduledContent = scheduleContent;
        }
        if (!scheduledContent) { toast("当前内容不能加入排期"); break; }
        render();
        D.syncNow().then(function () { toast("发布日期已设置并同步"); }).catch(function () { toast("排期已保存在当前设备，云端稍后自动重试"); });
        break;
      case "content-focus":
        S.mediaTab = "overview";
        render();
        var focusCard = document.querySelector('[data-id="' + id + '"]');
        if (focusCard) focusCard.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      case "content-review":
        S.mediaTab = "analytics";
        render();
        toast("可导入平台数据，开始复盘这条内容");
        break;
      case "draft-remove":
        if (confirm("确定删除这条初稿？此操作不会删除原选题。")) {
          D.removeStudioDraft(id); render(); toast("初稿已删除");
        }
        break;
      case "studio-generate":
        var studioTopic = (document.getElementById("studioTopic") || {}).value.trim();
        if (!studioTopic) { toast("请先选择或填写一个选题"); break; }
        if (!aiReady()) { toast("AI 尚未配置；你仍可手动填写并保存"); break; }
        t.disabled = true; t.textContent = "正在生成…";
        YOYO.ai.ask("请围绕选题生成一套可直接编辑的自媒体内容。只返回严格 JSON，不要 Markdown。字段必须是 title, body, douyin, xiaohongshu, wechatChannels, coverTitle, coverSubtitle, coverBrief。正文基于真实可验证信息，不编造经历；三个平台文案分别适配抖音、小红书、视频号；封面简洁有行动感。选题：" + studioTopic, function (err, text) {
          t.disabled = false; t.innerHTML = icon("sparkle") + "AI 生成整套内容";
          if (err) { toast("生成失败：" + err); return; }
          try { fillStudioResult(parseAiPackage(text)); toast("整套内容已生成，可逐项修改后保存"); }
          catch (parseErr) { toast("生成结果解析失败，请重试"); }
        });
        break;
      case "studio-save":
        var studioDraft = collectStudioDraft();
        if (!studioDraft.topic) { toast("请先填写选题"); break; }
        clearTimeout(studioAutosaveTimer);
        var existingTopic = D.getExtraTopics().filter(function (topic) { return topic.id === studioDraft.topicId || topic.title.trim() === studioDraft.topic.trim(); })[0];
        var confirmedTopic = D.saveTopic(existingTopic || {
          id: studioDraft.topicId || "studio-topic-" + Date.now(),
          title: studioDraft.topic,
          source: "AI 创作台",
          summary: studioDraft.body.slice(0, 120),
          angle: "创作台确认选题",
          platforms: ["抖音", "小红书", "视频号"],
          tags: ["创作选题"]
        });
        if (confirmedTopic) studioDraft.topicId = confirmedTopic.id;
        var wasExistingDraft = !!studioDraft.id;
        var savedDraft = D.saveStudioDraft(studioDraft);
        D.clearStudioWorkingDraft();
        var saveState = document.getElementById("studioSaveState");
        if (saveState) { saveState.setAttribute("data-draft-id", savedDraft.id); saveState.textContent = "正在确认本地与云端保存…"; }
        t.disabled = true;
        D.syncNow().then(function () {
          sessionStorage.removeItem("yoyo_studio_return");
          toast(wasExistingDraft ? "初稿已更新并完成同步" : "选题和初稿已确认保存");
          S.studioTab = "drafts";
          render();
        }).catch(function (error) {
          t.disabled = false;
          if (saveState) saveState.textContent = "已保存在当前设备，云端同步失败：" + error.message;
          toast("本地初稿已保留，但云端同步失败");
        });
        break;
      case "cover-download": downloadCover(); toast("正在生成封面 PNG…"); break;
      case "studio-clear":
        if (confirm("确定清空当前编辑内容？已保存版本不会删除。")) {
          clearTimeout(studioAutosaveTimer);
          ["studioTitle", "studioEditor", "studioDouyin", "studioXhs", "studioWechat", "studioCoverTitle", "studioCoverSubtitle", "studioCoverBrief"].forEach(function (fieldId) { var field = document.getElementById(fieldId); if (field) field.value = ""; });
          var topicField = document.getElementById("studioTopic"); if (topicField) topicField.value = "";
          D.clearStudioWorkingDraft();
          updateCoverPreview();
        }
        break;
      case "gen-titles": genTitles(); break;
      case "save-title":
        D.saveTitle({ id: "tt" + Date.now(), text: t.getAttribute("data-text"), platform: t.getAttribute("data-platform"), style: t.getAttribute("data-style"), scores: { click: 80, density: 75, emotion: 70, match: 85 }, perf: "" });
        t.textContent = "已收藏 ✓";
        t.disabled = true;
        toast("已加入我的标题库");
        break;
      case "k-summary": toast(aiReady() ? "请在 AI 助手中总结这条知识" : "AI 尚未配置"); break;
      case "k-link": toast("关联功能尚未接通，未写入任何数据"); break;
      case "pub-edit": toast("平台版本编辑将在下一阶段开放"); break;
      case "pub-addver": toast("平台版本功能尚未接通，未写入任何数据"); break;
      case "set-save":
        var s0 = D.getSettings();
        s0.name = document.getElementById("setName").value.trim() || "桃子";
        D.saveSettings(s0);
        toast("已保存，首页问候语将使用新称呼");
        break;
      case "account-logout":
        if (YOYO.account) YOYO.account.logout();
        break;
      case "sync-now":
        toast("正在同步到云端…");
        D.syncNow().then(function () { toast("云端同步完成 ✓"); }).catch(function (error) { toast("同步失败：" + error.message); });
        break;
      case "set-save-key":
        var s1 = D.getSettings();
        s1.aiKey = document.getElementById("setKey").value.trim();
        D.saveSettings(s1);
        render();
        toast(s1.aiKey ? "API Key 已保存，请测试连接" : "已清除 Key，AI 功能不可用");
        break;
      case "set-test-key":
        if (!aiReady()) { toast("请先保存 API Key"); break; }
        toast("正在测试连接…");
        YOYO.ai.ask("用一句话打个招呼，证明你能正常工作。", function (err, text) {
          toast(err ? "连接失败：" + err : "连接成功 ✓ " + text.slice(0, 40));
        });
        break;
      case "set-export":
        var blob = new Blob([D.exportAll()], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "taozi-workbench-backup-" + new Date().toISOString().slice(0, 10) + ".json";
        a.click();
        toast("备份已导出");
        break;
      case "set-copy":
        var backupText = document.getElementById("backupText");
        backupText.value = D.exportAll();
        backupText.hidden = false;
        backupText.select();
        if (!navigator.clipboard || !navigator.clipboard.writeText) { toast("备份已生成，可手动复制"); break; }
        navigator.clipboard.writeText(backupText.value).then(function () { toast("JSON 备份已复制"); }).catch(function () { toast("备份已生成，可手动复制"); });
        break;
      case "set-import": document.getElementById("importFile").click(); break;
      case "set-clear":
        if (confirm("确定清空所有本地数据？此操作不可恢复！")) {
          if (confirm("再确认一次：包括话题收藏、快速记录、标题库都会被删除。")) {
            D.clearAll();
            toast("已清空本地数据");
          }
        }
        break;
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target.id === "assetSearch") {
      S.assetSearch = e.target.value;
      render();
      var assetSearch = document.getElementById("assetSearch");
      if (assetSearch) { assetSearch.focus(); assetSearch.setSelectionRange(assetSearch.value.length, assetSearch.value.length); }
    }
    if (e.target.id === "studioCoverTitle" || e.target.id === "studioCoverSubtitle") updateCoverPreview();
    if (STUDIO_FIELD_IDS.indexOf(e.target.id) > -1) scheduleStudioAutosave();
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "studioTopicSelect") {
      var selectedTopic = D.getExtraTopics().filter(function (topic) { return topic.id === e.target.value; })[0];
      var topicInput = document.getElementById("studioTopic");
      if (topicInput) topicInput.value = selectedTopic ? selectedTopic.title : "";
      scheduleStudioAutosave();
      return;
    }
    if (e.target.id === "reviewImportFile" && e.target.files[0]) { importReviewFile(e.target.files[0]); e.target.value = ""; return; }
    if (e.target.id === "importFile" && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          Object.keys(data).forEach(function (k) { localStorage.setItem(k, JSON.stringify(data[k])); });
          D.syncNow().then(function () { toast("导入成功，数据已恢复并同步云端"); });
        } catch (err) { toast("导入失败：文件格式不正确"); }
      };
      reader.readAsText(e.target.files[0]);
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmd(); }
    if (e.key === "Escape") { closeCmd(); closeAi(); closeHomeEditor(); closeAssetEditor(); }
    if (e.key === "Enter" && document.activeElement && document.activeElement.id === "captureInput") doCapture();
    if (e.key === "Enter" && document.activeElement && document.activeElement.id === "aiInput") sendAi();
  });

  function openAi() { document.getElementById("aiPanel").classList.add("open"); setTimeout(function () { document.getElementById("aiInput").focus(); }, 250); }
  function closeAi() { document.getElementById("aiPanel").classList.remove("open"); }
  function sendAi() {
    var inp = document.getElementById("aiInput");
    var v2 = inp.value.trim();
    if (!v2) return;
    inp.value = "";
    aiReply(v2);
  }

  /* ============ YOYO 加油宠物 ============ */
  var CHEERS = [
    "今天也在往前走 ✦",
    "你已经做得很好了！",
    "先完成一小步，就很棒。",
    "YOYO 给你加满能量！",
    "别急，作品会慢慢长出来。",
    "继续做真实的项目，你可以的！"
  ];
  var cheerBubbleTimer = null;

  function cheerStorageKey() {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return "yoyo_cheer_" + now.getFullYear() + "-" + month + "-" + day;
  }

  function updatePetCount() {
    var count = Number(localStorage.getItem(cheerStorageKey()) || 0);
    var countEl = document.getElementById("yoyoPetCount");
    if (countEl) countEl.textContent = "今日 " + count;
  }

  function cheerYoyo() {
    var key = cheerStorageKey();
    var count = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, String(count));
    updatePetCount();

    var button = document.getElementById("yoyoPetBtn");
    var bubble = document.getElementById("yoyoPetBubble");
    button.classList.remove("cheer");
    void button.offsetWidth;
    button.classList.add("cheer");
    bubble.textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];
    bubble.classList.add("show");
    clearTimeout(cheerBubbleTimer);
    cheerBubbleTimer = setTimeout(function () { bubble.classList.remove("show"); }, 2600);
  }

  /* ============ 启动 ============ */
  document.addEventListener("yoyo:cloud-status", function () {
    var node = document.querySelector("[data-cloud-status]");
    if (node && YOYO.cloud) node.textContent = YOYO.cloud.statusText();
  });

  renderNav();
  hydrateIcons(document);
  hydrateMascots(document);
  render();
  updatePetCount();
  ensureDailyPlatformAnalytics();
  window.addEventListener("hashchange", function () { persistStudioWorkingCopy(); render(); });
  window.addEventListener("beforeunload", persistStudioWorkingCopy);

  document.getElementById("openCmd").addEventListener("click", openCmd);
  document.getElementById("cmdInput").addEventListener("input", function () { renderCmd(this.value); });
  document.getElementById("aiFab").addEventListener("click", openAi);
  document.getElementById("aiClose").addEventListener("click", closeAi);
  document.getElementById("aiSend").addEventListener("click", sendAi);
  document.getElementById("yoyoPetBtn").addEventListener("click", cheerYoyo);
  document.getElementById("quickAdd").addEventListener("click", openCmd);
  document.getElementById("bell").addEventListener("click", function () { toast("暂无真实提醒"); });
  document.getElementById("editClose").addEventListener("click", closeHomeEditor);
  document.getElementById("editCancel").addEventListener("click", closeHomeEditor);
  document.getElementById("editSave").addEventListener("click", saveHomeEditor);
  document.getElementById("editOverlay").addEventListener("click", function (e) { if (e.target === this) closeHomeEditor(); });
  document.getElementById("assetClose").addEventListener("click", closeAssetEditor);
  document.getElementById("assetCancel").addEventListener("click", closeAssetEditor);
  document.getElementById("assetParse").addEventListener("click", parseAssetLink);
  document.getElementById("assetCoverImage").addEventListener("change", updateAssetCoverPreview);
  document.getElementById("assetForm").addEventListener("submit", saveCaptureEditor);
  document.getElementById("assetOverlay").addEventListener("click", function (e) { if (e.target === this) closeAssetEditor(); });

  document.getElementById("aiBody").innerHTML = '<div class="ai-msg bot">你好，我是桃子助手。' + (aiReady() ? "AI 已连接，我可以读取当前页面上下文为你工作。" : "到「设置」配置 DeepSeek API Key 后，我就能基于真实数据回答。") + "</div>";
})();
