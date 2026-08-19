# 桃子工作台（YOYO Workbench）

面向个人自媒体创作的轻量工作台，把灵感、选题、初稿、内容排期、素材与复盘放进一条可确认、可追踪的工作流。

线上版本：<https://workbench.taozipipi.cn>

## 核心功能

- 首页：今日待办、每日 AI 行业选题推荐、快速记录
- AI 创作台：选题库、手动或 AI 辅助创作、初稿确认
- 自媒体中心：内容状态、排期、发布与数据复盘
- 素材库：保存链接、网站、图片、文字和灵感
- 个人账号：服务端登录、SQLite 持久化、多设备同步与冲突保留
- 每日推荐：基于公开 GitHub、Hacker News 信号生成抖音和小红书适配选题；不是平台官方热榜

## 本地运行

前端为静态页面，可直接启动本地静态服务器：

```bash
cd yoyo
python3 -m http.server 8321
```

需要账号、云同步、链接解析和每日推荐时，在 `server` 中安装依赖并配置环境变量：

```bash
cd server
npm ci
AUTH_HOST=127.0.0.1 \
AUTH_PORT=8787 \
AUTH_DB_PATH=./data/auth.db \
AUTH_ORIGIN=http://127.0.0.1:8321 \
AUTH_SETUP_TOKEN=replace-with-a-random-token-at-least-24-characters \
npm start
```

部署示例位于 `deploy/`。真实密码、一次性设置码、数据库和本地备份不会提交到仓库。

## 验证

```bash
node --test server/*.test.mjs tests/*.test.mjs
node --check server/auth-server.mjs
node --check yoyo/assets/js/app.js
```

## 说明

仓库暂未附加开源许可证。YOYO 角色形象及品牌视觉保留原作者权利，未经许可不得另行商用或重新发布。
