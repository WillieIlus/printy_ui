import { a as defineEventHandler, G as useRuntimeConfig } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const PROD_FALLBACK_API_BASE = "https://api.printy.ke/api";
function getDefaultApiBase() {
  return PROD_FALLBACK_API_BASE;
}
const DEFAULT_API_BASE = getDefaultApiBase();
function getApiBase(input) {
  if (typeof input === "string") {
    return input.trim().replace(/\/$/, "");
  }
  if (input && typeof input === "object") {
    const value = input.apiBaseUrl || input.apiBase;
    if (typeof value === "string" && value.trim()) {
      return value.trim().replace(/\/$/, "");
    }
  }
  return DEFAULT_API_BASE;
}

const sitemapRoutes_get = defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const apiBase = getApiBase(config.public);
  const fallbackRoutes = [
    { loc: "/", lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) },
    { loc: "/for-shops", lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) },
    { loc: "/products", lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) },
    { loc: "/shops", lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }
  ];
  try {
    const routes = await $fetch(`${apiBase}/seo/routes/`);
    if (!(routes == null ? void 0 : routes.length)) return fallbackRoutes;
    return routes;
  } catch {
    return fallbackRoutes;
  }
});

export { sitemapRoutes_get as default };
//# sourceMappingURL=sitemap-routes.get.mjs.map
