import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("daily public recommendation cache stays outside personal cloud data", async () => {
  const cloudSync = await readFile(new URL("../yoyo/assets/js/cloud-sync.js", import.meta.url), "utf8");
  assert.match(cloudSync, /key !== "yoyo_hot_cache"/);
});

test("home requests the protected daily endpoint and keeps the non-official label", async () => {
  const app = await readFile(new URL("../yoyo/assets/js/app.js", import.meta.url), "utf8");
  assert.match(app, /fetch\("\/api\/recommendations"/);
  assert.match(app, /每日自动更新/);
  assert.match(app, /非平台官方实时榜/);
  assert.match(app, /信号来源/);
});
