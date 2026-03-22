import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    icon: { default: "i-lucide-bar-chart-2" },
    delta: {},
    variant: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const iconBgClass = computed(() => {
      const map = {
        default: "bg-gray-100 dark:bg-gray-700/50",
        flamingo: "bg-flamingo-50 dark:bg-flamingo-900/20",
        green: "bg-green-50 dark:bg-green-900/20",
        blue: "bg-blue-50 dark:bg-blue-900/20",
        purple: "bg-purple-50 dark:bg-purple-900/20",
        orange: "bg-orange-50 dark:bg-orange-900/20"
      };
      return map[props.variant] ?? map.default;
    });
    const iconColorClass = computed(() => {
      const map = {
        default: "text-gray-600 dark:text-gray-400",
        flamingo: "text-flamingo-600 dark:text-flamingo-400",
        green: "text-green-600 dark:text-green-400",
        blue: "text-blue-600 dark:text-blue-400",
        purple: "text-purple-600 dark:text-purple-400",
        orange: "text-orange-600 dark:text-orange-400"
      };
      return map[props.variant] ?? map.default;
    });
    const deltaClass = computed(() => {
      if (props.delta === void 0 || props.delta === null) return "";
      if (props.delta > 0) return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      if (props.delta < 0) return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition-all hover:shadow-md" }, _attrs))}><div class="flex items-start justify-between"><div class="${ssrRenderClass([iconBgClass.value, "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"])}">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: ["h-5 w-5", iconColorClass.value]
      }, null, _parent));
      _push(`</div>`);
      if (__props.delta !== void 0 && __props.delta !== null) {
        _push(`<span class="${ssrRenderClass([deltaClass.value, "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"])}">`);
        if (__props.delta > 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-up",
            class: "h-3 w-3"
          }, null, _parent));
        } else if (__props.delta < 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-down",
            class: "h-3 w-3"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(__props.delta > 0 ? "+" : "")}${ssrInterpolate(__props.delta)}% </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.value)}</p><p class="mt-0.5 text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(__props.label)}</p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/StatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "DashboardStatCard" });
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-[28px] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center backdrop-blur-xl" }, _attrs))}><div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: "h-7 w-7 text-orange-300"
      }, null, _parent));
      _push(`</div><h3 class="mt-4 text-lg font-semibold text-white">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.description) {
        _push(`<p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">${ssrInterpolate(__props.description)}</p>`);
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
const __nuxt_component_7 = Object.assign(_sfc_main, { __name: "DashboardEmptyStateCard" });

export { __nuxt_component_4 as _, __nuxt_component_7 as a };
//# sourceMappingURL=EmptyStateCard-BgXxuhOj.mjs.map
