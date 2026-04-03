import { defineComponent, useModel, computed, watchEffect, unref, mergeModels, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { c as calculatorTypeOptions, a as getCalculatorTypeLabel } from './calculationResult-SiwRgRTu.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-D3Bra_sq.mjs';
import { d as useAuthStore, e as useToast, n as navigateTo } from './server.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorUnavailablePanel",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-6" }, _attrs))}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Calculator type</p><h3 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h3><p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p><div class="mt-4 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 text-sm text-[var(--p-text-muted)]"> Flat remains available as the default calculator here. Switch back to continue pricing, drafting, or sending requests without losing the current flow. </div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorUnavailablePanel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "CalculatorUnavailablePanel" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorHub",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    defaultType: { default: "flat" },
    availableTypes: { default: () => calculatorTypeOptions.map((option) => option.value) },
    unavailableDescriptions: { default: () => ({}) }
  }, {
    "modelValue": { default: "flat" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const activeType = useModel(__props, "modelValue");
    const availableOptions = computed(() => {
      const allowed = new Set(props.availableTypes);
      return calculatorTypeOptions.filter((option) => allowed.has(option.value));
    });
    watchEffect(() => {
      const allowed = availableOptions.value.map((option) => option.value);
      if (!allowed.length) {
        activeType.value = "flat";
        return;
      }
      if (!allowed.includes(activeType.value)) {
        activeType.value = allowed.includes(props.defaultType) ? props.defaultType : allowed[0];
      }
    });
    const activeTypeLabel = computed(() => getCalculatorTypeLabel(activeType.value));
    const setActiveType = (type) => {
      activeType.value = type;
    };
    const unavailableDescription = computed(() => {
      const custom = props.unavailableDescriptions[activeType.value];
      if (custom) return custom;
      return "This calculator is not available on this surface yet.";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CalculatorUnavailablePanel = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (activeType.value === "flat") {
        ssrRenderSlot(_ctx.$slots, "flat", {
          activeType: activeType.value,
          availableOptions: unref(availableOptions),
          setActiveType
        }, null, _push, _parent);
      } else if (activeType.value === "booklet") {
        ssrRenderSlot(_ctx.$slots, "booklet", {
          activeType: activeType.value,
          availableOptions: unref(availableOptions),
          setActiveType
        }, null, _push, _parent);
      } else if (activeType.value === "large_format") {
        ssrRenderSlot(_ctx.$slots, "large_format", {
          activeType: activeType.value,
          availableOptions: unref(availableOptions),
          setActiveType
        }, null, _push, _parent);
      } else {
        _push(ssrRenderComponent(_component_CalculatorUnavailablePanel, {
          title: `${unref(activeTypeLabel)} calculator`,
          description: unref(unavailableDescription)
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/CalculatorHub.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$2, { __name: "QuotesCalculatorHub" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FinishingSelector",
  __ssrInlineRender: true,
  props: {
    groups: {},
    laminationSides: {},
    selectUi: {},
    isSelected: { type: Function },
    showSideSelector: { type: Function },
    getSide: { type: Function }
  },
  emits: ["toggle", "update-side"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 rounded-lg border border-white/10 bg-white/5 p-3" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.groups, (group) => {
        _push(`<div class="space-y-3 rounded-lg border border-white/10 bg-mirage-900/70 p-3"><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">${ssrInterpolate(group.label)}</p><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(group.options, (option) => {
          _push(`<button type="button" class="${ssrRenderClass([__props.isSelected(option.id) ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white", "rounded-md border px-3 py-2 text-sm font-medium transition-colors"])}">${ssrInterpolate(option.name)}</button>`);
        });
        _push(`<!--]--></div><!--[-->`);
        ssrRenderList(group.options.filter((item) => __props.showSideSelector(item.id)), (option) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_USelectMenu, {
            "model-value": __props.getSide(option.id),
            items: __props.laminationSides,
            "value-key": "value",
            "label-key": "label",
            ui: __props.selectUi,
            portal: "body",
            class: "w-full",
            "onUpdate:modelValue": ($event) => _ctx.$emit("update-side", option.id, $event)
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/FinishingSelector.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FinishingSelector = Object.assign(_sfc_main$1, { __name: "CalculatorFinishingSelector" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopSelectionChips",
  __ssrInlineRender: true,
  props: {
    shops: {},
    selectedSlugs: {}
  },
  emits: ["toggle"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-3" }, _attrs))}><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(__props.shops, (shop) => {
        _push(`<button type="button" class="${ssrRenderClass([__props.selectedSlugs.includes(shop.slug) ? "border-flamingo-400 bg-flamingo-500/12 text-[var(--p-text)]" : "border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)] hover:border-flamingo-300 hover:text-[var(--p-text)]", "rounded-md border px-3 py-2 text-sm font-medium transition-colors"])}">${ssrInterpolate(shop.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/ShopSelectionChips.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const QuotesShopSelectionChips = Object.assign(_sfc_main, { __name: "QuotesShopSelectionChips" });
function useQuoteRequestBlast() {
  const authStore = useAuthStore();
  const quoteInboxStore = useQuoteInboxStore();
  const toast = useToast();
  async function saveAndSend(payload) {
    if (!payload.selectedShopIds.length) {
      toast.add({ title: "No shops selected", description: "Select at least one shop before sending.", color: "warning" });
      return null;
    }
    if (!authStore.isAuthenticated) {
      await navigateTo({
        path: "/auth/login",
        query: { redirect: payload.loginRedirectPath || "/quote-draft" }
      });
      return null;
    }
    if (!authStore.isClient) {
      toast.add({ title: "Client account required", description: "Only client accounts can send quote requests to shops.", color: "warning" });
      return null;
    }
    const draft = await quoteInboxStore.saveDraft({
      title: payload.title,
      shop: payload.shop ?? null,
      selected_product: payload.selectedProduct ?? null,
      calculator_inputs_snapshot: payload.calculatorInputsSnapshot,
      pricing_snapshot: payload.pricingSnapshot ?? null,
      custom_product_snapshot: payload.customProductSnapshot ?? null,
      request_details_snapshot: payload.requestDetailsSnapshot ?? {}
    });
    return await quoteInboxStore.sendDraft(
      draft.id,
      payload.selectedShopIds,
      payload.requestDetailsSnapshot ?? {}
    );
  }
  async function sendSavedDraft(draftId, selectedShopIds, requestDetailsSnapshot) {
    if (!selectedShopIds.length) {
      toast.add({ title: "No shops selected", description: "Select at least one shop before sending.", color: "warning" });
      return null;
    }
    return await quoteInboxStore.sendDraft(draftId, selectedShopIds, requestDetailsSnapshot ?? {});
  }
  return {
    saveAndSend,
    sendSavedDraft
  };
}
function buildQuoteRequestSendSummary(requests) {
  return {
    shopCount: requests.length,
    requestIds: requests.map((request) => request.id)
  };
}
function getQuoteRequestSendLabel(summary, isSending = false) {
  if (isSending) return "Sending request...";
  if (!summary) return "";
  return summary.shopCount === 1 ? "Sent to 1 shop" : `Sent to ${summary.shopCount} shops`;
}
function getQuoteRequestSendFeedback(summary) {
  if (!summary) return "";
  return summary.shopCount === 1 ? "Sent successfully. The selected shop now has this request in incoming requests, and you can track it in Requests & Quotes." : `Sent successfully to ${summary.shopCount} shops. Each selected shop now has this request in incoming requests, and you can track replies in Requests & Quotes.`;
}
function getQuoteRequestSendToast(summary) {
  if (!summary) {
    return {
      title: "Request sent",
      description: "You can track the outcome in Requests & Quotes."
    };
  }
  return {
    title: summary.shopCount === 1 ? "Request sent to 1 shop" : `Request sent to ${summary.shopCount} shops`,
    description: "You can track the outcome in Requests & Quotes."
  };
}
function normalizeMoney(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}
function extractPreviewRecord(preview) {
  if (!preview || typeof preview !== "object") return null;
  return preview;
}
function extractPerSheetBreakdown(preview) {
  const record = extractPreviewRecord(preview);
  const breakdown = record?.breakdown ?? record;
  const perSheet = breakdown?.per_sheet_pricing ?? null;
  const paper = breakdown?.paper ?? null;
  const printing = breakdown?.printing ?? null;
  const totals = record?.totals ?? null;
  const paperPrice = normalizeMoney(perSheet?.paper_price) ?? normalizeMoney(paper?.paper_price) ?? normalizeMoney(paper?.paper_price_per_sheet) ?? normalizeMoney(paper?.cost_per_sheet);
  const frontPrint = normalizeMoney(perSheet?.print_price_front) ?? normalizeMoney(printing?.print_price_front);
  const backPrint = normalizeMoney(perSheet?.print_price_back) ?? normalizeMoney(printing?.print_price_back);
  const duplexSurcharge = normalizeMoney(perSheet?.duplex_surcharge) ?? normalizeMoney(printing?.duplex_surcharge);
  const printTotalPerSheet = normalizeMoney(perSheet?.print_total_per_sheet) ?? normalizeMoney(printing?.print_total_per_sheet) ?? normalizeMoney(printing?.total_per_sheet);
  const totalPerSheet = normalizeMoney(perSheet?.total_per_sheet) ?? normalizeMoney(totals?.total_per_sheet) ?? normalizeMoney(printing?.total_per_sheet_including_paper) ?? normalizeMoney(printing?.total_per_sheet);
  const formula = typeof perSheet?.formula === "string" ? perSheet.formula : typeof printing?.formula === "string" ? printing.formula : null;
  const explanation = typeof perSheet?.explanation === "string" ? perSheet.explanation : typeof printing?.explanation === "string" ? printing.explanation : null;
  return {
    paperPrice,
    frontPrint,
    backPrint,
    duplexSurcharge,
    printTotalPerSheet,
    totalPerSheet,
    formula,
    explanation
  };
}

export { FinishingSelector as F, QuotesShopSelectionChips as Q, __nuxt_component_1 as _, getQuoteRequestSendLabel as a, buildQuoteRequestSendSummary as b, getQuoteRequestSendFeedback as c, extractPerSheetBreakdown as e, getQuoteRequestSendToast as g, useQuoteRequestBlast as u };
//# sourceMappingURL=pricingBreakdown-CT3rnr7b.mjs.map
