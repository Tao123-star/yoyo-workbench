(function () {
  "use strict";
  document.documentElement.setAttribute("data-yoyo-platform-sync", "ready");

  window.addEventListener("message", function (event) {
    if (event.source !== window || event.origin !== location.origin) return;
    var detail = event.data || {};
    if (detail.type !== "YOYO_PLATFORM_SYNC_REQUEST" || !/^platform-[a-z0-9.-]+$/i.test(String(detail.requestId || ""))) return;
    chrome.runtime.sendMessage({ type: "YOYO_COLLECT_PLATFORMS", requestId: detail.requestId }, function (result) {
      var error = chrome.runtime.lastError;
      window.postMessage({
        type: "YOYO_PLATFORM_SYNC_RESULT",
        requestId: detail.requestId,
        snapshots: result && Array.isArray(result.snapshots) ? result.snapshots : [],
        errors: result && Array.isArray(result.errors) ? result.errors : [error ? "本机同步器连接失败" : "平台数据读取失败"]
      }, location.origin);
    });
  });
})();
