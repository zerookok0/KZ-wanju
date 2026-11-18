/**
 * ┌─ scripts/dev.mjs ─────────────────────────────────────────────────────
 * │ 本地预览：node scripts/dev.mjs → http://127.0.0.1:5173
 * │ 只做静态托管，不含分流逻辑（分流要在 Cloudflare 上才生效）
 * │ 换端口：$env:PORT=8080; node scripts/dev.mjs
 * └───────────────────────────────────────────────────────────────
 */
// 零依赖本地预览：node scripts/dev.mjs  → http://127.0.0.1:5173
import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 5173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".apk": "application/vnd.android.package-archive",
  ".txt": "text/plain; charset=utf-8"
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const rel = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  const candidates = [
    path.join(ROOT, rel),
    path.join(ROOT, "public", rel),
    path.join(ROOT, "dist", rel)
  ];
  for (const c of candidates) {
    if (existsSync(c) && !c.endsWith(path.sep)) {
      try {
        const buf = await readFile(c);
        return { buf, file: c };
      } catch { /* keep looking */ }
    }
  }
  // 目录回退
  const fallback = path.join(ROOT, "index.html");
  if (existsSync(fallback)) return { buf: await readFile(fallback), file: fallback };
  return null;
}

http.createServer(async (req, res) => {
  const hit = await resolveFile(req.url || "/");
  if (!hit) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  const ext = path.extname(hit.file).toLowerCase();
  res.writeHead(200, {
    "content-type": TYPES[ext] || "application/octet-stream",
    "cache-control": "no-store"
  });
  res.end(hit.buf);
  console.log(`${req.method} ${req.url} → ${path.relative(ROOT, hit.file)}`);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`dev server → http://127.0.0.1:${PORT}`);
});
