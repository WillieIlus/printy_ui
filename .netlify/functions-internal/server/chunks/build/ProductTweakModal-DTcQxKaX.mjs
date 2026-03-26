import { _ as __nuxt_component_0, a as __nuxt_component_7, b as __nuxt_component_1 } from './QuoteConfigSection-2YjsyAVn.mjs';
import { j as useToast, c as useAuthStore, i as useApi, l as usePublicApiNoAuth, a as _sfc_main$f, d as _sfc_main$9, A as API, e as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-DRRvJchD.mjs';
import { _ as _sfc_main$2 } from './Checkbox-S5HrhTVg.mjs';
import { _ as _sfc_main$3 } from './Textarea-C3ixaFu9.mjs';
import { defineComponent, computed, ref, useModel, reactive, watch, nextTick, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, Fragment, renderList, vModelRadio, withModifiers, mergeModels, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { c as calculateGalleryProductPrice } from './gallery-BkPMGgTl.mjs';
import { a as formatKES } from './formatters-r_qbKRfS.mjs';

function useProductPriceDisplay() {
  function priceDisplay(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    if (est?.price_display) return est.price_display;
    if (hint?.price_display) return hint.price_display;
    if (est?.lowest?.total) return `From ${formatKES(est.lowest.total)}`;
    if (hint?.min_price != null) return `From ${formatKES(hint.min_price)}`;
    return "Price on request";
  }
  function priceDisplaySummary(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    const src = est ?? hint;
    if (!src?.can_calculate) return null;
    const qty = src.quantity_used ?? product.min_quantity ?? 1;
    const totalLow = src.total_low ?? src.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null);
    const totalHigh = src.total_high ?? src.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null);
    const perLow = src.per_unit_low ?? (totalLow != null && qty ? totalLow / qty : null);
    const perHigh = src.per_unit_high ?? (totalHigh != null && qty ? totalHigh / qty : null);
    const unitLabel = src.unit_label ?? "per item";
    if (totalLow == null) return null;
    const totalLine = totalHigh != null && Math.abs((totalHigh ?? 0) - totalLow) >= 0.01 ? `${formatKES(totalLow)} – ${formatKES(totalHigh)}` : formatKES(totalLow);
    const perUnitLine = perLow != null ? perHigh != null && Math.abs(perHigh - perLow) >= 0.01 ? `${formatKES(perLow)} – ${formatKES(perHigh)} ${unitLabel}` : `${formatKES(perLow)} ${unitLabel}` : "";
    const totalWithQty = qty > 1 ? `${totalLine} (${qty} pcs)` : totalLine;
    return { totalLine: totalWithQty, perUnitLine };
  }
  function tweakPriceDisplaySummary(product, form, finishingRates = []) {
    const hint = product.price_hint;
    const est = product.price_range_est;
    const src = est ?? hint;
    if (!src?.can_calculate) return null;
    const defaultQty = src.quantity_used ?? product.min_quantity ?? 100;
    const totalLow = src.total_low ?? src.min_price ?? (est?.lowest?.total ? parseFloat(est.lowest.total) : null);
    const totalHigh = src.total_high ?? src.max_price ?? (est?.highest?.total ? parseFloat(est.highest.total) : null);
    const baseTotal = totalLow ?? totalHigh ?? 0;
    if (baseTotal <= 0) return null;
    let total = baseTotal * (form.quantity / defaultQty);
    if (form.sides === "DUPLEX" && product.default_sides !== "DUPLEX") {
      total *= 1.4;
    }
    for (const f of form.finishings) {
      const rate = finishingRates.find((r) => r.id === f.finishing_rate);
      if (rate) {
        const price = parseFloat(rate.price) || 0;
        if (rate.charge_unit === "FLAT") {
          total += price;
        } else {
          total += price * form.quantity;
        }
      }
    }
    const rounded = Math.round(total);
    const perUnit = form.quantity > 0 ? Math.round(total / form.quantity * 100) / 100 : 0;
    return {
      totalLine: formatKES(rounded),
      perUnitLine: `${formatKES(perUnit)} per item`
    };
  }
  function priceDiagnostics(product) {
    const est = product.price_range_est;
    const hint = product.price_hint;
    const src = est ?? hint;
    if (!src || src.can_calculate) return null;
    return {
      reason: src.reason,
      missingFields: src.missing_fields,
      suggestions: src.suggestions
    };
  }
  return { priceDisplay, priceDisplaySummary, tweakPriceDisplaySummary, priceDiagnostics };
}
function getMediaUrl(path, baseUrl = "") {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}
function useMediaUrl() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
  return (path) => getMediaUrl(path, baseUrl);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductTweakModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    product: {},
    shopSlug: {},
    shopName: {}
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["added"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { priceDisplaySummary } = useProductPriceDisplay();
    const toast = useToast();
    const authStore = useAuthStore();
    const guestStore = useGuestQuoteStore();
    const quoteDraftStore = useQuoteDraftStore();
    const shopApi = useApi();
    const publicApiNoAuth = usePublicApiNoAuth();
    const getMediaUrl2 = useMediaUrl();
    const hasAllRequiredOptions = computed(() => {
      if (props.product.pricing_mode === "SHEET" && papers.value.length > 0 && !form.paper) return false;
      if (props.product.pricing_mode === "SHEET" && machines.value.length > 0 && !form.machine) return false;
      if (props.product.pricing_mode === "LARGE_FORMAT" && materials.value.length > 0 && !form.material) return false;
      return true;
    });
    const needsMachineWarning = computed(
      () => props.product.pricing_mode === "SHEET" && machines.value.length > 0 && !form.machine
    );
    const backendPriceResult = ref(null);
    const backendPriceLoading = ref(false);
    const tweakPriceSummary = computed(() => {
      if (hasAllRequiredOptions.value && backendPriceResult.value?.can_calculate) {
        const total = backendPriceResult.value.total ?? backendPriceResult.value.breakdown?.total ?? 0;
        const perUnit = backendPriceResult.value.per_unit ?? (total && form.quantity ? total / form.quantity : 0);
        return {
          totalLine: formatKES(total),
          perUnitLine: perUnit ? `${formatKES(perUnit)} per item` : ""
        };
      }
      return priceDisplaySummary(props.product);
    });
    const emit = __emit;
    const isOpen = useModel(__props, "modelValue");
    const submitting = ref(false);
    const successMessage = ref("");
    const loading = ref(false);
    const loadError = ref("");
    const papers = ref([]);
    const materials = ref([]);
    const finishingRates = ref([]);
    const machines = ref([]);
    const minQty = computed(() => props.product.min_quantity || 100);
    const imageUrl = computed(() => {
      const path = props.product.primary_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl2(path);
    });
    const form = reactive({
      quantity: minQty.value,
      sides: props.product.default_sides || "SIMPLEX",
      color_mode: "COLOR",
      paper: null,
      material: null,
      machine: null,
      finishings: [],
      special_instructions: ""
    });
    const selectedPaperLabel = computed(() => {
      if (!form.paper) return null;
      const p = papers.value.find((x) => x.id === form.paper);
      return p ? `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}` : null;
    });
    const selectedMaterialLabel = computed(() => {
      if (!form.material) return null;
      const m = materials.value.find((x) => x.id === form.material);
      return m ? m.material_type ?? m.name ?? "" : null;
    });
    const selectedFinishingLabels = computed(() => {
      return form.finishings.map((f) => finishingRates.value.find((r) => r.id === f.finishing_rate)?.name).filter(Boolean);
    });
    const needsPaperOrFinishing = computed(() => {
      if (props.product.pricing_mode === "SHEET" && papers.value.length && !form.paper) return true;
      if (props.product.pricing_mode === "LARGE_FORMAT" && materials.value.length && !form.material) return true;
      if (finishingRates.value.length && !form.finishings.length) return true;
      return false;
    });
    function toggleFinishing(id, checked) {
      const fr = finishingRates.value.find((r) => r.id === id);
      const defaultApply = fr?.charge_unit === "PER_SIDE_PER_SHEET" ? "BOTH" : void 0;
      if (checked) {
        form.finishings.push({ finishing_rate: id, ...defaultApply ? { apply_to_sides: defaultApply } : {} });
      } else {
        form.finishings = form.finishings.filter((f) => f.finishing_rate !== id);
      }
    }
    function getFinishingApplyToSides(finishingRateId) {
      const f = form.finishings.find((x) => x.finishing_rate === finishingRateId);
      const v = f?.apply_to_sides ?? "BOTH";
      if (v === "BOTH") return form.sides === "DUPLEX" ? "DOUBLE" : "SINGLE";
      return v;
    }
    function setFinishingApplyToSides(finishingRateId, apply) {
      const f = form.finishings.find((x) => x.finishing_rate === finishingRateId);
      if (f) f.apply_to_sides = apply;
    }
    function resetForm() {
      form.quantity = minQty.value;
      form.sides = props.product.default_sides || "SIMPLEX";
      form.color_mode = "COLOR";
      form.paper = null;
      form.material = null;
      form.machine = null;
      form.special_instructions = "";
      const defaultFinishings = (props.product.finishing_options ?? []).filter((o) => o.is_default).map((o) => ({ finishing_rate: o.finishing_rate, apply_to_sides: "BOTH" }));
      form.finishings = defaultFinishings;
      successMessage.value = "";
    }
    async function loadShopData() {
      const slug = props.shopSlug;
      const productId = props.product?.id;
      if (!slug && !productId) {
        loadError.value = "No shop or product selected.";
        return;
      }
      loading.value = true;
      loadError.value = "";
      if (productId) {
        try {
          const opts = await publicApiNoAuth(API.publicProductOptions(productId));
          papers.value = (opts.available_papers ?? []).map((p) => ({
            id: p.id,
            shop: 0,
            sheet_size: p.sheet_size,
            gsm: p.gsm,
            paper_type: p.paper_type,
            selling_price: p.selling_price,
            buying_price: "0",
            is_active: true
          }));
          materials.value = (opts.available_materials ?? []).map((m) => ({
            id: m.id,
            material_type: m.material_type,
            name: m.material_type,
            unit: m.unit,
            selling_price: m.selling_price,
            is_active: true
          }));
          finishingRates.value = (opts.available_finishings ?? []).map((f) => ({
            id: f.id,
            name: f.name,
            price: f.price,
            charge_unit: f.charge_unit ?? "PER_PIECE",
            is_active: true
          }));
          machines.value = opts.available_machines ?? [];
          const defaultMachineId = opts.default_machine ?? opts.default_machine_id;
          if (defaultMachineId && machines.value.some((m) => m.id === defaultMachineId)) {
            form.machine = defaultMachineId;
          } else if (machines.value.length === 1) {
            form.machine = machines.value[0].id;
          }
        } catch (err) {
          const msg = err && typeof err === "object" && "data" in err ? err.data?.message : err instanceof Error ? err.message : "Unknown error loading product options.";
          loadError.value = msg || "Could not load product options.";
        } finally {
          loading.value = false;
          return;
        }
      }
      if (!slug) {
        loadError.value = "No shop selected.";
        loading.value = false;
        return;
      }
      try {
        const [papersData, finishData, materialsData, machinesData] = await Promise.all([
          shopApi(API.shopPapers(slug)),
          shopApi(API.shopFinishingRates(slug)),
          shopApi(API.shopMaterials(slug)),
          shopApi(API.shopMachines(slug)).catch(() => [])
        ]);
        papers.value = extractArray(papersData);
        finishingRates.value = extractArray(finishData);
        materials.value = extractArray(materialsData);
        machines.value = extractArray(machinesData);
      } catch (err) {
        papers.value = [];
        finishingRates.value = [];
        materials.value = [];
        const msg = err && typeof err === "object" && "data" in err ? err.data?.message : err instanceof Error ? err.message : "Could not load shop options.";
        loadError.value = msg || "Could not load papers, materials, or finishing options.";
      } finally {
        loading.value = false;
      }
    }
    function extractArray(data) {
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object" && Array.isArray(data.results)) {
        return data.results;
      }
      return [];
    }
    async function onSubmit() {
      if (needsMachineWarning.value || loading.value || loadError.value) return;
      if (!authStore.isAuthenticated) {
        guestStore.addItem(props.shopSlug, props.shopName ?? "Shop", props.product.name, {
          product: props.product.id,
          quantity: Math.max(minQty.value, form.quantity),
          pricing_mode: props.product.pricing_mode,
          paper: form.paper ?? void 0,
          material: form.material ?? void 0,
          machine: form.machine ?? void 0,
          sides: form.sides,
          color_mode: form.color_mode,
          finishings: form.finishings.length ? form.finishings : void 0,
          special_instructions: form.special_instructions.trim() || void 0
        });
        successMessage.value = `${props.product.name} added to your draft.`;
        emit("added");
        setTimeout(() => {
          isOpen.value = false;
        }, 1200);
        toast.add({ title: "Added to draft", description: "Sign in when you submit to get your quote request.", color: "success" });
        return;
      }
      submitting.value = true;
      try {
        await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, {
          product: props.product.id,
          quantity: Math.max(minQty.value, form.quantity),
          pricing_mode: props.product.pricing_mode,
          paper: form.paper ?? void 0,
          material: form.material ?? void 0,
          machine: form.machine ?? void 0,
          sides: form.sides,
          color_mode: form.color_mode,
          finishings: form.finishings.length ? form.finishings : void 0,
          special_instructions: form.special_instructions.trim() || void 0
        });
        successMessage.value = `${props.product.name} added to your draft.`;
        emit("added");
        setTimeout(() => {
          isOpen.value = false;
        }, 1200);
      } catch (err) {
        toast.add({
          title: "Could not add to draft",
          description: err instanceof Error ? err.message : "Please sign in to add to your draft.",
          color: "error"
        });
      } finally {
        submitting.value = false;
      }
    }
    async function fetchBackendPrice() {
      const slug = props.product?.slug;
      if (!slug || !props.shopSlug || !hasAllRequiredOptions.value) {
        backendPriceResult.value = null;
        return;
      }
      backendPriceLoading.value = true;
      backendPriceResult.value = null;
      try {
        const result = await calculateGalleryProductPrice(props.shopSlug, slug, {
          quantity: form.quantity,
          paper_id: form.paper ?? void 0,
          material_id: form.material ?? void 0,
          machine_id: form.machine ?? void 0,
          sides: form.sides,
          color_mode: form.color_mode,
          chosen_width_mm: props.product.default_finished_width_mm ?? void 0,
          chosen_height_mm: props.product.default_finished_height_mm ?? void 0,
          finishings: form.finishings.length ? form.finishings : void 0
        }, shopApi);
        backendPriceResult.value = result;
      } catch {
        backendPriceResult.value = null;
      } finally {
        backendPriceLoading.value = false;
      }
    }
    const fetchPriceDebounced = useDebounceFn(fetchBackendPrice, 300);
    watch(
      () => [form.quantity, form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings],
      () => {
        if (isOpen.value && hasAllRequiredOptions.value) {
          fetchPriceDebounced();
        } else {
          backendPriceResult.value = null;
        }
      },
      { deep: true }
    );
    watch(isOpen, (open) => {
      if (open) {
        resetForm();
        void loadShopData();
        nextTick(() => {
          if (hasAllRequiredOptions.value) fetchPriceDebounced();
        });
      } else {
        backendPriceResult.value = null;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesQuoteConfigModal = __nuxt_component_0;
      const _component_QuotesQuoteConfigNotice = __nuxt_component_7;
      const _component_QuotesQuoteConfigSection = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      const _component_UCheckbox = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      _push(ssrRenderComponent(_component_QuotesQuoteConfigModal, mergeProps({
        open: isOpen.value,
        eyebrow: "Quote Configuration",
        title: `Configure ${__props.product.name}`,
        description: "Customize quantity, production options, and finishing before adding this item to your draft.",
        size: "lg",
        "onUpdate:open": ($event) => isOpen.value = $event
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              class: "sm:min-w-32",
              onClick: ($event) => isOpen.value = false
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              class: "sm:min-w-40",
              loading: unref(submitting),
              disabled: unref(loading) || !!unref(loadError) || unref(needsMachineWarning),
              onClick: onSubmit
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-1 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add to Quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-1 h-4 w-4"
                    }),
                    createTextVNode(" Add to Quote ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end" }, [
                createVNode(_component_UButton, {
                  variant: "soft",
                  color: "neutral",
                  class: "sm:min-w-32",
                  onClick: ($event) => isOpen.value = false
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Cancel ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  class: "sm:min-w-40",
                  loading: unref(submitting),
                  disabled: unref(loading) || !!unref(loadError) || unref(needsMachineWarning),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-1 h-4 w-4"
                    }),
                    createTextVNode(" Add to Quote ")
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 sm:space-y-5"${_scopeId}>`);
            if (unref(successMessage)) {
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigNotice, {
                tone: "success",
                title: "Added to draft",
                message: unref(successMessage)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
              title: "Product",
              description: "Base product details from this shop."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4"${_scopeId2}>`);
                  if (unref(imageUrl)) {
                    _push3(`<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"${_scopeId2}><img${ssrRenderAttr("src", unref(imageUrl))}${ssrRenderAttr("alt", __props.product.name)} class="h-full w-full object-cover"${_scopeId2}></div>`);
                  } else {
                    _push3(`<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-package",
                      class: "h-8 w-8 text-[var(--p-text-muted)]"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(`<div class="min-w-0 flex-1"${_scopeId2}><p class="truncate text-base font-semibold text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(__props.product.name)}</p>`);
                  if (__props.product.category) {
                    _push3(`<p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId2}>${ssrInterpolate(__props.product.category)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="mt-2 flex flex-wrap gap-1.5"${_scopeId2}>`);
                  if (__props.product.final_size) {
                    _push3(ssrRenderComponent(_component_UBadge, {
                      variant: "soft",
                      color: "neutral",
                      size: "xs"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.product.final_size)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.product.final_size), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.product.imposition_summary) {
                    _push3(ssrRenderComponent(_component_UBadge, {
                      variant: "soft",
                      color: "neutral",
                      size: "xs"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(__props.product.imposition_summary)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(__props.product.imposition_summary), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_UBadge, {
                    variant: "soft",
                    color: "primary",
                    size: "xs"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4" }, [
                      unref(imageUrl) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: unref(imageUrl),
                          alt: __props.product.name,
                          class: "h-full w-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-package",
                          class: "h-8 w-8 text-[var(--p-text-muted)]"
                        })
                      ])),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "truncate text-base font-semibold text-[var(--p-text)]" }, toDisplayString(__props.product.name), 1),
                        __props.product.category ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-xs text-[var(--p-text-muted)]"
                        }, toDisplayString(__props.product.category), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "mt-2 flex flex-wrap gap-1.5" }, [
                          __props.product.final_size ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.final_size), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          __props.product.imposition_summary ? (openBlock(), createBlock(_component_UBadge, {
                            key: 1,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.imposition_summary), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_UBadge, {
                            variant: "soft",
                            color: "primary",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet"), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(loading)) {
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Loading",
                description: "Preparing available options for this product."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-loader-2",
                      class: "mb-3 h-8 w-8 animate-spin"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="text-sm"${_scopeId2}>Loading options…</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]" }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-loader-2",
                          class: "mb-3 h-8 w-8 animate-spin"
                        }),
                        createVNode("p", { class: "text-sm" }, "Loading options…")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(loadError)) {
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Unavailable",
                description: "The quote options could not be loaded right now."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_QuotesQuoteConfigNotice, {
                      tone: "error",
                      title: "Could not open quote options",
                      message: unref(loadError)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex flex-wrap gap-2"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_UButton, {
                            variant: "soft",
                            color: "error",
                            size: "sm",
                            onClick: loadShopData
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Retry`);
                              } else {
                                return [
                                  createTextVNode("Retry")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_UButton, {
                            variant: "ghost",
                            size: "sm",
                            onClick: ($event) => isOpen.value = false
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Close`);
                              } else {
                                return [
                                  createTextVNode("Close")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              createVNode(_component_UButton, {
                                variant: "soft",
                                color: "error",
                                size: "sm",
                                onClick: loadShopData
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Retry")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_UButton, {
                                variant: "ghost",
                                size: "sm",
                                onClick: ($event) => isOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Close")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_QuotesQuoteConfigNotice, {
                        tone: "error",
                        title: "Could not open quote options",
                        message: unref(loadError)
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "error",
                              size: "sm",
                              onClick: loadShopData
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Retry")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_UButton, {
                              variant: "ghost",
                              size: "sm",
                              onClick: ($event) => isOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Close")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["message"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<form class="space-y-4 sm:space-y-5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Specifications",
                description: "Set the core print configuration used for pricing."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-5"${_scopeId2}><div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Quantity</label><div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      color: "neutral",
                      size: "sm",
                      icon: "i-lucide-minus",
                      onClick: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity - 50)
                    }, null, _parent3, _scopeId2));
                    _push3(`<input${ssrRenderAttr("value", unref(form).quantity)} type="number"${ssrRenderAttr("min", unref(minQty))} class="w-24 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-center text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      color: "neutral",
                      size: "sm",
                      icon: "i-lucide-plus",
                      onClick: ($event) => unref(form).quantity += 50
                    }, null, _parent3, _scopeId2));
                    _push3(`<span class="text-xs text-[var(--p-text-muted)]"${_scopeId2}>min ${ssrInterpolate(unref(minQty))}</span></div></div>`);
                    if (__props.product.pricing_mode === "SHEET") {
                      _push3(`<div class="grid gap-5 lg:grid-cols-2"${_scopeId2}><div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Sides</label><div class="grid grid-cols-2 gap-2"${_scopeId2}><button type="button" class="${ssrRenderClass([unref(form).sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}> Single-sided </button><button type="button" class="${ssrRenderClass([unref(form).sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}> Double-sided </button></div></div><div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Color</label><div class="grid grid-cols-2 gap-2"${_scopeId2}><button type="button" class="${ssrRenderClass([unref(form).color_mode === "COLOR" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_UIcon, {
                        name: "i-lucide-palette",
                        class: "mr-1 inline h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(` Color </button><button type="button" class="${ssrRenderClass([unref(form).color_mode === "BW" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"${_scopeId2}> B&amp;W </button></div></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.product.pricing_mode === "SHEET" && unref(machines).length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Printing machine</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(machines), (m) => {
                        _push3(`<label class="${ssrRenderClass([unref(form).machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).machine, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(m.name)}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.product.pricing_mode === "SHEET" && unref(papers).length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Paper type / grammage</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(papers), (p) => {
                        _push3(`<label class="${ssrRenderClass([unref(form).paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paper, p.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", p.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm ${ssrInterpolate(p.paper_type)}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length) {
                      _push3(`<div${_scopeId2}><label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId2}>Material</label><div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(materials), (m) => {
                        _push3(`<label class="${ssrRenderClass([unref(form).material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"])}"${_scopeId2}><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).material, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"${_scopeId2}><span class="text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(m.material_type ?? m.name)}</span></label>`);
                      });
                      _push3(`<!--]--></div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-5" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Quantity"),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-minus",
                              onClick: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity - 50)
                            }, null, 8, ["onClick"]),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                              type: "number",
                              min: unref(minQty),
                              class: "w-24 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-center text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400",
                              onBlur: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity || unref(minQty))
                            }, null, 40, ["onUpdate:modelValue", "min", "onBlur"]), [
                              [
                                vModelText,
                                unref(form).quantity,
                                void 0,
                                { number: true }
                              ]
                            ]),
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-plus",
                              onClick: ($event) => unref(form).quantity += 50
                            }, null, 8, ["onClick"]),
                            createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, "min " + toDisplayString(unref(minQty)), 1)
                          ])
                        ]),
                        __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-5 lg:grid-cols-2"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Sides"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).sides = "SIMPLEX"
                              }, " Single-sided ", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).sides = "DUPLEX"
                              }, " Double-sided ", 10, ["onClick"])
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Color"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).color_mode === "COLOR" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).color_mode = "COLOR"
                              }, [
                                createVNode(_component_UIcon, {
                                  name: "i-lucide-palette",
                                  class: "mr-1 inline h-4 w-4"
                                }),
                                createTextVNode(" Color ")
                              ], 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).color_mode === "BW" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).color_mode = "BW"
                              }, " B&W ", 10, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "SHEET" && unref(machines).length ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Printing machine"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(machines), (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).machine = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).machine]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "SHEET" && unref(papers).length ? (openBlock(), createBlock("div", { key: 2 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Paper type / grammage"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(papers), (p) => {
                              return openBlock(), createBlock("label", {
                                key: p.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).paper = $event,
                                  type: "radio",
                                  value: p.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).paper]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(p.sheet_size) + " " + toDisplayString(p.gsm) + "gsm " + toDisplayString(p.paper_type), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length ? (openBlock(), createBlock("div", { key: 3 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Material"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(materials), (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).material = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).material]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.material_type ?? m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              if (unref(finishingRates).length) {
                _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                  title: "Finishing",
                  description: "Optional finishing services that affect the final quote."
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="space-y-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(finishingRates), (fr) => {
                        _push3(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"${_scopeId2}><label class="flex cursor-pointer items-center gap-3"${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_UCheckbox, {
                          "model-value": unref(form).finishings.some((f) => f.finishing_rate === fr.id),
                          "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                        }, null, _parent3, _scopeId2));
                        _push3(`<span class="flex-1 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(fr.name)}</span></label>`);
                        if (fr.charge_unit === "PER_SIDE_PER_SHEET" && unref(form).finishings.some((f) => f.finishing_rate === fr.id)) {
                          _push3(`<div class="mt-3 ml-6 flex flex-wrap gap-2"${_scopeId2}><button type="button" class="${ssrRenderClass(["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "SINGLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"])}"${_scopeId2}> Single-sided </button><button type="button" class="${ssrRenderClass(["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "DOUBLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"])}"${_scopeId2}> Double-sided </button></div>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingRates), (fr) => {
                            return openBlock(), createBlock("div", {
                              key: fr.id,
                              class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"
                            }, [
                              createVNode("label", { class: "flex cursor-pointer items-center gap-3" }, [
                                createVNode(_component_UCheckbox, {
                                  "model-value": unref(form).finishings.some((f) => f.finishing_rate === fr.id),
                                  "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                                }, null, 8, ["model-value", "onUpdate:modelValue"]),
                                createVNode("span", { class: "flex-1 text-sm text-[var(--p-text)]" }, toDisplayString(fr.name), 1)
                              ]),
                              fr.charge_unit === "PER_SIDE_PER_SHEET" && unref(form).finishings.some((f) => f.finishing_rate === fr.id) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-3 ml-6 flex flex-wrap gap-2"
                              }, [
                                createVNode("button", {
                                  type: "button",
                                  class: ["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "SINGLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                  onClick: ($event) => setFinishingApplyToSides(fr.id, "SINGLE")
                                }, " Single-sided ", 10, ["onClick"]),
                                createVNode("button", {
                                  type: "button",
                                  class: ["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "DOUBLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                  onClick: ($event) => setFinishingApplyToSides(fr.id, "DOUBLE")
                                }, " Double-sided ", 10, ["onClick"])
                              ])) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(needsMachineWarning)) {
                _push2(ssrRenderComponent(_component_QuotesQuoteConfigNotice, {
                  tone: "error",
                  title: "Machine not chosen",
                  message: "Please select a printing machine to get an accurate quote for this configuration."
                }, null, _parent2, _scopeId));
              } else if (unref(needsPaperOrFinishing)) {
                _push2(ssrRenderComponent(_component_QuotesQuoteConfigNotice, {
                  tone: "warning",
                  title: "Complete the quote",
                  message: "Adding the missing production details will make the preview more accurate."
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<ul class="list-disc space-y-1 pl-5 text-sm"${_scopeId2}>`);
                      if (__props.product.pricing_mode === "SHEET" && unref(papers).length && !unref(form).paper) {
                        _push3(`<li${_scopeId2}>Select paper for accurate pricing.</li>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (__props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length && !unref(form).material) {
                        _push3(`<li${_scopeId2}>Select material for accurate pricing.</li>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (unref(finishingRates).length && !unref(form).finishings.length) {
                        _push3(`<li${_scopeId2}>Consider adding finishing if the job requires it.</li>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</ul>`);
                    } else {
                      return [
                        createVNode("ul", { class: "list-disc space-y-1 pl-5 text-sm" }, [
                          __props.product.pricing_mode === "SHEET" && unref(papers).length && !unref(form).paper ? (openBlock(), createBlock("li", { key: 0 }, "Select paper for accurate pricing.")) : createCommentVNode("", true),
                          __props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length && !unref(form).material ? (openBlock(), createBlock("li", { key: 1 }, "Select material for accurate pricing.")) : createCommentVNode("", true),
                          unref(finishingRates).length && !unref(form).finishings.length ? (openBlock(), createBlock("li", { key: 2 }, "Consider adding finishing if the job requires it.")) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Notes",
                description: "Anything the shop should keep in mind for this item."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UTextarea, {
                      modelValue: unref(form).special_instructions,
                      "onUpdate:modelValue": ($event) => unref(form).special_instructions = $event,
                      placeholder: "Any notes for the shop (optional)",
                      rows: 3
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).special_instructions,
                        "onUpdate:modelValue": ($event) => unref(form).special_instructions = $event,
                        placeholder: "Any notes for the shop (optional)",
                        rows: 3
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_QuotesQuoteConfigSection, {
                title: "Pricing",
                description: "Live preview based on the current configuration."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="space-y-3"${_scopeId2}><div class="grid gap-2 text-sm text-[var(--p-text-muted)]"${_scopeId2}><div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Product</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(__props.product.name)}</span></div><div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Quantity</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(form).quantity)} pcs</span></div>`);
                    if (__props.product.pricing_mode === "SHEET") {
                      _push3(`<div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Sides</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(form).sides === "DUPLEX" ? "Double-sided" : "Single-sided")}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (__props.product.pricing_mode === "SHEET") {
                      _push3(`<div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Color</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(form).color_mode === "COLOR" ? "Full Color" : "Black & White")}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(selectedPaperLabel)) {
                      _push3(`<div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Paper</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(selectedPaperLabel))}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(selectedMaterialLabel)) {
                      _push3(`<div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Material</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(selectedMaterialLabel))}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(selectedFinishingLabels).length) {
                      _push3(`<div class="flex justify-between gap-4"${_scopeId2}><span${_scopeId2}>Finishing</span><span class="font-medium text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(selectedFinishingLabels).join(", "))}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                    if (__props.product.price_hint?.can_calculate || __props.product.price_range_est?.can_calculate) {
                      _push3(`<div class="rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"${_scopeId2}>`);
                      if (unref(tweakPriceSummary)) {
                        _push3(`<div class="flex items-baseline justify-between gap-4"${_scopeId2}><span class="font-semibold text-[var(--p-text)]"${_scopeId2}>Estimated total</span><span class="flex items-center gap-2 text-lg font-bold text-flamingo-600 dark:text-flamingo-400"${_scopeId2}>`);
                        if (unref(backendPriceLoading)) {
                          _push3(ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-loader-2",
                            class: "h-4 w-4 animate-spin"
                          }, null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(` ${ssrInterpolate(unref(tweakPriceSummary).totalLine)}</span></div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (unref(tweakPriceSummary)?.perUnitLine) {
                        _push3(`<div class="mt-1 flex justify-between gap-4 text-sm text-[var(--p-text-muted)]"${_scopeId2}><span${_scopeId2}>Per item</span><span${_scopeId2}>${ssrInterpolate(unref(tweakPriceSummary).perUnitLine)}</span></div>`);
                      } else if (__props.product.price_hint?.price_display) {
                        _push3(`<div class="flex items-baseline justify-between gap-4"${_scopeId2}><span class="font-semibold text-[var(--p-text)]"${_scopeId2}>Estimated price</span><span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400"${_scopeId2}>${ssrInterpolate(__props.product.price_hint.price_display)}</span></div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<p class="text-xs text-[var(--p-text-muted)]"${_scopeId2}>Final price is computed by the shop after submission.</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "grid gap-2 text-sm text-[var(--p-text-muted)]" }, [
                          createVNode("div", { class: "flex justify-between gap-4" }, [
                            createVNode("span", null, "Product"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(__props.product.name), 1)
                          ]),
                          createVNode("div", { class: "flex justify-between gap-4" }, [
                            createVNode("span", null, "Quantity"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).quantity) + " pcs", 1)
                          ]),
                          __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Sides"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).sides === "DUPLEX" ? "Double-sided" : "Single-sided"), 1)
                          ])) : createCommentVNode("", true),
                          __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Color"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).color_mode === "COLOR" ? "Full Color" : "Black & White"), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedPaperLabel) ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Paper"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedPaperLabel)), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedMaterialLabel) ? (openBlock(), createBlock("div", {
                            key: 3,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Material"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedMaterialLabel)), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedFinishingLabels).length ? (openBlock(), createBlock("div", {
                            key: 4,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Finishing"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedFinishingLabels).join(", ")), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        __props.product.price_hint?.can_calculate || __props.product.price_range_est?.can_calculate ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"
                        }, [
                          unref(tweakPriceSummary) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-baseline justify-between gap-4"
                          }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated total"),
                            createVNode("span", { class: "flex items-center gap-2 text-lg font-bold text-flamingo-600 dark:text-flamingo-400" }, [
                              unref(backendPriceLoading) ? (openBlock(), createBlock(_component_UIcon, {
                                key: 0,
                                name: "i-lucide-loader-2",
                                class: "h-4 w-4 animate-spin"
                              })) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(unref(tweakPriceSummary).totalLine), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          unref(tweakPriceSummary)?.perUnitLine ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-1 flex justify-between gap-4 text-sm text-[var(--p-text-muted)]"
                          }, [
                            createVNode("span", null, "Per item"),
                            createVNode("span", null, toDisplayString(unref(tweakPriceSummary).perUnitLine), 1)
                          ])) : __props.product.price_hint?.price_display ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex items-baseline justify-between gap-4"
                          }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated price"),
                            createVNode("span", { class: "text-lg font-bold text-flamingo-600 dark:text-flamingo-400" }, toDisplayString(__props.product.price_hint.price_display), 1)
                          ])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "Final price is computed by the shop after submission.")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</form>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 sm:space-y-5" }, [
                unref(successMessage) ? (openBlock(), createBlock(_component_QuotesQuoteConfigNotice, {
                  key: 0,
                  tone: "success",
                  title: "Added to draft",
                  message: unref(successMessage)
                }, null, 8, ["message"])) : createCommentVNode("", true),
                createVNode(_component_QuotesQuoteConfigSection, {
                  title: "Product",
                  description: "Base product details from this shop."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4" }, [
                      unref(imageUrl) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: unref(imageUrl),
                          alt: __props.product.name,
                          class: "h-full w-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-package",
                          class: "h-8 w-8 text-[var(--p-text-muted)]"
                        })
                      ])),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("p", { class: "truncate text-base font-semibold text-[var(--p-text)]" }, toDisplayString(__props.product.name), 1),
                        __props.product.category ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-xs text-[var(--p-text-muted)]"
                        }, toDisplayString(__props.product.category), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "mt-2 flex flex-wrap gap-1.5" }, [
                          __props.product.final_size ? (openBlock(), createBlock(_component_UBadge, {
                            key: 0,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.final_size), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          __props.product.imposition_summary ? (openBlock(), createBlock(_component_UBadge, {
                            key: 1,
                            variant: "soft",
                            color: "neutral",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.imposition_summary), 1)
                            ]),
                            _: 1
                          })) : createCommentVNode("", true),
                          createVNode(_component_UBadge, {
                            variant: "soft",
                            color: "primary",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet"), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                }),
                unref(loading) ? (openBlock(), createBlock(_component_QuotesQuoteConfigSection, {
                  key: 1,
                  title: "Loading",
                  description: "Preparing available options for this product."
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-loader-2",
                        class: "mb-3 h-8 w-8 animate-spin"
                      }),
                      createVNode("p", { class: "text-sm" }, "Loading options…")
                    ])
                  ]),
                  _: 1
                })) : unref(loadError) ? (openBlock(), createBlock(_component_QuotesQuoteConfigSection, {
                  key: 2,
                  title: "Unavailable",
                  description: "The quote options could not be loaded right now."
                }, {
                  default: withCtx(() => [
                    createVNode(_component_QuotesQuoteConfigNotice, {
                      tone: "error",
                      title: "Could not open quote options",
                      message: unref(loadError)
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex flex-wrap gap-2" }, [
                          createVNode(_component_UButton, {
                            variant: "soft",
                            color: "error",
                            size: "sm",
                            onClick: loadShopData
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Retry")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_UButton, {
                            variant: "ghost",
                            size: "sm",
                            onClick: ($event) => isOpen.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Close")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ]),
                      _: 1
                    }, 8, ["message"])
                  ]),
                  _: 1
                })) : (openBlock(), createBlock("form", {
                  key: 3,
                  class: "space-y-4 sm:space-y-5",
                  onSubmit: withModifiers(onSubmit, ["prevent"])
                }, [
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Specifications",
                    description: "Set the core print configuration used for pricing."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-5" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Quantity"),
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-minus",
                              onClick: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity - 50)
                            }, null, 8, ["onClick"]),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                              type: "number",
                              min: unref(minQty),
                              class: "w-24 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-center text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400",
                              onBlur: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity || unref(minQty))
                            }, null, 40, ["onUpdate:modelValue", "min", "onBlur"]), [
                              [
                                vModelText,
                                unref(form).quantity,
                                void 0,
                                { number: true }
                              ]
                            ]),
                            createVNode(_component_UButton, {
                              variant: "soft",
                              color: "neutral",
                              size: "sm",
                              icon: "i-lucide-plus",
                              onClick: ($event) => unref(form).quantity += 50
                            }, null, 8, ["onClick"]),
                            createVNode("span", { class: "text-xs text-[var(--p-text-muted)]" }, "min " + toDisplayString(unref(minQty)), 1)
                          ])
                        ]),
                        __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-5 lg:grid-cols-2"
                        }, [
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Sides"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).sides = "SIMPLEX"
                              }, " Single-sided ", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).sides = "DUPLEX"
                              }, " Double-sided ", 10, ["onClick"])
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Color"),
                            createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).color_mode === "COLOR" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).color_mode = "COLOR"
                              }, [
                                createVNode(_component_UIcon, {
                                  name: "i-lucide-palette",
                                  class: "mr-1 inline h-4 w-4"
                                }),
                                createTextVNode(" Color ")
                              ], 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-3 py-2 text-sm font-medium transition-all", unref(form).color_mode === "BW" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => unref(form).color_mode = "BW"
                              }, " B&W ", 10, ["onClick"])
                            ])
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "SHEET" && unref(machines).length ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Printing machine"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(machines), (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).machine = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).machine]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "SHEET" && unref(papers).length ? (openBlock(), createBlock("div", { key: 2 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Paper type / grammage"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(papers), (p) => {
                              return openBlock(), createBlock("label", {
                                key: p.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).paper = $event,
                                  type: "radio",
                                  value: p.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).paper]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(p.sheet_size) + " " + toDisplayString(p.gsm) + "gsm " + toDisplayString(p.paper_type), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        __props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length ? (openBlock(), createBlock("div", { key: 3 }, [
                          createVNode("label", { class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]" }, "Material"),
                          createVNode("div", { class: "space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(materials), (m) => {
                              return openBlock(), createBlock("label", {
                                key: m.id,
                                class: ["flex items-center gap-3 rounded-lg px-3 py-2 transition-colors", unref(form).material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]"]
                              }, [
                                withDirectives(createVNode("input", {
                                  "onUpdate:modelValue": ($event) => unref(form).material = $event,
                                  type: "radio",
                                  value: m.id,
                                  class: "accent-flamingo-500"
                                }, null, 8, ["onUpdate:modelValue", "value"]), [
                                  [vModelRadio, unref(form).material]
                                ]),
                                createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(m.material_type ?? m.name), 1)
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  unref(finishingRates).length ? (openBlock(), createBlock(_component_QuotesQuoteConfigSection, {
                    key: 0,
                    title: "Finishing",
                    description: "Optional finishing services that affect the final quote."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingRates), (fr) => {
                          return openBlock(), createBlock("div", {
                            key: fr.id,
                            class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"
                          }, [
                            createVNode("label", { class: "flex cursor-pointer items-center gap-3" }, [
                              createVNode(_component_UCheckbox, {
                                "model-value": unref(form).finishings.some((f) => f.finishing_rate === fr.id),
                                "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                              }, null, 8, ["model-value", "onUpdate:modelValue"]),
                              createVNode("span", { class: "flex-1 text-sm text-[var(--p-text)]" }, toDisplayString(fr.name), 1)
                            ]),
                            fr.charge_unit === "PER_SIDE_PER_SHEET" && unref(form).finishings.some((f) => f.finishing_rate === fr.id) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-3 ml-6 flex flex-wrap gap-2"
                            }, [
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "SINGLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => setFinishingApplyToSides(fr.id, "SINGLE")
                              }, " Single-sided ", 10, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: ["rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "DOUBLE" ? "border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"],
                                onClick: ($event) => setFinishingApplyToSides(fr.id, "DOUBLE")
                              }, " Double-sided ", 10, ["onClick"])
                            ])) : createCommentVNode("", true)
                          ]);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(needsMachineWarning) ? (openBlock(), createBlock(_component_QuotesQuoteConfigNotice, {
                    key: 1,
                    tone: "error",
                    title: "Machine not chosen",
                    message: "Please select a printing machine to get an accurate quote for this configuration."
                  })) : unref(needsPaperOrFinishing) ? (openBlock(), createBlock(_component_QuotesQuoteConfigNotice, {
                    key: 2,
                    tone: "warning",
                    title: "Complete the quote",
                    message: "Adding the missing production details will make the preview more accurate."
                  }, {
                    default: withCtx(() => [
                      createVNode("ul", { class: "list-disc space-y-1 pl-5 text-sm" }, [
                        __props.product.pricing_mode === "SHEET" && unref(papers).length && !unref(form).paper ? (openBlock(), createBlock("li", { key: 0 }, "Select paper for accurate pricing.")) : createCommentVNode("", true),
                        __props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length && !unref(form).material ? (openBlock(), createBlock("li", { key: 1 }, "Select material for accurate pricing.")) : createCommentVNode("", true),
                        unref(finishingRates).length && !unref(form).finishings.length ? (openBlock(), createBlock("li", { key: 2 }, "Consider adding finishing if the job requires it.")) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Notes",
                    description: "Anything the shop should keep in mind for this item."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).special_instructions,
                        "onUpdate:modelValue": ($event) => unref(form).special_instructions = $event,
                        placeholder: "Any notes for the shop (optional)",
                        rows: 3
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_QuotesQuoteConfigSection, {
                    title: "Pricing",
                    description: "Live preview based on the current configuration."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "grid gap-2 text-sm text-[var(--p-text-muted)]" }, [
                          createVNode("div", { class: "flex justify-between gap-4" }, [
                            createVNode("span", null, "Product"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(__props.product.name), 1)
                          ]),
                          createVNode("div", { class: "flex justify-between gap-4" }, [
                            createVNode("span", null, "Quantity"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).quantity) + " pcs", 1)
                          ]),
                          __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Sides"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).sides === "DUPLEX" ? "Double-sided" : "Single-sided"), 1)
                          ])) : createCommentVNode("", true),
                          __props.product.pricing_mode === "SHEET" ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Color"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(form).color_mode === "COLOR" ? "Full Color" : "Black & White"), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedPaperLabel) ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Paper"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedPaperLabel)), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedMaterialLabel) ? (openBlock(), createBlock("div", {
                            key: 3,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Material"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedMaterialLabel)), 1)
                          ])) : createCommentVNode("", true),
                          unref(selectedFinishingLabels).length ? (openBlock(), createBlock("div", {
                            key: 4,
                            class: "flex justify-between gap-4"
                          }, [
                            createVNode("span", null, "Finishing"),
                            createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(unref(selectedFinishingLabels).join(", ")), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        __props.product.price_hint?.can_calculate || __props.product.price_range_est?.can_calculate ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"
                        }, [
                          unref(tweakPriceSummary) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-baseline justify-between gap-4"
                          }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated total"),
                            createVNode("span", { class: "flex items-center gap-2 text-lg font-bold text-flamingo-600 dark:text-flamingo-400" }, [
                              unref(backendPriceLoading) ? (openBlock(), createBlock(_component_UIcon, {
                                key: 0,
                                name: "i-lucide-loader-2",
                                class: "h-4 w-4 animate-spin"
                              })) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(unref(tweakPriceSummary).totalLine), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          unref(tweakPriceSummary)?.perUnitLine ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-1 flex justify-between gap-4 text-sm text-[var(--p-text-muted)]"
                          }, [
                            createVNode("span", null, "Per item"),
                            createVNode("span", null, toDisplayString(unref(tweakPriceSummary).perUnitLine), 1)
                          ])) : __props.product.price_hint?.price_display ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex items-baseline justify-between gap-4"
                          }, [
                            createVNode("span", { class: "font-semibold text-[var(--p-text)]" }, "Estimated price"),
                            createVNode("span", { class: "text-lg font-bold text-flamingo-600 dark:text-flamingo-400" }, toDisplayString(__props.product.price_hint.price_display), 1)
                          ])) : createCommentVNode("", true)
                        ])) : createCommentVNode("", true),
                        createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "Final price is computed by the shop after submission.")
                      ])
                    ]),
                    _: 1
                  })
                ], 32))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/ProductTweakModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main, { __name: "QuotesProductTweakModal" });

export { __nuxt_component_9 as _, useProductPriceDisplay as u };
//# sourceMappingURL=ProductTweakModal-DTcQxKaX.mjs.map
