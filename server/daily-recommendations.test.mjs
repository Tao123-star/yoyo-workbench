import assert from "node:assert/strict";
import test from "node:test";
import { buildPlatformSnapshot, chinaDay, normalizePlatformUrl } from "./daily-recommendations.mjs";

function rows(platform, count) {
  const host = platform === "douyin" ? "https://creator.douyin.com/creator-micro/home?tracking=remove" : "https://www.xiaohongshu.com/explore/note-id?tracking=remove";
  return Array.from({ length: count }, (_, index) => ({
    title: `AI 平台信号 ${index + 1}`,
    signalTitle: `原始话题 ${index + 1}`,
    angle: `围绕原始话题 ${index + 1} 做真实验证`,
    sourceUrl: host,
    metric: `${index + 1}万互动`
  }));
}

test("chinaDay follows Asia/Shanghai instead of UTC", () => {
  assert.equal(chinaDay(new Date("2026-08-18T16:30:00.000Z")), "2026-08-19");
});

test("platform snapshot keeps native sources and strips session query data", () => {
  const result = buildPlatformSnapshot({
    douyin: rows("douyin", 5),
    xiaohongshu: rows("xiaohongshu", 10),
    now: new Date("2026-08-19T03:00:00Z")
  });
  assert.equal(result.updatedAt, "2026-08-19");
  assert.equal(result.sourceNative, true);
  assert.equal(result.douyin.length, 5);
  assert.equal(result.xiaohongshu.length, 10);
  assert.equal(result.douyin[0].sourceName, "抖音");
  assert.equal(result.xiaohongshu[0].sourceName, "小红书");
  assert.equal(new URL(result.xiaohongshu[0].sourceUrl).search, "");
});

test("cross-platform and non-platform source links are rejected", () => {
  assert.throws(() => normalizePlatformUrl("https://github.com/example/project", "douyin"), /不是抖音平台/);
  assert.throws(() => normalizePlatformUrl("https://www.douyin.com/hot", "xiaohongshu"), /不是小红书平台/);
});

test("empty or oversized platform snapshots are rejected", () => {
  assert.throws(() => buildPlatformSnapshot({ douyin: [], xiaohongshu: rows("xiaohongshu", 10) }), /1–10 条/);
  assert.throws(() => buildPlatformSnapshot({ douyin: rows("douyin", 5), xiaohongshu: rows("xiaohongshu", 11) }), /1–10 条/);
});
