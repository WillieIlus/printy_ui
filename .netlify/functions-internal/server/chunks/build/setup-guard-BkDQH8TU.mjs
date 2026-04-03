import { al as executeAsync } from '../_/nitro.mjs';
import { R as defineNuxtRouteMiddleware, d as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { u as useSetupStatus, r as resolveSetupFlow } from './useSetupStatus-BlqBMF6r.mjs';
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
import './setupStatus-BIGAzyB1.mjs';

const setupGuard = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const authStore = useAuthStore();
  const shopStore = useShopStore();
  if (!authStore.isAuthenticated) {
    return navigateTo({ path: "/auth/login", query: { redirect: to.fullPath } });
  }
  if (!authStore.isShopOwner) return;
  const { status, refresh } = useSetupStatus();
  [__temp, __restore] = executeAsync(() => refresh()), await __temp, __restore();
  if (!status.value) return;
  const flow = resolveSetupFlow(status.value, shopStore.selectedShopSlug);
  if (!flow.nextRequiredStep) return;
  const target = flow.nextRequiredRoute;
  if (to.path === target || to.path.startsWith(target + "/")) return;
  return navigateTo(target);
});

export { setupGuard as default };
//# sourceMappingURL=setup-guard-BkDQH8TU.mjs.map
