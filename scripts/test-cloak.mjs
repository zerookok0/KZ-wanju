import { decide } from "../worker/_worker.js";

const A = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const PC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const FBC = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const GB = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const C = "KZ";
const RU = "ru-RU,ru;q=0.9";

// worker 只对 "/" 判定，其它路径直接透传，所以这里只测判定逻辑
const cases = [
  ["Android + ru + " + C,        { ua: A, acceptLanguage: RU, country: C, accept: "text/html" }, "page"],
  ["Android + ru + US",          { ua: A, acceptLanguage: RU, country: "US", accept: "text/html" }, "safe"],
  ["Android + en + " + C,        { ua: A, acceptLanguage: "en-US,en;q=0.9", country: C, accept: "text/html" }, "safe"],
  ["Android + ja + " + C,        { ua: A, acceptLanguage: "ja-JP,ja;q=0.9", country: C, accept: "text/html" }, "safe"],
  ["Android + 无语言头 + " + C,   { ua: A, acceptLanguage: "", country: C, accept: "text/html" }, "safe"],
  ["PC + ru + " + C,             { ua: PC, acceptLanguage: RU, country: C, accept: "text/html" }, "safe"],
  ["FB 爬虫",                    { ua: FBC, acceptLanguage: RU, country: C, accept: "text/html" }, "safe"],
  ["YandexBot",                  { ua: "Mozilla/5.0 (compatible; YandexBot/3.0)", acceptLanguage: RU, country: C, accept: "text/html" }, "safe"],
  ["Headless Chrome",            { ua: A.replace("Chrome/120", "HeadlessChrome/120"), acceptLanguage: RU, country: C, accept: "text/html" }, "safe"],
  ["国家未知",                   { ua: A, acceptLanguage: RU, country: "", accept: "text/html" }, "safe"],
  ["国家未知 + strict=false",     { ua: A, acceptLanguage: RU, country: "", accept: "text/html", strict: false }, "page"],
  ["POST 请求",                  { ua: A, acceptLanguage: RU, country: C, method: "POST", accept: "text/html" }, "page"],
  ["iPad + ru",                   { ua: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) Mobile/15E148", acceptLanguage: RU, country: C, accept: "text/html" }, "page"],
  ["Telegram 内置 + ru",          { ua: A + " Telegram/10.5", acceptLanguage: RU, country: C, accept: "text/html" }, "page"],
  ["PC + ?preview=1",             { ua: PC, acceptLanguage: "en", country: "CN", accept: "text/html", preview: true }, "page"],
  ["FB 爬虫 + ?preview=1",        { ua: FBC, acceptLanguage: RU, country: C, accept: "text/html", preview: true }, "safe"],
  ["Googlebot + ?preview=1",      { ua: GB, acceptLanguage: RU, country: C, accept: "text/html", preview: true }, "safe"]
];

let pass = 0, fail = 0;
for (const [name, ctx, expect] of cases) {
  const v = decide(ctx);
  const ok = v.show === expect;
  ok ? pass++ : fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name.padEnd(26)} expect=${expect.padEnd(4)} actual=${v.show.padEnd(4)} (${v.reason})`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
