import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyStateCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    icon: { default: "i-lucide-sparkles" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-[28px] border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-10 text-center shadow-sm dark:border-white/15 dark:bg-white/5 dark:backdrop-blur-xl" }, _attrs))}><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:border-white/10 dark:bg-white/10">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: "h-7 w-7 text-orange-500 dark:text-orange-300"
      }, null, _parent));
      _push(`</div><h3 class="mt-4 text-lg font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.description) {
        _push(`<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(__props.description)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/EmptyStateCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main, { __name: "DashboardEmptyStateCard" });

export { __nuxt_component_6 as _ };
//# sourceMappingURL=EmptyStateCard-sOlbx_Wq.mjs.map
