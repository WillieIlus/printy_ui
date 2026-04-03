import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopStatusBadge",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const statusLabel = computed(() => {
      const labels = {
        opening: "Open",
        closing_soon: "Closing soon",
        closed: "Closed"
      };
      return labels[props.status] ?? props.status;
    });
    const statusIcon = computed(() => {
      const icons = {
        opening: "i-lucide-circle-check",
        closing_soon: "i-lucide-clock",
        closed: "i-lucide-circle-x"
      };
      return icons[props.status] ?? "i-lucide-circle";
    });
    const badgeColor = computed(() => {
      const colors = {
        opening: "success",
        closing_soon: "warning",
        closed: "neutral"
      };
      return colors[props.status] ?? "neutral";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$1;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_UBadge, mergeProps({
        color: unref(badgeColor),
        variant: "soft",
        size: "sm",
        class: "shrink-0"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: unref(statusIcon),
              class: "mr-1 h-3.5 w-3.5"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(statusLabel))}`);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: unref(statusIcon),
                class: "mr-1 h-3.5 w-3.5"
              }, null, 8, ["name"]),
              createTextVNode(" " + toDisplayString(unref(statusLabel)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopStatusBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main, { __name: "ShopsShopStatusBadge" });

export { __nuxt_component_5 as _ };
//# sourceMappingURL=ShopStatusBadge-1GLjQN6D.mjs.map
