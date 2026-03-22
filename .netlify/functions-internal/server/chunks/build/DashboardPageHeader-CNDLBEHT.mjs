import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DashboardPageHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 overflow-hidden rounded-[30px] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm sm:p-7 dark:border-white/10 dark:bg-white/6 dark:backdrop-blur-xl" }, _attrs))}><div class="absolute"></div><div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"><div class="min-w-0 flex-1 space-y-1"><p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-600 dark:text-orange-300/90"> Printy Workspace </p><h1 class="text-3xl font-semibold text-[var(--p-text)] sm:text-4xl dark:text-white">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.subtitle) {
        _push(`<p class="max-w-3xl text-sm leading-6 text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<div class="pt-1">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="shrink-0 flex flex-wrap items-center gap-2">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardPageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "DashboardPageHeader" });

export { __nuxt_component_0 as _ };
//# sourceMappingURL=DashboardPageHeader-CNDLBEHT.mjs.map
