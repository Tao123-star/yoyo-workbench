# YOYO 页面地图（Page Map）

> 路由采用 Hash Router：`#/today` 等。★ = 已实现，△ = 部分真实/部分演示。

## 导航与路由

| # | 页面 | 路由 | 状态 | 说明 |
|---|---|---|---|---|
| 01 | 首页 Today | `#/today` | △ | GitHub 热门新项目 + 精选 Mock + 本地任务聚合 |
| 02 | 自媒体 Media | `#/media` | △ | 5 个 Tab；GitHub 信源与话题收藏真实，其余主体为 Mock |
| 03 | 创作 Studio | `#/studio` | △ | DeepSeek Copilot/标题真实可用；草稿保存和排期仍为演示 |
| 04 | 素材 Assets | `#/assets` | △ | Mock 素材的网格/列表、类型筛选和当前会话收藏 |
| 05 | 内容日历 Calendar | `#/calendar` | △ | 月/列表视图；数据为 Mock，尚未支持拖拽或持久化排期 |
| 06 | 数据 Analytics | `#/analytics` | △ | Mock 指标/图表/TOP10；配置 Key 后可做真实 AI 复盘 |
| 07 | 客户 Clients | `#/clients` | △ | 轻量 CRM 展示；跟进记录尚未持久化 |
| 08 | 项目 Projects | `#/projects` | △ | 目标/进度/下一步展示；进度修改仅当前页面会话有效 |
| 09 | 知识库 Knowledge | `#/knowledge` | △ | Mock 知识搜索；未连接 Obsidian，关联操作为演示 |
| 10 | AI Assistant | `#/ai` | △ | 配置 DeepSeek Key 后真实调用；否则回退示例 |
| — | 设置 Settings | `#/settings` | ★ | 称呼、DeepSeek Key、连接测试、导出/导入、清空二次确认 |

## 首页 Today 结构（本轮交付）

```
Header: Good afternoon · 日期 · 天气 · Focus 状态 · 一句今日提示
├── A. 今日重点（Standard Cards ×4）
│    今日待办 / 创作中 / 待发布 / 客户跟进 + 即将到来的事
├── B. 今日内容推荐 Discover（GitHub Top4 + 精选示例）
│    GitHub：近 7 天创建仓库按 Star 排序，可调用 DeepSeek 分析
│    精选：标题·摘要·来源·热度·趋势·匹配度·平台·角度
│    操作：加入话题库 / 开始创作 / 暂不关注
├── C. 内容进度（Mini Cards ×5）
│    灵感 12 · 待创作 5 · 创作中 3 · 待发布 4 · 已发布 18
├── D. 最近数据（轻量，非 BI）
│    近7天发布 / 总播放 / 互动 / 收藏 / 涨粉 / 表现最好内容 + SVG 走势
└── E. Quick Capture（醒目输入框）
     想法/网址/标题/选题 → 前端规则判断去向 → localStorage 记录
```

## 页面间流转（闭环路径）

```
Discover 推荐卡 ──加入话题库──▶ Topics(观察中)
Discover/Topics ──开始创作──▶ Studio(新建草稿, 带入选题)
Studio ──完成──▶ Calendar / Publish（目前仅 UI 提示，待持久化）
Publish ──已发布──▶ Content Library ──AI复盘（平台数据仍为 Mock）
任何页面 ──Quick Capture / ⌘K──▶ 对应模块
```

## 全局元素

- **⌘K Command Center**：搜索全实体 + 快捷命令（New Content / New Topic / New Task / New Client / Ask AI / Quick Capture）
- **AI Side Panel**：右下常驻，随路由切换上下文；配置 Key 后调用 DeepSeek
- **Toast**：所有操作的统一反馈
