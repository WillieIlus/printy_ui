import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { f as useRoute, c as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as __nuxt_component_2 } from './SectionCard-CE2OEmkZ.mjs';
import { _ as _sfc_main$1 } from './Badge-CGrQBVmm.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as formatDate } from './formatters-C4IR8tCh.mjs';
import { u as useClaimStore } from './claim-DCaNBL7m.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const claimStore = useClaimStore();
    const id = computed(() => Number(route.params.id));
    const statusColor = computed(() => {
      const m = { pending: "warning", approved: "success", rejected: "error" };
      return m[claimStore.currentClaim?.status ?? ""] ?? "neutral";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_DashboardSectionCard = __nuxt_component_2;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Claim #${unref(id)}`
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/claims",
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/claims",
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(claimStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else if (unref(claimStore).currentClaim) {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_DashboardSectionCard, { title: "Claim details" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-2"${_scopeId}><p class="text-sm"${_scopeId}><span class="font-medium text-gray-500 dark:text-gray-400"${_scopeId}>Status:</span>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: unref(statusColor),
                variant: "soft",
                class: "ml-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(claimStore).currentClaim.status)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(claimStore).currentClaim.status), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p>`);
              if (unref(claimStore).currentClaim.shop_details) {
                _push2(`<p class="text-sm"${_scopeId}><span class="font-medium text-gray-500 dark:text-gray-400"${_scopeId}>Shop:</span><span class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(claimStore).currentClaim.shop_details.name)}</span></p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p class="text-sm"${_scopeId}><span class="font-medium text-gray-500 dark:text-gray-400"${_scopeId}>Created:</span><span class="text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(formatDate)(unref(claimStore).currentClaim.created_at))}</span></p></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("p", { class: "text-sm" }, [
                    createVNode("span", { class: "font-medium text-gray-500 dark:text-gray-400" }, "Status:"),
                    createVNode(_component_UBadge, {
                      color: unref(statusColor),
                      variant: "soft",
                      class: "ml-1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(claimStore).currentClaim.status), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  unref(claimStore).currentClaim.shop_details ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm"
                  }, [
                    createVNode("span", { class: "font-medium text-gray-500 dark:text-gray-400" }, "Shop:"),
                    createVNode("span", { class: "text-gray-900 dark:text-white" }, toDisplayString(unref(claimStore).currentClaim.shop_details.name), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("p", { class: "text-sm" }, [
                    createVNode("span", { class: "font-medium text-gray-500 dark:text-gray-400" }, "Created:"),
                    createVNode("span", { class: "text-gray-900 dark:text-white" }, toDisplayString(unref(formatDate)(unref(claimStore).currentClaim.created_at)), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/claims/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BXTVtkJw.mjs.map
