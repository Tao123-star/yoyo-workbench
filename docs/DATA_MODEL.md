# 桃子工作台数据模型（Data Model）

> 当前采用混合数据模式：`data.js` 提供 Mock 主数据，用户增量写入 localStorage；GitHub 热门新项目来自实时 API 并缓存 6 小时。
> 后续目标是把外部请求和持久化统一收口为适配层，尽量保持视图调用签名稳定。

## 实体关系

```
Topic 1───n Content 1───n ContentVersion(平台版本) 1───n MetricSnapshot
 │                │                                        │
 │                n                                        ▼
 └───n Asset n────┘                                  AIReview(复盘)
Client 1───n Project n───n Content        KnowledgeNote(方法库/知识)
```

## Topic（话题）

```js
{
  id, title, summary, source,        // 来源：GitHub / ProductHunt / 小红书…
  sourceUrl, discoveredAt,           // 发现日期
  tags: [], track,                   // 内容赛道：AI Coding / 工具 / Agent…
  heat, trend: 'up|down|flat',       // 热度 + 趋势
  scores: { heat, value, match, freshness, difficulty },  // 五维评分 0-100
  stars: 1-5,                        // 综合推荐
  matchScore,                        // 与我账号匹配度
  platforms: [], format, angle,      // 推荐平台 / 内容形式 / 创作角度
  myNote, aiOpinion,                 // 我的想法 / AI观点
  status: 'spark|watching|ready|creating|published|hold|archived',
  assetIds: [], contentIds: []
}
```

## Content（内容母稿）

```js
{
  id, title, cover, topicId,
  status: 'idea|draft|ready|scheduled|published|review',
  scheduledAt, publishedAt, owner,
  assetsReady: 0-100,                // 素材完成度
  versions: [ ContentVersion ],      // 抖音/小红书/视频号/公众号/B站…
  metrics: { views, likes, comments, saves, fans, completion },
  grade: 'S|A|B|C',                  // 表现等级
  reviewId                           // AI 复盘
}
```

## ContentVersion（平台版本）

```js
{ id, contentId, platform, title, body, tags, cover, scheduledAt, status, publishUrl, result }
```

## Asset（素材）

```js
{ id, type: 'image|video|shot|site|article|repo|data|case|person|music|bgm|cover-ref|idea',
  title, url, thumb, tags: [], aiTags: [], favorite, note, topicIds: [], contentIds: [], createdAt }
```

## Client（客户）

```js
{ id, name, company, project, contact, stage: 'lead|talking|proposal|active|done|paused',
  price, lastTouch, nextAction, followAt, fileIds: [] }
```

## Project（项目）

```js
{ id, name, type: 'site|tool|ai-lab|client|content|product',
  goal, status: 'active|paused|done', progress: 0-100,
  nextAction, deadline, docIds: [], contentIds: [], clientId }
```

## KnowledgeNote / TitleAsset（知识库 & 标题库）

```js
// 知识：{ id, title, source: 'obsidian|drive|local|method', summary, tags, linkedContentIds, updatedAt }
// 标题：{ id, text, platform, style: '信息差|冲突|好奇|观点|结果|教程|故事',
//        scores: { click, density, emotion, match }, metricsSnapshot? }
```

## Task / Capture

```js
// Task: { id, title, due, done, priority: 'P0|P1|P2', source }
// Capture: { id, text, routedTo: 'topic|asset|idea|task|client|knowledge', createdAt }
```

## localStorage Keys

| Key | 内容 |
|---|---|
| `yoyo_topics_extra` | 用户收藏/新增话题 |
| `yoyo_captures` | Quick Capture 记录 |
| `yoyo_ignored_topics` | 「暂不关注」列表 |
| `yoyo_titles` | 标题库 |
| `yoyo_settings` | 称呼与 DeepSeek API Key |
| `yoyo_gh_cache` | GitHub Search 结果与缓存时间（6 小时） |

导出会收集所有 `yoyo_` 前缀的键；导入会恢复 JSON 中的同名键。不同域名拥有独立 localStorage，迁移需手动导出/导入。

## 真实数据适配

### GitHub 热门新项目

- 接口：GitHub Search Repositories API
- 查询：最近 7 天创建，按 Star 降序，最多 12 条
- 说明：界面历史命名为 “GitHub Trending”，但数据并非 GitHub 官方 Trending 榜单
- 缓存：`yoyo_gh_cache`，有效期 6 小时

### DeepSeek

- 模型：`deepseek-chat`
- 用途：AI 面板、Copilot、标题生成、内容复盘、GitHub 项目分析
- Key：存于当前浏览器的 `yoyo_settings.aiKey`，由前端直连 API
- 边界：只适合个人使用；公共产品必须改为服务端代理，不能把共享 Key 下发到浏览器

## 尚未持久化的交互

草稿保存、加入排期、客户跟进、项目进度、素材收藏和平台版本编辑等部分操作目前仅显示 Toast 或修改内存数据，刷新后可能恢复。实现真实闭环时应先补齐这些写模型。

## Mock 数据规模（第一阶段）

话题 8 · 内容 12（含 5 状态分布）· 素材 10 · 客户 4 · 项目 4 · 任务 5 · 知识 5
首页所有数字由 Mock 数据实时聚合，不写死。
