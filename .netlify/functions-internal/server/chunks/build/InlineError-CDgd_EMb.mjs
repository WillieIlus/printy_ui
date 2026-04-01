import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InlineError",
  __ssrInlineRender: true,
  props: {
    message: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      if (__props.message) {
        _push(`<p${ssrRenderAttrs(mergeProps({ class: "flex items-start gap-2 text-xs leading-5 text-rose-700 dark:text-rose-300" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-alert-circle",
          class: "mt-0.5 h-3.5 w-3.5 shrink-0"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(__props.message)}</span></p>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/InlineError.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "DashboardInlineError" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=InlineError-CDgd_EMb.mjs.map
