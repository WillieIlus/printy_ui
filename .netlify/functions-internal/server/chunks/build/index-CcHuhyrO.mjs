import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { g as useRoute, a as _sfc_main$f, d as _sfc_main$9, _ as __nuxt_component_3$1, e as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Badge-DzyqaO77.mjs';
import { u as useMachineStore } from './machine-Doo-qpdB.mjs';
import { u as usePricingStore } from './pricing-CccrVSfA.mjs';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
import { u as useIncomingRequests, a as useSentQuotes } from './useIncomingRequests-Bb7QTcAK.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DashboardShopHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "DashboardShopHeader" });
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
    const shopRatingSummary = ref(null);
    const todayStart = computed(() => {
      const d = /* @__PURE__ */ new Date();
      d.setHours(0, 0, 0, 0);
      return d.toISOString().slice(0, 10);
    });
    const shopId = computed(() => shop.value?.id ?? null);
    const quotesToday = computed(
      () => incomingRequests.value.filter((r) => r.created_at?.slice(0, 10) === todayStart.value).length
    );
    const pendingQuotes = computed(
      () => incomingRequests.value.filter((r) => {
        const s = (r.status ?? "").toLowerCase();
        return s === "submitted" || s === "viewed";
      }).length
    );
    const activeSentQuotes = computed(
      () => sentQuotesList.value.filter((q) => {
        const s = (q.status ?? "").toLowerCase();
        return s === "sent" || s === "revised";
      }).length
    );
    const acceptedQuotes = computed(
      () => sentQuotesList.value.filter((q) => (q.status ?? "").toLowerCase() === "accepted").length
    );
    const estimatedRevenue = computed(() => {
      const sid = shopId.value;
      const accepted = sentQuotesList.value.filter(
        (q) => q.shop === sid && (q.status ?? "").toLowerCase() === "accepted"
      );
      const total = accepted.reduce((sum, q) => {
        const t = parseFloat(String(q.total ?? 0));
        return sum + (Number.isNaN(t) ? 0 : t);
      }, 0);
      return total > 0 ? `KES ${Math.round(total).toLocaleString()}` : "KES 0";
    });
    const shopRating = computed(() => {
      const summary = shopRatingSummary.value;
      if (!summary?.count) return "No ratings yet";
      return `${summary.average.toFixed(1)} from ${summary.count} review${summary.count === 1 ? "" : "s"}`;
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
    const workflowMetrics = computed(() => [
      {
        label: "Requests Today",
        value: quotesToday.value,
        note: "New requests created today.",
        icon: "i-lucide-inbox"
      },
      {
        label: "Awaiting Response",
        value: pendingQuotes.value,
        note: "Submitted or viewed requests.",
        icon: "i-lucide-clock-3"
      },
      {
        label: "Accepted Quotes",
        value: acceptedQuotes.value,
        note: "Ready for operational handoff.",
        icon: "i-lucide-badge-check"
      },
      {
        label: "Accepted Value",
        value: estimatedRevenue.value,
        note: "Total across accepted quotes.",
        icon: "i-lucide-banknote"
      }
    ]);
    const workflowStages = computed(() => [
      {
        label: "Submitted",
        value: pendingQuotes.value,
        note: "Customer requests waiting on a quote."
      },
      {
        label: "Sent",
        value: activeSentQuotes.value,
        note: "Quotes sent or revised and awaiting customer action."
      },
      {
        label: "Accepted",
        value: acceptedQuotes.value,
        note: "Quotes accepted by customers."
      },
      {
        label: "Ready To Order",
        value: acceptedQuotes.value,
        note: "Accepted quotes available for the production-order flow."
      }
    ]);
    const navItems = computed(() => [
      {
        to: `/dashboard/shops/${slug.value}/incoming-requests`,
        label: "Incoming Requests",
        desc: "Review submitted, viewed, and unquoted customer work.",
        icon: "i-lucide-inbox"
      },
      {
        to: `/dashboard/shops/${slug.value}/sent-quotes`,
        label: "Sent Quotes",
        desc: "Track revisions, accepted quotes, and ready-to-order work.",
        icon: "i-lucide-send"
      },
      {
        to: `/dashboard/shops/${slug.value}/products`,
        label: "Products",
        desc: "Manage catalog cards, turnaround, and public product coverage.",
        icon: "i-lucide-package"
      },
      {
        to: `/dashboard/shops/${slug.value}/pricing`,
        label: "Stock & Pricing",
        desc: "Configure papers, materials, printing, and finishing rates.",
        icon: "i-lucide-banknote"
      },
      {
        to: `/dashboard/shops/${slug.value}/machines`,
        label: "Machines",
        desc: "Align capacity and equipment with quote output.",
        icon: "i-lucide-printer"
      },
      {
        to: `/dashboard/shops/${slug.value}/members`,
        label: "Team",
        desc: "Coordinate the people managing requests and production.",
        icon: "i-lucide-users"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_DashboardShopHeader = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_3$1;
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
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Edit `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-edit",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Edit ")
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
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` Incoming Requests `);
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-inbox",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Incoming Requests ")
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
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Edit ")
                  ]),
                  _: 1
                }, 8, ["to"]),
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/incoming-requests`,
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-inbox",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Incoming Requests ")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mt-3 flex flex-wrap items-center gap-3"${_scopeId}>`);
              if (unref(shop).is_verified) {
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: "success",
                  variant: "soft"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-check-circle",
                        class: "mr-1 h-3 w-3"
                      }, null, _parent3, _scopeId2));
                      _push3(` Verified `);
                    } else {
                      return [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-check-circle",
                          class: "mr-1 h-3 w-3"
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
              _push2(`<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-star",
                class: "h-3.5 w-3.5 fill-current"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(shopRating))}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "mt-3 flex flex-wrap items-center gap-3" }, [
                  unref(shop).is_verified ? (openBlock(), createBlock(_component_UBadge, {
                    key: 0,
                    color: "success",
                    variant: "soft"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-check-circle",
                        class: "mr-1 h-3 w-3"
                      }),
                      createTextVNode(" Verified ")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("span", { class: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-star",
                      class: "h-3.5 w-3.5 fill-current"
                    }),
                    createTextVNode(" " + toDisplayString(unref(shopRating)), 1)
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(setupProgress) < 2) {
          _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"><div class="rounded-xl bg-[var(--p-surface-sunken)] p-6"><div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-primary)]">Setup Progress</span><h3 class="mt-2 text-xl font-bold text-[var(--p-text)]">Complete the quoting setup for this shop</h3><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]"> Add machines, paper, and pricing so requests can move from inquiry to sent quote without gaps. </p></div><div class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--p-text)] shadow-sm">${ssrInterpolate(unref(setupProgress))} / 2 core steps ready </div></div><div class="mt-6 grid gap-4 md:grid-cols-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/machines`,
            class: "rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>Machines</span>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: unref(hasMachines) ? "i-lucide-check-circle" : "i-lucide-printer",
                  class: ["h-5 w-5", unref(hasMachines) ? "text-green-600" : "text-[var(--p-primary)]"]
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(hasMachines) ? `${unref(machineCount)} configured` : "Add at least one production machine.")}</p>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm font-semibold text-[var(--p-text)]" }, "Machines"),
                    createVNode(_component_UIcon, {
                      name: unref(hasMachines) ? "i-lucide-check-circle" : "i-lucide-printer",
                      class: ["h-5 w-5", unref(hasMachines) ? "text-green-600" : "text-[var(--p-primary)]"]
                    }, null, 8, ["name", "class"])
                  ]),
                  createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(hasMachines) ? `${unref(machineCount)} configured` : "Add at least one production machine."), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/pricing`,
            class: "rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>Stock &amp; pricing</span>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: unref(hasPricing) ? "i-lucide-check-circle" : "i-lucide-banknote",
                  class: ["h-5 w-5", unref(hasPricing) ? "text-green-600" : "text-[var(--p-primary)]"]
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(hasPricing) ? "Rates and materials are available." : "Load paper, printing, material, or finishing rates.")}</p>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm font-semibold text-[var(--p-text)]" }, "Stock & pricing"),
                    createVNode(_component_UIcon, {
                      name: unref(hasPricing) ? "i-lucide-check-circle" : "i-lucide-banknote",
                      class: ["h-5 w-5", unref(hasPricing) ? "text-green-600" : "text-[var(--p-primary)]"]
                    }, null, 8, ["name", "class"])
                  ]),
                  createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(hasPricing) ? "Rates and materials are available." : "Load paper, printing, material, or finishing rates."), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${unref(slug)}/products`,
            class: "rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm font-semibold text-[var(--p-text)]"${_scopeId}>Products</span>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-package",
                  class: "h-5 w-5 text-[var(--p-primary)]"
                }, null, _parent2, _scopeId));
                _push2(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>Keep the public catalog aligned with your pricing and turnaround.</p>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm font-semibold text-[var(--p-text)]" }, "Products"),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-package",
                      class: "h-5 w-5 text-[var(--p-primary)]"
                    })
                  ]),
                  createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, "Keep the public catalog aligned with your pricing and turnaround.")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><section class="space-y-6"><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(workflowMetrics), (metric) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"><div class="h-full rounded-xl bg-[var(--p-surface-sunken)] p-5"><div class="flex items-center justify-between"><span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(metric.label)}</span><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: metric.icon,
            class: "h-5 w-5 text-[var(--p-primary)]"
          }, null, _parent));
          _push(`</div></div><p class="mt-6 text-3xl font-extrabold tracking-tight text-[var(--p-text)]">${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(metric.note)}</p></div></article>`);
        });
        _push(`<!--]--></div><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"><div class="rounded-xl bg-[var(--p-surface-sunken)] p-6"><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-primary)]">Quote Workflow</span><h3 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">From submitted request to production handoff</h3></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/dashboard/shops/${unref(slug)}/sent-quotes`,
          class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Open sent quotes `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Open sent quotes "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-6 grid gap-4 md:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(workflowStages), (stage) => {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-white p-4"><p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(stage.label)}</p><p class="mt-3 text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(stage.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(stage.note)}</p></div>`);
        });
        _push(`<!--]--></div></div></article><div class="grid gap-4 md:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(navItems), (nav) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: nav.to,
            to: nav.to,
            class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-colors hover:bg-[var(--p-surface-container)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex h-full items-start gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-5"${_scopeId}><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: nav.icon,
                  class: "h-5 w-5 text-[var(--p-primary)]"
                }, null, _parent2, _scopeId));
                _push2(`</div><div${_scopeId}><h4 class="text-base font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(nav.label)}</h4><p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(nav.desc)}</p></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex h-full items-start gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-5" }, [
                    createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm" }, [
                      createVNode(_component_UIcon, {
                        name: nav.icon,
                        class: "h-5 w-5 text-[var(--p-primary)]"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("div", null, [
                      createVNode("h4", { class: "text-base font-semibold text-[var(--p-text)]" }, toDisplayString(nav.label), 1),
                      createVNode("p", { class: "mt-1 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(nav.desc), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section><aside class="space-y-6"><article class="overflow-hidden rounded-2xl bg-[var(--p-text)] text-white"><div class="relative p-6"><div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div><div class="relative z-10"><span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80"> Operations </span><h3 class="mt-4 text-2xl font-bold tracking-tight">Accepted work ready for the next operational step</h3><p class="mt-3 text-sm leading-6 text-slate-300"> Accepted quotes are visible here today. The production-order flow already exists in the backend, but the frontend still needs a dedicated orders surface for payment and delivery tracking. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/dashboard/shops/${unref(slug)}/sent-quotes`,
          class: "mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--p-text)] transition-colors hover:bg-slate-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Review accepted quotes `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Review accepted quotes "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"><div class="rounded-xl bg-[var(--p-surface-sunken)] p-6"><h3 class="text-lg font-bold text-[var(--p-text)]">Current shop view</h3><ul class="mt-5 space-y-3 text-sm text-[var(--p-text-muted)]"><li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3"><span>Submitted and viewed requests</span><span class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(pendingQuotes))}</span></li><li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3"><span>Sent and revised quotes</span><span class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(activeSentQuotes))}</span></li><li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3"><span>Accepted quotes</span><span class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(acceptedQuotes))}</span></li><li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3"><span>Estimated accepted value</span><span class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(estimatedRevenue))}</span></li></ul></div></article></aside></div><!--]-->`);
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
//# sourceMappingURL=index-CcHuhyrO.mjs.map
