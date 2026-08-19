import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("asset form keeps only flexible inputs and infers removed fields", async () => {
  const html = await readFile(new URL("../yoyo/index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../yoyo/assets/js/app.js", import.meta.url), "utf8");

  assert.doesNotMatch(html, /id="assetKind"/);
  assert.doesNotMatch(html, /id="assetPlatform"/);
  assert.match(html, /type="hidden" id="assetTitle"/);
  assert.match(html, /id="assetUrl"/);
  assert.match(html, /id="assetImage"/);
  assert.match(html, /id="assetTextContent"/);
  assert.match(html, /id="assetTags"/);
  assert.match(app, /function platformFromAssetUrl/);
  assert.match(app, /请添加链接、图片或文字中的任意一种/);
});
