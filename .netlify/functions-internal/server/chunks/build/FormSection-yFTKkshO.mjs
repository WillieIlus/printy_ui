import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-[28px] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/6 dark:backdrop-blur-xl" }, _attrs))}>`);
      if (__props.title || __props.description || _ctx.$slots.header) {
        _push(`<div class="mb-5 flex items-start justify-between gap-4">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, () => {
          _push(`<div class="space-y-1">`);
          if (__props.title) {
            _push(`<h2 class="text-lg font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(__props.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          if (__props.description) {
            _push(`<p class="max-w-2xl text-sm text-[var(--p-text-muted)] dark:text-slate-300">${ssrInterpolate(__props.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }, _push, _parent);
        if (_ctx.$slots.actions) {
          _push(`<div class="shrink-0">`);
          ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/FormSection.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "DashboardFormSection" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=FormSection-yFTKkshO.mjs.map
