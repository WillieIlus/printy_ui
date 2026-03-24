import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { g as useRoute, d as _sfc_main$9, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as _sfc_main$1 } from './Badge-xP9ZTQag.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useMachineStore } from './machine-fWdswZHZ.mjs';
import { u as usePricingStore } from './pricing-BwHzPGP8.mjs';
import { u as useShopStore } from './shop-DxJ2bD36.mjs';
import { u as useIncomingRequests, a as useSentQuotes } from './useIncomingRequests-Bi-EeZU9.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore();
    const machineStore = useMachineStore();
    const pricingStore = usePricingStore();
    const slug = computed(() => route.params.slug);
    const shop = computed(() => shopStore.currentShop);
    useIncomingRequests(slug);
    useSentQuotes();
    const incomingRequests = ref([]);
    const sentQuotesList = ref([]);
    const pendingQuotes = computed(
      () => incomingRequests.value.filter((request) => ["submitted", "viewed"].includes((request.status ?? "").toLowerCase())).length
    );
    const acceptedQuotes = computed(
      () => sentQuotesList.value.filter((quote) => (quote.status ?? "").toLowerCase() === "accepted").length
    );
    const estimatedRevenue = computed(() => {
      const total = sentQuotesList.value.filter((quote) => (quote.status ?? "").toLowerCase() === "accepted").reduce((sum, quote) => sum + (parseFloat(String(quote.total ?? 0)) || 0), 0);
      return `KES ${Math.round(total).toLocaleString()}`;
    });
    const hasPricing = computed(
      () => pricingStore.printingPrices.length > 0 || pricingStore.paperPrices.length > 0 || pricingStore.materialPrices.length > 0 || pricingStore.finishingServices.length > 0
    );
    const metrics = computed(() => [
      {
        label: "Machines",
        value: machineStore.machines.length,
        note: machineStore.machines.length ? "Equipment registered for this shop." : "No machines yet."
      },
      {
        label: "Pricing",
        value: hasPricing.value ? "Ready" : "Missing",
        note: "Printing, materials, and pricing rules."
      },
      {
        label: "Incoming Requests",
        value: pendingQuotes.value,
        note: "Requests waiting on a response."
      },
      {
        label: "Accepted Value",
        value: estimatedRevenue.value,
        note: acceptedQuotes.value ? "Accepted quote value so far." : "No accepted quote value yet."
      }
    ]);
    const setupItems = computed(() => [
      {
        label: "Shop Profile",
        description: "Business details and location.",
        done: Boolean(shop.value),
        to: `/dashboard/shops/${slug.value}/edit`,
        icon: "i-lucide-store"
      },
      {
        label: "Machines",
        description: "Equipment and capacity.",
        done: machineStore.machines.length > 0,
        to: `/dashboard/shops/${slug.value}/machines`,
        icon: "i-lucide-printer"
      },
      {
        label: "Paper Stock",
        description: "Paper lines used in quoting.",
        done: pricingStore.paperPrices.length > 0,
        to: `/dashboard/shops/${slug.value}/papers`,
        icon: "i-lucide-file-stack"
      },
      {
        label: "Pricing",
        description: "Printing, materials, and discounts.",
        done: hasPricing.value,
        to: `/dashboard/shops/${slug.value}/pricing`,
        icon: "i-lucide-banknote"
      },
      {
        label: "Products",
        description: "Catalog and publish status.",
        done: false,
        to: `/dashboard/shops/${slug.value}/products`,
        icon: "i-lucide-package"
      }
    ]);
    const sectionLinks = computed(() => [
      {
        label: "Incoming Requests",
        description: "Review submitted and viewed customer requests.",
        to: `/dashboard/shops/${slug.value}/incoming-requests`,
        icon: "i-lucide-inbox"
      },
      {
        label: "Sent Quotes",
        description: "Track quotes already sent to customers.",
        to: `/dashboard/shops/${slug.value}/sent-quotes`,
        icon: "i-lucide-send"
      },
      {
        label: "Products",
        description: "Manage catalog items and publish readiness.",
        to: `/dashboard/shops/${slug.value}/products`,
        icon: "i-lucide-package"
      },
      {
        label: "Paper Stock",
        description: "Manage paper inventory and stock lines.",
        to: `/dashboard/shops/${slug.value}/papers`,
        icon: "i-lucide-file-stack"
      },
      {
        label: "Finishings",
        description: "Manage lamination, binding, and cutting services.",
        to: `/dashboard/shops/${slug.value}/finishing`,
        icon: "i-lucide-scissors"
      },
      {
        label: "Pricing",
        description: "Manage printing rates, materials, and discounts.",
        to: `/dashboard/shops/${slug.value}/pricing`,
        icon: "i-lucide-banknote"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(shop)?.name ?? "Shop Workspace",
        subtitle: "One shop workspace. Use the left navigation to move between setup, quoting, and settings."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/edit`,
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Shop Profile`);
                } else {
                  return [
                    createTextVNode("Shop Profile")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Incoming Requests`);
                } else {
                  return [
                    createTextVNode("Incoming Requests")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/edit`,
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createTextVNode("Shop Profile")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                color: "primary"
              }, {
                default: withCtx(() => [
                  createTextVNode("Incoming Requests")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(shopStore).loading && !unref(shop)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else if (unref(shop)) {
        _push(`<!--[--><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(metrics), (metric) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(metric.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(metric.note)}</p></article>`);
        });
        _push(`<!--]--></div><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Essential setup</h2><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"> Required setup is grouped into clear sections. Missing items are shown calmly and link straight to the owning page. </p></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: `/dashboard/setup-guide`,
          variant: "soft",
          color: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Open setup guide`);
            } else {
              return [
                createTextVNode("Open setup guide")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5"><!--[-->`);
        ssrRenderList(unref(setupItems), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.label,
            to: item.to,
            class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 dark:hover:border-orange-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start justify-between gap-3"${_scopeId}><span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(`</span>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: item.done ? "success" : "warning",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(item.done ? "Complete" : "Missing")}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(item.done ? "Complete" : "Missing"), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div><p class="mt-4 text-sm font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.description)}</p>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                    createVNode("span", { class: "flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]" }, [
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "h-4 w-4"
                      }, null, 8, ["name"])
                    ]),
                    createVNode(_component_UBadge, {
                      color: item.done ? "success" : "warning",
                      variant: "soft",
                      size: "xs"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.done ? "Complete" : "Missing"), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  ]),
                  createVNode("p", { class: "mt-4 text-sm font-medium text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(item.description), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section><section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(sectionLinks), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition hover:border-orange-300 dark:hover:border-orange-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start gap-3"${_scopeId}><span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "h-5 w-5"
                }, null, _parent2, _scopeId));
                _push2(`</span><div${_scopeId}><p class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(item.label)}</p><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(item.description)}</p></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start gap-3" }, [
                    createVNode("span", { class: "flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]" }, [
                      createVNode(_component_UIcon, {
                        name: item.icon,
                        class: "h-5 w-5"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(item.label), 1),
                      createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(item.description), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></section><!--]-->`);
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
//# sourceMappingURL=index-8pnYWlKK.mjs.map
