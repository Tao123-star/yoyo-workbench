const PLATFORM_PAGES = [
  {
    platform: "xiaohongshu",
    url: "https://creator.xiaohongshu.com/new/note-manager",
    patterns: ["https://creator.xiaohongshu.com/*"]
  },
  {
    platform: "douyin",
    url: "https://creator.douyin.com/creator-micro/content/manage",
    patterns: ["https://creator.douyin.com/*"]
  }
];

function waitForComplete(tabId, timeoutMs) {
  return new Promise(function (resolve, reject) {
    var ended = false;
    var timer = setTimeout(function () { ended = true; reject(new Error("页面加载超时")); }, timeoutMs);
    function done(tabIdChanged, info) {
      if (ended || tabIdChanged !== tabId || info.status !== "complete") return;
      ended = true;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(done);
      setTimeout(resolve, 1800);
    }
    chrome.tabs.onUpdated.addListener(done);
    chrome.tabs.get(tabId, function (tab) {
      if (!ended && tab && tab.status === "complete") {
        ended = true;
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(done);
        setTimeout(resolve, 1200);
      }
    });
  });
}

async function findOrOpen(page) {
  var tabs = await chrome.tabs.query({ url: page.patterns });
  var tab = tabs.find(function (item) { return item.url && item.url.indexOf(new URL(page.url).hostname) > -1; });
  if (!tab) tab = await chrome.tabs.create({ url: page.url, active: false });
  else if (!tab.url || tab.url.indexOf(new URL(page.url).pathname) === -1) tab = await chrome.tabs.update(tab.id, { url: page.url, active: false });
  await waitForComplete(tab.id, 20000);
  return tab;
}

function collectFromTab(tabId) {
  return new Promise(function (resolve) {
    chrome.tabs.sendMessage(tabId, { type: "YOYO_COLLECT_PLATFORM" }, function (result) {
      if (chrome.runtime.lastError) resolve({ ok: false, error: "平台采集页面尚未准备好，请刷新后重试" });
      else resolve(result || { ok: false, error: "平台没有返回数据" });
    });
  });
}

async function collectPlatform(page) {
  try {
    var tab = await findOrOpen(page);
    var result = await collectFromTab(tab.id);
    if (!result.ok) return { error: platformLabel(page.platform) + "：" + (result.error || "读取失败") };
    return { snapshot: result.snapshot };
  } catch (error) {
    return { error: platformLabel(page.platform) + "：" + (error.message || "读取失败") };
  }
}

function platformLabel(platform) {
  return platform === "douyin" ? "抖音" : "小红书";
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (!message || message.type !== "YOYO_COLLECT_PLATFORMS") return;
  if (!sender.url || sender.url.indexOf("https://workbench.taozipipi.cn/") !== 0) {
    sendResponse({ snapshots: [], errors: ["请求来源不正确"] });
    return;
  }
  Promise.all(PLATFORM_PAGES.map(collectPlatform)).then(function (results) {
    sendResponse({
      snapshots: results.map(function (result) { return result.snapshot; }).filter(Boolean),
      errors: results.map(function (result) { return result.error; }).filter(Boolean)
    });
  });
  return true;
});
