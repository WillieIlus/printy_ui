import { i as executeAsync } from '../_/nitro.mjs';
import { h as defineNuxtRouteMiddleware, m as useAuthStore, n as navigateTo } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';

const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const auth2 = useAuthStore();
  if (!auth2.isInitialized) {
    [__temp, __restore] = executeAsync(() => auth2.initialize()), await __temp, __restore();
  }
  if (!auth2.isAuthenticated) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});

export { auth as default };
//# sourceMappingURL=auth-vgEK-3X3.mjs.map
