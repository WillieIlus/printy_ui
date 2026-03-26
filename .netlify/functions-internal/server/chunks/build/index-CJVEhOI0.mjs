import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { _ as __nuxt_component_1 } from './BackendQuoteCalculator-ikXAcPgr.mjs';
import { n as navigateTo, d as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-DRRvJchD.mjs';
import { defineComponent, ref, watchEffect, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './SelectMenu-C6Eyp_GI.mjs';
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
import '@vueuse/core';
import './Input-C14QBOm-.mjs';
import './Checkbox-S5HrhTVg.mjs';
import './Textarea-C3ixaFu9.mjs';
import './payload-B09QCjlG.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const shopStore = useShopStore();
    const quoteInboxStore = useQuoteInboxStore();
    const setupStore = useSetupStatusStore();
    const activeTab = ref("pending");
    watchEffect(() => {
      if (authStore.isClient) {
        navigateTo("/quote-draft");
      }
    });
    async function refreshDashboard() {
      await Promise.all([
        quoteInboxStore.fetchDashboard(),
        setupStore.fetchStatus(shopStore.selectedShopSlug)
      ]);
    }
    const metrics = computed(() => [
      {
        label: "Requests",
        value: quoteInboxStore.dashboard?.received_quote_requests ?? 0,
        note: "Backend count of received quote requests."
      },
      {
        label: "Pending",
        value: quoteInboxStore.dashboard?.status_counts?.pending ?? 0,
        note: "Requests awaiting action."
      },
      {
        label: "Accepted",
        value: quoteInboxStore.dashboard?.status_counts?.accepted ?? 0,
        note: "Responses marked accepted by the backend."
      },
      {
        label: "Next setup",
        value: setupStore.status?.next_step ?? "complete",
        note: setupStore.status?.next_url ?? "Setup complete."
      }
    ]);
    const tabs = [
      { label: "Pending", value: "pending" },
      { label: "Modified", value: "modified" },
      { label: "Accepted", value: "accepted" },
      { label: "Rejected", value: "rejected" },
      { label: "All", value: "all" }
    ];
    const filteredRequests = computed(() => {
      const requests = quoteInboxStore.dashboard?.recent_requests ?? [];
      if (activeTab.value === "all") return requests;
      if (activeTab.value === "pending") {
        return requests.filter((request) => ["submitted", "viewed", "pending"].includes(request.status));
      }
      return requests.filter((request) => request.status === activeTab.value);
    });
    function badgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Shop desk",
        subtitle: "Use backend setup status, backend pricing previews, and backend quote request states as the operating surface."
      }, null, _parent));
      if (unref(quoteInboxStore).dashboard) {
        _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(unref(metrics), (metric) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(metric.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(metric.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(metric.note)}</p></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(shopStore).selectedShopSlug) {
        _push(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
          "fixed-shop-slug": unref(shopStore).selectedShopSlug,
          eyebrow: "Dashboard Calculator",
          title: "Semi-open quick calculator",
          description: "Preview the backend price first, then use the inbox below to open, revise, accept, or reject requests.",
          mode: "shop",
          onDraftSaved: refreshDashboard,
          onDraftSent: refreshDashboard
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Quote Inbox</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Live request desk</h2></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        onClick: refreshDashboard
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: tab.value,
          variant: unref(activeTab) === tab.value ? "solid" : "soft",
          color: unref(activeTab) === tab.value ? "primary" : "neutral",
          onClick: ($event) => activeTab.value = tab.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tab.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(tab.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(filteredRequests).length) {
        _push(`<div class="mt-6 grid gap-4"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (request) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div class="flex flex-wrap items-center gap-3"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(request.request_snapshot?.request_details?.customer_name || request.customer_name || "Enquirer")}</p>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: badgeColor(request.status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(request.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(request.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(request.request_snapshot?.pricing_snapshot?.totals?.grand_total || "Awaiting response total")}</p></div><div class="flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            to: `/dashboard/shops/${unref(shopStore).selectedShopSlug}/incoming-requests`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open`);
              } else {
                return [
                  createTextVNode("Open")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, { variant: "soft" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Revise`);
              } else {
                return [
                  createTextVNode("Revise")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, { variant: "soft" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Accept`);
              } else {
                return [
                  createTextVNode("Accept")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, { variant: "soft" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Reject`);
              } else {
                return [
                  createTextVNode("Reject")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No requests in this tab yet. </div>`);
      }
      _push(`</section></div>`);
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
//# sourceMappingURL=index-CJVEhOI0.mjs.map
