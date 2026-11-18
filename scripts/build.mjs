/**
 * ┌─ scripts/build.mjs ─────────────────────────────────────────────────────
 * │ 构建脚本：index.html + public/* → dist/（零依赖，不需要 npm install）
 * │ Cloudflare 上 Build command = npm run build，输出目录 = dist
 * │ 一般不用改；要加文件就放进 public/
 * └───────────────────────────────────────────────────────────────
 */
// 零依赖构建：index.html + public/* → dist/
// Cloudflare Pages: Build command = npm run build, Output directory = dist
import { rm, mkdir, cp, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");

const t0 = Date.now();
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// 1) 主页面
await cp(path.join(ROOT, "index.html"), path.join(OUT, "index.html"));

// 2) public 全量复制（含 _headers / _redirects / config.js / 法务页 / 图片）
const PUB = path.join(ROOT, "public");
if (existsSync(PUB)) {
  await cp(PUB, OUT, { recursive: true });
}

// 3) assets（如有，放仓库根 assets/ 也可）
const ASSETS = path.join(ROOT, "assets");
if (existsSync(ASSETS)) {
  await cp(ASSETS, path.join(OUT, "assets"), { recursive: true });
}

// 4) 分流 Worker → dist/_worker.js
//    Pages 认这个文件：Dashboard 直接拖拽上传也会生效（不需要 functions 目录、不需要 CLI）
const WORKER = path.join(ROOT, "worker", "_worker.js");
if (existsSync(WORKER)) {
  await cp(WORKER, path.join(OUT, "_worker.js"));
} else {
  console.warn("!! 缺少 worker/_worker.js —— 分流不会生效");
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(OUT);
const bytes = (await Promise.all(files.map((f) => stat(f)))).reduce((a, s) => a + s.size, 0);
console.log(`build ok → dist/  ${files.length} files, ${(bytes / 1024).toFixed(1)} KB, ${Date.now() - t0}ms`);
for (const f of files) console.log("  " + path.relative(OUT, f));
