import { ag as executeAsync } from '../_/nitro.mjs';
import { K as defineNuxtRouteMiddleware, e as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
import { g as getPostLoginRedirectPath } from './useAuth-CuIEby6D.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './api-error-D1IYk86E.mjs';
import './profile-CEiUsRUc.mjs';

const guest = defineNuxtRouteMiddleware(async () => {
  let __temp, __restore;
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    let u = authStore.user;
    if (!u) {
      [__temp, __restore] = executeAsync(() => authStore.fetchMe()), await __temp, __restore();
      u = authStore.user;
    }
    const shopStore = useShopStore();
    if (u?.role === "PRINTER") {
      [__temp, __restore] = executeAsync(() => shopStore.fetchMyShops()), await __temp, __restore();
    }
    const path = getPostLoginRedirectPath(u ?? null, (shopStore.myShops?.length ?? 0) > 0);
    return navigateTo(path);
  }
});

export { guest as default };
//# sourceMappingURL=guest-szRZnh3T.mjs.map
