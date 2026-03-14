import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { f as useRoute, c as _sfc_main$9, h as _sfc_main$c } from './server.mjs';
import { _ as __nuxt_component_3$1 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$2 } from './Card-DKHttVBV.mjs';
import { _ as _sfc_main$3 } from './Badge-CGrQBVmm.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
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
import './api-error-D1IYk86E.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ShopMembers",
  __ssrInlineRender: true,
  props: {
    members: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$2;
      const _component_UAvatar = _sfc_main$c;
      const _component_UBadge = _sfc_main$3;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-gray-900 dark:text-white"${_scopeId}>Team members</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-gray-900 dark:text-white" }, "Team members")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.members?.length) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.members, (m) => {
                _push2(`<div class="flex items-center justify-between rounded-lg border dark:border-gray-700 p-3"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UAvatar, { size: "sm" }, null, _parent2, _scopeId));
                _push2(`<div${_scopeId}><p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(m.user_details?.first_name ?? `User #${m.user}`)}</p>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  size: "sm",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(m.role)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(m.role), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
                ssrRenderSlot(_ctx.$slots, "actions", { member: m }, null, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>No members yet.</p>`);
            }
          } else {
            return [
              __props.members?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.members, (m) => {
                  return openBlock(), createBlock("div", {
                    key: m.id,
                    class: "flex items-center justify-between rounded-lg border dark:border-gray-700 p-3"
                  }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode(_component_UAvatar, { size: "sm" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "font-medium text-gray-900 dark:text-white" }, toDisplayString(m.user_details?.first_name ?? `User #${m.user}`), 1),
                        createVNode(_component_UBadge, {
                          size: "sm",
                          variant: "soft"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(m.role), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ])
                    ]),
                    renderSlot(_ctx.$slots, "actions", { member: m })
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-gray-500 dark:text-gray-400"
              }, "No members yet."))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopMembers.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "ShopsShopMembers" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "members",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore();
    const slug = computed(() => route.params.slug);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_3$1;
      const _component_ShopsShopMembers = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Team members",
        subtitle: unref(slug)
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
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
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_ShopsShopMembers, {
          members: unref(shopStore).shopMembers
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/members.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=members-Brt6pdhJ.mjs.map
