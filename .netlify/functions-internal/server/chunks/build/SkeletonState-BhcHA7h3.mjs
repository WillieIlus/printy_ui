import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SkeletonState",
  __ssrInlineRender: true,
  props: {
    variant: { default: "block" },
    rows: { default: 5 },
    cardCount: { default: 6 },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const wrapperClass = computed(() => props.class ?? "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["animate-pulse space-y-4", wrapperClass.value]
      }, _attrs))}>`);
      if (__props.variant === "kpi") {
        _push(`<div class="grid grid-cols-2 gap-4 lg:grid-cols-4"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="rounded-xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-800/50"><div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div><div class="mt-3 h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div><div class="mt-2 h-4 w-24 rounded bg-gray-100 dark:bg-gray-700/80"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (__props.variant === "table") {
        _push(`<div class="rounded-xl border border-gray-200/80 bg-white overflow-hidden dark:border-gray-700/60 dark:bg-gray-800/50"><div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700/60"><div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div></div><div class="p-5 space-y-3"><!--[-->`);
        ssrRenderList(__props.rows, (i) => {
          _push(`<div class="flex gap-4"><div class="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div><div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else if (__props.variant === "cards") {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(__props.cardCount, (i) => {
          _push(`<div class="rounded-xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-800/50"><div class="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div><div class="mt-3 h-4 w-full rounded bg-gray-100 dark:bg-gray-700/80"></div><div class="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700/80"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-xl border border-gray-200/80 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-800/50"><div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700"></div><div class="mt-4 space-y-2"><div class="h-4 w-full rounded bg-gray-100 dark:bg-gray-700/80"></div><div class="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-700/80"></div><div class="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-700/80"></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SkeletonState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "DashboardSkeletonState" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=SkeletonState-BhcHA7h3.mjs.map
