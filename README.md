# РемоДива — KZ

安卓 APK 落地页，全站俄语，已按目标市场本地化。
上线方式：GitHub → Cloudflare Pages 自动构建。

## 文件在哪

```
index.html              落地页本体：文案 / 卡片 / 弹窗 / 前端事件
public/config.js        唯一配置：APK 链接 + 像素 + 年龄门      ← 平时只改这里
public/privacy.html     隐私政策
public/terms.html       使用条款
public/rekvizity.html   卖家资质（日本特商法页的俄语替代版）
public/assets/girls/    01.jpg … 09.jpg（600×800，3:4）
worker/_worker.js       分流 + 后台面板 + 内嵌安全页
scripts/build.mjs       index.html + public/* → dist/
scripts/test-cloak.mjs  17 项分流自检
```

## 本地跑

```bash
node scripts/build.mjs        # 出 dist/
node scripts/test-cloak.mjs   # 分流自检，必须 0 failed
node scripts/dev.mjs          # 本地预览，默认 5173
```

## Cloudflare Pages 设置

| 项目 | 值 |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| 环境变量 | `ADMIN_TOKEN` = remo-kz-2026 |
| D1 绑定 | 变量名 `DB` |
| 其它变量 | `PREVIEW_TOKEN`（可选）、`SAFE_COUNTRY_STRICT` = 1 |

后台：`https://你的域名/admin/live?token=remo-kz-2026`

## 分流规则

只有同时满足「手机 + `Accept-Language` 含 ru + 国家属于 KZ」才看到真页。
其余全部（电脑、别的国家、爬虫、无语言头）看到安全页。

自己验收：网址后加 `?preview=1`（24 小时免分流），`?preview=0` 清除。

## 换成本地真实信息（4 处）

1. `public/config.js` → `DOWNLOAD_URL`、`FB_PIXEL_ID`
2. `public/rekvizity.html` → 所有 【...】 换成真实卖家资料
3. `index.html` → `GIRLS` 数组（名字 / 状态）、`REACTIONS` 数组（点遥控器时的台词）
4. `public/assets/girls/` → 01.jpg … 09.jpg

## 不能动的三条

- 页脚和「同意」区块里的 18+ 与「仅在她同意后可操作」表述，两处都要留。
- 像素事件：免费的下载按钮 → `InitiateCheckout`；弹层里的下载按钮 → `Purchase`。
- 内置浏览器（FB / IG / Telegram）里一律不报转化事件，只弹「请用浏览器打开」。
