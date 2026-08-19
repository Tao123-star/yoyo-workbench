(function () {
  "use strict";
  var loading = document.getElementById("authLoading");
  var loginForm = document.getElementById("loginForm");
  var setupForm = document.getElementById("setupForm");
  var message = document.getElementById("authMessage");
  var sub = document.getElementById("authSub");
  var setupTokenFromLink = "";
  var returnTo = new URLSearchParams(location.search).get("return") || "/";
  if (returnTo.charAt(0) !== "/" || returnTo.indexOf("//") === 0) returnTo = "/";

  function clearOldOfflineCopy() {
    if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then(function (items) { items.forEach(function (item) { item.unregister(); }); });
    if (window.caches) caches.keys().then(function (keys) { keys.forEach(function (key) { caches.delete(key); }); });
  }

  function setupTokenFromHash() {
    var params = new URLSearchParams(location.hash.replace(/^#/, ""));
    setupTokenFromLink = params.get("setup") || "";
    if (setupTokenFromLink) {
      document.getElementById("setupTokenRow").hidden = true;
      document.getElementById("setupToken").required = false;
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function api(path, options) {
    return fetch(path, Object.assign({ credentials: "same-origin" }, options || {})).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (data) {
        if (!response.ok) throw new Error(data.error || "请求失败");
        return data;
      });
    });
  }

  function show(form, text) {
    loading.hidden = true;
    loginForm.hidden = form !== "login";
    setupForm.hidden = form !== "setup";
    sub.textContent = text;
  }

  function submit(form, path, body) {
    message.textContent = "";
    var button = form.querySelector("button[type=submit]");
    button.disabled = true;
    return api(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function () {
      location.replace(returnTo);
    }).catch(function (error) {
      message.textContent = error.message;
      button.disabled = false;
    });
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submit(loginForm, "/api/auth/login", {
      username: document.getElementById("loginUsername").value.trim(),
      password: document.getElementById("loginPassword").value
    });
  });

  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var password = document.getElementById("setupPassword").value;
    if (password !== document.getElementById("setupPasswordAgain").value) {
      message.textContent = "两次输入的密码不一致";
      return;
    }
    submit(setupForm, "/api/auth/setup", {
      setupToken: setupTokenFromLink || document.getElementById("setupToken").value.trim(),
      username: document.getElementById("setupUsername").value.trim(),
      password: password
    });
  });

  clearOldOfflineCopy();
  setupTokenFromHash();
  api("/api/auth/status").then(function (state) {
    if (state.authenticated) return location.replace(returnTo);
    show(state.configured ? "login" : "setup", state.configured ? "登录后继续使用你的个人工作台" : "首次使用，请创建唯一的个人账号");
  }).catch(function () {
    loading.textContent = "账号服务暂时不可用，请稍后刷新";
  });
})();
