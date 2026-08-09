# YOYO · Personal Workspace — 产品架构

> 版本：v0.2（可用原型）｜日期：2026-08-09

## 1. 产品定位

YOYO 是一个人的 Personal OS：以「内容创作 + 个人事务管理」为核心的长期工作系统。
不是企业后台，不是 BI 看板。它每天只回答一个问题：

> **我今天最值得做什么？**

并把一个灵感持续推进成：话题 → 选题 → 内容 → 发布 → 数据 → 复盘 → 资产。

## 2. 模块权重（设计资源分配原则）

| 层级 | 模块 | 权重 |
|---|---|---|
| P0 核心 | 首页 Today、自媒体中心 Media、创作台 Studio | 最高设计/交互预算 |
| P1 重要 | 话题库 Topics、内容日历 Calendar、数据 Analytics、素材 Assets | 完整功能 |
| P2 支撑 | 内容库、发布中心、客户 Clients、项目 Projects、知识库、AI Assistant | 轻量可用 |
| P3 基础 | 设置 Settings | 最小实现 |

**禁止平均用力。** 首页 / Media / Studio 的打磨优先级永远高于其他页面。

## 3. 核心业务闭环（数据流转主线）

```
发现机会(Discover) → 收藏话题(Topics) → AI分析 → 确定选题
→ 内容创作(Studio) → 准备素材(Assets) → 排期(Calendar)
→ 发布(Publish) → 数据回收(Analytics) → AI复盘
→ 沉淀(内容资产 Content Library / 知识库 Knowledge / 标题库)
```

设计约束：**任何页面上的实体都必须有「下一步去向」按钮**（话题→创作、内容→排期、发布→复盘、复盘→方法库）。不允许设计孤立页面。

## 4. 应用结构

```
yoyo/                      纯静态工程，零依赖，无构建步骤
├── index.html             App Shell（Sidebar + Header + 路由容器 + AI Panel + ⌘K）
├── assets/
│   ├── css/yoyo.css       YOYO Design System（tokens + 全部组件）
│   └── js/
│       ├── data.js        Mock 主数据 + localStorage 增量读写
│       ├── ai.js          DeepSeek 前端适配层（未配置时回退示例）
│       └── app.js         路由、视图、交互与 GitHub Search 适配
├── manifest.json          PWA 元数据
└── sw.js                  网络优先、离线回退缓存
└── (未来) assets/js/views/  各模块视图拆分点
```

**技术决策：**
- 第一阶段不上框架、不引 CDN、不做构建。原生 HTML/CSS/JS + Hash Router。
- 理由：单仓库可双击打开、零运维、加载极快；组件通过「CSS 类 + 纯函数渲染」复用。
- 视图主要通过 `YOYO.data.*` 访问业务数据；GitHub 请求目前仍位于 `app.js`，后续应移入独立适配层。
- 本地持久化用 localStorage，key 统一前缀 `yoyo_`。
- 线上由 Caddy 作为静态文件服务器，地址为 `https://workbench.taozipipi.cn`。

## 5. 一级导航（Sidebar 220px）

01 首页 Today · 02 自媒体 Media · 03 创作 Studio · 04 素材 Assets · 05 内容日历 Calendar · 06 数据 Analytics · 07 客户 Clients · 08 项目 Projects · 09 知识库 Knowledge · 10 AI Assistant ｜ 底部：Settings + 头像

## 6. 全局能力（贯穿所有页面）

- **Command Center（⌘K）**：全局搜索（内容/话题/素材/客户/项目/知识）+ 快捷命令（New Content / New Topic / Quick Capture / Ask AI…）
- **AI Side Panel**：右下角常驻按钮，感知当前页面上下文；配置 DeepSeek Key 后输出真实回答，否则显示示例回复。
- **Quick Capture**：一处输入，当前使用前端关键词规则分流并写入浏览器本地记录。
- **Toast / Modal / Drawer / Empty State**：全局统一组件。
- **PWA**：支持添加到主屏幕；HTTPS/localhost 下注册 Service Worker，并采用网络优先缓存。

## 7. 当前数据与安全边界

- 已接入 GitHub Search API 和 DeepSeek API；其余业务主体仍使用 Mock 数据。
- DeepSeek Key 保存在浏览器 localStorage，前端直连，仅适合个人工作台；面向他人开放前必须增加服务端代理。
- 不真实发布、不回收平台数据、不同步 Obsidian、无账号权限、无云端同步、无支付。
- localStorage 按域名隔离；localhost 数据迁移到线上域名需通过设置页导出/导入。

## 8. 迭代路线

1. **P1-P6（完成）**：文档、设计系统、App Shell 与 11 个 Mock 页面。
2. **P7A（完成）**：DeepSeek、GitHub 热门新项目、话题本地收藏、JSON 备份、PWA、公网 HTTPS 部署。
3. **P7B（下一步）**：草稿、排期、内容状态等核心闭环持久化；拆分 `app.js`。
4. **P8**：安全 AI 代理、真实信源适配、平台数据回收与复盘资产化。
