import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { d as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-B_HIq8FR.mjs';
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
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-B7IxAeLp.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "My Shops",
        subtitle: "Open a shop workspace from here. Editing now happens on the shop profile page instead of a modal."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/shops/create",
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add Shop `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Shop ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/shops/create",
                color: "primary"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add Shop ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(sellerStore).loading || !unref(sellerStore).loaded) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 4
        }, null, _parent));
      } else if (unref(sellerStore).shops.length) {
        _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(sellerStore).shops, (shop) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><div class="flex items-start gap-3"><span class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-5 w-5"
          }, null, _parent));
          _push(`</span><div class="min-w-0 flex-1"><p class="truncate text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(shop.name)}</p><p class="mt-1 truncate text-sm text-[var(--p-text-muted)]">/${ssrInterpolate(shop.slug)}</p></div></div><div class="mt-5 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            to: `/dashboard/shops/${shop.slug}`,
            color: "primary",
            variant: "soft"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open Workspace`);
              } else {
                return [
                  createTextVNode("Open Workspace")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            to: `/dashboard/shops/${shop.slug}/edit`,
            variant: "soft"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Shop Profile`);
              } else {
                return [
                  createTextVNode("Shop Profile")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No shops yet",
          description: "Create your first shop to unlock the admin workspace.",
          icon: "i-lucide-store"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/dashboard/shops/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Create Shop`);
                  } else {
                    return [
                      createTextVNode("Create Shop")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: "/dashboard/shops/create",
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Create Shop")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DndGNLpw.mjs.map
