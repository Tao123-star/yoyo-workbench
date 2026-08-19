import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

class MemoryStorage {
  constructor() { this.values = new Map(); }
  get length() { return this.values.size; }
  key(index) { return Array.from(this.values.keys())[index] || null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

test("studio confirmation persists topic, draft and recoverable working copy", async () => {
  const source = await readFile(new URL("../yoyo/assets/js/data.js", import.meta.url), "utf8");
  const syncCalls = [];
  const sandbox = {
    console,
    URL,
    localStorage: new MemoryStorage(),
    YOYO: { cloud: { saveKey: (key, value) => syncCalls.push({ key, value }), clearAll: async () => {}, syncAll: async () => {} } }
  };
  sandbox.window = sandbox;
  vm.runInNewContext(source, sandbox, { filename: "data.js" });
  const data = sandbox.YOYO.data;

  const hotReference = data.aiHotTopics;
  const dailyHot = {
    updatedAt: "2026-08-17", source: "公开 AI 行业信号：GitHub", official: false,
    douyin: Array.from({ length: 10 }, (_, index) => ({ id: `dy-${index}`, title: `抖音 ${index}`, angle: "实测" })),
    xiaohongshu: Array.from({ length: 10 }, (_, index) => ({ id: `xhs-${index}`, title: `小红书 ${index}`, angle: "清单" }))
  };
  assert.equal(data.setAiHotTopics(dailyHot), true);
  assert.equal(data.aiHotTopics, hotReference);
  assert.equal(data.aiHotTopics.updatedAt, "2026-08-17");
  assert.equal(data.getHotCache().douyin.length, 10);

  assert.equal(data.extractSharedUrl("2.38 复制打开抖音，看看作品 https://v.douyin.com/AbC123/ ！"), "https://v.douyin.com/AbC123/");
  assert.equal(data.extractSharedUrl("小红书分享 xhslink.com/a1B2C3，复制后打开"), "https://xhslink.com/a1B2C3");
  assert.equal(data.extractSharedUrl("只有分享文案，没有链接"), "");

  const legacyBody = "我的AI自媒体工作台2.0｜完整口播稿\n\n这是正文第一段。\n\n这是正文第二段。";
  sandbox.localStorage.setItem("yoyo_studio_drafts", JSON.stringify([{
    id: "legacy-draft", title: "我把工作流做进了AI工作台", topic: legacyBody, body: legacyBody, updatedAt: 1
  }]));
  const normalizedLegacy = data.getStudioDrafts()[0];
  assert.equal(normalizedLegacy.title, "我把工作流做进了AI工作台");
  assert.equal(normalizedLegacy.topic, "我的AI自媒体工作台2.0｜完整口播稿");
  assert.equal(normalizedLegacy.body, legacyBody);

  const topic = data.saveTopic({ id: "topic-1", title: "测试选题", source: "AI 创作台" });
  assert.equal(topic.id, "topic-1");
  assert.equal(data.getExtraTopics().length, 1);
  data.saveTopic({ id: "topic-2", title: "测试选题" });
  assert.equal(data.getExtraTopics().length, 1);

  data.saveStudioWorkingDraft({ topicId: topic.id, topic: topic.title, title: "自动暂存标题", body: "自动暂存正文" });
  assert.equal(data.getStudioWorkingDraft().title, "自动暂存标题");

  const draft = data.saveStudioDraft({ topicId: topic.id, topic: topic.title, title: "确认初稿", body: "初稿正文" });
  assert.equal(data.getStudioDrafts()[0].id, draft.id);
  assert.equal(data.getStudioDrafts()[0].body, "初稿正文");

  const content = data.promoteDraftToContent(draft.id);
  assert.equal(content.topicId, topic.id);
  assert.equal(content.draftId, draft.id);
  assert.match(content.id, /^content/);
  assert.equal(content.status, "draft");
  assert.equal(data.getContentByDraftId(draft.id).id, content.id);
  assert.equal(data.promoteDraftToContent(draft.id).id, content.id);
  assert.equal(data.contents.length, 1);

  assert.equal(data.updateContentStatus(content.id, "scheduled", {}), null);
  assert.equal(data.updateContentStatus(content.id, "ready", {}).status, "ready");
  assert.equal(data.updateContentStatus(content.id, "scheduled", { date: "2026-08-20" }).date, "2026-08-20");
  const published = data.updateContentStatus(content.id, "published", { date: "2026-08-21" });
  assert.equal(published.status, "published");
  assert.equal(JSON.stringify(published.metrics), JSON.stringify({ views: 0, likes: 0, comments: 0, saves: 0, fans: 0 }));
  assert.equal(data.updateContentStatus(content.id, "ready", {}), null);

  const linkCapture = data.saveCapture({
    title: "小红书案例", type: "内容链接", platform: "小红书", url: "https://example.com/post",
    author: "桃子", publisher: "示例来源", publishedAt: "2026-08-14", description: "摘要",
    content: "正文预览", coverImage: "https://example.com/cover.jpg", routedTo: "asset", tags: ["案例"]
  }, "asset");
  assert.equal(data.getCaptures()[0].id, linkCapture.id);
  assert.equal(data.getCaptures()[0].platform, "小红书");
  assert.equal(data.getCaptures()[0].author, "桃子");
  assert.equal(data.getCaptures()[0].description, "摘要");
  assert.equal(data.getCaptures()[0].content, "正文预览");
  assert.equal(data.getCaptures()[0].coverImage, "https://example.com/cover.jpg");
  const imageCapture = data.saveCapture({ title: "封面参考", type: "图片", routedTo: "asset" }, "asset", "data:image/webp;base64,AAAA");
  assert.equal(data.getCaptureImage(imageCapture.imageKey), "data:image/webp;base64,AAAA");

  data.saveStudioDraft({ ...draft, title: "更新后的初稿标题", body: "更新后的正文" });
  assert.equal(data.getContentByDraftId(draft.id).title, "更新后的初稿标题");
  assert.equal(data.contents.length, 1);

  data.clearStudioWorkingDraft();
  assert.equal(data.getStudioWorkingDraft(), null);
  assert.ok(syncCalls.some((call) => call.key === "yoyo_topics_extra"));
  assert.ok(syncCalls.some((call) => call.key === "yoyo_studio_drafts"));
  assert.ok(syncCalls.some((call) => call.key === "yoyo_contents"));
  assert.ok(syncCalls.some((call) => call.key === "yoyo_captures"));
  assert.ok(syncCalls.some((call) => call.key === "yoyo_" + imageCapture.imageKey));
  assert.ok(syncCalls.some((call) => call.key === "yoyo_studio_working_draft" && call.value === null));
});
