/**
 * ┌─ scripts/pack-upload.mjs ─────────────────────────────────────
 * │ 打包「可直接拖到 Cloudflare Pages」的文件夹（Direct Upload 用）
 * │ 内容 = dist/* + functions/*（Functions 必须在项目根才会生效）
 * │ 用法：node scripts/pack-upload.mjs → 生成 upload/
 * └───────────────────────────────────────────────────────────────
 */
import { rm, mkdir, cp, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const FUNCS = path.join(ROOT, "functions");
const OUT = path.join(ROOT, "upload");

if (!existsSync(DIST)) {
  console.error("dist/ 不存在，先跑 node scripts/build.mjs");
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// 1) 静态产物
await cp(DIST, OUT, { recursive: true });

// 2) Functions（Direct Upload 时同样需要在根）
if (existsSync(FUNCS)) {
  await cp(FUNCS, path.join(OUT, "functions"), { recursive: true });
}

// 3) 检查
const need = ["index.html", "config.js", "_headers", "_redirects", "safe.html"];
for (const f of need) {
  if (!existsSync(path.join(OUT, f))) console.error("缺少:", f);
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

console.log(`upload/ 完成：${files.length} 个文件，${(bytes / 1024).toFixed(1)} KB`);
console.log("把 upload/ 里的内容（不是 upload 文件夹本身）拖进 Cloudflare Pages");
