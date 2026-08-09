/* ============================================================
   桃子工作台 AI 适配层 — DeepSeek（OpenAI 兼容接口）
   Key 只存在用户浏览器 localStorage，直连 api.deepseek.com。
   未配置 Key 时，视图层自动回退到 Mock 结果。
   ============================================================ */
window.YOYO = window.YOYO || {};

(function () {
  "use strict";

  var API_URL = "https://api.deepseek.com/chat/completions";
  var MODEL = "deepseek-chat";

  var SYSTEM = "你是「桃子工作台」的内置 AI 助手。用户是一位中文自媒体创作者，赛道是 AI 工具 / 效率 / 一人公司，发布平台包括小红书、抖音、公众号、视频号、B站。" +
    "你的风格：直接、具体、可执行，不说空话套话；用中文回答；适当用简短的条目结构；" +
    "给标题或文案时要贴合平台调性（小红书口语化带emoji、公众号偏深度、抖音强调前3秒钩子）。";

  function getKey() {
    var s = YOYO.data.getSettings();
    return s.aiKey || "";
  }
  function configured() { return !!getKey(); }

  /**
   * ask(userPrompt, cb)
   * cb(err, text)：err 为 null 表示成功
   */
  function ask(userPrompt, cb) {
    var key = getKey();
    if (!key) { cb("未配置 API Key"); return; }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })
      .then(function (r) {
        if (!r.ok) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            var msg = (j && j.error && j.error.message) || ("HTTP " + r.status);
            if (r.status === 401) msg = "API Key 无效，请到「设置」检查";
            if (r.status === 402) msg = "DeepSeek 余额不足，请充值";
            if (r.status === 429) msg = "请求太频繁，稍后再试";
            throw new Error(msg);
          });
        }
        return r.json();
      })
      .then(function (j) {
        var text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (!text) throw new Error("返回内容为空");
        cb(null, text);
      })
      .catch(function (e) {
        cb(e.message === "Failed to fetch" ? "网络连接失败，请检查网络" : e.message);
      });
  }

  YOYO.ai = { ask: ask, configured: configured, MODEL: MODEL };
})();
