import { defineComponent, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BadgeCount",
  __ssrInlineRender: true,
  props: {
    count: { default: 0 }
  },
  setup(__props) {
    const props = __props;
    const normalizedCount = computed(() => {
      const value = Number(props.count ?? 0);
      return Number.isFinite(value) && value > 0 ? value : 0;
    });
    const label = computed(() => normalizedCount.value > 99 ? "99+" : String(normalizedCount.value));
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(normalizedCount) > 0) {
        _push(`<span${ssrRenderAttrs(mergeProps({ class: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold leading-none text-white" }, _attrs))}>${ssrInterpolate(unref(label))}</span>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/common/BadgeCount.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CommonBadgeCount = Object.assign(_sfc_main, { __name: "CommonBadgeCount" });

export { CommonBadgeCount as C };
//# sourceMappingURL=BadgeCount-DgWpIN1w.mjs.map
