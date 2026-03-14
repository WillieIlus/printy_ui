import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$2 } from './Card-DKHttVBV.mjs';
import { _ as _sfc_main$3 } from './Badge-CGrQBVmm.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, computed, toDisplayString, openBlock, createBlock, createCommentVNode, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { c as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_1 } from './DashboardEmptyState-B5OOUSjB.mjs';
import { u as useClaimStore } from './claim-DCaNBL7m.mjs';
import 'reka-ui';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ClaimCard",
  __ssrInlineRender: true,
  props: {
    claim: {}
  },
  setup(__props) {
    const props = __props;
    const statusColor = computed(() => {
      const m = { pending: "warning", approved: "success", rejected: "error" };
      return m[props.claim.status] ?? "neutral";
    });
    function formatDate(s) {
      return new Date(s).toLocaleDateString();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      const _component_UBadge = _sfc_main$3;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "hover:shadow-lg transition-shadow" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>Claim #${ssrInterpolate(__props.claim.id)}</h3>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(statusColor),
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.claim.status)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.claim.status), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.claim.shop_details) {
              _push2(`<p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(__props.claim.shop_details.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(formatDate(__props.claim.created_at))}</p>`);
            ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("div", { class: "flex justify-between items-start" }, [
                  createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, "Claim #" + toDisplayString(__props.claim.id), 1),
                  createVNode(_component_UBadge, {
                    color: unref(statusColor),
                    variant: "soft",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.claim.status), 1)
                    ]),
                    _: 1
                  }, 8, ["color"])
                ]),
                __props.claim.shop_details ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-gray-600 dark:text-gray-400"
                }, toDisplayString(__props.claim.shop_details.name), 1)) : createCommentVNode("", true),
                createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, toDisplayString(formatDate(__props.claim.created_at)), 1),
                renderSlot(_ctx.$slots, "actions")
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/claims/ClaimCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "ClaimsClaimCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const claimStore = useClaimStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_ClaimsClaimCard = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardEmptyState = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Claims",
        subtitle: "Manage shop ownership claims"
      }, null, _parent));
      if (unref(claimStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 6
        }, null, _parent));
      } else if (unref(claimStore).claims.length) {
        _push(`<div class="col-span-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"><!--[-->`);
        ssrRenderList(unref(claimStore).claims, (c) => {
          _push(ssrRenderComponent(_component_ClaimsClaimCard, {
            key: c.id,
            claim: c
          }, {
            actions: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  to: `/dashboard/claims/${c.id}`,
                  variant: "outline",
                  size: "sm"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`View`);
                    } else {
                      return [
                        createTextVNode("View")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    to: `/dashboard/claims/${c.id}`,
                    variant: "outline",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("View")
                    ]),
                    _: 1
                  }, 8, ["to"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No claims yet",
          description: "Shop ownership claims will appear here.",
          icon: "i-lucide-shield-check"
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/claims/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-109WWUJv.mjs.map
