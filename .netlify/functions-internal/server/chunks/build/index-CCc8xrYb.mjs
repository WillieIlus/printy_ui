import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { _ as __nuxt_component_1 } from './BackendQuoteCalculator-DwoilVbe.mjs';
import { f as useRoute, d as _sfc_main$9 } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useShopStore } from './shop-DfXxeXDQ.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-CT7a8yeE.mjs';
import { u as useSetupStatusStore } from './setupStatus-pIJLkKpM.mjs';
import { u as useIncomingRequests } from './useIncomingRequests-D5x3BDeT.mjs';
import './Input-DZEAnFef.mjs';
import 'reka-ui';
import '@vueuse/core';
import './SelectMenu-DDFAjir1.mjs';
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
import './Textarea-BGCp2SzO.mjs';
import 'pinia';
import './machine-CsyB89Gp.mjs';
import './payload-B_6emhZU.mjs';
import './useCurrencyFormatter-BbngrNPq.mjs';
import './formatters-Cc_7PG6h.mjs';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './browser-storage-CN-SIF_V.mjs';

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
        colorMode: item.color_mode === "BW" ? "BW" : "COLOR",
        sides: item.sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX",
        finishings: (item.finishings ?? []).map((finishing) => ({
          finishing_rate_id: finishing.finishing_rate,
          selected_side: "both"
        }))
      };
    });
    const setupCards = computed(() => [
      { label: "Materials", value: setupStore.status?.has_materials ? "Ready" : "Missing" },
      { label: "Pricing", value: setupStore.status?.has_pricing ? "Ready" : "Missing" },
      { label: "Finishing", value: setupStore.status?.has_finishing ? "Ready" : "Missing" },
      { label: "Products", value: setupStore.status?.has_products ? "Ready" : "Missing" }
    ]);
    watch(() => route.query.requestId, () => {
      void loadPrefillRequest();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_1;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(shopStore).currentShop?.name || "Shop workspace",
        subtitle: "This shop page now behaves like the main quoting desk for the selected shop."
      }, null, _parent));
      if (unref(slug)) {
        _push(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
          "fixed-shop-slug": unref(slug),
          "prefill-request": unref(prefillRequest),
          eyebrow: "Shop Workspace",
          title: "Quick quote workbench",
          description: "Use the backend preview, then move to the quote inbox actions below.",
          mode: "shop",
          onDraftSaved: refreshPage,
          onDraftSent: refreshPage
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup Status</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Backend progression</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(setupStore).status?.next_url || "Setup complete.")}</p></div>`);
      if (unref(setupStore).status?.next_url) {
        _push(ssrRenderComponent(_component_UButton, {
          to: unref(setupStore).status.next_url,
          variant: "soft"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Open next step`);
            } else {
              return [
                createTextVNode("Open next step")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(setupCards), (step) => {
        _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(step.label)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(step.value)}</p></article>`);
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
//# sourceMappingURL=index-CCc8xrYb.mjs.map
