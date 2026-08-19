import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("secondary studio content has a context-aware back action", async () => {
  const app = await readFile(new URL("../yoyo/assets/js/app.js", import.meta.url), "utf8");
  assert.match(app, /data-act="studio-return"/);
  assert.match(app, /← 返回/);
  assert.match(app, /"自媒体中心" : "初稿库"/);
  assert.match(app, /case "studio-return"/);
  assert.match(app, /persistStudioWorkingCopy\(\)/);
});
