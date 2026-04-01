import { R as defineNuxtRouteMiddleware, c as useAuthStore, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
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

const superAdmin = defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath }
    });
  }
  if (!authStore.user?.is_superuser) {
    return navigateTo("/dashboard");
  }
});

export { superAdmin as default };
//# sourceMappingURL=super-admin-CfS5fjM6.mjs.map
