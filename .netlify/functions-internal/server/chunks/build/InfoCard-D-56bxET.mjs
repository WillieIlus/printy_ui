import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InfoCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: { default: void 0 },
    icon: { default: "i-lucide-info" },
    tone: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const toneClass = computed(() => {
      const map = {
        default: "border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text)] dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200",
        orange: "border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-100",
        green: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-100",
        flamingo: "border-flamingo-200 bg-flamingo-50 text-flamingo-950 dark:border-flamingo-400/25 dark:bg-flamingo-500/10 dark:text-flamingo-100"
      };
      return map[props.tone] ?? map.default;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["rounded-[24px] border p-4 backdrop-blur-xl", toneClass.value]
      }, _attrs))}><div class="flex items-start gap-3"><div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:border-white/10 dark:bg-white/10">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</div><div class="min-w-0 space-y-1"><p class="text-sm font-semibold text-[var(--p-text)] dark:text-white">${ssrInterpolate(__props.title)}</p>`);
      if (__props.description) {
        _push(`<p class="text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-200/90">${ssrInterpolate(__props.description)}</p>`);
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
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/InfoCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main, { __name: "DashboardInfoCard" });

export { __nuxt_component_11 as _ };
//# sourceMappingURL=InfoCard-D-56bxET.mjs.map
