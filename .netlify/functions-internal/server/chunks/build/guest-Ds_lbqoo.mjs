import { ag as executeAsync } from '../_/nitro.mjs';
import { R as defineNuxtRouteMiddleware, c as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useShopStore } from './shop-DfXxeXDQ.mjs';
import { r as resolvePostLoginRedirectPath } from './useAuth-DnD-pi_T.mjs';
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
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './browser-storage-CN-SIF_V.mjs';
import './profile-BFvViN4V.mjs';

const guest = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    let u = authStore.user;
    if (!u) {
      [__temp, __restore] = executeAsync(() => authStore.fetchMe()), await __temp, __restore();
      u = authStore.user;
    }
    const shopStore = useShopStore();
    if (authStore.normalizedRole === "shop_owner" || authStore.normalizedRole === "staff") {
      [__temp, __restore] = executeAsync(() => shopStore.fetchMyShops()), await __temp, __restore();
    }
    const redirect = typeof to.query.redirect === "string" ? to.query.redirect : null;
    const path = resolvePostLoginRedirectPath(u ?? null, (shopStore.myShops?.length ?? 0) > 0, redirect);
    return navigateTo(path);
  }
});

export { guest as default };
//# sourceMappingURL=guest-Ds_lbqoo.mjs.map
