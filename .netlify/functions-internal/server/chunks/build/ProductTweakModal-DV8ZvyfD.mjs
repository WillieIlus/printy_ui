import { i as usePublicApiNoAuth, a as _sfc_main$f, e as _sfc_main$9, A as API, j as useApi, f as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-CHxS7t2J.mjs';
import { _ as _sfc_main$2 } from './Checkbox-8D35u7U_.mjs';
import { _ as _sfc_main$3 } from './Textarea-D4hEpwmG.mjs';
import { defineComponent, computed, ref, useModel, reactive, watch, nextTick, unref, withCtx, createTextVNode, toDisplayString, createVNode, mergeModels, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseEqual } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { c as calculateGalleryProductPrice } from './gallery-wJMq2SzO.mjs';
import { a as formatKES } from './formatters-D5StX5za.mjs';

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
function getMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const config = useRuntimeConfig();
  const base = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
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
    const isOpen = useModel(__props, "modelValue");
    const publicApiNoAuth = usePublicApiNoAuth();
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
      return getMediaUrl(path);
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
        const api = useApi();
        const [papersData, finishData, materialsData, machinesData] = await Promise.all([
          api(API.shopPapers(slug)),
          api(API.shopFinishingRates(slug)),
          api(API.shopMaterials(slug)),
          api(API.shopMachines(slug)).catch(() => [])
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
    const openedAt = ref(0);
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
        });
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
        openedAt.value = Date.now();
        resetForm();
        loadShopData();
        (void 0).body.style.overflow = "hidden";
        nextTick(() => {
          if (hasAllRequiredOptions.value) fetchPriceDebounced();
        });
      } else {
        (void 0).body.style.overflow = "";
        backendPriceResult.value = null;
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      const _component_UCheckbox = _sfc_main$2;
      const _component_UTextarea = _sfc_main$3;
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div><div class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"><div class="sticky top-0 z-10 bg-[var(--p-surface)]/95 backdrop-blur-sm border-b border-[var(--p-border)] px-6 py-4 rounded-t-2xl"><div class="flex items-start justify-between gap-4"><div><h2 class="text-lg font-bold text-[var(--p-text)]"> Tweak Quote — ${ssrInterpolate(__props.product.name)}</h2><p class="text-sm text-[var(--p-text-muted)] mt-0.5"> Customize paper, quantity, finishing, and other options before adding to your draft. </p></div><button class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div></div><div class="min-h-[200px] p-6 space-y-6">`);
          if (unref(successMessage)) {
            _push2(`<div class="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-check",
              class: "h-5 w-5 text-green-600 dark:text-green-400"
            }, null, _parent));
            _push2(`</div><p class="text-sm font-medium text-green-700 dark:text-green-300">${ssrInterpolate(unref(successMessage))}</p></div>`);
          } else if (unref(loading)) {
            _push2(`<div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]">`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-loader-2",
              class: "h-8 w-8 animate-spin mb-3"
            }, null, _parent));
            _push2(`<p class="text-sm">Loading options…</p></div>`);
          } else if (unref(loadError)) {
            _push2(`<div class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300"><p class="font-semibold">Could not open quote options.</p><p class="mt-1">${ssrInterpolate(unref(loadError))}</p><div class="mt-3 flex gap-2">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "error",
              size: "sm",
              onClick: loadShopData
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Retry`);
                } else {
                  return [
                    createTextVNode("Retry")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              size: "sm",
              onClick: ($event) => isOpen.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Close`);
                } else {
                  return [
                    createTextVNode("Close")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div></div>`);
          } else {
            _push2(`<div class="space-y-6"><div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-4">`);
            if (unref(imageUrl)) {
              _push2(`<div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--p-border)]"><img${ssrRenderAttr("src", unref(imageUrl))}${ssrRenderAttr("alt", __props.product.name)} class="w-full h-full object-cover"></div>`);
            } else {
              _push2(`<div class="w-16 h-16 rounded-lg bg-[var(--p-border)] flex items-center justify-center shrink-0">`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package",
                class: "h-8 w-8 text-[var(--p-text-muted)]"
              }, null, _parent));
              _push2(`</div>`);
            }
            _push2(`<div class="min-w-0 flex-1"><p class="font-semibold text-[var(--p-text)] truncate">${ssrInterpolate(__props.product.name)}</p>`);
            if (__props.product.category) {
              _push2(`<p class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(__props.product.category)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-wrap gap-1.5 mt-1">`);
            if (__props.product.final_size) {
              _push2(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "neutral",
                size: "xs"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.product.final_size)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.product.final_size), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.imposition_summary) {
              _push2(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "neutral",
                size: "xs"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.product.imposition_summary)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.product.imposition_summary), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "primary",
              size: "xs"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div></div></div><form class="space-y-5"><div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Quantity</label><div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              size: "sm",
              icon: "i-lucide-minus",
              onClick: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity - 50)
            }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(form).quantity)} type="number"${ssrRenderAttr("min", unref(minQty))} class="w-24 text-center rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              size: "sm",
              icon: "i-lucide-plus",
              onClick: ($event) => unref(form).quantity += 50
            }, null, _parent));
            _push2(`<span class="text-xs text-[var(--p-text-muted)]">min ${ssrInterpolate(unref(minQty))}</span></div></div>`);
            if (__props.product.pricing_mode === "SHEET") {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Sides</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass([unref(form).sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"> Single-sided </button><button type="button" class="${ssrRenderClass([unref(form).sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"> Double-sided </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.pricing_mode === "SHEET") {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Color</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass([unref(form).color_mode === "COLOR" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}">`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-palette",
                class: "h-4 w-4 mr-1 inline"
              }, null, _parent));
              _push2(` Color </button><button type="button" class="${ssrRenderClass([unref(form).color_mode === "BW" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]", "rounded-lg border px-3 py-2 text-sm font-medium transition-all"])}"> B&amp;W </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.pricing_mode === "SHEET" && unref(machines).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Printing machine</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(machines), (m) => {
                _push2(`<label class="${ssrRenderClass([unref(form).machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).machine, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(m.name)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.pricing_mode === "SHEET" && unref(papers).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Paper type / grammage</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(papers), (p) => {
                _push2(`<label class="${ssrRenderClass([unref(form).paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paper, p.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", p.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm ${ssrInterpolate(p.paper_type)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Material</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(materials), (m) => {
                _push2(`<label class="${ssrRenderClass([unref(form).material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).material, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(m.material_type ?? m.name)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(finishingRates).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Finishing</label><div class="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(finishingRates), (fr) => {
                _push2(`<div class="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--p-surface-sunken)]"><label class="flex items-center gap-3 cursor-pointer">`);
                _push2(ssrRenderComponent(_component_UCheckbox, {
                  "model-value": unref(form).finishings.some((f) => f.finishing_rate === fr.id),
                  "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                }, null, _parent));
                _push2(`<span class="text-sm text-[var(--p-text)] flex-1">${ssrInterpolate(fr.name)}</span></label>`);
                if (fr.charge_unit === "PER_SIDE_PER_SHEET" && unref(form).finishings.some((f) => f.finishing_rate === fr.id)) {
                  _push2(`<div class="mt-2 ml-6 flex flex-wrap gap-2"><button type="button" class="${ssrRenderClass(["rounded-lg border px-2 py-1 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "SINGLE" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"])}"> Single-sided </button><button type="button" class="${ssrRenderClass(["rounded-lg border px-2 py-1 text-xs font-medium transition-colors", getFinishingApplyToSides(fr.id) === "DOUBLE" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]"])}"> Double-sided </button></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(needsMachineWarning)) {
              _push2(`<div class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300"><p class="font-medium flex items-center gap-2">`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-alert-triangle",
                class: "h-4 w-4 shrink-0"
              }, null, _parent));
              _push2(` Machine not chosen </p><p class="mt-1">Please select a printing machine above to get an accurate quote. The quote cannot be calculated without it.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(needsPaperOrFinishing) && !unref(needsMachineWarning)) {
              _push2(`<div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200"><p class="font-medium flex items-center gap-2">`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-lightbulb",
                class: "h-4 w-4 shrink-0"
              }, null, _parent));
              _push2(` For a complete quote </p><ul class="mt-1 ml-6 list-disc space-y-0.5 text-amber-700 dark:text-amber-300">`);
              if (__props.product.pricing_mode === "SHEET" && unref(papers).length && !unref(form).paper) {
                _push2(`<li>Select paper for accurate pricing</li>`);
              } else {
                _push2(`<!---->`);
              }
              if (__props.product.pricing_mode === "LARGE_FORMAT" && unref(materials).length && !unref(form).material) {
                _push2(`<li>Select material for accurate pricing</li>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(finishingRates).length && !unref(form).finishings.length) {
                _push2(`<li>Consider adding finishing (lamination, binding, etc.)</li>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</ul></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Special instructions</label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(form).special_instructions,
              "onUpdate:modelValue": ($event) => unref(form).special_instructions = $event,
              placeholder: "Any notes for the shop (optional)",
              rows: 2
            }, null, _parent));
            _push2(`</div><div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-2"><p class="text-xs font-semibold uppercase tracking-wider text-flamingo-600 dark:text-flamingo-400">Quote Summary</p><div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Product</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(__props.product.name)}</span></div><div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Quantity</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(form).quantity)} pcs</span></div>`);
            if (__props.product.pricing_mode === "SHEET") {
              _push2(`<div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Sides</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(form).sides === "DUPLEX" ? "Double-sided" : "Single-sided")}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.pricing_mode === "SHEET") {
              _push2(`<div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Color</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(form).color_mode === "COLOR" ? "Full Color" : "Black & White")}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedPaperLabel)) {
              _push2(`<div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Paper</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(selectedPaperLabel))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedMaterialLabel)) {
              _push2(`<div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Material</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(selectedMaterialLabel))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(selectedFinishingLabels).length) {
              _push2(`<div class="flex justify-between text-sm"><span class="text-[var(--p-text-dim)]">Finishing</span><span class="font-medium text-[var(--p-text)]">${ssrInterpolate(unref(selectedFinishingLabels).join(", "))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.price_hint?.can_calculate || __props.product.price_range_est?.can_calculate) {
              _push2(`<div class="border-t border-flamingo-200/60 dark:border-flamingo-800/30 pt-2 space-y-1">`);
              if (unref(tweakPriceSummary)) {
                _push2(`<div class="flex justify-between items-baseline"><span class="font-semibold text-[var(--p-text)]">Est. total</span><span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400 flex items-center gap-2">`);
                if (unref(backendPriceLoading)) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-loader-2",
                    class: "h-4 w-4 animate-spin"
                  }, null, _parent));
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(unref(tweakPriceSummary).totalLine)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(tweakPriceSummary)?.perUnitLine) {
                _push2(`<div class="flex justify-between text-sm text-[var(--p-text-muted)]"><span>Per item</span><span>${ssrInterpolate(unref(tweakPriceSummary).perUnitLine)}</span></div>`);
              } else if (__props.product.price_hint?.price_display) {
                _push2(`<div class="flex justify-between"><span class="font-semibold text-[var(--p-text)]">Est. price</span><span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(__props.product.price_hint.price_display)}</span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-[var(--p-text-muted)]">Final price computed by the shop after submission.</p></div><div class="flex gap-3 pt-2">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              class: "flex-1",
              onClick: ($event) => isOpen.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              class: "flex-1",
              loading: unref(submitting),
              disabled: unref(needsMachineWarning)
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "h-4 w-4 mr-1"
                  }, null, _parent2, _scopeId));
                  _push3(` Add to Quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "h-4 w-4 mr-1"
                    }),
                    createTextVNode(" Add to Quote ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div></form></div>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
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
//# sourceMappingURL=ProductTweakModal-DV8ZvyfD.mjs.map
