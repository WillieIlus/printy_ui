import { _ as _sfc_main$4 } from './Input-Hudv-7BP.mjs';
import { _ as _sfc_main$5 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$6 } from './Textarea-DUPwu95P.mjs';
import { w as _export_sfc, d as useAuthStore, g as useAnalyticsTracking, e as useToast, m as useNuxtApp, A as API, _ as __nuxt_component_1, n as navigateTo } from './server.mjs';
import { defineComponent, ref, computed, watch, nextTick, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { s as sizePresets, f as formatSizeSummary, g as getPreviewMoney, C as CalculatorShell, Q as QuotePreviewPanel, d as QuotePreviewMeta, e as QuotePreviewRequirementsState, h as CalculatorFormGrid, i as CalculatorFieldGroup, j as calculatorSelectUi, k as CalculatorHeaderBlock, l as inferSizePresetLabel, m as convertInputToMm, n as convertMmToDisplay, o as getSizePreset } from './calculationResult-SiwRgRTu.mjs';
import { u as useQuoteRequestBlast, a as getQuoteRequestSendLabel, c as getQuoteRequestSendFeedback, e as extractPerSheetBreakdown, Q as QuotesShopSelectionChips, F as FinishingSelector, b as buildQuoteRequestSendSummary, g as getQuoteRequestSendToast } from './pricingBreakdown-CT3rnr7b.mjs';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { defineStore } from 'pinia';
import { u as useMachineStore } from './machine-DD004_8d.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { n as normalizeNumberValue, a as normalizeSelectValue, b as normalizeOptionalText } from './payload-B_6emhZU.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-tIWAo1tq.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CalculatorQuoteModeToggle",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    options: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-white/5 p-1" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([__props.modelValue === option.value ? "bg-flamingo-500 text-white shadow-sm" : "text-slate-300 hover:bg-white/6 hover:text-white", "rounded-md px-4 py-2 text-sm font-semibold transition-colors"])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/CalculatorQuoteModeToggle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const CalculatorQuoteModeToggle = Object.assign(_sfc_main$3, { __name: "CalculatorQuoteModeToggle" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ClientDetailsInlineForm",
  __ssrInlineRender: true,
  props: {
    name: {},
    phone: {},
    email: {},
    inputUi: {}
  },
  emits: ["update:name", "update:phone", "update:email"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-slate-200 bg-slate-50 p-3" }, _attrs))}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500"> Client details </p><div class="mt-3 grid gap-3"><div class="grid gap-3 sm:grid-cols-2">`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": __props.name,
        ui: __props.inputUi,
        placeholder: "Client or company name",
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:name", String($event ?? ""))
      }, null, _parent));
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": __props.phone,
        ui: __props.inputUi,
        placeholder: "+254...",
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:phone", String($event ?? ""))
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UInput, {
        "model-value": __props.email,
        type: "email",
        ui: __props.inputUi,
        placeholder: "name@example.com",
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:email", String($event ?? ""))
      }, null, _parent));
      _push(`<p class="text-xs leading-5 text-slate-500"> Signed-in clients can continue with this pricing context without leaving the calculator. </p></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/ClientDetailsInlineForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ClientDetailsInlineForm = Object.assign(_sfc_main$2, { __name: "CalculatorClientDetailsInlineForm" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuotePreviewPriceState",
  __ssrInlineRender: true,
  props: {
    printSubtotal: {},
    finishingTotal: {},
    total: {},
    perUnit: {},
    helper: {},
    piecesPerSheet: {},
    sheetsRequired: {},
    costLines: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4" }, _attrs))}>`);
      if (__props.piecesPerSheet || __props.sheetsRequired) {
        _push(`<div class="grid gap-3 sm:grid-cols-2"><div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm"><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500"> Pcs per sheet </p><p class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">${ssrInterpolate(__props.piecesPerSheet || "â€”")}</p></div><div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm"><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500"> Sheets required </p><p class="mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600">${ssrInterpolate(__props.sheetsRequired || "â€”")}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2"><!--[-->`);
      ssrRenderList(__props.costLines, (line) => {
        _push(`<div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-500">${ssrInterpolate(line.label)}</span><strong class="text-slate-900">${ssrInterpolate(line.value)}</strong></div>`);
      });
      _push(`<!--]--><div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-500">Print subtotal</span><strong class="text-slate-900">${ssrInterpolate(__props.printSubtotal)}</strong></div><div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-500">Finishing total</span><strong class="text-slate-900">${ssrInterpolate(__props.finishingTotal)}</strong></div><div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-500">Per-unit price</span><strong class="text-slate-900">${ssrInterpolate(__props.perUnit)}</strong></div></div><div class="border-t border-slate-200 pt-3"><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-slate-500"> Estimated total </p><p class="mt-1 text-3xl font-extrabold tracking-tight text-flamingo-600">${ssrInterpolate(__props.total)}</p><p class="mt-1 text-sm text-slate-500">${ssrInterpolate(__props.helper)}</p></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/calculator/QuotePreviewPriceState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const QuotePreviewPriceState = Object.assign(_sfc_main$1, { __name: "CalculatorQuotePreviewPriceState" });
function hasPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function useCalculatorPreviewState(options) {
  const missingRequirements = computed(() => {
    const items = [];
    const workspaceMode = unref(options.workspaceMode);
    const hasProduct = unref(options.hasProduct);
    const customProductTitle = unref(options.customProductTitle) ?? "";
    const customProductSpec = unref(options.customProductSpec) ?? "";
    const quantity = unref(options.quantity);
    const widthMm = unref(options.widthMm);
    const heightMm = unref(options.heightMm);
    const paperId = unref(options.paperId);
    const sides = unref(options.sides);
    const colorMode = unref(options.colorMode);
    const machineId = unref(options.machineId);
    const turnaroundDays = unref(options.turnaroundDays);
    const preview = unref(options.preview);
    if (workspaceMode === "catalog") {
      if (!hasProduct) items.push("Select a catalog product");
    } else {
      if (!customProductTitle.trim()) items.push("Add a custom product title");
      if (!customProductSpec.trim()) items.push("Add a custom brief");
      if (!hasPositiveNumber(widthMm) || !hasPositiveNumber(heightMm)) {
        items.push("Enter the finished size");
      }
    }
    if (!hasPositiveNumber(quantity)) items.push("Enter the quantity");
    if (!paperId) items.push("Choose paper / GSM");
    if (!sides) items.push("Choose print sides");
    if (!colorMode) items.push("Choose colour mode");
    if (!machineId) items.push("Choose a machine or pricing basis");
    if (!hasPositiveNumber(turnaroundDays)) items.push("Set turnaround");
    const previewSuggestions = preview?.suggestions?.map((item) => item.message).filter((item) => Boolean(item)) ?? [];
    for (const suggestion of previewSuggestions) {
      if (!items.includes(suggestion)) items.push(suggestion);
    }
    return items;
  });
  const canShowFinalPricing = computed(
    () => Boolean(unref(options.preview)?.totals?.grand_total || unref(options.preview)?.total || unref(options.preview)?.can_calculate)
  );
  return {
    missingRequirements,
    canShowFinalPricing
  };
}
const useCalculatorStore = defineStore("calculator", () => {
  const context = ref({
    shopId: null,
    shopSlug: null,
    productId: null,
    quantity: 100,
    sizeMode: "custom",
    sizeLabel: "",
    inputUnit: "mm",
    widthInput: null,
    heightInput: null,
    widthMm: null,
    heightMm: null,
    turnaroundDays: null,
    paperId: null,
    machineId: null,
    colorMode: "COLOR",
    sides: "SIMPLEX",
    applyDuplexSurcharge: null,
    finishings: []
  });
  const preview = ref(null);
  const previewLoading = ref(false);
  const previewLoaded = ref(false);
  const previewError = ref(null);
  function setContext(partial) {
    context.value = { ...context.value, ...partial };
  }
  function resetPreview() {
    preview.value = null;
    previewLoaded.value = false;
    previewError.value = null;
  }
  async function fetchPreview() {
    previewLoading.value = true;
    previewError.value = null;
    try {
      const { $api } = useNuxtApp();
      preview.value = await $api(API.calculatorPreview(), {
        method: "POST",
        body: {
          shop: context.value.shopId,
          product: context.value.productId,
          quantity: context.value.quantity,
          size_mode: context.value.sizeMode,
          size_label: context.value.sizeLabel,
          input_unit: context.value.inputUnit,
          width_input: context.value.widthInput,
          height_input: context.value.heightInput,
          width_mm: context.value.widthMm,
          height_mm: context.value.heightMm,
          turnaround_days: context.value.turnaroundDays,
          turnaround_hours: context.value.turnaroundDays,
          paper: context.value.paperId,
          machine: context.value.machineId,
          color_mode: context.value.colorMode,
          sides: context.value.sides,
          apply_duplex_surcharge: context.value.applyDuplexSurcharge,
          finishings: context.value.finishings
        }
      });
      previewLoaded.value = true;
      return preview.value;
    } catch (err) {
      previewError.value = err instanceof Error ? err.message : "Preview failed.";
      throw err;
    } finally {
      previewLoading.value = false;
    }
  }
  return {
    context,
    preview,
    previewLoading,
    previewLoaded,
    previewError,
    setContext,
    resetPreview,
    fetchPreview
  };
});
function useAnchoredForm() {
  function scrollToAnchor(anchorId, focusSelector) {
    return;
  }
  function scrollToFirstInvalid(formRoot) {
    return;
  }
  return {
    scrollToAnchor,
    scrollToFirstInvalid
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BackendQuoteCalculator",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: { default: "Quote Calculator" },
    mode: { default: "client" },
    fixedShopSlug: { default: null },
    anchorId: { default: "quote-calculator" },
    prefillRequest: { default: null }
  },
  emits: ["draftSaved", "draftSent"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const authStore = useAuthStore();
    const activityBadgesStore = useActivityBadgesStore();
    const shopStore = useShopStore();
    const calculatorStore = useCalculatorStore();
    const machineStore = useMachineStore();
    const quoteInboxStore = useQuoteInboxStore();
    const { saveAndSend } = useQuoteRequestBlast();
    const { trackQuoteSubmit } = useAnalyticsTracking();
    const { scrollToFirstInvalid } = useAnchoredForm();
    const toast = useToast();
    const formRef = ref(null);
    const quotePdfTargetRef = ref(null);
    const contactName = ref("");
    const contactPhone = ref("");
    const contactEmail = ref("");
    const notes = ref("");
    const workspaceMode = ref(props.mode === "shop" ? "catalog" : "custom");
    const customProductTitle = ref("");
    const customProductSpec = ref("");
    const customSizeMode = ref("custom");
    const customSizeLabel = ref("");
    const customInputUnit = ref("mm");
    const customWidthInput = ref("");
    const customHeightInput = ref("");
    const customWidthMm = ref(null);
    const customHeightMm = ref(null);
    const turnaroundDays = ref(null);
    const selectedShopSlug = ref(props.fixedShopSlug ?? null);
    const selectedSendShopSlugs = ref([]);
    const selectedProductId = ref(null);
    const selectedPaperId = ref(null);
    const selectedMachineId = ref(null);
    const quantity = ref(100);
    const colorMode = ref("COLOR");
    const sides = ref("SIMPLEX");
    const duplexSurchargePreference = ref("auto");
    const selectedFinishings = ref([]);
    const sendingRequest = ref(false);
    const lastSentSummary = ref(null);
    const sendError = ref("");
    const availableShops = ref([]);
    const shopOptions = ref([]);
    const productOptions = ref([]);
    const paperOptions = ref([]);
    const paperDetails = ref([]);
    const machineOptions = ref([]);
    const finishingOptions = ref([]);
    const activeShopId = ref(null);
    const selectedSheetSize = ref(null);
    const activeShopProfile = ref({
      name: "",
      business_email: null,
      phone_number: null
    });
    const allowShopSelection = computed(() => !props.fixedShopSlug);
    const compactMode = computed(() => props.mode === "hero");
    const supportsStandaloneCustomPricing = computed(() => props.mode === "shop");
    const showQuoteModeToggle = computed(() => props.mode === "shop");
    const showClientFields = computed(() => props.mode !== "hero");
    const showPreviewShopField = computed(() => props.mode === "shop");
    const quoteModeOptions = [
      { label: "Catalog product", value: "catalog" },
      { label: "Custom product", value: "custom" }
    ];
    const sidesOptions = [
      { label: "Front only", value: "SIMPLEX" },
      { label: "Both sides", value: "DUPLEX" }
    ];
    const duplexSurchargeOptions = [
      { label: "Auto", value: "auto" },
      { label: "Apply surcharge", value: "on" },
      { label: "No surcharge", value: "off" }
    ];
    const colorModeOptions = [
      { label: "Black and white", value: "BW" },
      { label: "Full colour", value: "COLOR" }
    ];
    const sizeModeOptions = [
      { label: "Standard size", value: "standard" },
      { label: "Custom size", value: "custom" }
    ];
    const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }));
    const defaultSizePreset = sizePresets[0];
    const sizeUnitOptions = [
      { label: "mm", value: "mm" },
      { label: "cm", value: "cm" },
      { label: "inches", value: "in" }
    ];
    const sheetSizeOptions = computed(
      () => Array.from(new Set(paperDetails.value.map((paper) => paper.sheetSize).filter(Boolean))).map((sheetSize) => ({ label: sheetSize, value: sheetSize }))
    );
    const laminationSides = [
      { label: "Front only", value: "front" },
      { label: "Back only", value: "back" },
      { label: "Both sides", value: "both" }
    ];
    const legacySelectUi = calculatorSelectUi;
    const calculatorInputUi = {
      base: "w-full px-4 text-sm"
    };
    const calculatorTextareaUi = {
      base: "w-full px-4 py-2 text-sm min-h-[7rem]"
    };
    const lightInputUi = {
      base: "w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-none focus:border-flamingo-500 focus:ring-2 focus:ring-flamingo-500/12"
    };
    const appliedPrefillKey = ref(null);
    watch(selectedShopSlug, async (slug) => {
      if (!slug) return;
      await loadShopResources(slug);
    }, { immediate: true });
    watch(selectedProductId, async (productId) => {
      if (!productId) return;
      if (workspaceMode.value !== "catalog" && supportsStandaloneCustomPricing.value) return;
      await loadProductOptions(productId);
    }, { immediate: true });
    watch(selectedSheetSize, (sheetSize) => {
      if (!sheetSize) return;
      const matchingPapers = paperDetails.value.filter((paper) => paper.sheetSize === sheetSize);
      paperOptions.value = matchingPapers.map(({ label, value }) => ({ label, value }));
      if (!matchingPapers.some((paper) => paper.value === selectedPaperId.value)) {
        selectedPaperId.value = matchingPapers[0]?.value ?? null;
      }
    });
    watch(selectedPaperId, (paperId) => {
      if (!paperId) return;
      const match = paperDetails.value.find((paper) => paper.value === paperId);
      if (match?.sheetSize) {
        selectedSheetSize.value = match.sheetSize;
      }
    });
    function syncCustomSizeInputsFromCanonical() {
      customWidthInput.value = convertMmToDisplay(customWidthMm.value, customInputUnit.value);
      customHeightInput.value = convertMmToDisplay(customHeightMm.value, customInputUnit.value);
    }
    function setCustomCanonicalSize(width, height, preferPreset = true) {
      customWidthMm.value = normalizeNumberValue(width);
      customHeightMm.value = normalizeNumberValue(height);
      if (preferPreset) {
        const inferredPreset = inferSizePresetLabel(customWidthMm.value, customHeightMm.value);
        if (inferredPreset) {
          customSizeMode.value = "standard";
          customSizeLabel.value = inferredPreset;
        }
      }
      syncCustomSizeInputsFromCanonical();
    }
    function applyCustomPreset() {
      const preset = getSizePreset(customSizeLabel.value) ?? defaultSizePreset;
      customSizeLabel.value = preset.label;
      customWidthMm.value = preset.widthMm;
      customHeightMm.value = preset.heightMm;
      syncCustomSizeInputsFromCanonical();
    }
    function handleCustomSizeModeChange(value) {
      customSizeMode.value = normalizeSelectValue(value) ?? "custom";
      if (customSizeMode.value === "standard") {
        customSizeLabel.value = customSizeLabel.value || inferSizePresetLabel(customWidthMm.value, customHeightMm.value) || defaultSizePreset.label;
        applyCustomPreset();
        return;
      }
      syncCustomSizeInputsFromCanonical();
    }
    function handleCustomSizePresetChange(value) {
      customSizeLabel.value = String(normalizeSelectValue(value) ?? defaultSizePreset.label);
      applyCustomPreset();
    }
    function handleCustomInputUnitChange(value) {
      customInputUnit.value = normalizeSelectValue(value) ?? "mm";
      syncCustomSizeInputsFromCanonical();
    }
    function handleCustomWidthInputChange(value) {
      customWidthInput.value = value == null ? "" : String(value);
      customWidthMm.value = convertInputToMm(customWidthInput.value, customInputUnit.value);
    }
    function handleCustomHeightInputChange(value) {
      customHeightInput.value = value == null ? "" : String(value);
      customHeightMm.value = convertInputToMm(customHeightInput.value, customInputUnit.value);
    }
    watch(sides, (value) => {
      if (value !== "DUPLEX") duplexSurchargePreference.value = "auto";
    });
    watch(
      () => props.prefillRequest,
      async (prefill) => {
        if (!prefill) return;
        const key = `${prefill.requestId}:${prefill.itemId}`;
        if (appliedPrefillKey.value === key) return;
        selectedShopSlug.value = prefill.shopSlug || selectedShopSlug.value;
        if (selectedShopSlug.value) {
          await loadShopResources(selectedShopSlug.value);
        }
        workspaceMode.value = prefill.workspaceMode;
        contactName.value = prefill.contactName || "";
        contactPhone.value = prefill.contactPhone || "";
        contactEmail.value = prefill.contactEmail || "";
        notes.value = prefill.notes || "";
        customProductTitle.value = prefill.customProductTitle || "";
        customProductSpec.value = prefill.customProductSpec || "";
        quantity.value = normalizeNumberValue(prefill.quantity) ?? quantity.value;
        setCustomCanonicalSize(normalizeNumberValue(prefill.widthMm), normalizeNumberValue(prefill.heightMm));
        turnaroundDays.value = normalizeNumberValue(prefill.turnaroundDays) ?? turnaroundDays.value ?? 6;
        selectedFinishings.value = prefill.finishings ? [...prefill.finishings] : [];
        colorMode.value = prefill.colorMode === "BW" ? "BW" : "COLOR";
        sides.value = prefill.sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
        if (prefill.workspaceMode === "catalog") {
          selectedProductId.value = prefill.productId ?? null;
          if (selectedProductId.value) {
            await loadProductOptions(selectedProductId.value);
          }
        } else if (selectedShopSlug.value && supportsStandaloneCustomPricing.value) {
          await loadCustomOptions(selectedShopSlug.value);
          selectedProductId.value = null;
        }
        selectedPaperId.value = prefill.paperId ?? selectedPaperId.value;
        selectedMachineId.value = prefill.machineId ?? selectedMachineId.value;
        appliedPrefillKey.value = key;
        await nextTick();
        if (validateForm()) {
          await previewQuote(true);
        }
      },
      { immediate: true }
    );
    let previewTimer = null;
    watch(workspaceMode, (mode) => {
      if (mode === "catalog") {
        if (selectedProductId.value) {
          void loadProductOptions(selectedProductId.value);
        }
        calculatorStore.resetPreview();
        return;
      }
      if (supportsStandaloneCustomPricing.value && selectedShopSlug.value) {
        void loadCustomOptions(selectedShopSlug.value);
      } else if (selectedProductId.value) {
        void loadProductOptions(selectedProductId.value);
      }
      calculatorStore.resetPreview();
    });
    watch(
      () => [
        activeShopId.value,
        selectedShopSlug.value,
        JSON.stringify(selectedSendShopSlugs.value),
        selectedProductId.value,
        selectedSheetSize.value,
        selectedPaperId.value,
        selectedMachineId.value,
        quantity.value,
        sides.value,
        colorMode.value,
        workspaceMode.value,
        customWidthMm.value,
        customHeightMm.value,
        turnaroundDays.value,
        contactName.value,
        contactPhone.value,
        contactEmail.value,
        notes.value,
        customProductTitle.value,
        customProductSpec.value,
        JSON.stringify(selectedFinishings.value)
      ],
      () => {
        clearSendState();
        if (previewTimer) clearTimeout(previewTimer);
        if (!validateForm()) {
          calculatorStore.resetPreview();
          return;
        }
        previewTimer = setTimeout(() => {
          void previewQuote(true);
        }, 250);
      }
    );
    function clearSendState() {
      lastSentSummary.value = null;
      sendError.value = "";
    }
    async function loadShopResources(shopSlug) {
      const { $publicApi } = useNuxtApp();
      const catalogResponse = await $publicApi(
        API.publicShopCatalog(shopSlug)
      );
      activeShopId.value = catalogResponse.shop.id;
      activeShopProfile.value = {
        name: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.name : catalogResponse.shop.name,
        business_email: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.business_email : null,
        phone_number: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.phone_number : null
      };
      try {
        const profile = await $publicApi(API.publicShopBySlug(shopSlug));
        activeShopProfile.value = {
          name: String(profile.name ?? activeShopProfile.value.name ?? catalogResponse.shop.name),
          business_email: typeof profile.business_email === "string" ? profile.business_email : activeShopProfile.value.business_email,
          phone_number: typeof profile.phone_number === "string" ? profile.phone_number : activeShopProfile.value.phone_number
        };
      } catch {
      }
      const existingShopIndex = shopOptions.value.findIndex((shop) => shop.value === shopSlug);
      if (existingShopIndex >= 0) {
        shopOptions.value[existingShopIndex] = { label: catalogResponse.shop.name, value: shopSlug };
      } else {
        shopOptions.value = [...shopOptions.value, { label: catalogResponse.shop.name, value: shopSlug }];
      }
      productOptions.value = catalogResponse.products.map((product) => ({ label: product.name, value: product.id }));
      if (workspaceMode.value === "catalog" && !selectedProductId.value) {
        selectedProductId.value = productOptions.value[0]?.value ?? null;
      }
      if (workspaceMode.value === "custom" && supportsStandaloneCustomPricing.value) {
        await loadCustomOptions(shopSlug);
      }
      if ((props.mode === "client" || props.mode === "hero") && !selectedSendShopSlugs.value.includes(shopSlug)) {
        selectedSendShopSlugs.value = [...selectedSendShopSlugs.value, shopSlug];
      }
    }
    async function loadCustomOptions(shopSlug) {
      const { $publicApiNoAuth } = useNuxtApp();
      const detail = await $publicApiNoAuth(API.publicShopCustomOptions(shopSlug));
      const availablePapers = Array.isArray(detail.available_papers) ? detail.available_papers : [];
      paperDetails.value = availablePapers.map((paper) => ({
        label: `${paper.sheet_size} - ${paper.gsm}gsm - ${paper.paper_type}`,
        value: Number(paper.id),
        sheetSize: String(paper.sheet_size ?? "")
      }));
      const availableSheetSizes = Array.from(new Set(paperDetails.value.map((paper) => paper.sheetSize).filter(Boolean)));
      if (!selectedSheetSize.value || !availableSheetSizes.includes(selectedSheetSize.value)) {
        selectedSheetSize.value = availableSheetSizes[0] ?? null;
      }
      const matchingPapers = paperDetails.value.filter(
        (paper) => selectedSheetSize.value ? paper.sheetSize === selectedSheetSize.value : true
      );
      paperOptions.value = matchingPapers.map(({ label, value }) => ({ label, value }));
      finishingOptions.value = Array.isArray(detail.available_finishings) ? detail.available_finishings : [];
      if (!paperOptions.value.some((paper) => paper.value === selectedPaperId.value)) {
        selectedPaperId.value = paperOptions.value[0]?.value ?? null;
      }
      if (props.mode === "shop") {
        try {
          const machines = await machineStore.fetchMachines(shopSlug);
          machineOptions.value = machines.filter((machine) => machine.is_active !== false).map((machine) => ({ label: machine.name, value: machine.id }));
        } catch {
          machineOptions.value = [];
        }
      }
      if (!machineOptions.value.some((machine) => machine.value === selectedMachineId.value)) {
        selectedMachineId.value = machineOptions.value[0]?.value ?? null;
      }
    }
    async function loadProductOptions(productId) {
      const { $publicApiNoAuth } = useNuxtApp();
      const detail = await $publicApiNoAuth(API.publicProductOptions(productId));
      const availablePapers = Array.isArray(detail.available_papers) ? detail.available_papers : [];
      const availableMachines = Array.isArray(detail.available_machines) ? detail.available_machines : [];
      const availableFinishings = Array.isArray(detail.available_finishings) ? detail.available_finishings : [];
      paperOptions.value = availablePapers.map((paper) => ({
        label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
        value: Number(paper.id)
      }));
      machineOptions.value = availableMachines.map((machine) => ({
        label: String(machine.name),
        value: Number(machine.id)
      }));
      paperDetails.value = availablePapers.map((paper) => ({
        label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
        value: Number(paper.id),
        sheetSize: String(paper.sheet_size ?? "")
      }));
      const availableSheetSizes = Array.from(new Set(paperDetails.value.map((paper) => paper.sheetSize).filter(Boolean)));
      if (!selectedSheetSize.value || !availableSheetSizes.includes(selectedSheetSize.value)) {
        selectedSheetSize.value = availableSheetSizes[0] ?? null;
      }
      const matchingPapers = paperDetails.value.filter(
        (paper) => selectedSheetSize.value ? paper.sheetSize === selectedSheetSize.value : true
      );
      paperOptions.value = matchingPapers.map(({ label, value }) => ({ label, value }));
      finishingOptions.value = availableFinishings;
      if (!paperOptions.value.some((paper) => paper.value === selectedPaperId.value)) {
        selectedPaperId.value = paperOptions.value[0]?.value ?? null;
      }
      selectedMachineId.value = selectedMachineId.value ?? Number(detail.default_machine ?? machineOptions.value[0]?.value ?? null);
      colorMode.value = detail.default_color_mode === "BW" ? "BW" : "COLOR";
      sides.value = detail.default_sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
      if (!customWidthMm.value || !customHeightMm.value) {
        setCustomCanonicalSize(
          customWidthMm.value ?? normalizeNumberValue(detail.default_finished_width_mm) ?? null,
          customHeightMm.value ?? normalizeNumberValue(detail.default_finished_height_mm) ?? null
        );
      }
      const legacyTurnaroundDays = normalizeNumberValue(detail.turnaround_days);
      turnaroundDays.value = turnaroundDays.value ?? normalizeNumberValue(detail.turnaround_hours) ?? (legacyTurnaroundDays ? legacyTurnaroundDays * 8 : null);
    }
    function toggleFinishing(finishing) {
      const finishingId = Number(finishing.id);
      const existing = selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId);
      if (existing) {
        selectedFinishings.value = selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== finishingId);
        return;
      }
      selectedFinishings.value = [
        ...selectedFinishings.value,
        { finishing_rate_id: finishingId, selected_side: "both" }
      ];
    }
    function updateWorkspaceMode(value) {
      workspaceMode.value = value === "custom" ? "custom" : "catalog";
    }
    function toggleSendShop(shopSlug, checked) {
      if (checked) {
        selectedSendShopSlugs.value = Array.from(/* @__PURE__ */ new Set([...selectedSendShopSlugs.value, shopSlug]));
        selectedShopSlug.value = selectedSendShopSlugs.value[0] ?? shopSlug;
        return;
      }
      selectedSendShopSlugs.value = selectedSendShopSlugs.value.filter((slug) => slug !== shopSlug);
      selectedShopSlug.value = selectedSendShopSlugs.value[0] ?? selectedShopSlug.value;
    }
    function updateFinishingSide(finishingId, value) {
      const normalized = normalizeSelectValue(value) ?? "both";
      selectedFinishings.value = selectedFinishings.value.map(
        (entry) => entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry
      );
    }
    function selectedFinishingSide(finishingId) {
      return selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)?.selected_side ?? "both";
    }
    function isFinishingSelected(finishingId) {
      return selectedFinishings.value.some((entry) => entry.finishing_rate_id === finishingId);
    }
    function isFinishingSideOpen(finishingId) {
      const option = finishingOptions.value.find((item) => Number(item.id) === finishingId);
      return Boolean(option && isFinishingSelected(finishingId) && isLamination(option));
    }
    function isLamination(finishing) {
      const name = `${finishing.slug || ""} ${finishing.name || ""}`.toLowerCase();
      return name.includes("lamination") || finishing.billing_basis === "per_sheet" && finishing.side_mode === "per_selected_side";
    }
    function validateForm() {
      return Boolean(
        activeShopId.value && (workspaceMode.value === "custom" && supportsStandaloneCustomPricing.value || selectedProductId.value) && selectedPaperId.value && selectedMachineId.value && normalizeNumberValue(quantity.value) && (workspaceMode.value !== "custom" || normalizeNumberValue(customWidthMm.value) && normalizeNumberValue(customHeightMm.value)) && normalizeNumberValue(turnaroundDays.value)
      );
    }
    async function previewQuote(isLiveUpdate = false) {
      if (!validateForm()) {
        if (!isLiveUpdate) {
          scrollToFirstInvalid(formRef.value);
          toast.add({
            title: "Incomplete form",
            description: "Pick a shop basis, paper, machine, quantity, size, and turnaround before previewing.",
            color: "warning"
          });
        }
        return;
      }
      calculatorStore.setContext({
        shopId: activeShopId.value,
        shopSlug: selectedShopSlug.value,
        productId: workspaceMode.value === "custom" && supportsStandaloneCustomPricing.value ? null : selectedProductId.value,
        quantity: normalizeNumberValue(quantity.value) ?? 100,
        sizeMode: customSizeMode.value,
        sizeLabel: customSizeLabel.value,
        inputUnit: customInputUnit.value,
        widthInput: customWidthInput.value,
        heightInput: customHeightInput.value,
        widthMm: normalizeNumberValue(customWidthMm.value),
        heightMm: normalizeNumberValue(customHeightMm.value),
        turnaroundDays: normalizeNumberValue(turnaroundDays.value),
        paperId: selectedPaperId.value,
        machineId: selectedMachineId.value,
        colorMode: colorMode.value,
        sides: sides.value,
        applyDuplexSurcharge: duplexSurchargeOverride.value,
        finishings: selectedFinishings.value
      });
      try {
        await calculatorStore.fetchPreview();
      } catch (error) {
        if (!isLiveUpdate) {
          toast.add({ title: "Preview failed", description: error instanceof Error ? error.message : "Preview failed.", color: "error" });
        }
      }
    }
    async function saveDraft() {
      if (!calculatorStore.preview) return;
      if (!authStore.isAuthenticated) {
        await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
        return;
      }
      if (!authStore.isClient) {
        toast.add({ title: "Preview only", description: "This backend draft flow is currently client-only.", color: "warning" });
        return;
      }
      const draft = await quoteInboxStore.saveDraft({
        title: contactName.value || "Saved draft",
        shop: activeShopId.value,
        selected_product: workspaceMode.value === "custom" && supportsStandaloneCustomPricing.value ? null : selectedProductId.value,
        calculator_inputs_snapshot: {
          pricing_mode: workspaceMode.value,
          quantity: normalizeNumberValue(quantity.value),
          paper: selectedPaperId.value,
          machine: selectedMachineId.value,
          color_mode: colorMode.value,
          sides: sides.value,
          apply_duplex_surcharge: duplexSurchargeOverride.value,
          finishings: selectedFinishings.value,
          size_mode: customSizeMode.value,
          size_label: customSizeLabel.value,
          input_unit: customInputUnit.value,
          width_input: customWidthInput.value,
          height_input: customHeightInput.value,
          width_mm: normalizeNumberValue(customWidthMm.value),
          height_mm: normalizeNumberValue(customHeightMm.value),
          notes: notes.value
        },
        pricing_snapshot: calculatorStore.preview,
        custom_product_snapshot: workspaceMode.value === "custom" ? {
          title: normalizeOptionalText(customProductTitle.value),
          spec_text: normalizeOptionalText(customProductSpec.value),
          size_mode: customSizeMode.value,
          size_label: customSizeLabel.value,
          input_unit: customInputUnit.value,
          width_input: customWidthInput.value,
          height_input: customHeightInput.value,
          width_mm: normalizeNumberValue(customWidthMm.value),
          height_mm: normalizeNumberValue(customHeightMm.value)
        } : void 0,
        request_details_snapshot: {
          customer_name: normalizeOptionalText(contactName.value),
          customer_phone: normalizeOptionalText(contactPhone.value),
          notes: normalizeOptionalText(notes.value)
        }
      });
      emit("draftSaved", draft);
      toast.add({ title: "Saved to workspace", description: "The backend saved this request in your requests and quotes workspace.", color: "success" });
    }
    async function sendDraft() {
      if (!calculatorStore.preview) return;
      clearSendState();
      if (!authStore.isAuthenticated) {
        await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
        return;
      }
      if (!authStore.isClient) {
        toast.add({ title: "Preview only", description: "Sending backend drafts is currently client-only.", color: "warning" });
        return;
      }
      const selectedShopSlugs = shopOptions.value.filter((shop) => selectedSendShopSlugs.value.includes(shop.value)).map((shop) => shop.value);
      const selectedShops = selectedShopSlugs.length ? selectedShopSlugs.map((slug) => resolveShopIdFromSlug(slug)).filter((value) => typeof value === "number") : activeShopId.value ? [activeShopId.value] : [];
      if (sendingRequest.value) return;
      sendingRequest.value = true;
      try {
        const requests = await saveAndSend({
          title: contactName.value || "Prepared quote",
          shop: activeShopId.value,
          selectedProduct: workspaceMode.value === "custom" && supportsStandaloneCustomPricing.value ? null : selectedProductId.value,
          calculatorInputsSnapshot: {
            pricing_mode: workspaceMode.value,
            quantity: normalizeNumberValue(quantity.value),
            paper: selectedPaperId.value,
            machine: selectedMachineId.value,
            color_mode: colorMode.value,
            sides: sides.value,
            finishings: selectedFinishings.value,
            size_mode: customSizeMode.value,
            size_label: customSizeLabel.value,
            input_unit: customInputUnit.value,
            width_input: customWidthInput.value,
            height_input: customHeightInput.value,
            width_mm: normalizeNumberValue(customWidthMm.value),
            height_mm: normalizeNumberValue(customHeightMm.value),
            notes: notes.value,
            selected_shop_slugs: selectedShopSlugs
          },
          pricingSnapshot: calculatorStore.preview,
          customProductSnapshot: workspaceMode.value === "custom" ? {
            title: normalizeOptionalText(customProductTitle.value),
            spec_text: normalizeOptionalText(customProductSpec.value),
            size_mode: customSizeMode.value,
            size_label: customSizeLabel.value,
            input_unit: customInputUnit.value,
            width_input: customWidthInput.value,
            height_input: customHeightInput.value,
            width_mm: normalizeNumberValue(customWidthMm.value),
            height_mm: normalizeNumberValue(customHeightMm.value)
          } : void 0,
          requestDetailsSnapshot: {
            customer_name: normalizeOptionalText(contactName.value),
            customer_phone: normalizeOptionalText(contactPhone.value),
            notes: normalizeOptionalText(notes.value),
            selected_shop_ids: selectedShops,
            selected_shop_slugs: selectedShopSlugs
          },
          selectedShopIds: selectedShops,
          loginRedirectPath: "/quote-draft"
        });
        if (requests?.length) {
          lastSentSummary.value = buildQuoteRequestSendSummary(requests);
          emit("draftSent", requests);
          void trackQuoteSubmit({
            source: props.mode === "hero" ? "backend_hero_calculator" : "backend_client_calculator",
            request_ids: lastSentSummary.value.requestIds,
            shop_count: lastSentSummary.value.shopCount,
            selected_shop_slugs: selectedShopSlugs,
            product_name: workspaceMode.value === "custom" ? normalizeOptionalText(customProductTitle.value) : selectedProductLabel.value || null
          });
          await activityBadgesStore.fetchSummary();
          const successToast = getQuoteRequestSendToast(lastSentSummary.value);
          toast.add({ title: successToast.title, description: successToast.description, color: "success" });
        }
      } catch (error) {
        sendError.value = error instanceof Error ? error.message : "Could not send this request. Please try again.";
        toast.add({ title: "Request not sent", description: sendError.value, color: "error" });
      } finally {
        sendingRequest.value = false;
      }
    }
    async function copyPreview() {
      const text = [
        workspaceMode.value === "custom" ? `Custom product: ${customProductTitle.value || "-"}` : `Product: ${selectedProductLabel.value || "-"}`,
        `Enquirer: ${contactName.value || "-"}`,
        `Phone: ${contactPhone.value || "-"}`,
        props.mode === "shop" ? `Email: ${contactEmail.value || "-"}` : null,
        props.mode === "shop" ? `Size: ${sizeSummary.value}` : null,
        `Colour mode: ${colorModeLabel.value}`,
        props.mode === "shop" ? `Turnaround: ${turnaroundLabel.value}` : null,
        `Total: ${previewGrandTotal.value || ""}`,
        `Paper: ${calculatorStore.preview?.paper?.label || ""}`,
        `Printing: ${calculatorStore.preview?.printing?.machine_name || ""}`,
        customProductSpec.value ? `Brief: ${customProductSpec.value}` : null
      ].filter(Boolean).join("\n");
      await (void 0).clipboard.writeText(text);
      toast.add({ title: "Copied", description: "Preview copied to the clipboard.", color: "success" });
    }
    function shareWhatsApp() {
      const total = previewGrandTotal.value || "";
      const lines = [
        "Quote preview",
        `Customer: ${contactName.value || "-"}`,
        `Phone: ${contactPhone.value || "-"}`,
        props.mode === "shop" ? `Email: ${contactEmail.value || "-"}` : null,
        workspaceMode.value === "custom" ? `Custom product: ${customProductTitle.value || "-"}` : `Product: ${selectedProductLabel.value || "-"}`,
        props.mode === "shop" ? `Size: ${sizeSummary.value}` : null,
        `Colour mode: ${colorModeLabel.value}`,
        props.mode === "shop" ? `Turnaround: ${turnaroundLabel.value}` : null,
        `Total: ${total || "-"}`,
        customProductSpec.value ? `Brief: ${customProductSpec.value}` : null
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));
      (void 0).open(`https://wa.me/?text=${text}`, "_blank", "noopener");
    }
    async function printPreview() {
      const target = quotePdfTargetRef.value;
      if (!target) {
        toast.add({ title: "Preview unavailable", description: "Quote preview is not ready for PDF export.", color: "warning" });
        return;
      }
      const printWindow = (void 0).open("", "_blank", "width=960,height=1280");
      if (!printWindow) {
        toast.add({ title: "Popup blocked", description: "Allow popups to open the printable quote preview.", color: "warning" });
        return;
      }
      const styleMarkup = Array.from((void 0).querySelectorAll('style, link[rel="stylesheet"]')).map((node) => node.outerHTML).join("\n");
      const printStyles = `
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #f4f4f5;
        color: #111827;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
      }

      body {
        padding: 24px;
      }

      .quote-pdf-page {
        max-width: 820px;
        margin: 0 auto;
      }

      #quote-pdf-target {
        border: 1px solid #d4d4d8 !important;
        border-radius: 24px !important;
        background: #ffffff !important;
        box-shadow: none !important;
        overflow: hidden;
      }

      #quote-pdf-target * {
        color: #111827 !important;
      }

      #quote-pdf-target .quote-preview-top {
        background: linear-gradient(135deg, #111827 0%, #1f2937 100%) !important;
      }

      #quote-pdf-target .quote-preview-top *,
      #quote-pdf-target .quote-preview-top .quote-preview-eyebrow,
      #quote-pdf-target .quote-preview-top .quote-preview-heading {
        color: #ffffff !important;
      }

      #quote-pdf-target .quote-preview-message {
        display: none !important;
      }

      @page {
        size: A4;
        margin: 14mm;
      }

      @media print {
        html, body {
          background: #ffffff !important;
        }

        body {
          padding: 0;
        }

        .quote-pdf-page {
          max-width: none;
          margin: 0;
        }
      }
    </style>
  `;
      printWindow.document.open();
      printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quote Preview PDF</title>
        ${styleMarkup}
        ${printStyles}
      </head>
      <body>
        <main class="quote-pdf-page">
          ${target.outerHTML}
        </main>
      </body>
    </html>
  `);
      printWindow.document.close();
      await new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        if (printWindow.document.readyState === "complete") {
          finish();
          return;
        }
        printWindow.addEventListener("load", finish, { once: true });
        (void 0).setTimeout(finish, 800);
      });
      printWindow.focus();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
      printWindow.print();
    }
    function resolveShopIdFromSlug(shopSlug) {
      return availableShops.value.find((shop) => shop.slug === shopSlug)?.id ?? null;
    }
    const selectedSendShopIds = computed(() => {
      const mappedShopIds = selectedSendShopSlugs.value.map((slug) => resolveShopIdFromSlug(slug)).filter((value) => typeof value === "number");
      if (mappedShopIds.length) return mappedShopIds;
      return activeShopId.value ? [activeShopId.value] : [];
    });
    const selectedProductLabel = computed(
      () => productOptions.value.find((product) => product.value === selectedProductId.value)?.label ?? ""
    );
    const selectedPaperLabel = computed(
      () => paperOptions.value.find((paper) => paper.value === selectedPaperId.value)?.label ?? calculatorStore.preview?.paper?.label ?? ""
    );
    const selectedShopName = computed(() => {
      if (props.fixedShopSlug && shopStore.currentShop?.slug === props.fixedShopSlug) {
        return shopStore.currentShop.name;
      }
      const option = shopOptions.value.find((shop) => shop.value === selectedShopSlug.value);
      return option?.label || selectedShopSlug.value || "Shop";
    });
    const sendActionLabel = computed(() => {
      const sharedLabel = getQuoteRequestSendLabel(lastSentSummary.value, sendingRequest.value);
      if (sharedLabel) return sharedLabel;
      if (!authStore.isAuthenticated) return "Sign in to send request";
      return selectedSendShopIds.value.length > 1 ? "Send request to selected shops" : "Send request to shop";
    });
    const sendFeedbackTone = computed(() => lastSentSummary.value ? "success" : "error");
    const sendFeedback = computed(() => {
      const sharedFeedback = getQuoteRequestSendFeedback(lastSentSummary.value);
      if (sharedFeedback) return sharedFeedback;
      return sendError.value;
    });
    const effectiveTitle = computed(() => props.mode === "shop" && props.title === "Max Calc" ? "Admin Page Calculator" : props.title);
    const previewEyebrow = computed(() => props.mode === "shop" ? "Active quotation" : "Quotation summary");
    const previewHeading = computed(() => quoteProductLabel.value || "Live quote summary");
    const previewIntro = computed(() => {
      if (props.mode === "shop") return "Backend-backed summary for the active shop workspace.";
      if (props.mode === "client") return "Save the draft, send it to selected print shops, or continue on WhatsApp.";
      return "Public-facing pricing preview with client details captured inline.";
    });
    const quoteProductLabel = computed(
      () => workspaceMode.value === "custom" ? customProductTitle.value || "Custom product" : selectedProductLabel.value || "Not selected"
    );
    const activeShopMeta = computed(() => ({
      name: activeShopProfile.value.name || selectedShopName.value || "Active shop",
      email: (props.mode === "shop" ? shopStore.currentShop?.business_email : activeShopProfile.value.business_email) || "Not available",
      phone: (props.mode === "shop" ? shopStore.currentShop?.phone_number : activeShopProfile.value.phone_number) || "Not available"
    }));
    const shopMetaLines = computed(() => [
      { label: "Shop name", value: activeShopMeta.value.name },
      { label: "Email", value: activeShopMeta.value.email },
      { label: "Phone", value: activeShopMeta.value.phone }
    ]);
    const clientMetaLines = computed(() => {
      const lines = [
        { label: "Name", value: contactName.value || "" },
        { label: "Email", value: contactEmail.value || "" },
        { label: "Phone", value: contactPhone.value || "" }
      ];
      return lines.filter((line) => line.value);
    });
    const quantitySummary = computed(() => {
      const normalized = normalizeNumberValue(quantity.value);
      return normalized ? `${normalized} pcs` : "Not set";
    });
    const sidesLabel = computed(() => sides.value === "DUPLEX" ? "Both sides" : "Front only");
    const colorModeLabel = computed(() => colorMode.value === "BW" ? "Black and white" : "Full colour");
    const sizeDisplayValue = computed(() => {
      if (workspaceMode.value === "custom") {
        return sizeSummary.value;
      }
      if (selectedSheetSize.value) return selectedSheetSize.value;
      const previewSize = calculatorStore.preview?.paper?.sheet_size;
      if (previewSize) return previewSize;
      const paperLabel = selectedPaperLabel.value;
      if (!paperLabel) return "Auto from product";
      return paperLabel.split(" · ")[0] || paperLabel;
    });
    const finishingSummaryLabel = computed(() => {
      if (!selectedFinishings.value.length) return "None";
      return selectedFinishings.value.map((entry) => {
        const finishing = finishingOptions.value.find((item) => Number(item.id) === entry.finishing_rate_id);
        if (!finishing) return "Finishing";
        if (isLamination(finishing)) {
          const sideLabel = entry.selected_side === "front" ? "front only" : entry.selected_side === "back" ? "back only" : "both sides";
          return `${finishing.name} (${sideLabel})`;
        }
        return String(finishing.name);
      }).join(", ");
    });
    const sizeSummary = computed(() => {
      const width = normalizeNumberValue(customWidthMm.value);
      const height = normalizeNumberValue(customHeightMm.value);
      if (!width || !height) return "Not set";
      return formatSizeSummary(width, height, workspaceMode.value === "custom" && customSizeMode.value === "standard" ? customSizeLabel.value : "");
    });
    const turnaroundLabel = computed(() => {
      const hours = normalizeNumberValue(turnaroundDays.value);
      if (!hours) return "On request";
      return `${hours} working hour${hours === 1 ? "" : "s"}`;
    });
    const productionMetaLines = computed(() => {
      const lines = [];
      if (calculatorStore.preview?.copies_per_sheet != null) {
        lines.unshift({
          label: "Production plan",
          value: `${calculatorStore.preview.copies_per_sheet}-up on sheet`
        });
      }
      if (calculatorStore.preview?.good_sheets != null) {
        lines.push({
          label: "Sheets required",
          value: `${calculatorStore.preview.good_sheets} good sheets`
        });
      }
      if (calculatorStore.preview?.parent_sheet_name) {
        lines.push({
          label: "Parent sheet",
          value: calculatorStore.preview.parent_sheet_name
        });
      }
      if (calculatorStore.preview?.rotated !== null && calculatorStore.preview?.rotated !== void 0) {
        lines.push({
          label: "Rotated",
          value: calculatorStore.preview.rotated ? "Yes" : "No"
        });
      }
      if (calculatorStore.preview?.printing?.machine_name) {
        lines.push({
          label: "Machine",
          value: calculatorStore.preview.printing.machine_name
        });
      }
      if (calculatorStore.preview?.reason) {
        lines.push({
          label: "Backend note",
          value: calculatorStore.preview.reason
        });
      }
      return lines;
    });
    const jobMetaLines = computed(() => [
      { label: "Product", value: quoteProductLabel.value },
      { label: "Quantity", value: quantitySummary.value },
      { label: "Size", value: sizeDisplayValue.value || "Pending" },
      { label: "Paper / GSM", value: selectedPaperLabel.value || "Pending" },
      { label: "Print sides", value: sidesLabel.value },
      { label: "Colour mode", value: colorModeLabel.value },
      { label: "Finishing", value: finishingSummaryLabel.value === "None" ? "None selected" : finishingSummaryLabel.value }
    ]);
    const finishingGroups = computed(() => {
      const lamination = finishingOptions.value.filter((finishing) => isLamination(finishing));
      const other = finishingOptions.value.filter((finishing) => !isLamination(finishing));
      const groups = [];
      if (lamination.length) groups.push({ label: "Lamination", options: lamination });
      if (other.length) groups.push({ label: "Other finishing", options: other });
      return groups;
    });
    const finishingHelperCopy = computed(
      () => finishingOptions.value.some((finishing) => isLamination(finishing)) ? "Lamination options are exclusive. Pick one lamination finish only when needed." : "Use backend finishing rules for the selected product."
    );
    const previewCurrency = computed(() => calculatorStore.preview?.currency ?? null);
    const { formatMoney } = useCurrencyFormatter(previewCurrency);
    const previewGrandTotal = computed(() => getPreviewMoney(calculatorStore.preview, "grand_total"));
    const previewUnitPrice = computed(() => getPreviewMoney(calculatorStore.preview, "unit_price"));
    const previewPrintCost = computed(() => getPreviewMoney(calculatorStore.preview, "print_cost"));
    const previewFinishingTotal = computed(() => getPreviewMoney(calculatorStore.preview, "finishing_total"));
    const totalDisplay = computed(
      () => formatMoney(previewGrandTotal.value, void 0, "Awaiting preview")
    );
    const hasBackendTotal = computed(
      () => Boolean(previewGrandTotal.value)
    );
    const perUnitDisplay = computed(() => {
      const unit = previewUnitPrice.value;
      if (!unit) return "Per-unit pricing appears after preview";
      return `${formatMoney(unit)} per unit`;
    });
    const totalHelperLine = computed(() => {
      if (calculatorStore.previewLoading) return "Refreshing backend pricing preview";
      if (!hasBackendTotal.value && calculatorStore.preview?.reason) {
        return `No final amount yet: ${calculatorStore.preview.reason}`;
      }
      if (calculatorStore.preview?.vat?.mode) {
        return `VAT ${calculatorStore.preview.vat.mode} from ${selectedShopName.value}`;
      }
      return `Live backend preview from ${selectedShopName.value}`;
    });
    const printCostDisplay = computed(
      () => formatMoney(previewPrintCost.value, void 0, formatMoney(0))
    );
    const duplexSurchargeOverride = computed(() => {
      if (duplexSurchargePreference.value === "on") return true;
      if (duplexSurchargePreference.value === "off") return false;
      return null;
    });
    const perSheetBreakdown = computed(() => extractPerSheetBreakdown(calculatorStore.preview));
    const priceBreakdownLines = computed(() => {
      const lines = [];
      const paperPrice = perSheetBreakdown.value.paperPrice;
      const frontPrint = perSheetBreakdown.value.frontPrint;
      const backPrint = perSheetBreakdown.value.backPrint;
      const duplexSurcharge = perSheetBreakdown.value.duplexSurcharge;
      const totalPerSheet = perSheetBreakdown.value.totalPerSheet;
      if (paperPrice) lines.push({ label: "Paper price / sheet", value: formatMoney(paperPrice) });
      if (frontPrint) lines.push({ label: "Front print", value: formatMoney(frontPrint) });
      if (sides.value === "DUPLEX" && backPrint && backPrint !== "0" && backPrint !== "0.00") {
        lines.push({ label: "Back print", value: formatMoney(backPrint) });
      }
      if (sides.value === "DUPLEX" && duplexSurcharge && duplexSurcharge !== "0" && duplexSurcharge !== "0.00") {
        lines.push({
          label: calculatorStore.preview?.printing?.duplex_surcharge_applied ? "Duplex surcharge" : "Duplex surcharge rule",
          value: formatMoney(duplexSurcharge)
        });
      }
      if (totalPerSheet) lines.push({ label: "Total / sheet", value: formatMoney(totalPerSheet) });
      if (perSheetBreakdown.value.formula) lines.push({ label: "Formula", value: perSheetBreakdown.value.formula });
      return lines;
    });
    const finishingTotalDisplay = computed(() => {
      const total = previewFinishingTotal.value;
      if (!total || total === "0" || total === "0.00") return formatMoney(0);
      return formatMoney(total);
    });
    const piecesPerSheetDisplay = computed(() => {
      const copiesPerSheet = calculatorStore.preview?.copies_per_sheet;
      return copiesPerSheet === null || copiesPerSheet === void 0 ? "" : String(copiesPerSheet);
    });
    const sheetsRequiredDisplay = computed(() => {
      const goodSheets = calculatorStore.preview?.good_sheets;
      return goodSheets === null || goodSheets === void 0 ? "" : String(goodSheets);
    });
    computed(
      () => props.mode === "shop" ? turnaroundLabel.value : "Live quote"
    );
    computed(() => {
      if (props.mode === "shop") return "Active shop";
      return "Shops on Printy";
    });
    computed(() => {
      if (props.mode === "shop") return selectedShopName.value;
      const count = availableShops.value.length || shopOptions.value.length || (selectedShopSlug.value ? 1 : 0);
      return `${count} shops`;
    });
    computed(() => {
      if (props.mode === "shop") return "pricing console";
      return selectedShopName.value;
    });
    const serviceNote = computed(() => {
      if (calculatorStore.preview?.reason) return calculatorStore.preview.reason;
      if (props.mode === "hero") return "Most shops on Printy respond fastest during working hours.";
      if (props.mode === "client") return "Save the draft first, then send it to one or more selected shops.";
      return "Use this workspace to prepare a live backend-backed quote before sharing it.";
    });
    const finishingBreakdownLines = computed(
      () => (calculatorStore.preview?.finishings ?? []).map((line, index) => ({
        key: `${line.slug || line.name}-${index}`,
        label: line.name,
        total: formatMoney(line.total, void 0, formatMoney(0))
      }))
    );
    computed(() => {
      if (!calculatorStore.preview && !selectedProductLabel.value && !customProductTitle.value) return [];
      const lines = [];
      lines.push(`${quantitySummary.value} ${quoteProductLabel.value}`);
      lines.push(`${colorModeLabel.value} · ${sidesLabel.value}`);
      if (sizeDisplayValue.value) {
        lines.push(`${sizeDisplayValue.value} · ${selectedPaperLabel.value || "Paper pending"}`);
      }
      if (finishingSummaryLabel.value !== "None") {
        lines.push(finishingSummaryLabel.value);
      }
      return lines;
    });
    const showPriceAdvice = computed(() => {
      const normalized = normalizeNumberValue(quantity.value);
      return Boolean(normalized && normalized < 500);
    });
    const { missingRequirements, canShowFinalPricing } = useCalculatorPreviewState({
      workspaceMode,
      hasProduct: computed(() => Boolean(selectedProductId.value)),
      customProductTitle,
      customProductSpec,
      quantity,
      widthMm: customWidthMm,
      heightMm: customHeightMm,
      paperId: selectedPaperId,
      sides,
      colorMode,
      machineId: selectedMachineId,
      turnaroundDays,
      preview: calculatorStore.preview
    });
    const requirementsHelper = computed(() => {
      if (calculatorStore.previewError) return calculatorStore.previewError;
      if (!hasBackendTotal.value && calculatorStore.preview?.reason) {
        return `Backend pricing has not produced a final amount yet: ${calculatorStore.preview.reason}`;
      }
      if (workspaceMode.value === "custom" && !supportsStandaloneCustomPricing.value) {
        return "This calculator still uses a catalog pricing source for custom jobs on this surface. Select a pricing-source product plus the backend paper, machine, sides, colour mode, and finishing ids to unlock final price.";
      }
      if (missingRequirements.value.length) {
        return `Final price appears after the required backend inputs are present: ${missingRequirements.value.join(", ")}.`;
      }
      if (!hasBackendTotal.value) {
        return "Backend preview did not return a final amount yet. Check the selected machine, paper, and pricing rules for this shop.";
      }
      return serviceNote.value;
    });
    async function signInForDraft() {
      await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
    }
    async function openDashboard() {
      await navigateTo("/dashboard");
    }
    async function openShopsDirectory() {
      await navigateTo("/shops");
    }
    async function runAction(handler) {
      if (!handler) return;
      await handler();
    }
    const primaryAction = computed(() => {
      if (props.mode === "shop") {
        return { label: "Preview & download PDF", run: printPreview, disabled: !calculatorStore.preview };
      }
      if (props.mode === "client") {
        return {
          label: sendActionLabel.value,
          run: sendDraft,
          disabled: !calculatorStore.preview || sendingRequest.value || !selectedSendShopIds.value.length || !!lastSentSummary.value
        };
      }
      if (showDashboardRoute.value) {
        return { label: "Open dashboard", run: openDashboard, disabled: false };
      }
      return { label: "Find another print shop", run: openShopsDirectory, disabled: false };
    });
    const secondaryAction = computed(() => {
      if (props.mode === "shop") {
        return { label: "Copy quote", run: copyPreview, disabled: !calculatorStore.preview };
      }
      if (props.mode === "client") {
        return { label: "Save draft", run: saveDraft, disabled: !calculatorStore.preview };
      }
      if (authStore.isClient) {
        return {
          label: sendActionLabel.value,
          run: sendDraft,
          disabled: !calculatorStore.preview || sendingRequest.value || !selectedSendShopIds.value.length || !!lastSentSummary.value
        };
      }
      return { label: "Sign in to download PDF", run: signInForDraft, disabled: false };
    });
    const tertiaryAction = computed(() => {
      if (props.mode === "shop" || props.mode === "client") {
        return { label: "Send via WhatsApp", run: shareWhatsApp, disabled: !calculatorStore.preview };
      }
      if (authStore.isClient) {
        return { label: "Save draft", run: saveDraft, disabled: !calculatorStore.preview };
      }
      return null;
    });
    const showDashboardRoute = computed(() => isHeroMode.value && (authStore.isShopOwner || authStore.isStaffRole));
    const isHeroMode = computed(() => props.mode === "hero");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$4;
      const _component_USelectMenu = _sfc_main$5;
      const _component_UTextarea = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-1ac11c00>`);
      _push(ssrRenderComponent(CalculatorShell, { "anchor-id": __props.anchorId }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(CalculatorHeaderBlock, {
              eyebrow: __props.eyebrow,
              title: unref(effectiveTitle),
              description: __props.description,
              compact: unref(compactMode)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(CalculatorHeaderBlock, {
                eyebrow: __props.eyebrow,
                title: unref(effectiveTitle),
                description: __props.description,
                compact: unref(compactMode)
              }, null, 8, ["eyebrow", "title", "description", "compact"])
            ];
          }
        }),
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(CalculatorFormGrid, { onSubmit: previewQuote }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(showQuoteModeToggle)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Quote mode" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(CalculatorQuoteModeToggle, {
                            "model-value": unref(workspaceMode),
                            options: quoteModeOptions,
                            "onUpdate:modelValue": updateWorkspaceMode
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(CalculatorQuoteModeToggle, {
                              "model-value": unref(workspaceMode),
                              options: quoteModeOptions,
                              "onUpdate:modelValue": updateWorkspaceMode
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(showClientFields)) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2" data-v-1ac11c00${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Client / enquirer" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(contactName),
                            "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "Client or company name"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(contactName),
                              "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
                              ui: calculatorInputUi,
                              placeholder: "Client or company name"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Phone / contact" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(contactPhone),
                            "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "+254..."
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(contactPhone),
                              "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
                              ui: calculatorInputUi,
                              placeholder: "+254..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (props.mode === "shop") {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Email" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(contactEmail),
                            "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
                            ui: calculatorInputUi,
                            type: "email",
                            placeholder: "name@example.com"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(contactEmail),
                              "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
                              ui: calculatorInputUi,
                              type: "email",
                              placeholder: "name@example.com"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(showPreviewShopField)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: unref(allowShopSelection) ? "Print shop" : "Active shop"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(allowShopSelection)) {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(selectedShopSlug) ?? void 0,
                              items: unref(shopOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedShopSlug.value = unref(normalizeSelectValue)($event) ?? null
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_UInput, {
                              "model-value": unref(selectedShopName),
                              ui: calculatorInputUi,
                              readonly: "",
                              disabled: ""
                            }, null, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            unref(allowShopSelection) ? (openBlock(), createBlock(_component_USelectMenu, {
                              key: 0,
                              "model-value": unref(selectedShopSlug) ?? void 0,
                              items: unref(shopOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedShopSlug.value = unref(normalizeSelectValue)($event) ?? null
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                              key: 1,
                              "model-value": unref(selectedShopName),
                              ui: calculatorInputUi,
                              readonly: "",
                              disabled: ""
                            }, null, 8, ["model-value"]))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if ((props.mode === "client" || props.mode === "hero") && unref(shopOptions).length > 1) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: "Selected shops",
                      help: "Pricing previews use the first selected shop. Sending uses every selected shop."
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(QuotesShopSelectionChips, {
                            shops: unref(shopOptions).map((shop) => ({ slug: shop.value, label: shop.label })),
                            "selected-slugs": unref(selectedSendShopSlugs),
                            onToggle: (slug) => toggleSendShop(slug, !unref(selectedSendShopSlugs).includes(slug))
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(QuotesShopSelectionChips, {
                              shops: unref(shopOptions).map((shop) => ({ slug: shop.value, label: shop.label })),
                              "selected-slugs": unref(selectedSendShopSlugs),
                              onToggle: (slug) => toggleSendShop(slug, !unref(selectedSendShopSlugs).includes(slug))
                            }, null, 8, ["shops", "selected-slugs", "onToggle"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid gap-4 md:grid-cols-2" data-v-1ac11c00${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, {
                    label: unref(workspaceMode) === "custom" ? "Custom product" : "Product"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(workspaceMode) === "custom") {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(customProductTitle),
                            "onUpdate:modelValue": ($event) => isRef(customProductTitle) ? customProductTitle.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "Custom product title"
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(selectedProductId) ?? void 0,
                            items: unref(productOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedProductId.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          unref(workspaceMode) === "custom" ? (openBlock(), createBlock(_component_UInput, {
                            key: 0,
                            modelValue: unref(customProductTitle),
                            "onUpdate:modelValue": ($event) => isRef(customProductTitle) ? customProductTitle.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "Custom product title"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_USelectMenu, {
                            key: 1,
                            "model-value": unref(selectedProductId) ?? void 0,
                            items: unref(productOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedProductId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Quantity" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(quantity),
                          "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
                          ui: calculatorInputUi,
                          type: "number",
                          min: "1"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(quantity),
                            "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "1"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (unref(workspaceMode) === "custom") {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Custom brief" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UTextarea, {
                            modelValue: unref(customProductSpec),
                            "onUpdate:modelValue": ($event) => isRef(customProductSpec) ? customProductSpec.value = $event : null,
                            ui: calculatorTextareaUi,
                            rows: 3,
                            placeholder: "Describe the stock, finishing, and special handling."
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(customProductSpec),
                              "onUpdate:modelValue": ($event) => isRef(customProductSpec) ? customProductSpec.value = $event : null,
                              ui: calculatorTextareaUi,
                              rows: 3,
                              placeholder: "Describe the stock, finishing, and special handling."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid gap-4 md:grid-cols-2" data-v-1ac11c00${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Size" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(workspaceMode) !== "custom") {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(selectedSheetSize) ?? void 0,
                            items: unref(sheetSizeOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedSheetSize.value = unref(normalizeSelectValue)($event) ?? null
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<div class="space-y-3" data-v-1ac11c00${_scopeId3}><div class="grid gap-3 md:grid-cols-2" data-v-1ac11c00${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(customSizeMode),
                            items: sizeModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": handleCustomSizeModeChange
                          }, null, _parent4, _scopeId3));
                          if (unref(customSizeMode) === "standard") {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(customSizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomSizePresetChange
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(customInputUnit),
                              items: sizeUnitOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomInputUnitChange
                            }, null, _parent4, _scopeId3));
                          }
                          _push4(`</div><div class="${ssrRenderClass([unref(customSizeMode) === "standard" ? "md:grid-cols-3" : "md:grid-cols-2", "grid gap-3"])}" data-v-1ac11c00${_scopeId3}>`);
                          if (unref(customSizeMode) === "standard") {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(customInputUnit),
                              items: sizeUnitOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomInputUnitChange
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(customWidthInput) || void 0,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            placeholder: `Width (${unref(customInputUnit)})`,
                            readonly: unref(customSizeMode) === "standard",
                            disabled: unref(customSizeMode) === "standard",
                            "onUpdate:modelValue": handleCustomWidthInputChange
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(customHeightInput) || void 0,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            placeholder: `Height (${unref(customInputUnit)})`,
                            readonly: unref(customSizeMode) === "standard",
                            disabled: unref(customSizeMode) === "standard",
                            "onUpdate:modelValue": handleCustomHeightInputChange
                          }, null, _parent4, _scopeId3));
                          _push4(`</div></div>`);
                        }
                      } else {
                        return [
                          unref(workspaceMode) !== "custom" ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            "model-value": unref(selectedSheetSize) ?? void 0,
                            items: unref(sheetSizeOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedSheetSize.value = unref(normalizeSelectValue)($event) ?? null
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-3"
                          }, [
                            createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                              createVNode(_component_USelectMenu, {
                                "model-value": unref(customSizeMode),
                                items: sizeModeOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomSizeModeChange
                              }, null, 8, ["model-value", "ui"]),
                              unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                                key: 0,
                                "model-value": unref(customSizeLabel),
                                items: unref(sizePresetOptions),
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomSizePresetChange
                              }, null, 8, ["model-value", "items", "ui"])) : (openBlock(), createBlock(_component_USelectMenu, {
                                key: 1,
                                "model-value": unref(customInputUnit),
                                items: sizeUnitOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomInputUnitChange
                              }, null, 8, ["model-value", "ui"]))
                            ]),
                            createVNode("div", {
                              class: ["grid gap-3", unref(customSizeMode) === "standard" ? "md:grid-cols-3" : "md:grid-cols-2"]
                            }, [
                              unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                                key: 0,
                                "model-value": unref(customInputUnit),
                                items: sizeUnitOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomInputUnitChange
                              }, null, 8, ["model-value", "ui"])) : createCommentVNode("", true),
                              createVNode(_component_UInput, {
                                "model-value": unref(customWidthInput) || void 0,
                                ui: calculatorInputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: `Width (${unref(customInputUnit)})`,
                                readonly: unref(customSizeMode) === "standard",
                                disabled: unref(customSizeMode) === "standard",
                                "onUpdate:modelValue": handleCustomWidthInputChange
                              }, null, 8, ["model-value", "placeholder", "readonly", "disabled"]),
                              createVNode(_component_UInput, {
                                "model-value": unref(customHeightInput) || void 0,
                                ui: calculatorInputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: `Height (${unref(customInputUnit)})`,
                                readonly: unref(customSizeMode) === "standard",
                                disabled: unref(customSizeMode) === "standard",
                                "onUpdate:modelValue": handleCustomHeightInputChange
                              }, null, 8, ["model-value", "placeholder", "readonly", "disabled"])
                            ], 2)
                          ]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Print sides" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(sides),
                          "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(sides),
                            "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (unref(sides) === "DUPLEX" && unref(selectedPaperId)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: "Duplex surcharge",
                      help: "Leave on Auto to use the shop rule. Turn it on or off only when you need to override the default duplex wear-and-tear rule."
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            modelValue: unref(duplexSurchargePreference),
                            "onUpdate:modelValue": ($event) => isRef(duplexSurchargePreference) ? duplexSurchargePreference.value = $event : null,
                            items: duplexSurchargeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(duplexSurchargePreference),
                              "onUpdate:modelValue": ($event) => isRef(duplexSurchargePreference) ? duplexSurchargePreference.value = $event : null,
                              items: duplexSurchargeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid gap-4 md:grid-cols-2" data-v-1ac11c00${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Paper / GSM" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          "model-value": unref(selectedPaperId) ?? void 0,
                          items: unref(paperOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Colour mode" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(colorMode),
                          "onUpdate:modelValue": ($event) => isRef(colorMode) ? colorMode.value = $event : null,
                          items: colorModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(colorMode),
                            "onUpdate:modelValue": ($event) => isRef(colorMode) ? colorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-4 md:grid-cols-2" data-v-1ac11c00${_scopeId2}>`);
                  if (unref(machineOptions).length > 1 || props.mode === "shop") {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Machine" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(selectedMachineId) ?? void 0,
                            items: unref(machineOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedMachineId.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(selectedMachineId) ?? void 0,
                              items: unref(machineOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedMachineId.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Turnaround" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          modelValue: unref(turnaroundDays),
                          "onUpdate:modelValue": ($event) => isRef(turnaroundDays) ? turnaroundDays.value = $event : null,
                          ui: calculatorInputUi,
                          type: "number",
                          min: "1",
                          placeholder: "6 working hours"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            modelValue: unref(turnaroundDays),
                            "onUpdate:modelValue": ($event) => isRef(turnaroundDays) ? turnaroundDays.value = $event : null,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "1",
                            placeholder: "6 working hours"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, {
                    label: "Finishing services",
                    help: unref(finishingHelperCopy)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(FinishingSelector, {
                          groups: unref(finishingGroups),
                          "lamination-sides": laminationSides,
                          "select-ui": unref(legacySelectUi),
                          "is-selected": isFinishingSelected,
                          "show-side-selector": isFinishingSideOpen,
                          "get-side": selectedFinishingSide,
                          onToggle: toggleFinishing,
                          onUpdateSide: updateFinishingSide
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(FinishingSelector, {
                            groups: unref(finishingGroups),
                            "lamination-sides": laminationSides,
                            "select-ui": unref(legacySelectUi),
                            "is-selected": isFinishingSelected,
                            "show-side-selector": isFinishingSideOpen,
                            "get-side": selectedFinishingSide,
                            onToggle: toggleFinishing,
                            onUpdateSide: updateFinishingSide
                          }, null, 8, ["groups", "select-ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (props.mode !== "hero") {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Notes" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UTextarea, {
                            modelValue: unref(notes),
                            "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                            ui: calculatorTextareaUi,
                            rows: 3,
                            placeholder: "Turnaround, delivery notes, or customer context"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(notes),
                              "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                              ui: calculatorTextareaUi,
                              rows: 3,
                              placeholder: "Turnaround, delivery notes, or customer context"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(showQuoteModeToggle) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 0,
                      label: "Quote mode"
                    }, {
                      default: withCtx(() => [
                        createVNode(CalculatorQuoteModeToggle, {
                          "model-value": unref(workspaceMode),
                          options: quoteModeOptions,
                          "onUpdate:modelValue": updateWorkspaceMode
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    unref(showClientFields) ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "grid gap-4 md:grid-cols-2"
                    }, [
                      createVNode(CalculatorFieldGroup, { label: "Client / enquirer" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(contactName),
                            "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "Client or company name"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Phone / contact" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(contactPhone),
                            "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "+254..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true),
                    props.mode === "shop" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 2,
                      label: "Email"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(contactEmail),
                          "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
                          ui: calculatorInputUi,
                          type: "email",
                          placeholder: "name@example.com"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    unref(showPreviewShopField) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 3,
                      label: unref(allowShopSelection) ? "Print shop" : "Active shop"
                    }, {
                      default: withCtx(() => [
                        unref(allowShopSelection) ? (openBlock(), createBlock(_component_USelectMenu, {
                          key: 0,
                          "model-value": unref(selectedShopSlug) ?? void 0,
                          items: unref(shopOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedShopSlug.value = unref(normalizeSelectValue)($event) ?? null
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                          key: 1,
                          "model-value": unref(selectedShopName),
                          ui: calculatorInputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"]))
                      ]),
                      _: 1
                    }, 8, ["label"])) : createCommentVNode("", true),
                    (props.mode === "client" || props.mode === "hero") && unref(shopOptions).length > 1 ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 4,
                      label: "Selected shops",
                      help: "Pricing previews use the first selected shop. Sending uses every selected shop."
                    }, {
                      default: withCtx(() => [
                        createVNode(QuotesShopSelectionChips, {
                          shops: unref(shopOptions).map((shop) => ({ slug: shop.value, label: shop.label })),
                          "selected-slugs": unref(selectedSendShopSlugs),
                          onToggle: (slug) => toggleSendShop(slug, !unref(selectedSendShopSlugs).includes(slug))
                        }, null, 8, ["shops", "selected-slugs", "onToggle"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, {
                        label: unref(workspaceMode) === "custom" ? "Custom product" : "Product"
                      }, {
                        default: withCtx(() => [
                          unref(workspaceMode) === "custom" ? (openBlock(), createBlock(_component_UInput, {
                            key: 0,
                            modelValue: unref(customProductTitle),
                            "onUpdate:modelValue": ($event) => isRef(customProductTitle) ? customProductTitle.value = $event : null,
                            ui: calculatorInputUi,
                            placeholder: "Custom product title"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_USelectMenu, {
                            key: 1,
                            "model-value": unref(selectedProductId) ?? void 0,
                            items: unref(productOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedProductId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"]))
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(quantity),
                            "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "1"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    unref(workspaceMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 5,
                      label: "Custom brief"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(customProductSpec),
                          "onUpdate:modelValue": ($event) => isRef(customProductSpec) ? customProductSpec.value = $event : null,
                          ui: calculatorTextareaUi,
                          rows: 3,
                          placeholder: "Describe the stock, finishing, and special handling."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Size" }, {
                        default: withCtx(() => [
                          unref(workspaceMode) !== "custom" ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            "model-value": unref(selectedSheetSize) ?? void 0,
                            items: unref(sheetSizeOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedSheetSize.value = unref(normalizeSelectValue)($event) ?? null
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-3"
                          }, [
                            createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                              createVNode(_component_USelectMenu, {
                                "model-value": unref(customSizeMode),
                                items: sizeModeOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomSizeModeChange
                              }, null, 8, ["model-value", "ui"]),
                              unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                                key: 0,
                                "model-value": unref(customSizeLabel),
                                items: unref(sizePresetOptions),
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomSizePresetChange
                              }, null, 8, ["model-value", "items", "ui"])) : (openBlock(), createBlock(_component_USelectMenu, {
                                key: 1,
                                "model-value": unref(customInputUnit),
                                items: sizeUnitOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomInputUnitChange
                              }, null, 8, ["model-value", "ui"]))
                            ]),
                            createVNode("div", {
                              class: ["grid gap-3", unref(customSizeMode) === "standard" ? "md:grid-cols-3" : "md:grid-cols-2"]
                            }, [
                              unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                                key: 0,
                                "model-value": unref(customInputUnit),
                                items: sizeUnitOptions,
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(legacySelectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleCustomInputUnitChange
                              }, null, 8, ["model-value", "ui"])) : createCommentVNode("", true),
                              createVNode(_component_UInput, {
                                "model-value": unref(customWidthInput) || void 0,
                                ui: calculatorInputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: `Width (${unref(customInputUnit)})`,
                                readonly: unref(customSizeMode) === "standard",
                                disabled: unref(customSizeMode) === "standard",
                                "onUpdate:modelValue": handleCustomWidthInputChange
                              }, null, 8, ["model-value", "placeholder", "readonly", "disabled"]),
                              createVNode(_component_UInput, {
                                "model-value": unref(customHeightInput) || void 0,
                                ui: calculatorInputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: `Height (${unref(customInputUnit)})`,
                                readonly: unref(customSizeMode) === "standard",
                                disabled: unref(customSizeMode) === "standard",
                                "onUpdate:modelValue": handleCustomHeightInputChange
                              }, null, 8, ["model-value", "placeholder", "readonly", "disabled"])
                            ], 2)
                          ]))
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Print sides" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(sides),
                            "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      })
                    ]),
                    unref(sides) === "DUPLEX" && unref(selectedPaperId) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 6,
                      label: "Duplex surcharge",
                      help: "Leave on Auto to use the shop rule. Turn it on or off only when you need to override the default duplex wear-and-tear rule."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(duplexSurchargePreference),
                          "onUpdate:modelValue": ($event) => isRef(duplexSurchargePreference) ? duplexSurchargePreference.value = $event : null,
                          items: duplexSurchargeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Paper / GSM" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Colour mode" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(colorMode),
                            "onUpdate:modelValue": ($event) => isRef(colorMode) ? colorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      unref(machineOptions).length > 1 || props.mode === "shop" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                        key: 0,
                        label: "Machine"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedMachineId) ?? void 0,
                            items: unref(machineOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(legacySelectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedMachineId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(CalculatorFieldGroup, { label: "Turnaround" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(turnaroundDays),
                            "onUpdate:modelValue": ($event) => isRef(turnaroundDays) ? turnaroundDays.value = $event : null,
                            ui: calculatorInputUi,
                            type: "number",
                            min: "1",
                            placeholder: "6 working hours"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(CalculatorFieldGroup, {
                      label: "Finishing services",
                      help: unref(finishingHelperCopy)
                    }, {
                      default: withCtx(() => [
                        createVNode(FinishingSelector, {
                          groups: unref(finishingGroups),
                          "lamination-sides": laminationSides,
                          "select-ui": unref(legacySelectUi),
                          "is-selected": isFinishingSelected,
                          "show-side-selector": isFinishingSideOpen,
                          "get-side": selectedFinishingSide,
                          onToggle: toggleFinishing,
                          onUpdateSide: updateFinishingSide
                        }, null, 8, ["groups", "select-ui"])
                      ]),
                      _: 1
                    }, 8, ["help"]),
                    props.mode !== "hero" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 7,
                      label: "Notes"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(notes),
                          "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                          ui: calculatorTextareaUi,
                          rows: 3,
                          placeholder: "Turnaround, delivery notes, or customer context"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(CalculatorFormGrid, { onSubmit: previewQuote }, {
                default: withCtx(() => [
                  unref(showQuoteModeToggle) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 0,
                    label: "Quote mode"
                  }, {
                    default: withCtx(() => [
                      createVNode(CalculatorQuoteModeToggle, {
                        "model-value": unref(workspaceMode),
                        options: quoteModeOptions,
                        "onUpdate:modelValue": updateWorkspaceMode
                      }, null, 8, ["model-value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(showClientFields) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "grid gap-4 md:grid-cols-2"
                  }, [
                    createVNode(CalculatorFieldGroup, { label: "Client / enquirer" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(contactName),
                          "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
                          ui: calculatorInputUi,
                          placeholder: "Client or company name"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(CalculatorFieldGroup, { label: "Phone / contact" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(contactPhone),
                          "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
                          ui: calculatorInputUi,
                          placeholder: "+254..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true),
                  props.mode === "shop" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 2,
                    label: "Email"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(contactEmail),
                        "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
                        ui: calculatorInputUi,
                        type: "email",
                        placeholder: "name@example.com"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(showPreviewShopField) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 3,
                    label: unref(allowShopSelection) ? "Print shop" : "Active shop"
                  }, {
                    default: withCtx(() => [
                      unref(allowShopSelection) ? (openBlock(), createBlock(_component_USelectMenu, {
                        key: 0,
                        "model-value": unref(selectedShopSlug) ?? void 0,
                        items: unref(shopOptions),
                        "value-key": "value",
                        "label-key": "label",
                        ui: unref(legacySelectUi),
                        portal: "body",
                        class: "w-full",
                        "onUpdate:modelValue": ($event) => selectedShopSlug.value = unref(normalizeSelectValue)($event) ?? null
                      }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                        key: 1,
                        "model-value": unref(selectedShopName),
                        ui: calculatorInputUi,
                        readonly: "",
                        disabled: ""
                      }, null, 8, ["model-value"]))
                    ]),
                    _: 1
                  }, 8, ["label"])) : createCommentVNode("", true),
                  (props.mode === "client" || props.mode === "hero") && unref(shopOptions).length > 1 ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 4,
                    label: "Selected shops",
                    help: "Pricing previews use the first selected shop. Sending uses every selected shop."
                  }, {
                    default: withCtx(() => [
                      createVNode(QuotesShopSelectionChips, {
                        shops: unref(shopOptions).map((shop) => ({ slug: shop.value, label: shop.label })),
                        "selected-slugs": unref(selectedSendShopSlugs),
                        onToggle: (slug) => toggleSendShop(slug, !unref(selectedSendShopSlugs).includes(slug))
                      }, null, 8, ["shops", "selected-slugs", "onToggle"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    createVNode(CalculatorFieldGroup, {
                      label: unref(workspaceMode) === "custom" ? "Custom product" : "Product"
                    }, {
                      default: withCtx(() => [
                        unref(workspaceMode) === "custom" ? (openBlock(), createBlock(_component_UInput, {
                          key: 0,
                          modelValue: unref(customProductTitle),
                          "onUpdate:modelValue": ($event) => isRef(customProductTitle) ? customProductTitle.value = $event : null,
                          ui: calculatorInputUi,
                          placeholder: "Custom product title"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_USelectMenu, {
                          key: 1,
                          "model-value": unref(selectedProductId) ?? void 0,
                          items: unref(productOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedProductId.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"]))
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(quantity),
                          "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
                          ui: calculatorInputUi,
                          type: "number",
                          min: "1"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  unref(workspaceMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 5,
                    label: "Custom brief"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(customProductSpec),
                        "onUpdate:modelValue": ($event) => isRef(customProductSpec) ? customProductSpec.value = $event : null,
                        ui: calculatorTextareaUi,
                        rows: 3,
                        placeholder: "Describe the stock, finishing, and special handling."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    createVNode(CalculatorFieldGroup, { label: "Size" }, {
                      default: withCtx(() => [
                        unref(workspaceMode) !== "custom" ? (openBlock(), createBlock(_component_USelectMenu, {
                          key: 0,
                          "model-value": unref(selectedSheetSize) ?? void 0,
                          items: unref(sheetSizeOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedSheetSize.value = unref(normalizeSelectValue)($event) ?? null
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "space-y-3"
                        }, [
                          createVNode("div", { class: "grid gap-3 md:grid-cols-2" }, [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(customSizeMode),
                              items: sizeModeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomSizeModeChange
                            }, null, 8, ["model-value", "ui"]),
                            unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                              key: 0,
                              "model-value": unref(customSizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomSizePresetChange
                            }, null, 8, ["model-value", "items", "ui"])) : (openBlock(), createBlock(_component_USelectMenu, {
                              key: 1,
                              "model-value": unref(customInputUnit),
                              items: sizeUnitOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomInputUnitChange
                            }, null, 8, ["model-value", "ui"]))
                          ]),
                          createVNode("div", {
                            class: ["grid gap-3", unref(customSizeMode) === "standard" ? "md:grid-cols-3" : "md:grid-cols-2"]
                          }, [
                            unref(customSizeMode) === "standard" ? (openBlock(), createBlock(_component_USelectMenu, {
                              key: 0,
                              "model-value": unref(customInputUnit),
                              items: sizeUnitOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(legacySelectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleCustomInputUnitChange
                            }, null, 8, ["model-value", "ui"])) : createCommentVNode("", true),
                            createVNode(_component_UInput, {
                              "model-value": unref(customWidthInput) || void 0,
                              ui: calculatorInputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: `Width (${unref(customInputUnit)})`,
                              readonly: unref(customSizeMode) === "standard",
                              disabled: unref(customSizeMode) === "standard",
                              "onUpdate:modelValue": handleCustomWidthInputChange
                            }, null, 8, ["model-value", "placeholder", "readonly", "disabled"]),
                            createVNode(_component_UInput, {
                              "model-value": unref(customHeightInput) || void 0,
                              ui: calculatorInputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: `Height (${unref(customInputUnit)})`,
                              readonly: unref(customSizeMode) === "standard",
                              disabled: unref(customSizeMode) === "standard",
                              "onUpdate:modelValue": handleCustomHeightInputChange
                            }, null, 8, ["model-value", "placeholder", "readonly", "disabled"])
                          ], 2)
                        ]))
                      ]),
                      _: 1
                    }),
                    createVNode(CalculatorFieldGroup, { label: "Print sides" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(sides),
                          "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      _: 1
                    })
                  ]),
                  unref(sides) === "DUPLEX" && unref(selectedPaperId) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 6,
                    label: "Duplex surcharge",
                    help: "Leave on Auto to use the shop rule. Turn it on or off only when you need to override the default duplex wear-and-tear rule."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(duplexSurchargePreference),
                        "onUpdate:modelValue": ($event) => isRef(duplexSurchargePreference) ? duplexSurchargePreference.value = $event : null,
                        items: duplexSurchargeOptions,
                        "value-key": "value",
                        "label-key": "label",
                        ui: unref(legacySelectUi),
                        portal: "body",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    createVNode(CalculatorFieldGroup, { label: "Paper / GSM" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          "model-value": unref(selectedPaperId) ?? void 0,
                          items: unref(paperOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(CalculatorFieldGroup, { label: "Colour mode" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(colorMode),
                          "onUpdate:modelValue": ($event) => isRef(colorMode) ? colorMode.value = $event : null,
                          items: colorModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                    unref(machineOptions).length > 1 || props.mode === "shop" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 0,
                      label: "Machine"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          "model-value": unref(selectedMachineId) ?? void 0,
                          items: unref(machineOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(legacySelectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedMachineId.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(CalculatorFieldGroup, { label: "Turnaround" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(turnaroundDays),
                          "onUpdate:modelValue": ($event) => isRef(turnaroundDays) ? turnaroundDays.value = $event : null,
                          ui: calculatorInputUi,
                          type: "number",
                          min: "1",
                          placeholder: "6 working hours"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(CalculatorFieldGroup, {
                    label: "Finishing services",
                    help: unref(finishingHelperCopy)
                  }, {
                    default: withCtx(() => [
                      createVNode(FinishingSelector, {
                        groups: unref(finishingGroups),
                        "lamination-sides": laminationSides,
                        "select-ui": unref(legacySelectUi),
                        "is-selected": isFinishingSelected,
                        "show-side-selector": isFinishingSideOpen,
                        "get-side": selectedFinishingSide,
                        onToggle: toggleFinishing,
                        onUpdateSide: updateFinishingSide
                      }, null, 8, ["groups", "select-ui"])
                    ]),
                    _: 1
                  }, 8, ["help"]),
                  props.mode !== "hero" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 7,
                    label: "Notes"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(notes),
                        "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
                        ui: calculatorTextareaUi,
                        rows: 3,
                        placeholder: "Turnaround, delivery notes, or customer context"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        preview: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4" data-v-1ac11c00${_scopeId}><div id="quote-pdf-target" data-v-1ac11c00${_scopeId}>`);
            _push2(ssrRenderComponent(QuotePreviewPanel, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4" data-v-1ac11c00${_scopeId2}><div class="border-b border-slate-200 pb-3" data-v-1ac11c00${_scopeId2}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500" data-v-1ac11c00${_scopeId2}>${ssrInterpolate(unref(previewEyebrow))}</p><h3 class="mt-1 text-xl font-semibold text-slate-900" data-v-1ac11c00${_scopeId2}>${ssrInterpolate(unref(previewHeading))}</h3><p class="mt-1 text-sm text-slate-500" data-v-1ac11c00${_scopeId2}>${ssrInterpolate(unref(previewIntro))}</p></div>`);
                  if (props.mode === "hero") {
                    _push3(ssrRenderComponent(ClientDetailsInlineForm, {
                      name: unref(contactName),
                      phone: unref(contactPhone),
                      email: unref(contactEmail),
                      "input-ui": lightInputUi,
                      "onUpdate:name": ($event) => contactName.value = $event,
                      "onUpdate:phone": ($event) => contactPhone.value = $event,
                      "onUpdate:email": ($event) => contactEmail.value = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (props.mode === "hero" && !unref(authStore).isAuthenticated) {
                    _push3(`<div class="text-xs text-slate-500" data-v-1ac11c00${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: "/auth/signup?redirect=/quote-draft",
                      class: "font-semibold text-flamingo-600 hover:text-flamingo-700"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Create a client account `);
                        } else {
                          return [
                            createTextVNode(" Create a client account ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(` to save this pricing context in your requests and quotes workspace. </div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: "Active shop",
                    lines: unref(shopMetaLines),
                    placeholder: "Available after shop load"
                  }, null, _parent3, _scopeId2));
                  if (unref(clientMetaLines).length) {
                    _push3(ssrRenderComponent(QuotePreviewMeta, {
                      title: "Client",
                      lines: unref(clientMetaLines),
                      placeholder: "Not provided"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: "Job summary",
                    lines: unref(jobMetaLines),
                    placeholder: "Pending"
                  }, null, _parent3, _scopeId2));
                  if (unref(productionMetaLines).length) {
                    _push3(ssrRenderComponent(QuotePreviewMeta, {
                      title: "Production plan",
                      lines: unref(productionMetaLines)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!unref(canShowFinalPricing)) {
                    _push3(ssrRenderComponent(QuotePreviewRequirementsState, {
                      title: "Complete these details to calculate final price",
                      items: unref(missingRequirements),
                      helper: unref(requirementsHelper)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(QuotePreviewPriceState, {
                      "print-subtotal": unref(printCostDisplay),
                      "finishing-total": unref(finishingTotalDisplay),
                      total: unref(totalDisplay),
                      "per-unit": unref(perUnitDisplay),
                      helper: unref(totalHelperLine),
                      "pieces-per-sheet": unref(piecesPerSheetDisplay),
                      "sheets-required": unref(sheetsRequiredDisplay),
                      "cost-lines": unref(priceBreakdownLines)
                    }, null, _parent3, _scopeId2));
                  }
                  if (unref(selectedFinishings).length) {
                    _push3(ssrRenderComponent(QuotePreviewMeta, {
                      title: "Finishing summary",
                      lines: unref(finishingBreakdownLines).map((line) => ({ label: line.label, value: line.total }))
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "border-b border-slate-200 pb-3" }, [
                        createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500" }, toDisplayString(unref(previewEyebrow)), 1),
                        createVNode("h3", { class: "mt-1 text-xl font-semibold text-slate-900" }, toDisplayString(unref(previewHeading)), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(previewIntro)), 1)
                      ]),
                      props.mode === "hero" ? (openBlock(), createBlock(ClientDetailsInlineForm, {
                        key: 0,
                        name: unref(contactName),
                        phone: unref(contactPhone),
                        email: unref(contactEmail),
                        "input-ui": lightInputUi,
                        "onUpdate:name": ($event) => contactName.value = $event,
                        "onUpdate:phone": ($event) => contactPhone.value = $event,
                        "onUpdate:email": ($event) => contactEmail.value = $event
                      }, null, 8, ["name", "phone", "email", "onUpdate:name", "onUpdate:phone", "onUpdate:email"])) : createCommentVNode("", true),
                      props.mode === "hero" && !unref(authStore).isAuthenticated ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-xs text-slate-500"
                      }, [
                        createVNode(_component_NuxtLink, {
                          to: "/auth/signup?redirect=/quote-draft",
                          class: "font-semibold text-flamingo-600 hover:text-flamingo-700"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Create a client account ")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" to save this pricing context in your requests and quotes workspace. ")
                      ])) : createCommentVNode("", true),
                      createVNode(QuotePreviewMeta, {
                        title: "Active shop",
                        lines: unref(shopMetaLines),
                        placeholder: "Available after shop load"
                      }, null, 8, ["lines"]),
                      unref(clientMetaLines).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                        key: 2,
                        title: "Client",
                        lines: unref(clientMetaLines),
                        placeholder: "Not provided"
                      }, null, 8, ["lines"])) : createCommentVNode("", true),
                      createVNode(QuotePreviewMeta, {
                        title: "Job summary",
                        lines: unref(jobMetaLines),
                        placeholder: "Pending"
                      }, null, 8, ["lines"]),
                      unref(productionMetaLines).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                        key: 3,
                        title: "Production plan",
                        lines: unref(productionMetaLines)
                      }, null, 8, ["lines"])) : createCommentVNode("", true),
                      !unref(canShowFinalPricing) ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                        key: 4,
                        title: "Complete these details to calculate final price",
                        items: unref(missingRequirements),
                        helper: unref(requirementsHelper)
                      }, null, 8, ["items", "helper"])) : (openBlock(), createBlock(QuotePreviewPriceState, {
                        key: 5,
                        "print-subtotal": unref(printCostDisplay),
                        "finishing-total": unref(finishingTotalDisplay),
                        total: unref(totalDisplay),
                        "per-unit": unref(perUnitDisplay),
                        helper: unref(totalHelperLine),
                        "pieces-per-sheet": unref(piecesPerSheetDisplay),
                        "sheets-required": unref(sheetsRequiredDisplay),
                        "cost-lines": unref(priceBreakdownLines)
                      }, null, 8, ["print-subtotal", "finishing-total", "total", "per-unit", "helper", "pieces-per-sheet", "sheets-required", "cost-lines"])),
                      unref(selectedFinishings).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                        key: 6,
                        title: "Finishing summary",
                        lines: unref(finishingBreakdownLines).map((line) => ({ label: line.label, value: line.total }))
                      }, null, 8, ["lines"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(showPriceAdvice)) {
              _push2(`<div class="rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900" data-v-1ac11c00${_scopeId}> Quantity below 500. Per-unit cost is usually higher at this level. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="${ssrRenderClass(unref(compactMode) ? "grid gap-2" : "grid gap-2 sm:grid-cols-3")}" data-v-1ac11c00${_scopeId}><button type="button" class="rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(primaryAction).disabled) ? " disabled" : ""} data-v-1ac11c00${_scopeId}>${ssrInterpolate(unref(primaryAction).label)}</button><button type="button" class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(secondaryAction).disabled) ? " disabled" : ""} data-v-1ac11c00${_scopeId}>${ssrInterpolate(unref(secondaryAction).label)}</button>`);
            if (unref(tertiaryAction)) {
              _push2(`<button type="button" class="rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(tertiaryAction).disabled) ? " disabled" : ""} data-v-1ac11c00${_scopeId}>${ssrInterpolate(unref(tertiaryAction).label)}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (unref(sendFeedback)) {
              _push2(`<div class="${ssrRenderClass(unref(sendFeedbackTone) === "success" ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800")}" data-v-1ac11c00${_scopeId}>${ssrInterpolate(unref(sendFeedback))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", {
                  id: "quote-pdf-target",
                  ref_key: "quotePdfTargetRef",
                  ref: quotePdfTargetRef
                }, [
                  createVNode(QuotePreviewPanel, null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("div", { class: "border-b border-slate-200 pb-3" }, [
                          createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500" }, toDisplayString(unref(previewEyebrow)), 1),
                          createVNode("h3", { class: "mt-1 text-xl font-semibold text-slate-900" }, toDisplayString(unref(previewHeading)), 1),
                          createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(previewIntro)), 1)
                        ]),
                        props.mode === "hero" ? (openBlock(), createBlock(ClientDetailsInlineForm, {
                          key: 0,
                          name: unref(contactName),
                          phone: unref(contactPhone),
                          email: unref(contactEmail),
                          "input-ui": lightInputUi,
                          "onUpdate:name": ($event) => contactName.value = $event,
                          "onUpdate:phone": ($event) => contactPhone.value = $event,
                          "onUpdate:email": ($event) => contactEmail.value = $event
                        }, null, 8, ["name", "phone", "email", "onUpdate:name", "onUpdate:phone", "onUpdate:email"])) : createCommentVNode("", true),
                        props.mode === "hero" && !unref(authStore).isAuthenticated ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-xs text-slate-500"
                        }, [
                          createVNode(_component_NuxtLink, {
                            to: "/auth/signup?redirect=/quote-draft",
                            class: "font-semibold text-flamingo-600 hover:text-flamingo-700"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Create a client account ")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" to save this pricing context in your requests and quotes workspace. ")
                        ])) : createCommentVNode("", true),
                        createVNode(QuotePreviewMeta, {
                          title: "Active shop",
                          lines: unref(shopMetaLines),
                          placeholder: "Available after shop load"
                        }, null, 8, ["lines"]),
                        unref(clientMetaLines).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                          key: 2,
                          title: "Client",
                          lines: unref(clientMetaLines),
                          placeholder: "Not provided"
                        }, null, 8, ["lines"])) : createCommentVNode("", true),
                        createVNode(QuotePreviewMeta, {
                          title: "Job summary",
                          lines: unref(jobMetaLines),
                          placeholder: "Pending"
                        }, null, 8, ["lines"]),
                        unref(productionMetaLines).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                          key: 3,
                          title: "Production plan",
                          lines: unref(productionMetaLines)
                        }, null, 8, ["lines"])) : createCommentVNode("", true),
                        !unref(canShowFinalPricing) ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                          key: 4,
                          title: "Complete these details to calculate final price",
                          items: unref(missingRequirements),
                          helper: unref(requirementsHelper)
                        }, null, 8, ["items", "helper"])) : (openBlock(), createBlock(QuotePreviewPriceState, {
                          key: 5,
                          "print-subtotal": unref(printCostDisplay),
                          "finishing-total": unref(finishingTotalDisplay),
                          total: unref(totalDisplay),
                          "per-unit": unref(perUnitDisplay),
                          helper: unref(totalHelperLine),
                          "pieces-per-sheet": unref(piecesPerSheetDisplay),
                          "sheets-required": unref(sheetsRequiredDisplay),
                          "cost-lines": unref(priceBreakdownLines)
                        }, null, 8, ["print-subtotal", "finishing-total", "total", "per-unit", "helper", "pieces-per-sheet", "sheets-required", "cost-lines"])),
                        unref(selectedFinishings).length ? (openBlock(), createBlock(QuotePreviewMeta, {
                          key: 6,
                          title: "Finishing summary",
                          lines: unref(finishingBreakdownLines).map((line) => ({ label: line.label, value: line.total }))
                        }, null, 8, ["lines"])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  })
                ], 512),
                unref(showPriceAdvice) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                }, " Quantity below 500. Per-unit cost is usually higher at this level. ")) : createCommentVNode("", true),
                createVNode("div", {
                  class: unref(compactMode) ? "grid gap-2" : "grid gap-2 sm:grid-cols-3"
                }, [
                  createVNode("button", {
                    type: "button",
                    class: "rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: unref(primaryAction).disabled,
                    onClick: ($event) => runAction(unref(primaryAction).run)
                  }, toDisplayString(unref(primaryAction).label), 9, ["disabled", "onClick"]),
                  createVNode("button", {
                    type: "button",
                    class: "rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: unref(secondaryAction).disabled,
                    onClick: ($event) => runAction(unref(secondaryAction).run)
                  }, toDisplayString(unref(secondaryAction).label), 9, ["disabled", "onClick"]),
                  unref(tertiaryAction) ? (openBlock(), createBlock("button", {
                    key: 0,
                    type: "button",
                    class: "rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: unref(tertiaryAction).disabled,
                    onClick: ($event) => runAction(unref(tertiaryAction).run)
                  }, toDisplayString(unref(tertiaryAction).label), 9, ["disabled", "onClick"])) : createCommentVNode("", true)
                ], 2),
                unref(sendFeedback) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: unref(sendFeedbackTone) === "success" ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                }, toDisplayString(unref(sendFeedback)), 3)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/BackendQuoteCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-1ac11c00"]]), { __name: "QuotesBackendQuoteCalculator" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=BackendQuoteCalculator-LNtZ4F8P.mjs.map
