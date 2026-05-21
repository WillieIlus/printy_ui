import { m as useAuthStore, p as useHead, _ as __nuxt_component_0$2, n as navigateTo } from './server.mjs';
import { defineComponent, ref, reactive, computed, watch, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, toDisplayString, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { a as fetchCalculatorPreview } from './calculator-Bvr693iI.mjs';
import { u as usePendingClientQuote } from './usePendingClientQuote-aJFgp6DQ.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HomeHeroCalculator",
  __ssrInlineRender: true,
  props: {
    embedded: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const auth = useAuthStore();
    const pendingClientQuote = usePendingClientQuote();
    useHead({
      title: "Printy - Instant Print Prices. Tracked Jobs. Trusted Production."
    });
    const loading = ref(false);
    const config = ref(null);
    const previewErrorMessage = ref("");
    const activeWorkflowStep = ref(0);
    const preview = ref({
      summary: "Set the quantity, stock, sides, and size to preview an instant KES estimate from the Django pricing backend.",
      price_mode: "estimated"
    });
    const form = ref({
      product_type: "business_card",
      quantity: 500,
      finished_size: "90x55mm",
      print_sides: "DUPLEX",
      color_mode: "COLOR",
      paper_stock: "",
      requested_gsm: 300,
      lamination: "matt-lamination",
      custom_brief: ""
    });
    ref(null);
    const artworkDragActive = ref(false);
    const selectedArtwork = ref(null);
    const uploadState = ref("idle");
    const uploadProgress = ref(0);
    const uploadEtaSeconds = ref(0);
    const artworkPreviewUrl = ref("");
    const artworkPreviewKind = ref("generic");
    const artworkLocalDetails = ref(null);
    const artworkIntent = ref("idle");
    const guestEstimateMessage = ref("");
    const quoteRequestLoading = ref(false);
    const quoteRequestError = ref("");
    const quoteRequestSuccess = ref("");
    const createdQuoteRequestId = ref(null);
    const uploadToast = reactive({
      visible: false,
      title: "",
      message: ""
    });
    const quickQuantityOptions = [100, 250, 500, 1e3, 5e3];
    const printSideOptions = [
      { value: "SIMPLEX", label: "Single sided", copy: "Best for front-only work." },
      { value: "DUPLEX", label: "Double sided", copy: "Back side stays in the live estimate." }
    ];
    const fallbackColorModeOptions = [
      { value: "COLOR", label: "Full color" },
      { value: "BW", label: "Black only" }
    ];
    const laminationOptions = [
      { value: "none", label: "None", copy: "No finish" },
      { value: "matt-lamination", label: "Matt", copy: "Popular both sides" },
      { value: "gloss-lamination", label: "Gloss", copy: "Shiny laminated face" }
    ];
    let refreshTimer = null;
    function savePendingEstimate(source = "homepage") {
      pendingClientQuote.save({
        product_type: form.value.product_type,
        quantity: Number(form.value.quantity || 0),
        finished_size: form.value.finished_size,
        paper_stock: form.value.paper_stock,
        print_sides: form.value.print_sides,
        color_mode: form.value.color_mode,
        requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
        lamination: form.value.lamination,
        custom_brief: form.value.custom_brief,
        artwork_name: selectedArtworkName.value,
        source
      });
    }
    function applyPendingEstimate() {
      const pending = pendingClientQuote.load();
      if (!pending) {
        return false;
      }
      form.value.product_type = pending.product_type || form.value.product_type;
      form.value.quantity = Math.max(1, Number(pending.quantity || form.value.quantity || 1));
      form.value.finished_size = pending.finished_size || form.value.finished_size;
      form.value.paper_stock = pending.paper_stock || form.value.paper_stock;
      form.value.print_sides = pending.print_sides || form.value.print_sides;
      form.value.color_mode = pending.color_mode || form.value.color_mode;
      form.value.requested_gsm = pending.requested_gsm ?? form.value.requested_gsm;
      form.value.lamination = pending.lamination || form.value.lamination;
      form.value.custom_brief = pending.custom_brief || form.value.custom_brief;
      return true;
    }
    async function syncEmbeddedPendingEstimate() {
      if (!props.embedded || !config.value) {
        return;
      }
      const applied = applyPendingEstimate();
      if (!applied) {
        return;
      }
      applyProductDefaults(selectedProduct.value);
      await nextTick();
      await refreshPreview();
    }
    async function continueWithEstimate(mode = "register") {
      savePendingEstimate(props.embedded ? "dashboard" : "homepage");
      if (auth.canReceiveAssignments) {
        await navigateTo(auth.homeRoute);
        return;
      }
      if (auth.isAuthenticated) {
        await navigateTo("/dashboard?pendingQuote=1");
        return;
      }
      await navigateTo(mode === "login" ? "/auth/login?next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1" : "/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1");
    }
    const productOptions = computed(() => config.value?.products || config.value?.product_types || []);
    const selectedProduct = computed(() => {
      return productOptions.value.find((item) => item.key === form.value.product_type) || productOptions.value[0] || null;
    });
    const sizeOptions = computed(() => {
      return selectedProduct.value?.size_options || selectedProduct.value?.sizes || [];
    });
    const paperStockOptions = computed(() => {
      return selectedProduct.value?.paper_stocks || selectedProduct.value?.paper_options || config.value?.paper_stocks || [];
    });
    const colorModeOptions = computed(() => selectedProduct.value?.color_mode_options || config.value?.color_modes || fallbackColorModeOptions);
    function applyPaperDefaults(paper) {
      if (!paper) {
        return;
      }
      const nextPaper = paper.key || paper.value || paper.id;
      if (nextPaper) {
        form.value.paper_stock = nextPaper;
      }
      const gsm = paper.gsm || paper.weight_gsm;
      if (gsm) {
        form.value.requested_gsm = Number(gsm) || form.value.requested_gsm;
      }
    }
    function applyProductDefaults(product) {
      if (!product) {
        return;
      }
      form.value.product_type = product.key || form.value.product_type;
      const firstSize = (product.size_options || product.sizes || [])[0];
      const nextSize = firstSize?.id || firstSize?.value;
      if (nextSize && !sizeOptions.value.some((item) => (item.id || item.value) === form.value.finished_size)) {
        form.value.finished_size = nextSize;
      }
      const firstPaper = (product.paper_stocks || product.paper_options || config.value?.paper_stocks || [])[0];
      if (firstPaper && !paperStockOptions.value.some((item) => (item.key || item.value || item.id) === form.value.paper_stock)) {
        applyPaperDefaults(firstPaper);
      }
      const firstColorMode = (product.color_mode_options || config.value?.color_modes || fallbackColorModeOptions)[0];
      if (firstColorMode?.value && !colorModeOptions.value.some((item) => item.value === form.value.color_mode)) {
        form.value.color_mode = firstColorMode.value;
      }
    }
    function isPaperSelected(stock) {
      return form.value.paper_stock === (stock.key || stock.value || stock.id);
    }
    async function refreshPreview() {
      if (!form.value.product_type || !Number(form.value.quantity || 0)) {
        return;
      }
      loading.value = true;
      previewErrorMessage.value = "";
      try {
        preview.value = await fetchCalculatorPreview({
          product_type: form.value.product_type,
          quantity: Number(form.value.quantity),
          finished_size: form.value.finished_size,
          print_sides: form.value.print_sides,
          color_mode: form.value.color_mode,
          paper_stock: form.value.paper_stock,
          requested_gsm: form.value.requested_gsm ? Number(form.value.requested_gsm) : null,
          lamination: form.value.lamination,
          custom_brief: form.value.custom_brief
        });
      } catch {
        preview.value = {
          summary: "Printy could not refresh this estimate right now.",
          price_mode: "error"
        };
        previewErrorMessage.value = "We could not refresh the live estimate. The API may be unavailable.";
      } finally {
        loading.value = false;
      }
    }
    watch(() => form.value.product_type, () => {
      applyProductDefaults(selectedProduct.value);
    });
    watch(
      () => [
        form.value.product_type,
        form.value.quantity,
        form.value.finished_size,
        form.value.print_sides,
        form.value.color_mode,
        form.value.paper_stock,
        form.value.requested_gsm,
        form.value.lamination
      ],
      () => {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }
        refreshTimer = setTimeout(() => {
          refreshPreview();
        }, 220);
      }
    );
    watch(
      () => props.embedded,
      async (embedded) => {
        if (!embedded) {
          return;
        }
        await syncEmbeddedPendingEstimate();
      },
      { immediate: false }
    );
    const productLabel = computed(() => {
      return selectedProduct.value?.label || "Business Cards";
    });
    const sizeLabel = computed(() => {
      const size = sizeOptions.value.find((item) => (item.id || item.value) === form.value.finished_size);
      return size?.label || form.value.finished_size || "Standard size";
    });
    const paperLabel = computed(() => {
      const paper = paperStockOptions.value.find((item) => (item.key || item.value || item.id) === form.value.paper_stock);
      return paper?.label || paper?.display_name || paper?.paper_name || `${form.value.requested_gsm || 300}gsm Coated`;
    });
    const printSidesLabel = computed(() => form.value.print_sides === "DUPLEX" ? "Double-sided" : "Single-sided");
    const colorModeLabel = computed(() => {
      const mode = colorModeOptions.value.find((item) => item.value === form.value.color_mode);
      return mode?.label || form.value.color_mode || "Full color";
    });
    const laminationLabel = computed(() => {
      if (form.value.lamination === "gloss-lamination") {
        return "Gloss lamination";
      }
      if (form.value.lamination === "matt-lamination") {
        return "Matt lamination - both sides";
      }
      return "No lamination";
    });
    const quantityValue = computed(() => Number(form.value.quantity) || 0);
    const quantityText = computed(() => formatNumber(quantityValue.value));
    const quantitySliderMin = computed(() => Math.min(...quickQuantityOptions));
    const quantitySliderMax = computed(() => Math.max(1e4, ...quickQuantityOptions));
    const quantitySliderStep = computed(() => quantityValue.value >= 1e3 ? 100 : 50);
    const quantitySliderProgress = computed(() => {
      const spread = quantitySliderMax.value - quantitySliderMin.value;
      if (spread <= 0) {
        return 0;
      }
      return Math.max(0, Math.min(100, (quantityValue.value - quantitySliderMin.value) / spread * 100));
    });
    const quantitySliderStyle = computed(() => ({
      background: `linear-gradient(to right, #e13515 0%, #e13515 ${quantitySliderProgress.value}%, #e4e7ec ${quantitySliderProgress.value}%, #e4e7ec 100%)`
    }));
    const impositionSource = computed(() => {
      const direct = preview.value.imposition;
      const production = preview.value.production_preview;
      return direct || production || {};
    });
    const backendPiecesPerSheet = computed(() => {
      const value = Number(
        impositionSource.value?.pieces_per_sheet ?? preview.value.pieces_per_sheet ?? preview.value?.production_preview?.pieces_per_sheet ?? 0
      );
      return Number.isFinite(value) && value > 0 ? value : 0;
    });
    const fallbackPiecesPerSheet = computed(() => {
      const label = `${productLabel.value} ${sizeLabel.value}`.toLowerCase();
      if (label.includes("business") || label.includes("90x55") || label.includes("85x55")) return 25;
      if (label.includes("a5")) return 8;
      if (label.includes("a4") || label.includes("flyer")) return 4;
      return 0;
    });
    const effectivePiecesPerSheet = computed(() => backendPiecesPerSheet.value || fallbackPiecesPerSheet.value);
    const parentSheet = computed(() => String(impositionSource.value?.parent_sheet ?? preview.value.parent_sheet ?? "SRA3"));
    const backendSheetsRequired = computed(() => {
      const value = Number(
        impositionSource.value?.sheets_needed ?? impositionSource.value?.sheets_required ?? preview.value.sheets_needed ?? preview.value.sheets_required ?? preview.value?.production_preview?.sheets_required ?? 0
      );
      return Number.isFinite(value) && value > 0 ? value : 0;
    });
    const fallbackSheetsRequired = computed(() => effectivePiecesPerSheet.value > 0 ? Math.ceil(quantityValue.value / effectivePiecesPerSheet.value) : 0);
    const effectiveSheetsRequired = computed(() => backendSheetsRequired.value || fallbackSheetsRequired.value);
    const hasImpositionPreview = computed(() => effectivePiecesPerSheet.value > 0 && effectiveSheetsRequired.value > 0);
    const piecesPerSheetText = computed(() => hasImpositionPreview.value ? formatNumber(effectivePiecesPerSheet.value) : "");
    const sheetsRequiredText = computed(() => hasImpositionPreview.value ? formatNumber(effectiveSheetsRequired.value) : "");
    const impositionPrimaryLabel = computed(() => hasImpositionPreview.value ? `pieces per
${parentSheet.value} sheet` : "imposition\npreview");
    const impositionSecondaryLabel = computed(() => hasImpositionPreview.value ? `${parentSheet.value} sheets
needed` : "syncing\nquantity");
    const impositionFormulaText = computed(() => {
      if (!hasImpositionPreview.value) {
        return "";
      }
      return `${quantityText.value} pieces ÷ ${piecesPerSheetText.value} per sheet = ${sheetsRequiredText.value} ${parentSheet.value} sheets`;
    });
    const minPriceValue = computed(() => parseMoneyValue(preview.value.min_price ?? preview.value.total ?? 1800));
    const maxPriceValue = computed(() => parseMoneyValue(preview.value.max_price ?? preview.value.total ?? 2400));
    const minPriceText = computed(() => formatKes(minPriceValue.value));
    const maxPriceText = computed(() => formatKes(maxPriceValue.value));
    const rangeMeterWidth = computed(() => {
      if (preview.value.price_mode === "error") {
        return 12;
      }
      const min = minPriceValue.value;
      const max = maxPriceValue.value;
      if (!min || !max || max <= min) {
        return 62;
      }
      const spread = max - min;
      const base = Math.round(spread / max * 100);
      return Math.max(24, Math.min(88, base + 38));
    });
    const heroEstimateTitle = computed(() => `${productLabel.value} - Nairobi`);
    const heroEstimateStatus = computed(() => loading.value ? "Refreshing" : preview.value.price_mode === "error" ? "Preview Unavailable" : "Market Verified");
    const heroEstimateStatusDotClass = computed(() => loading.value ? "bg-[#e13515]" : preview.value.price_mode === "error" ? "bg-[#f79009]" : "bg-[#12b76a]");
    const heroEstimateStatusTextClass = computed(() => loading.value ? "text-[#e13515]" : preview.value.price_mode === "error" ? "text-[#b54708]" : "text-[#12b76a]");
    const estimateNote = computed(() => preview.value.summary || "Range reflects verified Nairobi market rates for this spec");
    const selectedArtworkName = computed(() => selectedArtwork.value?.name || "");
    const selectedArtworkSizeText = computed(() => selectedArtwork.value ? formatFileSize(selectedArtwork.value.size) : "");
    const selectedArtworkMeta = computed(() => {
      if (!selectedArtwork.value) {
        return "Choose a file to carry into the quote workflow";
      }
      return `${selectedArtwork.value.type || "Artwork file"} · ${selectedArtworkSizeText.value}`;
    });
    const selectedArtworkLastModifiedText = computed(() => selectedArtwork.value?.lastModified ? formatCompactDate(selectedArtwork.value.lastModified) : "");
    const uploadEtaText = computed(() => uploadProgress.value >= 100 ? "Artwork ready" : `About ${Math.max(1, uploadEtaSeconds.value)}s left`);
    const artworkDropzoneClass = computed(() => artworkDragActive.value ? "border-[#e13515] bg-[#fff1ee]" : "border-[#e13515]/40 bg-[#fff8f7]");
    const artworkTypeLabel = computed(() => selectedArtwork.value?.type || "Awaiting review");
    const artworkTypeBadge = computed(() => {
      if (!selectedArtwork.value) return "FILE";
      if (artworkPreviewKind.value === "pdf") return "PDF";
      if (artworkPreviewKind.value === "image") return "IMG";
      return (selectedArtwork.value.name.split(".").pop() || "FILE").toUpperCase();
    });
    const artworkStatusBadge = computed(() => {
      if (artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === "manual") return "Manual review needed";
      if (artworkLocalDetails.value?.suggestedProduct) return "Detected locally";
      return "Awaiting review";
    });
    const artworkStatusBadgeClass = computed(() => artworkIntent.value === "manual" ? "bg-amber-100 text-amber-800" : artworkLocalDetails.value?.suggestedProduct ? "bg-[#ecfdf3] text-[#027a48]" : "bg-white/10 text-slate-200");
    const artworkPrimaryMessage = computed(() => artworkPreviewKind.value === "pdf" ? "Your PDF is attached. We’ll use it with your quote request." : "Your file is attached. We’ll use it with your quote request.");
    const artworkDetailsSummary = computed(() => {
      const details = artworkLocalDetails.value;
      if (!details) return "";
      const parts = [];
      if (details.pageCount) parts.push(`${details.pageCount} page${details.pageCount === 1 ? "" : "s"}`);
      if (details.label) parts.push(details.label);
      if (details.widthMm && details.heightMm) parts.push(`${formatMillimeters(details.widthMm)} × ${formatMillimeters(details.heightMm)} mm`);
      if (details.orientation) parts.push(details.orientation);
      return parts.join(" · ");
    });
    const artworkSecondaryMessage = computed(() => artworkLocalDetails.value?.note || "We’ll attach this with your quote request.");
    const artworkSecondaryTone = computed(() => artworkIntent.value === "manual" ? "text-amber-300" : "text-slate-400");
    const showArtworkReviewAlert = computed(() => uploadState.value === "completed");
    const artworkReviewVariant = computed(() => artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === "manual" ? "warning" : artworkLocalDetails.value?.suggestedProduct ? "success" : "default");
    const artworkReviewTitle = computed(() => {
      if (artworkLocalDetails.value?.hasMixedPageSizes || artworkIntent.value === "manual") return "Manual review needed";
      if (artworkLocalDetails.value?.suggestedProduct) return "We found local PDF details";
      return "Artwork uploaded";
    });
    const artworkReviewMessage = computed(() => {
      if (artworkLocalDetails.value?.hasMixedPageSizes) {
        return "File uploaded. We found PDF details, but mixed page sizes need your confirmation before pricing.";
      }
      if (artworkIntent.value === "manual") {
        return "File uploaded. We found local details, but manual confirmation may still be needed before pricing.";
      }
      if (artworkLocalDetails.value?.suggestedProduct) {
        return `${artworkLocalDetails.value.suggestedProduct.explanation} Confirm before pricing if anything looks off.`;
      }
      return "Your file is attached locally. Real parsing still happens later in the authenticated upload flow.";
    });
    const showDetectedSuggestion = computed(() => uploadState.value === "completed" && Boolean(artworkLocalDetails.value?.suggestedProduct));
    const detectedSuggestionTitle = computed(() => artworkLocalDetails.value?.suggestedProduct?.title || "");
    const detectedSuggestionDetails = computed(() => {
      const suggestion = artworkLocalDetails.value?.suggestedProduct;
      if (!suggestion) return "";
      return `${suggestion.detail}. ${suggestion.explanation}`;
    });
    const artworkIntentMessage = computed(() => {
      if (!selectedArtwork.value) {
        return "Homepage upload is UI-only for now. Real spec detection happens after authenticated upload.";
      }
      if (artworkIntent.value === "detected") {
        return "We will keep this file choice and let the dashboard upload flow confirm page count, dimensions, and imposition before applying detected specs.";
      }
      if (artworkIntent.value === "manual") {
        return "Manual spec editing stays active. You can still upload this file later after sign-up or sign-in.";
      }
      return "File selected. Detection remains safe and deferred until the real upload flow.";
    });
    const artworkIntentMessageTone = computed(() => selectedArtwork.value && artworkIntent.value === "detected" ? "text-[#027a48]" : "text-[#98a2b3]");
    const guestEstimateMessageClass = computed(() => guestEstimateMessage.value.includes("sign in later") ? "text-[#027a48]" : "text-[#98a2b3]");
    const specCards = computed(() => [
      { label: "Product", value: productLabel.value, span: "col-span-2 border-b border-white/[0.06] pb-2" },
      { label: "Quantity", value: `${quantityText.value} pieces`, span: "" },
      { label: "Paper", value: paperLabel.value, span: "" },
      { label: "Size", value: sizeLabel.value, span: "" },
      { label: "Print", value: `${colorModeLabel.value}, ${printSidesLabel.value}`, span: "" },
      { label: "Finish", value: laminationLabel.value, span: "col-span-2 border-t border-white/[0.06] pt-2 mt-1" }
    ]);
    const marketSummaryLabel = computed(() => `${productLabel.value} - ${quantityText.value} qty, ${paperLabel.value}`);
    const hasMinimumQuoteInputs = computed(() => {
      return Boolean(
        String(form.value.product_type || "").trim() && Number(form.value.quantity || 0) > 0 && (String(form.value.paper_stock || "").trim() || Number(form.value.requested_gsm || 0) > 0)
      );
    });
    const activeWorkflow = computed(() => workflowSteps[activeWorkflowStep.value] || workflowSteps[0] || {
      title: "Estimate",
      detail: "Choose your specs to generate a live estimate.",
      cta: "signup"
    });
    const workflowSteps = [
      {
        number: 1,
        title: "Enter your specs",
        copy: "Select product type, quantity, material, print sides, and finishing. No guesswork required.",
        detail: "Use the live controls above to change quantity, size, stock, sides, and finish. Printy sends those exact inputs to the backend preview endpoint so the estimate is grounded in real pricing logic.",
        cta: "signup",
        iconWrapClass: "bg-[#e13515]",
        badgeClass: "bg-[#e13515]",
        icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12h6M9 16h4"/></svg>'
      },
      {
        number: 2,
        title: "Get a trusted quote",
        copy: "Receive a market-calibrated price range backed by real imposition logic and verified shop rates.",
        detail: "The estimate card shows live KES range data, sheet counts, and backend summary text so buyers can judge cost before handing over artwork or chasing anyone on WhatsApp.",
        cta: "account creation",
        iconWrapClass: "bg-[#101828]",
        badgeClass: "bg-[#101828]",
        icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
      },
      {
        number: 3,
        title: "Upload artwork",
        copy: "Submit your print-ready files directly in-platform. We check dimensions, bleed, and resolution.",
        detail: "Once the estimate looks right, the next step is account creation and artwork upload. That moves the job from public market pricing into the tracked quote and proof workflow.",
        cta: "artwork upload",
        iconWrapClass: "bg-[#101828]",
        badgeClass: "bg-[#101828]",
        icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
      },
      {
        number: 4,
        title: "Track the job",
        copy: "Monitor every stage - prepress, printing, finishing, and delivery - in real time from your dashboard.",
        detail: "After quote approval, Printy keeps the job state visible through dashboards and public tracking tokens. Buyers see progress without exposing internal shop economics.",
        cta: "tracked workflow",
        iconWrapClass: "bg-[#101828]",
        badgeClass: "bg-[#101828]",
        icon: '<svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
      }
    ];
    const audiences = [
      {
        title: "Clients",
        copy: "Business owners and individuals who need print work done without being misquoted, overcharged, or kept in the dark.",
        barClass: "bg-[#e13515]",
        iconShellClass: "bg-[#fef3f2]",
        checkShellClass: "bg-[#fef3f2]",
        checkIconClass: "text-[#e13515]",
        icon: '<svg class="w-6 h-6 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
        points: [
          "Instant price estimates before committing",
          "Real-time job status - no chasing suppliers",
          "Payment and support handled through Printy",
          "No exposure to shop rates or margins"
        ]
      },
      {
        title: "Teams Managing Print",
        copy: "Designers, office teams, and operations staff who need a cleaner system than scattered WhatsApp threads and spreadsheet follow-ups.",
        barClass: "bg-[#101828]",
        iconShellClass: "bg-[#f2f4f7]",
        checkShellClass: "bg-[#f2f4f7]",
        checkIconClass: "text-[#101828]",
        icon: '<svg class="w-6 h-6 text-[#101828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        points: [
          "Quote requests stay structured from the first brief",
          "Uploads, responses, and job status stay connected",
          "Token tracking works without exposing account-only data",
          "Shared job state reduces follow-up chaos"
        ]
      },
      {
        title: "Print Shops",
        copy: "Production facilities that want well-specified jobs with clearer pricing assumptions, artwork state, and job tracking.",
        barClass: "bg-[#344054]",
        iconShellClass: "bg-[#f2f4f7]",
        checkShellClass: "bg-[#f2f4f7]",
        checkIconClass: "text-[#344054]",
        icon: '<svg class="w-6 h-6 text-[#344054]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
        points: [
          "Jobs arrive prepped - specs, artwork, approval",
          "Public estimates avoid exposing raw internal rate cards",
          "Payment and status stay visible through the real workflow",
          "Production teams get a clearer intake surface"
        ]
      }
    ];
    const trustReasons = [
      {
        title: "Price breakdown logic",
        copy: "Every quote preview is based on real imposition calculations, sheet counts, stock assumptions, and finishing inputs - not guesswork.",
        icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'
      },
      {
        title: "Workflow discipline",
        copy: "Printy keeps estimate, upload, quote response, payment state, and tracking connected so trust does not depend on fragmented chat updates.",
        icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
      },
      {
        title: "In-platform job tracking",
        copy: "See exactly where your job is at every stage - prepress, printing, finishing, and dispatch. No more chasing calls or vague updates.",
        icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
      },
      {
        title: "Payment & support through Printy",
        copy: "Public tracking, account dashboards, and payment state are separated cleanly so each user sees only what they should.",
        icon: '<svg class="w-5 h-5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
      }
    ];
    const trackerStages = [
      {
        title: "Order\nConfirmed",
        shellClass: "bg-[#e13515]",
        labelClass: "font-medium text-[#101828] whitespace-pre-line",
        icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>'
      },
      {
        title: "Artwork\nApproved",
        shellClass: "bg-[#e13515]",
        labelClass: "font-medium text-[#101828] whitespace-pre-line",
        icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>'
      },
      {
        title: "Printing\n(Active)",
        shellClass: "bg-[#e13515] ring-4 ring-[#fde8e2]",
        labelClass: "font-bold text-[#e13515] whitespace-pre-line",
        icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>'
      },
      {
        title: "Finishing",
        shellClass: "bg-[#e4e7ec]",
        labelClass: "text-[#98a2b3]",
        icon: '<svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
      },
      {
        title: "Delivery",
        shellClass: "bg-[#e4e7ec]",
        labelClass: "text-[#98a2b3]",
        icon: '<svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
      }
    ];
    const marketTrustPoints = [
      {
        title: "Clients see market ranges",
        copy: "Price bands reflect backend-driven market guidance - enough to make a confident decision, not enough to expose any single internal rate card.",
        iconShellClass: "bg-[#e13515]",
        icon: '<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>'
      },
      {
        title: "Shop names stay anonymous",
        copy: "Public visitors do not see private production relationships. Sensitive fulfillment details stay behind the correct account boundary.",
        iconShellClass: "bg-[#1d2939] border border-[#344054]",
        icon: '<svg class="w-4 h-4 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>'
      },
      {
        title: "Internal settlement stays internal",
        copy: "Sensitive payout and settlement details stay visible only to the relevant account holders - never to the public tracking surface.",
        iconShellClass: "bg-[#1d2939] border border-[#344054]",
        icon: '<svg class="w-4 h-4 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>'
      }
    ];
    const comparisonPanels = [
      {
        title: "A print directory",
        panelClass: "bg-white",
        labelClass: "text-[#98a2b3]",
        textClass: "text-[#667085]",
        badge: "",
        items: [
          { text: "Lists shops, provides no pricing", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "Client negotiates directly with shop", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No job tracking capability", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No structured artwork submission", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No payment protection or dispute handling", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" }
        ]
      },
      {
        title: "A quote tool",
        panelClass: "bg-white border-x border-[#e4e7ec]",
        labelClass: "text-[#98a2b3]",
        textClass: "text-[#667085]",
        badge: "",
        items: [
          { text: "Provides price estimates", iconClass: "text-[#12b76a]", path: "M5 13l4 4L19 7" },
          { text: "No production shop verification", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No job tracking capability", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No end-to-end job management", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" },
          { text: "No payment or support layer", iconClass: "text-[#d0d5dd]", path: "M6 18L18 6M6 6l12 12" }
        ]
      },
      {
        title: "A print operating system",
        panelClass: "bg-[#101828]",
        labelClass: "text-[#667085]",
        textClass: "text-white",
        badge: "Printy",
        items: [
          { text: "Market-calibrated pricing with logic", iconClass: "text-[#e13515]", path: "M5 13l4 4L19 7" },
          { text: "Fully verified production shops", iconClass: "text-[#e13515]", path: "M5 13l4 4L19 7" },
          { text: "Real-time job tracking dashboard", iconClass: "text-[#e13515]", path: "M5 13l4 4L19 7" },
          { text: "Structured artwork upload & checks", iconClass: "text-[#e13515]", path: "M5 13l4 4L19 7" },
          { text: "In-platform payments & support", iconClass: "text-[#e13515]", path: "M5 13l4 4L19 7" }
        ]
      }
    ];
    function formatNumber(value) {
      return new Intl.NumberFormat("en-KE").format(value);
    }
    function formatKes(value) {
      if (!Number.isFinite(value) || value <= 0) {
        return "KES -";
      }
      return `KES ${formatNumber(Math.round(value))}`;
    }
    function parseMoneyValue(value) {
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        const normalized = value.replace(/[^0-9.]/g, "");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      return 0;
    }
    function productBadge(label) {
      return label.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    }
    function productSupportCopy(product) {
      const sizes = product.size_options || product.sizes || [];
      if (sizes.length > 0) {
        return `${sizes.length} configured size${sizes.length === 1 ? "" : "s"}`;
      }
      return "Live backend product";
    }
    function stockWeightLabel(stock) {
      const gsm = stock.gsm || stock.weight_gsm;
      return gsm ? `${gsm}gsm` : "Configured stock";
    }
    function stockTierLabel(stock) {
      const gsm = Number(stock.gsm || stock.weight_gsm || 0);
      if (gsm >= 400) return "Luxury";
      if (gsm >= 340) return "Premium";
      if (gsm >= 280) return "Standard";
      return "Budget";
    }
    function sizeSupportCopy(size) {
      const raw = String(size.id || size.value || "").toLowerCase();
      if (raw.includes("90x55")) return "Standard card";
      if (raw.includes("85x55")) return "Euro card";
      if (raw.includes("square")) return "Square format";
      return "Configured size";
    }
    function colorModeCopy(option) {
      const value = String(option.value || "").toUpperCase();
      if (value.includes("BW") || value.includes("BLACK")) return "Lower ink coverage";
      if (value.includes("COVER_COLOR")) return "Mixed inside pages";
      return "Front-end estimate stays live";
    }
    function formatFileSize(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 B";
      }
      if (bytes < 1024) {
        return `${bytes} B`;
      }
      if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
      }
      if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
      }
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    function formatCompactDate(value) {
      return new Intl.DateTimeFormat("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(new Date(value));
    }
    function formatMillimeters(value) {
      return Number(value).toFixed(1);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(uploadToast).visible) {
        _push(`<div class="fixed left-1/2 top-5 z-50 w-[min(92vw,28rem)] -translate-x-1/2">`);
        _push(ssrRenderComponent(BaseAlert, {
          variant: "success",
          title: unref(uploadToast).title,
          message: unref(uploadToast).message,
          class: "shadow-2xl"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="relative overflow-hidden bg-[#101828]"><div class="absolute inset-0 opacity-[0.04]" style="${ssrRenderStyle({ "background-image": "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", "background-size": "40px 40px" })}"></div><div class="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#e13515] opacity-[0.08] blur-3xl pointer-events-none"></div><div class="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#e13515] opacity-[0.05] blur-3xl pointer-events-none"></div><div class="${ssrRenderClass([props.embedded ? "py-8" : "py-24", "relative mx-auto max-w-7xl px-6"])}"><div class="${ssrRenderClass([props.embedded ? "gap-0" : "gap-16 lg:grid-cols-2", "grid items-center"])}">`);
      if (!props.embedded) {
        _push(`<div><div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-1.5 mb-8 backdrop-blur-sm"><span class="w-2 h-2 rounded-full bg-[#e13515] animate-pulse"></span><span class="text-xs font-semibold tracking-widest uppercase text-slate-200">Kenya&#39;s Print Operating System</span></div><h1 class="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"><span class="inline-block rounded-2xl border border-white/15 bg-[#101828]/80 px-3 py-1 text-white backdrop-blur-sm">Instant print prices.</span><br><span class="inline-block rounded-2xl border border-[#fda497]/30 bg-[#2a0f0a]/70 px-3 py-1 text-[#fff1ee] backdrop-blur-sm">Tracked jobs.</span><br><span class="inline-block rounded-2xl border border-white/15 bg-[#101828]/80 px-3 py-1 text-slate-100 backdrop-blur-sm">Trusted production.</span></h1><p class="text-lg text-slate-200 leading-relaxed mb-10 max-w-lg"> Printy helps buyers price print jobs accurately, upload artwork, request quotes, and track production with backend-driven KES pricing. </p><div class="flex flex-wrap gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1",
          class: "inline-flex items-center gap-2 bg-[#e13515] hover:bg-[#b82c10] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg transition-colors",
          onClick: ($event) => continueWithEstimate("register")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` See your estimate, then upload artwork <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"${_scopeId}><path d="M5 12h14M12 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" See your estimate, then upload artwork "),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2.5"
                }, [
                  createVNode("path", { d: "M5 12h14M12 5l7 7-7 7" })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<a href="#market" class="inline-flex items-center gap-2 border border-[#475467] text-[#d0d5dd] hover:text-white hover:border-[#667085] font-semibold text-base px-7 py-3.5 rounded-xl transition-colors"> See how pricing works </a></div><div class="mt-12 flex flex-wrap items-center gap-6"><div class="flex items-center gap-2"><svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg><span class="text-sm text-slate-300">Backend-driven KES pricing</span></div><div class="w-px h-4 bg-[#344054]"></div><div class="flex items-center gap-2"><svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="text-sm text-slate-300">Artwork, quote, and tracking flow</span></div><div class="w-px h-4 bg-[#344054]"></div><div class="flex items-center gap-2"><svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg><span class="text-sm text-slate-300">Imposition and sheet math</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div id="live-estimate" class="relative">`);
      if (!props.embedded) {
        _push(`<div class="absolute -top-4 -right-4 z-10 bg-[#e13515] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider"> Live Estimate </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e4e7ec]"><div class="bg-[#f9fafb] border-b border-[#e4e7ec] px-6 py-4 flex items-center justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-widest text-[#667085] mb-0.5">Estimate Preview</p><p class="text-base font-bold text-[#101828]">${ssrInterpolate(unref(heroEstimateTitle))}</p></div><div class="flex items-center gap-1.5"><span class="${ssrRenderClass([unref(heroEstimateStatusDotClass), "w-2.5 h-2.5 rounded-full"])}"></span><span class="${ssrRenderClass([unref(heroEstimateStatusTextClass), "text-xs font-medium"])}">${ssrInterpolate(unref(heroEstimateStatus))}</span></div></div><div class="px-6 py-5 space-y-5 text-[#101828]"><input type="file" accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.webp" class="hidden"><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-3">Product type</p><div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(productOptions), (product) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(form).product_type === product.key ? "border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]", "relative flex min-h-[88px] flex-col justify-between rounded-2xl border-2 px-3 py-3 text-left transition-all"])}">`);
        if (unref(form).product_type === product.key) {
          _push(`<span class="absolute right-2.5 top-2 text-[10px] font-black text-[#e13515]">★</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([unref(form).product_type === product.key ? "border-[#fde8e2] bg-[#fef3f2] text-[#e13515]" : "border-[#e4e7ec] bg-white text-[#667085]", "inline-flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-black"])}">${ssrInterpolate(productBadge(product.label))}</span><div><p class="${ssrRenderClass([unref(form).product_type === product.key ? "text-[#e13515]" : "text-[#344054]", "text-[11.5px] font-bold leading-tight"])}">${ssrInterpolate(product.label)}</p><p class="mt-1 text-[10px] text-[#98a2b3]">${ssrInterpolate(productSupportCopy(product))}</p></div></button>`);
      });
      _push(`<!--]--></div></div><div class="rounded-3xl border border-[#e4e7ec] bg-[#f9fafb] px-5 py-4"><div class="flex items-center justify-between gap-4"><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085]">Quantity</p><div class="flex items-baseline gap-1.5"><span class="text-[22px] font-extrabold text-[#101828]">${ssrInterpolate(unref(quantityText))}</span><span class="text-[12px] font-semibold text-[#667085]">pieces</span></div></div><div class="mt-4"><input${ssrRenderAttr("value", unref(quantityValue))} type="range"${ssrRenderAttr("min", unref(quantitySliderMin))}${ssrRenderAttr("max", unref(quantitySliderMax))}${ssrRenderAttr("step", unref(quantitySliderStep))} class="h-2 w-full cursor-pointer appearance-none rounded-full" style="${ssrRenderStyle(unref(quantitySliderStyle))}"><div class="mt-2 flex items-center justify-between text-[10.5px] text-[#98a2b3]"><span>${ssrInterpolate(formatNumber(unref(quantitySliderMin)))}</span><span>Drag to estimate common quantities</span><span>${ssrInterpolate(formatNumber(unref(quantitySliderMax)))}</span></div></div><div class="mt-4 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(quickQuantityOptions, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(quantityValue) === option ? "border-[#e13515] bg-[#e13515] text-white" : "border-[#e4e7ec] bg-white text-[#344054] hover:border-[#fda497] hover:text-[#e13515]", "rounded-xl border px-3 py-1.5 text-[11.5px] font-semibold transition-colors"])}">${ssrInterpolate(formatNumber(option))}</button>`);
      });
      _push(`<!--]--></div></div><div class="grid gap-4 md:grid-cols-2"><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Paper quality</p><div class="space-y-2"><!--[-->`);
      ssrRenderList(unref(paperStockOptions), (stock) => {
        _push(`<button type="button" class="${ssrRenderClass([isPaperSelected(stock) ? "border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]", "relative flex w-full items-center justify-between rounded-2xl border-2 px-3.5 py-3 text-left transition-all"])}">`);
        if (isPaperSelected(stock)) {
          _push(`<span class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><p class="${ssrRenderClass([isPaperSelected(stock) ? "text-[#e13515]" : "text-[#344054]", "text-[11.5px] font-bold"])}">${ssrInterpolate(stockTierLabel(stock))}</p><p class="${ssrRenderClass([isPaperSelected(stock) ? "text-[#667085]" : "text-[#98a2b3]", "text-[10px]"])}">${ssrInterpolate(stock.label || stock.display_name)}</p></div>`);
        if (isPaperSelected(stock)) {
          _push(`<span class="rounded-full bg-[#e13515] px-1.5 py-0.5 text-[9px] font-bold text-white">Selected</span>`);
        } else {
          _push(`<span class="text-[10px] font-semibold text-[#98a2b3]">${ssrInterpolate(stockWeightLabel(stock))}</span>`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Finished size</p><div class="grid grid-cols-2 gap-2"><!--[-->`);
      ssrRenderList(unref(sizeOptions), (size) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(form).finished_size === (size.id || size.value) ? "border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]", "relative rounded-2xl border-2 px-3 py-3 text-left transition-all"])}">`);
        if (unref(form).finished_size === (size.id || size.value)) {
          _push(`<span class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="${ssrRenderClass([unref(form).finished_size === (size.id || size.value) ? "text-[#e13515]" : "text-[#344054]", "text-[11.5px] font-bold"])}">${ssrInterpolate(size.label)}</p><p class="mt-1 text-[10px] text-[#98a2b3]">${ssrInterpolate(sizeSupportCopy(size))}</p></button>`);
      });
      _push(`<!--]--></div></div></div><div class="grid gap-4 md:grid-cols-2"><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Print sides</p><div class="grid grid-cols-2 gap-2"><!--[-->`);
      ssrRenderList(printSideOptions, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(form).print_sides === option.value ? "border-[#e13515] bg-[#fff8f7] text-[#e13515] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#fda497] hover:bg-[#fff8f7]", "rounded-2xl border-2 px-3 py-3 text-left transition-all"])}"><p class="text-[11.5px] font-bold">${ssrInterpolate(option.label)}</p><p class="${ssrRenderClass([unref(form).print_sides === option.value ? "text-[#667085]" : "text-[#98a2b3]", "mt-1 text-[10px]"])}">${ssrInterpolate(option.copy)}</p></button>`);
      });
      _push(`<!--]--></div></div><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Print / colour mode</p><div class="${ssrRenderClass([unref(colorModeOptions).length > 2 ? "grid-cols-1" : "grid-cols-2", "grid gap-2"])}"><!--[-->`);
      ssrRenderList(unref(colorModeOptions), (option) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(form).color_mode === option.value ? "border-[#e13515] bg-[#fff8f7] text-[#e13515] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] text-[#344054] hover:border-[#fda497] hover:bg-[#fff8f7]", "rounded-2xl border-2 px-3 py-3 text-left transition-all"])}"><p class="text-[11.5px] font-bold">${ssrInterpolate(option.label)}</p><p class="${ssrRenderClass([unref(form).color_mode === option.value ? "text-[#667085]" : "text-[#98a2b3]", "mt-1 text-[10px]"])}">${ssrInterpolate(colorModeCopy(option))}</p></button>`);
      });
      _push(`<!--]--></div></div></div><div><p class="text-[11px] font-bold uppercase tracking-[0.13em] text-[#667085] mb-2.5">Lamination / finishing</p><div class="grid grid-cols-2 gap-2 sm:grid-cols-4"><!--[-->`);
      ssrRenderList(laminationOptions, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(form).lamination === option.value ? "border-[#e13515] bg-[#fff8f7] shadow-[0_0_0_2px_rgba(225,53,21,0.12)]" : "border-[#e4e7ec] bg-[#f9fafb] hover:border-[#fda497] hover:bg-[#fff8f7]", "relative rounded-2xl border-2 px-3 py-3 text-center transition-all"])}">`);
        if (unref(form).lamination === option.value) {
          _push(`<span class="absolute right-2 top-1.5 text-[9px] font-black text-[#e13515]">★</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="${ssrRenderClass([unref(form).lamination === option.value ? "text-[#e13515]" : "text-[#344054]", "text-[11.5px] font-bold"])}">${ssrInterpolate(option.label)}</p><p class="${ssrRenderClass([unref(form).lamination === option.value ? "text-[#667085]" : "text-[#98a2b3]", "mt-1 text-[9.5px]"])}">${ssrInterpolate(option.copy)}</p></button>`);
      });
      _push(`<!--]--></div><div class="mt-2 flex flex-wrap items-center gap-2"><span class="inline-flex items-center gap-1 rounded-full border border-[#fde8e2] bg-[#fef3f2] px-2.5 py-1"><svg class="h-2.5 w-2.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"></path></svg><span class="text-[10.5px] font-bold text-[#e13515]">${ssrInterpolate(unref(printSidesLabel))}</span></span><span class="text-[10.5px] text-[#98a2b3]">Sheet finishing follows the selected sides where backend pricing supports it.</span></div></div><div class="${ssrRenderClass([unref(artworkDropzoneClass), "rounded-3xl border-2 border-dashed overflow-hidden transition-colors"])}"><button type="button" class="w-full px-5 py-5 text-center transition-colors"><div class="${ssrRenderClass([unref(artworkDragActive) ? "scale-105" : "", "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#fde8e2] bg-[#fef3f2] shadow-sm"])}"><svg class="h-6 w-6 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div><p class="text-[14px] font-extrabold text-[#101828]">Upload artwork</p><p class="mt-1 text-[12.5px] text-[#667085]">Drop your file here and we&#39;ll figure out the specs.</p><p class="mt-1 text-[11px] text-[#98a2b3]">PDF, AI, PSD, PNG, JPG · We can detect page count, size, orientation and print assumptions.</p></button><div class="border-t border-[#fde8e2] bg-white px-5 py-4">`);
      if (unref(uploadState) === "idle") {
        _push(`<div class="rounded-2xl border border-[#f2f4f7] bg-[#f9fafb] px-4 py-3"><p class="text-[11.5px] font-semibold text-[#344054]">No artwork selected yet</p><p class="mt-1 text-[10.5px] text-[#98a2b3]">We keep homepage upload safe and local. Real parsing starts after the authenticated upload flow.</p></div>`);
      } else if (unref(uploadState) === "uploading") {
        _push(`<div class="rounded-2xl border border-[#f2f4f7] bg-[#101828] p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-[13px] font-extrabold text-white">Preparing artwork preview...</p><p class="mt-1 text-[11px] text-slate-300">${ssrInterpolate(unref(selectedArtworkName))}</p><p class="mt-0.5 text-[10.5px] text-slate-400">${ssrInterpolate(unref(selectedArtworkMeta))}</p></div><span class="text-[12px] font-bold text-[#f97316]">${ssrInterpolate(unref(uploadProgress))}%</span></div><div class="mt-4 h-2 w-full rounded-full bg-white/10"><div class="h-2 rounded-full bg-gradient-to-r from-[#e13515] to-[#f97316] transition-all duration-300" style="${ssrRenderStyle({ width: `${unref(uploadProgress)}%` })}"></div></div><div class="mt-2 flex items-center justify-between"><p class="text-[10.5px] text-slate-400">${ssrInterpolate(unref(uploadEtaText))}</p><p class="text-[10.5px] text-slate-400">Local preview only</p></div></div>`);
      } else {
        _push(`<div class="space-y-3"><div class="rounded-2xl border border-[#e4e7ec] bg-[#101828] p-4"><div class="flex items-start gap-3"><div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">`);
        if (unref(artworkPreviewKind) === "image" && unref(artworkPreviewUrl)) {
          _push(`<img${ssrRenderAttr("src", unref(artworkPreviewUrl))} alt="Artwork preview" class="h-full w-full object-cover">`);
        } else if (unref(artworkPreviewKind) === "pdf" && unref(artworkPreviewUrl)) {
          _push(`<iframe${ssrRenderAttr("src", unref(artworkPreviewUrl))} title="PDF first page preview" class="h-full w-full border-0 bg-white"></iframe>`);
        } else if (unref(artworkPreviewKind) === "pdf") {
          _push(`<div class="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#1d2939] text-white"><span class="rounded-full bg-[#e13515] px-2 py-0.5 text-[10px] font-black tracking-wide">PDF</span><svg class="h-6 w-6 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>`);
        } else {
          _push(`<div class="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#1d2939] text-white"><span class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-wide">${ssrInterpolate(unref(artworkTypeBadge))}</span><svg class="h-6 w-6 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></div>`);
        }
        _push(`</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><p class="truncate text-[13px] font-bold text-white">${ssrInterpolate(unref(selectedArtworkName))}</p><span class="${ssrRenderClass([unref(artworkStatusBadgeClass), "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"])}">${ssrInterpolate(unref(artworkStatusBadge))}</span></div><p class="mt-1 text-[11px] text-slate-300">${ssrInterpolate(unref(artworkPrimaryMessage))}</p><div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-400"><span>${ssrInterpolate(unref(selectedArtworkSizeText))}</span><span>${ssrInterpolate(unref(artworkTypeLabel))}</span>`);
        if (unref(artworkDetailsSummary)) {
          _push(`<span>${ssrInterpolate(unref(artworkDetailsSummary))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(selectedArtworkLastModifiedText)) {
          _push(`<span>${ssrInterpolate(unref(selectedArtworkLastModifiedText))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="${ssrRenderClass([unref(artworkSecondaryTone), "mt-2 text-[10.5px]"])}">${ssrInterpolate(unref(artworkSecondaryMessage))}</p></div></div></div>`);
        if (unref(showArtworkReviewAlert)) {
          _push(ssrRenderComponent(BaseAlert, {
            variant: unref(artworkReviewVariant),
            title: unref(artworkReviewTitle),
            message: unref(artworkReviewMessage)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(showDetectedSuggestion)) {
          _push(`<div class="rounded-2xl border border-[#fde8e2] bg-[#fffbf9] px-4 py-3"><p class="text-[12px] font-extrabold text-[#c4320a]">${ssrInterpolate(unref(detectedSuggestionTitle))}</p><p class="mt-1 text-[11px] text-[#7a271a]">${ssrInterpolate(unref(detectedSuggestionDetails))}</p><p class="mt-1 text-[11px] font-semibold text-[#344054]">Apply these values to the calculator?</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-2 sm:grid-cols-2">`);
        if (unref(showDetectedSuggestion)) {
          _push(`<button type="button" class="rounded-xl bg-[#e13515] px-3 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-[#b82c10]"> Apply detected specs </button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showDetectedSuggestion)) {
          _push(`<button type="button" class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"> Edit manually </button>`);
        } else {
          _push(`<button type="button" class="rounded-xl bg-[#e13515] px-3 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-[#b82c10]"> Use detected specs </button>`);
        }
        if (!unref(showDetectedSuggestion)) {
          _push(`<button type="button" class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"> Edit manually </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid gap-2 sm:grid-cols-2"><button type="button" class="rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-[11.5px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]"> Remove file </button><button type="button" class="rounded-xl border border-[#fda497] bg-[#fff8f7] px-3 py-2 text-[11.5px] font-semibold text-[#c4320a] transition-colors hover:bg-[#fff1ee]"> Try another file </button></div><p class="${ssrRenderClass([unref(artworkIntentMessageTone), "text-[10.5px]"])}">${ssrInterpolate(unref(artworkIntentMessage))}</p></div>`);
      }
      _push(`</div></div><div class="rounded-3xl bg-[#101828] px-5 py-4"><div class="mb-3 flex items-center gap-2"><svg class="h-3.5 w-3.5 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg><p class="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#667085]">Production ticket</p></div><div class="grid grid-cols-2 gap-x-6 gap-y-2"><!--[-->`);
      ssrRenderList(unref(specCards), (item) => {
        _push(`<div class="${ssrRenderClass([item.span, "flex items-center justify-between border-white/[0.06]"])}"><span class="text-[11.5px] text-[#667085]">${ssrInterpolate(item.label)}</span><span class="text-right text-[11.5px] font-semibold text-white">${ssrInterpolate(item.value)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3"><span class="text-[11px] font-semibold uppercase tracking-widest text-[#667085]">Live pricing</span>`);
      if (unref(loading)) {
        _push(`<span class="text-[12px] font-semibold text-[#e13515]">Refreshing estimate...</span>`);
      } else if (unref(previewErrorMessage)) {
        _push(`<span class="text-[12px] text-[#b42318]">${ssrInterpolate(unref(previewErrorMessage))}</span>`);
      } else {
        _push(`<span class="text-[12px] text-[#667085]">Prices come from \`/api/calculator/public-preview/\` in KES.</span>`);
      }
      _push(`</div></div><div class="mx-6 mb-4 rounded-3xl bg-[#1d2939] px-5 py-4"><div class="mb-3 flex items-center gap-2"><div class="h-4 w-1.5 rounded-full bg-[#e13515]"></div><p class="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#98a2b3]">Imposition logic</p></div><div class="flex items-center justify-between gap-4"><div class="text-center">`);
      if (unref(hasImpositionPreview)) {
        _push(`<p class="text-3xl font-extrabold text-white">${ssrInterpolate(unref(piecesPerSheetText))}</p>`);
      } else {
        _push(`<p class="text-sm font-bold text-slate-200">Awaiting</p>`);
      }
      _push(`<p class="mt-1 text-[10.5px] leading-tight text-[#98a2b3]">${ssrInterpolate(unref(impositionPrimaryLabel))}</p></div><div class="flex-1 flex items-center justify-center"><div class="flex items-center gap-1.5 text-[#475467]"><div class="h-px w-8 bg-[#344054]"></div><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"></path></svg><div class="h-px w-8 bg-[#344054]"></div></div></div><div class="text-center">`);
      if (unref(hasImpositionPreview)) {
        _push(`<p class="text-3xl font-extrabold text-[#e13515]">${ssrInterpolate(unref(sheetsRequiredText))}</p>`);
      } else {
        _push(`<p class="text-sm font-bold text-slate-200">Preview</p>`);
      }
      _push(`<p class="mt-1 text-[10.5px] leading-tight text-[#98a2b3]">${ssrInterpolate(unref(impositionSecondaryLabel))}</p></div></div><div class="mt-3 border-t border-[#344054] pt-3">`);
      if (unref(impositionFormulaText)) {
        _push(`<p class="text-center text-[11.5px] text-[#667085]"><span class="font-extrabold text-white">${ssrInterpolate(unref(impositionFormulaText))}</span></p>`);
      } else {
        _push(`<p class="text-center text-[11.5px] text-[#98a2b3]"> Awaiting imposition preview </p>`);
      }
      _push(`</div></div><div class="mx-6 mb-4 border-2 border-[#e13515] rounded-xl px-5 py-4"><div class="flex items-center justify-between mb-1"><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515]">Nairobi Market Range</p><svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg></div><div class="flex items-baseline gap-2 mt-2"><span class="text-3xl font-extrabold text-[#101828]">${ssrInterpolate(unref(minPriceText))}</span><span class="text-xl font-light text-[#667085]">-</span><span class="text-3xl font-extrabold text-[#101828]">${ssrInterpolate(unref(maxPriceText))}</span></div><div class="mt-2 w-full bg-[#f2f4f7] rounded-full h-2"><div class="h-2 rounded-full bg-gradient-to-r from-[#e13515] to-[#f97316]" style="${ssrRenderStyle({ width: `${unref(rangeMeterWidth)}%` })}"></div></div><p class="text-xs text-[#667085] mt-1.5">${ssrInterpolate(unref(estimateNote))}</p></div><div class="mx-6 mb-6 flex items-start gap-3 bg-[#fffbf9] border border-[#fde8e2] rounded-lg px-4 py-3"><svg class="w-4 h-4 text-[#e13515] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-xs text-[#667085] leading-relaxed"> Final quote depends on <span class="font-semibold text-[#344054]">artwork quality, turnaround time,</span> and available <span class="font-semibold text-[#344054]">verified production shops.</span></p></div><div class="px-6 pb-6">`);
      if (props.embedded && unref(auth).canAccessClientDashboard) {
        _push(`<!--[--><button type="button" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] py-4 text-center text-[14.5px] font-extrabold tracking-wide text-white transition-colors hover:bg-[#b82c10] disabled:cursor-not-allowed disabled:opacity-60"${ssrIncludeBooleanAttr(unref(quoteRequestLoading) || !unref(hasMinimumQuoteInputs)) ? " disabled" : ""}>${ssrInterpolate(unref(quoteRequestLoading) ? "Requesting quotes..." : "Request quotes from shops")}</button>`);
        if (!unref(hasMinimumQuoteInputs)) {
          _push(`<p class="mt-2 text-center text-[10.5px] text-[#667085]"> Choose a product, quantity, and paper preference first. </p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(quoteRequestError)) {
          _push(ssrRenderComponent(BaseAlert, {
            class: "mt-3",
            variant: "error",
            title: "Quote request failed",
            message: unref(quoteRequestError)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(quoteRequestSuccess)) {
          _push(`<div class="mt-3 rounded-2xl border border-[#abefc6] bg-[#f6fef9] p-4"><p class="text-sm font-semibold text-[#027a48]">${ssrInterpolate(unref(quoteRequestSuccess))}</p><div class="mt-3 flex flex-wrap gap-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(createdQuoteRequestId) ? `/dashboard/client/quotes/${unref(createdQuoteRequestId)}` : "/dashboard/client/quotes",
            class: "inline-flex items-center justify-center rounded-xl bg-[#027a48] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#05603a]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View my quotes `);
              } else {
                return [
                  createTextVNode(" View my quotes ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1",
          class: "flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e13515] py-4 text-center text-[14.5px] font-extrabold tracking-wide text-white transition-colors hover:bg-[#b82c10]",
          onClick: ($event) => continueWithEstimate("register")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Create an account to upload artwork `);
            } else {
              return [
                createTextVNode(" Create an account to upload artwork ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button type="button" class="mt-2.5 flex w-full items-center justify-center gap-1.5 py-2.5 text-[12.5px] font-semibold text-[#667085] transition-colors hover:text-[#344054]"><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Continue as guest </button>`);
        if (unref(guestEstimateMessage)) {
          _push(`<p class="${ssrRenderClass([unref(guestEstimateMessageClass), "mt-1 text-center text-[10.5px]"])}">${ssrInterpolate(unref(guestEstimateMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div></div></div></div></section>`);
      if (!props.embedded) {
        _push(`<section class="bg-[#1d2939] border-b border-[#344054]"><div class="max-w-7xl mx-auto px-6 py-8"><div class="grid grid-cols-2 md:grid-cols-4 gap-8"><div class="text-center"><p class="text-3xl font-extrabold text-white">KES</p><p class="text-sm text-[#667085] mt-1">One currency from estimate to payment</p></div><div class="text-center"><p class="text-3xl font-extrabold text-white">API</p><p class="text-sm text-[#667085] mt-1">Prices come from the Django backend</p></div><div class="text-center"><p class="text-3xl font-extrabold text-white">Upload</p><p class="text-sm text-[#667085] mt-1">Artwork feeds the real quote flow</p></div><div class="text-center"><p class="text-3xl font-extrabold text-white">Track</p><p class="text-sm text-[#667085] mt-1">Public token tracking stays separate and safe</p></div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section id="how-it-works" class="bg-white py-24"><div class="max-w-7xl mx-auto px-6"><div class="text-center mb-16"><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Simple process</p><h2 class="text-4xl font-extrabold text-[#101828] mb-4">How Printy works</h2><p class="text-lg text-[#667085] max-w-xl mx-auto">From first spec to delivered job - Printy handles the complexity so you don&#39;t have to chase anyone.</p></div><div class="grid md:grid-cols-4 gap-4 relative"><!--[-->`);
      ssrRenderList(workflowSteps, (step, index) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeWorkflowStep) === index ? "border-[#fda497] bg-[#fff8f7] shadow-lg scale-[1.03]" : "border-[#e4e7ec] bg-white hover:border-[#fda497] hover:shadow-sm", "relative z-10 flex flex-col items-center text-center px-6 py-6 rounded-2xl border transition-all duration-200"])}"><div class="${ssrRenderClass([unref(activeWorkflowStep) === index ? "animate-[pulse_2s_ease-in-out_infinite]" : "", "w-[104px] h-[104px] rounded-2xl flex items-center justify-center shadow-lg mb-6 transition-transform duration-200"])}">${step.icon ?? ""}</div><div class="${ssrRenderClass([unref(activeWorkflowStep) === index ? "bg-[#e13515]" : step.badgeClass, "w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mb-4 ring-4 ring-white shadow"])}">${ssrInterpolate(step.number)}</div><h3 class="text-base font-bold text-[#101828] mb-2">${ssrInterpolate(step.title)}</h3><p class="${ssrRenderClass([unref(activeWorkflowStep) === index ? "text-[#344054]" : "text-[#667085]", "text-sm leading-relaxed"])}">${ssrInterpolate(step.copy)}</p></button>`);
      });
      _push(`<!--]--></div><div class="mt-8 rounded-2xl border border-[#fda497] bg-[#fff8f7] px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p class="text-[11px] font-semibold uppercase tracking-widest text-[#e13515] mb-1">Active step</p><h3 class="text-xl font-extrabold text-[#101828]">${ssrInterpolate(unref(activeWorkflow).title)}</h3><p class="text-sm text-[#667085] mt-2 max-w-2xl">${ssrInterpolate(unref(activeWorkflow).detail)}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1",
        class: "inline-flex items-center justify-center gap-2 rounded-xl bg-[#e13515] px-5 py-3 text-sm font-bold text-white hover:bg-[#b82c10] transition-colors",
        onClick: ($event) => continueWithEstimate("register")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Continue to ${ssrInterpolate(unref(activeWorkflow).cta)} <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"${_scopeId}><path d="M5 12h14M12 5l7 7-7 7"${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Continue to " + toDisplayString(unref(activeWorkflow).cta) + " ", 1),
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2.5"
              }, [
                createVNode("path", { d: "M5 12h14M12 5l7 7-7 7" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section id="who-it-helps" class="bg-[#f9fafb] py-24 border-t border-[#e4e7ec]"><div class="max-w-7xl mx-auto px-6"><div class="text-center mb-16"><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Built for real print workflows</p><h2 class="text-4xl font-extrabold text-[#101828] mb-4">Who Printy helps</h2><p class="text-lg text-[#667085] max-w-xl mx-auto">Printy keeps buyers, teams, and production shops aligned around the same trusted job data.</p></div><div class="grid md:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(audiences, (group) => {
        _push(`<div class="bg-white rounded-2xl border border-[#e4e7ec] shadow-sm overflow-hidden hover:shadow-md transition-shadow"><div class="${ssrRenderClass([group.barClass, "h-2"])}"></div><div class="p-8"><div class="${ssrRenderClass([group.iconShellClass, "w-12 h-12 rounded-xl flex items-center justify-center mb-6"])}">${group.icon ?? ""}</div><h3 class="text-xl font-bold text-[#101828] mb-3">${ssrInterpolate(group.title)}</h3><p class="text-[#667085] text-sm leading-relaxed mb-6">${ssrInterpolate(group.copy)}</p><ul class="space-y-3"><!--[-->`);
        ssrRenderList(group.points, (item) => {
          _push(`<li class="flex items-start gap-3"><div class="${ssrRenderClass([group.checkShellClass, "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"])}"><svg class="${ssrRenderClass([group.checkIconClass, "w-3 h-3"])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"></path></svg></div><span class="text-sm text-[#344054]">${ssrInterpolate(item)}</span></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      });
      _push(`<!--]--></div></div></section><section id="why-trust" class="bg-white py-24 border-t border-[#e4e7ec]"><div class="max-w-7xl mx-auto px-6"><div class="grid lg:grid-cols-2 gap-16 items-center"><div><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Built on accountability</p><h2 class="text-4xl font-extrabold text-[#101828] mb-5">Why clients trust Printy</h2><p class="text-lg text-[#667085] leading-relaxed mb-10"> Printy isn&#39;t a marketplace where you hope for the best. It&#39;s a structured print operating system with price logic, verified production shops, and end-to-end accountability. </p><div class="space-y-6"><!--[-->`);
      ssrRenderList(trustReasons, (reason) => {
        _push(`<div class="flex gap-5"><div class="shrink-0 w-12 h-12 rounded-xl bg-[#fef3f2] flex items-center justify-center">${reason.icon ?? ""}</div><div><h4 class="font-bold text-[#101828] mb-1">${ssrInterpolate(reason.title)}</h4><p class="text-sm text-[#667085] leading-relaxed">${ssrInterpolate(reason.copy)}</p></div></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-[#f9fafb] border border-[#e4e7ec] rounded-2xl overflow-hidden shadow-sm"><div class="bg-[#101828] px-6 py-4 flex items-center gap-3"><div class="flex gap-1.5"><div class="w-3 h-3 rounded-full bg-[#667085]"></div><div class="w-3 h-3 rounded-full bg-[#667085]"></div><div class="w-3 h-3 rounded-full bg-[#667085]"></div></div><div class="flex-1 bg-[#1d2939] rounded-md px-3 py-1"><p class="text-xs text-[#475467]">app.printy.co.ke/jobs/JB-20491</p></div></div><div class="p-6"><div class="flex items-center justify-between mb-4 gap-4"><div><p class="text-xs text-[#667085] mb-0.5">Job reference</p><p class="font-bold text-[#101828]">JB-20491 - Business Cards</p></div><span class="bg-[#ecfdf3] text-[#027a48] text-xs font-bold px-3 py-1.5 rounded-full">In Production</span></div><div class="relative mb-6"><div class="absolute top-4 left-4 right-4 h-0.5 bg-[#e4e7ec]"></div><div class="absolute top-4 left-4 h-0.5 bg-[#e13515]" style="${ssrRenderStyle({ "width": "calc(75% - 16px)" })}"></div><div class="relative flex justify-between"><!--[-->`);
      ssrRenderList(trackerStages, (stage) => {
        _push(`<div class="flex flex-col items-center gap-2"><div class="${ssrRenderClass([stage.shellClass, "w-8 h-8 rounded-full flex items-center justify-center z-10"])}">${stage.icon ?? ""}</div><p class="${ssrRenderClass([stage.labelClass, "text-xs text-center"])}">${ssrInterpolate(stage.title)}</p></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-white rounded-xl border border-[#e4e7ec] divide-y divide-[#f2f4f7]"><div class="flex justify-between px-4 py-3"><span class="text-xs text-[#667085]">Product</span><span class="text-xs font-semibold text-[#101828]">Business Cards, 500 qty</span></div><div class="flex justify-between px-4 py-3"><span class="text-xs text-[#667085]">Shop</span><span class="text-xs font-semibold text-[#101828]">Verified Shop #3</span></div><div class="flex justify-between px-4 py-3"><span class="text-xs text-[#667085]">Est. completion</span><span class="text-xs font-semibold text-[#101828]">Today, 5:00 PM</span></div><div class="flex justify-between px-4 py-3"><span class="text-xs text-[#667085]">Amount paid</span><span class="text-xs font-bold text-[#027a48]">Payment confirmed</span></div></div><div class="mt-4 flex items-center gap-2 bg-[#fffbf9] border border-[#fde8e2] rounded-lg px-4 py-2.5"><svg class="w-4 h-4 text-[#e13515] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg><p class="text-xs text-[#667085]">You&#39;ll be notified when your job moves to <span class="font-semibold text-[#344054]">Finishing</span>.</p></div></div></div></div></div></section><section id="market" class="bg-[#101828] py-24"><div class="max-w-7xl mx-auto px-6"><div class="grid lg:grid-cols-2 gap-16 items-center"><div class="space-y-4"><div><div class="flex items-center gap-2 mb-3"><span class="w-5 h-5 rounded-full bg-[#12b76a] flex items-center justify-center"><svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"></path></svg></span><p class="text-sm font-semibold text-[#98a2b3] uppercase tracking-wider">What visitors see</p></div><div class="bg-[#1d2939] rounded-2xl border border-[#344054] p-6"><p class="text-xs font-semibold uppercase tracking-widest text-[#667085] mb-4">${ssrInterpolate(unref(marketSummaryLabel))}</p><div class="flex items-center gap-4 mb-4"><div class="flex-1"><p class="text-xs text-[#667085] mb-2">Nairobi market range</p><p class="text-2xl font-extrabold text-white">${ssrInterpolate(unref(minPriceText))} <span class="text-[#667085] font-light">-</span> ${ssrInterpolate(unref(maxPriceText))}</p></div><div class="w-px h-12 bg-[#344054]"></div><div><p class="text-xs text-[#667085] mb-2">Sheets needed</p>`);
      if (unref(hasImpositionPreview)) {
        _push(`<p class="text-2xl font-extrabold text-white">${ssrInterpolate(unref(sheetsRequiredText))}</p>`);
      } else {
        _push(`<p class="text-sm font-bold text-slate-200">Awaiting preview</p>`);
      }
      _push(`</div></div><div class="grid grid-cols-3 gap-3"><div class="bg-[#101828] rounded-lg px-3 py-2 text-center"><p class="text-xs text-[#667085]">Shops available</p><p class="text-sm font-bold text-white mt-0.5">3 verified</p></div><div class="bg-[#101828] rounded-lg px-3 py-2 text-center"><p class="text-xs text-[#667085]">Avg. turnaround</p><p class="text-sm font-bold text-white mt-0.5">2-3 days</p></div><div class="bg-[#101828] rounded-lg px-3 py-2 text-center"><p class="text-xs text-[#667085]">Rush available</p><p class="text-sm font-bold text-[#12b76a] mt-0.5">Yes</p></div></div></div></div><div><div class="flex items-center gap-2 mb-3"><span class="w-5 h-5 rounded-full bg-[#667085] flex items-center justify-center"><svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"></path></svg></span><p class="text-sm font-semibold text-[#475467] uppercase tracking-wider">What stays private</p></div><div class="bg-[#1a1a2e] rounded-2xl border border-[#2a2a3e] p-6 relative overflow-hidden"><div class="absolute inset-0 flex items-center justify-center z-10"><div class="flex items-center gap-3 bg-[#101828] border border-[#344054] rounded-xl px-6 py-4 shadow-2xl"><svg class="w-5 h-5 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg><p class="text-sm font-semibold text-[#667085]">Not visible to the public</p></div></div><div class="opacity-10 blur-sm select-none pointer-events-none"><div class="space-y-2"><div class="flex justify-between py-2 border-b border-[#344054]"><span class="text-xs text-[#667085]">Shop A - base rate</span><span class="text-xs text-white">Protected</span></div><div class="flex justify-between py-2 border-b border-[#344054]"><span class="text-xs text-[#667085]">Shop B - base rate</span><span class="text-xs text-white">Protected</span></div><div class="flex justify-between py-2 border-b border-[#344054]"><span class="text-xs text-[#667085]">Broker margin %</span><span class="text-xs text-white">18%</span></div><div class="flex justify-between py-2"><span class="text-xs text-[#667085]">Payout schedule</span><span class="text-xs text-white">Net 7</span></div></div></div></div></div></div><div><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">Designed for trust</p><h2 class="text-4xl font-extrabold text-white mb-5 leading-tight">Market visibility<br>without exposure</h2><p class="text-lg text-[#98a2b3] leading-relaxed mb-8"> Printy shows visitors honest market price ranges - not raw shop rate cards. Shop rates, partner margins, and internal payout structures are never exposed to the public. </p><div class="space-y-5"><!--[-->`);
      ssrRenderList(marketTrustPoints, (item) => {
        _push(`<div class="flex items-start gap-4 bg-[#1d2939] rounded-xl p-5 border border-[#344054]"><div class="${ssrRenderClass([item.iconShellClass, "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"])}">${item.icon ?? ""}</div><div><p class="text-sm font-bold text-white mb-1">${ssrInterpolate(item.title)}</p><p class="text-sm text-[#667085]">${ssrInterpolate(item.copy)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
      if (!props.embedded) {
        _push(`<section class="bg-white py-24 border-t border-[#e4e7ec]"><div class="max-w-7xl mx-auto px-6"><div class="text-center mb-16"><p class="text-xs font-semibold uppercase tracking-widest text-[#e13515] mb-3">End-to-end print operations</p><h2 class="text-4xl font-extrabold text-[#101828] mb-5">Printy is not a directory</h2><p class="text-lg text-[#667085] max-w-2xl mx-auto"> Most print platforms are glorified listings. Printy is a print job operating system - handling every layer from pricing logic to production tracking. </p></div><div class="grid md:grid-cols-3 gap-px bg-[#e4e7ec] rounded-2xl overflow-hidden shadow-sm"><!--[-->`);
        ssrRenderList(comparisonPanels, (panel) => {
          _push(`<div class="${ssrRenderClass([panel.panelClass, "p-8 relative"])}">`);
          if (panel.badge) {
            _push(`<div class="absolute top-4 right-4 bg-[#e13515] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">${ssrInterpolate(panel.badge)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="${ssrRenderClass([panel.labelClass, "text-xs font-bold uppercase tracking-widest mb-6"])}">${ssrInterpolate(panel.title)}</p><ul class="space-y-4"><!--[-->`);
          ssrRenderList(panel.items, (item) => {
            _push(`<li class="flex items-center gap-3"><svg class="${ssrRenderClass([item.iconClass, "w-4 h-4 shrink-0"])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path${ssrRenderAttr("d", item.path)}></path></svg><span class="${ssrRenderClass([panel.textClass, "text-sm"])}">${ssrInterpolate(item.text)}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (!props.embedded) {
        _push(`<section class="bg-[#e13515] py-20"><div class="max-w-4xl mx-auto px-6 text-center"><h2 class="text-4xl font-extrabold text-white mb-5 leading-tight"> Stop guessing print prices.<br>Start running print jobs properly. </h2><p class="text-lg text-[#fde8e2] mb-10 max-w-xl mx-auto"> Get an instant, imposition-based estimate for your next print job. No account needed to see market ranges. </p><div class="flex flex-wrap items-center justify-center gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/register?role=client&next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1",
          class: "inline-flex items-center gap-2 bg-white text-[#e13515] font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:bg-[#fef3f2] transition-colors",
          onClick: ($event) => continueWithEstimate("register")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Start with this estimate <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"${_scopeId}><path d="M5 12h14M12 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Start with this estimate "),
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2.5"
                }, [
                  createVNode("path", { d: "M5 12h14M12 5l7 7-7 7" })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/login?next=%2Fdashboard%3FpendingQuote%3D1&pendingQuote=1",
          class: "inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-white/10 transition-colors",
          onClick: ($event) => continueWithEstimate("login")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Sign in to your account `);
            } else {
              return [
                createTextVNode(" Sign in to your account ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/marketing/HomeHeroCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomeHeroCalculator = Object.assign(_sfc_main, { __name: "MarketingHomeHeroCalculator" });

export { HomeHeroCalculator as H };
//# sourceMappingURL=HomeHeroCalculator-DdQjRmr7.mjs.map
