import assert from "node:assert/strict";
import test from "node:test";
import { buildDailyRecommendations, buildRecommendationsFromSignals, chinaDay } from "./daily-recommendations.mjs";

function signals(count, sourceName = "GitHub") {
  return Array.from({ length: count }, (_, index) => ({
    title: `AI project ${index + 1}`,
    description: `Description ${index + 1}`,
    sourceName,
    sourceUrl: `https://example.com/${index + 1}`,
    score: count - index
  }));
}

test("chinaDay follows Asia/Shanghai instead of UTC", () => {
  assert.equal(chinaDay(new Date("2026-08-16T16:30:00.000Z")), "2026-08-17");
});

test("daily lists contain ten traceable, platform-specific candidates", () => {
  const result = buildRecommendationsFromSignals(signals(12), "2026-08-17");
  assert.equal(result.douyin.length, 10);
  assert.equal(result.xiaohongshu.length, 10);
  assert.equal(result.official, false);
  assert.match(result.douyin[0].sourceUrl, /^https:\/\//);
  assert.notEqual(result.douyin[0].title, result.xiaohongshu[0].title);
  assert.equal(result.douyin[0].signalTitle, result.xiaohongshu[0].signalTitle);
});

test("duplicate signals are removed and insufficient evidence is rejected", () => {
  const duplicated = [...signals(9), signals(1)[0]];
  assert.throws(() => buildRecommendationsFromSignals(duplicated), /not enough verified/);
});

test("one failed source still succeeds when the other has enough signals", async () => {
  const fetchImpl = async (url) => {
    if (String(url).includes("api.github.com")) throw new Error("offline");
    return {
      ok: true,
      json: async () => ({ hits: signals(12, "Hacker News").map((item, index) => ({
        title: item.title,
        points: 100 - index,
        url: item.sourceUrl,
        objectID: String(index + 1)
      })) })
    };
  };
  const result = await buildDailyRecommendations({ fetchImpl, now: new Date("2026-08-17T03:00:00Z") });
  assert.equal(result.douyin.length, 10);
  assert.match(result.source, /Hacker News/);
});

test("all failed sources reject instead of inventing a current date", async () => {
  await assert.rejects(() => buildDailyRecommendations({ fetchImpl: async () => { throw new Error("offline"); } }), /not enough verified/);
});
