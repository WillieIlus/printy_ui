import { h as defineNuxtRouteMiddleware, m as useAuthStore, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
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

const guest = defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  if (!auth.initialized && false) ;
  if (auth.isAuthenticated) {
    const next = typeof to.query.next === "string" ? to.query.next : typeof to.query.redirect === "string" ? to.query.redirect : auth.homeRoute;
    return navigateTo(next);
  }
});

export { guest as default };
//# sourceMappingURL=guest-bzf1ZQlT.mjs.map
