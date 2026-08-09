/* YOYO 项目工具：页面截图 + 溢出/JS 错误诊断
 * 用法：
 *   NODE_PATH=/Users/taotaozi/.workbuddy/binaries/node/workspace/node_modules \
 *   /Users/taotaozi/.workbuddy/binaries/node/versions/22.22.2/bin/node tools-screenshot.js [url] [宽度] [输出.png]
 * 依赖：puppeteer-core（装在 managed node workspace）+ 本机 Chrome
 */
const puppeteer = require("puppeteer-core");

(async () => {
  const url = process.argv[2] || "http://localhost:8321/#/today";
  const width = parseInt(process.argv[3] || "390", 10);
  const out = process.argv[4] || "/tmp/yoyo-shot.png";
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height: Math.round(width * 2.16) });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
  await new Promise(r => setTimeout(r, 1200));

  const info = await page.evaluate(() => {
    const innerW = window.innerWidth;
    const offenders = [];
    document.querySelectorAll("body *").forEach(el => {
      const r = el.getBoundingClientRect();
      const fixed = getComputedStyle(el).position === "fixed";
      if (!fixed && r.right > innerW + 1 && r.width > 4) {
        offenders.push(el.className.toString().slice(0, 40) + " right=" + Math.round(r.right));
      }
    });
    return { innerW, docW: document.documentElement.scrollWidth, offenders: offenders.slice(0, 8) };
  });
  console.log(JSON.stringify({ ...info, jsErrors: errors }, null, 2));
  await page.screenshot({ path: out });
  console.log("screenshot ->", out);
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
