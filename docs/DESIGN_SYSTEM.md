# YOYO Design System

> 关键词：Clean · Soft · Editorial · Playful · Calm · Modern · Human
> 原则：**留白 > 阴影，层级 > 边框，排版 > 装饰。**
> 主题 IP：**YOYO（名创优品）** — 红兜帽 + 星星黄斗篷 + 星星元素，圆润治愈但不过度幼儿化。

## 0. YOYO IP 主题规则

- **主色**：YOYO 红 `#F04E45`（兜帽）+ 星星黄 `#FFC93C`（斗篷），红做品牌高光、黄做行动按钮
- **辅助色**：取自 YOYO 换装系列 — 粉/蓝/绿/橙，全部用柔光版（*-soft）做底、深一号做字
- **吉祥物**：使用 `yoyo/assets/yoyo-avatar.png` 图片头像；`app.js` 中的 `MASCOT` SVG 仅作为未启用的备选。出现位置固定：Sidebar 品牌位、头像、首页问候徽章、空状态、AI 面板头
- **星星元素**：仅用于吉祥物周围和评分星级，不泛滥
- 红色使用纪律：导航选中态、Quick Capture 卡、趋势↑、逾期——每屏红色焦点 ≤2 处

## 1. Color Tokens

```css
/* 基底 — 奶油暖白纸感 */
--bg:        #FAF7F1;
--surface:   #FFFFFF;
--ink:       #2B2622;
--ink-2:     #7A736A;
--ink-3:     #B0A897;
--border:    #EDE8DD;

/* YOYO IP 主色 */
--red:       #F04E45;   /* 兜帽红 — 品牌高光/选中态/重点卡 */
--red-deep:  #D63A31;
--red-soft:  #FDECEA;
--yellow:    #FFC93C;   /* 星星黄 — 行动按钮/高亮 */
--yellow-soft:#FFF4D6;

/* YOYO 换装色系（状态/标签） */
--lime:      #B5D951;   --lime-soft:  #F4F9E4;
--blue:      #7FC4E8;   --blue-soft:  #EAF5FC;
--pink:      #F7A8C4;   --pink-soft:  #FDEDF4;
--orange:    #F89C3C;   --orange-soft:#FDF0E0;

/* 语义色 */
--danger:    #E0483E;
--up:        #E0483E;   /* 趋势↑ 暖红 */
--down:      #7A9B76;   /* 趋势↓ 绿 */
```

反模式（禁止）：大面积蓝色、赛博朋克、霓虹、高饱和渐变、满屏数据、过度玻璃拟态。

## 2. Type Scale

| Token | 字号/行高/字重 | 用途 |
|---|---|---|
| Display | 34px / 1.2 / 700 | 页面大标题、问候语 |
| H1 | 26px / 1.3 / 700 | 页面标题 |
| H2 | 19px / 1.4 / 650 | 区块标题 |
| H3 | 15px / 1.5 / 650 | 卡片标题 |
| Body | 14px / 1.65 / 400 | 正文 |
| Small | 12.5px / 1.5 / 400 | 辅助信息 |
| Num | 几何感数字 | `font-variant-numeric: tabular-nums`，数据指标 |

字体栈：`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif`
标题层级必须明显，禁止全页字号趋同。

## 3. Spacing / Radius / Shadow

```
spacing: 4 8 12 16 20 24 32 48（8pt 体系）
--r-card: 18px   --r-btn: 12px   --r-tag: 999px   --r-input: 12px
--shadow-1: 0 1px 2px rgba(37,37,37,.04)
--shadow-2: 0 4px 16px rgba(37,37,37,.06)   /* 仅悬浮态 */
```

## 4. 卡片体系（四种尺寸，禁止全部同尺寸）

| 卡片 | 特征 | 用途 |
|---|---|---|
| Hero Card | 大留白、Display 字、可带 Accent 底色 | 首页问候、核心指标 |
| Standard Card | 白底 18px 圆角，24px 内边距 | 区块容器 |
| Mini Card | 紧凑、数字优先 | 内容进度、小指标 |
| Content Card | 标题+摘要+元信息+操作区 | 话题推荐、内容条目 |
| Media Card | 封面图 16:9 + 信息层 | 素材、已发布内容 |

## 5. 组件规范

- **Button**：primary（ink 黑底白字）/ soft（米灰底）/ ghost（无框）/ accent（黄底黑字，每屏≤1 个视觉焦点）
- **Tag**：胶囊，`--r-tag`，换装色系浅底 + 深字（yellow/lime/orange/pink/red/blue）
- **Status**：Idea(pink) · Draft(yellow) · Ready(lime) · Scheduled(blue) · Published(lime 实心) · Review(orange)
- **Input**：白底、`--border` 描边、focus 时描边变 ink；字号 ≥16px（移动端防 iOS 缩放）
- **评分条**：5 维评分用 4px 细条 + 数值；星级用 ★
- **Table**：无竖线，行底 1px `--border`，hover 行底色 `--bg`
- **Kanban**：列头 = 状态点 + 名称 + 计数
- **Empty State**：一句话 + 一个主按钮，不用插画堆砌
- **Skeleton**：`--bg` 到 `#EFECE6` 的呼吸渐变
- **Toast**：右下角滑入，ink 底色白字，2.4s 自动消失
- **Drawer/AI Panel**：右侧 380px，`--shadow-2`
- **图标**：仅内联 SVG（18px，stroke 1.6），**禁用 emoji 当图标**

## 6. 微交互

- 时长 150–250ms，缓动 `cubic-bezier(.4,0,.2,1)`
- 仅：hover 上浮 1px / 面板滑入 / Toast 滑入 / 按钮压暗
- 不做为「高级」而存在的动画

## 7. 布局

- Desktop First @1440px：Sidebar 220px 固定 + 主区自适应（max 1200px，padding 32px）+ 可选右侧 AI Panel
- Header 56px：Page Title / ⌘K 搜索 / Quick Add / Notification / Avatar
- <900px：Sidebar 收为底部 Tab；卡片单列堆叠；按钮 ≥44px；适配 `env(safe-area-inset-bottom)`

## 8. 文案语气

轻松、简短、像朋友：
"Good afternoon." / "Today's focus." / "You have 3 ideas waiting." / "One thing at a time."
不大面积可爱插画、不幼儿化、克制使用 Emoji（仅问候语可出现 1 个）。
