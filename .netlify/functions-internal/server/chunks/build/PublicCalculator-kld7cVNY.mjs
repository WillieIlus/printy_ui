import { _ as _sfc_main$1 } from './Input-Hudv-7BP.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$3 } from './Textarea-DUPwu95P.mjs';
import { d as useAuthStore, f as useRoute, e as useToast, q as usePublicApiNoAuth, g as useAnalyticsTracking, A as API, a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, createSlots, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, isRef, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { s as sizePresets, f as formatSizeSummary, C as CalculatorShell, b as CalculatorTypeSwitcher, Q as QuotePreviewPanel, d as QuotePreviewMeta, e as QuotePreviewRequirementsState, h as CalculatorFormGrid, i as CalculatorFieldGroup, j as calculatorSelectUi, k as CalculatorHeaderBlock, l as inferSizePresetLabel, m as convertInputToMm, n as convertMmToDisplay, o as getSizePreset } from './calculationResult-SiwRgRTu.mjs';
import { u as useQuoteRequestBlast, e as extractPerSheetBreakdown, a as getQuoteRequestSendLabel, c as getQuoteRequestSendFeedback, F as FinishingSelector, Q as QuotesShopSelectionChips, b as buildQuoteRequestSendSummary, g as getQuoteRequestSendToast } from './pricingBreakdown-CT3rnr7b.mjs';
import { a as getGalleryProductOptions } from './gallery-DpmXPp8_.mjs';
import { g as getCatalog, a as getShopCustomOptions, m as matchShops, p as previewShopCalculator } from './public-BVuVnl0E.mjs';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { n as normalizeNumberValue, a as normalizeSelectValue } from './payload-B_6emhZU.mjs';
import { e as extractProductionDetails } from './productionDetails-ByImjBQh.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-tIWAo1tq.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PublicCalculator",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: { default: "Public Calculator" },
    mode: {},
    anchorId: { default: "public-calculator" },
    compact: { type: Boolean, default: false },
    fixedShopSlug: { default: null },
    fixedShopName: { default: null },
    product: { default: null },
    calculatorType: { default: null },
    calculatorTypeOptions: { default: () => [] },
    calculatorSwitcherPlacement: { default: "header" }
  },
  emits: ["submit", "update:calculatorType"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const authStore = useAuthStore();
    const activityBadgesStore = useActivityBadgesStore();
    const route = useRoute();
    const toast = useToast();
    const publicApiNoAuth = usePublicApiNoAuth();
    const { saveAndSend } = useQuoteRequestBlast();
    const { trackQuoteSubmit } = useAnalyticsTracking();
    const selectUi = calculatorSelectUi;
    const inputUi = { base: "w-full px-4 text-sm" };
    const textareaUi = { base: "w-full px-4 py-2 text-sm min-h-[6rem]" };
    const laminationSides = [{ label: "Front only", value: "front" }, { label: "Back only", value: "back" }, { label: "Both sides", value: "both" }];
    const sidesOptions = [{ label: "Front only", value: "SIMPLEX" }, { label: "Both sides", value: "DUPLEX" }];
    const colorModeOptions = [{ label: "Black and white", value: "BW" }, { label: "Full colour", value: "COLOR" }];
    const sheetSizeOptions = [{ label: "SRA3", value: "SRA3" }, { label: "A3", value: "A3" }, { label: "A4", value: "A4" }, { label: "A5", value: "A5" }];
    const turnaroundModeOptions = [{ label: "Standard", value: "standard" }, { label: "Rush", value: "rush" }];
    const sizeModeOptions = [{ label: "Standard size", value: "standard" }, { label: "Custom size", value: "custom" }];
    const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }));
    const sizeUnitOptions = [{ label: "mm", value: "mm" }, { label: "cm", value: "cm" }, { label: "m", value: "m" }, { label: "inches", value: "in" }];
    const defaultSizePreset = sizePresets[0];
    const isMarketplace = computed(() => props.mode === "marketplace");
    const isProductMode = computed(() => props.mode === "tweak" || props.mode === "tweak-and-quote");
    const isSingleShop = computed(() => props.mode === "single-shop" || isProductMode.value);
    const isSheetMode = computed(() => (props.product?.pricing_mode ?? "SHEET") === "SHEET");
    const isLargeFormatMode = computed(() => (props.product?.pricing_mode ?? "SHEET") === "LARGE_FORMAT");
    const minimumQuantity = computed(() => props.product?.min_quantity ?? 1);
    const showEmbeddedCalculatorTypes = computed(() => Boolean(props.calculatorType && props.calculatorTypeOptions.length));
    const showHeaderContent = computed(() => Boolean(props.eyebrow || props.title || props.description));
    const showHeaderSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === "header");
    const showPreviewSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === "preview");
    const customTitle = ref("Custom print job");
    const customBrief = ref("");
    const quantity = ref(100);
    const sizeMode = ref("custom");
    const sizeLabel = ref("");
    const inputUnit = ref("mm");
    const widthInput = ref("");
    const heightInput = ref("");
    const widthMm = ref(null);
    const heightMm = ref(null);
    const sides = ref("SIMPLEX");
    const colorMode = ref("COLOR");
    const turnaroundDays = ref(2);
    const turnaroundMode = ref("standard");
    const selectedPaperId = ref(null);
    const selectedMaterialId = ref(null);
    const hiddenMachineId = ref(null);
    const marketplaceSheetSize = ref("SRA3");
    const marketplacePaperGsm = ref(300);
    const marketplacePaperType = ref("Art card");
    const selectedFinishings = ref([]);
    const paperDetails = ref([]);
    const materialDetails = ref([]);
    const finishingOptions = ref([]);
    const fixedShopPreview = ref(null);
    const fixedShopIdentity = ref(null);
    const matchResponse = ref(null);
    const selectedMatchShopSlugs = ref([]);
    const loadedFinishingShopSlug = ref("");
    const finishingOptionsLoading = ref(false);
    const loading = ref(false);
    const sendingRequest = ref(false);
    const lastSentSummary = ref(null);
    const sendError = ref("");
    const previewCurrency = computed(() => fixedShopPreview.value?.currency ?? matchResponse.value?.currency ?? null);
    const { formatMoney, formatMoneyRange } = useCurrencyFormatter(previewCurrency);
    const paperOptions = computed(() => paperDetails.value.map((paper) => ({ label: paper.label, value: paper.id })));
    const materialOptions = computed(() => materialDetails.value.map((material) => ({ label: material.label, value: material.id })));
    const selectedPaperDetail = computed(() => paperDetails.value.find((paper) => paper.id === selectedPaperId.value) ?? null);
    const selectedPaperSupport = computed(() => selectedPaperDetail.value?.sheet_size ?? "Based on selected stock");
    const visibleMatches = computed(() => (matchResponse.value?.selected_shops ?? matchResponse.value?.shops ?? []).slice(0, 6));
    const selectedShops = computed(() => visibleMatches.value.filter((shop) => selectedMatchShopSlugs.value.includes(shop.slug)).map(asMatchShop));
    const fixedShopDisplayName = computed(() => props.fixedShopName ?? fixedShopPreview.value?.name ?? fixedShopIdentity.value?.name ?? props.fixedShopSlug ?? "Selected shop");
    const sizeSummary = computed(() => {
      const width = normalizeNumberValue(widthMm.value ?? props.product?.default_finished_width_mm ?? null);
      const height = normalizeNumberValue(heightMm.value ?? props.product?.default_finished_height_mm ?? null);
      const label = !isProductMode.value && sizeMode.value === "standard" ? sizeLabel.value : "";
      return formatSizeSummary(width, height, label);
    });
    const showFinishingPanel = ref(false);
    const showFinishingToggle = computed(() => !missingRequirements.value.length && (finishingOptionsLoading.value || finishingGroups.value.length > 0));
    const finishingGroups = computed(() => {
      const groups = /* @__PURE__ */ new Map();
      for (const item of finishingOptions.value) {
        const key = String(item.category_name ?? item.category ?? "Finishing");
        groups.set(key, [...groups.get(key) ?? [], item]);
      }
      return Array.from(groups.entries()).map(([label, options]) => ({ label, options }));
    });
    const shopSummaryLines = computed(() => {
      if (isMarketplace.value) {
        return selectedShops.value.map((shop2) => ({ label: shop2.name, value: shop2.slug }));
      }
      const shop = fixedShopPreview.value ?? fixedShopIdentity.value;
      return shop ? [{ label: shop.name, value: shop.slug }] : [];
    });
    const shopSummaryPlaceholder = computed(() => isMarketplace.value ? "Matching shops will appear here" : "Shop not loaded yet");
    const jobSummaryLines = computed(() => [
      { label: "Product", value: isProductMode.value ? props.product?.name ?? "Selected product" : customTitle.value.trim() || "Custom job" },
      { label: "Quantity", value: quantity.value ? `${quantity.value} pcs` : "" },
      { label: "Size", value: sizeSummary.value },
      { label: "Sides", value: sides.value === "DUPLEX" ? "Both sides" : "Front only" },
      { label: "Colour mode", value: colorMode.value === "BW" ? "Black & White" : "Full colour" }
    ].filter((item) => item.value));
    const productionSummaryLines = computed(() => {
      const lines = [];
      if (isSheetMode.value) {
        lines.push({
          label: "Paper",
          value: selectedPaperDetail.value?.label ?? (isMarketplace.value ? `${marketplaceSheetSize.value}${marketplacePaperGsm.value ? ` · ${marketplacePaperGsm.value}gsm` : ""}${marketplacePaperType.value ? ` · ${marketplacePaperType.value}` : ""}` : "")
        });
      }
      if (isLargeFormatMode.value && selectedMaterialId.value) {
        lines.push({ label: "Material", value: materialDetails.value.find((item) => item.id === selectedMaterialId.value)?.label ?? "" });
      }
      lines.push({
        label: "Turnaround",
        value: !isProductMode.value ? turnaroundDays.value ? `${turnaroundDays.value} working hour(s)` : "" : selectedPreviewRecord.value?.turnaround_text || props.product?.turnaround_text || ""
      });
      if (selectedFinishings.value.length) {
        lines.push({ label: "Finishings", value: selectedFinishings.value.map((entry) => finishingOptions.value.find((option) => Number(option.id) === entry.finishing_rate_id)?.name).filter(Boolean).join(", ") });
      }
      if (!isProductMode.value && customBrief.value.trim()) {
        lines.push({ label: "Brief", value: customBrief.value.trim() });
      }
      if (productionDetails.value.parentSheetName) {
        lines.push({ label: "Parent sheet", value: productionDetails.value.parentSheetName });
      }
      if (productionDetails.value.rotated) {
        lines.push({ label: "Rotated", value: productionDetails.value.rotated });
      }
      return lines.filter((item) => item.value);
    });
    const missingRequirements = computed(() => {
      const items = [];
      if (!normalizeNumberValue(quantity.value) || (quantity.value ?? 0) < minimumQuantity.value) items.push(`Set quantity${minimumQuantity.value > 1 ? ` (${minimumQuantity.value}+ minimum)` : ""}`);
      if (isProductMode.value) {
        if (isSheetMode.value && paperDetails.value.length && !selectedPaperId.value) items.push("Choose paper / GSM");
        if (isLargeFormatMode.value && materialDetails.value.length && !selectedMaterialId.value) items.push("Choose material");
        return items;
      }
      if (!customTitle.value.trim()) items.push("Add a product title");
      if (!customBrief.value.trim()) items.push("Add a custom brief");
      if (!normalizeNumberValue(widthMm.value) || !normalizeNumberValue(heightMm.value)) items.push("Enter the finished size");
      if (isSingleShop.value && isSheetMode.value && paperDetails.value.length && !selectedPaperId.value) items.push("Choose paper / GSM");
      if (isSingleShop.value && isLargeFormatMode.value && materialDetails.value.length && !selectedMaterialId.value) items.push("Choose material");
      if (!normalizeNumberValue(turnaroundDays.value)) items.push("Set turnaround");
      return items;
    });
    const backendMissingRequirements = computed(() => {
      const rows = isMarketplace.value ? visibleMatches.value : fixedShopPreview.value ? [fixedShopPreview.value] : [];
      return Array.from(new Set(rows.flatMap((row) => row.missing_fields ?? []))).filter(Boolean);
    });
    const marketplaceRange = computed(() => {
      if (!matchResponse.value?.min_price) return null;
      return formatMoneyRange(matchResponse.value.min_price, matchResponse.value.max_price, matchResponse.value.currency);
    });
    const singleShopTotal = computed(() => {
      const total = fixedShopPreview.value?.total ?? null;
      return total ? formatMoney(total, fixedShopPreview.value?.currency ?? null) : null;
    });
    const fixedShopPreviewRecord = computed(
      () => fixedShopPreview.value?.preview && typeof fixedShopPreview.value.preview === "object" ? fixedShopPreview.value.preview : null
    );
    const selectedPreviewShop = computed(() => {
      if (!isMarketplace.value) return fixedShopPreview.value;
      return selectedShops.value.map((shop) => visibleMatches.value.find((match) => match.slug === shop.slug) ?? null).find(Boolean) ?? visibleMatches.value[0] ?? null;
    });
    const selectedPreviewRecord = computed(
      () => selectedPreviewShop.value?.preview && typeof selectedPreviewShop.value.preview === "object" ? selectedPreviewShop.value.preview : fixedShopPreviewRecord.value
    );
    const productionDetails = computed(() => extractProductionDetails(selectedPreviewRecord.value));
    const perSheetBreakdown = computed(() => extractPerSheetBreakdown(selectedPreviewRecord.value));
    const piecesPerSheet = computed(() => productionDetails.value.piecesPerSheet);
    const sheetsRequired = computed(() => productionDetails.value.sheetsNeeded);
    const priceLabel = computed(() => isMarketplace.value ? "Marketplace price range" : "Shop preview total");
    const priceLine = computed(() => {
      if (loading.value) return "Refreshing...";
      if (isMarketplace.value) return marketplaceRange.value ?? "No backend price range yet";
      return singleShopTotal.value ?? "Awaiting backend preview";
    });
    const priceHelper = computed(() => {
      if (missingRequirements.value.length) return "";
      if (isMarketplace.value) return matchResponse.value?.summary || "Public calculators now use backend min/max pricing from matched shops.";
      if (fixedShopPreview.value?.can_calculate) {
        const unitLine = getUnitPriceLine(fixedShopPreview.value.preview, fixedShopPreview.value.currency);
        return unitLine ? `${fixedShopPreview.value.reason}. ${unitLine}` : fixedShopPreview.value.reason;
      }
      return fixedShopPreview.value?.reason || matchResponse.value?.summary || "Complete the production details to get a shop preview.";
    });
    const priceBreakdownLines = computed(() => {
      const lines = [];
      if (perSheetBreakdown.value.paperPrice) lines.push({ label: "Paper price", value: formatMoney(perSheetBreakdown.value.paperPrice) });
      if (perSheetBreakdown.value.frontPrint) lines.push({ label: "Front print", value: formatMoney(perSheetBreakdown.value.frontPrint) });
      if (sides.value === "DUPLEX" && perSheetBreakdown.value.backPrint && perSheetBreakdown.value.backPrint !== "0.00" && perSheetBreakdown.value.backPrint !== "0") {
        lines.push({ label: "Back print", value: formatMoney(perSheetBreakdown.value.backPrint) });
      }
      if (perSheetBreakdown.value.totalPerSheet) lines.push({ label: "Total / sheet", value: formatMoney(perSheetBreakdown.value.totalPerSheet) });
      for (const finishing of selectedPreviewRecord.value?.finishings ?? []) {
        if (!finishing?.total) continue;
        lines.push({
          label: `Finishing · ${finishing.name || "Service"}`,
          value: formatMoney(finishing.total)
        });
      }
      return lines;
    });
    const requirementsHelper = computed(() => isMarketplace.value ? "Complete the brief to match shops." : isProductMode.value ? "Select the required production inputs." : "Complete the brief to continue.");
    const primaryLabel = computed(() => isMarketplace.value ? "Refresh matches" : props.mode === "tweak-and-quote" ? "Add and continue" : props.mode === "tweak" ? "Add to Draft" : "Add to Quote Draft");
    const canSendRequest = computed(
      () => !loading.value && !sendingRequest.value && !lastSentSummary.value && !missingRequirements.value.length && (isMarketplace.value && selectedShops.value.length > 0 || !isMarketplace.value && Boolean(selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id))
    );
    const sendActionLabel = computed(() => {
      const sharedLabel = getQuoteRequestSendLabel(lastSentSummary.value, sendingRequest.value);
      if (sharedLabel) return sharedLabel;
      if (!authStore.isAuthenticated) return "Sign in to send request";
      return isMarketplace.value ? "Send request to selected shops" : "Send request to shop";
    });
    const sendFeedbackTone = computed(() => lastSentSummary.value ? "success" : "error");
    const sendFeedback = computed(() => {
      const sharedFeedback = getQuoteRequestSendFeedback(lastSentSummary.value);
      if (sharedFeedback) return sharedFeedback;
      return sendError.value;
    });
    const selectedShopIds = computed(() => {
      if (isMarketplace.value) return selectedShops.value.map((shop) => shop.id).filter(Boolean);
      return [selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id].filter((value) => typeof value === "number" && value > 0);
    });
    function syncSizeInputsFromCanonical() {
      widthInput.value = convertMmToDisplay(widthMm.value, inputUnit.value);
      heightInput.value = convertMmToDisplay(heightMm.value, inputUnit.value);
    }
    function setCanonicalSize(width, height, preferPreset = true) {
      widthMm.value = normalizeNumberValue(width);
      heightMm.value = normalizeNumberValue(height);
      if (preferPreset) {
        const inferredPreset = inferSizePresetLabel(widthMm.value, heightMm.value);
        if (inferredPreset) {
          sizeMode.value = "standard";
          sizeLabel.value = inferredPreset;
        }
      }
      syncSizeInputsFromCanonical();
    }
    function applySelectedPreset() {
      const preset = getSizePreset(sizeLabel.value) ?? defaultSizePreset;
      sizeLabel.value = preset.label;
      widthMm.value = preset.widthMm;
      heightMm.value = preset.heightMm;
      syncSizeInputsFromCanonical();
    }
    function handleSizeModeChange(value) {
      sizeMode.value = normalizeSelectValue(value) ?? "custom";
      if (sizeMode.value === "standard") {
        sizeLabel.value = sizeLabel.value || inferSizePresetLabel(widthMm.value, heightMm.value) || defaultSizePreset.label;
        applySelectedPreset();
        return;
      }
      syncSizeInputsFromCanonical();
    }
    function handleSizePresetChange(value) {
      sizeLabel.value = String(normalizeSelectValue(value) ?? defaultSizePreset.label);
      applySelectedPreset();
    }
    function handleInputUnitChange(value) {
      inputUnit.value = normalizeSelectValue(value) ?? "mm";
      syncSizeInputsFromCanonical();
    }
    function handleWidthInputChange(value) {
      widthInput.value = value == null ? "" : String(value);
      widthMm.value = convertInputToMm(widthInput.value, inputUnit.value);
    }
    function handleHeightInputChange(value) {
      heightInput.value = value == null ? "" : String(value);
      heightMm.value = convertInputToMm(heightInput.value, inputUnit.value);
    }
    function clearSendState() {
      lastSentSummary.value = null;
      sendError.value = "";
    }
    watch(() => [props.product, props.fixedShopSlug, props.mode], () => {
      resetForm();
      void initialize();
    }, { immediate: true });
    watch(() => [
      customTitle.value,
      customBrief.value,
      quantity.value,
      widthMm.value,
      heightMm.value,
      sides.value,
      colorMode.value,
      turnaroundDays.value,
      selectedPaperId.value,
      selectedMaterialId.value,
      marketplaceSheetSize.value,
      marketplacePaperGsm.value,
      marketplacePaperType.value,
      JSON.stringify(selectedFinishings.value)
    ], () => {
      clearSendState();
      if (missingRequirements.value.length) {
        if (isMarketplace.value) {
          matchResponse.value = null;
          selectedMatchShopSlugs.value = [];
        } else {
          fixedShopPreview.value = null;
          matchResponse.value = null;
        }
        return;
      }
      if (isMarketplace.value) {
        void debouncedRefreshMarketplaceMatches();
        return;
      }
      if (isSingleShop.value && props.fixedShopSlug) {
        void debouncedRefreshSingleShopPreview();
      }
    });
    watch(
      () => isMarketplace.value ? selectedPreviewShop.value?.slug ?? "" : "",
      async (shopSlug) => {
        if (!isMarketplace.value) return;
        if (!shopSlug) {
          finishingOptions.value = [];
          selectedFinishings.value = [];
          loadedFinishingShopSlug.value = "";
          return;
        }
        if (loadedFinishingShopSlug.value === shopSlug && finishingOptions.value.length) return;
        await loadMarketplaceFinishingOptions(shopSlug);
      },
      { immediate: true }
    );
    const debouncedRefreshMarketplaceMatches = useDebounceFn(refreshMarketplaceMatches, 300);
    const debouncedRefreshSingleShopPreview = useDebounceFn(refreshSingleShopPreview, 300);
    async function initialize() {
      await hydrateFixedShopIdentity();
      if (isProductMode.value && props.product?.id) {
        await loadProductOptions(props.product.id);
      } else if (props.mode === "single-shop" && props.fixedShopSlug) {
        await loadSingleShopCustomOptions(props.fixedShopSlug);
      }
      if (!missingRequirements.value.length) {
        if (isMarketplace.value) await refreshMarketplaceMatches();
        else if (isSingleShop.value && props.fixedShopSlug) await refreshSingleShopPreview();
      }
    }
    async function hydrateFixedShopIdentity() {
      fixedShopPreview.value = null;
      fixedShopIdentity.value = props.fixedShopSlug ? { id: 0, slug: props.fixedShopSlug, name: props.fixedShopName ?? props.fixedShopSlug } : null;
      if (!props.fixedShopSlug) return;
      const catalog = await getCatalog(props.fixedShopSlug);
      if (catalog?.shop) {
        fixedShopIdentity.value = {
          id: catalog.shop.id,
          slug: catalog.shop.slug,
          name: props.fixedShopName ?? catalog.shop.name
        };
      }
    }
    async function loadSingleShopCustomOptions(shopSlug) {
      loading.value = true;
      try {
        const data = await publicApiNoAuth(API.publicShopCustomOptions(shopSlug));
        paperDetails.value = (data.available_papers ?? []).map((paper) => ({
          id: paper.id,
          label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
          sheet_size: paper.sheet_size
        }));
        materialDetails.value = (data.available_materials ?? []).map((material) => ({
          id: material.id,
          label: material.material_type ? `${material.material_type}${material.unit ? ` · ${material.unit}` : ""}` : "Material"
        }));
        finishingOptions.value = (data.available_finishings ?? []).map((finishing) => ({
          ...finishing,
          billing_basis: resolveFinishingBillingBasis(finishing),
          side_mode: resolveFinishingSideMode(finishing)
        }));
        if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null;
        if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
      } finally {
        loading.value = false;
      }
    }
    async function loadMarketplaceFinishingOptions(shopSlug) {
      finishingOptionsLoading.value = true;
      try {
        const candidateSlugs = Array.from(new Set([
          shopSlug,
          ...selectedShops.value.map((shop) => shop.slug),
          ...visibleMatches.value.map((shop) => shop.slug)
        ].filter(Boolean)));
        for (const candidateSlug of candidateSlugs) {
          const data = await getShopCustomOptions(candidateSlug);
          const nextOptions = (data.available_finishings ?? []).map((finishing) => ({
            ...finishing,
            billing_basis: resolveFinishingBillingBasis(finishing),
            side_mode: resolveFinishingSideMode(finishing)
          }));
          if (!nextOptions.length) continue;
          finishingOptions.value = nextOptions;
          const allowedIds = new Set(nextOptions.map((option) => Number(option.id)));
          selectedFinishings.value = selectedFinishings.value.filter((entry) => allowedIds.has(entry.finishing_rate_id));
          loadedFinishingShopSlug.value = candidateSlug;
          return;
        }
        finishingOptions.value = [];
        selectedFinishings.value = [];
        loadedFinishingShopSlug.value = "";
      } catch {
        finishingOptions.value = [];
        selectedFinishings.value = [];
        loadedFinishingShopSlug.value = "";
      } finally {
        finishingOptionsLoading.value = false;
      }
    }
    async function loadProductOptions(productId) {
      loading.value = true;
      try {
        const options = await getGalleryProductOptions(productId);
        paperDetails.value = (options?.available_papers ?? []).map((paper) => ({
          id: paper.id,
          label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
          sheet_size: paper.sheet_size
        }));
        materialDetails.value = (options?.available_materials ?? []).map((material) => ({
          id: material.id,
          label: material.material_type ? `${material.material_type}${material.unit ? ` · ${material.unit}` : ""}` : "Material"
        }));
        finishingOptions.value = (options?.available_finishings ?? []).map((finishing) => ({
          ...finishing,
          billing_basis: resolveFinishingBillingBasis(finishing),
          side_mode: resolveFinishingSideMode(finishing)
        }));
        hiddenMachineId.value = normalizeNumberValue(options?.default_machine ?? null) ?? normalizeNumberValue(options?.default_machine_id ?? null) ?? normalizeNumberValue(options?.available_machines?.[0]?.id ?? null) ?? null;
        if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null;
        if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
        setCanonicalSize(
          normalizeNumberValue(props.product?.default_finished_width_mm ?? null),
          normalizeNumberValue(props.product?.default_finished_height_mm ?? null)
        );
        sides.value = props.product?.default_sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
        quantity.value = props.product?.min_quantity ?? 100;
      } finally {
        loading.value = false;
      }
    }
    function buildPreviewPayload() {
      return {
        calculator_mode: props.mode,
        shop_scope: isMarketplace.value ? "marketplace" : props.mode === "single-shop" ? "single_shop" : "tweak",
        pricing_mode: isProductMode.value ? "catalog" : "custom",
        product_pricing_mode: props.product?.pricing_mode ?? (selectedMaterialId.value ? "LARGE_FORMAT" : "SHEET"),
        product_id: isProductMode.value ? props.product?.id ?? null : null,
        template_id: isProductMode.value ? props.product?.id ?? null : null,
        size_mode: !isProductMode.value ? sizeMode.value : void 0,
        size_label: !isProductMode.value ? sizeLabel.value : void 0,
        input_unit: !isProductMode.value ? inputUnit.value : void 0,
        width_input: !isProductMode.value ? widthInput.value : void 0,
        height_input: !isProductMode.value ? heightInput.value : void 0,
        width_mm: normalizeNumberValue(widthMm.value ?? props.product?.default_finished_width_mm ?? null),
        height_mm: normalizeNumberValue(heightMm.value ?? props.product?.default_finished_height_mm ?? null),
        quantity: normalizeNumberValue(quantity.value) ?? minimumQuantity.value,
        print_sides: sides.value,
        colour_mode: colorMode.value,
        paper_id: selectedPaperId.value,
        material_id: selectedMaterialId.value,
        sheet_size: isMarketplace.value && isSheetMode.value ? marketplaceSheetSize.value : void 0,
        paper_gsm: isMarketplace.value && isSheetMode.value ? normalizeNumberValue(marketplacePaperGsm.value) : void 0,
        paper_type: isMarketplace.value && isSheetMode.value ? marketplacePaperType.value.trim() : void 0,
        finishing_ids: selectedFinishings.value.map((entry) => entry.finishing_rate_id),
        finishings: selectedFinishings.value.map((entry) => ({
          finishing_rate_id: entry.finishing_rate_id,
          selected_side: entry.selected_side
        })),
        turnaround_hours: !isProductMode.value ? normalizeNumberValue(turnaroundDays.value) : void 0,
        turnaround_mode: isProductMode.value ? turnaroundMode.value : void 0,
        custom_title: !isProductMode.value ? customTitle.value.trim() : void 0,
        custom_brief: !isProductMode.value ? customBrief.value.trim() : void 0,
        fixed_shop_slug: props.fixedShopSlug ?? void 0
      };
    }
    async function refreshMarketplaceMatches() {
      if (!isMarketplace.value || missingRequirements.value.length) return;
      loading.value = true;
      try {
        const result = await matchShops(buildPreviewPayload());
        matchResponse.value = result;
        selectedMatchShopSlugs.value = (result.selected_shops ?? result.shops ?? []).slice(0, 6).map((shop) => shop.slug);
        loadedFinishingShopSlug.value = "";
        await loadMarketplaceFinishingOptions(selectedMatchShopSlugs.value[0] ?? result.shops?.[0]?.slug ?? "");
      } catch (error) {
        matchResponse.value = null;
        selectedMatchShopSlugs.value = [];
        toast.add({ title: "Could not match shops", description: error instanceof Error ? error.message : "Please try again.", color: "error" });
      } finally {
        loading.value = false;
      }
    }
    async function refreshSingleShopPreview() {
      if (!isSingleShop.value || !props.fixedShopSlug || missingRequirements.value.length) return;
      loading.value = true;
      try {
        const result = await previewShopCalculator(props.fixedShopSlug, buildPreviewPayload());
        matchResponse.value = result;
        fixedShopPreview.value = result.fixed_shop_preview ?? result.selected_shops?.[0] ?? result.shops?.[0] ?? null;
        selectedMatchShopSlugs.value = fixedShopPreview.value?.slug ? [fixedShopPreview.value.slug] : [];
        hiddenMachineId.value = normalizeNumberValue(fixedShopPreview.value?.selection?.machine_id ?? hiddenMachineId.value);
        if (!selectedPaperId.value && fixedShopPreview.value?.selection?.paper_id) selectedPaperId.value = fixedShopPreview.value.selection.paper_id;
        if (!selectedMaterialId.value && fixedShopPreview.value?.selection?.material_id) selectedMaterialId.value = fixedShopPreview.value.selection.material_id;
      } catch (error) {
        fixedShopPreview.value = null;
        matchResponse.value = null;
        toast.add({ title: "Could not refresh shop preview", description: error instanceof Error ? error.message : "Please try again.", color: "error" });
      } finally {
        loading.value = false;
      }
    }
    function buildSubmitPayload() {
      if (isProductMode.value && props.product) {
        return {
          item_type: "PRODUCT",
          product: props.product.id,
          quantity: normalizeNumberValue(quantity.value) ?? minimumQuantity.value,
          pricing_mode: props.product.pricing_mode,
          paper: selectedPaperId.value ?? void 0,
          material: selectedMaterialId.value ?? void 0,
          machine: hiddenMachineId.value ?? void 0,
          sides: sides.value,
          color_mode: colorMode.value,
          finishings: selectedFinishings.value.length ? selectedFinishings.value.map((entry) => ({
            finishing_rate: entry.finishing_rate_id,
            apply_to_sides: entry.selected_side === "both" ? "BOTH" : "SINGLE"
          })) : void 0
        };
      }
      return {
        item_type: "CUSTOM",
        title: customTitle.value.trim(),
        spec_text: customBrief.value.trim(),
        quantity: normalizeNumberValue(quantity.value) ?? 1,
        pricing_mode: selectedMaterialId.value ? "LARGE_FORMAT" : "SHEET",
        chosen_width_mm: normalizeNumberValue(widthMm.value) ?? 0,
        chosen_height_mm: normalizeNumberValue(heightMm.value) ?? 0,
        paper: selectedPaperId.value ?? void 0,
        material: selectedMaterialId.value ?? void 0,
        sides: sides.value,
        color_mode: colorMode.value,
        finishings: selectedFinishings.value.length ? selectedFinishings.value.map((entry) => ({
          finishing_rate: entry.finishing_rate_id,
          apply_to_sides: entry.selected_side === "both" ? "BOTH" : "SINGLE",
          selected_side: entry.selected_side
        })) : void 0,
        item_spec_snapshot: {
          pricing_mode: selectedMaterialId.value ? "LARGE_FORMAT" : "SHEET",
          size_mode: sizeMode.value,
          size_label: sizeLabel.value,
          input_unit: inputUnit.value,
          width_input: widthInput.value,
          height_input: heightInput.value,
          width_mm: normalizeNumberValue(widthMm.value) ?? 0,
          height_mm: normalizeNumberValue(heightMm.value) ?? 0,
          paper_id: selectedPaperId.value ?? null,
          material_id: selectedMaterialId.value ?? null,
          print_sides: sides.value,
          colour_mode: colorMode.value,
          turnaround_hours: normalizeNumberValue(turnaroundDays.value),
          finishings: selectedFinishings.value.map((entry) => ({
            finishing_rate_id: entry.finishing_rate_id,
            selected_side: entry.selected_side
          }))
        },
        has_artwork: true
      };
    }
    async function handlePrimaryAction() {
      if (isMarketplace.value) {
        await refreshMarketplaceMatches();
        return;
      }
      if (missingRequirements.value.length) {
        toast.add({ title: "Incomplete form", description: missingRequirements.value[0] ?? "Fill the required fields first.", color: "warning" });
        return;
      }
      if (isSingleShop.value && props.fixedShopSlug && !fixedShopPreview.value) {
        await refreshSingleShopPreview();
      }
      emit("submit", buildSubmitPayload(), {
        matchingShops: (matchResponse.value?.shops ?? []).map(asMatchShop),
        selectedShops: isMarketplace.value ? selectedShops.value : fixedShopPreview.value ? [asMatchShop(fixedShopPreview.value)] : [],
        minPrice: matchResponse.value?.min_price ?? null,
        maxPrice: matchResponse.value?.max_price ?? null,
        fixedShopPreview: fixedShopPreview.value ? asMatchShop(fixedShopPreview.value) : fixedShopIdentity.value
      });
    }
    async function handleSendRequest() {
      clearSendState();
      if (missingRequirements.value.length) {
        toast.add({ title: "Incomplete form", description: missingRequirements.value[0] ?? "Fill the required fields first.", color: "warning" });
        return;
      }
      if (!isMarketplace.value && isSingleShop.value && props.fixedShopSlug && !fixedShopPreview.value) {
        await refreshSingleShopPreview();
      }
      if (!selectedShopIds.value.length) {
        toast.add({ title: "No shops selected", description: "Select at least one shop before sending.", color: "warning" });
        return;
      }
      if (sendingRequest.value) {
        return;
      }
      const payload = buildPreviewPayload();
      const pricingSnapshot = isMarketplace.value ? {
        ...matchResponse.value,
        selected_shops: selectedShops.value.map((shop) => visibleMatches.value.find((match) => match.slug === shop.slug)).filter(Boolean),
        copies_per_sheet: productionDetails.value.piecesPerSheet || null,
        good_sheets: productionDetails.value.sheetsNeeded || null,
        parent_sheet_name: productionDetails.value.parentSheetName || null,
        rotated: productionDetails.value.rotated === "Yes" ? true : productionDetails.value.rotated === "No" ? false : null,
        production_details: productionDetails.value
      } : {
        ...selectedPreviewRecord.value,
        copies_per_sheet: productionDetails.value.piecesPerSheet || null,
        good_sheets: productionDetails.value.sheetsNeeded || null,
        parent_sheet_name: productionDetails.value.parentSheetName || null,
        rotated: productionDetails.value.rotated === "Yes" ? true : productionDetails.value.rotated === "No" ? false : null,
        production_details: productionDetails.value
      };
      sendingRequest.value = true;
      try {
        const requests = await saveAndSend({
          title: isProductMode.value ? props.product?.name ?? "Prepared request" : customTitle.value.trim() || "Prepared request",
          shop: selectedShopIds.value[0] ?? null,
          selectedProduct: props.product?.id ?? null,
          calculatorInputsSnapshot: {
            ...payload,
            selected_shop_ids: selectedShopIds.value,
            selected_shop_slugs: isMarketplace.value ? selectedShops.value.map((shop) => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean)
          },
          pricingSnapshot,
          customProductSnapshot: !isProductMode.value ? {
            custom_title: customTitle.value.trim(),
            custom_brief: customBrief.value.trim(),
            size_mode: sizeMode.value,
            size_label: sizeLabel.value,
            input_unit: inputUnit.value,
            width_input: widthInput.value,
            height_input: heightInput.value,
            width_mm: normalizeNumberValue(widthMm.value),
            height_mm: normalizeNumberValue(heightMm.value)
          } : null,
          requestDetailsSnapshot: {
            notes: customBrief.value.trim() || void 0,
            selected_shop_ids: selectedShopIds.value,
            selected_shop_slugs: isMarketplace.value ? selectedShops.value.map((shop) => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean)
          },
          selectedShopIds: selectedShopIds.value,
          loginRedirectPath: route.fullPath
        });
        if (requests?.length) {
          lastSentSummary.value = buildQuoteRequestSendSummary(requests);
          void trackQuoteSubmit({
            source: isMarketplace.value ? "public_marketplace_calculator" : "public_single_shop_calculator",
            request_ids: requests.map((request) => request.id),
            shop_count: requests.length,
            selected_shop_slugs: isMarketplace.value ? selectedShops.value.map((shop) => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean),
            product_name: isProductMode.value ? props.product?.name ?? null : customTitle.value.trim()
          });
          await activityBadgesStore.fetchSummary();
          const successToast = getQuoteRequestSendToast(lastSentSummary.value);
          toast.add({
            title: successToast.title,
            description: successToast.description,
            color: "success"
          });
        }
      } catch (error) {
        sendError.value = error instanceof Error ? error.message : "Could not send your request. Please try again.";
        toast.add({
          title: "Request not sent",
          description: sendError.value,
          color: "error"
        });
      } finally {
        sendingRequest.value = false;
      }
    }
    function resetForm() {
      clearSendState();
      customTitle.value = "Custom print job";
      customBrief.value = "";
      quantity.value = props.product?.min_quantity ?? 100;
      sizeMode.value = "custom";
      sizeLabel.value = "";
      inputUnit.value = "mm";
      setCanonicalSize(
        normalizeNumberValue(props.product?.default_finished_width_mm ?? null),
        normalizeNumberValue(props.product?.default_finished_height_mm ?? null)
      );
      sides.value = props.product?.default_sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
      colorMode.value = "COLOR";
      turnaroundDays.value = props.product?.turnaround_hours ?? (props.product?.turnaround_days ? props.product.turnaround_days * 8 : 6);
      turnaroundMode.value = "standard";
      selectedPaperId.value = paperDetails.value[0]?.id ?? null;
      selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
      selectedFinishings.value = [];
      marketplaceSheetSize.value = props.product?.default_sheet_size ?? "SRA3";
      marketplacePaperGsm.value = props.product?.min_gsm ?? 300;
      marketplacePaperType.value = "Art card";
      matchResponse.value = null;
      fixedShopPreview.value = null;
      selectedMatchShopSlugs.value = [];
      loadedFinishingShopSlug.value = "";
      finishingOptionsLoading.value = false;
      showFinishingPanel.value = false;
    }
    function toggleMatchedShop(shopSlug) {
      selectedMatchShopSlugs.value = selectedMatchShopSlugs.value.includes(shopSlug) ? selectedMatchShopSlugs.value.filter((slug) => slug !== shopSlug) : [...selectedMatchShopSlugs.value, shopSlug];
    }
    function toggleFinishing(finishing) {
      const id = Number(finishing.id);
      selectedFinishings.value = isFinishingSelected(id) ? selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== id) : [...selectedFinishings.value, { finishing_rate_id: id, selected_side: "both" }];
    }
    function updateFinishingSide(finishingId, value) {
      const normalized = normalizeSelectValue(value) ?? "both";
      selectedFinishings.value = selectedFinishings.value.map((entry) => entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry);
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
      return Boolean(finishing && (`${String(finishing.slug ?? "")} ${String(finishing.name ?? "")}`.toLowerCase().includes("lamination") || finishing.billing_basis === "per_sheet" && finishing.side_mode === "per_selected_side"));
    }
    function asMatchShop(shop) {
      return { id: shop.id, name: shop.name, slug: shop.slug };
    }
    function resolveFinishingBillingBasis(finishing) {
      if (finishing.billing_basis) return finishing.billing_basis;
      return isLegacyOrNamedLamination(finishing) ? "per_sheet" : "per_piece";
    }
    function resolveFinishingSideMode(finishing) {
      if (finishing.side_mode) return finishing.side_mode;
      return isLegacyOrNamedLamination(finishing) ? "per_selected_side" : "ignore_sides";
    }
    function isLegacyOrNamedLamination(finishing) {
      return finishing.charge_unit === "PER_SIDE_PER_SHEET" || String(finishing.name ?? "").toLowerCase().includes("lamination");
    }
    function getUnitPriceLine(preview, currency) {
      const totals = preview && typeof preview === "object" ? preview.totals : void 0;
      const unitPrice = totals?.unit_price;
      return typeof unitPrice === "string" || typeof unitPrice === "number" ? `${formatMoney(String(unitPrice), currency)} per item` : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(CalculatorShell, { "anchor-id": __props.anchorId }, createSlots({
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(CalculatorFormGrid, { onSubmit: handlePrimaryAction }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(isSingleShop)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Shop" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(fixedShopDisplayName),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(fixedShopDisplayName),
                              ui: inputUi,
                              readonly: "",
                              disabled: ""
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(isProductMode)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Product" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": __props.product?.name ?? "",
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": __props.product?.name ?? "",
                              ui: inputUi,
                              readonly: "",
                              disabled: ""
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!unref(isProductMode)) {
                    _push3(`<div class="grid gap-4 md:grid-cols-[minmax(0,1.65fr)_minmax(10rem,0.75fr)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Product title" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            modelValue: unref(customTitle),
                            "onUpdate:modelValue": ($event) => isRef(customTitle) ? customTitle.value = $event : null,
                            ui: inputUi,
                            placeholder: "Business cards, flyers, stickers..."
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              modelValue: unref(customTitle),
                              "onUpdate:modelValue": ($event) => isRef(customTitle) ? customTitle.value = $event : null,
                              ui: inputUi,
                              placeholder: "Business cards, flyers, stickers..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Quantity" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(quantity) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(quantity) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Quantity" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(quantity) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: unref(minimumQuantity),
                            "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(quantity) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: unref(minimumQuantity),
                              "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "min", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  }
                  if (!unref(isProductMode)) {
                    _push3(`<!--[--><div class="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Size mode" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex flex-wrap gap-2"${_scopeId3}><!--[-->`);
                          ssrRenderList(sizeModeOptions, (option) => {
                            _push4(`<button type="button" class="${ssrRenderClass([unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white", "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors"])}"${_scopeId3}>${ssrInterpolate(option.label)}</button>`);
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleSizeModeChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (unref(sizeMode) === "custom") {
                      _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Unit" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex flex-wrap gap-2"${_scopeId3}><!--[-->`);
                            ssrRenderList(sizeUnitOptions, (option) => {
                              _push4(`<button type="button" class="${ssrRenderClass([unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white", "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors"])}"${_scopeId3}>${ssrInterpolate(option.label)}</button>`);
                            });
                            _push4(`<!--]--></div>`);
                          } else {
                            return [
                              createVNode("div", { class: "flex flex-wrap gap-2" }, [
                                (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                                  return createVNode("button", {
                                    key: option.value,
                                    type: "button",
                                    class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                    onClick: ($event) => handleInputUnitChange(option.value)
                                  }, toDisplayString(option.label), 11, ["onClick"]);
                                }), 64))
                              ])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                    if (unref(sizeMode) === "standard") {
                      _push3(`<div class="grid gap-4"${_scopeId2}>`);
                      _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Standard size" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(sizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleSizePresetChange
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_USelectMenu, {
                                "model-value": unref(sizeLabel),
                                items: unref(sizePresetOptions),
                                "value-key": "value",
                                "label-key": "label",
                                ui: unref(selectUi),
                                portal: "body",
                                class: "w-full",
                                "onUpdate:modelValue": handleSizePresetChange
                              }, null, 8, ["model-value", "items", "ui"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(sizeMode) === "custom") {
                      _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(CalculatorFieldGroup, {
                        label: `Width (${unref(inputUnit)})`
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              "model-value": unref(widthInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: "90",
                              "onUpdate:modelValue": handleWidthInputChange
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                "model-value": unref(widthInput) || void 0,
                                ui: inputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: "90",
                                "onUpdate:modelValue": handleWidthInputChange
                              }, null, 8, ["model-value"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(CalculatorFieldGroup, {
                        label: `Height (${unref(inputUnit)})`
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              "model-value": unref(heightInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: "50",
                              "onUpdate:modelValue": handleHeightInputChange
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                "model-value": unref(heightInput) || void 0,
                                ui: inputUi,
                                type: "number",
                                min: "0.1",
                                step: "0.01",
                                placeholder: "50",
                                "onUpdate:modelValue": handleHeightInputChange
                              }, null, 8, ["model-value"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  } else if (unref(sizeSummary)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Finished size" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(sizeSummary),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(sizeSummary),
                              ui: inputUi,
                              readonly: "",
                              disabled: ""
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Print sides" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(sides),
                          "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
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
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
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
                          ui: unref(selectUi),
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
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!unref(isProductMode)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Turnaround" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(turnaroundDays) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "6",
                            "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(turnaroundDays) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              placeholder: "6",
                              "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (unref(isSheetMode)) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: unref(isMarketplace) ? "Paper type" : "Paper / GSM"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(paperOptions).length) {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              "model-value": unref(selectedPaperId) ?? void 0,
                              items: unref(paperOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_UInput, {
                              modelValue: unref(marketplacePaperType),
                              "onUpdate:modelValue": ($event) => isRef(marketplacePaperType) ? marketplacePaperType.value = $event : null,
                              ui: inputUi,
                              placeholder: "Art card, matte, bond..."
                            }, null, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            unref(paperOptions).length ? (openBlock(), createBlock(_component_USelectMenu, {
                              key: 0,
                              "model-value": unref(selectedPaperId) ?? void 0,
                              items: unref(paperOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                              key: 1,
                              modelValue: unref(marketplacePaperType),
                              "onUpdate:modelValue": ($event) => isRef(marketplacePaperType) ? marketplacePaperType.value = $event : null,
                              ui: inputUi,
                              placeholder: "Art card, matte, bond..."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: unref(isMarketplace) ? "Sheet size" : "Sheet support"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(isMarketplace)) {
                            _push4(ssrRenderComponent(_component_USelectMenu, {
                              modelValue: unref(marketplaceSheetSize),
                              "onUpdate:modelValue": ($event) => isRef(marketplaceSheetSize) ? marketplaceSheetSize.value = $event : null,
                              items: sheetSizeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(_component_UInput, {
                              "model-value": unref(selectedPaperSupport),
                              ui: inputUi,
                              readonly: "",
                              disabled: ""
                            }, null, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            unref(isMarketplace) ? (openBlock(), createBlock(_component_USelectMenu, {
                              key: 0,
                              modelValue: unref(marketplaceSheetSize),
                              "onUpdate:modelValue": ($event) => isRef(marketplaceSheetSize) ? marketplaceSheetSize.value = $event : null,
                              items: sheetSizeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])) : (openBlock(), createBlock(_component_UInput, {
                              key: 1,
                              "model-value": unref(selectedPaperSupport),
                              ui: inputUi,
                              readonly: "",
                              disabled: ""
                            }, null, 8, ["model-value"]))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (unref(isMarketplace) && unref(isSheetMode)) {
                      _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Paper GSM" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_UInput, {
                              "model-value": unref(marketplacePaperGsm) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              placeholder: "300",
                              "onUpdate:modelValue": ($event) => marketplacePaperGsm.value = unref(normalizeNumberValue)($event)
                            }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(_component_UInput, {
                                "model-value": unref(marketplacePaperGsm) ?? void 0,
                                ui: inputUi,
                                type: "number",
                                min: "1",
                                placeholder: "300",
                                "onUpdate:modelValue": ($event) => marketplacePaperGsm.value = unref(normalizeNumberValue)($event)
                              }, null, 8, ["model-value", "onUpdate:modelValue"])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(isLargeFormatMode) && unref(materialOptions).length) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Material" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(selectedMaterialId) ?? void 0,
                            items: unref(materialOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedMaterialId.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(selectedMaterialId) ?? void 0,
                              items: unref(materialOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedMaterialId.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!unref(isProductMode)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Custom brief" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UTextarea, {
                            modelValue: unref(customBrief),
                            "onUpdate:modelValue": ($event) => isRef(customBrief) ? customBrief.value = $event : null,
                            ui: textareaUi,
                            rows: 3,
                            placeholder: "Describe artwork, stock, finishing, delivery, or special handling."
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UTextarea, {
                              modelValue: unref(customBrief),
                              "onUpdate:modelValue": ($event) => isRef(customBrief) ? customBrief.value = $event : null,
                              ui: textareaUi,
                              rows: 3,
                              placeholder: "Describe artwork, stock, finishing, delivery, or special handling."
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(showFinishingToggle)) {
                    _push3(`<div class="rounded-xl border border-white/10 bg-white/[0.03]"${_scopeId2}><button type="button" class="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300"${_scopeId2}><span${_scopeId2}>Finishings</span>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: unref(showFinishingPanel) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button>`);
                    if (unref(showFinishingPanel)) {
                      _push3(`<div class="px-3 pb-3"${_scopeId2}>`);
                      if (unref(finishingGroups).length) {
                        _push3(ssrRenderComponent(FinishingSelector, {
                          groups: unref(finishingGroups),
                          "lamination-sides": laminationSides,
                          "select-ui": unref(selectUi),
                          "is-selected": isFinishingSelected,
                          "show-side-selector": isFinishingSideOpen,
                          "get-side": selectedFinishingSide,
                          onToggle: toggleFinishing,
                          onUpdateSide: updateFinishingSide
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<div class="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300"${_scopeId2}> Loading finishings... </div>`);
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(isMarketplace) && unref(visibleMatches).length) {
                    _push3(`<div class="rounded-xl border border-white/10 bg-white/[0.04] p-4"${_scopeId2}><div class="flex items-center justify-between gap-3"${_scopeId2}><p class="text-sm font-semibold text-white"${_scopeId2}>Matching shops</p><span class="text-xs text-slate-300"${_scopeId2}>Showing ${ssrInterpolate(unref(visibleMatches).length)} of ${ssrInterpolate(unref(matchResponse)?.matches_count ?? unref(visibleMatches).length)}</span></div><div class="mt-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(QuotesShopSelectionChips, {
                      shops: unref(visibleMatches).map((shop) => ({ slug: shop.slug, label: shop.name })),
                      "selected-slugs": unref(selectedMatchShopSlugs),
                      onToggle: toggleMatchedShop
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(isMarketplace)) {
                    _push3(`<div class="flex items-center gap-2"${_scopeId2}><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 hover:text-flamingo-600 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(missingRequirements).length > 0 || unref(loading)) ? " disabled" : ""}${ssrRenderAttr("title", unref(primaryLabel))}${ssrRenderAttr("aria-label", unref(primaryLabel))}${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: unref(loading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                      class: unref(loading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} title="Clear calculator" aria-label="Clear calculator"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-rotate-ccw",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button><button type="button" class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(canSendRequest)) ? " disabled" : ""}${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-send",
                      class: "mr-2 h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(` ${ssrInterpolate(unref(sendActionLabel))}</button></div>`);
                  } else {
                    _push3(`<div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"${_scopeId2}><button type="button" class="inline-flex min-h-11 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(missingRequirements).length > 0 || unref(loading)) ? " disabled" : ""}${_scopeId2}>${ssrInterpolate(unref(primaryLabel))}</button><button type="button" class="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(canSendRequest)) ? " disabled" : ""}${_scopeId2}>${ssrInterpolate(unref(sendActionLabel))}</button><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} title="Reset calculator" aria-label="Reset calculator"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-rotate-ccw",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`</button></div>`);
                  }
                  if (unref(isProductMode) && props.product?.rush_available) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Turnaround speed" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            modelValue: unref(turnaroundMode),
                            "onUpdate:modelValue": ($event) => isRef(turnaroundMode) ? turnaroundMode.value = $event : null,
                            items: turnaroundModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(turnaroundMode),
                              "onUpdate:modelValue": ($event) => isRef(turnaroundMode) ? turnaroundMode.value = $event : null,
                              items: turnaroundModeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
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
                } else {
                  return [
                    unref(isSingleShop) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 0,
                      label: "Shop"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(fixedShopDisplayName),
                          ui: inputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 1,
                      label: "Product"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": __props.product?.name ?? "",
                          ui: inputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    !unref(isProductMode) ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "grid gap-4 md:grid-cols-[minmax(0,1.65fr)_minmax(10rem,0.75fr)]"
                    }, [
                      createVNode(CalculatorFieldGroup, { label: "Product title" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            modelValue: unref(customTitle),
                            "onUpdate:modelValue": ($event) => isRef(customTitle) ? customTitle.value = $event : null,
                            ui: inputUi,
                            placeholder: "Business cards, flyers, stickers..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(quantity) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])) : (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 3,
                      label: "Quantity"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(quantity) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: unref(minimumQuantity),
                          "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "min", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })),
                    !unref(isProductMode) ? (openBlock(), createBlock(Fragment, { key: 4 }, [
                      createVNode("div", { class: "grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" }, [
                        createVNode(CalculatorFieldGroup, { label: "Size mode" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleSizeModeChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ]),
                          _: 1
                        }),
                        unref(sizeMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                          key: 0,
                          label: "Unit"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleInputUnitChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      unref(sizeMode) === "standard" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-4"
                      }, [
                        createVNode(CalculatorFieldGroup, { label: "Standard size" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(sizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleSizePresetChange
                            }, null, 8, ["model-value", "items", "ui"])
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true),
                      unref(sizeMode) === "custom" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "grid gap-4 md:grid-cols-2"
                      }, [
                        createVNode(CalculatorFieldGroup, {
                          label: `Width (${unref(inputUnit)})`
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(widthInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: "90",
                              "onUpdate:modelValue": handleWidthInputChange
                            }, null, 8, ["model-value"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(CalculatorFieldGroup, {
                          label: `Height (${unref(inputUnit)})`
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(heightInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              placeholder: "50",
                              "onUpdate:modelValue": handleHeightInputChange
                            }, null, 8, ["model-value"])
                          ]),
                          _: 1
                        }, 8, ["label"])
                      ])) : createCommentVNode("", true)
                    ], 64)) : unref(sizeSummary) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 5,
                      label: "Finished size"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(sizeSummary),
                          ui: inputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3" }, [
                      createVNode(CalculatorFieldGroup, { label: "Print sides" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(sides),
                            "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
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
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      }),
                      !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                        key: 0,
                        label: "Turnaround"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(turnaroundDays) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "6",
                            "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    unref(isSheetMode) ? (openBlock(), createBlock("div", {
                      key: 6,
                      class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                    }, [
                      createVNode(CalculatorFieldGroup, {
                        label: unref(isMarketplace) ? "Paper type" : "Paper / GSM"
                      }, {
                        default: withCtx(() => [
                          unref(paperOptions).length ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            "model-value": unref(selectedPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                            key: 1,
                            modelValue: unref(marketplacePaperType),
                            "onUpdate:modelValue": ($event) => isRef(marketplacePaperType) ? marketplacePaperType.value = $event : null,
                            ui: inputUi,
                            placeholder: "Art card, matte, bond..."
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]))
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(CalculatorFieldGroup, {
                        label: unref(isMarketplace) ? "Sheet size" : "Sheet support"
                      }, {
                        default: withCtx(() => [
                          unref(isMarketplace) ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            modelValue: unref(marketplaceSheetSize),
                            "onUpdate:modelValue": ($event) => isRef(marketplaceSheetSize) ? marketplaceSheetSize.value = $event : null,
                            items: sheetSizeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])) : (openBlock(), createBlock(_component_UInput, {
                            key: 1,
                            "model-value": unref(selectedPaperSupport),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, 8, ["model-value"]))
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      unref(isMarketplace) && unref(isSheetMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                        key: 0,
                        label: "Paper GSM"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(marketplacePaperGsm) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "300",
                            "onUpdate:modelValue": ($event) => marketplacePaperGsm.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    unref(isLargeFormatMode) && unref(materialOptions).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 7,
                      label: "Material"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          "model-value": unref(selectedMaterialId) ?? void 0,
                          items: unref(materialOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedMaterialId.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 8,
                      label: "Custom brief"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UTextarea, {
                          modelValue: unref(customBrief),
                          "onUpdate:modelValue": ($event) => isRef(customBrief) ? customBrief.value = $event : null,
                          ui: textareaUi,
                          rows: 3,
                          placeholder: "Describe artwork, stock, finishing, delivery, or special handling."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    unref(showFinishingToggle) ? (openBlock(), createBlock("div", {
                      key: 9,
                      class: "rounded-xl border border-white/10 bg-white/[0.03]"
                    }, [
                      createVNode("button", {
                        type: "button",
                        class: "flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300",
                        onClick: ($event) => showFinishingPanel.value = !unref(showFinishingPanel)
                      }, [
                        createVNode("span", null, "Finishings"),
                        createVNode(_component_UIcon, {
                          name: unref(showFinishingPanel) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                          class: "h-4 w-4"
                        }, null, 8, ["name"])
                      ], 8, ["onClick"]),
                      unref(showFinishingPanel) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "px-3 pb-3"
                      }, [
                        unref(finishingGroups).length ? (openBlock(), createBlock(FinishingSelector, {
                          key: 0,
                          groups: unref(finishingGroups),
                          "lamination-sides": laminationSides,
                          "select-ui": unref(selectUi),
                          "is-selected": isFinishingSelected,
                          "show-side-selector": isFinishingSideOpen,
                          "get-side": selectedFinishingSide,
                          onToggle: toggleFinishing,
                          onUpdateSide: updateFinishingSide
                        }, null, 8, ["groups", "select-ui"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300"
                        }, " Loading finishings... "))
                      ])) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    unref(isMarketplace) && unref(visibleMatches).length ? (openBlock(), createBlock("div", {
                      key: 10,
                      class: "rounded-xl border border-white/10 bg-white/[0.04] p-4"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, "Matching shops"),
                        createVNode("span", { class: "text-xs text-slate-300" }, "Showing " + toDisplayString(unref(visibleMatches).length) + " of " + toDisplayString(unref(matchResponse)?.matches_count ?? unref(visibleMatches).length), 1)
                      ]),
                      createVNode("div", { class: "mt-3" }, [
                        createVNode(QuotesShopSelectionChips, {
                          shops: unref(visibleMatches).map((shop) => ({ slug: shop.slug, label: shop.name })),
                          "selected-slugs": unref(selectedMatchShopSlugs),
                          onToggle: toggleMatchedShop
                        }, null, 8, ["shops", "selected-slugs"])
                      ])
                    ])) : createCommentVNode("", true),
                    unref(isMarketplace) ? (openBlock(), createBlock("div", {
                      key: 11,
                      class: "flex items-center gap-2"
                    }, [
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 hover:text-flamingo-600 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: unref(missingRequirements).length > 0 || unref(loading),
                        title: unref(primaryLabel),
                        "aria-label": unref(primaryLabel),
                        onClick: handlePrimaryAction
                      }, [
                        createVNode(_component_UIcon, {
                          name: unref(loading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                          class: unref(loading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                        }, null, 8, ["name", "class"])
                      ], 8, ["disabled", "title", "aria-label"]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: unref(loading),
                        title: "Clear calculator",
                        "aria-label": "Clear calculator",
                        onClick: resetForm
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-rotate-ccw",
                          class: "h-4 w-4"
                        })
                      ], 8, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: !unref(canSendRequest),
                        onClick: handleSendRequest
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-send",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(sendActionLabel)), 1)
                      ], 8, ["disabled"])
                    ])) : (openBlock(), createBlock("div", {
                      key: 12,
                      class: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                    }, [
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex min-h-11 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: unref(missingRequirements).length > 0 || unref(loading),
                        onClick: handlePrimaryAction
                      }, toDisplayString(unref(primaryLabel)), 9, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: !unref(canSendRequest),
                        onClick: handleSendRequest
                      }, toDisplayString(unref(sendActionLabel)), 9, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: unref(loading),
                        title: "Reset calculator",
                        "aria-label": "Reset calculator",
                        onClick: resetForm
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-rotate-ccw",
                          class: "h-4 w-4"
                        })
                      ], 8, ["disabled"])
                    ])),
                    unref(isProductMode) && props.product?.rush_available ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 13,
                      label: "Turnaround speed"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(turnaroundMode),
                          "onUpdate:modelValue": ($event) => isRef(turnaroundMode) ? turnaroundMode.value = $event : null,
                          items: turnaroundModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
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
              createVNode(CalculatorFormGrid, { onSubmit: handlePrimaryAction }, {
                default: withCtx(() => [
                  unref(isSingleShop) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 0,
                    label: "Shop"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        "model-value": unref(fixedShopDisplayName),
                        ui: inputUi,
                        readonly: "",
                        disabled: ""
                      }, null, 8, ["model-value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 1,
                    label: "Product"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        "model-value": __props.product?.name ?? "",
                        ui: inputUi,
                        readonly: "",
                        disabled: ""
                      }, null, 8, ["model-value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  !unref(isProductMode) ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid gap-4 md:grid-cols-[minmax(0,1.65fr)_minmax(10rem,0.75fr)]"
                  }, [
                    createVNode(CalculatorFieldGroup, { label: "Product title" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(customTitle),
                          "onUpdate:modelValue": ($event) => isRef(customTitle) ? customTitle.value = $event : null,
                          ui: inputUi,
                          placeholder: "Business cards, flyers, stickers..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(quantity) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])) : (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 3,
                    label: "Quantity"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        "model-value": unref(quantity) ?? void 0,
                        ui: inputUi,
                        type: "number",
                        min: unref(minimumQuantity),
                        "onUpdate:modelValue": ($event) => quantity.value = unref(normalizeNumberValue)($event)
                      }, null, 8, ["model-value", "min", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })),
                  !unref(isProductMode) ? (openBlock(), createBlock(Fragment, { key: 4 }, [
                    createVNode("div", { class: "grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" }, [
                      createVNode(CalculatorFieldGroup, { label: "Size mode" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                              return createVNode("button", {
                                key: option.value,
                                type: "button",
                                class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                onClick: ($event) => handleSizeModeChange(option.value)
                              }, toDisplayString(option.label), 11, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        _: 1
                      }),
                      unref(sizeMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                        key: 0,
                        label: "Unit"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                              return createVNode("button", {
                                key: option.value,
                                type: "button",
                                class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                onClick: ($event) => handleInputUnitChange(option.value)
                              }, toDisplayString(option.label), 11, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    unref(sizeMode) === "standard" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-4"
                    }, [
                      createVNode(CalculatorFieldGroup, { label: "Standard size" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(sizeLabel),
                            items: unref(sizePresetOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": handleSizePresetChange
                          }, null, 8, ["model-value", "items", "ui"])
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true),
                    unref(sizeMode) === "custom" ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "grid gap-4 md:grid-cols-2"
                    }, [
                      createVNode(CalculatorFieldGroup, {
                        label: `Width (${unref(inputUnit)})`
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(widthInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            placeholder: "90",
                            "onUpdate:modelValue": handleWidthInputChange
                          }, null, 8, ["model-value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(CalculatorFieldGroup, {
                        label: `Height (${unref(inputUnit)})`
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(heightInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            placeholder: "50",
                            "onUpdate:modelValue": handleHeightInputChange
                          }, null, 8, ["model-value"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ])) : createCommentVNode("", true)
                  ], 64)) : unref(sizeSummary) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 5,
                    label: "Finished size"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        "model-value": unref(sizeSummary),
                        ui: inputUi,
                        readonly: "",
                        disabled: ""
                      }, null, 8, ["model-value"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3" }, [
                    createVNode(CalculatorFieldGroup, { label: "Print sides" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(sides),
                          "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
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
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      _: 1
                    }),
                    !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 0,
                      label: "Turnaround"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(turnaroundDays) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          placeholder: "6",
                          "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  unref(isSheetMode) ? (openBlock(), createBlock("div", {
                    key: 6,
                    class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                  }, [
                    createVNode(CalculatorFieldGroup, {
                      label: unref(isMarketplace) ? "Paper type" : "Paper / GSM"
                    }, {
                      default: withCtx(() => [
                        unref(paperOptions).length ? (openBlock(), createBlock(_component_USelectMenu, {
                          key: 0,
                          "model-value": unref(selectedPaperId) ?? void 0,
                          items: unref(paperOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedPaperId.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                          key: 1,
                          modelValue: unref(marketplacePaperType),
                          "onUpdate:modelValue": ($event) => isRef(marketplacePaperType) ? marketplacePaperType.value = $event : null,
                          ui: inputUi,
                          placeholder: "Art card, matte, bond..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]))
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    createVNode(CalculatorFieldGroup, {
                      label: unref(isMarketplace) ? "Sheet size" : "Sheet support"
                    }, {
                      default: withCtx(() => [
                        unref(isMarketplace) ? (openBlock(), createBlock(_component_USelectMenu, {
                          key: 0,
                          modelValue: unref(marketplaceSheetSize),
                          "onUpdate:modelValue": ($event) => isRef(marketplaceSheetSize) ? marketplaceSheetSize.value = $event : null,
                          items: sheetSizeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])) : (openBlock(), createBlock(_component_UInput, {
                          key: 1,
                          "model-value": unref(selectedPaperSupport),
                          ui: inputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"]))
                      ]),
                      _: 1
                    }, 8, ["label"]),
                    unref(isMarketplace) && unref(isSheetMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 0,
                      label: "Paper GSM"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(marketplacePaperGsm) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          placeholder: "300",
                          "onUpdate:modelValue": ($event) => marketplacePaperGsm.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  unref(isLargeFormatMode) && unref(materialOptions).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 7,
                    label: "Material"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        "model-value": unref(selectedMaterialId) ?? void 0,
                        items: unref(materialOptions),
                        "value-key": "value",
                        "label-key": "label",
                        ui: unref(selectUi),
                        portal: "body",
                        class: "w-full",
                        "onUpdate:modelValue": ($event) => selectedMaterialId.value = unref(normalizeNumberValue)($event)
                      }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 8,
                    label: "Custom brief"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(customBrief),
                        "onUpdate:modelValue": ($event) => isRef(customBrief) ? customBrief.value = $event : null,
                        ui: textareaUi,
                        rows: 3,
                        placeholder: "Describe artwork, stock, finishing, delivery, or special handling."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(showFinishingToggle) ? (openBlock(), createBlock("div", {
                    key: 9,
                    class: "rounded-xl border border-white/10 bg-white/[0.03]"
                  }, [
                    createVNode("button", {
                      type: "button",
                      class: "flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300",
                      onClick: ($event) => showFinishingPanel.value = !unref(showFinishingPanel)
                    }, [
                      createVNode("span", null, "Finishings"),
                      createVNode(_component_UIcon, {
                        name: unref(showFinishingPanel) ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
                        class: "h-4 w-4"
                      }, null, 8, ["name"])
                    ], 8, ["onClick"]),
                    unref(showFinishingPanel) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "px-3 pb-3"
                    }, [
                      unref(finishingGroups).length ? (openBlock(), createBlock(FinishingSelector, {
                        key: 0,
                        groups: unref(finishingGroups),
                        "lamination-sides": laminationSides,
                        "select-ui": unref(selectUi),
                        "is-selected": isFinishingSelected,
                        "show-side-selector": isFinishingSideOpen,
                        "get-side": selectedFinishingSide,
                        onToggle: toggleFinishing,
                        onUpdateSide: updateFinishingSide
                      }, null, 8, ["groups", "select-ui"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300"
                      }, " Loading finishings... "))
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  unref(isMarketplace) && unref(visibleMatches).length ? (openBlock(), createBlock("div", {
                    key: 10,
                    class: "rounded-xl border border-white/10 bg-white/[0.04] p-4"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                      createVNode("p", { class: "text-sm font-semibold text-white" }, "Matching shops"),
                      createVNode("span", { class: "text-xs text-slate-300" }, "Showing " + toDisplayString(unref(visibleMatches).length) + " of " + toDisplayString(unref(matchResponse)?.matches_count ?? unref(visibleMatches).length), 1)
                    ]),
                    createVNode("div", { class: "mt-3" }, [
                      createVNode(QuotesShopSelectionChips, {
                        shops: unref(visibleMatches).map((shop) => ({ slug: shop.slug, label: shop.name })),
                        "selected-slugs": unref(selectedMatchShopSlugs),
                        onToggle: toggleMatchedShop
                      }, null, 8, ["shops", "selected-slugs"])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(isMarketplace) ? (openBlock(), createBlock("div", {
                    key: 11,
                    class: "flex items-center gap-2"
                  }, [
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 hover:text-flamingo-600 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: unref(missingRequirements).length > 0 || unref(loading),
                      title: unref(primaryLabel),
                      "aria-label": unref(primaryLabel),
                      onClick: handlePrimaryAction
                    }, [
                      createVNode(_component_UIcon, {
                        name: unref(loading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                        class: unref(loading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                      }, null, 8, ["name", "class"])
                    ], 8, ["disabled", "title", "aria-label"]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: unref(loading),
                      title: "Clear calculator",
                      "aria-label": "Clear calculator",
                      onClick: resetForm
                    }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-rotate-ccw",
                        class: "h-4 w-4"
                      })
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: !unref(canSendRequest),
                      onClick: handleSendRequest
                    }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-send",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" " + toDisplayString(unref(sendActionLabel)), 1)
                    ], 8, ["disabled"])
                  ])) : (openBlock(), createBlock("div", {
                    key: 12,
                    class: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                  }, [
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex min-h-11 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: unref(missingRequirements).length > 0 || unref(loading),
                      onClick: handlePrimaryAction
                    }, toDisplayString(unref(primaryLabel)), 9, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: !unref(canSendRequest),
                      onClick: handleSendRequest
                    }, toDisplayString(unref(sendActionLabel)), 9, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: unref(loading),
                      title: "Reset calculator",
                      "aria-label": "Reset calculator",
                      onClick: resetForm
                    }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-rotate-ccw",
                        class: "h-4 w-4"
                      })
                    ], 8, ["disabled"])
                  ])),
                  unref(isProductMode) && props.product?.rush_available ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 13,
                    label: "Turnaround speed"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(turnaroundMode),
                        "onUpdate:modelValue": ($event) => isRef(turnaroundMode) ? turnaroundMode.value = $event : null,
                        items: turnaroundModeOptions,
                        "value-key": "value",
                        "label-key": "label",
                        ui: unref(selectUi),
                        portal: "body",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
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
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(showPreviewSwitcher)) {
              _push2(`<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(CalculatorTypeSwitcher, {
                "model-value": __props.calculatorType ?? void 0,
                options: __props.calculatorTypeOptions,
                size: "sm",
                tone: "embedded",
                "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(QuotePreviewPanel, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: unref(isMarketplace) ? "Selected shops" : "Selected shop",
                    lines: unref(shopSummaryLines),
                    placeholder: unref(shopSummaryPlaceholder)
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: "Job summary",
                    lines: unref(jobSummaryLines),
                    placeholder: "Pending"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: "Production plan",
                    lines: unref(productionSummaryLines),
                    placeholder: "Pending"
                  }, null, _parent3, _scopeId2));
                  if (unref(missingRequirements).length) {
                    _push3(ssrRenderComponent(QuotePreviewRequirementsState, {
                      title: "Complete these details",
                      items: unref(missingRequirements),
                      helper: unref(requirementsHelper)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<div class="rounded-xl border border-slate-200 bg-slate-50 p-4"${_scopeId2}>`);
                    if (unref(piecesPerSheet) || unref(sheetsRequired)) {
                      _push3(`<div class="mb-4 grid gap-3 sm:grid-cols-2"${_scopeId2}><div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm"${_scopeId2}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500"${_scopeId2}>Pcs per sheet</p><p class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900"${_scopeId2}>${ssrInterpolate(unref(piecesPerSheet) || "â€”")}</p></div><div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm"${_scopeId2}><p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500"${_scopeId2}>Sheets required</p><p class="mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600"${_scopeId2}>${ssrInterpolate(unref(sheetsRequired) || "â€”")}</p></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="flex items-baseline justify-between gap-4"${_scopeId2}><span class="text-sm font-semibold text-slate-700"${_scopeId2}>${ssrInterpolate(unref(priceLabel))}</span><span class="text-lg font-bold text-slate-900"${_scopeId2}>${ssrInterpolate(unref(priceLine))}</span></div>`);
                    if (unref(priceHelper)) {
                      _push3(`<div class="mt-1 text-sm text-slate-500"${_scopeId2}>${ssrInterpolate(unref(priceHelper))}</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(priceBreakdownLines).length) {
                      _push3(`<dl class="mt-3 space-y-2 border-t border-slate-200 pt-3"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(priceBreakdownLines), (line) => {
                        _push3(`<div class="flex items-center justify-between gap-3 text-sm"${_scopeId2}><dt class="text-slate-500"${_scopeId2}>${ssrInterpolate(line.label)}</dt><dd class="font-semibold text-slate-900"${_scopeId2}>${ssrInterpolate(line.value)}</dd></div>`);
                      });
                      _push3(`<!--]--></dl>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(perSheetBreakdown).formula || unref(perSheetBreakdown).explanation) {
                      _push3(`<div class="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"${_scopeId2}>`);
                      if (unref(perSheetBreakdown).formula) {
                        _push3(`<p class="font-semibold text-slate-700"${_scopeId2}>${ssrInterpolate(unref(perSheetBreakdown).formula)}</p>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (unref(perSheetBreakdown).explanation) {
                        _push3(`<p class="mt-1"${_scopeId2}>${ssrInterpolate(unref(perSheetBreakdown).explanation)}</p>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(backendMissingRequirements).length) {
                      _push3(`<div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"${_scopeId2}> Missing backend requirements: ${ssrInterpolate(unref(backendMissingRequirements).join(", "))}</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(QuotePreviewMeta, {
                        title: unref(isMarketplace) ? "Selected shops" : "Selected shop",
                        lines: unref(shopSummaryLines),
                        placeholder: unref(shopSummaryPlaceholder)
                      }, null, 8, ["title", "lines", "placeholder"]),
                      createVNode(QuotePreviewMeta, {
                        title: "Job summary",
                        lines: unref(jobSummaryLines),
                        placeholder: "Pending"
                      }, null, 8, ["lines"]),
                      createVNode(QuotePreviewMeta, {
                        title: "Production plan",
                        lines: unref(productionSummaryLines),
                        placeholder: "Pending"
                      }, null, 8, ["lines"]),
                      unref(missingRequirements).length ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                        key: 0,
                        title: "Complete these details",
                        items: unref(missingRequirements),
                        helper: unref(requirementsHelper)
                      }, null, 8, ["items", "helper"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-xl border border-slate-200 bg-slate-50 p-4"
                      }, [
                        unref(piecesPerSheet) || unref(sheetsRequired) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mb-4 grid gap-3 sm:grid-cols-2"
                        }, [
                          createVNode("div", { class: "rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm" }, [
                            createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500" }, "Pcs per sheet"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold tracking-tight text-slate-900" }, toDisplayString(unref(piecesPerSheet) || "â€”"), 1)
                          ]),
                          createVNode("div", { class: "rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm" }, [
                            createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500" }, "Sheets required"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600" }, toDisplayString(unref(sheetsRequired) || "â€”"), 1)
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-baseline justify-between gap-4" }, [
                          createVNode("span", { class: "text-sm font-semibold text-slate-700" }, toDisplayString(unref(priceLabel)), 1),
                          createVNode("span", { class: "text-lg font-bold text-slate-900" }, toDisplayString(unref(priceLine)), 1)
                        ]),
                        unref(priceHelper) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mt-1 text-sm text-slate-500"
                        }, toDisplayString(unref(priceHelper)), 1)) : createCommentVNode("", true),
                        unref(priceBreakdownLines).length ? (openBlock(), createBlock("dl", {
                          key: 2,
                          class: "mt-3 space-y-2 border-t border-slate-200 pt-3"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(priceBreakdownLines), (line) => {
                            return openBlock(), createBlock("div", {
                              key: line.label,
                              class: "flex items-center justify-between gap-3 text-sm"
                            }, [
                              createVNode("dt", { class: "text-slate-500" }, toDisplayString(line.label), 1),
                              createVNode("dd", { class: "font-semibold text-slate-900" }, toDisplayString(line.value), 1)
                            ]);
                          }), 128))
                        ])) : createCommentVNode("", true),
                        unref(perSheetBreakdown).formula || unref(perSheetBreakdown).explanation ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                        }, [
                          unref(perSheetBreakdown).formula ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "font-semibold text-slate-700"
                          }, toDisplayString(unref(perSheetBreakdown).formula), 1)) : createCommentVNode("", true),
                          unref(perSheetBreakdown).explanation ? (openBlock(), createBlock("p", {
                            key: 1,
                            class: "mt-1"
                          }, toDisplayString(unref(perSheetBreakdown).explanation), 1)) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        unref(backendMissingRequirements).length ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        }, " Missing backend requirements: " + toDisplayString(unref(backendMissingRequirements).join(", ")), 1)) : createCommentVNode("", true)
                      ]))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(sendFeedback)) {
              _push2(`<div class="${ssrRenderClass(unref(sendFeedbackTone) === "success" ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800")}"${_scopeId}>${ssrInterpolate(unref(sendFeedback))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(showPreviewSwitcher) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                }, [
                  createVNode(CalculatorTypeSwitcher, {
                    "model-value": __props.calculatorType ?? void 0,
                    options: __props.calculatorTypeOptions,
                    size: "sm",
                    tone: "embedded",
                    "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : createCommentVNode("", true),
                createVNode(QuotePreviewPanel, null, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(QuotePreviewMeta, {
                        title: unref(isMarketplace) ? "Selected shops" : "Selected shop",
                        lines: unref(shopSummaryLines),
                        placeholder: unref(shopSummaryPlaceholder)
                      }, null, 8, ["title", "lines", "placeholder"]),
                      createVNode(QuotePreviewMeta, {
                        title: "Job summary",
                        lines: unref(jobSummaryLines),
                        placeholder: "Pending"
                      }, null, 8, ["lines"]),
                      createVNode(QuotePreviewMeta, {
                        title: "Production plan",
                        lines: unref(productionSummaryLines),
                        placeholder: "Pending"
                      }, null, 8, ["lines"]),
                      unref(missingRequirements).length ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                        key: 0,
                        title: "Complete these details",
                        items: unref(missingRequirements),
                        helper: unref(requirementsHelper)
                      }, null, 8, ["items", "helper"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-xl border border-slate-200 bg-slate-50 p-4"
                      }, [
                        unref(piecesPerSheet) || unref(sheetsRequired) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mb-4 grid gap-3 sm:grid-cols-2"
                        }, [
                          createVNode("div", { class: "rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm" }, [
                            createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500" }, "Pcs per sheet"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold tracking-tight text-slate-900" }, toDisplayString(unref(piecesPerSheet) || "â€”"), 1)
                          ]),
                          createVNode("div", { class: "rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm" }, [
                            createVNode("p", { class: "text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500" }, "Sheets required"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600" }, toDisplayString(unref(sheetsRequired) || "â€”"), 1)
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex items-baseline justify-between gap-4" }, [
                          createVNode("span", { class: "text-sm font-semibold text-slate-700" }, toDisplayString(unref(priceLabel)), 1),
                          createVNode("span", { class: "text-lg font-bold text-slate-900" }, toDisplayString(unref(priceLine)), 1)
                        ]),
                        unref(priceHelper) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mt-1 text-sm text-slate-500"
                        }, toDisplayString(unref(priceHelper)), 1)) : createCommentVNode("", true),
                        unref(priceBreakdownLines).length ? (openBlock(), createBlock("dl", {
                          key: 2,
                          class: "mt-3 space-y-2 border-t border-slate-200 pt-3"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(priceBreakdownLines), (line) => {
                            return openBlock(), createBlock("div", {
                              key: line.label,
                              class: "flex items-center justify-between gap-3 text-sm"
                            }, [
                              createVNode("dt", { class: "text-slate-500" }, toDisplayString(line.label), 1),
                              createVNode("dd", { class: "font-semibold text-slate-900" }, toDisplayString(line.value), 1)
                            ]);
                          }), 128))
                        ])) : createCommentVNode("", true),
                        unref(perSheetBreakdown).formula || unref(perSheetBreakdown).explanation ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                        }, [
                          unref(perSheetBreakdown).formula ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "font-semibold text-slate-700"
                          }, toDisplayString(unref(perSheetBreakdown).formula), 1)) : createCommentVNode("", true),
                          unref(perSheetBreakdown).explanation ? (openBlock(), createBlock("p", {
                            key: 1,
                            class: "mt-1"
                          }, toDisplayString(unref(perSheetBreakdown).explanation), 1)) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        unref(backendMissingRequirements).length ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        }, " Missing backend requirements: " + toDisplayString(unref(backendMissingRequirements).join(", ")), 1)) : createCommentVNode("", true)
                      ]))
                    ])
                  ]),
                  _: 1
                }),
                unref(sendFeedback) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: unref(sendFeedbackTone) === "success" ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                }, toDisplayString(unref(sendFeedback)), 3)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 2
      }, [
        unref(showHeaderContent) || unref(showHeaderSwitcher) ? {
          name: "header",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass(__props.compact ? "space-y-3" : "space-y-4")}"${_scopeId}><div class="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"${_scopeId}>`);
              _push2(ssrRenderComponent(CalculatorHeaderBlock, {
                eyebrow: __props.eyebrow,
                title: __props.title,
                description: __props.description,
                compact: __props.compact
              }, null, _parent2, _scopeId));
              if (unref(showHeaderSwitcher)) {
                _push2(ssrRenderComponent(CalculatorTypeSwitcher, {
                  "model-value": __props.calculatorType ?? void 0,
                  options: __props.calculatorTypeOptions,
                  size: "sm",
                  tone: "embedded",
                  "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", {
                  class: __props.compact ? "space-y-3" : "space-y-4"
                }, [
                  createVNode("div", { class: "flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between" }, [
                    createVNode(CalculatorHeaderBlock, {
                      eyebrow: __props.eyebrow,
                      title: __props.title,
                      description: __props.description,
                      compact: __props.compact
                    }, null, 8, ["eyebrow", "title", "description", "compact"]),
                    unref(showHeaderSwitcher) ? (openBlock(), createBlock(CalculatorTypeSwitcher, {
                      key: 0,
                      "model-value": __props.calculatorType ?? void 0,
                      options: __props.calculatorTypeOptions,
                      size: "sm",
                      tone: "embedded",
                      "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"])) : createCommentVNode("", true)
                  ])
                ], 2)
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/PublicCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "QuotesPublicCalculator" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=PublicCalculator-kld7cVNY.mjs.map
