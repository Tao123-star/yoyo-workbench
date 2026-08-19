import http from "node:http";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { buildPlatformSnapshot, chinaDay } from "./daily-recommendations.mjs";
import { extractLinkPreview } from "./link-preview.mjs";
import { sanitizePlatformSnapshot } from "./platform-analytics.mjs";

const HOST = process.env.AUTH_HOST || "127.0.0.1";
const PORT = Number(process.env.AUTH_PORT || 8787);
const DB_PATH = process.env.AUTH_DB_PATH || "/data/auth.db";
const AUTH_ORIGIN = process.env.AUTH_ORIGIN || "https://workbench.taozipipi.cn";
const SETUP_TOKEN = process.env.AUTH_SETUP_TOKEN || "";
const COOKIE_NAME = "yoyo_session";
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const MAX_AUTH_BODY_BYTES = 16 * 1024;
const MAX_DATA_BODY_BYTES = 2 * 1024 * 1024;
const failedLogins = new Map();
const linkPreviewRequests = new Map();

if (!SETUP_TOKEN || SETUP_TOKEN.length < 24) {
  throw new Error("AUTH_SETUP_TOKEN must contain at least 24 characters");
}

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    last_seen_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  CREATE TABLE IF NOT EXISTS workbench_data (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, storage_key)
  );
  CREATE TABLE IF NOT EXISTS workbench_sync_state (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    initialized_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_workbench_data_user_updated
  ON workbench_data(user_id, updated_at);
  CREATE TABLE IF NOT EXISTS workbench_conflicts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL,
    base_version INTEGER NOT NULL,
    server_version INTEGER NOT NULL,
    client_json TEXT NOT NULL,
    server_json TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_workbench_conflicts_user_created
  ON workbench_conflicts(user_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS recommendation_cache (
    day TEXT PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS platform_analytics (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    value_json TEXT NOT NULL,
    synced_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, platform)
  );
  CREATE INDEX IF NOT EXISTS idx_platform_analytics_user_updated
  ON platform_analytics(user_id, updated_at DESC);
  PRAGMA optimize;
`);

const workbenchDataColumns = db.prepare("PRAGMA table_info(workbench_data)").all();
if (!workbenchDataColumns.some((column) => column.name === "version")) {
  db.exec("ALTER TABLE workbench_data ADD COLUMN version INTEGER NOT NULL DEFAULT 1");
}

const findAnyUser = db.prepare("SELECT id, username, created_at FROM users ORDER BY id LIMIT 1");
const findUserByName = db.prepare("SELECT id, username, password_hash, password_salt FROM users WHERE username = ?");
const findUserBySession = db.prepare(`
  SELECT users.id, users.username, sessions.expires_at
  FROM sessions JOIN users ON users.id = sessions.user_id
  WHERE sessions.token_hash = ? AND sessions.expires_at > ?
`);
const insertUser = db.prepare("INSERT INTO users (username, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?)");
const insertSession = db.prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)");
const touchSession = db.prepare("UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?");
const deleteSession = db.prepare("DELETE FROM sessions WHERE token_hash = ?");
const deleteExpiredSessions = db.prepare("DELETE FROM sessions WHERE expires_at <= ?");
const findWorkbenchData = db.prepare("SELECT storage_key, value_json, updated_at, version FROM workbench_data WHERE user_id = ? ORDER BY storage_key");
const findWorkbenchDataKey = db.prepare("SELECT value_json, version FROM workbench_data WHERE user_id = ? AND storage_key = ?");
const findSyncState = db.prepare("SELECT initialized_at, updated_at FROM workbench_sync_state WHERE user_id = ?");
const upsertWorkbenchData = db.prepare(`
  INSERT INTO workbench_data (user_id, storage_key, value_json, updated_at, version)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(user_id, storage_key) DO UPDATE SET
    value_json = excluded.value_json,
    updated_at = excluded.updated_at,
    version = excluded.version
`);
const tombstoneAllWorkbenchData = db.prepare("UPDATE workbench_data SET value_json = 'null', updated_at = ?, version = version + 1 WHERE user_id = ?");
const insertWorkbenchConflict = db.prepare(`
  INSERT INTO workbench_conflicts (user_id, storage_key, base_version, server_version, client_json, server_json, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const countWorkbenchConflicts = db.prepare("SELECT COUNT(*) AS count FROM workbench_conflicts WHERE user_id = ?");
const markSyncInitialized = db.prepare(`
  INSERT INTO workbench_sync_state (user_id, initialized_at, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(user_id) DO UPDATE SET updated_at = excluded.updated_at
`);
const findRecommendation = db.prepare("SELECT value_json FROM recommendation_cache WHERE day = ?");
const findLatestRecommendation = db.prepare("SELECT day, value_json FROM recommendation_cache ORDER BY day DESC LIMIT 1");
const upsertRecommendation = db.prepare(`
  INSERT INTO recommendation_cache (day, value_json, updated_at)
  VALUES (?, ?, ?)
  ON CONFLICT(day) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
`);
const findPlatformAnalytics = db.prepare("SELECT platform, value_json, synced_at, updated_at FROM platform_analytics WHERE user_id = ? ORDER BY platform");
const upsertPlatformAnalytics = db.prepare(`
  INSERT INTO platform_analytics (user_id, platform, value_json, synced_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(user_id, platform) DO UPDATE SET
    value_json = excluded.value_json,
    synced_at = excluded.synced_at,
    updated_at = excluded.updated_at
`);

function parseRecommendationRow(row) {
  if (!row) return null;
  try { return JSON.parse(row.value_json); } catch { return null; }
}

function json(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders
  });
  res.end(body);
}

function parseCookies(req) {
  const result = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    result[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return result;
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString("hex");
}

function safeEqualText(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function currentUser(req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token || token.length < 32) return null;
  const tokenHash = hashToken(token);
  const user = findUserBySession.get(tokenHash, Date.now());
  if (!user) return null;
  touchSession.run(Date.now(), tokenHash);
  return { id: Number(user.id), username: user.username, tokenHash };
}

function issueSession(res, userId) {
  deleteExpiredSessions.run(Date.now());
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  insertSession.run(hashToken(token), userId, now, now + SESSION_SECONDS * 1000, now);
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`;
}

function validateOrigin(req) {
  const origin = req.headers.origin;
  return !origin || origin === AUTH_ORIGIN;
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(",")[0].trim();
}

function isRateLimited(req) {
  const key = clientIp(req);
  const cutoff = Date.now() - 15 * 60 * 1000;
  const attempts = (failedLogins.get(key) || []).filter((time) => time > cutoff);
  failedLogins.set(key, attempts);
  return attempts.length >= 5;
}

function recordLoginFailure(req) {
  const key = clientIp(req);
  failedLogins.set(key, [...(failedLogins.get(key) || []), Date.now()]);
}

function clearLoginFailures(req) {
  failedLogins.delete(clientIp(req));
}

function isLinkPreviewRateLimited(userId) {
  const cutoff = Date.now() - 60 * 1000;
  const attempts = (linkPreviewRequests.get(userId) || []).filter((time) => time > cutoff);
  linkPreviewRequests.set(userId, attempts);
  if (attempts.length >= 12) return true;
  attempts.push(Date.now());
  return false;
}

function linkPreviewErrorMessage(error) {
  const message = String(error && error.message || "");
  const safeMessages = [
    "链接格式不正确", "只支持 http 或 https 链接", "链接不能包含账号或密码",
    "不能读取本机或内部网络地址", "域名无法解析", "这个链接不是可解析的网页",
    "网页内容过大，无法自动解析", "网页读取超时", "网页重定向次数过多"
  ];
  if (safeMessages.indexOf(message) > -1 || /^网页返回状态 \d{3}$/.test(message)) return message;
  return "暂时无法读取这个网页，请保留链接并手动填写";
}

async function readJson(req, maxBytes = MAX_AUTH_BODY_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("请求内容过大");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new Error("请求格式不正确");
  }
}

function validStorageKey(value) {
  const key = String(value || "");
  return /^yoyo_[a-z0-9_:-]{1,80}$/i.test(key) ? key : null;
}

function sanitizeStoredValue(key, value) {
  if (key === "yoyo_settings" && value && typeof value === "object" && !Array.isArray(value)) {
    const safeSettings = { ...value };
    delete safeSettings.aiKey;
    return safeSettings;
  }
  return value;
}

function validUsername(value) {
  const username = String(value || "").trim();
  if (username.length < 2 || username.length > 32 || /[\u0000-\u001f\u007f]/.test(username)) return null;
  return username;
}

function validPassword(value) {
  const password = String(value || "");
  return password.length >= 10 && password.length <= 128 ? password : null;
}

async function handle(req, res) {
  const url = new URL(req.url, AUTH_ORIGIN);
  if (url.pathname === "/api/auth/health" && req.method === "GET") {
    return json(res, 200, { ok: true, configured: !!findAnyUser.get() });
  }

  if (url.pathname === "/api/auth/status" && req.method === "GET") {
    const user = currentUser(req);
    return json(res, 200, {
      configured: !!findAnyUser.get(),
      authenticated: !!user,
      user: user ? { username: user.username } : null
    });
  }

  if (url.pathname === "/api/recommendations" && req.method === "GET") {
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const day = chinaDay();
    const current = parseRecommendationRow(findRecommendation.get(day));
    if (current?.sourceNative) return json(res, 200, current);
    const latest = parseRecommendationRow(findLatestRecommendation.get());
    if (latest?.sourceNative) return json(res, 200, { ...latest, stale: true });
    return json(res, 503, { error: "暂无已核实的平台热点，请完成平台授权更新" });
  }

  if (url.pathname === "/api/recommendations/platform-snapshot" && req.method === "PUT") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const body = await readJson(req, 64 * 1024);
    try {
      const snapshot = buildPlatformSnapshot({ douyin: body.douyin, xiaohongshu: body.xiaohongshu });
      upsertRecommendation.run(snapshot.updatedAt, JSON.stringify(snapshot), Date.now());
      return json(res, 200, { ok: true, snapshot });
    } catch (error) {
      return json(res, 422, { error: error.message || "平台热点格式不正确" });
    }
  }

  if (url.pathname === "/api/platform-analytics" && req.method === "GET") {
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const platforms = {};
    let updatedAt = 0;
    for (const row of findPlatformAnalytics.all(user.id)) {
      try {
        platforms[row.platform] = JSON.parse(row.value_json);
        updatedAt = Math.max(updatedAt, Number(row.updated_at));
      } catch {}
    }
    return json(res, 200, { updatedAt, platforms });
  }

  if (url.pathname === "/api/platform-analytics" && req.method === "PUT") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const body = await readJson(req, 512 * 1024);
    if (!Array.isArray(body.snapshots) || body.snapshots.length < 1 || body.snapshots.length > 2) {
      return json(res, 400, { error: "平台同步数据格式不正确" });
    }
    try {
      const snapshots = body.snapshots.map((snapshot) => sanitizePlatformSnapshot(snapshot));
      if (new Set(snapshots.map((snapshot) => snapshot.platform)).size !== snapshots.length) {
        return json(res, 400, { error: "平台同步数据重复" });
      }
      const updatedAt = Date.now();
      db.exec("BEGIN IMMEDIATE");
      try {
        for (const snapshot of snapshots) {
          upsertPlatformAnalytics.run(user.id, snapshot.platform, JSON.stringify(snapshot), snapshot.syncedAt, updatedAt);
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return json(res, 200, { ok: true, updatedAt, platforms: Object.fromEntries(snapshots.map((snapshot) => [snapshot.platform, snapshot])) });
    } catch (error) {
      return json(res, 422, { error: error.message || "平台同步数据格式不正确" });
    }
  }

  if (url.pathname === "/api/link-preview" && req.method === "POST") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    if (isLinkPreviewRateLimited(user.id)) return json(res, 429, { error: "解析太频繁，请稍后再试" });
    const body = await readJson(req);
    try {
      const preview = await extractLinkPreview(body.url);
      return json(res, 200, { ok: true, preview });
    } catch (error) {
      if (/douyin\.com/i.test(String(body.url || ""))) {
        return json(res, 422, { error: "抖音限制了服务器自动读取，链接已保留，可直接保存或手动补充内容", manualFallback: true });
      }
      return json(res, 422, { error: linkPreviewErrorMessage(error) });
    }
  }

  if (url.pathname === "/api/data" && req.method === "GET") {
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const state = findSyncState.get(user.id);
    const data = {};
    const versions = {};
    let updatedAt = state ? Number(state.updated_at) : 0;
    for (const row of findWorkbenchData.all(user.id)) {
      try {
        const value = JSON.parse(row.value_json);
        if (value !== null) data[row.storage_key] = value;
        versions[row.storage_key] = Number(row.version);
        updatedAt = Math.max(updatedAt, Number(row.updated_at));
      } catch {
        console.error(`Invalid stored JSON for ${row.storage_key}`);
      }
    }
    const conflictCount = Number(countWorkbenchConflicts.get(user.id).count);
    return json(res, 200, { initialized: !!state, updatedAt, conflictCount, versions, data });
  }

  if (url.pathname === "/api/data" && req.method === "PUT") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const body = await readJson(req, MAX_DATA_BODY_BYTES);
    if (!body.changes || typeof body.changes !== "object" || Array.isArray(body.changes)) {
      return json(res, 400, { error: "同步数据格式不正确" });
    }
    const entries = Object.entries(body.changes);
    const baseVersions = body.baseVersions && typeof body.baseVersions === "object" && !Array.isArray(body.baseVersions) ? body.baseVersions : null;
    if (entries.length > 100) return json(res, 400, { error: "单次同步的数据项过多" });
    if (entries.length && !baseVersions) return json(res, 409, { error: "同步机制已升级，请刷新页面后重试", conflicts: [] });
    const prepared = [];
    for (const [rawKey, rawValue] of entries) {
      const key = validStorageKey(rawKey);
      if (!key) return json(res, 400, { error: "数据键不正确" });
      if (rawValue === null) {
        prepared.push([key, "null"]);
        continue;
      }
      const valueJson = JSON.stringify(sanitizeStoredValue(key, rawValue));
      if (valueJson === undefined || Buffer.byteLength(valueJson) > 512 * 1024) {
        return json(res, 400, { error: `数据项 ${key} 过大或格式不正确` });
      }
      prepared.push([key, valueJson]);
    }
    const conflicts = [];
    for (const [key, valueJson] of prepared) {
      if (!baseVersions || !Object.prototype.hasOwnProperty.call(baseVersions, key)) continue;
      const current = findWorkbenchDataKey.get(user.id, key);
      const serverVersion = current ? Number(current.version) : 0;
      const baseVersion = Number(baseVersions[key]) || 0;
      if (baseVersion !== serverVersion) {
        let serverValue = null;
        try { serverValue = current ? JSON.parse(current.value_json) : null; } catch {}
        conflicts.push({ key, baseVersion, serverVersion, serverValue, clientJson: valueJson });
      }
    }
    if (conflicts.length) {
      const conflictTime = Date.now();
      for (const conflict of conflicts) {
        insertWorkbenchConflict.run(user.id, conflict.key, conflict.baseVersion, conflict.serverVersion, conflict.clientJson, JSON.stringify(conflict.serverValue), conflictTime);
      }
      return json(res, 409, {
        error: "检测到其他设备的新修改",
        conflicts: conflicts.map(({ key, baseVersion, serverVersion, serverValue }) => ({ key, baseVersion, serverVersion, serverValue }))
      });
    }
    const now = Date.now();
    const versions = {};
    db.exec("BEGIN IMMEDIATE");
    try {
      for (const [key, valueJson] of prepared) {
        const current = findWorkbenchDataKey.get(user.id, key);
        const nextVersion = (current ? Number(current.version) : 0) + 1;
        upsertWorkbenchData.run(user.id, key, valueJson, now, nextVersion);
        versions[key] = nextVersion;
      }
      markSyncInitialized.run(user.id, now, now);
      db.exec("COMMIT");
      return json(res, 200, { ok: true, updatedAt: now, versions });
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  if (url.pathname === "/api/data" && req.method === "DELETE") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const user = currentUser(req);
    if (!user) return json(res, 401, { error: "登录已失效" });
    const now = Date.now();
    db.exec("BEGIN IMMEDIATE");
    try {
      tombstoneAllWorkbenchData.run(now, user.id);
      markSyncInitialized.run(user.id, now, now);
      db.exec("COMMIT");
      return json(res, 200, { ok: true, updatedAt: now });
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  if (url.pathname === "/api/auth/setup" && req.method === "POST") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    if (findAnyUser.get()) return json(res, 409, { error: "个人账号已经创建，请直接登录" });
    const body = await readJson(req);
    if (!safeEqualText(body.setupToken, SETUP_TOKEN)) return json(res, 403, { error: "一次性设置码不正确" });
    const username = validUsername(body.username);
    const password = validPassword(body.password);
    if (!username) return json(res, 400, { error: "用户名需要 2–32 个字符" });
    if (!password) return json(res, 400, { error: "密码需要 10–128 个字符" });
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    db.exec("BEGIN IMMEDIATE");
    try {
      if (findAnyUser.get()) throw new Error("个人账号已经创建");
      const result = insertUser.run(username, passwordHash, salt, Date.now());
      db.exec("COMMIT");
      const cookie = issueSession(res, Number(result.lastInsertRowid));
      return json(res, 201, { ok: true, user: { username } }, { "Set-Cookie": cookie });
    } catch (error) {
      db.exec("ROLLBACK");
      return json(res, 409, { error: error.message || "账号创建失败" });
    }
  }

  if (url.pathname === "/api/auth/login" && req.method === "POST") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    if (isRateLimited(req)) return json(res, 429, { error: "尝试次数过多，请 15 分钟后再试" });
    const body = await readJson(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const user = findUserByName.get(username);
    const candidate = user ? hashPassword(password, user.password_salt) : hashPassword(password, "00000000000000000000000000000000");
    if (!user || !safeEqualText(candidate, user.password_hash)) {
      recordLoginFailure(req);
      return json(res, 401, { error: "用户名或密码不正确" });
    }
    clearLoginFailures(req);
    const cookie = issueSession(res, Number(user.id));
    return json(res, 200, { ok: true, user: { username: user.username } }, { "Set-Cookie": cookie });
  }

  if (url.pathname === "/api/auth/logout" && req.method === "POST") {
    if (!validateOrigin(req)) return json(res, 403, { error: "来源校验失败" });
    const token = parseCookies(req)[COOKIE_NAME];
    if (token) deleteSession.run(hashToken(token));
    return json(res, 200, { ok: true }, {
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
    });
  }

  if (url.pathname === "/api/auth/me" && req.method === "GET") {
    const user = currentUser(req);
    return user ? json(res, 200, { user: { username: user.username } }) : json(res, 401, { error: "登录已失效" });
  }

  if (url.pathname === "/api/auth/verify" && req.method === "GET") {
    const user = currentUser(req);
    if (user) {
      res.writeHead(200, { "X-Auth-User": encodeURIComponent(user.username), "Cache-Control": "no-store" });
      return res.end();
    }
    const forwardedUri = String(req.headers["x-forwarded-uri"] || "/");
    const returnTo = forwardedUri.startsWith("/") && !forwardedUri.startsWith("//") ? forwardedUri : "/";
    res.writeHead(302, { Location: `/login.html?return=${encodeURIComponent(returnTo)}`, "Cache-Control": "no-store" });
    return res.end();
  }

  return json(res, 404, { error: "接口不存在" });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error(error);
    if (!res.headersSent) json(res, 500, { error: "服务器暂时不可用" });
    else res.end();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`workbench auth listening on ${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
