window.YOYO = window.YOYO || {};

(function () {
  "use strict";

  var localPreview = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  var pending = {};
  var versions = {};
  var baseData = {};
  var timer = null;
  var pullTimer = null;
  var pulling = false;
  var appLoaded = false;
  var inFlight = Promise.resolve();
  var state = {
    enabled: !localPreview,
    ready: localPreview,
    syncing: false,
    lastSyncedAt: 0,
    conflictCount: 0,
    lastConflictAt: 0,
    remoteUpdate: false,
    error: ""
  };
  var scripts = ["assets/js/data.js", "assets/js/ai.js", "assets/js/account.js", "assets/js/app.js"];

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function equal(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function storageKeys() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("yoyo_") === 0) keys.push(key);
    }
    return keys;
  }

  function isCloudKey(key) {
    return key.indexOf("yoyo_") === 0 && key !== "yoyo_gh_cache" && key !== "yoyo_hot_cache" && key !== "yoyo_platform_sync_day" && key.indexOf("yoyo_cheer_") !== 0;
  }

  function cloudStorageKeys() {
    return storageKeys().filter(isCloudKey);
  }

  function safeValue(key, value) {
    if (key === "yoyo_settings" && value && typeof value === "object" && !Array.isArray(value)) {
      var copy = Object.assign({}, value);
      delete copy.aiKey;
      return copy;
    }
    return value;
  }

  function readLocal() {
    var data = {};
    cloudStorageKeys().forEach(function (key) {
      try { data[key] = safeValue(key, JSON.parse(localStorage.getItem(key))); } catch (error) {}
    });
    return data;
  }

  function localApiKey() {
    try {
      var settings = JSON.parse(localStorage.getItem("yoyo_settings") || "{}");
      return settings.aiKey || "";
    } catch (error) { return ""; }
  }

  function writeLocalKey(key, value) {
    var apiKey = key === "yoyo_settings" ? localApiKey() : "";
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    if (key === "yoyo_settings" && apiKey) {
      var settings = { name: "桃子" };
      try { settings = Object.assign(settings, JSON.parse(localStorage.getItem(key) || "{}")); } catch (error) {}
      settings.aiKey = apiKey;
      localStorage.setItem(key, JSON.stringify(settings));
    }
  }

  function replaceLocal(data) {
    cloudStorageKeys().forEach(function (key) { writeLocalKey(key, null); });
    Object.keys(data || {}).forEach(function (key) {
      if (isCloudKey(key)) writeLocalKey(key, data[key]);
    });
  }

  function request(method, body) {
    return fetch("/api/data", {
      method: method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (response.status === 401) {
          location.replace("/login.html?return=" + encodeURIComponent(location.pathname + location.hash));
          var authError = new Error("登录已失效");
          authError.status = 401;
          throw authError;
        }
        if (!response.ok) {
          var error = new Error(data.error || "云端同步失败");
          error.status = response.status;
          error.data = data;
          throw error;
        }
        return data;
      });
    });
  }

  function notify() {
    document.dispatchEvent(new CustomEvent("yoyo:cloud-status", { detail: Object.assign({}, state) }));
  }

  function itemIdentity(item, index) {
    if (item && typeof item === "object") return String(item.id || item.title || item.topic || item.name || item.text || ("row-" + index));
    return typeof item + ":" + JSON.stringify(item);
  }

  function conflictCopy(item) {
    var copy = clone(item);
    if (!copy || typeof copy !== "object" || Array.isArray(copy)) return copy;
    copy.id = String(copy.id || "item") + "-conflict-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    if (copy.title) copy.title += "（其他设备版本）";
    else if (copy.topic) copy.topic += "（其他设备版本）";
    copy.conflictBackup = true;
    return copy;
  }

  function mergeArrays(base, local, remote) {
    var allPrimitive = local.concat(remote).every(function (item) { return item === null || typeof item !== "object"; });
    if (allPrimitive) {
      var seen = {};
      return local.concat(remote).filter(function (item) {
        var key = typeof item + ":" + JSON.stringify(item);
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    }
    var baseMap = {};
    var localMap = {};
    var remoteMap = {};
    var order = [];
    function add(list, map) {
      list.forEach(function (item, index) {
        var key = itemIdentity(item, index);
        map[key] = item;
        if (order.indexOf(key) === -1) order.push(key);
      });
    }
    add(Array.isArray(base) ? base : [], baseMap);
    add(local, localMap);
    add(remote, remoteMap);
    var merged = [];
    order.forEach(function (key) {
      var hasBase = Object.prototype.hasOwnProperty.call(baseMap, key);
      var hasLocal = Object.prototype.hasOwnProperty.call(localMap, key);
      var hasRemote = Object.prototype.hasOwnProperty.call(remoteMap, key);
      var baseItem = baseMap[key];
      var localItem = localMap[key];
      var remoteItem = remoteMap[key];
      if (!hasLocal && !hasRemote) return;
      if (!hasLocal) {
        if (!hasBase || !equal(remoteItem, baseItem)) merged.push(clone(remoteItem));
        return;
      }
      if (!hasRemote) {
        if (!hasBase || !equal(localItem, baseItem)) merged.push(clone(localItem));
        return;
      }
      if (equal(localItem, remoteItem)) { merged.push(clone(localItem)); return; }
      if (hasBase && equal(localItem, baseItem)) { merged.push(clone(remoteItem)); return; }
      if (hasBase && equal(remoteItem, baseItem)) { merged.push(clone(localItem)); return; }
      merged.push(clone(localItem));
      merged.push(conflictCopy(remoteItem));
    });
    return merged;
  }

  function mergeObjects(base, local, remote) {
    var merged = {};
    var keys = Object.keys(Object.assign({}, base || {}, local || {}, remote || {}));
    keys.forEach(function (key) {
      var baseValue = base ? base[key] : undefined;
      var localValue = local ? local[key] : undefined;
      var remoteValue = remote ? remote[key] : undefined;
      if (equal(localValue, remoteValue)) merged[key] = clone(localValue);
      else if (equal(localValue, baseValue)) merged[key] = clone(remoteValue);
      else merged[key] = clone(localValue);
      if (merged[key] === undefined) delete merged[key];
    });
    return merged;
  }

  function mergeThreeWay(base, local, remote) {
    if (equal(local, remote)) return clone(local);
    if (equal(local, base)) return clone(remote);
    if (equal(remote, base)) return clone(local);
    if (Array.isArray(local) && Array.isArray(remote)) return mergeArrays(base, local, remote);
    if (local && remote && typeof local === "object" && typeof remote === "object") return mergeObjects(base, local, remote);
    if (remote === null || remote === undefined) return clone(local);
    return clone(local);
  }

  function applyConflictResponse(changes, conflicts) {
    var merged = Object.assign({}, changes);
    conflicts.forEach(function (conflict) {
      var key = conflict.key;
      merged[key] = mergeThreeWay(baseData[key], changes[key], conflict.serverValue);
      versions[key] = Number(conflict.serverVersion) || 0;
      baseData[key] = clone(conflict.serverValue);
      writeLocalKey(key, merged[key]);
    });
    state.conflictCount += conflicts.length;
    state.lastConflictAt = Date.now();
    state.remoteUpdate = false;
    notify();
    return merged;
  }

  function send(changes, attempt) {
    if (localPreview || !Object.keys(changes).length) return Promise.resolve();
    var baseVersions = {};
    Object.keys(changes).forEach(function (key) { baseVersions[key] = Number(versions[key]) || 0; });
    state.syncing = true;
    state.error = "";
    notify();
    return request("PUT", { changes: changes, baseVersions: baseVersions }).then(function (result) {
      state.syncing = false;
      state.lastSyncedAt = result.updatedAt || Date.now();
      Object.keys(changes).forEach(function (key) {
        versions[key] = result.versions && result.versions[key] ? Number(result.versions[key]) : (Number(versions[key]) || 0) + 1;
        baseData[key] = clone(changes[key]);
      });
      notify();
    }).catch(function (error) {
      if (error.status === 409 && error.data && Array.isArray(error.data.conflicts) && (attempt || 0) < 2) {
        return send(applyConflictResponse(changes, error.data.conflicts), (attempt || 0) + 1);
      }
      state.syncing = false;
      state.error = error.message;
      Object.keys(changes).forEach(function (key) { pending[key] = changes[key]; });
      notify();
      throw error;
    });
  }

  function flush() {
    if (timer) clearTimeout(timer);
    timer = null;
    var changes = pending;
    pending = {};
    inFlight = inFlight.catch(function () {}).then(function () { return send(changes, 0); });
    return inFlight;
  }

  function saveKey(key, value) {
    if (localPreview || !isCloudKey(key)) return;
    pending[key] = safeValue(key, value);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { flush().catch(function () {}); }, 350);
  }

  function canAutoReload() {
    var active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return false;
    if (active && active.isContentEditable) return false;
    return true;
  }

  function adoptSnapshot(cloud, allowReload) {
    var remoteVersions = cloud.versions || {};
    var keys = Object.keys(Object.assign({}, versions, remoteVersions));
    var changed = keys.filter(function (key) { return Number(remoteVersions[key] || 0) !== Number(versions[key] || 0); });
    changed.forEach(function (key) {
      var value = Object.prototype.hasOwnProperty.call(cloud.data || {}, key) ? cloud.data[key] : null;
      writeLocalKey(key, value);
      baseData[key] = clone(value);
      versions[key] = Number(remoteVersions[key]) || 0;
    });
    state.lastSyncedAt = cloud.updatedAt || state.lastSyncedAt;
    state.conflictCount = Number(cloud.conflictCount) || state.conflictCount;
    if (changed.length && appLoaded) {
      if (allowReload && canAutoReload()) {
        location.reload();
        return true;
      }
      state.remoteUpdate = true;
    }
    notify();
    return changed.length > 0;
  }

  function pull(allowReload) {
    if (localPreview || pulling) return Promise.resolve(false);
    pulling = true;
    return request("GET").then(function (cloud) {
      return adoptSnapshot(cloud, allowReload);
    }).finally(function () { pulling = false; });
  }

  function refresh(allowReload) {
    return flush().catch(function () {}).then(function () { return pull(allowReload); });
  }

  function syncAll() {
    if (localPreview) return Promise.resolve();
    pending = Object.assign(pending, readLocal());
    return flush().then(function () {
      if (state.remoteUpdate && canAutoReload()) { location.reload(); return true; }
      return pull(true);
    });
  }

  function clearAll() {
    pending = {};
    if (timer) clearTimeout(timer);
    timer = null;
    if (localPreview) return Promise.resolve();
    state.syncing = true;
    notify();
    return request("DELETE").then(function (result) {
      state.syncing = false;
      state.lastSyncedAt = result.updatedAt || Date.now();
      state.error = "";
      return pull(false);
    });
  }

  function statusText() {
    if (localPreview) return "本地预览，未连接云端";
    if (state.error) return "同步失败：" + state.error;
    if (state.syncing) return "正在自动同步…";
    if (state.remoteUpdate) return "其他设备有更新，保存当前输入后点击立即同步";
    if (state.lastConflictAt) return "已自动合并多设备修改，两个版本均已保留";
    if (state.lastSyncedAt) return "已自动同步 · " + new Date(state.lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return "云端同步已开启";
  }

  function loadScripts(index) {
    if (index >= scripts.length) {
      appLoaded = true;
      return;
    }
    var script = document.createElement("script");
    script.src = scripts[index] + "?v=20260819-analytics3";
    script.onload = function () { loadScripts(index + 1); };
    script.onerror = function () { showError("工作台加载失败，请刷新重试"); };
    document.body.appendChild(script);
  }

  function showError(text) {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',sans-serif"><section style="max-width:420px;text-align:center"><h1 style="font-size:22px">暂时无法连接云端数据</h1><p style="color:#7A736A;line-height:1.7">' + text + '</p><button onclick="location.reload()" style="border:0;border-radius:12px;padding:12px 22px;background:#2B2622;color:white">重新连接</button></section></main>';
  }

  YOYO.cloud = {
    state: state,
    saveKey: saveKey,
    syncAll: syncAll,
    flush: flush,
    pull: pull,
    clearAll: clearAll,
    statusText: statusText
  };

  if (localPreview) {
    loadScripts(0);
    return;
  }

  request("GET").then(function (cloud) {
    state.conflictCount = Number(cloud.conflictCount) || 0;
    if (cloud.initialized) {
      replaceLocal(cloud.data || {});
      versions = Object.assign({}, cloud.versions || {});
      baseData = clone(cloud.data || {});
      state.lastSyncedAt = cloud.updatedAt || 0;
      return null;
    }
    var initialData = readLocal();
    var initialVersions = {};
    Object.keys(initialData).forEach(function (key) { initialVersions[key] = 0; });
    return request("PUT", { changes: initialData, baseVersions: initialVersions }).then(function (result) {
      versions = Object.assign({}, result.versions || {});
      baseData = clone(initialData);
      state.lastSyncedAt = result.updatedAt || Date.now();
    });
  }).then(function () {
    state.ready = true;
    notify();
    loadScripts(0);
    pullTimer = setInterval(function () {
      if (document.visibilityState === "visible") refresh(true).catch(function () {});
    }, 30000);
  }).catch(function (error) {
    state.error = error.message;
    showError(error.message || "请稍后重试");
  });

  window.addEventListener("storage", function (event) {
    if (!event.key || !isCloudKey(event.key)) return;
    var value = null;
    try { value = event.newValue === null ? null : JSON.parse(event.newValue); } catch (error) { return; }
    saveKey(event.key, value);
  });

  window.addEventListener("focus", function () { refresh(true).catch(function () {}); });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && Object.keys(pending).length) flush().catch(function () {});
    if (document.visibilityState === "visible") refresh(true).catch(function () {});
  });

  window.addEventListener("beforeunload", function () {
    if (pullTimer) clearInterval(pullTimer);
  });
})();
