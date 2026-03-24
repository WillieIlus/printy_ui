import { d as defineEventHandler, a as useRuntimeConfig } from '../../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';

const sitemapRoutes_get = defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  try {
    const routes = await $fetch(`${apiBase}/seo/routes/`);
    return routes != null ? routes : [];
  } catch {
    return [{ loc: "/", lastmod: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }];
  }
});

export { sitemapRoutes_get as default };
//# sourceMappingURL=sitemap-routes.get.mjs.map
