import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    colSpan: { default: 12 }
  },
  setup(__props) {
    const props = __props;
    const colSpanClass = computed(() => {
      const span = Math.min(12, Math.max(1, props.colSpan));
      const map = {
        1: "lg:col-span-1",
        2: "lg:col-span-2",
        3: "lg:col-span-3",
        4: "lg:col-span-4",
        5: "lg:col-span-5",
        6: "lg:col-span-6",
        7: "lg:col-span-7",
        8: "lg:col-span-8",
        9: "lg:col-span-9",
        10: "lg:col-span-10",
        11: "lg:col-span-11",
        12: "lg:col-span-12"
      };
      return `col-span-12 ${map[span] ?? "lg:col-span-12"}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm", colSpanClass.value]
      }, _attrs))}>`);
      if (__props.title || _ctx.$slots["card-header"]) {
        _push(`<div class="border-b border-[var(--p-border-dim)] px-5 py-4">`);
        ssrRenderSlot(_ctx.$slots, "card-header", {}, () => {
          _push(`<h3 class="text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(__props.title)}</h3>`);
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-5">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SectionCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main, { __name: "DashboardSectionCard" });

export { __nuxt_component_4 as _ };
//# sourceMappingURL=SectionCard-DNtYPNBT.mjs.map
