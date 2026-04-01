import { _ as _sfc_main$1 } from './Input-DZEAnFef.mjs';
import { _ as _sfc_main$2 } from './Textarea-BGCp2SzO.mjs';
import { _ as _sfc_main$3 } from './SelectMenu-DDFAjir1.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { C as CalculatorShell, a as QuotePreviewPanel, b as QuotePreviewMeta, c as QuotePreviewRequirementsState, Q as QuotesShopSelectionChips, d as CalculatorFormGrid, e as CalculatorFieldGroup, f as calculatorSelectUi, F as FinishingSelector, g as CalculatorHeaderBlock } from './quoteInbox-CT7a8yeE.mjs';
import { u as useQuoteRequestBlast } from './useQuoteRequestBlast-BX_QZhbB.mjs';
import { a as getGalleryProductOptions } from './gallery-CWXZbZWT.mjs';
import { c as useAuthStore, f as useRoute, e as useToast, i as usePublicApiNoAuth, A as API } from './server.mjs';
import { g as getCatalog, m as matchShops, p as previewShopCalculator } from './public-Dys9UREH.mjs';
import { n as normalizeNumberValue, a as normalizeSelectValue } from './payload-B_6emhZU.mjs';
import { e as extractProductionDetails } from './productionDetails-ByImjBQh.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-BbngrNPq.mjs';

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
    product: { default: null }
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const authStore = useAuthStore();
    const route = useRoute();
    const toast = useToast();
    const publicApiNoAuth = usePublicApiNoAuth();
    const { saveAndSend } = useQuoteRequestBlast();
    const selectUi = calculatorSelectUi;
    const inputUi = { base: "w-full px-4 text-sm" };
    const textareaUi = { base: "w-full px-4 py-2 text-sm min-h-[7rem]" };
    const laminationSides = [{ label: "Front only", value: "front" }, { label: "Back only", value: "back" }, { label: "Both sides", value: "both" }];
    const sidesOptions = [{ label: "Front only", value: "SIMPLEX" }, { label: "Both sides", value: "DUPLEX" }];
    const colorModeOptions = [{ label: "Black and white", value: "BW" }, { label: "Full colour", value: "COLOR" }];
    const sheetSizeOptions = [{ label: "SRA3", value: "SRA3" }, { label: "A3", value: "A3" }, { label: "A4", value: "A4" }, { label: "A5", value: "A5" }];
    const isMarketplace = computed(() => props.mode === "marketplace");
    const isProductMode = computed(() => props.mode === "tweak" || props.mode === "tweak-and-quote");
    const isSingleShop = computed(() => props.mode === "single-shop" || isProductMode.value);
    const isSheetMode = computed(() => (props.product?.pricing_mode ?? "SHEET") === "SHEET");
    const isLargeFormatMode = computed(() => (props.product?.pricing_mode ?? "SHEET") === "LARGE_FORMAT");
    const minimumQuantity = computed(() => props.product?.min_quantity ?? 1);
    const customTitle = ref("Custom print job");
    const customBrief = ref("");
    const quantity = ref(100);
    const widthMm = ref(null);
    const heightMm = ref(null);
    const sides = ref("SIMPLEX");
    const colorMode = ref("COLOR");
    const turnaroundDays = ref(2);
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
    const loading = ref(false);
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
      return width && height ? `${width} x ${height} mm` : "";
    });
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
      if (!isProductMode.value) {
        lines.push({ label: "Turnaround", value: turnaroundDays.value ? `${turnaroundDays.value} day(s)` : "" });
      }
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
    const requirementsHelper = computed(() => isMarketplace.value ? "Complete the marketplace brief to match shops." : isProductMode.value ? "Select the required production inputs before adding this tweaked item." : "Complete the single-shop brief before sending it into the quote draft flow.");
    const primaryLabel = computed(() => isMarketplace.value ? "Refresh matches" : props.mode === "tweak-and-quote" ? "Add and continue" : props.mode === "tweak" ? "Add to Draft" : "Add to Quote Draft");
    const canSendRequest = computed(
      () => !loading.value && !missingRequirements.value.length && (isMarketplace.value && selectedShops.value.length > 0 || !isMarketplace.value && Boolean(selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id))
    );
    const sendActionLabel = computed(() => {
      if (!authStore.isAuthenticated) return "Sign in to send request";
      return isMarketplace.value ? "Send request to selected shops" : "Send request to shop";
    });
    const selectedShopIds = computed(() => {
      if (isMarketplace.value) return selectedShops.value.map((shop) => shop.id).filter(Boolean);
      return [selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id].filter((value) => typeof value === "number" && value > 0);
    });
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
          billing_basis: finishing.charge_unit === "PER_SIDE_PER_SHEET" ? "per_sheet" : "per_piece",
          side_mode: finishing.charge_unit === "PER_SIDE_PER_SHEET" ? "per_selected_side" : "default"
        }));
        if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null;
        if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
      } finally {
        loading.value = false;
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
          billing_basis: finishing.charge_unit === "PER_SIDE_PER_SHEET" ? "per_sheet" : "per_piece",
          side_mode: finishing.charge_unit === "PER_SIDE_PER_SHEET" ? "per_selected_side" : "default"
        }));
        hiddenMachineId.value = normalizeNumberValue(options?.default_machine ?? null) ?? normalizeNumberValue(options?.default_machine_id ?? null) ?? normalizeNumberValue(options?.available_machines?.[0]?.id ?? null) ?? null;
        if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null;
        if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
        widthMm.value = normalizeNumberValue(props.product?.default_finished_width_mm ?? null);
        heightMm.value = normalizeNumberValue(props.product?.default_finished_height_mm ?? null);
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
        turnaround_days: !isProductMode.value ? normalizeNumberValue(turnaroundDays.value) : void 0,
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
          width_mm: normalizeNumberValue(widthMm.value) ?? 0,
          height_mm: normalizeNumberValue(heightMm.value) ?? 0,
          paper_id: selectedPaperId.value ?? null,
          material_id: selectedMaterialId.value ?? null,
          print_sides: sides.value,
          colour_mode: colorMode.value,
          turnaround_days: normalizeNumberValue(turnaroundDays.value),
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
        toast.add({
          title: "Request sent",
          description: requests.length === 1 ? "The selected shop received your request." : `${requests.length} shops received your request.`,
          color: "success"
        });
      }
    }
    function resetForm() {
      customTitle.value = "Custom print job";
      customBrief.value = "";
      quantity.value = props.product?.min_quantity ?? 100;
      widthMm.value = normalizeNumberValue(props.product?.default_finished_width_mm ?? null);
      heightMm.value = normalizeNumberValue(props.product?.default_finished_height_mm ?? null);
      sides.value = props.product?.default_sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
      colorMode.value = "COLOR";
      turnaroundDays.value = props.product?.turnaround_days ?? 2;
      selectedPaperId.value = paperDetails.value[0]?.id ?? null;
      selectedMaterialId.value = materialDetails.value[0]?.id ?? null;
      selectedFinishings.value = [];
      marketplaceSheetSize.value = props.product?.default_sheet_size ?? "SRA3";
      marketplacePaperGsm.value = props.product?.min_gsm ?? 300;
      marketplacePaperType.value = "Art card";
      matchResponse.value = null;
      fixedShopPreview.value = null;
      selectedMatchShopSlugs.value = [];
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
    function getUnitPriceLine(preview, currency) {
      const totals = preview && typeof preview === "object" ? preview.totals : void 0;
      const unitPrice = totals?.unit_price;
      return typeof unitPrice === "string" || typeof unitPrice === "number" ? `${formatMoney(String(unitPrice), currency)} per item` : "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UInput = _sfc_main$1;
      const _component_UTextarea = _sfc_main$2;
      const _component_USelectMenu = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(CalculatorShell, { "anchor-id": __props.anchorId }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(CalculatorHeaderBlock, {
              eyebrow: __props.eyebrow,
              title: __props.title,
              description: __props.description,
              compact: __props.compact
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(CalculatorHeaderBlock, {
                eyebrow: __props.eyebrow,
                title: __props.title,
                description: __props.description,
                compact: __props.compact
              }, null, 8, ["eyebrow", "title", "description", "compact"])
            ];
          }
        }),
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
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
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
                  if (!unref(isProductMode)) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Width (mm)" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(widthMm) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "90",
                            "onUpdate:modelValue": ($event) => widthMm.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(widthMm) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              placeholder: "90",
                              "onUpdate:modelValue": ($event) => widthMm.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Height (mm)" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(heightMm) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "50",
                            "onUpdate:modelValue": ($event) => heightMm.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(heightMm) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              placeholder: "50",
                              "onUpdate:modelValue": ($event) => heightMm.value = unref(normalizeNumberValue)($event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
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
                  _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
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
                  _push3(`</div>`);
                  if (unref(isSheetMode)) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
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
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
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
                  if (unref(finishingGroups).length) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Finishing services" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(FinishingSelector, {
                            groups: unref(finishingGroups),
                            "lamination-sides": laminationSides,
                            "select-ui": unref(selectUi),
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
                              "select-ui": unref(selectUi),
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
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!unref(isProductMode)) {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Turnaround (days)" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(turnaroundDays) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "2",
                            "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(turnaroundDays) ?? void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              placeholder: "2",
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
                      class: "grid gap-4 md:grid-cols-2"
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
                    !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 4,
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
                    !unref(isProductMode) ? (openBlock(), createBlock("div", {
                      key: 5,
                      class: "grid gap-4 md:grid-cols-2"
                    }, [
                      createVNode(CalculatorFieldGroup, { label: "Width (mm)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(widthMm) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "90",
                            "onUpdate:modelValue": ($event) => widthMm.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Height (mm)" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(heightMm) ?? void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            placeholder: "50",
                            "onUpdate:modelValue": ($event) => heightMm.value = unref(normalizeNumberValue)($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])) : unref(sizeSummary) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 6,
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
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
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
                      })
                    ]),
                    unref(isSheetMode) ? (openBlock(), createBlock("div", {
                      key: 7,
                      class: "grid gap-4 md:grid-cols-2"
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
                      }, 8, ["label"])
                    ])) : createCommentVNode("", true),
                    unref(isMarketplace) && unref(isSheetMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 8,
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
                    })) : createCommentVNode("", true),
                    unref(isLargeFormatMode) && unref(materialOptions).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 9,
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
                    unref(finishingGroups).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 10,
                      label: "Finishing services"
                    }, {
                      default: withCtx(() => [
                        createVNode(FinishingSelector, {
                          groups: unref(finishingGroups),
                          "lamination-sides": laminationSides,
                          "select-ui": unref(selectUi),
                          "is-selected": isFinishingSelected,
                          "show-side-selector": isFinishingSideOpen,
                          "get-side": selectedFinishingSide,
                          onToggle: toggleFinishing,
                          onUpdateSide: updateFinishingSide
                        }, null, 8, ["groups", "select-ui"])
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                      key: 11,
                      label: "Turnaround (days)"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(turnaroundDays) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          placeholder: "2",
                          "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
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
                    class: "grid gap-4 md:grid-cols-2"
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
                  !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 4,
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
                  !unref(isProductMode) ? (openBlock(), createBlock("div", {
                    key: 5,
                    class: "grid gap-4 md:grid-cols-2"
                  }, [
                    createVNode(CalculatorFieldGroup, { label: "Width (mm)" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(widthMm) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          placeholder: "90",
                          "onUpdate:modelValue": ($event) => widthMm.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(CalculatorFieldGroup, { label: "Height (mm)" }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          "model-value": unref(heightMm) ?? void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          placeholder: "50",
                          "onUpdate:modelValue": ($event) => heightMm.value = unref(normalizeNumberValue)($event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ])) : unref(sizeSummary) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 6,
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
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
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
                    })
                  ]),
                  unref(isSheetMode) ? (openBlock(), createBlock("div", {
                    key: 7,
                    class: "grid gap-4 md:grid-cols-2"
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
                    }, 8, ["label"])
                  ])) : createCommentVNode("", true),
                  unref(isMarketplace) && unref(isSheetMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 8,
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
                  })) : createCommentVNode("", true),
                  unref(isLargeFormatMode) && unref(materialOptions).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 9,
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
                  unref(finishingGroups).length ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 10,
                    label: "Finishing services"
                  }, {
                    default: withCtx(() => [
                      createVNode(FinishingSelector, {
                        groups: unref(finishingGroups),
                        "lamination-sides": laminationSides,
                        "select-ui": unref(selectUi),
                        "is-selected": isFinishingSelected,
                        "show-side-selector": isFinishingSideOpen,
                        "get-side": selectedFinishingSide,
                        onToggle: toggleFinishing,
                        onUpdateSide: updateFinishingSide
                      }, null, 8, ["groups", "select-ui"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  !unref(isProductMode) ? (openBlock(), createBlock(CalculatorFieldGroup, {
                    key: 11,
                    label: "Turnaround (days)"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        "model-value": unref(turnaroundDays) ?? void 0,
                        ui: inputUi,
                        type: "number",
                        min: "1",
                        placeholder: "2",
                        "onUpdate:modelValue": ($event) => turnaroundDays.value = unref(normalizeNumberValue)($event)
                      }, null, 8, ["model-value", "onUpdate:modelValue"])
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
                        unref(backendMissingRequirements).length ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        }, " Missing backend requirements: " + toDisplayString(unref(backendMissingRequirements).join(", ")), 1)) : createCommentVNode("", true)
                      ]))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(isMarketplace) && unref(visibleMatches).length) {
              _push2(`<div class="rounded-lg border border-white/10 bg-white/5 p-4"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Top matching shops</p><span class="text-xs text-slate-300"${_scopeId}>Showing ${ssrInterpolate(unref(visibleMatches).length)} of ${ssrInterpolate(unref(matchResponse)?.matches_count ?? unref(visibleMatches).length)}</span></div><div class="mt-3"${_scopeId}>`);
              _push2(ssrRenderComponent(QuotesShopSelectionChips, {
                shops: unref(visibleMatches).map((shop) => ({ slug: shop.slug, label: shop.name })),
                "selected-slugs": unref(selectedMatchShopSlugs),
                onToggle: toggleMatchedShop
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="${ssrRenderClass(__props.compact ? "grid gap-2" : "grid gap-2 sm:grid-cols-3")}"${_scopeId}><button type="button" class="rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(missingRequirements).length > 0 || unref(loading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(primaryLabel))}</button><button type="button" class="rounded-md border border-flamingo-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(canSendRequest)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(sendActionLabel))}</button><button type="button" class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(unref(isMarketplace) ? "Clear" : "Reset")}</button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
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
                        unref(backendMissingRequirements).length ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        }, " Missing backend requirements: " + toDisplayString(unref(backendMissingRequirements).join(", ")), 1)) : createCommentVNode("", true)
                      ]))
                    ])
                  ]),
                  _: 1
                }),
                unref(isMarketplace) && unref(visibleMatches).length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-white/10 bg-white/5 p-4"
                }, [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("p", { class: "text-sm font-semibold text-white" }, "Top matching shops"),
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
                createVNode("div", {
                  class: __props.compact ? "grid gap-2" : "grid gap-2 sm:grid-cols-3"
                }, [
                  createVNode("button", {
                    type: "button",
                    class: "rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: unref(missingRequirements).length > 0 || unref(loading),
                    onClick: handlePrimaryAction
                  }, toDisplayString(unref(primaryLabel)), 9, ["disabled"]),
                  createVNode("button", {
                    type: "button",
                    class: "rounded-md border border-flamingo-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: !unref(canSendRequest),
                    onClick: handleSendRequest
                  }, toDisplayString(unref(sendActionLabel)), 9, ["disabled"]),
                  createVNode("button", {
                    type: "button",
                    class: "rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
                    disabled: unref(loading),
                    onClick: resetForm
                  }, toDisplayString(unref(isMarketplace) ? "Clear" : "Reset"), 9, ["disabled"])
                ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/PublicCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main, { __name: "QuotesPublicCalculator" });

export { __nuxt_component_2 as _ };
//# sourceMappingURL=PublicCalculator-7GJGXk0j.mjs.map
