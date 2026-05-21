import { defineComponent, withAsyncContext, useSSRContext } from 'vue';
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
  __name: "[id]",
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const route = useRoute();
    const id = route.params.id;
    const target = auth.dashboardRole === "partner" ? `/dashboard/partner/quotes/${id}` : auth.dashboardRole === "client" ? `/dashboard/client/quotes/${id}` : auth.dashboardRole === "production" ? "/dashboard/production/jobs" : auth.homeRoute;
    [__temp, __restore] = withAsyncContext(() => navigateTo(target, { replace: true })), await __temp, __restore();
    return () => {
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C1jAhMXT.mjs.map
