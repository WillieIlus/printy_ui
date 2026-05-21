import { defineComponent, withAsyncContext, computed, ref, reactive, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, withDirectives, vModelCheckbox, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList, vModelRadio, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderAttr, ssrLooseContain } from 'vue/server-renderer';
import { B as BaseAlert } from './BaseAlert-BEu0SLA6.mjs';
import { p as useHead, m as useAuthStore, n as navigateTo, q as useRoute, b as BaseCard, a as BaseButton, j as getApiErrorMessage } from './server.mjs';
import { B as BaseInput } from './BaseInput-BGy7Y2Dg.mjs';
import { B as BaseSelect } from './BaseSelect-BfVIRUJz.mjs';
import { B as BaseTextarea } from './BaseTextarea-C3eZlfXs.mjs';
import { R as RoleDashboardFrame, D as DashboardSection } from './RoleDashboardFrame-z5_-ER2G.mjs';
import { u as useForShopsApi } from './for-shops-BZeHBgjt.mjs';
import { u as useShopsApi } from './shops-BCgoELKm.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';
import './DashboardTopbar-CBNaUx0B.mjs';
import './design-HtHvYN8j.mjs';
import './PrintyLogo-bSA8QTQF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "onboarding",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Printy - Production Onboarding"
    });
    const auth = useAuthStore();
    const { previewForShops } = useForShopsApi();
    const {
      completeShopRateCardSetup,
      createShop,
      createShopFinishingRate,
      createShopPaper,
      fetchMyShops,
      fetchShopRateCardSetup,
      listShopFinishingRates,
      listShopPapers,
      saveShopRateCardSetup,
      updateShop,
      updateShopFinishingRate,
      updateShopPaper
    } = useShopsApi();
    if (!auth.canAccessProductionDashboard) {
      [__temp, __restore] = withAsyncContext(() => navigateTo(auth.homeRoute)), await __temp, __restore();
    }
    const route = useRoute();
    const displayName = computed(() => auth.user?.name || auth.user?.email || "Production");
    const initials = computed(() => displayName.value.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PD");
    const steps = [
      { value: 1, key: "shop", label: "Shop profile" },
      { value: 2, key: "paper-stock", label: "Paper stock" },
      { value: 3, key: "pricing", label: "Pricing" },
      { value: 4, key: "review", label: "Review and go live" }
    ];
    const totalSteps = steps.length;
    const requestedStep = String(route.query.step || "").toLowerCase();
    const initialStep = Math.max(1, steps.find((step) => step.key === requestedStep)?.value || 1);
    const activeStep = ref(initialStep);
    const activeStepTitle = computed(() => steps.find((step) => step.value === activeStep.value)?.label || "Onboarding");
    const navItems = computed(() => [
      { label: "Overview", to: "/dashboard/production" },
      { label: "Onboarding", to: "/dashboard/production/onboarding", active: true },
      { label: "Paper", to: "/dashboard/production/paper-stock" },
      { label: "Pricing", to: "/dashboard/production/pricing" },
      { label: "Finishings", to: "/dashboard/production/finishings" },
      { label: "Messages", to: "/dashboard/production/messages" }
    ]);
    const sheetSizeOptions = [
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "A5", value: "A5" },
      { label: "SRA3", value: "SRA3" },
      { label: "Custom", value: "Custom" }
    ];
    const finishingPricingOptions = [
      { label: "Per side", value: "per_side" },
      { label: "Per piece", value: "per_piece" },
      { label: "Per job", value: "per_job" }
    ];
    const pageError = ref("");
    const successMessage = ref("");
    const stepLoading = ref(false);
    const previewLoading = ref(false);
    const previewError = ref("");
    const completingOnboarding = ref(false);
    const isBooting = ref(true);
    const currentShop = ref(null);
    const currentShopSlug = computed(() => currentShop.value?.slug || "");
    ref([]);
    const existingFinishings = ref([]);
    const setupState = ref(null);
    const previewState = ref(null);
    ref(null);
    const shopForm = reactive({
      name: "",
      city: "",
      phone_number: "",
      service_area: "",
      description: "",
      delivery_available: false,
      offers_delivery: false
    });
    const shopErrors = reactive({});
    const paperRows = ref([]);
    const pricingRows = ref([]);
    const finishingRows = ref([]);
    let previewTimer = null;
    function createPaperDraft(overrides = {}) {
      return {
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: "",
        gsm: "",
        sheet_size: "SRA3",
        cost_per_sheet: "",
        quantity_in_stock: "",
        is_active: true,
        saving: false,
        saved: false,
        errorMessage: "",
        errors: {},
        ...overrides
      };
    }
    function normalizeShopForm(shop, setup) {
      const shopDetails = setup?.shop_details || {};
      shopForm.name = shop?.name || shopDetails.shop_name || "";
      shopForm.city = shop?.city || shop?.service_area || shopDetails.location_area || "";
      shopForm.phone_number = shop?.public_whatsapp_number || shop?.phone_number || shopDetails.whatsapp_number || "";
      shopForm.service_area = shop?.service_area || shopDetails.location_area || shop?.city || "";
      shopForm.description = shop?.description || "";
      const offersDelivery = Boolean(
        shop?.delivery_available ?? shopDetails.delivery_available ?? shop?.offers_delivery ?? false
      );
      shopForm.delivery_available = offersDelivery;
      shopForm.offers_delivery = offersDelivery;
    }
    function buildShopPayload() {
      return {
        name: shopForm.name.trim(),
        business_email: auth.user?.email || "",
        address_line: shopForm.service_area.trim() || shopForm.city.trim(),
        city: shopForm.city.trim(),
        state: "Nairobi",
        country: "Kenya",
        zip_code: "00100",
        phone_number: shopForm.phone_number.trim(),
        public_whatsapp_number: shopForm.phone_number.trim(),
        service_area: shopForm.service_area.trim(),
        description: shopForm.description.trim(),
        delivery_available: shopForm.offers_delivery,
        offers_delivery: shopForm.offers_delivery,
        is_public: false
      };
    }
    function inferPaperCategory(name, gsm) {
      const normalized = `${name} ${gsm}`.toLowerCase();
      if (normalized.includes("sticker") || normalized.includes("tictac")) return "sticker";
      if (normalized.includes("ivory")) return "ivory";
      if (normalized.includes("board")) return "cover_board";
      if (normalized.includes("art card") || normalized.includes("artcard")) return "artcard";
      if (normalized.includes("gloss")) return "gloss";
      return "matt";
    }
    function inferPaperType(name) {
      const normalized = name.toLowerCase();
      if (normalized.includes("gloss")) return "GLOSS";
      if (normalized.includes("sticker") || normalized.includes("tictac")) return "STICKER";
      if (normalized.includes("bond")) return "BOND";
      return "MATTE";
    }
    function validatePaperRow(row) {
      row.errors = {};
      row.errorMessage = "";
      if (!row.name.trim()) row.errors.name = "Paper name is required.";
      if (!row.sheet_size.trim()) row.errors.sheet_size = "Choose a size.";
      if (!row.gsm || Number(row.gsm) <= 0) row.errors.gsm = "Enter a valid GSM.";
      if (row.cost_per_sheet === "" || Number(row.cost_per_sheet) < 0) row.errors.cost_per_sheet = "Enter a valid cost per sheet.";
      if (row.quantity_in_stock === "" || Number(row.quantity_in_stock) < 0) row.errors.quantity_in_stock = "Enter a valid quantity.";
      return Object.keys(row.errors).length === 0;
    }
    function paperPayload(row) {
      return {
        name: row.name.trim(),
        sheet_size: row.sheet_size,
        gsm: Number(row.gsm),
        category: inferPaperCategory(row.name, row.gsm),
        paper_type: inferPaperType(row.name),
        buying_price: Number(row.cost_per_sheet || 0).toFixed(2),
        selling_price: Number(row.cost_per_sheet || 0).toFixed(2),
        quantity_in_stock: row.quantity_in_stock === "" ? 0 : Number(row.quantity_in_stock),
        is_active: row.is_active,
        available_for_quoting: row.is_active
      };
    }
    function buildShopDetailsPayload() {
      return {
        shop_name: shopForm.name.trim(),
        whatsapp_number: shopForm.phone_number.trim(),
        location_area: shopForm.service_area.trim() || shopForm.city.trim(),
        delivery_available: shopForm.offers_delivery
      };
    }
    function buildPreviewPayload() {
      return {
        paper_rows: pricingRows.value,
        finishing_rows: finishingRows.value
      };
    }
    function schedulePreview() {
      if (previewTimer) {
        clearTimeout(previewTimer);
      }
      previewTimer = setTimeout(() => {
        void refreshPreview();
      }, 600);
    }
    async function refreshPreview() {
      previewLoading.value = true;
      previewError.value = "";
      try {
        previewState.value = await previewForShops(buildPreviewPayload());
      } catch (error) {
        previewError.value = getApiErrorMessage(error, "Live capability preview is unavailable right now.");
      } finally {
        previewLoading.value = false;
      }
    }
    function formatKes(value) {
      if (value === null || value === void 0 || value === "") {
        return "";
      }
      const amount = Number(String(value).replace(/[^0-9.-]/g, ""));
      if (!Number.isFinite(amount)) {
        return "";
      }
      return `KES ${new Intl.NumberFormat("en-KE").format(Math.round(amount))}`;
    }
    function extractPriceRange(source) {
      const min = source.market_price_min ?? source.min_price ?? source.price_min ?? source.low_price;
      const max = source.market_price_max ?? source.max_price ?? source.price_max ?? source.high_price;
      const exact = source.market_price ?? source.client_price ?? source.price ?? source.estimated_total;
      if (min !== void 0 && max !== void 0) {
        const left = formatKes(min);
        const right = formatKes(max);
        return left && right ? `${left} - ${right}` : "";
      }
      return formatKes(exact);
    }
    const previewProducts = computed(() => {
      const summary = previewState.value?.summary || setupState.value?.summary || {};
      return Array.isArray(summary.unlocked_products) ? summary.unlocked_products.slice(0, 6) : [];
    });
    const setupSummary = computed(() => previewState.value?.summary || setupState.value?.summary || null);
    const activePricingCount = computed(() => pricingRows.value.filter((row) => row.active).length);
    const savedPaperCount = computed(() => paperRows.value.filter((row) => row.saved || row.id).length);
    const exampleQuoteSummary = computed(() => {
      const exampleQuote = previewState.value?.example_quote || setupState.value?.example_quote || null;
      if (!exampleQuote) {
        return null;
      }
      return {
        title: exampleQuote.title || "Example quote",
        message: exampleQuote.status_text || `Estimated raw production cost: ${exampleQuote.production_cost || "Pending"}`
      };
    });
    const capabilityPreviewRows = computed(() => {
      const exampleQuote = previewState.value?.example_quote || setupState.value?.example_quote || null;
      const rows = previewProducts.value.map((product, index) => {
        const record = product;
        return {
          key: String(record.key || record.slug || record.label || index),
          label: String(record.label || record.name || record.product_type || "Available product"),
          detail: String(record.reason || record.size || record.paper_label || "").trim(),
          priceText: extractPriceRange(record) || "Estimated from active rate card"
        };
      });
      if (rows.length > 0) {
        return rows;
      }
      if (exampleQuote) {
        return [{
          key: "example-quote",
          label: String(exampleQuote.title || exampleQuote.paper_label || "Preview quote"),
          detail: String(exampleQuote.status_text || "").trim(),
          priceText: extractPriceRange(exampleQuote) || formatKes(exampleQuote.production_cost) || "Pending"
        }];
      }
      return [];
    });
    const estimatedPriceRangeText = computed(() => {
      const prices = capabilityPreviewRows.value.map((row) => row.priceText).filter(Boolean);
      return prices.length ? prices[0] : "";
    });
    function clearShopErrors() {
      for (const key of Object.keys(shopErrors)) {
        delete shopErrors[key];
      }
    }
    function readFieldErrors(error) {
      const data = error?.data || {};
      return typeof data === "object" && data ? data : {};
    }
    function finishingPricingLabel(row) {
      if (row.pricing_type === "per_side") return "Priced per side";
      if (row.pricing_type === "per_job") return "Priced per job";
      return "Priced per piece";
    }
    watch(
      () => [pricingRows.value, finishingRows.value].map((value) => JSON.stringify(value)).join("|"),
      () => {
        if (!isBooting.value && activeStep.value >= 3) {
          schedulePreview();
        }
      }
    );
    function goBack() {
      successMessage.value = "";
      activeStep.value = Math.max(1, activeStep.value - 1);
    }
    function addPaperRow() {
      if (paperRows.value.length >= 10) {
        return;
      }
      paperRows.value.push(createPaperDraft());
    }
    function removePaperRow(localId) {
      paperRows.value = paperRows.value.filter((row) => row.localId !== localId);
    }
    async function saveShopStep() {
      clearShopErrors();
      successMessage.value = "";
      if (!shopForm.name.trim()) shopErrors.name = "Shop name is required.";
      if (!shopForm.phone_number.trim()) shopErrors.phone_number = "Phone / WhatsApp is required.";
      if (!shopForm.city.trim()) shopErrors.city = "Location is required.";
      if (!shopForm.service_area.trim()) shopErrors.service_area = "Area is required.";
      if (shopForm.description.length > 200) shopErrors.description = "Keep the description under 200 characters.";
      if (Object.keys(shopErrors).length > 0) {
        throw new Error("Please complete the required shop fields.");
      }
      const payload = buildShopPayload();
      try {
        if (currentShopSlug.value) {
          currentShop.value = await updateShop(currentShopSlug.value, payload);
        } else {
          currentShop.value = await createShop(payload);
          await auth.fetchMe();
        }
        setupState.value = await fetchShopRateCardSetup(currentShop.value.slug);
        normalizeShopForm(currentShop.value, setupState.value);
        successMessage.value = "Shop profile saved.";
      } catch (error) {
        const fieldErrors = readFieldErrors(error);
        if (Array.isArray(fieldErrors.name)) shopErrors.name = String(fieldErrors.name[0]);
        if (Array.isArray(fieldErrors.city)) shopErrors.city = String(fieldErrors.city[0]);
        if (Array.isArray(fieldErrors.phone_number)) shopErrors.phone_number = String(fieldErrors.phone_number[0]);
        if (Array.isArray(fieldErrors.service_area)) shopErrors.service_area = String(fieldErrors.service_area[0]);
        throw error;
      }
    }
    async function savePaperStep() {
      successMessage.value = "";
      if (!currentShopSlug.value) {
        throw new Error("Create the shop profile first.");
      }
      let successes = 0;
      await Promise.all(paperRows.value.map(async (row) => {
        if (!validatePaperRow(row)) {
          row.errorMessage = "This row has validation issues.";
          return;
        }
        row.saving = true;
        row.errorMessage = "";
        try {
          const saved = row.id ? await updateShopPaper(currentShopSlug.value, row.id, paperPayload(row)) : await createShopPaper(currentShopSlug.value, paperPayload(row));
          row.id = saved.id;
          row.saved = true;
          row.saving = false;
          row.errorMessage = "";
          successes += 1;
        } catch (error) {
          row.saving = false;
          row.saved = false;
          row.errorMessage = getApiErrorMessage(error, "This paper row could not be saved.");
        }
      }));
      if (successes === 0) {
        throw new Error("No paper rows were saved.");
      }
      successMessage.value = `${successes} paper row${successes === 1 ? "" : "s"} saved.`;
    }
    async function savePricingState() {
      if (!currentShopSlug.value) {
        throw new Error("Create the shop profile first.");
      }
      setupState.value = await saveShopRateCardSetup({
        paper_rows: pricingRows.value,
        finishing_rows: finishingRows.value,
        shop_details: buildShopDetailsPayload()
      }, currentShopSlug.value);
    }
    function finishingPayload(row) {
      const base = {
        name: row.label || row.name,
        price: Number(row.price || 0).toFixed(2),
        is_active: Boolean(row.active)
      };
      if (row.pricing_type === "per_side") {
        const price = Number(row.price || 0);
        return {
          ...base,
          charge_unit: "PER_SHEET",
          billing_basis: "per_sheet",
          side_mode: "per_selected_side",
          double_side_price: (price * 2).toFixed(2),
          minimum_charge: "0.00",
          setup_fee: "0.00"
        };
      }
      if (row.pricing_type === "per_piece") {
        return {
          ...base,
          charge_unit: "PER_PIECE",
          billing_basis: "per_piece",
          side_mode: "ignore_sides",
          setup_fee: "0.00",
          minimum_charge: "0.00"
        };
      }
      return {
        ...base,
        charge_unit: "FLAT",
        billing_basis: "flat_per_job",
        side_mode: "ignore_sides",
        setup_fee: "0.00",
        minimum_charge: "0.00"
      };
    }
    async function saveFinishingStep() {
      if (!currentShopSlug.value) {
        throw new Error("Create the shop profile first.");
      }
      const finishingsByName = new Map(existingFinishings.value.map((item) => [item.name.toLowerCase(), item]));
      for (const row of finishingRows.value) {
        row.errorMessage = "";
        try {
          const match = finishingsByName.get(String(row.name || row.label || "").toLowerCase());
          if (match) {
            await updateShopFinishingRate(currentShopSlug.value, match.id, finishingPayload(row));
          } else if (row.active) {
            await createShopFinishingRate(currentShopSlug.value, finishingPayload(row));
          }
        } catch (error) {
          row.errorMessage = getApiErrorMessage(error, "This finishing could not be saved.");
        }
      }
      if (finishingRows.value.some((row) => row.active && row.errorMessage)) {
        throw new Error("One or more finishing rows failed to save.");
      }
      existingFinishings.value = await listShopFinishingRates(currentShopSlug.value);
    }
    async function handleContinue() {
      stepLoading.value = true;
      pageError.value = "";
      try {
        if (activeStep.value === 1) {
          await saveShopStep();
        } else if (activeStep.value === 2) {
          await savePaperStep();
        } else if (activeStep.value === 3) {
          await savePricingState();
          successMessage.value = "Pricing saved.";
        }
        activeStep.value = Math.min(totalSteps, activeStep.value + 1);
        if (activeStep.value >= 3) {
          await refreshPreview();
        }
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "This onboarding step could not be completed.");
      } finally {
        stepLoading.value = false;
      }
    }
    async function finishOnboarding() {
      completingOnboarding.value = true;
      pageError.value = "";
      try {
        await saveFinishingStep();
        await savePricingState();
        await completeShopRateCardSetup(currentShopSlug.value);
        await Promise.all([
          fetchMyShops(),
          listShopPapers(currentShopSlug.value),
          fetchShopRateCardSetup(currentShopSlug.value),
          auth.fetchMe()
        ]);
        await navigateTo("/dashboard/production");
      } catch (error) {
        pageError.value = getApiErrorMessage(error, "Printy could not complete onboarding.");
      } finally {
        completingOnboarding.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(RoleDashboardFrame, mergeProps({
        title: "Production Onboarding",
        badge: "Production",
        name: unref(displayName),
        initials: unref(initials),
        subtitle: "Set up your print shop",
        "breadcrumb-root": "Dashboard",
        "nav-items": unref(navItems),
        "support-title": "Need this later?",
        "support-copy": "You can return to onboarding any time to update your shop profile, papers, pricing, and launch state.",
        "support-action": "Open Dashboard",
        "support-to": "/dashboard/production",
        onLogout: ($event) => unref(auth).logout()
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(pageError)) {
              _push2(ssrRenderComponent(BaseAlert, {
                variant: "error",
                title: "Production onboarding could not load.",
                message: unref(pageError)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(isBooting)) {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Loading onboarding",
                subtitle: "Preparing your production setup context."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="p-6"${_scopeId2}>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "soft",
                      padding: "lg",
                      radius: "xl"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<p class="text-sm text-slate-600"${_scopeId3}>Loading shop, paper, pricing, and finishing data...</p>`);
                        } else {
                          return [
                            createVNode("p", { class: "text-sm text-slate-600" }, "Loading shop, paper, pricing, and finishing data...")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "p-6" }, [
                        createVNode(BaseCard, {
                          variant: "soft",
                          padding: "lg",
                          radius: "xl"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "text-sm text-slate-600" }, "Loading shop, paper, pricing, and finishing data...")
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(DashboardSection, {
                title: "Set up your print shop",
                subtitle: "Four guided steps. Stay on one page and keep moving."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="border-b border-slate-100 px-6 py-5"${_scopeId2}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId2}><div${_scopeId2}><p class="text-sm font-bold text-slate-900"${_scopeId2}>Step ${ssrInterpolate(unref(activeStep))} of ${ssrInterpolate(unref(totalSteps))}</p><p class="mt-1 text-sm text-slate-500"${_scopeId2}>${ssrInterpolate(unref(activeStepTitle))}</p></div><div class="flex items-center gap-2"${_scopeId2}><!--[-->`);
                    ssrRenderList(steps, (step) => {
                      _push3(`<div class="${ssrRenderClass([step.value <= unref(activeStep) ? "bg-[#e13515]" : "bg-slate-200", "h-2.5 w-14 rounded-full"])}"${_scopeId2}></div>`);
                    });
                    _push3(`<!--]--></div></div></div><div class="space-y-6 p-6"${_scopeId2}>`);
                    if (unref(successMessage)) {
                      _push3(ssrRenderComponent(BaseAlert, {
                        variant: "success",
                        title: "Saved",
                        message: unref(successMessage)
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" style="${ssrRenderStyle(unref(activeStep) === 1 ? null : { display: "none" })}"${_scopeId2}><div class="space-y-4"${_scopeId2}><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(BaseInput, {
                      modelValue: unref(shopForm).name,
                      "onUpdate:modelValue": ($event) => unref(shopForm).name = $event,
                      label: "Shop name",
                      required: "",
                      error: unref(shopErrors).name,
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseInput, {
                      modelValue: unref(shopForm).phone_number,
                      "onUpdate:modelValue": ($event) => unref(shopForm).phone_number = $event,
                      label: "Phone / WhatsApp",
                      required: "",
                      error: unref(shopErrors).phone_number,
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseInput, {
                      modelValue: unref(shopForm).city,
                      "onUpdate:modelValue": ($event) => unref(shopForm).city = $event,
                      label: "Location / area in Nairobi",
                      required: "",
                      error: unref(shopErrors).city,
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseInput, {
                      modelValue: unref(shopForm).service_area,
                      "onUpdate:modelValue": ($event) => unref(shopForm).service_area = $event,
                      label: "Pickup or delivery area",
                      required: "",
                      error: unref(shopErrors).service_area,
                      variant: "dashboard"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(BaseTextarea, {
                      modelValue: unref(shopForm).description,
                      "onUpdate:modelValue": ($event) => unref(shopForm).description = $event,
                      label: "Short description",
                      variant: "dashboard",
                      maxlength: 200,
                      error: unref(shopErrors).description
                    }, null, _parent3, _scopeId2));
                    _push3(`<div class="rounded-2xl border border-slate-200 bg-white px-4 py-4"${_scopeId2}><div class="space-y-3"${_scopeId2}><div${_scopeId2}><p class="text-sm font-bold text-slate-900"${_scopeId2}>Delivery available?</p><p class="mt-1 text-sm text-slate-500"${_scopeId2}>Tell Printy whether this shop can handle delivery handoff.</p></div><div class="flex flex-wrap gap-4"${_scopeId2}><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(shopForm).offers_delivery, false)) ? " checked" : ""}${ssrRenderAttr("value", false)} type="radio" name="offers_delivery" class="h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"${_scopeId2}> Collection only </label><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(shopForm).offers_delivery, true)) ? " checked" : ""}${ssrRenderAttr("value", true)} type="radio" name="offers_delivery" class="h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"${_scopeId2}> Yes, we deliver </label></div></div></div></div>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "soft",
                      padding: "lg",
                      radius: "xl",
                      class: "space-y-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div${_scopeId3}><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]"${_scopeId3}>Step 1</p><h3 class="mt-2 text-xl font-black text-slate-950"${_scopeId3}>Create the real shop record first.</h3></div><ul class="space-y-3 text-sm text-slate-600"${_scopeId3}><li${_scopeId3}>This saves directly to the production shop endpoint.</li><li${_scopeId3}>The returned shop slug is reused for paper stock and finishing endpoints.</li><li${_scopeId3}>If the user refreshes later, this step rehydrates from the saved shop and current rate-card setup.</li></ul>`);
                        } else {
                          return [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Step 1"),
                              createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Create the real shop record first.")
                            ]),
                            createVNode("ul", { class: "space-y-3 text-sm text-slate-600" }, [
                              createVNode("li", null, "This saves directly to the production shop endpoint."),
                              createVNode("li", null, "The returned shop slug is reused for paper stock and finishing endpoints."),
                              createVNode("li", null, "If the user refreshes later, this step rehydrates from the saved shop and current rate-card setup.")
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="space-y-5" style="${ssrRenderStyle(unref(activeStep) === 2 ? null : { display: "none" })}"${_scopeId2}><div class="flex flex-wrap items-center justify-between gap-3"${_scopeId2}><div${_scopeId2}><p class="text-lg font-bold text-slate-950"${_scopeId2}>Paper stock</p><p class="text-sm text-slate-500"${_scopeId2}>Start with two rows. Each row saves independently, and failures stay inline.</p></div>`);
                    _push3(ssrRenderComponent(BaseButton, {
                      variant: "secondary",
                      size: "sm",
                      disabled: unref(paperRows).length >= 10,
                      onClick: addPaperRow
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Add paper row`);
                        } else {
                          return [
                            createTextVNode("Add paper row")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="space-y-4"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(paperRows), (row) => {
                      _push3(ssrRenderComponent(BaseCard, {
                        key: row.localId,
                        variant: "bordered",
                        padding: "lg",
                        radius: "xl"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5"${_scopeId3}>`);
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.name,
                              "onUpdate:modelValue": ($event) => row.name = $event,
                              label: "Paper name",
                              variant: "dashboard",
                              error: row.errors.name
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(BaseSelect, {
                              modelValue: row.sheet_size,
                              "onUpdate:modelValue": ($event) => row.sheet_size = $event,
                              label: "Size",
                              options: sheetSizeOptions,
                              variant: "dashboard",
                              error: row.errors.sheet_size
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.gsm,
                              "onUpdate:modelValue": ($event) => row.gsm = $event,
                              type: "number",
                              min: "1",
                              label: "GSM",
                              variant: "dashboard",
                              error: row.errors.gsm
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.cost_per_sheet,
                              "onUpdate:modelValue": ($event) => row.cost_per_sheet = $event,
                              type: "number",
                              min: "0",
                              step: "0.01",
                              label: "Cost per sheet (KES)",
                              variant: "dashboard",
                              error: row.errors.cost_per_sheet
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.quantity_in_stock,
                              "onUpdate:modelValue": ($event) => row.quantity_in_stock = $event,
                              type: "number",
                              min: "0",
                              step: "1",
                              label: "Qty in stock",
                              variant: "dashboard",
                              error: row.errors.quantity_in_stock
                            }, null, _parent4, _scopeId3));
                            _push4(`</div><div class="mt-4 flex flex-wrap items-center justify-between gap-3"${_scopeId3}><label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700"${_scopeId3}><input${ssrIncludeBooleanAttr(Array.isArray(row.is_active) ? ssrLooseContain(row.is_active, null) : row.is_active) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"${_scopeId3}> In stock / active </label><div class="flex items-center gap-2"${_scopeId3}>`);
                            if (row.saving) {
                              _push4(`<span class="text-xs font-semibold text-slate-500"${_scopeId3}>Saving...</span>`);
                            } else if (row.saved) {
                              _push4(`<span class="text-xs font-semibold text-green-600"${_scopeId3}>Saved</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(ssrRenderComponent(BaseButton, {
                              variant: "ghost",
                              size: "sm",
                              disabled: unref(paperRows).length <= 1,
                              onClick: ($event) => removePaperRow(row.localId)
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`Remove`);
                                } else {
                                  return [
                                    createTextVNode("Remove")
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(`</div></div>`);
                            if (row.errorMessage) {
                              _push4(ssrRenderComponent(BaseAlert, {
                                class: "mt-4",
                                variant: "error",
                                message: row.errorMessage
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                          } else {
                            return [
                              createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-5" }, [
                                createVNode(BaseInput, {
                                  modelValue: row.name,
                                  "onUpdate:modelValue": ($event) => row.name = $event,
                                  label: "Paper name",
                                  variant: "dashboard",
                                  error: row.errors.name
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseSelect, {
                                  modelValue: row.sheet_size,
                                  "onUpdate:modelValue": ($event) => row.sheet_size = $event,
                                  label: "Size",
                                  options: sheetSizeOptions,
                                  variant: "dashboard",
                                  error: row.errors.sheet_size
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.gsm,
                                  "onUpdate:modelValue": ($event) => row.gsm = $event,
                                  type: "number",
                                  min: "1",
                                  label: "GSM",
                                  variant: "dashboard",
                                  error: row.errors.gsm
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.cost_per_sheet,
                                  "onUpdate:modelValue": ($event) => row.cost_per_sheet = $event,
                                  type: "number",
                                  min: "0",
                                  step: "0.01",
                                  label: "Cost per sheet (KES)",
                                  variant: "dashboard",
                                  error: row.errors.cost_per_sheet
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.quantity_in_stock,
                                  "onUpdate:modelValue": ($event) => row.quantity_in_stock = $event,
                                  type: "number",
                                  min: "0",
                                  step: "1",
                                  label: "Qty in stock",
                                  variant: "dashboard",
                                  error: row.errors.quantity_in_stock
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])
                              ]),
                              createVNode("div", { class: "mt-4 flex flex-wrap items-center justify-between gap-3" }, [
                                createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => row.is_active = $event,
                                    type: "checkbox",
                                    class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelCheckbox, row.is_active]
                                  ]),
                                  createTextVNode(" In stock / active ")
                                ]),
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  row.saving ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-xs font-semibold text-slate-500"
                                  }, "Saving...")) : row.saved ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-xs font-semibold text-green-600"
                                  }, "Saved")) : createCommentVNode("", true),
                                  createVNode(BaseButton, {
                                    variant: "ghost",
                                    size: "sm",
                                    disabled: unref(paperRows).length <= 1,
                                    onClick: ($event) => removePaperRow(row.localId)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Remove")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled", "onClick"])
                                ])
                              ]),
                              row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                key: 0,
                                class: "mt-4",
                                variant: "error",
                                message: row.errorMessage
                              }, null, 8, ["message"])) : createCommentVNode("", true)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div><div class="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]" style="${ssrRenderStyle(unref(activeStep) === 3 ? null : { display: "none" })}"${_scopeId2}><div class="space-y-4"${_scopeId2}><div class="flex items-center justify-between gap-3"${_scopeId2}><div${_scopeId2}><p class="text-lg font-bold text-slate-950"${_scopeId2}>Pricing</p><p class="text-sm text-slate-500"${_scopeId2}>Enable paper types and enter raw production prices. Preview updates automatically.</p><p class="mt-1 text-xs font-medium text-slate-500"${_scopeId2}>Suggested from market defaults - edit to match your shop.</p></div>`);
                    if (unref(previewLoading)) {
                      _push3(`<span class="text-xs font-semibold text-slate-500"${_scopeId2}>Refreshing preview...</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(pricingRows), (row) => {
                      _push3(ssrRenderComponent(BaseCard, {
                        key: row.key || row.id,
                        variant: "bordered",
                        padding: "lg",
                        radius: "xl"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex flex-wrap items-start justify-between gap-4"${_scopeId3}><div${_scopeId3}><p class="text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(row.label || row.paper_name || row.key)}</p><p class="mt-1 text-xs text-slate-500"${_scopeId3}>${ssrInterpolate(row.size || "SRA3/A3")} · ${ssrInterpolate(row.category || row.paper_type || "Paper stock")}</p></div><label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700"${_scopeId3}><input${ssrIncludeBooleanAttr(Array.isArray(row.active) ? ssrLooseContain(row.active, null) : row.active) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"${_scopeId3}> Enable </label></div><div class="mt-4 grid gap-4 md:grid-cols-2"${_scopeId3}>`);
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.single_side_price,
                              "onUpdate:modelValue": ($event) => row.single_side_price = $event,
                              type: "number",
                              min: "0",
                              step: "0.01",
                              label: "Single-sided price (KES)",
                              variant: "dashboard"
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(BaseInput, {
                              modelValue: row.double_side_price,
                              "onUpdate:modelValue": ($event) => row.double_side_price = $event,
                              type: "number",
                              min: "0",
                              step: "0.01",
                              label: "Double-sided price (KES)",
                              variant: "dashboard",
                              disabled: row.double_side_price === null
                            }, null, _parent4, _scopeId3));
                            _push4(`</div>`);
                          } else {
                            return [
                              createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.paper_name || row.key), 1),
                                  createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(row.size || "SRA3/A3") + " · " + toDisplayString(row.category || row.paper_type || "Paper stock"), 1)
                                ]),
                                createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => row.active = $event,
                                    type: "checkbox",
                                    class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelCheckbox, row.active]
                                  ]),
                                  createTextVNode(" Enable ")
                                ])
                              ]),
                              createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                createVNode(BaseInput, {
                                  modelValue: row.single_side_price,
                                  "onUpdate:modelValue": ($event) => row.single_side_price = $event,
                                  type: "number",
                                  min: "0",
                                  step: "0.01",
                                  label: "Single-sided price (KES)",
                                  variant: "dashboard"
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(BaseInput, {
                                  modelValue: row.double_side_price,
                                  "onUpdate:modelValue": ($event) => row.double_side_price = $event,
                                  type: "number",
                                  min: "0",
                                  step: "0.01",
                                  label: "Double-sided price (KES)",
                                  variant: "dashboard",
                                  disabled: row.double_side_price === null
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "soft",
                      padding: "lg",
                      radius: "xl",
                      class: "space-y-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div${_scopeId3}><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]"${_scopeId3}>Trust moment</p><h3 class="mt-2 text-xl font-black text-slate-950"${_scopeId3}>With these prices you can offer:</h3></div>`);
                          if (unref(previewError)) {
                            _push4(ssrRenderComponent(BaseAlert, {
                              variant: "error",
                              message: unref(previewError)
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<div class="space-y-3"${_scopeId3}><!--[-->`);
                            ssrRenderList(unref(capabilityPreviewRows), (product) => {
                              _push4(`<div class="rounded-2xl border border-slate-200 bg-white px-4 py-3"${_scopeId3}><div class="flex items-start justify-between gap-3"${_scopeId3}><div${_scopeId3}><p class="text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(product.label)}</p>`);
                              if (product.detail) {
                                _push4(`<p class="mt-1 text-xs text-slate-500"${_scopeId3}>${ssrInterpolate(product.detail)}</p>`);
                              } else {
                                _push4(`<!---->`);
                              }
                              _push4(`</div><p class="text-sm font-black text-slate-900"${_scopeId3}>${ssrInterpolate(product.priceText)}</p></div></div>`);
                            });
                            _push4(`<!--]-->`);
                            if (unref(exampleQuoteSummary)) {
                              _push4(ssrRenderComponent(BaseAlert, {
                                variant: "default",
                                title: unref(exampleQuoteSummary).title,
                                message: unref(exampleQuoteSummary).message
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            if (!unref(capabilityPreviewRows).length && !unref(previewLoading)) {
                              _push4(ssrRenderComponent(BaseAlert, {
                                variant: "warning",
                                message: "Capability preview is limited until at least one paper price is enabled."
                              }, null, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div>`);
                          }
                        } else {
                          return [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Trust moment"),
                              createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "With these prices you can offer:")
                            ]),
                            unref(previewError) ? (openBlock(), createBlock(BaseAlert, {
                              key: 0,
                              variant: "error",
                              message: unref(previewError)
                            }, null, 8, ["message"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "space-y-3"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                                return openBlock(), createBlock("div", {
                                  key: product.key,
                                  class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                }, [
                                  createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                      product.detail ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        class: "mt-1 text-xs text-slate-500"
                                      }, toDisplayString(product.detail), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("p", { class: "text-sm font-black text-slate-900" }, toDisplayString(product.priceText), 1)
                                  ])
                                ]);
                              }), 128)),
                              unref(exampleQuoteSummary) ? (openBlock(), createBlock(BaseAlert, {
                                key: 0,
                                variant: "default",
                                title: unref(exampleQuoteSummary).title,
                                message: unref(exampleQuoteSummary).message
                              }, null, 8, ["title", "message"])) : createCommentVNode("", true),
                              !unref(capabilityPreviewRows).length && !unref(previewLoading) ? (openBlock(), createBlock(BaseAlert, {
                                key: 1,
                                variant: "warning",
                                message: "Capability preview is limited until at least one paper price is enabled."
                              })) : createCommentVNode("", true)
                            ]))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" style="${ssrRenderStyle(unref(activeStep) === 4 ? null : { display: "none" })}"${_scopeId2}><div class="space-y-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "bordered",
                      padding: "lg",
                      radius: "xl"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<p class="text-sm font-bold text-slate-900"${_scopeId3}>Shop summary</p><div class="mt-3 space-y-2 text-sm text-slate-600"${_scopeId3}><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Shop:</span> ${ssrInterpolate(unref(shopForm).name || "Not saved yet")}</p><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Location:</span> ${ssrInterpolate(unref(shopForm).service_area || unref(shopForm).city || "Not set")}</p><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Papers added:</span> ${ssrInterpolate(unref(savedPaperCount))}</p><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Products enabled:</span> ${ssrInterpolate(unref(activePricingCount))}</p><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Delivery available:</span> ${ssrInterpolate(unref(shopForm).offers_delivery ? "Yes" : "No")}</p></div>`);
                        } else {
                          return [
                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Shop summary"),
                            createVNode("div", { class: "mt-3 space-y-2 text-sm text-slate-600" }, [
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Shop:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).name || "Not saved yet"), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Location:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).service_area || unref(shopForm).city || "Not set"), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Papers added:"),
                                createTextVNode(" " + toDisplayString(unref(savedPaperCount)), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Products enabled:"),
                                createTextVNode(" " + toDisplayString(unref(activePricingCount)), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Delivery available:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).offers_delivery ? "Yes" : "No"), 1)
                              ])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "bordered",
                      padding: "lg",
                      radius: "xl"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<p class="text-sm font-bold text-slate-900"${_scopeId3}>Estimated price range</p><div class="mt-3 space-y-3"${_scopeId3}>`);
                          if (unref(estimatedPriceRangeText)) {
                            _push4(`<div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"${_scopeId3}><p class="text-sm font-black text-slate-950"${_scopeId3}>${ssrInterpolate(unref(estimatedPriceRangeText))}</p><p class="mt-1 text-xs text-slate-500"${_scopeId3}>Derived from the current live preview response.</p></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<!--[-->`);
                          ssrRenderList(unref(capabilityPreviewRows), (product) => {
                            _push4(`<div class="rounded-2xl border border-slate-200 bg-white px-4 py-3"${_scopeId3}><p class="text-sm font-bold text-slate-900"${_scopeId3}>${ssrInterpolate(product.label)}</p><p class="mt-1 text-xs text-slate-500"${_scopeId3}>${ssrInterpolate(product.priceText)}</p></div>`);
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          return [
                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Estimated price range"),
                            createVNode("div", { class: "mt-3 space-y-3" }, [
                              unref(estimatedPriceRangeText) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                              }, [
                                createVNode("p", { class: "text-sm font-black text-slate-950" }, toDisplayString(unref(estimatedPriceRangeText)), 1),
                                createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Derived from the current live preview response.")
                              ])) : createCommentVNode("", true),
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                                return openBlock(), createBlock("div", {
                                  key: `review-${product.key}`,
                                  class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                }, [
                                  createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                  createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(product.priceText), 1)
                                ]);
                              }), 128))
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "bordered",
                      padding: "lg",
                      radius: "xl",
                      class: "space-y-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex items-center justify-between gap-3"${_scopeId3}><div${_scopeId3}><p class="text-sm font-bold text-slate-900"${_scopeId3}>Finishings</p><p class="mt-1 text-xs text-slate-500"${_scopeId3}>Optional but useful for the first capability preview.</p></div></div><div class="space-y-3"${_scopeId3}><!--[-->`);
                          ssrRenderList(unref(finishingRows), (row) => {
                            _push4(ssrRenderComponent(BaseCard, {
                              key: row.key || row.id,
                              variant: "soft",
                              padding: "md",
                              radius: "xl"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex flex-wrap items-start justify-between gap-4"${_scopeId4}><div${_scopeId4}><p class="text-sm font-bold text-slate-900"${_scopeId4}>${ssrInterpolate(row.label || row.name)}</p><p class="mt-1 text-xs text-slate-500"${_scopeId4}>${ssrInterpolate(finishingPricingLabel(row))}</p></div><label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700"${_scopeId4}><input${ssrIncludeBooleanAttr(Array.isArray(row.active) ? ssrLooseContain(row.active, null) : row.active) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"${_scopeId4}> Enable </label></div><div class="mt-4 grid gap-4 md:grid-cols-2"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(BaseInput, {
                                    modelValue: row.price,
                                    "onUpdate:modelValue": ($event) => row.price = $event,
                                    type: "number",
                                    min: "0",
                                    step: "0.01",
                                    label: "Price (KES)",
                                    variant: "dashboard"
                                  }, null, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(BaseSelect, {
                                    modelValue: row.pricing_type,
                                    "onUpdate:modelValue": ($event) => row.pricing_type = $event,
                                    label: "Pricing unit",
                                    options: finishingPricingOptions,
                                    variant: "dashboard"
                                  }, null, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                  if (row.errorMessage) {
                                    _push5(ssrRenderComponent(BaseAlert, {
                                      class: "mt-4",
                                      variant: "error",
                                      message: row.errorMessage
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                } else {
                                  return [
                                    createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.name), 1),
                                        createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(finishingPricingLabel(row)), 1)
                                      ]),
                                      createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => row.active = $event,
                                          type: "checkbox",
                                          class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, row.active]
                                        ]),
                                        createTextVNode(" Enable ")
                                      ])
                                    ]),
                                    createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                      createVNode(BaseInput, {
                                        modelValue: row.price,
                                        "onUpdate:modelValue": ($event) => row.price = $event,
                                        type: "number",
                                        min: "0",
                                        step: "0.01",
                                        label: "Price (KES)",
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(BaseSelect, {
                                        modelValue: row.pricing_type,
                                        "onUpdate:modelValue": ($event) => row.pricing_type = $event,
                                        label: "Pricing unit",
                                        options: finishingPricingOptions,
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                      key: 0,
                                      class: "mt-4",
                                      variant: "error",
                                      message: row.errorMessage
                                    }, null, 8, ["message"])) : createCommentVNode("", true)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Finishings"),
                                createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Optional but useful for the first capability preview.")
                              ])
                            ]),
                            createVNode("div", { class: "space-y-3" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingRows), (row) => {
                                return openBlock(), createBlock(BaseCard, {
                                  key: row.key || row.id,
                                  variant: "soft",
                                  padding: "md",
                                  radius: "xl"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.name), 1),
                                        createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(finishingPricingLabel(row)), 1)
                                      ]),
                                      createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => row.active = $event,
                                          type: "checkbox",
                                          class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, row.active]
                                        ]),
                                        createTextVNode(" Enable ")
                                      ])
                                    ]),
                                    createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                      createVNode(BaseInput, {
                                        modelValue: row.price,
                                        "onUpdate:modelValue": ($event) => row.price = $event,
                                        type: "number",
                                        min: "0",
                                        step: "0.01",
                                        label: "Price (KES)",
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(BaseSelect, {
                                        modelValue: row.pricing_type,
                                        "onUpdate:modelValue": ($event) => row.pricing_type = $event,
                                        label: "Pricing unit",
                                        options: finishingPricingOptions,
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                      key: 0,
                                      class: "mt-4",
                                      variant: "error",
                                      message: row.errorMessage
                                    }, null, 8, ["message"])) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(BaseCard, {
                      variant: "soft",
                      padding: "lg",
                      radius: "xl",
                      class: "space-y-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div${_scopeId3}><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]"${_scopeId3}>Go live</p><h3 class="mt-2 text-xl font-black text-slate-950"${_scopeId3}>Ready to start receiving jobs</h3></div>`);
                          if (unref(setupSummary)) {
                            _push4(`<div class="space-y-2 text-sm text-slate-600"${_scopeId3}><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Products unlocked:</span> ${ssrInterpolate(unref(setupSummary).products_unlocked ?? unref(capabilityPreviewRows).length)}</p><p${_scopeId3}><span class="font-semibold text-slate-800"${_scopeId3}>Pricing items added:</span> ${ssrInterpolate(unref(setupSummary).pricing_items_added ?? unref(activePricingCount))}</p></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(ssrRenderComponent(BaseButton, {
                            block: "",
                            size: "lg",
                            loading: unref(completingOnboarding),
                            onClick: finishOnboarding
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Go live - start receiving jobs`);
                              } else {
                                return [
                                  createTextVNode("Go live - start receiving jobs")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Go live"),
                              createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Ready to start receiving jobs")
                            ]),
                            unref(setupSummary) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "space-y-2 text-sm text-slate-600"
                            }, [
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Products unlocked:"),
                                createTextVNode(" " + toDisplayString(unref(setupSummary).products_unlocked ?? unref(capabilityPreviewRows).length), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Pricing items added:"),
                                createTextVNode(" " + toDisplayString(unref(setupSummary).pricing_items_added ?? unref(activePricingCount)), 1)
                              ])
                            ])) : createCommentVNode("", true),
                            createVNode(BaseButton, {
                              block: "",
                              size: "lg",
                              loading: unref(completingOnboarding),
                              onClick: finishOnboarding
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Go live - start receiving jobs")
                              ]),
                              _: 1
                            }, 8, ["loading"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"${_scopeId2}>`);
                    if (unref(activeStep) > 1) {
                      _push3(ssrRenderComponent(BaseButton, {
                        variant: "secondary",
                        onClick: goBack
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`Back`);
                          } else {
                            return [
                              createTextVNode("Back")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<span${_scopeId2}></span>`);
                    }
                    if (unref(activeStep) < unref(totalSteps)) {
                      _push3(ssrRenderComponent(BaseButton, {
                        loading: unref(stepLoading),
                        onClick: handleContinue
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` Continue `);
                          } else {
                            return [
                              createTextVNode(" Continue ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "border-b border-slate-100 px-6 py-5" }, [
                        createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Step " + toDisplayString(unref(activeStep)) + " of " + toDisplayString(unref(totalSteps)), 1),
                            createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(activeStepTitle)), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(steps, (step) => {
                              return createVNode("div", {
                                key: step.value,
                                class: ["h-2.5 w-14 rounded-full", step.value <= unref(activeStep) ? "bg-[#e13515]" : "bg-slate-200"]
                              }, null, 2);
                            }), 64))
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "space-y-6 p-6" }, [
                        unref(successMessage) ? (openBlock(), createBlock(BaseAlert, {
                          key: 0,
                          variant: "success",
                          title: "Saved",
                          message: unref(successMessage)
                        }, null, 8, ["message"])) : createCommentVNode("", true),
                        withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" }, [
                          createVNode("div", { class: "space-y-4" }, [
                            createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                              createVNode(BaseInput, {
                                modelValue: unref(shopForm).name,
                                "onUpdate:modelValue": ($event) => unref(shopForm).name = $event,
                                label: "Shop name",
                                required: "",
                                error: unref(shopErrors).name,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                              createVNode(BaseInput, {
                                modelValue: unref(shopForm).phone_number,
                                "onUpdate:modelValue": ($event) => unref(shopForm).phone_number = $event,
                                label: "Phone / WhatsApp",
                                required: "",
                                error: unref(shopErrors).phone_number,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                              createVNode(BaseInput, {
                                modelValue: unref(shopForm).city,
                                "onUpdate:modelValue": ($event) => unref(shopForm).city = $event,
                                label: "Location / area in Nairobi",
                                required: "",
                                error: unref(shopErrors).city,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                              createVNode(BaseInput, {
                                modelValue: unref(shopForm).service_area,
                                "onUpdate:modelValue": ($event) => unref(shopForm).service_area = $event,
                                label: "Pickup or delivery area",
                                required: "",
                                error: unref(shopErrors).service_area,
                                variant: "dashboard"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])
                            ]),
                            createVNode(BaseTextarea, {
                              modelValue: unref(shopForm).description,
                              "onUpdate:modelValue": ($event) => unref(shopForm).description = $event,
                              label: "Short description",
                              variant: "dashboard",
                              maxlength: 200,
                              error: unref(shopErrors).description
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                            createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                              createVNode("div", { class: "space-y-3" }, [
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Delivery available?"),
                                  createVNode("p", { class: "mt-1 text-sm text-slate-500" }, "Tell Printy whether this shop can handle delivery handoff.")
                                ]),
                                createVNode("div", { class: "flex flex-wrap gap-4" }, [
                                  createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-semibold text-slate-700" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => unref(shopForm).offers_delivery = $event,
                                      value: false,
                                      type: "radio",
                                      name: "offers_delivery",
                                      class: "h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelRadio, unref(shopForm).offers_delivery]
                                    ]),
                                    createTextVNode(" Collection only ")
                                  ]),
                                  createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-semibold text-slate-700" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => unref(shopForm).offers_delivery = $event,
                                      value: true,
                                      type: "radio",
                                      name: "offers_delivery",
                                      class: "h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelRadio, unref(shopForm).offers_delivery]
                                    ]),
                                    createTextVNode(" Yes, we deliver ")
                                  ])
                                ])
                              ])
                            ])
                          ]),
                          createVNode(BaseCard, {
                            variant: "soft",
                            padding: "lg",
                            radius: "xl",
                            class: "space-y-4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Step 1"),
                                createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Create the real shop record first.")
                              ]),
                              createVNode("ul", { class: "space-y-3 text-sm text-slate-600" }, [
                                createVNode("li", null, "This saves directly to the production shop endpoint."),
                                createVNode("li", null, "The returned shop slug is reused for paper stock and finishing endpoints."),
                                createVNode("li", null, "If the user refreshes later, this step rehydrates from the saved shop and current rate-card setup.")
                              ])
                            ]),
                            _: 1
                          })
                        ], 512), [
                          [vShow, unref(activeStep) === 1]
                        ]),
                        withDirectives(createVNode("div", { class: "space-y-5" }, [
                          createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-lg font-bold text-slate-950" }, "Paper stock"),
                              createVNode("p", { class: "text-sm text-slate-500" }, "Start with two rows. Each row saves independently, and failures stay inline.")
                            ]),
                            createVNode(BaseButton, {
                              variant: "secondary",
                              size: "sm",
                              disabled: unref(paperRows).length >= 10,
                              onClick: addPaperRow
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Add paper row")
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ]),
                          createVNode("div", { class: "space-y-4" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(paperRows), (row) => {
                              return openBlock(), createBlock(BaseCard, {
                                key: row.localId,
                                variant: "bordered",
                                padding: "lg",
                                radius: "xl"
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-5" }, [
                                    createVNode(BaseInput, {
                                      modelValue: row.name,
                                      "onUpdate:modelValue": ($event) => row.name = $event,
                                      label: "Paper name",
                                      variant: "dashboard",
                                      error: row.errors.name
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                    createVNode(BaseSelect, {
                                      modelValue: row.sheet_size,
                                      "onUpdate:modelValue": ($event) => row.sheet_size = $event,
                                      label: "Size",
                                      options: sheetSizeOptions,
                                      variant: "dashboard",
                                      error: row.errors.sheet_size
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                    createVNode(BaseInput, {
                                      modelValue: row.gsm,
                                      "onUpdate:modelValue": ($event) => row.gsm = $event,
                                      type: "number",
                                      min: "1",
                                      label: "GSM",
                                      variant: "dashboard",
                                      error: row.errors.gsm
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                    createVNode(BaseInput, {
                                      modelValue: row.cost_per_sheet,
                                      "onUpdate:modelValue": ($event) => row.cost_per_sheet = $event,
                                      type: "number",
                                      min: "0",
                                      step: "0.01",
                                      label: "Cost per sheet (KES)",
                                      variant: "dashboard",
                                      error: row.errors.cost_per_sheet
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                    createVNode(BaseInput, {
                                      modelValue: row.quantity_in_stock,
                                      "onUpdate:modelValue": ($event) => row.quantity_in_stock = $event,
                                      type: "number",
                                      min: "0",
                                      step: "1",
                                      label: "Qty in stock",
                                      variant: "dashboard",
                                      error: row.errors.quantity_in_stock
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])
                                  ]),
                                  createVNode("div", { class: "mt-4 flex flex-wrap items-center justify-between gap-3" }, [
                                    createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => row.is_active = $event,
                                        type: "checkbox",
                                        class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelCheckbox, row.is_active]
                                      ]),
                                      createTextVNode(" In stock / active ")
                                    ]),
                                    createVNode("div", { class: "flex items-center gap-2" }, [
                                      row.saving ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "text-xs font-semibold text-slate-500"
                                      }, "Saving...")) : row.saved ? (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "text-xs font-semibold text-green-600"
                                      }, "Saved")) : createCommentVNode("", true),
                                      createVNode(BaseButton, {
                                        variant: "ghost",
                                        size: "sm",
                                        disabled: unref(paperRows).length <= 1,
                                        onClick: ($event) => removePaperRow(row.localId)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("Remove")
                                        ]),
                                        _: 1
                                      }, 8, ["disabled", "onClick"])
                                    ])
                                  ]),
                                  row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                    key: 0,
                                    class: "mt-4",
                                    variant: "error",
                                    message: row.errorMessage
                                  }, null, 8, ["message"])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ])
                        ], 512), [
                          [vShow, unref(activeStep) === 2]
                        ]),
                        withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.12fr_0.88fr]" }, [
                          createVNode("div", { class: "space-y-4" }, [
                            createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-lg font-bold text-slate-950" }, "Pricing"),
                                createVNode("p", { class: "text-sm text-slate-500" }, "Enable paper types and enter raw production prices. Preview updates automatically."),
                                createVNode("p", { class: "mt-1 text-xs font-medium text-slate-500" }, "Suggested from market defaults - edit to match your shop.")
                              ]),
                              unref(previewLoading) ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-xs font-semibold text-slate-500"
                              }, "Refreshing preview...")) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-3" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingRows), (row) => {
                                return openBlock(), createBlock(BaseCard, {
                                  key: row.key || row.id,
                                  variant: "bordered",
                                  padding: "lg",
                                  radius: "xl"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.paper_name || row.key), 1),
                                        createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(row.size || "SRA3/A3") + " · " + toDisplayString(row.category || row.paper_type || "Paper stock"), 1)
                                      ]),
                                      createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => row.active = $event,
                                          type: "checkbox",
                                          class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, row.active]
                                        ]),
                                        createTextVNode(" Enable ")
                                      ])
                                    ]),
                                    createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                      createVNode(BaseInput, {
                                        modelValue: row.single_side_price,
                                        "onUpdate:modelValue": ($event) => row.single_side_price = $event,
                                        type: "number",
                                        min: "0",
                                        step: "0.01",
                                        label: "Single-sided price (KES)",
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(BaseInput, {
                                        modelValue: row.double_side_price,
                                        "onUpdate:modelValue": ($event) => row.double_side_price = $event,
                                        type: "number",
                                        min: "0",
                                        step: "0.01",
                                        label: "Double-sided price (KES)",
                                        variant: "dashboard",
                                        disabled: row.double_side_price === null
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ])
                          ]),
                          createVNode(BaseCard, {
                            variant: "soft",
                            padding: "lg",
                            radius: "xl",
                            class: "space-y-4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Trust moment"),
                                createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "With these prices you can offer:")
                              ]),
                              unref(previewError) ? (openBlock(), createBlock(BaseAlert, {
                                key: 0,
                                variant: "error",
                                message: unref(previewError)
                              }, null, 8, ["message"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "space-y-3"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                                  return openBlock(), createBlock("div", {
                                    key: product.key,
                                    class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                  }, [
                                    createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                                      createVNode("div", null, [
                                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                        product.detail ? (openBlock(), createBlock("p", {
                                          key: 0,
                                          class: "mt-1 text-xs text-slate-500"
                                        }, toDisplayString(product.detail), 1)) : createCommentVNode("", true)
                                      ]),
                                      createVNode("p", { class: "text-sm font-black text-slate-900" }, toDisplayString(product.priceText), 1)
                                    ])
                                  ]);
                                }), 128)),
                                unref(exampleQuoteSummary) ? (openBlock(), createBlock(BaseAlert, {
                                  key: 0,
                                  variant: "default",
                                  title: unref(exampleQuoteSummary).title,
                                  message: unref(exampleQuoteSummary).message
                                }, null, 8, ["title", "message"])) : createCommentVNode("", true),
                                !unref(capabilityPreviewRows).length && !unref(previewLoading) ? (openBlock(), createBlock(BaseAlert, {
                                  key: 1,
                                  variant: "warning",
                                  message: "Capability preview is limited until at least one paper price is enabled."
                                })) : createCommentVNode("", true)
                              ]))
                            ]),
                            _: 1
                          })
                        ], 512), [
                          [vShow, unref(activeStep) === 3]
                        ]),
                        withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" }, [
                          createVNode("div", { class: "space-y-4" }, [
                            createVNode(BaseCard, {
                              variant: "bordered",
                              padding: "lg",
                              radius: "xl"
                            }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Shop summary"),
                                createVNode("div", { class: "mt-3 space-y-2 text-sm text-slate-600" }, [
                                  createVNode("p", null, [
                                    createVNode("span", { class: "font-semibold text-slate-800" }, "Shop:"),
                                    createTextVNode(" " + toDisplayString(unref(shopForm).name || "Not saved yet"), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("span", { class: "font-semibold text-slate-800" }, "Location:"),
                                    createTextVNode(" " + toDisplayString(unref(shopForm).service_area || unref(shopForm).city || "Not set"), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("span", { class: "font-semibold text-slate-800" }, "Papers added:"),
                                    createTextVNode(" " + toDisplayString(unref(savedPaperCount)), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("span", { class: "font-semibold text-slate-800" }, "Products enabled:"),
                                    createTextVNode(" " + toDisplayString(unref(activePricingCount)), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("span", { class: "font-semibold text-slate-800" }, "Delivery available:"),
                                    createTextVNode(" " + toDisplayString(unref(shopForm).offers_delivery ? "Yes" : "No"), 1)
                                  ])
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(BaseCard, {
                              variant: "bordered",
                              padding: "lg",
                              radius: "xl"
                            }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Estimated price range"),
                                createVNode("div", { class: "mt-3 space-y-3" }, [
                                  unref(estimatedPriceRangeText) ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                                  }, [
                                    createVNode("p", { class: "text-sm font-black text-slate-950" }, toDisplayString(unref(estimatedPriceRangeText)), 1),
                                    createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Derived from the current live preview response.")
                                  ])) : createCommentVNode("", true),
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                                    return openBlock(), createBlock("div", {
                                      key: `review-${product.key}`,
                                      class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                    }, [
                                      createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                      createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(product.priceText), 1)
                                    ]);
                                  }), 128))
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(BaseCard, {
                              variant: "bordered",
                              padding: "lg",
                              radius: "xl",
                              class: "space-y-4"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Finishings"),
                                    createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Optional but useful for the first capability preview.")
                                  ])
                                ]),
                                createVNode("div", { class: "space-y-3" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingRows), (row) => {
                                    return openBlock(), createBlock(BaseCard, {
                                      key: row.key || row.id,
                                      variant: "soft",
                                      padding: "md",
                                      radius: "xl"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                          createVNode("div", null, [
                                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.name), 1),
                                            createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(finishingPricingLabel(row)), 1)
                                          ]),
                                          createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                            withDirectives(createVNode("input", {
                                              "onUpdate:modelValue": ($event) => row.active = $event,
                                              type: "checkbox",
                                              class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                            }, null, 8, ["onUpdate:modelValue"]), [
                                              [vModelCheckbox, row.active]
                                            ]),
                                            createTextVNode(" Enable ")
                                          ])
                                        ]),
                                        createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                          createVNode(BaseInput, {
                                            modelValue: row.price,
                                            "onUpdate:modelValue": ($event) => row.price = $event,
                                            type: "number",
                                            min: "0",
                                            step: "0.01",
                                            label: "Price (KES)",
                                            variant: "dashboard"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                          createVNode(BaseSelect, {
                                            modelValue: row.pricing_type,
                                            "onUpdate:modelValue": ($event) => row.pricing_type = $event,
                                            label: "Pricing unit",
                                            options: finishingPricingOptions,
                                            variant: "dashboard"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                          key: 0,
                                          class: "mt-4",
                                          variant: "error",
                                          message: row.errorMessage
                                        }, null, 8, ["message"])) : createCommentVNode("", true)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          createVNode(BaseCard, {
                            variant: "soft",
                            padding: "lg",
                            radius: "xl",
                            class: "space-y-4"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Go live"),
                                createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Ready to start receiving jobs")
                              ]),
                              unref(setupSummary) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "space-y-2 text-sm text-slate-600"
                              }, [
                                createVNode("p", null, [
                                  createVNode("span", { class: "font-semibold text-slate-800" }, "Products unlocked:"),
                                  createTextVNode(" " + toDisplayString(unref(setupSummary).products_unlocked ?? unref(capabilityPreviewRows).length), 1)
                                ]),
                                createVNode("p", null, [
                                  createVNode("span", { class: "font-semibold text-slate-800" }, "Pricing items added:"),
                                  createTextVNode(" " + toDisplayString(unref(setupSummary).pricing_items_added ?? unref(activePricingCount)), 1)
                                ])
                              ])) : createCommentVNode("", true),
                              createVNode(BaseButton, {
                                block: "",
                                size: "lg",
                                loading: unref(completingOnboarding),
                                onClick: finishOnboarding
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Go live - start receiving jobs")
                                ]),
                                _: 1
                              }, 8, ["loading"])
                            ]),
                            _: 1
                          })
                        ], 512), [
                          [vShow, unref(activeStep) === 4]
                        ]),
                        createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4" }, [
                          unref(activeStep) > 1 ? (openBlock(), createBlock(BaseButton, {
                            key: 0,
                            variant: "secondary",
                            onClick: goBack
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Back")
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock("span", { key: 1 })),
                          unref(activeStep) < unref(totalSteps) ? (openBlock(), createBlock(BaseButton, {
                            key: 2,
                            loading: unref(stepLoading),
                            onClick: handleContinue
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Continue ")
                            ]),
                            _: 1
                          }, 8, ["loading"])) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(pageError) ? (openBlock(), createBlock(BaseAlert, {
                key: 0,
                variant: "error",
                title: "Production onboarding could not load.",
                message: unref(pageError)
              }, null, 8, ["message"])) : createCommentVNode("", true),
              unref(isBooting) ? (openBlock(), createBlock(DashboardSection, {
                key: 1,
                title: "Loading onboarding",
                subtitle: "Preparing your production setup context."
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "p-6" }, [
                    createVNode(BaseCard, {
                      variant: "soft",
                      padding: "lg",
                      radius: "xl"
                    }, {
                      default: withCtx(() => [
                        createVNode("p", { class: "text-sm text-slate-600" }, "Loading shop, paper, pricing, and finishing data...")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })) : (openBlock(), createBlock(DashboardSection, {
                key: 2,
                title: "Set up your print shop",
                subtitle: "Four guided steps. Stay on one page and keep moving."
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "border-b border-slate-100 px-6 py-5" }, [
                    createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Step " + toDisplayString(unref(activeStep)) + " of " + toDisplayString(unref(totalSteps)), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-500" }, toDisplayString(unref(activeStepTitle)), 1)
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(steps, (step) => {
                          return createVNode("div", {
                            key: step.value,
                            class: ["h-2.5 w-14 rounded-full", step.value <= unref(activeStep) ? "bg-[#e13515]" : "bg-slate-200"]
                          }, null, 2);
                        }), 64))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "space-y-6 p-6" }, [
                    unref(successMessage) ? (openBlock(), createBlock(BaseAlert, {
                      key: 0,
                      variant: "success",
                      title: "Saved",
                      message: unref(successMessage)
                    }, null, 8, ["message"])) : createCommentVNode("", true),
                    withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" }, [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode(BaseInput, {
                            modelValue: unref(shopForm).name,
                            "onUpdate:modelValue": ($event) => unref(shopForm).name = $event,
                            label: "Shop name",
                            required: "",
                            error: unref(shopErrors).name,
                            variant: "dashboard"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                          createVNode(BaseInput, {
                            modelValue: unref(shopForm).phone_number,
                            "onUpdate:modelValue": ($event) => unref(shopForm).phone_number = $event,
                            label: "Phone / WhatsApp",
                            required: "",
                            error: unref(shopErrors).phone_number,
                            variant: "dashboard"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                          createVNode(BaseInput, {
                            modelValue: unref(shopForm).city,
                            "onUpdate:modelValue": ($event) => unref(shopForm).city = $event,
                            label: "Location / area in Nairobi",
                            required: "",
                            error: unref(shopErrors).city,
                            variant: "dashboard"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                          createVNode(BaseInput, {
                            modelValue: unref(shopForm).service_area,
                            "onUpdate:modelValue": ($event) => unref(shopForm).service_area = $event,
                            label: "Pickup or delivery area",
                            required: "",
                            error: unref(shopErrors).service_area,
                            variant: "dashboard"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])
                        ]),
                        createVNode(BaseTextarea, {
                          modelValue: unref(shopForm).description,
                          "onUpdate:modelValue": ($event) => unref(shopForm).description = $event,
                          label: "Short description",
                          variant: "dashboard",
                          maxlength: 200,
                          error: unref(shopErrors).description
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                        createVNode("div", { class: "rounded-2xl border border-slate-200 bg-white px-4 py-4" }, [
                          createVNode("div", { class: "space-y-3" }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Delivery available?"),
                              createVNode("p", { class: "mt-1 text-sm text-slate-500" }, "Tell Printy whether this shop can handle delivery handoff.")
                            ]),
                            createVNode("div", { class: "flex flex-wrap gap-4" }, [
                              createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-semibold text-slate-700" }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(shopForm).offers_delivery = $event,
                                  value: false,
                                  type: "radio",
                                  name: "offers_delivery",
                                  class: "h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vModelRadio, unref(shopForm).offers_delivery]
                                ]),
                                createTextVNode(" Collection only ")
                              ]),
                              createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-semibold text-slate-700" }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(shopForm).offers_delivery = $event,
                                  value: true,
                                  type: "radio",
                                  name: "offers_delivery",
                                  class: "h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vModelRadio, unref(shopForm).offers_delivery]
                                ]),
                                createTextVNode(" Yes, we deliver ")
                              ])
                            ])
                          ])
                        ])
                      ]),
                      createVNode(BaseCard, {
                        variant: "soft",
                        padding: "lg",
                        radius: "xl",
                        class: "space-y-4"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Step 1"),
                            createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Create the real shop record first.")
                          ]),
                          createVNode("ul", { class: "space-y-3 text-sm text-slate-600" }, [
                            createVNode("li", null, "This saves directly to the production shop endpoint."),
                            createVNode("li", null, "The returned shop slug is reused for paper stock and finishing endpoints."),
                            createVNode("li", null, "If the user refreshes later, this step rehydrates from the saved shop and current rate-card setup.")
                          ])
                        ]),
                        _: 1
                      })
                    ], 512), [
                      [vShow, unref(activeStep) === 1]
                    ]),
                    withDirectives(createVNode("div", { class: "space-y-5" }, [
                      createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-lg font-bold text-slate-950" }, "Paper stock"),
                          createVNode("p", { class: "text-sm text-slate-500" }, "Start with two rows. Each row saves independently, and failures stay inline.")
                        ]),
                        createVNode(BaseButton, {
                          variant: "secondary",
                          size: "sm",
                          disabled: unref(paperRows).length >= 10,
                          onClick: addPaperRow
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Add paper row")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      createVNode("div", { class: "space-y-4" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(paperRows), (row) => {
                          return openBlock(), createBlock(BaseCard, {
                            key: row.localId,
                            variant: "bordered",
                            padding: "lg",
                            radius: "xl"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-5" }, [
                                createVNode(BaseInput, {
                                  modelValue: row.name,
                                  "onUpdate:modelValue": ($event) => row.name = $event,
                                  label: "Paper name",
                                  variant: "dashboard",
                                  error: row.errors.name
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseSelect, {
                                  modelValue: row.sheet_size,
                                  "onUpdate:modelValue": ($event) => row.sheet_size = $event,
                                  label: "Size",
                                  options: sheetSizeOptions,
                                  variant: "dashboard",
                                  error: row.errors.sheet_size
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.gsm,
                                  "onUpdate:modelValue": ($event) => row.gsm = $event,
                                  type: "number",
                                  min: "1",
                                  label: "GSM",
                                  variant: "dashboard",
                                  error: row.errors.gsm
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.cost_per_sheet,
                                  "onUpdate:modelValue": ($event) => row.cost_per_sheet = $event,
                                  type: "number",
                                  min: "0",
                                  step: "0.01",
                                  label: "Cost per sheet (KES)",
                                  variant: "dashboard",
                                  error: row.errors.cost_per_sheet
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"]),
                                createVNode(BaseInput, {
                                  modelValue: row.quantity_in_stock,
                                  "onUpdate:modelValue": ($event) => row.quantity_in_stock = $event,
                                  type: "number",
                                  min: "0",
                                  step: "1",
                                  label: "Qty in stock",
                                  variant: "dashboard",
                                  error: row.errors.quantity_in_stock
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "error"])
                              ]),
                              createVNode("div", { class: "mt-4 flex flex-wrap items-center justify-between gap-3" }, [
                                createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                  withDirectives(createVNode("input", {
                                    "onUpdate:modelValue": ($event) => row.is_active = $event,
                                    type: "checkbox",
                                    class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelCheckbox, row.is_active]
                                  ]),
                                  createTextVNode(" In stock / active ")
                                ]),
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  row.saving ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "text-xs font-semibold text-slate-500"
                                  }, "Saving...")) : row.saved ? (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "text-xs font-semibold text-green-600"
                                  }, "Saved")) : createCommentVNode("", true),
                                  createVNode(BaseButton, {
                                    variant: "ghost",
                                    size: "sm",
                                    disabled: unref(paperRows).length <= 1,
                                    onClick: ($event) => removePaperRow(row.localId)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Remove")
                                    ]),
                                    _: 1
                                  }, 8, ["disabled", "onClick"])
                                ])
                              ]),
                              row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                key: 0,
                                class: "mt-4",
                                variant: "error",
                                message: row.errorMessage
                              }, null, 8, ["message"])) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])
                    ], 512), [
                      [vShow, unref(activeStep) === 2]
                    ]),
                    withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.12fr_0.88fr]" }, [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-lg font-bold text-slate-950" }, "Pricing"),
                            createVNode("p", { class: "text-sm text-slate-500" }, "Enable paper types and enter raw production prices. Preview updates automatically."),
                            createVNode("p", { class: "mt-1 text-xs font-medium text-slate-500" }, "Suggested from market defaults - edit to match your shop.")
                          ]),
                          unref(previewLoading) ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs font-semibold text-slate-500"
                          }, "Refreshing preview...")) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "space-y-3" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingRows), (row) => {
                            return openBlock(), createBlock(BaseCard, {
                              key: row.key || row.id,
                              variant: "bordered",
                              padding: "lg",
                              radius: "xl"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.paper_name || row.key), 1),
                                    createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(row.size || "SRA3/A3") + " · " + toDisplayString(row.category || row.paper_type || "Paper stock"), 1)
                                  ]),
                                  createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => row.active = $event,
                                      type: "checkbox",
                                      class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelCheckbox, row.active]
                                    ]),
                                    createTextVNode(" Enable ")
                                  ])
                                ]),
                                createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                  createVNode(BaseInput, {
                                    modelValue: row.single_side_price,
                                    "onUpdate:modelValue": ($event) => row.single_side_price = $event,
                                    type: "number",
                                    min: "0",
                                    step: "0.01",
                                    label: "Single-sided price (KES)",
                                    variant: "dashboard"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                  createVNode(BaseInput, {
                                    modelValue: row.double_side_price,
                                    "onUpdate:modelValue": ($event) => row.double_side_price = $event,
                                    type: "number",
                                    min: "0",
                                    step: "0.01",
                                    label: "Double-sided price (KES)",
                                    variant: "dashboard",
                                    disabled: row.double_side_price === null
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                                ])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])
                      ]),
                      createVNode(BaseCard, {
                        variant: "soft",
                        padding: "lg",
                        radius: "xl",
                        class: "space-y-4"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Trust moment"),
                            createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "With these prices you can offer:")
                          ]),
                          unref(previewError) ? (openBlock(), createBlock(BaseAlert, {
                            key: 0,
                            variant: "error",
                            message: unref(previewError)
                          }, null, 8, ["message"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "space-y-3"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                              return openBlock(), createBlock("div", {
                                key: product.key,
                                class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                              }, [
                                createVNode("div", { class: "flex items-start justify-between gap-3" }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                    product.detail ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      class: "mt-1 text-xs text-slate-500"
                                    }, toDisplayString(product.detail), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("p", { class: "text-sm font-black text-slate-900" }, toDisplayString(product.priceText), 1)
                                ])
                              ]);
                            }), 128)),
                            unref(exampleQuoteSummary) ? (openBlock(), createBlock(BaseAlert, {
                              key: 0,
                              variant: "default",
                              title: unref(exampleQuoteSummary).title,
                              message: unref(exampleQuoteSummary).message
                            }, null, 8, ["title", "message"])) : createCommentVNode("", true),
                            !unref(capabilityPreviewRows).length && !unref(previewLoading) ? (openBlock(), createBlock(BaseAlert, {
                              key: 1,
                              variant: "warning",
                              message: "Capability preview is limited until at least one paper price is enabled."
                            })) : createCommentVNode("", true)
                          ]))
                        ]),
                        _: 1
                      })
                    ], 512), [
                      [vShow, unref(activeStep) === 3]
                    ]),
                    withDirectives(createVNode("div", { class: "grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" }, [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode(BaseCard, {
                          variant: "bordered",
                          padding: "lg",
                          radius: "xl"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Shop summary"),
                            createVNode("div", { class: "mt-3 space-y-2 text-sm text-slate-600" }, [
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Shop:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).name || "Not saved yet"), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Location:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).service_area || unref(shopForm).city || "Not set"), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Papers added:"),
                                createTextVNode(" " + toDisplayString(unref(savedPaperCount)), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Products enabled:"),
                                createTextVNode(" " + toDisplayString(unref(activePricingCount)), 1)
                              ]),
                              createVNode("p", null, [
                                createVNode("span", { class: "font-semibold text-slate-800" }, "Delivery available:"),
                                createTextVNode(" " + toDisplayString(unref(shopForm).offers_delivery ? "Yes" : "No"), 1)
                              ])
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(BaseCard, {
                          variant: "bordered",
                          padding: "lg",
                          radius: "xl"
                        }, {
                          default: withCtx(() => [
                            createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Estimated price range"),
                            createVNode("div", { class: "mt-3 space-y-3" }, [
                              unref(estimatedPriceRangeText) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                              }, [
                                createVNode("p", { class: "text-sm font-black text-slate-950" }, toDisplayString(unref(estimatedPriceRangeText)), 1),
                                createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Derived from the current live preview response.")
                              ])) : createCommentVNode("", true),
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(capabilityPreviewRows), (product) => {
                                return openBlock(), createBlock("div", {
                                  key: `review-${product.key}`,
                                  class: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
                                }, [
                                  createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(product.label), 1),
                                  createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(product.priceText), 1)
                                ]);
                              }), 128))
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(BaseCard, {
                          variant: "bordered",
                          padding: "lg",
                          radius: "xl",
                          class: "space-y-4"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                              createVNode("div", null, [
                                createVNode("p", { class: "text-sm font-bold text-slate-900" }, "Finishings"),
                                createVNode("p", { class: "mt-1 text-xs text-slate-500" }, "Optional but useful for the first capability preview.")
                              ])
                            ]),
                            createVNode("div", { class: "space-y-3" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingRows), (row) => {
                                return openBlock(), createBlock(BaseCard, {
                                  key: row.key || row.id,
                                  variant: "soft",
                                  padding: "md",
                                  radius: "xl"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex flex-wrap items-start justify-between gap-4" }, [
                                      createVNode("div", null, [
                                        createVNode("p", { class: "text-sm font-bold text-slate-900" }, toDisplayString(row.label || row.name), 1),
                                        createVNode("p", { class: "mt-1 text-xs text-slate-500" }, toDisplayString(finishingPricingLabel(row)), 1)
                                      ]),
                                      createVNode("label", { class: "inline-flex items-center gap-2 text-sm font-medium text-slate-700" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => row.active = $event,
                                          type: "checkbox",
                                          class: "h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, row.active]
                                        ]),
                                        createTextVNode(" Enable ")
                                      ])
                                    ]),
                                    createVNode("div", { class: "mt-4 grid gap-4 md:grid-cols-2" }, [
                                      createVNode(BaseInput, {
                                        modelValue: row.price,
                                        "onUpdate:modelValue": ($event) => row.price = $event,
                                        type: "number",
                                        min: "0",
                                        step: "0.01",
                                        label: "Price (KES)",
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                      createVNode(BaseSelect, {
                                        modelValue: row.pricing_type,
                                        "onUpdate:modelValue": ($event) => row.pricing_type = $event,
                                        label: "Pricing unit",
                                        options: finishingPricingOptions,
                                        variant: "dashboard"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    row.errorMessage ? (openBlock(), createBlock(BaseAlert, {
                                      key: 0,
                                      class: "mt-4",
                                      variant: "error",
                                      message: row.errorMessage
                                    }, null, 8, ["message"])) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(BaseCard, {
                        variant: "soft",
                        padding: "lg",
                        radius: "xl",
                        class: "space-y-4"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]" }, "Go live"),
                            createVNode("h3", { class: "mt-2 text-xl font-black text-slate-950" }, "Ready to start receiving jobs")
                          ]),
                          unref(setupSummary) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "space-y-2 text-sm text-slate-600"
                          }, [
                            createVNode("p", null, [
                              createVNode("span", { class: "font-semibold text-slate-800" }, "Products unlocked:"),
                              createTextVNode(" " + toDisplayString(unref(setupSummary).products_unlocked ?? unref(capabilityPreviewRows).length), 1)
                            ]),
                            createVNode("p", null, [
                              createVNode("span", { class: "font-semibold text-slate-800" }, "Pricing items added:"),
                              createTextVNode(" " + toDisplayString(unref(setupSummary).pricing_items_added ?? unref(activePricingCount)), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode(BaseButton, {
                            block: "",
                            size: "lg",
                            loading: unref(completingOnboarding),
                            onClick: finishOnboarding
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Go live - start receiving jobs")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ]),
                        _: 1
                      })
                    ], 512), [
                      [vShow, unref(activeStep) === 4]
                    ]),
                    createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4" }, [
                      unref(activeStep) > 1 ? (openBlock(), createBlock(BaseButton, {
                        key: 0,
                        variant: "secondary",
                        onClick: goBack
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Back")
                        ]),
                        _: 1
                      })) : (openBlock(), createBlock("span", { key: 1 })),
                      unref(activeStep) < unref(totalSteps) ? (openBlock(), createBlock(BaseButton, {
                        key: 2,
                        loading: unref(stepLoading),
                        onClick: handleContinue
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Continue ")
                        ]),
                        _: 1
                      }, 8, ["loading"])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/production/onboarding.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=onboarding-JgJ8Trg3.mjs.map
