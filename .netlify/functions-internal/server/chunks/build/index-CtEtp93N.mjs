import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { _ as __nuxt_component_2$1, a as _sfc_main$f, c as _sfc_main$9 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, computed, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { u as useSetupStatus } from './useSetupStatus-BIk8Yxnd.mjs';
import { _ as __nuxt_component_2 } from './LoadingSpinner-DUXHKoma.mjs';
import { _ as __nuxt_component_1$1 } from './DashboardEmptyState-B5OOUSjB.mjs';
import { u as useSellerStore } from './seller-BozDQWbD.mjs';
import { u as useAuth } from './useAuth-CuIEby6D.mjs';
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
import './seller-laoC9_qJ.mjs';
import './api-error-D1IYk86E.mjs';
import './profile-CEiUsRUc.mjs';
import './shop-0Cyw6rqQ.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SetupChecklistCard",
  __ssrInlineRender: true,
  setup(__props) {
    const { status, isSetupComplete, nextRoute, STEP_ROUTES } = useSetupStatus();
    const steps = computed(() => {
      const s = status.value;
      if (!s) return [];
      const next = s.next_step;
      return [
        { key: "shop", label: "1. Create your shop", done: s.has_shop, current: next === "shop", route: STEP_ROUTES.shop },
        { key: "papers", label: "2. Add paper stock", done: s.has_papers, current: next === "papers" || next === "machines", route: STEP_ROUTES.papers },
        { key: "pricing", label: "3. Set up pricing", done: s.has_pricing, current: next === "pricing", route: STEP_ROUTES.pricing },
        { key: "products", label: "4. Publish a product", done: s.has_published_products, current: next === "products", route: STEP_ROUTES.products }
      ];
    });
    const totalCount = computed(() => steps.value.length);
    const completedCount = computed(() => steps.value.filter((s) => s.done).length);
    const progressPercent = computed(() => totalCount.value ? completedCount.value / totalCount.value * 100 : 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_NuxtLink = __nuxt_component_2$1;
      const _component_UButton = _sfc_main$9;
      if (unref(status) && !unref(isSetupComplete)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm" }, _attrs))}><div class="flex items-center gap-3 mb-4"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-list-checks",
          class: "h-5 w-5 text-amber-600 dark:text-amber-400"
        }, null, _parent));
        _push(`</div><div><h3 class="font-semibold text-[var(--p-text)]">Setup Checklist</h3><p class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(unref(completedCount))}/${ssrInterpolate(unref(totalCount))} completed</p></div></div><div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden"><div class="h-full rounded-full bg-flamingo-500 transition-all duration-500" style="${ssrRenderStyle({ width: `${unref(progressPercent)}%` })}"></div></div><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(steps), (step) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: step.key,
            to: step.route,
            class: ["flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", step.done ? "text-green-600 dark:text-green-400" : step.current ? "bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 font-medium" : "text-[var(--p-text-muted)]"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: step.done ? "i-lucide-check-circle" : step.current ? "i-lucide-circle-dot" : "i-lucide-circle",
                  class: "h-5 w-5 shrink-0"
                }, null, _parent2, _scopeId));
                _push2(`<span class="flex-1"${_scopeId}>${ssrInterpolate(step.label)}</span>`);
                if (step.current) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 shrink-0"
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: step.done ? "i-lucide-check-circle" : step.current ? "i-lucide-circle-dot" : "i-lucide-circle",
                    class: "h-5 w-5 shrink-0"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "flex-1" }, toDisplayString(step.label), 1),
                  step.current ? (openBlock(), createBlock(_component_UIcon, {
                    key: 0,
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 shrink-0"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (!unref(isSetupComplete)) {
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            class: "mt-4 w-full",
            to: unref(nextRoute)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(status).next_step === "done" ? "View Dashboard" : "Continue Setup")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(status).next_step === "done" ? "View Dashboard" : "Continue Setup"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/SetupChecklistCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "DashboardSetupChecklistCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const sellerStore = useSellerStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_DashboardSetupChecklistCard = __nuxt_component_1;
      const _component_CommonLoadingSpinner = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_2$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardEmptyState = __nuxt_component_1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Welcome back, ${unref(user)?.first_name ?? "User"}!`,
        subtitle: "Select a shop to manage pricing and products."
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardSetupChecklistCard, null, null, _parent));
      if (unref(sellerStore).loading) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(sellerStore).shops.length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(sellerStore).shops, (shop) => {
          _push(`<div class="group relative flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/50 dark:hover:bg-flamingo-900/20">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${shop.slug}/setup`,
            class: "flex min-w-0 flex-1 items-center gap-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-store",
                  class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(shop.name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>/${ssrInterpolate(shop.slug)}</p></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-5 w-5 text-gray-400 shrink-0"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-store",
                      class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
                    })
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white truncate" }, toDisplayString(shop.name), 1),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "/" + toDisplayString(shop.slug), 1)
                  ]),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "h-5 w-5 text-gray-400 shrink-0"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            icon: "i-lucide-pencil",
            "aria-label": "Edit shop",
            class: "shrink-0 opacity-70 group-hover:opacity-100",
            to: `/dashboard/shops?edit=${encodeURIComponent(shop.slug)}`
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No shops yet",
          description: "Create your first shop to start receiving quotes and customers.",
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
                    _push3(`Create Your First Shop`);
                  } else {
                    return [
                      createTextVNode("Create Your First Shop")
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
                    createTextVNode("Create Your First Shop")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CtEtp93N.mjs.map
