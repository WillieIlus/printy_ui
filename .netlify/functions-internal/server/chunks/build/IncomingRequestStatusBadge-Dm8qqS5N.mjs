import { _ as _sfc_main$1 } from './Badge-BGajth1Y.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "IncomingRequestStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const statusMap = {
      submitted: { label: "New", color: "primary" },
      viewed: { label: "Viewed", color: "neutral" },
      quoted: { label: "Quoted", color: "warning" },
      accepted: { label: "Accepted", color: "success" },
      closed: { label: "Closed", color: "neutral" },
      cancelled: { label: "Closed", color: "error" },
      draft: { label: "Draft", color: "neutral" }
    };
    const label = computed(() => statusMap[props.status]?.label ?? props.status);
    const color = computed(() => statusMap[props.status]?.color ?? "neutral");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$1;
      _push(ssrRenderComponent(_component_UBadge, mergeProps({
        color: unref(color),
        variant: "soft",
        size: "sm"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(label))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(label)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/incoming/IncomingRequestStatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "IncomingRequestStatusBadge" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=IncomingRequestStatusBadge-Dm8qqS5N.mjs.map
