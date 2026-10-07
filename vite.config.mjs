import { defineConfig } from "vite";

// og:image harus URL lengkap supaya preview WhatsApp muncul.
// Di Vercel, domain production diisi otomatis; bisa juga di-set manual lewat env SITE_URL.
const site = (process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : "")).replace(/\/$/, "");

export default defineConfig({
  plugins: [{
    name: "absolute-og-image",
    transformIndexHtml: html => (site ? html.replaceAll('content="/og.png"', `content="${site}/og.png"`) : html),
  }],
});
