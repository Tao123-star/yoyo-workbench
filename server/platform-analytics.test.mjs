import assert from "node:assert/strict";
import test from "node:test";
import { sanitizePlatformSnapshot } from "./platform-analytics.mjs";

test("platform analytics keeps only cleaned creator statistics", () => {
  const result = sanitizePlatformSnapshot({
    platform: "xiaohongshu",
    accountName: "桃子AI重启🍑",
    period: "近7日",
    syncedAt: 1_787_151_600_000,
    summary: { exposures: "2274", views: 556, followers: 158, followerGain: 4 },
    works: [{
      id: "note-1", title: "我的 AI 工作台", publishedAt: "2026-08-15 20:08",
      sourceUrl: "https://creator.xiaohongshu.com/new/note-manager?token=remove#remove",
      metrics: { views: 318, likes: 3, comments: 0, saves: 6, shares: 1 }
    }]
  }, 1_787_152_000_000);
  assert.equal(result.works[0].metrics.views, 318);
  assert.equal(result.works[0].sourceUrl, "https://creator.xiaohongshu.com/new/note-manager");
  assert.equal(result.summary.exposures, 2274);
});

test("platform analytics rejects unsupported sources and oversized lists", () => {
  assert.throws(() => sanitizePlatformSnapshot({ platform: "github", works: [] }), /暂不支持/);
  assert.throws(() => sanitizePlatformSnapshot({ platform: "douyin", works: Array.from({ length: 101 }) }), /最多保留/);
});

test("platform analytics strips cross-platform and unsafe work links", () => {
  const result = sanitizePlatformSnapshot({
    platform: "douyin",
    works: [{ title: "作品一", sourceUrl: "https://github.com/example", metrics: { views: -1 } }]
  });
  assert.equal(result.works[0].sourceUrl, "");
  assert.equal(result.works[0].metrics.views, 0);
});
