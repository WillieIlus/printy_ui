import { b as _sfc_main$9 } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoadingButton",
  __ssrInlineRender: true,
  props: {
    type: { default: "button" },
    color: { default: "primary" },
    variant: { default: "solid" },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    icon: { default: void 0 },
    block: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const buttonClass = computed(() => {
      const classes = [props.block ? "w-full justify-center" : ""];
      if (props.color === "primary" && props.variant === "solid") {
        classes.push("bg-flamingo-500 text-white hover:bg-flamingo-400 disabled:bg-flamingo-300");
      }
      return classes.filter(Boolean).join(" ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_UButton, mergeProps({
        type: __props.type,
        color: __props.color,
        variant: __props.variant,
        loading: __props.loading,
        disabled: __props.disabled || __props.loading,
        icon: __props.icon,
        class: unref(buttonClass)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/LoadingButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main, { __name: "DashboardLoadingButton" });

export { __nuxt_component_10 as _ };
//# sourceMappingURL=LoadingButton-DEusGFiB.mjs.map
