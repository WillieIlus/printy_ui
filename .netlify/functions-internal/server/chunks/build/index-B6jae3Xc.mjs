import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { _ as __nuxt_component_1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_2 } from './BackendQuoteCalculator-LNtZ4F8P.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { f as useRoute, b as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-Dn_IFHF_.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useSetupFlow } from './useSetupFlow-BWiVCewA.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { u as useSetupStatusStore } from './setupStatus-BIGAzyB1.mjs';
import { u as useIncomingRequests } from './useIncomingRequests-Dj9ppvKn.mjs';
import './calculationResult-SiwRgRTu.mjs';
import './SelectMenu-D3Bra_sq.mjs';
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
import './Input-Hudv-7BP.mjs';
import './Textarea-DUPwu95P.mjs';
import './activityBadges-B_bMwbEc.mjs';
import 'pinia';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './machine-DD004_8d.mjs';
import './payload-B_6emhZU.mjs';
import './useCurrencyFormatter-tIWAo1tq.mjs';
import './formatters-FW8HHCjc.mjs';
import './public-BVuVnl0E.mjs';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './useSetupStatus-BlqBMF6r.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './useApi-Cs2GTEbX.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => String(route.params.slug || ""));
    const shopStore = useShopStore();
    const setupStore = useSetupStatusStore();
    const quoteInboxStore = useQuoteInboxStore();
    const incomingRequests = useIncomingRequests(slug);
    const prefillSourceRequest = ref(null);
    const setupFlow = useSetupFlow(slug);
    async function refreshPage() {
      await Promise.all([
        shopStore.ensureActiveShop(slug.value),
        setupStore.fetchStatus(slug.value),
        quoteInboxStore.fetchDashboard()
      ]);
      await loadPrefillRequest();
    }
    async function loadPrefillRequest() {
      const requestId = Number(route.query.requestId);
      if (!requestId || Number.isNaN(requestId)) {
        prefillSourceRequest.value = null;
        return;
      }
      try {
        prefillSourceRequest.value = await incomingRequests.get(requestId);
      } catch {
        prefillSourceRequest.value = null;
      }
    }
    const prefillRequest = computed(() => {
      const source = prefillSourceRequest.value;
      const item = source?.items?.[0];
      if (!source || !item) return null;
      const colorMode = item.color_mode === "BW" ? "BW" : "COLOR";
      const sides = item.sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
      return {
        requestId: source.id,
        itemId: item.id,
        shopSlug: slug.value,
        workspaceMode: item.item_type === "CUSTOM" ? "custom" : "catalog",
        contactName: source.customer_name || "",
        contactPhone: source.customer_phone || "",
        contactEmail: source.customer_email || "",
        notes: source.notes || "",
        customProductTitle: item.title || item.product_name || "",
        customProductSpec: item.spec_text || "",
        quantity: item.quantity || null,
        widthMm: item.chosen_width_mm ?? null,
        heightMm: item.chosen_height_mm ?? null,
        turnaroundDays: 2,
        productId: item.product ?? null,
        paperId: item.paper ?? null,
        machineId: item.machine ? Number(item.machine) : null,
        colorMode,
        sides,
        finishings: (item.finishings ?? []).map((finishing) => ({
          finishing_rate_id: finishing.finishing_rate,
          selected_side: "both"
        }))
      };
    });
    const setupCards = computed(() => setupFlow.value.steps);
    const setupSummary = computed(() => `${setupFlow.value.completedCount} of ${setupFlow.value.steps.length} onboarding steps complete`);
    const nextSetupRoute = computed(() => setupFlow.value.nextRequiredRoute);
    const nextSetupLabel = computed(() => setupFlow.value.nextRequiredStep ? "Complete next step" : "Review setup");
    watch(() => route.query.requestId, () => {
      void loadPrefillRequest();
    });
    function setupCardClass(state) {
      if (state === "complete") return "border-emerald-300/45 bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_8%)]";
      if (state === "current") return "border-amber-300/70 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_12%)]";
      return "border-[var(--p-border)] bg-[var(--p-surface-sunken)]";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_QuotesCalculatorHub = __nuxt_component_1;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_2;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(shopStore).currentShop?.name || "Shop workspace",
        subtitle: "This shop page now behaves like the main quoting desk for the selected shop."
      }, null, _parent));
      if (unref(slug)) {
        _push(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
          flat: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
                "fixed-shop-slug": unref(slug),
                "prefill-request": unref(prefillRequest),
                eyebrow: "Shop Workspace",
                title: "Quick quote workbench",
                description: "Use the backend preview, then move to the quote inbox actions below.",
                mode: "shop",
                onDraftSaved: refreshPage,
                onDraftSent: refreshPage
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesBackendQuoteCalculator, {
                  "fixed-shop-slug": unref(slug),
                  "prefill-request": unref(prefillRequest),
                  eyebrow: "Shop Workspace",
                  title: "Quick quote workbench",
                  description: "Use the backend preview, then move to the quote inbox actions below.",
                  mode: "shop",
                  onDraftSaved: refreshPage,
                  onDraftSent: refreshPage
                }, null, 8, ["fixed-shop-slug", "prefill-request"])
              ];
            }
          }),
          booklet: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesBookletCalculator, {
                "fixed-shop-slug": unref(slug),
                "fixed-shop-name": unref(shopStore).currentShop?.name || unref(slug),
                eyebrow: "Shop Workspace Booklet",
                title: "Booklet quote workbench",
                description: "Use the backend booklet preview, then move to the quote inbox actions below."
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesBookletCalculator, {
                  "fixed-shop-slug": unref(slug),
                  "fixed-shop-name": unref(shopStore).currentShop?.name || unref(slug),
                  eyebrow: "Shop Workspace Booklet",
                  title: "Booklet quote workbench",
                  description: "Use the backend booklet preview, then move to the quote inbox actions below."
                }, null, 8, ["fixed-shop-slug", "fixed-shop-name"])
              ];
            }
          }),
          large_format: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
                "fixed-shop-slug": unref(slug),
                "fixed-shop-name": unref(shopStore).currentShop?.name || unref(slug),
                eyebrow: "Shop Workspace Large Format",
                title: "Large-format quote workbench",
                description: "Use the backend large-format preview, then move to the quote inbox actions below."
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesLargeFormatCalculator, {
                  "fixed-shop-slug": unref(slug),
                  "fixed-shop-name": unref(shopStore).currentShop?.name || unref(slug),
                  eyebrow: "Shop Workspace Large Format",
                  title: "Large-format quote workbench",
                  description: "Use the backend large-format preview, then move to the quote inbox actions below."
                }, null, 8, ["fixed-shop-slug", "fixed-shop-name"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup Status</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Guided onboarding</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(setupSummary))}</p></div>`);
      if (unref(nextSetupRoute)) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(nextSetupRoute),
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(nextSetupLabel))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(nextSetupLabel)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(setupCards), (step) => {
        _push(`<article class="${ssrRenderClass([setupCardClass(step.state), "rounded-2xl border p-4"])}"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(step.label)}</p>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: step.state === "complete" ? "success" : step.state === "current" ? "warning" : "neutral",
          variant: "soft",
          size: "xs"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(step.state === "complete" ? "Complete" : step.state === "current" ? "Current" : "Blocked")}`);
            } else {
              return [
                createTextVNode(toDisplayString(step.state === "complete" ? "Complete" : step.state === "current" ? "Current" : "Blocked"), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(step.helper)}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: step.ctaTo,
          variant: step.state === "current" ? "solid" : "soft",
          color: step.state === "complete" ? "success" : step.state === "current" ? "warning" : "neutral",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(step.ctaLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(step.ctaLabel), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</article>`);
      });
      _push(`<!--]--></div></section></div>`);
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
//# sourceMappingURL=index-B6jae3Xc.mjs.map
