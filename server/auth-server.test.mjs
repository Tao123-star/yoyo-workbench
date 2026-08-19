import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const origin = "http://127.0.0.1:18787";
const setupToken = "test-setup-token-that-is-long-enough";

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${origin}/api/auth/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("test server did not start");
}

test("account-owned workbench data persists and secrets stay device-local", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "workbench-auth-test-"));
  const child = spawn(process.execPath, [fileURLToPath(new URL("./auth-server.mjs", import.meta.url))], {
    env: {
      ...process.env,
      AUTH_HOST: "127.0.0.1",
      AUTH_PORT: "18787",
      AUTH_DB_PATH: join(directory, "auth.db"),
      AUTH_ORIGIN: origin,
      AUTH_SETUP_TOKEN: setupToken
    },
    stdio: ["ignore", "ignore", "pipe"]
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  t.after(async () => {
    child.kill("SIGKILL");
    if (child.exitCode === null) await new Promise((resolve) => child.once("exit", resolve));
    await rm(directory, { recursive: true, force: true });
  });

  await waitForServer();

  const setup = await fetch(`${origin}/api/auth/setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ setupToken, username: "桃子", password: "a-secure-test-password" })
  });
  assert.equal(setup.status, 201, stderr);
  const cookie = setup.headers.get("set-cookie").split(";")[0];

  const empty = await fetch(`${origin}/api/data`, { headers: { Cookie: cookie } });
  assert.deepEqual(await empty.json(), { initialized: false, updatedAt: 0, conflictCount: 0, versions: {}, data: {} });

  const previewDenied = await fetch(`${origin}/api/link-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ url: "https://example.com" })
  });
  assert.equal(previewDenied.status, 401);

  const recommendationsDenied = await fetch(`${origin}/api/recommendations`);
  assert.equal(recommendationsDenied.status, 401);

  const platformRows = (platform) => [{
    title: "平台 AI 信号", signalTitle: "平台原始内容", angle: "基于原始内容做真实验证",
    sourceUrl: platform === "douyin" ? "https://creator.douyin.com/creator-micro/home" : "https://www.xiaohongshu.com/explore/note-id",
    metric: "可见互动 100"
  }];
  const snapshotSaved = await fetch(`${origin}/api/recommendations/platform-snapshot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({ douyin: platformRows("douyin"), xiaohongshu: platformRows("xiaohongshu") })
  });
  assert.equal(snapshotSaved.status, 200, await snapshotSaved.text());
  const snapshotLoaded = await fetch(`${origin}/api/recommendations`, { headers: { Cookie: cookie } });
  const snapshotBody = await snapshotLoaded.json();
  assert.equal(snapshotLoaded.status, 200);
  assert.equal(snapshotBody.sourceNative, true);
  assert.equal(snapshotBody.douyin[0].sourceName, "抖音");
  assert.equal(snapshotBody.xiaohongshu[0].sourceName, "小红书");

  const analyticsDenied = await fetch(`${origin}/api/platform-analytics`);
  assert.equal(analyticsDenied.status, 401);

  const analyticsSaved = await fetch(`${origin}/api/platform-analytics`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({ snapshots: [{
      platform: "xiaohongshu", accountName: "桃子AI重启🍑", period: "近7日",
      summary: { exposures: 2274, views: 556, followers: 158, followerGain: 4 },
      works: [{ title: "我的 AI 工作台", publishedAt: "2026-08-15 20:08", metrics: { views: 318, likes: 3, comments: 0, saves: 6, shares: 1 } }]
    }] })
  });
  assert.equal(analyticsSaved.status, 200, await analyticsSaved.text());
  const analyticsLoaded = await fetch(`${origin}/api/platform-analytics`, { headers: { Cookie: cookie } });
  const analyticsBody = await analyticsLoaded.json();
  assert.equal(analyticsLoaded.status, 200);
  assert.equal(analyticsBody.platforms.xiaohongshu.works[0].metrics.views, 318);
  assert.equal(analyticsBody.platforms.xiaohongshu.summary.followers, 158);

  const previewAuthenticated = await fetch(`${origin}/api/link-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({ url: "not-a-valid-url" })
  });
  assert.equal(previewAuthenticated.status, 422);
  assert.deepEqual(await previewAuthenticated.json(), { error: "链接格式不正确" });

  const legacyWrite = await fetch(`${origin}/api/data`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({ changes: { yoyo_contents: [] } })
  });
  assert.equal(legacyWrite.status, 409);

  const save = await fetch(`${origin}/api/data`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({
      changes: {
        yoyo_contents: [{ id: "content-1", title: "云端内容" }],
        yoyo_settings: { name: "桃子", aiKey: "must-not-reach-cloud" }
      },
      baseVersions: { yoyo_contents: 0, yoyo_settings: 0 }
    })
  });
  assert.equal(save.status, 200, await save.text());

  const loaded = await fetch(`${origin}/api/data`, { headers: { Cookie: cookie } });
  const loadedBody = await loaded.json();
  assert.equal(loadedBody.initialized, true);
  assert.equal(loadedBody.data.yoyo_contents[0].title, "云端内容");
  assert.deepEqual(loadedBody.data.yoyo_settings, { name: "桃子" });
  assert.equal(loadedBody.versions.yoyo_contents, 1);

  const deviceA = await fetch(`${origin}/api/data`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({
      changes: { yoyo_contents: [{ id: "content-1", title: "设备 A 版本" }] },
      baseVersions: { yoyo_contents: 1 }
    })
  });
  assert.equal(deviceA.status, 200);
  assert.equal((await deviceA.json()).versions.yoyo_contents, 2);

  const staleDeviceB = await fetch(`${origin}/api/data`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({
      changes: { yoyo_contents: [{ id: "content-1", title: "设备 B 版本" }] },
      baseVersions: { yoyo_contents: 1 }
    })
  });
  assert.equal(staleDeviceB.status, 409);
  const conflictBody = await staleDeviceB.json();
  assert.equal(conflictBody.conflicts[0].serverVersion, 2);
  assert.equal(conflictBody.conflicts[0].serverValue[0].title, "设备 A 版本");

  const mergedRetry = await fetch(`${origin}/api/data`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: cookie },
    body: JSON.stringify({
      changes: { yoyo_contents: [
        { id: "content-1", title: "设备 B 版本" },
        { id: "content-1-conflict", title: "设备 A 版本（其他设备版本）" }
      ] },
      baseVersions: { yoyo_contents: 2 }
    })
  });
  assert.equal(mergedRetry.status, 200);
  const afterMerge = await fetch(`${origin}/api/data`, { headers: { Cookie: cookie } });
  const afterMergeBody = await afterMerge.json();
  assert.equal(afterMergeBody.conflictCount, 1);
  assert.equal(afterMergeBody.versions.yoyo_contents, 3);
  assert.equal(afterMergeBody.data.yoyo_contents.length, 2);

  const denied = await fetch(`${origin}/api/data`);
  assert.equal(denied.status, 401);

  const cleared = await fetch(`${origin}/api/data`, {
    method: "DELETE",
    headers: { Origin: origin, Cookie: cookie }
  });
  assert.equal(cleared.status, 200);
  const afterClear = await fetch(`${origin}/api/data`, { headers: { Cookie: cookie } });
  const afterClearBody = await afterClear.json();
  assert.equal(afterClearBody.initialized, true);
  assert.deepEqual(afterClearBody.data, {});
});
