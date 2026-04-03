import { al as executeAsync } from '../_/nitro.mjs';
import { R as defineNuxtRouteMiddleware, d as useAuthStore, n as navigateTo } from './server.mjs';
import { r as resolvePostLoginRedirectPath } from './useAuth-D74NSkk_.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
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
import './profile-v5Kfn5BI.mjs';
import './browser-storage-CN-SIF_V.mjs';

const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const authStore = useAuthStore();
  const shopStore = useShopStore();
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath }
    });
  }
  if (!authStore.user) {
    [__temp, __restore] = executeAsync(() => authStore.fetchMe()), await __temp, __restore();
  }
  if ((authStore.isShopOwner || authStore.isStaffRole) && !shopStore.myShopsLoaded) {
    [__temp, __restore] = executeAsync(() => shopStore.fetchMyShops()), await __temp, __restore();
  }
  const redirectTarget = resolvePostLoginRedirectPath(
    authStore.user,
    (shopStore.myShops?.length ?? 0) > 0,
    null
  );
  if (to.path.startsWith("/dashboard") && authStore.isClient) {
    return navigateTo(redirectTarget);
  }
  if ((to.path.startsWith("/quote-draft") || to.path.startsWith("/quotes") || to.path.startsWith("/account") || to.path.startsWith("/inbox")) && (authStore.isShopOwner || authStore.isStaffRole)) {
    return navigateTo(redirectTarget);
  }
});

export { auth as default };
//# sourceMappingURL=auth-B7b-nlSq.mjs.map
