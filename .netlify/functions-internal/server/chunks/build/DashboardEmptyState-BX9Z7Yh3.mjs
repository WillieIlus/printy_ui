import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardEmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: { default: "i-lucide-inbox" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-8 py-12 text-center" }, _attrs))}><div class="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: "h-7 w-7 text-[var(--p-text-muted)]"
      }, null, _parent));
      _push(`</div><h3 class="mt-4 text-base font-medium text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.description) {
        _push(`<p class="mt-2 max-w-sm text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<div class="mt-6">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardEmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "DashboardEmptyState" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=DashboardEmptyState-BX9Z7Yh3.mjs.map
