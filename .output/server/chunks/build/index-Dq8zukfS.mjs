import { defineComponent, computed, withAsyncContext, useSSRContext } from 'vue';
import { m as useAuthStore, q as useRoute, n as navigateTo } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const route = useRoute();
    const target = computed(() => {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(route.query)) {
        if (typeof value === "string") {
          query.set(key, value);
        }
      }
      const nextRoute = auth.homeRoute;
      const nextQuery = query.toString();
      return nextQuery ? `${nextRoute}?${nextQuery}` : nextRoute;
    });
    [__temp, __restore] = withAsyncContext(() => navigateTo(target.value, { replace: true })), await __temp, __restore();
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dq8zukfS.mjs.map
