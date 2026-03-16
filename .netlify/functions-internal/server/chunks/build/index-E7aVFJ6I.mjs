import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { e as useRoute, a as _sfc_main$f, c as _sfc_main$9, _ as __nuxt_component_3$1, d as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './Badge-BGajth1Y.mjs';
import { u as useShopStore } from './shop-D6P1awrr.mjs';
import { u as useQuoteStore } from './quote-BLFx3HhE.mjs';
import { u as useMachineStore } from './machine-DJGepYrp.mjs';
import { u as usePricingStore } from './pricing-DdU3x9mw.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DashboardShopHeader",
  __ssrInlineRender: true,
  props: {
    shopName: {},
    shopSlug: {}
  },
  setup(__props) {
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    const props = __props;
    const publicUrl = computed(
      () => props.shopSlug ? `/shops/${props.shopSlug}` : null
    );
    const publicUrlDisplay = computed(
      () => props.shopSlug ? `${siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}/shops/${props.shopSlug}` : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6" }, _attrs))}><div class="min-w-0 flex-1 space-y-1"><h1 class="text-2xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.shopName)}</h1><p class="text-sm text-[var(--p-text-muted)]"> Manage incoming requests, pricing, and print jobs. No more manual calculations or back-and-forth. </p>`);
      if (unref(publicUrl)) {
        _push(`<div class="pt-2 flex flex-wrap items-center gap-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(publicUrl),
          target: "_blank",
          class: "inline-flex items-center gap-1.5 text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-external-link",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` View public shop page `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-external-link",
                  class: "w-4 h-4"
                }),
                createTextVNode(" View public shop page ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="text-[var(--p-text-muted)]">·</span><span class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(publicUrlDisplay))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.default) {
        _push(`<div class="pt-1">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="shrink-0 flex flex-wrap items-center gap-2">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardShopHeader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "DashboardShopHeader" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "StatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    icon: { default: "i-lucide-bar-chart-2" },
    delta: {},
    variant: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const iconBgClass = computed(() => {
      const map = {
        default: "bg-gray-100 dark:bg-gray-700/50",
        flamingo: "bg-flamingo-50 dark:bg-flamingo-900/20",
        green: "bg-green-50 dark:bg-green-900/20",
        blue: "bg-blue-50 dark:bg-blue-900/20",
        purple: "bg-purple-50 dark:bg-purple-900/20",
        orange: "bg-orange-50 dark:bg-orange-900/20"
      };
      return map[props.variant] ?? map.default;
    });
    const iconColorClass = computed(() => {
      const map = {
        default: "text-gray-600 dark:text-gray-400",
        flamingo: "text-flamingo-600 dark:text-flamingo-400",
        green: "text-green-600 dark:text-green-400",
        blue: "text-blue-600 dark:text-blue-400",
        purple: "text-purple-600 dark:text-purple-400",
        orange: "text-orange-600 dark:text-orange-400"
      };
      return map[props.variant] ?? map.default;
    });
    const deltaClass = computed(() => {
      if (props.delta === void 0 || props.delta === null) return "";
      if (props.delta > 0) return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      if (props.delta < 0) return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group relative overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition-all hover:shadow-md" }, _attrs))}><div class="flex items-start justify-between"><div class="${ssrRenderClass([iconBgClass.value, "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"])}">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: __props.icon,
        class: ["h-5 w-5", iconColorClass.value]
      }, null, _parent));
      _push(`</div>`);
      if (__props.delta !== void 0 && __props.delta !== null) {
        _push(`<span class="${ssrRenderClass([deltaClass.value, "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"])}">`);
        if (__props.delta > 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-up",
            class: "h-3 w-3"
          }, null, _parent));
        } else if (__props.delta < 0) {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-trending-down",
            class: "h-3 w-3"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(` ${ssrInterpolate(__props.delta > 0 ? "+" : "")}${ssrInterpolate(__props.delta)}% </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.value)}</p><p class="mt-0.5 text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(__props.label)}</p></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/StatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "DashboardStatCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore();
    const quoteStore = useQuoteStore();
    const machineStore = useMachineStore();
    const pricingStore = usePricingStore();
    const slug = computed(() => route.params.slug);
    const shop = computed(() => shopStore.currentShop);
    const todayStart = computed(() => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.toISOString().slice(0, 10);
    });
    const quotesToday = computed(() => {
      return quoteStore.quotes.filter((q) => {
        const created = q.created_at?.slice(0, 10);
        return created === todayStart.value;
      }).length;
    });
    const pendingQuotes = computed(() => {
      return quoteStore.quotes.filter((q) => {
        const s = (q.status ?? "").toLowerCase();
        return s === "draft" || s === "pending" || s === "submitted" || s === "priced" || s === "sent";
      }).length;
    });
    const estimatedRevenue = computed(() => {
      const total = quoteStore.quotes.reduce((sum, q) => {
        const s = (q.status ?? "").toLowerCase();
        if (s === "approved" || s === "completed" || s === "accepted") {
          const t = parseFloat(q.total ?? "0");
          return sum + (Number.isNaN(t) ? 0 : t);
        }
        return sum;
      }, 0);
      return total > 0 ? `KES ${Math.round(total).toLocaleString()}` : "KES 0";
    });
    const mostQuotedProduct = computed(() => {
      const counts = {};
      for (const q of quoteStore.quotes) {
        const items = q.items ?? [];
        for (const item of items) {
          const i = item;
          const name2 = (i.name ?? i.product_name ?? "Custom").trim() || "Custom";
          counts[name2] = (counts[name2] ?? 0) + 1;
        }
      }
      const entries = Object.entries(counts);
      if (entries.length === 0) return "—";
      const [top] = entries.sort((a, b) => b[1] - a[1]);
      const name = top?.[0] ?? "—";
      return name.length > 20 ? `${name.slice(0, 17)}…` : name;
    });
    const hasMachines = computed(() => machineStore.machines.length > 0);
    const machineCount = computed(() => machineStore.machines.length);
    const hasPricing = computed(
      () => pricingStore.paperPrices.length > 0 || pricingStore.printingPrices.length > 0 || pricingStore.materialPrices.length > 0 || pricingStore.finishingServices.length > 0
    );
    const setupProgress = computed(() => {
      let n = 0;
      if (hasMachines.value) n++;
      if (hasPricing.value) n++;
      return n;
    });
    const navItems = computed(() => [
      {
        to: `/dashboard/shops/${slug.value}/machines`,
        label: "Machines",
        desc: "Printers & equipment",
        icon: "i-lucide-printer",
        bgClass: "bg-flamingo-50 dark:bg-flamingo-900/20",
        iconClass: "text-flamingo-600 dark:text-flamingo-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/pricing`,
        label: "Stock & prices",
        desc: "Paper, printing, finishing",
        icon: "i-lucide-banknote",
        bgClass: "bg-amber-50 dark:bg-amber-900/20",
        iconClass: "text-amber-600 dark:text-amber-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/products`,
        label: "Products",
        desc: "Product templates",
        icon: "i-lucide-package",
        bgClass: "bg-green-50 dark:bg-green-900/20",
        iconClass: "text-green-600 dark:text-green-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/incoming-requests`,
        label: "Incoming Requests",
        desc: "Quote requests from customers",
        icon: "i-lucide-file-text",
        bgClass: "bg-blue-50 dark:bg-blue-900/20",
        iconClass: "text-blue-600 dark:text-blue-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/sent-quotes`,
        label: "Sent Quotes",
        desc: "Quotes you've sent to customers",
        icon: "i-lucide-send",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
        iconClass: "text-emerald-600 dark:text-emerald-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/members`,
        label: "Team",
        desc: "Manage members",
        icon: "i-lucide-users",
        bgClass: "bg-purple-50 dark:bg-purple-900/20",
        iconClass: "text-purple-600 dark:text-purple-400"
      },
      {
        to: `/dashboard/shops/${slug.value}/hours`,
        label: "Hours",
        desc: "Business hours",
        icon: "i-lucide-clock",
        bgClass: "bg-orange-50 dark:bg-orange-900/20",
        iconClass: "text-orange-600 dark:text-orange-400"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_DashboardShopHeader = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_DashboardStatCard = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      if (unref(shopStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else if (unref(shop)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_DashboardShopHeader, {
          "shop-name": unref(shop).name,
          "shop-slug": unref(slug)
        }, {
          actions: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/edit`,
                variant: "outline",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-edit",
                      class: "w-4 h-4 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Edit `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-edit",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Edit ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes/create`,
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(` Send Quote `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "w-4 h-4 mr-2"
                      }),
                      createTextVNode(" Send Quote ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/edit`,
                  variant: "outline",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-edit",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Edit ")
                  ]),
                  _: 1
                }, 8, ["to"]),
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/quotes/create`,
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Send Quote ")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(shop).is_verified) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "success",
                  variant: "soft",
                  class: "mt-2"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-check-circle",
                        class: "w-3 h-3 mr-1"
                      }, null, _parent3, _scopeId2));
                      _push3(` Verified `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-check-circle",
                          class: "w-3 h-3 mr-1"
                        }),
                        createTextVNode(" Verified ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(shop).is_verified ? (openBlock(), createBlock(_component_UBadge, {
                  key: 0,
                  color: "success",
                  variant: "soft",
                  class: "mt-2"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-check-circle",
                      class: "w-3 h-3 mr-1"
                    }),
                    createTextVNode(" Verified ")
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(setupProgress) < 3) {
          _push(`<div class="col-span-12 rounded-xl border border-flamingo-200/80 bg-flamingo-50/50 p-4 dark:border-flamingo-800/60 dark:bg-flamingo-900/10"><h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Setup your shop</h3><p class="text-sm text-gray-600 dark:text-gray-400 mb-4"> Add machines first, then paper stock and prices to start quoting. </p><div class="flex flex-wrap gap-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/machines`,
            class: ["flex items-center gap-2 text-sm font-medium", unref(hasMachines) ? "text-green-600 dark:text-green-400" : "text-flamingo-600 dark:text-flamingo-400 hover:underline"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: unref(hasMachines) ? "i-lucide-check-circle" : "i-lucide-printer",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(` 1. Machines ${ssrInterpolate(unref(hasMachines) ? `(${unref(machineCount)})` : "")}`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: unref(hasMachines) ? "i-lucide-check-circle" : "i-lucide-printer",
                    class: "w-4 h-4"
                  }, null, 8, ["name"]),
                  createTextVNode(" 1. Machines " + toDisplayString(unref(hasMachines) ? `(${unref(machineCount)})` : ""), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/pricing`,
            class: ["flex items-center gap-2 text-sm font-medium", unref(hasPricing) ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: unref(hasPricing) ? "i-lucide-check-circle" : "i-lucide-banknote",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(` 2. Stock &amp; prices `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: unref(hasPricing) ? "i-lucide-check-circle" : "i-lucide-banknote",
                    class: "w-4 h-4"
                  }, null, 8, ["name"]),
                  createTextVNode(" 2. Stock & prices ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/products`,
            class: "flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-package",
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(` 3. Products (optional) `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-package",
                    class: "w-4 h-4"
                  }),
                  createTextVNode(" 3. Products (optional) ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6"><!--[-->`);
        ssrRenderList(unref(navItems), (nav) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: nav.to,
            to: nav.to,
            class: "flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 transition-all hover:border-flamingo-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/50 dark:hover:border-flamingo-700/60"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([nav.bgClass, "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"])}"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: nav.icon,
                  class: ["h-5 w-5", nav.iconClass]
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}><p class="text-sm font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(nav.label)}</p><p class="text-xs text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(nav.desc)}</p></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", nav.bgClass]
                  }, [
                    createVNode(_component_UIcon, {
                      name: nav.icon,
                      class: ["h-5 w-5", nav.iconClass]
                    }, null, 8, ["name", "class"])
                  ], 2),
                  createVNode("div", null, [
                    createVNode("p", { class: "text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(nav.label), 1),
                    createVNode("p", { class: "text-xs text-gray-500 dark:text-gray-400" }, toDisplayString(nav.desc), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div><div class="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">`);
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Requests today",
          value: unref(quotesToday),
          icon: "i-lucide-file-text",
          variant: "flamingo"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Pending jobs",
          value: unref(pendingQuotes),
          icon: "i-lucide-clock",
          variant: "blue"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Est. revenue",
          value: unref(estimatedRevenue),
          icon: "i-lucide-trending-up",
          variant: "green"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Most quoted",
          value: unref(mostQuotedProduct),
          icon: "i-lucide-package",
          variant: "orange"
        }, null, _parent));
        _push(ssrRenderComponent(_component_DashboardStatCard, {
          label: "Team members",
          value: unref(shop).member_count ?? unref(shop).members?.length ?? 0,
          icon: "i-lucide-users",
          variant: "purple"
        }, null, _parent));
        _push(`</div><!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-E7aVFJ6I.mjs.map
