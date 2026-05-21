import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseAlert",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    title: { default: "" },
    message: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const variantMap = {
      default: "border-slate-200 bg-white text-slate-700",
      success: "border-green-200 bg-green-50 text-green-700",
      warning: "border-amber-200 bg-amber-50 text-amber-700",
      error: "border-red-200 bg-red-50 text-red-700",
      dark: "border-white/10 bg-[#101828] text-slate-300"
    };
    const classes = computed(() => [
      "flex items-start gap-3 rounded-2xl border px-5 py-4",
      variantMap[props.variant]
    ]);
    const bodyClass = computed(() => props.title ? "mt-1 text-sm" : "text-sm");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(classes),
        role: "alert"
      }, _attrs))}>`);
      if (_ctx.$slots.icon) {
        _push(`<div class="shrink-0">`);
        ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="min-w-0 flex-1">`);
      if (__props.title) {
        _push(`<p class="text-sm font-bold">${ssrInterpolate(__props.title)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass(unref(bodyClass))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(__props.message)}`);
      }, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseAlert.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseAlert = Object.assign(_sfc_main, { __name: "BaseAlert" });

export { BaseAlert as B };
//# sourceMappingURL=BaseAlert-BEu0SLA6.mjs.map
