/**
 * ┌─ public/config.js ─────────────────────────────────────────────────────
 * │ ★★★ Единственный файл настроек: ссылка на APK + пиксели + возрастной шлюз
 * │ DOWNLOAD_URL = внешняя ссылка на APK; FB_PIXEL_ID = число из Events Manager
 * │ Сохранил → git push → Cloudflare пересоберёт за минуту, другие файлы не трогаем
 * └───────────────────────────────────────────────────────────────
 */
window.APP_CONFIG = {

  /* ① Бренд */
  BRAND: "РемоДива",
  COUNTRY: "KZ",

  /* ② Ссылка на APK (внешняя; можно и внутреннюю短链 /dl/app-latest.apk)
        Только Android — настройки для iOS не нужны */
  DOWNLOAD_URL: "https://YOUR_HOST/app-latest.apk",

  /* ③ Пиксели (все нули / пусто = ничего не отправляем) */
  FB_PIXEL_ID: "000000000000000",
  TT_PIXEL_ID: "",
  X_PIXEL_ID: "",

  /* ⑤ Возрастной шлюз 18+ (для взрослого трафика держать включённым) */
  AGE_GATE: true,

  /* ⑥ Реальную страницу видят только мобильные из Сервис для Казахстана (см. worker/_worker.js) */
  REQUIRE_LOCAL: true,

  /* ⑦ Версия (для отображения) */
  APK_VERSION: "2.1.0",
  APK_SIZE_MB: 31.4,

  /* ⑧ Юридические страницы */
  PRIVACY_URL: "privacy.html",
  TERMS_URL: "terms.html",
  REQUISITES_URL: "rekvizity.html",
  CONTACT_EMAIL: "support@remodiva.kz"
};
