import { ag as executeAsync } from '../_/nitro.mjs';
import { R as defineNuxtRouteMiddleware, c as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const shopOwner = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const authStore = useAuthStore();
  const shopStore = useShopStore();
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }
  if (!authStore.isShopOwner && !authStore.isStaffRole) {
    return navigateTo("/quote-draft");
  }
  const shopSlug = to.params.slug;
  if (shopSlug) {
    [__temp, __restore] = executeAsync(() => shopStore.ensureActiveShop(shopSlug)), await __temp, __restore();
    if (!shopStore.currentShop) {
      return navigateTo("/dashboard");
    }
    const ownerId = typeof shopStore.currentShop.owner === "object" ? shopStore.currentShop.owner?.id : shopStore.currentShop.owner;
    if (ownerId !== authStore.user?.id && !authStore.isStaffRole) {
      return navigateTo("/dashboard");
    }
  }
});

export { shopOwner as default };
//# sourceMappingURL=shop-owner-E3svIjFX.mjs.map
