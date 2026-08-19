window.YOYO = window.YOYO || {};

(function () {
  "use strict";
  var localPreview = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  var account = {
    enabled: !localPreview,
    username: localPreview ? "本地预览" : "个人账号",
    logout: function () {
      if (localPreview) return Promise.resolve();
      var flush = YOYO.cloud ? YOYO.cloud.flush().catch(function () {}) : Promise.resolve();
      return flush.then(function () { return fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); })
        .finally(function () { location.replace("/login.html"); });
    }
  };
  YOYO.account = account;

  function updateName() {
    var nodes = document.querySelectorAll(".me-name, [data-account-name]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = account.username;
  }

  if (!localPreview) {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then(function (response) {
        if (response.status === 401) { location.replace("/login.html"); return null; }
        return response.json();
      })
      .then(function (data) {
        if (!data || !data.user) return;
        account.username = data.user.username;
        updateName();
      })
      .catch(function () {});
  }
})();
