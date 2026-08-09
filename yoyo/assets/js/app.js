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
    { route: "today",     num: "01", label: "首页",    icon: "today" },
    { route: "media",     num: "02", label: "自媒体",  icon: "media" },
    { route: "studio",    num: "03", label: "创作",    icon: "studio" },
    { route: "assets",    num: "04", label: "素材",    icon: "assets" },
    { route: "calendar",  num: "05", label: "日历",    icon: "calendar" },
    { route: "analytics", num: "06", label: "数据",    icon: "analytics" },
    { route: "clients",   num: "07", label: "客户",    icon: "clients" },
    { route: "projects",  num: "08", label: "项目",    icon: "projects" },
    { route: "knowledge", num: "09", label: "知识库",  icon: "knowledge" },
    { route: "ai",        num: "10", label: "AI 助手", icon: "ai" }
  ];
  var TITLES = { today: "首页", media: "自媒体中心", studio: "AI 创作台", assets: "素材库", calendar: "内容日历", analytics: "数据中心", clients: "客户管理", projects: "项目管理", knowledge: "知识库", ai: "AI 助手", settings: "设置" };

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
  var ASSET_TYPES = ["全部", "图片", "视频", "截图", "网站", "文章", "GitHub", "数据", "案例", "BGM", "封面参考"];
  var ASSET_ICON = { "图片": "image", "视频": "video", "截图": "image", "网站": "globe", "文章": "file", "GitHub": "file", "数据": "analytics", "案例": "bookmark", "BGM": "music", "封面参考": "image", "人物": "clients", "灵感": "zap" };
  var ASSET_COLOR = { "图片": "#F7A8C4", "视频": "#7FC4E8", "截图": "#F89C3C", "网站": "#B5D951", "文章": "#7FC4E8", "GitHub": "#2B2622", "数据": "#FFC93C", "案例": "#F04E45", "BGM": "#F7A8C4", "封面参考": "#F89C3C" };

  /* 视图内状态 */
  var S = { mediaTab: "overview", topicView: "card", topicFilter: "全部", discoverFilter: "全部", discoverSource: "picked", assetView: "grid", assetType: "全部", calMode: "month", studioStep: 0, favOnly: false };

  /* ============ GitHub Trending 实时信源 ============ */
  var GH = { list: [], ts: 0, loading: false, error: null, loaded: false };

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

  /* ============ 视图：首页 ============ */
  function viewToday() {
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
      '<div class="greet-meta"><span>' + dateStr + '</span><span>多云 28°C</span><span class="focus-pill">专注模式</span></div>' +
      '<div class="greet-tip">今天最值得做的一件事：<b>把「AI 代理并行」的口播稿收尾</b>，趁热发布。</div></div>' +
      '<div class="greet-side">' +
      '<div class="mascot-badge"><span class="mascot" data-mascot></span><span class="mascot-bubble">3 个灵感在等你 ✦</span></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px"><button class="btn btn-soft" data-act="capture-scroll">' + icon("zap") + '快速记录</button>' +
      '<a class="btn btn-accent" href="#/studio">' + icon("pen") + '开始创作</a></div></div>' +
      "</div></section>";

    /* 今日重点 */
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">今日重点</div><div class="sec-note">一次只做一件事。</div></div><div class="grid grid-4">';
    html += '<div class="card card-mini card-hover"><div class="mini-label">' + icon("clock") + '今日待办</div>' +
      '<div class="mini-value num">' + D.tasks.length + '</div><div class="mini-list">' +
      D.tasks.map(function (t) {
        return '<div class="mini-item' + (t.overdue ? " overdue" : "") + '"><span class="dot-s"></span>' + t.title +
          (t.overdue ? '<span class="tag tag-apricot" style="margin-left:auto">逾期</span>' : "") + "</div>";
      }).join("") + "</div></div>";
    html += '<div class="card card-mini card-hover"><div class="mini-label">' + icon("pen") + '创作中</div>' +
      '<div class="mini-value num">3</div><div class="mini-sub">「AI 代理并行」口播稿 · 完成 70%</div>' +
      '<div class="pipe-bar"><i style="width:70%;background:var(--orange)"></i></div></div>';
    html += '<div class="card card-mini card-hover"><div class="mini-label">' + icon("media") + '待发布</div>' +
      '<div class="mini-value num">4</div><div class="mini-sub">最近的：明天 12:00 · 小红书</div>' +
      '<div style="margin-top:10px"><a class="btn btn-soft btn-sm" href="#/calendar">查看排期</a></div></div>';
    html += '<div class="card card-mini card-hover"><div class="mini-label">' + icon("clients") + '客户跟进</div>' +
      '<div class="mini-value num">' + D.followClients.length + '</div><div class="mini-list">' +
      D.followClients.map(function (c) {
        return '<div class="mini-item"><span class="dot-s"></span>' + c.name.split(" · ")[0] + '<span class="tag" style="margin-left:auto">' + c.stage + "</span></div>";
      }).join("") + "</div></div>";
    html += "</div>";
    html += '<div class="card" style="margin-top:14px;padding:14px 20px;display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<span class="mini-label">' + icon("calendar") + '即将到来</span>' +
      D.upcoming.map(function (u) {
        return '<span style="font-size:12.5px;color:var(--ink-2)"><b style="color:var(--ink);font-weight:650">' + u.title + "</b> · " + u.when + "</span>";
      }).join("") + "</div></section>";

    /* 今日内容推荐：GitHub 实时热点（真）+ 为你精选（示例） */
    if (!GH.loaded && !GH.loading && !GH.error) { ghFetch(false); }
    var ghTop = GH.list.filter(function (r) { return ignored.indexOf(r.id) === -1; }).slice(0, 4);
    var picked = ghTop.length ? topics.slice(0, 2) : topics;
    var noteText = ghTop.length
      ? ghTop.length + " 个 GitHub 实时热点 · 更新于 " + new Date(GH.ts).toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" }) + "，另附 " + picked.length + " 个精选"
      : (GH.loading ? "正在拉取 GitHub 实时热点…" : "为你选出 " + picked.length + " 个今天值得关注的话题");
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">今日内容推荐</div>' +
      '<div class="sec-note">' + noteText + '</div>' +
      '<a class="sec-more" href="#/media">查看全部 →</a></div><div class="topic-grid">' +
      ghTop.map(ghCard).join("") + picked.map(topicCard).join("") + "</div></section>";

    /* 内容进度 */
    var total = D.pipeline.reduce(function (s, p) { return s + p.count; }, 0);
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">内容进度</div><div class="sec-note">共 ' + total + ' 条内容在流水线中</div><a class="sec-more" href="#/media">进入自媒体中心 →</a></div>' +
      '<div class="grid grid-5">' +
      D.pipeline.map(function (p) {
        return '<div class="card card-mini card-hover pipe-card"><div class="mini-label">' + p.label + '</div>' +
          '<div class="pipe-value num">' + p.count + '</div>' +
          '<div class="pipe-bar"><i style="width:' + Math.round((p.count / total) * 100) + "%;background:" + p.color + '"></i></div></div>';
      }).join("") + "</div></section>";

    /* 最近数据 */
    var s = D.stats;
    html += '<section class="sec"><div class="sec-head"><div class="sec-title">最近 7 天</div><div class="sec-note">只看真正重要的</div><a class="sec-more" href="#/analytics">数据中心 →</a></div>' +
      '<div class="grid grid-4">' +
      metricCard("发布数量", s.weekPosts, "条", "") +
      metricCard("总播放", s.views, "", s.viewsDelta) +
      metricCard("互动", s.engagement, "", s.engagementDelta) +
      metricCard("涨粉", s.fans, "", s.fansDelta) +
      "</div>" +
      '<div class="grid grid-2" style="margin-top:14px">' +
      '<div class="card"><div class="mini-label" style="margin-bottom:8px">播放趋势 · 近7天</div>' + sparkline(s.spark) + "</div>" +
      '<div class="card"><div class="mini-label" style="margin-bottom:10px">表现最好的内容</div><div class="best-card">' +
      '<div class="best-cover">' + icon("media") + '</div><div><div class="best-title">' + s.best.title + "</div>" +
      '<div class="best-meta">' + s.best.platform + ' · <span class="num">' + s.best.views + '</span> 播放 · <span class="num">' + s.best.saves + '</span> 收藏 · <span class="num" style="color:var(--up)">' + s.best.fans + "</span> 涨粉</div>" +
      '<div style="margin-top:8px"><button class="btn btn-soft btn-sm" data-act="review-best">AI 复盘这条</button></div></div></div></div>' +
      "</div></section>";

    /* Quick Capture */
    html += '<section class="sec"><div class="capture">' +
      '<div class="capture-title">' + icon("zap") + '快速记录</div>' +
      '<div class="capture-sub">想法、一句话、网址、标题、选题——丢进来，AI 帮你放到该去的地方。</div>' +
      '<div class="capture-row"><input class="capture-input" id="captureInput" placeholder="现在脑子里有什么？">' +
      '<button class="capture-btn" data-act="capture">记下</button></div>' +
      '<div class="capture-hints">' +
      '<button class="capture-hint" data-fill="选题：AI 编程工具横评（非程序员视角）">一个选题</button>' +
      '<button class="capture-hint" data-fill="https://github.com/trending">一个网址</button>' +
      '<button class="capture-hint" data-fill="金句：工具是杠杆，流程才是复利">一句话</button>' +
      '<button class="capture-hint" data-fill="提醒：周五前回复林一的报价">一个待办</button>' +
      "</div></div></section>";
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
    { key: "topics", label: "话题库" },
    { key: "library", label: "内容库" },
    { key: "publish", label: "发布管理" }
  ];
  function viewMedia() {
    var html = pageHead("自媒体中心", "发现机会 → 收藏话题 → 创作 → 排期 → 发布 → 复盘，一个闭环。");
    html += '<div class="tabs">' + MEDIA_TABS.map(function (t) {
      return '<button class="tab' + (S.mediaTab === t.key ? " on" : "") + '" data-act="media-tab" data-v="' + t.key + '">' + t.label + "</button>";
    }).join("") + "</div>";

    if (S.mediaTab === "overview") html += mediaOverview();
    else if (S.mediaTab === "discover") html += mediaDiscover();
    else if (S.mediaTab === "topics") html += mediaTopics();
    else if (S.mediaTab === "library") html += mediaLibrary();
    else html += mediaPublish();
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
    var html = '<div class="grid grid-4" style="margin-bottom:16px">' +
      metricCard("内容总数", D.contents.length, "条", "") +
      metricCard("已发布", (byStatus.published || []).length, "条", "") +
      metricCard("排期中", (byStatus.scheduled || []).length, "条", "") +
      metricCard("本周发布", D.stats.weekPosts, "条", "+2") +
      "</div>";
    html += '<div class="kanban">' + cols.map(function (st) {
      var list = byStatus[st] || [];
      return '<div class="kanban-col"><div class="kanban-head"><span class="status ' + CSTATUS[st].cls + '">' + CSTATUS[st].label + '</span><span class="num" style="color:var(--ink-3)">' + list.length + "</span></div>" +
        list.map(function (c) {
          return '<div class="kanban-card"><div style="font-weight:650;font-size:13px;line-height:1.5">' + c.title + '</div>' +
            '<div class="topic-meta" style="margin-top:8px"><span class="tag">' + c.platform + '</span><span>' + c.date.slice(5) + "</span></div></div>";
        }).join("") + "</div>";
    }).join("") + "</div>";
    return html;
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
    var pub = D.contents.filter(function (c) { return c.status === "published"; });
    var html = '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>内容</th><th>平台</th><th>发布日</th><th>播放</th><th>点赞</th><th>收藏</th><th>涨粉</th><th>等级</th><th></th></tr></thead><tbody>' +
      pub.map(function (c) {
        return '<tr><td style="max-width:300px;font-weight:600">' + c.title + "</td><td>" + c.platform + "</td><td>" + c.date.slice(5) + '</td><td class="num">' + fmtNum(c.metrics.views) + '</td><td class="num">' + fmtNum(c.metrics.likes) + '</td><td class="num">' + fmtNum(c.metrics.saves) + '</td><td class="num" style="color:var(--up)">+' + c.metrics.fans + "</td><td>" + gradeTag(c.grade) + '</td><td><button class="btn btn-soft btn-sm" data-act="ai-review" data-id="' + c.id + '">AI 复盘</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    return html;
  }
  function mediaPublish() {
    var stTag = { scheduled: "tag-blue", draft: "", published: "tag-sage", review: "tag-apricot" };
    var stLabel = { scheduled: "已排期", draft: "草稿", published: "已发布", review: "复盘中" };
    var html = "";
    D.publishMasters.forEach(function (m) {
      html += '<div class="card" style="margin-bottom:14px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">' +
        '<div style="font-weight:700;font-size:15px">内容母稿 · ' + m.title + '</div><span class="tag tag-yellow">' + m.coverTag + "</span></div>" +
        '<div class="ver-tree">' + m.versions.map(function (v) {
          return '<div class="ver-row"><span class="tag tag-red">' + v.platform + "</span>" +
            '<span style="font-weight:600;flex:1">' + v.title + "</span>" +
            '<span class="tag ' + stTag[v.status] + '">' + stLabel[v.status] + "</span>" +
            '<span style="font-size:12px;color:var(--ink-3)">' + v.time + "</span>" +
            (v.url ? '<span style="font-size:12px;color:var(--ink-3)">' + v.url + "</span>" : "") +
            '<button class="btn btn-ghost btn-sm" data-act="pub-edit">编辑</button></div>';
        }).join("") + "</div>" +
        '<div style="margin-top:12px"><button class="btn btn-soft btn-sm" data-act="pub-addver">' + icon("plus") + '添加平台版本</button></div></div>';
    });
    html += '<div class="empty" style="padding:36px"><div class="empty-sub">第一阶段仅完成 UI 与状态流转，不会真正调用平台发布 API。</div></div>';
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
  function viewStudio() {
    var html = pageHead("AI 创作台", "从一个选题到一条可发布的内容。");
    /* 流程条 */
    html += '<div class="flow">' + FLOW.map(function (f, i) {
      return '<button class="flow-step' + (i === S.studioStep ? " on" : i < S.studioStep ? " done" : "") + '" data-act="flow" data-v="' + i + '">' +
        '<span class="flow-num">' + (i < S.studioStep ? "✓" : i + 1) + "</span>" + f + "</button>";
    }).join("") + "</div>";

    html += '<div class="studio-grid"><div>' +
      '<input class="input" id="studioTitle" style="height:50px;font-size:17px;font-weight:650;margin-bottom:12px" value="我让 3 个 AI 同时打工，结果有点意外">' +
      '<textarea class="input editor" id="studioEditor">【钩子】这条内容，从选题到发布，我只动了 3 次手。\n\n【冲突】以前做一条内容：找选题 1 小时、写稿 2 小时、排版配图 1 小时……\n\n【主体】现在我把流程拆给 3 个 AI 代理：\n1 号代理盯热点，每天早上给我 5 个选题；\n2 号代理写初稿，风格学的是我自己的历史内容；\n3 号代理做平台适配，一条母稿变成 4 个版本。\n\n【金句】工具是杠杆，流程才是复利。\n\n【行动】分工表和提示词，我整理好了，评论区见。</textarea>' +
      '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
      '<button class="btn btn-primary btn-sm" data-act="studio-save">保存草稿</button>' +
      '<button class="btn btn-soft btn-sm" data-act="studio-schedule">加入排期</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="studio-clear">清空</button>' +
      '<span style="margin-left:auto;font-size:12px;color:var(--ink-3)" id="wordCount">约 220 字 · 口播约 90 秒</span></div>' +
      titleLab() +
      "</div>";

    /* 右侧 Copilot */
    html += '<div class="card" style="padding:18px"><div class="mini-label" style="margin-bottom:12px">' + icon("sparkle") + "AI Copilot</div>" +
      '<div class="copilot-btns">' + COPILOT.map(function (c) {
        return '<button class="chip" data-act="copilot" data-v="' + c + '">' + c + "</button>";
      }).join("") + "</div>" +
      '<div class="copilot-out" id="copilotOut"><div class="copilot-tip">点上面的指令，AI 会读取当前草稿并给出结果。</div></div>' +
      "</div></div>";
    return html;
  }
  function titleLab() {
    var myTitles = D.getMyTitles();
    var html = '<div class="card" style="margin-top:18px"><div class="sec-head" style="margin-bottom:10px"><div class="sec-title" style="font-size:16px">标题实验室</div><div class="sec-note">一键生成 4 平台 × 多风格标题</div></div>' +
      '<div style="display:flex;gap:8px"><input class="input" id="titleInput" placeholder="输入内容主题，例如：AI 子代理并行实测" style="height:40px;font-size:14px">' +
      '<button class="btn btn-accent btn-sm" data-act="gen-titles" style="height:40px">生成标题</button></div>' +
      '<div id="titleResults"></div></div>';
    html += '<div class="card" style="margin-top:14px"><div class="sec-head" style="margin-bottom:10px"><div class="sec-title" style="font-size:16px">我的标题库</div><div class="sec-note">' + (D.titleBank.length + myTitles.length) + ' 条</div></div>' +
      myTitles.concat(D.titleBank).map(function (t) {
        return '<div class="title-row"><div style="flex:1"><div style="font-weight:600;font-size:13.5px">' + esc(t.text) + '</div>' +
          '<div class="topic-meta" style="margin-top:4px"><span class="tag tag-red">' + t.platform + '</span><span class="tag tag-yellow">' + t.style + "</span>" +
          (t.perf ? '<span style="color:var(--up);font-weight:600">' + t.perf + "</span>" : "") + "</div></div>" +
          '<div class="title-scores"><span>点击 ' + t.scores.click + "</span><span>密度 " + t.scores.density + "</span><span>情绪 " + t.scores.emotion + "</span><span>匹配 " + t.scores.match + "</span></div></div>";
      }).join("") + "</div>";
    return html;
  }

  /* ============ 视图：素材库 ============ */
  function viewAssets() {
    var list = D.assets.filter(function (a) {
      if (S.favOnly && !a.fav) return false;
      return S.assetType === "全部" || a.type === S.assetType;
    });
    var html = pageHead("素材库", "不只是文件夹——每个素材都能被 AI 识别、打标签、关联选题。");
    html += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">' +
      filterChips(ASSET_TYPES, S.assetType, "asset-filter") +
      '<div style="margin-left:auto;display:flex;gap:8px">' +
      '<button class="chip' + (S.favOnly ? " on" : "") + '" data-act="asset-fav-only">' + icon("heart") + "只看收藏</button>" +
      '<div class="seg">' +
      '<button class="seg-btn' + (S.assetView === "grid" ? " on" : "") + '" data-act="asset-view" data-v="grid">' + icon("grid") + "网格</button>" +
      '<button class="seg-btn' + (S.assetView === "list" ? " on" : "") + '" data-act="asset-view" data-v="list">' + icon("list") + "列表</button>" +
      "</div></div></div>";

    if (S.assetView === "grid") {
      html += '<div class="asset-grid">' + list.map(function (a) {
        var color = ASSET_COLOR[a.type] || "#B0A897";
        return '<div class="card card-hover" style="padding:0;overflow:hidden">' +
          '<div class="asset-thumb" style="background:' + color + '22;color:' + color + '">' + icon(ASSET_ICON[a.type] || "file") + "</div>" +
          '<div style="padding:12px 14px"><div style="font-weight:650;font-size:13px;line-height:1.5">' + a.title + "</div>" +
          '<div class="topic-meta" style="margin-top:6px"><span class="tag">' + a.type + "</span>" + a.tags.map(function (g) { return '<span class="tag tag-pink">' + g + "</span>"; }).join("") + "</div>" +
          '<div style="display:flex;align-items:center;margin-top:8px"><span style="font-size:11.5px;color:var(--ink-3)">' + a.date + (a.note ? " · " + a.note : "") + "</span>" +
          '<button class="icon-btn" style="width:28px;height:28px;margin-left:auto;' + (a.fav ? "color:var(--red)" : "") + '" data-act="asset-fav" data-id="' + a.id + '">' + icon("heart") + "</button></div>" +
          "</div></div>";
      }).join("") + "</div>";
    } else {
      html += '<div class="card" style="padding:6px 0"><table class="table"><thead><tr><th>素材</th><th>类型</th><th>标签</th><th>备注</th><th>日期</th><th></th></tr></thead><tbody>' +
        list.map(function (a) {
          return '<tr><td style="font-weight:600">' + a.title + "</td><td>" + a.type + "</td><td>" + a.tags.join(" / ") + "</td><td>" + (a.note || "—") + "</td><td>" + a.date + '</td><td><button class="btn btn-ghost btn-sm" data-act="asset-fav" data-id="' + a.id + '">' + (a.fav ? "已收藏" : "收藏") + "</button></td></tr>";
        }).join("") + "</tbody></table></div>";
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

  /* ============ 视图：数据中心 ============ */
  function viewAnalytics() {
    var s = D.stats;
    var pub = D.contents.filter(function (c) { return c.metrics; }).sort(function (a, b) { return b.metrics.views - a.metrics.views; });
    var html = pageHead("数据中心", "不堆图表，只回答一个问题：什么内容值得继续做？");
    html += '<div class="grid grid-4">' +
      metricCard("近 7 天发布", s.weekPosts, "条", "") +
      metricCard("总播放", s.views, "", s.viewsDelta) +
      metricCard("互动", s.engagement, "", s.engagementDelta) +
      metricCard("收藏", s.saves, "", s.savesDelta) +
      "</div>";
    html += '<div class="grid grid-2" style="margin-top:14px">' +
      '<div class="card"><div class="mini-label" style="margin-bottom:10px">每日播放 · 近 7 天</div>' + barChart(s.bars) + "</div>" +
      '<div class="card"><div class="mini-label" style="margin-bottom:10px">涨粉趋势</div>' + sparkline([12, 18, 15, 26, 22, 34, 31], "#F04E45") +
      '<div class="mini-sub" style="margin-top:8px">本周净涨粉 <b class="num" style="color:var(--up)">+1,204</b>，「个人 IP 视觉」主题贡献 44%</div></div></div>';

    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">AI 分析</div><div class="sec-note">每周自动生成</div></div>' +
      '<div class="grid grid-2">' +
      D.aiInsights.map(function (i) {
        return '<div class="card card-mini"><div class="mini-label"><span class="tag tag-' + i.tone + '">' + i.title + '</span></div><div style="font-size:13px;color:var(--ink-2);margin-top:8px;line-height:1.7">' + i.text + "</div></div>";
      }).join("") + "</div>";

    html += '<div class="sec-head" style="margin:22px 0 12px"><div class="sec-title" style="font-size:16px">内容排行榜 TOP 10</div><div class="sec-note">按播放排序</div></div>' +
      '<div class="card" style="padding:8px 0"><table class="table"><thead><tr><th>#</th><th>内容</th><th>平台</th><th>播放</th><th>互动率</th><th>收藏</th><th>涨粉</th><th>等级</th><th></th></tr></thead><tbody>' +
      pub.map(function (c, i) {
        var rate = ((c.metrics.likes + c.metrics.comments + c.metrics.saves) / c.metrics.views * 100).toFixed(1);
        var rankColor = i === 0 ? "var(--red)" : i < 3 ? "var(--yellow)" : "var(--ink-3)";
        return '<tr><td class="num" style="font-weight:800;color:' + rankColor + '">' + (i + 1) + '</td><td style="max-width:300px;font-weight:600">' + c.title + "</td><td>" + c.platform + '</td><td class="num">' + fmtNum(c.metrics.views) + '</td><td class="num">' + rate + '%</td><td class="num">' + fmtNum(c.metrics.saves) + '</td><td class="num" style="color:var(--up)">+' + c.metrics.fans + "</td><td>" + gradeTag(c.grade) + '</td><td><button class="btn btn-soft btn-sm" data-act="ai-review" data-id="' + c.id + '">AI 复盘</button></td></tr>';
      }).join("") + "</tbody></table></div>";
    return html;
  }

  /* ============ 视图：客户 ============ */
  function viewClients() {
    var stageTag = { "潜在客户": "", "沟通中": "tag-blue", "方案中": "tag-yellow", "合作中": "tag-sage", "已完成": "tag-sage", "暂停": "tag-apricot" };
    var html = pageHead("客户管理", "保持轻量：谁该跟进、进展到哪、下一步是什么。");
    html += '<div class="grid grid-2">' + D.clients.map(function (c) {
      return '<div class="card card-hover"><div style="display:flex;align-items:center;gap:10px">' +
        '<div class="avatar" style="background:var(--blue-soft);color:#3D7FA3;font-weight:700">' + c.name[0] + "</div>" +
        '<div style="flex:1"><div style="font-weight:700">' + c.name + ' <span style="font-weight:400;color:var(--ink-2);font-size:12.5px">' + c.company + "</span></div>" +
        '<div style="font-size:12px;color:var(--ink-3)">' + c.project + " · " + c.contact + "</div></div>" +
        '<span class="tag ' + (stageTag[c.stage] || "") + '">' + c.stage + "</span></div>" +
        '<div class="topic-meta" style="margin:12px 0 6px"><span>报价 <b class="num" style="color:var(--ink)">' + c.price + '</b></span><span>最近：' + c.lastTouch + "</span></div>" +
        '<div class="topic-angle"><b>下一步</b> · ' + c.nextAction + '（' + c.followAt + "）</div>" +
        '<div class="topic-actions"><button class="btn btn-primary btn-sm" data-act="client-follow" data-id="' + c.id + '">' + icon("message") + '记录跟进</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="client-more">相关文件</button></div></div>';
    }).join("") + "</div>";
    return html;
  }

  /* ============ 视图：项目 ============ */
  function viewProjects() {
    var html = pageHead("项目管理", "个人项目的轻量看板：目标、进度、下一步。");
    html += '<div class="grid grid-2">' + D.projects.map(function (p) {
      return '<div class="card card-hover"><div style="display:flex;align-items:center;gap:10px">' +
        '<span class="cal-dot" style="background:' + p.color + ';width:10px;height:10px;border-radius:50%"></span>' +
        '<div style="font-weight:700;flex:1">' + p.name + '</div><span class="tag">' + p.type + "</span></div>" +
        '<div style="font-size:13px;color:var(--ink-2);margin:10px 0">' + p.goal + "</div>" +
        '<div style="display:flex;align-items:center;gap:10px"><div class="pipe-bar" style="flex:1"><i style="width:' + p.progress + "%;background:" + p.color + '"></i></div><span class="num" style="font-weight:700">' + p.progress + "%</span></div>" +
        '<div class="topic-meta" style="margin-top:10px"><span class="tag tag-apricot">截止 ' + p.deadline + "</span><span>下一步：<b style=\"color:var(--ink)\">" + p.nextAction + "</b></span></div>" +
        '<div class="topic-actions"><button class="btn btn-soft btn-sm" data-act="proj-progress" data-id="' + p.id + '">进度 +10%</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="proj-doc">关联文档</button></div></div>';
    }).join("") + "</div>";
    return html;
  }

  /* ============ 视图：知识库 ============ */
  function viewKnowledge() {
    var html = pageHead("知识库", "你的内容方法资产。未来将连接 Obsidian / Drive / 本地 Markdown。");
    html += '<div style="max-width:520px;margin-bottom:16px"><input class="input" id="kSearch" placeholder="搜索知识：标题、标签、内容…" style="font-size:14px"></div>';
    html += '<div class="grid grid-2" id="kList">' + D.knowledge.map(knowledgeCard).join("") + "</div>";
    return html;
  }
  function knowledgeCard(k) {
    return '<div class="card card-hover"><div style="display:flex;align-items:center;gap:8px">' +
      '<div style="font-weight:650;flex:1;font-size:14px">' + k.title + '</div><span class="tag tag-blue">' + k.source + "</span></div>" +
      '<div style="font-size:13px;color:var(--ink-2);margin:8px 0;line-height:1.7">' + k.summary + "</div>" +
      '<div class="topic-meta">' + k.tags.map(function (g) { return '<span class="tag tag-pink">' + g + "</span>"; }).join("") + '<span style="margin-left:auto">' + k.updated + " 更新</span></div>" +
      '<div class="topic-actions"><button class="btn btn-soft btn-sm" data-act="k-summary">AI 总结</button>' +
      '<button class="btn btn-ghost btn-sm" data-act="k-link">关联内容</button></div></div>';
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
    return pageHead("设置", "") +
      '<div class="grid grid-2">' +
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
      (aiReady() ? '<b style="color:#5E7A1F">已配置 ✓ 所有 AI 功能已激活</b>' : '<b style="color:var(--apricot,#b06a3a)">未配置 · AI 功能显示 Mock 示例</b>') + "</div></div>" +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">数据安全</div>' +
      '<div style="font-size:13px;color:var(--ink-2);margin-bottom:12px">所有数据保存在浏览器本地（localStorage），已记录 ' + caps.length + ' 条快速记录。建议定期导出备份。</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn-soft btn-sm" data-act="set-export">' + icon("download") + "导出 JSON 备份</button>" +
      '<button class="btn btn-soft btn-sm" data-act="set-import">' + icon("upload") + "导入恢复</button>" +
      '<button class="btn btn-ghost btn-sm" data-act="set-clear" style="color:var(--danger)">' + icon("trash") + "清空数据</button>" +
      '</div><input type="file" id="importFile" accept=".json" style="display:none"></div>' +
      '<div class="card"><div class="sec-title" style="font-size:16px;margin-bottom:12px">关于桃子工作台</div>' +
      '<div style="font-size:13px;color:var(--ink-2);line-height:1.8">AI 能力：DeepSeek ' + (YOYO.ai ? YOYO.ai.MODEL : "") + '（AI 面板 / Copilot / 复盘 / 标题实验室）<br>主题 IP：YOYO（红兜帽 × 星星黄斗篷）<br>其余模块为 Mock 数据，将逐步接入真实信源。</div></div>' +
      "</div>";
  }

  function emptyTip(text) {
    return '<div class="empty" style="grid-column:1/-1;padding:40px"><div class="empty-sub">' + text + "</div></div>";
  }

  /* ============ 路由 ============ */
  function currentRoute() {
    var h = location.hash.replace(/^#\//, "");
    return TITLES[h] ? h : "today";
  }
  function render() {
    var route = currentRoute();
    document.getElementById("pageTitle").textContent = TITLES[route];
    var items = document.querySelectorAll(".nav-item[data-route]");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle("active", items[i].getAttribute("data-route") === route);
    }
    var view = document.getElementById("view");
    var fn = { today: viewToday, media: viewMedia, studio: viewStudio, assets: viewAssets, calendar: viewCalendar, analytics: viewAnalytics, clients: viewClients, projects: viewProjects, knowledge: viewKnowledge, ai: viewAi, settings: viewSettings }[route];
    view.innerHTML = fn ? fn() : viewToday();
    hydrateIcons(view);
    hydrateMascots(view);
    updateAiContext(route);
    window.scrollTo(0, 0);
  }

  /* ============ AI 面板 ============ */
  var AI_HINTS = {
    today: ["今天最值得做什么？", "帮我安排今天的创作时间", "这周数据怎么样？"],
    media: ["这个话题值不值得做？", "帮我找 3 个新选题"],
    studio: ["帮我把口播精简到 90 秒", "优化这个标题", "生成 5 个开头"],
    analytics: ["最近播放为什么下降？", "哪类内容值得继续？"],
    default: ["帮我理一下今天的重点", "给我一个新选题灵感"]
  };
  var AI_CONTEXT = {
    today: "当前页面：首页 · 我看到你今天有 3 条待办、2 位客户要跟进。",
    media: "当前页面：自媒体中心 · 我可以帮你评估话题、找选题。",
    studio: "当前页面：创作台 · 我可以优化标题、开头、口播稿。",
    analytics: "当前页面：数据中心 · 我可以帮你做归因和复盘。",
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
        "；表现最好内容「" + D.stats.best.title + "」（" + D.stats.best.platform + " " + D.stats.best.views + " 播放）。";
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

    var replies = [
      "（Mock · 配置 API Key 后我会给出真实回答）基于当前数据：「AI 代理并行」话题匹配度 94、热度仍在上升，建议今天优先完成这条口播稿。",
      "（Mock · 配置 API Key 后我会给出真实回答）我对比了你近 30 天的内容：教程型的收藏率是观点型的 2.3 倍，建议做成「清单 + 实操截图」。",
      "（Mock · 配置 API Key 后我会给出真实回答）这条话题创作难度 42、新鲜度 88，窗口期大约还有 3 天——值得做，但要快。"
    ];
    var r = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(function () {
      body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">' + r + "</div>");
      body.scrollTop = body.scrollHeight;
    }, 400);
  }

  /* ============ 命令面板 ============ */
  var COMMANDS = [
    { label: "新建内容", type: "命令", go: "#/studio" },
    { label: "新建话题", type: "命令", go: "#/media" },
    { label: "新建待办", type: "命令", go: "#/today" },
    { label: "新建客户", type: "命令", go: "#/clients" },
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
    var cs = D.clients.filter(function (c) { return q && (c.name.toLowerCase().indexOf(q) > -1 || c.company.toLowerCase().indexOf(q) > -1); });
    if (cs.length) list.push('<div class="cmd-group">客户</div>' + cs.map(function (c) {
      return '<div class="cmd-item" data-go="#/clients"><span class="nav-ico">' + icon("clients") + "</span>" + c.name + " · " + c.company + '<span class="cmd-type">客户</span></div>';
    }).join(""));
    document.getElementById("cmdList").innerHTML = list.length ? list.join("") : '<div class="cmd-empty">没有找到「' + esc(q) + "」相关内容</div>";
  }

  /* ============ Quick Capture ============ */
  function classifyCapture(text) {
    if (/^https?:\/\//i.test(text)) return { to: "素材库", key: "asset" };
    if (/客户|报价|合作|林一|Carol/.test(text)) return { to: "客户", key: "client" };
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
    D.saveCapture(text, r.key);
    input.value = "";
    toast("已记入「" + r.to + "」");
  }

  /* ============ 标题生成（Mock） ============ */
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

    box.innerHTML = TITLE_TPL.map(function (t, i) {
      var text = t.tpl.replace(/\{k\}/g, k);
      var sc = { click: 60 + ((i * 13) % 38), density: 55 + ((i * 17) % 40), emotion: 50 + ((i * 19) % 45), match: 70 + ((i * 11) % 28) };
      return '<div class="title-row"><div style="flex:1"><div style="font-weight:600;font-size:13.5px">' + esc(text) + '</div>' +
        '<div class="topic-meta" style="margin-top:4px"><span class="tag tag-red">' + t.platform + '</span><span class="tag tag-yellow">' + t.style + "</span></div></div>" +
        '<div class="title-scores"><span>点击 ' + sc.click + "</span><span>密度 " + sc.density + "</span><span>情绪 " + sc.emotion + "</span><span>匹配 " + sc.match + "</span></div>" +
        '<button class="btn btn-soft btn-sm" data-act="save-title" data-text="' + esc(text) + '" data-platform="' + t.platform + '" data-style="' + t.style + '">收藏</button></div>';
    }).join("");
    toast("已生成 8 个候选标题（Mock）");
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
      var rate = ((c.metrics.likes + c.metrics.comments + c.metrics.saves) / c.metrics.views * 100).toFixed(1);
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

    setTimeout(function () {
      body.insertAdjacentHTML("beforeend", '<div class="ai-msg bot">（Mock 复盘 · 配置 API Key 后输出真实分析）<b>为什么表现' + (c.grade === "S" || c.grade === "A" ? "好" : "一般") + "</b>：播放 " + fmtNum(c.metrics.views) + "，收藏 " + fmtNum(c.metrics.saves) + "。<br>· 标题：数字+反差结构，点击潜力高<br>· 开头：前 3 秒直接给结果，留存 78%<br>· 选题：与账号「AI 实操」定位高度吻合<br>· 建议：同结构再做一条「工具链」内容。</div>");
      body.scrollTop = body.scrollHeight;
    }, 400);
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
      case "create-topic":
        toast("已创建草稿，正在进入创作台…");
        setTimeout(function () { location.hash = "#/studio"; }, 500);
        break;
      case "ignore-topic":
        D.ignoreTopic(id);
        var card = document.querySelector('[data-topic="' + id + '"]');
        if (card) { card.style.transition = "opacity .25s"; card.style.opacity = "0"; setTimeout(function () { card.remove(); }, 260); }
        toast("已忽略，今天不再推荐");
        break;
      case "capture": doCapture(); break;
      case "capture-scroll":
        var cap = document.querySelector(".capture-input");
        if (cap) { cap.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { cap.focus(); }, 400); }
        break;
      case "review-best": aiReview("ct1"); break;
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
      case "flow": S.studioStep = parseInt(v, 10); render(); toast("已进入「" + "选题,确定角度,内容结构,完整内容,平台适配,配图建议,封面建议,发布准备".split(",")[S.studioStep] + "」环节"); break;
      case "copilot":
        var out = document.getElementById("copilotOut");
        if (!out) break;
        if (aiReady()) {
          var draft = (document.getElementById("studioEditor") || {}).value || "";
          var title = (document.getElementById("studioTitle") || {}).value || "";
          out.insertAdjacentHTML("afterbegin", '<div class="copilot-res" data-typing><b>' + v + "</b><br>桃子助手正在处理…</div>");
          YOYO.ai.ask("请对以下内容执行指令：「" + v + "」。\n\n标题：" + title + "\n\n正文草稿：\n" + draft.slice(0, 2500), function (err, text) {
            var typing = out.querySelector("[data-typing]");
            if (typing) typing.remove();
            out.insertAdjacentHTML("afterbegin", '<div class="copilot-res"><b>' + v + "</b><br>" + (err ? "出错了：" + esc(err) : fmt(text)) + "</div>");
          });
        } else {
          out.insertAdjacentHTML("afterbegin", '<div class="copilot-res"><b>' + v + "（Mock）</b><br>" + (COPILOT_RESULTS[v] || "") + "</div>");
        }
        break;
      case "studio-save": toast("草稿已保存"); break;
      case "studio-schedule": toast("已加入排期：明天 12:00 · 小红书"); break;
      case "studio-clear":
        var ed = document.getElementById("studioEditor");
        if (ed && confirm("确定清空当前草稿？")) ed.value = "";
        break;
      case "gen-titles": genTitles(); break;
      case "save-title":
        D.saveTitle({ id: "tt" + Date.now(), text: t.getAttribute("data-text"), platform: t.getAttribute("data-platform"), style: t.getAttribute("data-style"), scores: { click: 80, density: 75, emotion: 70, match: 85 }, perf: "" });
        t.textContent = "已收藏 ✓";
        t.disabled = true;
        toast("已加入我的标题库");
        break;
      case "client-follow": toast("已记录跟进：" + new Date().toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })); break;
      case "client-more": toast("相关文件功能将在下一阶段开放"); break;
      case "proj-progress":
        D.projects.forEach(function (p) { if (p.id === id) p.progress = Math.min(100, p.progress + 10); });
        render();
        toast("进度已更新");
        break;
      case "proj-doc": toast("关联文档功能将在下一阶段开放"); break;
      case "k-summary": toast("AI 总结（Mock）：这条知识可复用在 3 个选题中"); break;
      case "k-link": toast("已关联到「AI 代理并行」内容（Mock）"); break;
      case "pub-edit": toast("平台版本编辑将在下一阶段开放"); break;
      case "pub-addver": toast("已添加新平台版本草稿（Mock）"); break;
      case "set-save":
        var s0 = D.getSettings();
        s0.name = document.getElementById("setName").value.trim() || "桃子";
        D.saveSettings(s0);
        toast("已保存，首页问候语将使用新称呼");
        break;
      case "set-save-key":
        var s1 = D.getSettings();
        s1.aiKey = document.getElementById("setKey").value.trim();
        D.saveSettings(s1);
        render();
        toast(s1.aiKey ? "API Key 已保存，AI 功能已激活" : "已清除 Key，回到 Mock 模式");
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
    if (e.target.id === "kSearch") {
      var q = e.target.value.trim().toLowerCase();
      var list = D.knowledge.filter(function (k) {
        return !q || k.title.toLowerCase().indexOf(q) > -1 || k.tags.join("").toLowerCase().indexOf(q) > -1 || k.summary.toLowerCase().indexOf(q) > -1;
      });
      document.getElementById("kList").innerHTML = list.length ? list.map(knowledgeCard).join("") : emptyTip("没有找到相关知识");
    }
    if (e.target.id === "studioEditor") {
      var wc = document.getElementById("wordCount");
      if (wc) wc.textContent = "约 " + e.target.value.replace(/\s/g, "").length + " 字 · 口播约 " + Math.max(1, Math.round(e.target.value.replace(/\s/g, "").length / 2.4)) + " 秒";
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "importFile" && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          Object.keys(data).forEach(function (k) { localStorage.setItem(k, JSON.stringify(data[k])); });
          toast("导入成功，数据已恢复");
        } catch (err) { toast("导入失败：文件格式不正确"); }
      };
      reader.readAsText(e.target.files[0]);
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmd(); }
    if (e.key === "Escape") { closeCmd(); closeAi(); }
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

  /* ============ 启动 ============ */
  renderNav();
  hydrateIcons(document);
  hydrateMascots(document);
  render();
  window.addEventListener("hashchange", render);

  document.getElementById("openCmd").addEventListener("click", openCmd);
  document.getElementById("cmdInput").addEventListener("input", function () { renderCmd(this.value); });
  document.getElementById("aiFab").addEventListener("click", openAi);
  document.getElementById("aiClose").addEventListener("click", closeAi);
  document.getElementById("aiSend").addEventListener("click", sendAi);
  document.getElementById("quickAdd").addEventListener("click", openCmd);
  document.getElementById("bell").addEventListener("click", function () { toast("3 条提醒：报价待回复 · 视频明天排期 · 周更截止周四"); });

  document.getElementById("aiBody").innerHTML = '<div class="ai-msg bot">你好，我是桃子助手。' + (aiReady() ? "AI 已连接，我可以读取当前页面上下文为你工作。" : "到「设置」配置 DeepSeek API Key 后，我就能给出真实回答（现在显示的是示例回复）。") + "</div>";
})();
