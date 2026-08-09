# 桃子工作台实施计划（Implementation Plan）

> 核心原则：**不为「功能多」牺牲体验。** 每个模块做完 → 运行 → 查 Console → 查响应式 → 确认后再下一个。

## Phase 1（已完成 ✅）

- [x] 五份文档：架构 / 设计系统 / 页面地图 / 数据模型 / 实施计划
- [x] 桃子工作台 Design System（CSS tokens + 全部基础组件）
- [x] App Shell：Sidebar 220px + Header + Hash Router + AI Panel + ⌘K + Toast
- [x] 首页 Today 完整实现（今日重点 / 内容推荐 / 内容进度 / 最近数据 / Quick Capture）
- [x] Mock 数据层 + localStorage 持久化
- [x] 其余 10 个路由占位页（导航全通，明确「下一阶段」提示）

## Phase 2：Media Center（已完成 ✅）

- 内容总览 Tab（进度 Kanban 摘要 + 最近内容）
- Discover 今日推荐完整页（筛选：来源/赛道/评分排序）
- 与首页推荐共用 Content Card 组件

## Phase 3：Topics 话题库（已完成 ✅）

- Card / Table / Kanban 三视图切换
- 状态机：灵感→观察中→准备创作→创作中→已发布｜暂缓｜归档
- 筛选：AI / AI Coding / 工具 / Agent / 开源 / 个人实践 / 知识管理 / 效率 / 行业观察
- 每条：我的想法 + AI观点 + 关联素材/内容

## Phase 4：Studio 创作台 + 标题实验室（已完成 ✅）

- 左右结构：编辑器 + AI Copilot（14 种指令按钮；配置 Key 后调用 DeepSeek，否则回退示例）
- 流程条：选题→角度→结构→成稿→平台适配→配图→封面→发布准备
- 标题实验室：4 平台 × 7 风格生成 + 四维评分 + 我的标题库

## Phase 5：Assets / Calendar / Publish（UI 已完成 ✅）

- Assets：13 种类型、网格/列表、AI 自动标签（Mock）、收藏夹
- Calendar：月/列表、状态色；拖拽改期尚未实现
- Publish：母稿→平台版本树、状态流转（仅 UI，不接 API）

## Phase 6：Analytics / AI 复盘 / 轻量模块（已完成 ✅）

- Analytics：核心指标 + AI 分析区 + TOP10 排行榜
- AI 复盘页：8 段式复盘 + 沉淀到方法库
- Clients / Projects / Knowledge 入口 / Settings

## Phase 2-6（已于 2026-08-09 一次性交付 ✅，交付时主体为 Mock）

- [x] Media Center：内容总览（指标+看板）/ 今日推荐（筛选）/ 话题库（卡片·表格·看板三视图+赛道筛选）/ 内容库（数据表+AI复盘）/ 发布管理（母稿→平台版本树）
- [x] Studio 创作台：8 步流程条 + 编辑器（实时字数/口播时长）+ 14 个 Copilot 指令（Mock 结果）+ 标题实验室（4 平台 × 7 风格生成 + 四维评分 + 收藏入标题库）
- [x] Assets 素材库：类型筛选 + 网格/列表 + 收藏夹
- [x] Calendar 内容日历：月视图（状态色事件+今天红圈）+ 列表视图（素材完成度条）
- [x] Analytics 数据中心：指标卡 + 柱状/折线图 + AI 分析 4 卡 + TOP10 排行榜
- [x] Clients / Projects / Knowledge / Settings（导出/导入/清空二次确认）
- [x] 全站中文化 + YOYO IP 吉祥物修正（经无头 Chrome 渲染校验）

**已验证**：9 个路由逐一截图检查，修复了 SVG 图标无约束尺寸、aiInsights 引用错误两个 bug。

## Phase 7A：首批真实能力与部署（已完成 ✅）

- [x] DeepSeek：AI 面板、Copilot、标题、复盘、GitHub 项目分析
- [x] GitHub Search：近 7 天热门新仓库，6 小时缓存
- [x] GitHub 话题完整快照收藏与移出
- [x] 本地数据 JSON 导出/导入/清空
- [x] PWA Manifest、Service Worker、移动端安全区适配
- [x] 部署至 `https://workbench.taozipipi.cn`，Caddy 自动 HTTPS
- [x] 公网桌面/移动渲染检查，无 JavaScript 报错

## Phase 7B：可持续使用（当前下一步）

- [ ] 草稿正文与标题持久化
- [ ] 内容从创作到排期的状态写入
- [ ] 客户跟进、项目进度、素材收藏持久化
- [ ] 平台版本编辑与发布状态流转
- [ ] 把 GitHub 请求从 `app.js` 移入数据/信源适配层
- [ ] 拆分约 93 KB 的 `app.js`，按视图与能力组织模块
- [ ] 建立全路由自动化冒烟检查

## Phase 8：安全 API 与真实业务数据

- 增加服务端 AI 代理，避免公共部署下在浏览器保存共享 Key
- 接入 RSS/其他真实信源与平台数据回收
- 逐步替换内容、客户、项目和数据中心的 Mock 数据
- 评估账号、云端同步和多端数据一致性
- 每接一个模块回归验证一次

## 工程约束（全程有效）

1. 零外部依赖，单仓静态文件，双击可开
2. 组件复用优先：新页面先查已有 CSS 类
3. 微交互 150–250ms，不为高级感加动画
4. 数据向后兼容：新模块用新 localStorage key
5. 每阶段结束更新本文件勾选状态
6. 线上发布前检查不包含 API Key、密码或个人导出的 JSON 数据
