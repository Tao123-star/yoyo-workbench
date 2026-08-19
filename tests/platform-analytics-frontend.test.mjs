import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("media analytics exposes cloud loading and extension-driven sync", async () => {
  const app = await readFile(new URL("../yoyo/assets/js/app.js", import.meta.url), "utf8");
  const cloud = await readFile(new URL("../yoyo/assets/js/cloud-sync.js", import.meta.url), "utf8");
  assert.match(app, /fetch\("\/api\/platform-analytics"/);
  assert.match(app, /YOYO_PLATFORM_SYNC_REQUEST/);
  assert.match(app, /data-act="platform-sync"/);
  assert.match(app, /手机端直接查看/);
  assert.match(cloud, /key !== "yoyo_platform_sync_day"/);
});

test("extension permissions stay limited to workbench and creator platforms", async () => {
  const manifest = JSON.parse(await readFile(new URL("../browser-extension/manifest.json", import.meta.url), "utf8"));
  assert.deepEqual(manifest.permissions.sort(), ["storage", "tabs"]);
  assert.deepEqual(manifest.host_permissions.sort(), [
    "https://creator.douyin.com/*",
    "https://creator.xiaohongshu.com/*",
    "https://workbench.taozipipi.cn/*"
  ]);
  assert.equal(manifest.host_permissions.some((entry) => entry.includes("<all_urls>")), false);
});

test("platform collector refuses to expose session secrets", async () => {
  const collector = await readFile(new URL("../browser-extension/platform-collector.js", import.meta.url), "utf8");
  const bridge = await readFile(new URL("../browser-extension/workbench-bridge.js", import.meta.url), "utf8");
  assert.doesNotMatch(collector + bridge, /document\.cookie|chrome\.cookies|localStorage|sessionStorage/);
  assert.match(collector, /\.note-card__stat/);
  assert.match(collector, /video-card-new-/);
  assert.match(collector, /metric-label-/);
  assert.match(collector, /info-title-text-/);
  assert.match(collector, /\[年\\\/\.\\-\]/);
});
