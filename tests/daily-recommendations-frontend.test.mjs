import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("daily public recommendation cache stays outside personal cloud data", async () => {
  const cloudSync = await readFile(new URL("../yoyo/assets/js/cloud-sync.js", import.meta.url), "utf8");
  assert.match(cloudSync, /key !== "yoyo_hot_cache"/);
});

test("home requests platform snapshots and keeps the source boundary visible", async () => {
  const app = await readFile(new URL("../yoyo/assets/js/app.js", import.meta.url), "utf8");
  assert.match(app, /var endpoint = "\/api\/recommendations"/);
  assert.match(app, /cache: "no-store"/);
  assert.match(app, /data-act="hot-refresh"/);
  assert.match(app, /case "hot-refresh": ensureDailyHotTopics\(true\)/);
  assert.match(app, /已核实平台来源/);
  assert.match(app, /平台真实内容信号，非官方热榜排名/);
  assert.match(app, /信号来源/);
});
