/* ============================================================
   桃子工作台数据层 — Mock 主数据 + 本地增量
   所有视图只访问 window.YOYO.data.*，第二阶段替换为 API 适配层。
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
      try { localStorage.setItem("yoyo_" + key, JSON.stringify(val)); } catch (e) {}
    }
  };

  /* ---------- 今日推荐话题 ---------- */
  var topics = [
    {
      id: "t1", title: "Claude Code 推出子代理并行工作流，独立开发者效率翻倍",
      summary: "多个 AI 子代理并行处理任务成为新范式，单人开发者可以像带团队一样调度 AI 协作。",
      source: "GitHub Trending", time: "2 小时前", heat: "12.4K", trend: "up",
      tags: ["AI Coding", "Agent"], status: "watching",
      platforms: ["小红书", "公众号"], format: "图文教程", angle: "亲测：一个人如何用 3 个 AI 代理并行做一个项目",
      scores: { heat: 82, value: 90, match: 94, freshness: 88, difficulty: 42 }, stars: 5,
      myNote: "和我「一人公司」系列强相关，可以做实测。", aiOpinion: "窗口期约 3 天，建议优先。"
    },
    {
      id: "t2", title: "「一人公司」工具栈 2026 版：从创作到收款的全流程",
      summary: "海外创作者整理出最新 solo business 工具清单，其中 AI 自动化占比首次超过 60%。",
      source: "Product Hunt", time: "5 小时前", heat: "8.1K", trend: "up",
      tags: ["工具", "效率"], status: "spark",
      platforms: ["公众号", "小红书"], format: "清单长文", angle: "国内替代版：我的一人公司工具栈实测",
      scores: { heat: 75, value: 85, match: 88, freshness: 72, difficulty: 30 }, stars: 4,
      myNote: "", aiOpinion: "清单类收藏率高，适合做系列开篇。"
    },
    {
      id: "t3", title: "本地大模型运行成本再降 40%，个人知识库迎来爆发点",
      summary: "量化技术 + 端侧推理优化，让消费级设备跑 70B 模型成为日常，隐私优先的知识管理方案火了。",
      source: "X / 科技媒体", time: "昨天", heat: "21.7K", trend: "up",
      tags: ["AI", "知识管理"], status: "ready",
      platforms: ["抖音", "B站"], format: "口播短视频", angle: "演示：断网状态下我的 AI 知识库问答",
      scores: { heat: 88, value: 82, match: 90, freshness: 80, difficulty: 58 }, stars: 5,
      myNote: "需要准备录屏素材。", aiOpinion: "演示类内容完播率高，注意前 3 秒钩子。"
    },
    {
      id: "t4", title: "Cursor vs Claude Code vs Windsurf：AI 编程工具横评又更新了",
      summary: "三大工具同一天发新版，社区实测对比帖登上热榜，「哪个最适合非程序员」成为热议角度。",
      source: "公众号 / X", time: "昨天", heat: "9.6K", trend: "flat",
      tags: ["AI Coding", "工具"], status: "creating",
      platforms: ["小红书", "视频号"], format: "对比测评", angle: "非程序员视角：写内容工具链该选谁",
      scores: { heat: 78, value: 74, match: 85, freshness: 66, difficulty: 50 }, stars: 4,
      myNote: "", aiOpinion: "横评类同质化严重，差异化角度是关键。"
    },
    {
      id: "t5", title: "AI 生成的「小黑人线稿插画」成为个人 IP 配图新趋势",
      summary: "极简黑白线稿 + 概念可视化的风格在创作者圈层流行，统一视觉风格成为账号识别度利器。",
      source: "小红书", time: "2 天前", heat: "6.3K", trend: "up",
      tags: ["个人实践", "AI"], status: "published",
      platforms: ["小红书"], format: "图文笔记", angle: "教程：3 分钟生成一套风格统一的个人 IP 配图",
      scores: { heat: 65, value: 80, match: 96, freshness: 74, difficulty: 25 }, stars: 4,
      myNote: "我已在用，可以出教程。", aiOpinion: "与你账号匹配度最高的一条。"
    },
    {
      id: "t6", title: "Obsidian + AI 插件生态盘点：第二大脑进入自动整理时代",
      summary: "AI 自动打标签、自动关联笔记的工作流成熟，「无整理知识库」理念引发大量讨论。",
      source: "RSS / 社区", time: "3 天前", heat: "4.8K", trend: "down",
      tags: ["知识管理", "效率"], status: "hold",
      platforms: ["公众号", "B站"], format: "深度长文", angle: "我的自动化知识库流水线完整搭建过程",
      scores: { heat: 58, value: 86, match: 82, freshness: 55, difficulty: 48 }, stars: 3,
      myNote: "", aiOpinion: "热度回落，可放入长期选题池。"
    }
  ];

  /* ---------- 内容（母稿，含平台版本与数据） ---------- */
  var contents = [
    { id: "ct1", title: "我用 3 个 AI 代理，一个人做完了过去一个团队的活", platform: "小红书", status: "published", date: "2026-08-06", format: "图文", topicId: "t1", grade: "S",
      metrics: { views: 42800, likes: 3102, comments: 486, saves: 1024, fans: 386 } },
    { id: "ct2", title: "2026 一人公司工具栈：从创作到收款我只用这 7 个", platform: "公众号", status: "published", date: "2026-08-04", format: "长文", topicId: "t2", grade: "A",
      metrics: { views: 18600, likes: 892, comments: 156, saves: 640, fans: 152 } },
    { id: "ct3", title: "断网也能用的 AI 知识库，我把 70B 模型装进了笔记本", platform: "抖音", status: "published", date: "2026-08-02", format: "短视频", topicId: "t3", grade: "A",
      metrics: { views: 25400, likes: 2105, comments: 342, saves: 512, fans: 268 } },
    { id: "ct4", title: "AI 编程工具怎么选？非程序员的真实使用对比", platform: "B站", status: "published", date: "2026-07-30", format: "中视频", topicId: "t4", grade: "B",
      metrics: { views: 12300, likes: 764, comments: 203, saves: 298, fans: 95 } },
    { id: "ct5", title: "3 分钟生成一套风格统一的个人 IP 配图（附提示词）", platform: "小红书", status: "published", date: "2026-07-27", format: "图文", topicId: "t5", grade: "S",
      metrics: { views: 38200, likes: 2876, comments: 398, saves: 1876, fans: 342 } },
    { id: "ct6", title: "我的自动化知识库流水线：Obsidian + AI 全自动整理", platform: "公众号", status: "published", date: "2026-07-24", format: "长文", topicId: "t6", grade: "B",
      metrics: { views: 9800, likes: 432, comments: 88, saves: 356, fans: 64 } },
    { id: "ct7", title: "小黑人线稿插画提示词大全：50 个场景直接抄", platform: "小红书", status: "published", date: "2026-07-21", format: "图文", topicId: "t5", grade: "A",
      metrics: { views: 21500, likes: 1654, comments: 234, saves: 1204, fans: 187 } },
    { id: "ct8", title: "一个人做自媒体：我的 AI 内容生产线全貌", platform: "视频号", status: "published", date: "2026-07-18", format: "短视频", topicId: "t2", grade: "C",
      metrics: { views: 5600, likes: 289, comments: 45, saves: 102, fans: 28 } },
    { id: "ct9", title: "「AI 代理并行」实测：3 个 Claude 同时帮我干活", platform: "小红书", status: "scheduled", date: "2026-08-10", format: "图文", topicId: "t1", grade: "",
      metrics: null, assetsReady: 80 },
    { id: "ct10", title: "一人公司工具栈·国内平替版（公众号首发）", platform: "公众号", status: "scheduled", date: "2026-08-12", format: "长文", topicId: "t2", grade: "",
      metrics: null, assetsReady: 60 },
    { id: "ct11", title: "本地大模型知识库搭建全流程（口播稿收尾中）", platform: "抖音", status: "draft", date: "2026-08-13", format: "短视频", topicId: "t3", grade: "",
      metrics: null, assetsReady: 40 },
    { id: "ct12", title: "AI 编程工具横评：内容创作者该选哪一个", platform: "视频号", status: "ready", date: "2026-08-15", format: "短视频", topicId: "t4", grade: "",
      metrics: null, assetsReady: 90 }
  ];

  /* ---------- 发布中心：母稿 → 平台版本 ---------- */
  var publishMasters = [
    {
      id: "pm1", title: "「AI 代理并行」实测", coverTag: "小红书风",
      versions: [
        { platform: "小红书", status: "scheduled", time: "明天 12:00", title: "我用 3 个 AI 代理，一个人做完一个团队的活", url: "" },
        { platform: "抖音", status: "draft", time: "待定", title: "3 个 AI 同时帮我干活是什么体验", url: "" },
        { platform: "公众号", status: "draft", time: "待定", title: "子代理并行工作流实测报告", url: "" }
      ]
    },
    {
      id: "pm2", title: "小黑人线稿插画教程", coverTag: "教程",
      versions: [
        { platform: "小红书", status: "published", time: "07-27 已发布", title: "3 分钟生成一套风格统一的个人 IP 配图", url: "xhs.link/mock1" },
        { platform: "视频号", status: "review", time: "复盘排期中", title: "个人 IP 配图教程", url: "" }
      ]
    }
  ];

  /* ---------- 素材库 ---------- */
  var assets = [
    { id: "a1", type: "截图", title: "Claude Code 子代理界面截图", tags: ["AI Coding", "实测"], fav: true, date: "08-08", note: "教程主图" },
    { id: "a2", type: "网站", title: "Product Hunt 一人公司工具帖", tags: ["工具", "参考"], fav: false, date: "08-08", note: "" },
    { id: "a3", type: "图片", title: "小黑人线稿·电脑工作场景", tags: ["IP 配图", "线稿"], fav: true, date: "08-07", note: "封面候选" },
    { id: "a4", type: "GitHub", title: " trending: agent-parallel-demo", tags: ["Agent", "开源"], fav: false, date: "08-07", note: "" },
    { id: "a5", type: "视频", title: "本地 70B 模型问答录屏", tags: ["知识管理", "演示"], fav: true, date: "08-06", note: "口播素材" },
    { id: "a6", type: "文章", title: "海外 solo business 报告 2026", tags: ["行业观察"], fav: false, date: "08-05", note: "" },
    { id: "a7", type: "数据", title: "近30天收藏率对比表", tags: ["复盘"], fav: false, date: "08-04", note: "教程型 2.3x" },
    { id: "a8", type: "BGM", title: "轻快 Lo-Fi（无版权）", tags: ["口播"], fav: false, date: "08-03", note: "" },
    { id: "a9", type: "封面参考", title: "小红书爆款封面拆解 10 张", tags: ["封面"], fav: true, date: "08-02", note: "" },
    { id: "a10", type: "案例", title: "「数字+反差」标题案例集", tags: ["标题"], fav: false, date: "08-01", note: "" }
  ];

  /* ---------- 客户 ---------- */
  var clients = [
    { id: "c1", name: "林一", company: "某 SaaS 公司", project: "AI 工具推广软广", contact: "微信", stage: "方案中", price: "¥8,000", lastTouch: "方案已发 3 天", nextAction: "今天跟进回复", followAt: "今天" },
    { id: "c2", name: "Carol", company: "知识付费课程", project: "课程分销合作", contact: "微信", stage: "沟通中", price: "¥12,000", lastTouch: "昨天语音 20 分钟", nextAction: "确认 8 月档期与报价", followAt: "今天" },
    { id: "c3", name: "阿凯", company: "AI 硬件初创", project: "新品体验视频", contact: "邮箱", stage: "潜在客户", price: "待谈", lastTouch: "对方主动私信", nextAction: "回复并约电话", followAt: "明天" },
    { id: "c4", name: "Momo", company: "效率工具 App", project: "季度内容合作", contact: "微信", stage: "合作中", price: "¥20,000/季", lastTouch: "周报已提交", nextAction: "下周提交月度数据", followAt: "周五" }
  ];

  /* ---------- 项目 ---------- */
  var projects = [
    { id: "p1", name: "桃子工作台", type: "个人工具", goal: "替代 5 个零散工具，一个页面管理创作全流程", status: "进行中", progress: 35, nextAction: "完成 Media Center", deadline: "08-31", color: "#F04E45" },
    { id: "p2", name: "「一人公司」内容系列", type: "内容项目", goal: "10 篇系列内容，建立赛道心智", status: "进行中", progress: 60, nextAction: "发布第 6 篇", deadline: "08-20", color: "#FFC93C" },
    { id: "p3", name: "小黑人 IP 形象体系", type: "AI 实验", goal: "固定提示词模板 + 50 场景图库", status: "进行中", progress: 80, nextAction: "整理提示词到知识库", deadline: "08-15", color: "#7FC4E8" },
    { id: "p4", name: "效率工具 App 季度合作", type: "客户项目", goal: "季度 12 条定制内容", status: "进行中", progress: 45, nextAction: "提交 8 月排期表", deadline: "10-31", color: "#B5D951" }
  ];

  /* ---------- 知识库 ---------- */
  var knowledge = [
    { id: "k1", title: "爆款标题的 4 个特征（复盘沉淀）", source: "方法库", updated: "08-07", tags: ["标题", "复盘"], summary: "数字具体化、反差对比、身份代入、结果前置——来自 S 级内容的共性。" },
    { id: "k2", title: "小黑人线稿提示词模板", source: "本地笔记", updated: "08-06", tags: ["AI", "配图"], summary: "flat hand-drawn, minimal line art, warm healing style…含 5 个变体。" },
    { id: "k3", title: "小红书图文结构：清单体", source: "方法库", updated: "08-05", tags: ["结构", "小红书"], summary: "封面数字清单 → 痛点共鸣 → 逐条展开 → 行动指令。" },
    { id: "k4", title: "口播稿节奏：90 秒结构", source: "Obsidian", updated: "08-03", tags: ["口播", "短视频"], summary: "0-3s 钩子 / 3-15s 冲突 / 15-70s 主体 / 70-90s 行动。" },
    { id: "k5", title: "AI 工具赛道信源清单", source: "RSS 收藏", updated: "08-01", tags: ["信源"], summary: "GitHub Trending、PH、5 个公众号、3 个 X 账号。" }
  ];

  /* ---------- 标题库 ---------- */
  var titleBank = [
    { id: "tt1", text: "我用 3 个 AI 代理，一个人做完了过去一个团队的活", platform: "小红书", style: "结果型", scores: { click: 92, density: 85, emotion: 78, match: 95 }, perf: "42.8K 播放" },
    { id: "tt2", text: "别再乱收藏了，AI 现在自动帮你整理知识库", platform: "抖音", style: "冲突型", scores: { click: 88, density: 72, emotion: 84, match: 86 }, perf: "25.4K 播放" },
    { id: "tt3", text: "3 分钟生成一套风格统一的个人 IP 配图（附提示词）", platform: "小红书", style: "教程型", scores: { click: 85, density: 90, emotion: 60, match: 92 }, perf: "38.2K 播放" },
    { id: "tt4", text: "2026 一人公司工具栈：从创作到收款我只用这 7 个", platform: "公众号", style: "信息差型", scores: { click: 80, density: 88, emotion: 55, match: 90 }, perf: "18.6K 阅读" }
  ];

  /* ---------- 内容流水线 ---------- */
  var pipeline = [
    { key: "spark",     label: "灵感",   count: 12, color: "#F7A8C4" },
    { key: "ready",     label: "待创作", count: 5,  color: "#FFC93C" },
    { key: "creating",  label: "创作中", count: 3,  color: "#F89C3C" },
    { key: "scheduled", label: "待发布", count: 4,  color: "#7FC4E8" },
    { key: "published", label: "已发布", count: 18, color: "#B5D951" }
  ];

  /* ---------- 今日重点 ---------- */
  var tasks = [
    { id: "k1", title: "给「AI 代理并行」口播稿收尾", due: "今天 16:00", overdue: false },
    { id: "k2", title: "回复品牌方合作报价", due: "昨天", overdue: true },
    { id: "k3", title: "整理本周爆款标题到标题库", due: "今天", overdue: false }
  ];

  var followClients = [
    { id: "c1", name: "林一 · 某 SaaS 市场负责人", note: "方案已发 3 天未回，今天跟进", stage: "方案中" },
    { id: "c2", name: "Carol · 知识付费课程", note: "确认 8 月档期与报价", stage: "沟通中" }
  ];

  var upcoming = [
    { title: "「AI 工具栈」视频排期发布", when: "明天 12:00" },
    { title: "8 月选题会（自己）", when: "周一 10:00" },
    { title: "公众号周更截止", when: "周四" }
  ];

  /* ---------- 最近数据 ---------- */
  var stats = {
    weekPosts: 5,
    views: "128.4K", viewsDelta: "+18%",
    engagement: "8,412", engagementDelta: "+9%",
    saves: "2,138", savesDelta: "+22%",
    fans: "+1,204", fansDelta: "+15%",
    spark: [42, 55, 48, 70, 66, 92, 88],
    bars: [32, 45, 28, 62, 50, 78, 88],
    best: {
      title: "我用 3 个 AI 代理，一个人做完了过去一个团队的活",
      platform: "小红书",
      views: "42.8K", saves: "1,024", fans: "+386"
    }
  };

  /* ---------- 数据中心 AI 分析 ---------- */
  var aiInsights = [
    { title: "本周表现最好", text: "「AI 代理并行」小红书图文：42.8K 播放、收藏率 2.4%。开头 3 秒留存 78%，「数字+反差」标题贡献最大。", tone: "sage" },
    { title: "表现最差", text: "「AI 内容生产线全貌」视频号：5.6K 播放、完播 31%。开头铺垫过长，主题偏自嗨。", tone: "apricot" },
    { title: "增长最快主题", text: "「个人 IP 视觉」相关两条内容涨粉 529，占总涨粉 44%。值得做成固定栏目。", tone: "pink" },
    { title: "下周建议", text: "继续做「教程型+提示词」组合；暂停全景式自嗨选题；公众号长文收藏率稳，保持周更。", tone: "yellow" }
  ];

  /* ---------- localStorage 增量 ---------- */
  function getExtraTopics() { return LS.get("topics_extra", []); }
  function getIgnored() { return LS.get("ignored_topics", []); }
  function getCaptures() { return LS.get("captures", []); }
  function getMyTitles() { return LS.get("titles", []); }
  function getSettings() { return LS.get("settings", { name: "桃子" }); }
  function getGhCache() { return LS.get("gh_cache", null); }
  function setGhCache(list) { LS.set("gh_cache", { list: list, ts: Date.now() }); }

  function saveTopic(topic) {
    var extra = getExtraTopics();
    if (extra.some(function (x) { return x.id === topic.id; })) return;
    extra.unshift({
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
    });
    LS.set("topics_extra", extra);
  }
  function removeTopic(id) {
    LS.set("topics_extra", getExtraTopics().filter(function (x) { return x.id !== id; }));
  }
  function isTopicSaved(id) {
    return getExtraTopics().some(function (x) { return x.id === id; });
  }
  function ignoreTopic(id) {
    var ig = getIgnored();
    if (ig.indexOf(id) === -1) ig.push(id);
    LS.set("ignored_topics", ig);
  }
  function saveCapture(text, routedTo) {
    var caps = getCaptures();
    caps.unshift({ id: "cap" + Date.now(), text: text, routedTo: routedTo, createdAt: Date.now() });
    LS.set("captures", caps);
  }
  function saveTitle(t) {
    var arr = getMyTitles();
    arr.unshift(t);
    LS.set("titles", arr);
  }
  function saveSettings(s) { LS.set("settings", s); }
  function exportAll() {
    var dump = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("yoyo_") === 0) dump[k] = LS.get(k.slice(5), null);
    }
    return JSON.stringify(dump, null, 2);
  }
  function clearAll() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("yoyo_") === 0) keys.push(k);
    }
    keys.forEach(function (k) { localStorage.removeItem(k); });
  }

  /* ---------- 导出 ---------- */
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
    getIgnored: getIgnored,
    getCaptures: getCaptures,
    getMyTitles: getMyTitles,
    getSettings: getSettings,
    getGhCache: getGhCache,
    setGhCache: setGhCache,
    saveTopic: saveTopic,
    removeTopic: removeTopic,
    isTopicSaved: isTopicSaved,
    ignoreTopic: ignoreTopic,
    saveCapture: saveCapture,
    saveTitle: saveTitle,
    saveSettings: saveSettings,
    exportAll: exportAll,
    clearAll: clearAll,
    getExtraTopics: getExtraTopics
  };
})();
