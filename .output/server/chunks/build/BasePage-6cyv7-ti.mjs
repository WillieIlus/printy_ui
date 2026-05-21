import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BasePage",
  __ssrInlineRender: true,
  props: {
    variant: { default: "light" },
    constrained: { type: Boolean, default: false },
    bleed: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const pageClass = computed(() => ({
      public: "bg-[var(--p-bg)] text-[var(--p-text)]",
      auth: "bg-[#f2f4f7] text-[#101828]",
      dashboard: "bg-slate-50 text-slate-800",
      workspace: "bg-[#f8f9fc] text-slate-800",
      dark: "bg-[#101828] text-white",
      light: "bg-white text-[#101828]"
    })[props.variant]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-screen font-sans antialiased", unref(pageClass)]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BasePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BasePage = Object.assign(_sfc_main, { __name: "BasePage" });

export { BasePage as B };
//# sourceMappingURL=BasePage-6cyv7-ti.mjs.map
