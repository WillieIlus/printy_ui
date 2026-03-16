import { e as useRoute, u as useAuthStore$1, f as useToast, c as _sfc_main$9, a as _sfc_main$f, n as navigateTo, g as usePublicApiNoAuth, A as API } from './server.mjs';
import { _ as __nuxt_component_3$1 } from './LoadingSpinner-DC3DKYaG.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, isRef, toDisplayString, reactive, watch, nextTick, useModel, mergeModels, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderClass, ssrRenderTeleport, ssrLooseEqual } from 'vue/server-renderer';
import { f as formatCurrency, a as formatKES } from './formatters-D5StX5za.mjs';
import { previewPrice } from './quoteDraft-DLjjCgyl.mjs';
import { s as setInterval } from './interval-DiSDr_Za.mjs';
import { _ as _sfc_main$4 } from './Checkbox-Z6u0Cf0E.mjs';
import { _ as _sfc_main$5 } from './Textarea-C5cEpnri.mjs';
import { c as calculateGalleryProductPrice } from './gallery-BtHf462R.mjs';
import { useDebounceFn } from '@vueuse/core';
import { _ as _sfc_main$6 } from './Alert-R7u0l-O4.mjs';
import { _ as _sfc_main$7 } from './FormField-Cr7wgMIi.mjs';
import { _ as _sfc_main$8 } from './Input-CScRok4n.mjs';
import { u as useGuestQuoteStore } from './guestQuote-Cd2LcvdR.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-ILOSBKof.mjs';
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
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './api-error-D1IYk86E.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "QuotePreviewPrice",
  __ssrInlineRender: true,
  props: {
    draftId: {},
    hasItems: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const result = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const revealedLines = ref([]);
    const showTotal = ref(false);
    const calculatingText = ref("Tuna-calculate…");
    const messages = ["Tuna-calculate…", "Calculating quote…"];
    let messageInterval = null;
    function startCalculatingMessages() {
      calculatingText.value = messages[0];
      messageInterval = setInterval();
    }
    function stopCalculatingMessages() {
      if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
      }
    }
    async function revealLinesProgressive(lines) {
      revealedLines.value = [];
      showTotal.value = false;
      for (let i = 0; i < lines.length; i++) {
        await new Promise((r) => setTimeout(r, 100));
        revealedLines.value = [...lines.slice(0, i + 1)];
      }
      await new Promise((r) => setTimeout(r, 200));
      showTotal.value = true;
    }
    async function calculate() {
      if (!props.draftId || !props.hasItems) return;
      loading.value = true;
      error.value = null;
      result.value = null;
      revealedLines.value = [];
      showTotal.value = false;
      const minDelay = 3e3 + Math.random() * 3e3;
      startCalculatingMessages();
      const apiPromise = previewPrice(props.draftId);
      const delayPromise = new Promise((r) => setTimeout(r, minDelay));
      try {
        const [apiResult] = await Promise.all([apiPromise, delayPromise]);
        result.value = apiResult;
        stopCalculatingMessages();
        await revealLinesProgressive(apiResult.lines);
      } catch (err) {
        stopCalculatingMessages();
        error.value = err instanceof Error ? err.message : "Failed to calculate";
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 overflow-hidden" }, _attrs))}><div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40"><h3 class="font-semibold text-stone-800 dark:text-stone-100">Price preview</h3>`);
      if (!unref(result) && !unref(error)) {
        _push(`<p class="text-sm text-stone-500 dark:text-stone-400"> Get an estimate for your draft </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-6">`);
      if (unref(loading)) {
        _push(`<!--[--><p class="text-amber-600 dark:text-amber-400 font-medium mb-4">${ssrInterpolate(unref(calculatingText))}</p><div class="space-y-3"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-5 rounded bg-amber-100/80 dark:bg-amber-900/30 animate-pulse" style="${ssrRenderStyle({ width: `${60 + i % 3 * 15}%` })}"></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else if (unref(error)) {
        _push(`<p class="text-red-600 dark:text-red-400 text-sm">${ssrInterpolate(unref(error))}</p>`);
      } else if (unref(result)) {
        _push(`<!--[--><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(revealedLines), (line, idx) => {
          _push(`<div class="${ssrRenderClass([{ "pl-3": line.amount && idx > 0 }, "flex justify-between text-sm"])}"><span class="text-stone-600 dark:text-stone-400">${ssrInterpolate(line.label)}</span>`);
          if (line.amount) {
            _push(`<span class="font-medium text-stone-800 dark:text-stone-100 tabular-nums">${ssrInterpolate(unref(formatCurrency)(line.amount, unref(result).currency))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (!unref(result).can_calculate && unref(result).reason) {
          _push(`<div class="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40"><p class="text-sm font-medium text-red-600 dark:text-red-400">${ssrInterpolate(unref(result).reason)}</p>`);
          if (unref(result).suggestions?.[0]?.message) {
            _push(`<p class="mt-1 text-xs text-stone-600 dark:text-stone-400">${ssrInterpolate(unref(result).suggestions[0].message)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(showTotal)) {
          _push(`<div class="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40 flex justify-between font-semibold text-stone-800 dark:text-stone-100"><span>Total</span><span class="tabular-nums">${ssrInterpolate(unref(formatCurrency)(unref(result).total, unref(result).currency))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(result).hasNegotiable) {
          _push(`<p class="mt-2 text-xs text-stone-500 dark:text-stone-400"> Some charges are negotiable. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading) && (!unref(result) || __props.hasItems)) {
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          disabled: !__props.draftId || !__props.hasItems,
          onClick: calculate
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-calculator",
                class: "mr-2 h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(result) ? "Recalculate" : "Calculate")}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-calculator",
                  class: "mr-2 h-4 w-4"
                }),
                createTextVNode(" " + toDisplayString(unref(result) ? "Recalculate" : "Calculate"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuotePreviewPrice.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$3, { __name: "QuotesQuotePreviewPrice" });
const minQty = 100;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuoteTweakItemModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    item: {},
    shopSlug: {}
  },
  emits: ["update:open", "updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const publicApiNoAuth = usePublicApiNoAuth();
    const loading = ref(false);
    const loadError = ref("");
    const submitting = ref(false);
    const papers = ref([]);
    const materials = ref([]);
    const finishingRates = ref([]);
    const machines = ref([]);
    const pricingMode = ref("SHEET");
    const form = reactive({
      quantity: minQty,
      sides: "SIMPLEX",
      color_mode: "COLOR",
      paper: null,
      material: null,
      machine: null,
      finishings: [],
      special_instructions: ""
    });
    const needsMachineWarning = computed(
      () => pricingMode.value === "SHEET" && machines.value.length > 0 && !form.machine
    );
    const hasAllRequiredOptions = computed(() => {
      if (pricingMode.value === "SHEET" && papers.value.length > 0 && !form.paper) return false;
      if (pricingMode.value === "SHEET" && machines.value.length > 0 && !form.machine) return false;
      if (pricingMode.value === "LARGE_FORMAT" && materials.value.length > 0 && !form.material) return false;
      return true;
    });
    const backendPriceResult = ref(null);
    const backendPriceLoading = ref(false);
    async function fetchBackendPrice() {
      const slug = props.item?.product_slug;
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
    async function loadOptions() {
      const productId = props.item?.product;
      if (!productId) return;
      loading.value = true;
      loadError.value = "";
      try {
        const opts = await publicApiNoAuth(API.publicProductOptions(productId));
        papers.value = opts.available_papers ?? [];
        materials.value = opts.available_materials ?? [];
        finishingRates.value = opts.available_finishings ?? [];
        machines.value = opts.available_machines ?? [];
        pricingMode.value = opts.pricing_mode ?? "SHEET";
        nextTick(() => {
          if (hasAllRequiredOptions.value) fetchPriceDebounced();
        });
      } catch {
        loadError.value = "Could not load options.";
      } finally {
        loading.value = false;
      }
    }
    function resetForm() {
      const i = props.item;
      if (!i) return;
      form.quantity = Math.max(minQty, i.quantity);
      form.sides = i.sides || "SIMPLEX";
      form.color_mode = i.color_mode || "COLOR";
      form.paper = i.paper ?? null;
      form.material = i.material ?? null;
      form.machine = i.machine ?? null;
      form.special_instructions = "";
      form.finishings = (i.finishings ?? []).map((f) => {
        const obj = typeof f === "object" && f && "finishing_rate" in f ? f : { finishing_rate: Number(f) };
        return { finishing_rate: obj.finishing_rate, apply_to_sides: obj.apply_to_sides };
      });
    }
    watch(() => [props.open, props.item], ([open, it]) => {
      if (open && it) {
        resetForm();
        loadOptions();
        (void 0).body.style.overflow = "hidden";
        nextTick(() => {
          if (hasAllRequiredOptions.value) fetchPriceDebounced();
        });
      } else {
        (void 0).body.style.overflow = "";
        backendPriceResult.value = null;
      }
    }, { immediate: true });
    watch(
      () => [form.quantity, form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings],
      () => {
        if (props.open && hasAllRequiredOptions.value) {
          fetchPriceDebounced();
        } else {
          backendPriceResult.value = null;
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_UCheckbox = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div><div class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"><div class="sticky top-0 z-10 bg-[var(--p-surface)]/95 backdrop-blur border-b border-[var(--p-border)] px-6 py-4 rounded-t-2xl"><div class="flex items-start justify-between gap-4"><div><h2 class="text-lg font-bold text-[var(--p-text)]">Tweak — ${ssrInterpolate(__props.item?.product_name ?? "Item")}</h2><p class="text-sm text-[var(--p-text-muted)] mt-0.5">Update options and quantity.</p></div><button class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div></div><div class="p-6 space-y-6">`);
          if (unref(loadError)) {
            _push2(`<div class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(loadError))} `);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "error",
              size: "sm",
              class: "mt-2",
              onClick: loadOptions
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
            _push2(`</div>`);
          } else {
            _push2(`<form class="space-y-5"><div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Quantity</label><div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              size: "sm",
              icon: "i-lucide-minus",
              onClick: ($event) => unref(form).quantity = Math.max(minQty, unref(form).quantity - 50)
            }, null, _parent));
            _push2(`<input${ssrRenderAttr("value", unref(form).quantity)} type="number"${ssrRenderAttr("min", minQty)} class="w-24 text-center rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              size: "sm",
              icon: "i-lucide-plus",
              onClick: ($event) => unref(form).quantity += 50
            }, null, _parent));
            _push2(`<span class="text-xs text-[var(--p-text-muted)]">min ${ssrInterpolate(minQty)}</span></div></div>`);
            if (unref(pricingMode) === "SHEET" && unref(machines).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Printing machine</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(machines), (m) => {
                _push2(`<label class="${ssrRenderClass([unref(form).machine === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).machine, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(m.name)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(pricingMode) === "SHEET" && unref(papers).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Paper</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(papers), (p) => {
                _push2(`<label class="${ssrRenderClass([unref(form).paper === p.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paper, p.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", p.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm ${ssrInterpolate(p.paper_type)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(pricingMode) === "LARGE_FORMAT" && unref(materials).length) {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Material</label><div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2"><!--[-->`);
              ssrRenderList(unref(materials), (m) => {
                _push2(`<label class="${ssrRenderClass([unref(form).material === m.id ? "bg-flamingo-50 dark:bg-flamingo-900/20" : "hover:bg-[var(--p-surface-sunken)]", "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"])}"><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).material, m.id)) ? " checked" : ""} type="radio"${ssrRenderAttr("value", m.id)} class="accent-flamingo-500"><span class="text-sm text-[var(--p-text)]">${ssrInterpolate(m.material_type ?? m.name)}</span></label>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(pricingMode) === "SHEET") {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Sides</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass(["rounded-lg border px-3 py-2 text-sm font-medium", unref(form).sides === "SIMPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)]"])}"> Single-sided </button><button type="button" class="${ssrRenderClass(["rounded-lg border px-3 py-2 text-sm font-medium", unref(form).sides === "DUPLEX" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)]"])}"> Double-sided </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(pricingMode) === "SHEET") {
              _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Color</label><div class="grid grid-cols-2 gap-2"><button type="button" class="${ssrRenderClass(["rounded-lg border px-3 py-2 text-sm font-medium", unref(form).color_mode === "COLOR" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)]"])}"> Color </button><button type="button" class="${ssrRenderClass(["rounded-lg border px-3 py-2 text-sm font-medium", unref(form).color_mode === "BW" ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700" : "border-[var(--p-border)] text-[var(--p-text-dim)]"])}"> B&amp;W </button></div></div>`);
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
              _push2(` Machine not chosen </p><p class="mt-1">Please select a printing machine above to update the quote.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Special instructions</label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(form).special_instructions,
              "onUpdate:modelValue": ($event) => unref(form).special_instructions = $event,
              placeholder: "Optional notes",
              rows: 2
            }, null, _parent));
            _push2(`</div>`);
            if (unref(hasAllRequiredOptions) && (unref(backendPriceResult)?.can_calculate || unref(backendPriceLoading))) {
              _push2(`<div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4"><div class="flex justify-between items-baseline"><span class="text-sm font-medium text-[var(--p-text-dim)]">Est. total</span><span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400 flex items-center gap-2">`);
              if (unref(backendPriceLoading)) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-loader-2",
                  class: "h-4 w-4 animate-spin"
                }, null, _parent));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(unref(backendPriceResult)?.can_calculate ? unref(formatKES)(unref(backendPriceResult).total ?? 0) : "—")}</span></div>`);
              if (unref(backendPriceResult)?.per_unit && unref(form).quantity > 0) {
                _push2(`<div class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(unref(formatKES)(unref(backendPriceResult).per_unit))} per item </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex gap-3 pt-2">`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "neutral",
              class: "flex-1",
              onClick: ($event) => emit("update:open", false)
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
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
                    name: "i-lucide-check",
                    class: "h-4 w-4 mr-1"
                  }, null, _parent2, _scopeId));
                  _push3(` Update `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-check",
                      class: "h-4 w-4 mr-1"
                    }),
                    createTextVNode(" Update ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div></form>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteTweakItemModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "QuotesQuoteTweakItemModal" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GuestSubmitModal",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    shopSlug: { default: "" }
  }, {
    "open": { type: Boolean, ...{ default: false } },
    "openModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submitted"], ["update:open"]),
  setup(__props, { emit: __emit }) {
    const isOpen = useModel(__props, "open");
    useAuthStore();
    useGuestQuoteStore();
    useQuoteDraftStore();
    useToast();
    const mode = ref("signup");
    const loading = ref(false);
    const error = ref("");
    const signInEmail = ref("");
    const signInPassword = ref("");
    const signUpFirst = ref("");
    const signUpLast = ref("");
    const signUpEmail = ref("");
    const signUpPassword = ref("");
    const signUpPasswordConfirm = ref("");
    watch(isOpen, (open) => {
      if (open) {
        mode.value = "signup";
        error.value = "";
        signInEmail.value = "";
        signInPassword.value = "";
        signUpFirst.value = "";
        signUpLast.value = "";
        signUpEmail.value = "";
        signUpPassword.value = "";
        signUpPasswordConfirm.value = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UAlert = _sfc_main$6;
      const _component_UFormField = _sfc_main$7;
      const _component_UInput = _sfc_main$8;
      const _component_UButton = _sfc_main$9;
      ssrRenderTeleport(_push, (_push2) => {
        if (isOpen.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden></div><div class="modal-panel relative w-full max-w-md bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10 overflow-hidden"><div class="px-6 py-4 border-b border-[var(--p-border)]"><div class="flex items-center justify-between"><h2 class="text-lg font-bold text-[var(--p-text)]">Sign in to submit your quote request</h2><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><p class="mt-1 text-sm text-[var(--p-text-muted)]"> By submitting, you create an account. We&#39;ll use your email to send the quote. </p></div><div class="p-6 space-y-4">`);
          if (unref(error)) {
            _push2(ssrRenderComponent(_component_UAlert, {
              color: "error",
              icon: "i-lucide-alert-circle",
              title: unref(error),
              class: "rounded-lg",
              close: "",
              "onUpdate:open": (o) => {
                if (!o) error.value = "";
              }
            }, null, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (unref(mode) === "signin") {
            _push2(`<form class="space-y-4">`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Email" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signInEmail),
                    "onUpdate:modelValue": ($event) => isRef(signInEmail) ? signInEmail.value = $event : null,
                    type: "email",
                    placeholder: "you@example.com",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signInEmail),
                      "onUpdate:modelValue": ($event) => isRef(signInEmail) ? signInEmail.value = $event : null,
                      type: "email",
                      placeholder: "you@example.com",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Password" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signInPassword),
                    "onUpdate:modelValue": ($event) => isRef(signInPassword) ? signInPassword.value = $event : null,
                    type: "password",
                    placeholder: "••••••••",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signInPassword),
                      "onUpdate:modelValue": ($event) => isRef(signInPassword) ? signInPassword.value = $event : null,
                      type: "password",
                      placeholder: "••••••••",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              block: "",
              loading: unref(loading)
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Sign in and submit `);
                } else {
                  return [
                    createTextVNode(" Sign in and submit ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<p class="text-center text-sm text-[var(--p-text-muted)]"> Don&#39;t have an account? <button type="button" class="text-flamingo-600 hover:underline font-medium"> Sign up </button></p></form>`);
          } else {
            _push2(`<form class="space-y-4"><div class="grid grid-cols-2 gap-4">`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "First name" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signUpFirst),
                    "onUpdate:modelValue": ($event) => isRef(signUpFirst) ? signUpFirst.value = $event : null,
                    placeholder: "John",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signUpFirst),
                      "onUpdate:modelValue": ($event) => isRef(signUpFirst) ? signUpFirst.value = $event : null,
                      placeholder: "John",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Last name" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signUpLast),
                    "onUpdate:modelValue": ($event) => isRef(signUpLast) ? signUpLast.value = $event : null,
                    placeholder: "Doe",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signUpLast),
                      "onUpdate:modelValue": ($event) => isRef(signUpLast) ? signUpLast.value = $event : null,
                      placeholder: "Doe",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Email" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signUpEmail),
                    "onUpdate:modelValue": ($event) => isRef(signUpEmail) ? signUpEmail.value = $event : null,
                    type: "email",
                    placeholder: "you@example.com",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signUpEmail),
                      "onUpdate:modelValue": ($event) => isRef(signUpEmail) ? signUpEmail.value = $event : null,
                      type: "email",
                      placeholder: "you@example.com",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Password" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signUpPassword),
                    "onUpdate:modelValue": ($event) => isRef(signUpPassword) ? signUpPassword.value = $event : null,
                    type: "password",
                    placeholder: "Min 8 chars, 1 uppercase, 1 number",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signUpPassword),
                      "onUpdate:modelValue": ($event) => isRef(signUpPassword) ? signUpPassword.value = $event : null,
                      type: "password",
                      placeholder: "Min 8 chars, 1 uppercase, 1 number",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Confirm password" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(signUpPasswordConfirm),
                    "onUpdate:modelValue": ($event) => isRef(signUpPasswordConfirm) ? signUpPasswordConfirm.value = $event : null,
                    type: "password",
                    placeholder: "••••••••",
                    required: ""
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(signUpPasswordConfirm),
                      "onUpdate:modelValue": ($event) => isRef(signUpPasswordConfirm) ? signUpPasswordConfirm.value = $event : null,
                      type: "password",
                      placeholder: "••••••••",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              block: "",
              loading: unref(loading)
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Create account and submit `);
                } else {
                  return [
                    createTextVNode(" Create account and submit ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<p class="text-center text-sm text-[var(--p-text-muted)]"> Already have an account? <button type="button" class="text-flamingo-600 hover:underline font-medium"> Sign in </button></p></form>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/GuestSubmitModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "QuotesGuestSubmitModal" });
const MIN_QUANTITY = 100;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quote-draft",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const authStore = useAuthStore$1();
    const quoteDraftStore = useQuoteDraftStore();
    const guestQuoteStore = useGuestQuoteStore();
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isGuest = computed(() => !isAuthenticated.value && guestQuoteStore.hasItems);
    const displayDraft = computed(() => {
      if (isAuthenticated.value && quoteDraftStore.activeDraft) {
        const d = quoteDraftStore.activeDraft;
        return {
          id: d.id,
          shop_name: d.shop_name,
          shop_slug: quoteDraftStore.currentShopSlug ?? "",
          items: d.items ?? []
        };
      }
      const g = guestQuoteStore.quote;
      if (g) {
        const items = g.items.map((i) => ({
          ...i,
          item_type: "PRODUCT",
          product_name: i.product_name,
          unit_price: void 0,
          line_total: void 0
        }));
        return {
          id: 0,
          shop_name: g.shopName,
          shop_slug: g.shopSlug,
          items
        };
      }
      return null;
    });
    const toast = useToast();
    const canEdit = computed(() => {
      if (isGuest.value) return true;
      return quoteDraftStore.activeDraft?.status === "DRAFT";
    });
    const draft = computed(() => isAuthenticated.value ? quoteDraftStore.activeDraft : null);
    const displayCurrency = computed(() => draft.value?.shop_currency ?? "KES");
    const computedSubtotal = computed(() => {
      const d = draft.value;
      if (!d) return null;
      const t = d.totals;
      if (t && typeof t === "object" && typeof t.subtotal === "string") return t.subtotal;
      const sum = d.items?.reduce((acc, i) => acc + (parseFloat(String(i.line_total || 0)) || 0), 0);
      return sum > 0 ? String(sum) : null;
    });
    const computedTotal = computed(() => {
      const d = draft.value;
      if (!d) return null;
      const t = d.totals;
      if (typeof t === "number") return String(t);
      if (t && typeof t === "object" && typeof t.total === "string") return t.total;
      return computedSubtotal.value;
    });
    const mutatingItemId = ref(null);
    const mutatingAction = ref("qty");
    const submitting = ref(false);
    const tweakModalOpen = ref(false);
    const tweakItem = ref(null);
    const submitModalOpen = ref(false);
    async function onGuestSubmitted(quoteId) {
      submitModalOpen.value = false;
      await navigateTo(`/quotes/${quoteId}`);
    }
    async function onRequestQuote() {
      if (!draft.value || !canEdit.value) return;
      submitting.value = true;
      try {
        const updated = await quoteDraftStore.submitDraft();
        if (updated) {
          toast.add({ title: "Request sent to the shop", description: "The shop will review and get back to you." });
          await navigateTo(`/quotes/${updated.id}`);
        }
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to submit", color: "error" });
      } finally {
        submitting.value = false;
      }
    }
    async function onQtyChange(item, delta) {
      if (!canEdit.value) return;
      const newQty = Math.max(MIN_QUANTITY, item.quantity + delta);
      mutatingItemId.value = item.id;
      mutatingAction.value = "qty";
      try {
        if (isGuest.value && typeof item.id === "string") {
          guestQuoteStore.updateItemQty(item.id, newQty);
        } else {
          await quoteDraftStore.updateItemQty(item.id, newQty);
        }
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to update", color: "error" });
      } finally {
        mutatingItemId.value = null;
      }
    }
    async function onRemove(item) {
      if (!canEdit.value) return;
      mutatingItemId.value = item.id;
      mutatingAction.value = "remove";
      try {
        if (isGuest.value && typeof item.id === "string") {
          guestQuoteStore.removeItem(item.id);
        } else {
          await quoteDraftStore.removeItemFromDraft(item.id);
        }
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to remove", color: "error" });
      } finally {
        mutatingItemId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_QuotesQuotePreviewPrice = __nuxt_component_3;
      const _component_QuotesQuoteTweakItemModal = __nuxt_component_4;
      const _component_QuotesGuestSubmitModal = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-amber-50/80 dark:bg-stone-950" }, _attrs))}><div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]"> Quote Draft </h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/shops",
        variant: "outline",
        color: "neutral"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Browse shops `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-store",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Browse shops ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(isAuthenticated) && unref(quoteDraftStore).isLoading && !unref(quoteDraftStore).activeDraft) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(displayDraft)) {
        _push(`<!--[--><div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden"><div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40"><h2 class="font-semibold text-stone-800 dark:text-stone-100">${ssrInterpolate(unref(displayDraft).shop_name)}</h2><p class="text-sm text-stone-500 dark:text-stone-400">${ssrInterpolate(unref(canEdit) ? unref(isGuest) ? "Items in your draft — sign in to submit" : "Items in your draft" : "Quote is locked")}</p></div><ul class="divide-y divide-amber-200/60 dark:divide-amber-800/40"><!--[-->`);
        ssrRenderList(unref(displayDraft).items, (item) => {
          _push(`<li class="px-6 py-4"><div class="flex items-start justify-between gap-4"><div class="min-w-0 flex-1"><p class="font-medium text-stone-800 dark:text-stone-100">${ssrInterpolate(item.item_type === "CUSTOM" ? item.title : item.product_name ?? "Product")}</p><p class="text-sm text-stone-500 dark:text-stone-400">${ssrInterpolate(item.item_type === "CUSTOM" ? item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm` : item.pricing_mode ?? "")}</p>`);
          if (item.unit_price || item.line_total) {
            _push(`<p class="mt-1 text-xs text-stone-400 dark:text-stone-500"> Unit: ${ssrInterpolate(unref(formatCurrency)(item.unit_price, unref(displayCurrency)))} · Total: ${ssrInterpolate(unref(formatCurrency)(item.line_total, unref(displayCurrency)))}</p>`);
          } else if (unref(isGuest)) {
            _push(`<p class="mt-1 text-xs text-stone-400 dark:text-stone-500"> Est. pending — sign in to get pricing </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex items-center gap-3 shrink-0"><div class="flex items-center gap-1 rounded-lg border border-amber-200/80 dark:border-amber-700/50">`);
          _push(ssrRenderComponent(_component_UButton, {
            disabled: !unref(canEdit),
            loading: unref(mutatingItemId) === item.id && unref(mutatingAction) === "qty",
            variant: "soft",
            size: "xs",
            color: "neutral",
            icon: "i-lucide-minus",
            class: "rounded-r-none",
            onClick: ($event) => onQtyChange(item, -10)
          }, null, _parent));
          _push(`<input type="number"${ssrRenderAttr("value", item.quantity)}${ssrRenderAttr("min", MIN_QUANTITY)}${ssrIncludeBooleanAttr(!unref(canEdit)) ? " disabled" : ""} class="w-16 text-center text-sm font-medium text-stone-700 dark:text-stone-300 bg-transparent border-none outline-none appearance-none [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none">`);
          _push(ssrRenderComponent(_component_UButton, {
            disabled: !unref(canEdit),
            loading: unref(mutatingItemId) === item.id && unref(mutatingAction) === "qty",
            variant: "soft",
            size: "xs",
            color: "neutral",
            icon: "i-lucide-plus",
            class: "rounded-l-none",
            onClick: ($event) => onQtyChange(item, 10)
          }, null, _parent));
          _push(`</div>`);
          if (unref(canEdit) && !unref(isGuest) && item.item_type === "PRODUCT" && item.product) {
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "xs",
              color: "primary",
              onClick: ($event) => {
                tweakItem.value = item;
                tweakModalOpen.value = true;
              }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-3.5 w-3.5 mr-1"
                  }, null, _parent2, _scopeId));
                  _push2(` Tweak `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-sliders-horizontal",
                      class: "h-3.5 w-3.5 mr-1"
                    }),
                    createTextVNode(" Tweak ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_UButton, {
            disabled: !unref(canEdit),
            loading: unref(mutatingItemId) === item.id && unref(mutatingAction) === "remove",
            variant: "soft",
            size: "xs",
            color: "error",
            icon: "i-lucide-trash-2",
            onClick: ($event) => onRemove(item)
          }, null, _parent));
          _push(`</div></div></li>`);
        });
        _push(`<!--]--></ul><div class="px-6 py-4 border-t border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-stone-800/50"><div class="flex justify-between text-sm text-stone-600 dark:text-stone-400"><span>Subtotal</span><span>${ssrInterpolate(unref(isGuest) ? "—" : unref(formatCurrency)(unref(computedSubtotal), unref(displayCurrency)))}</span></div><div class="mt-2 flex justify-between font-semibold text-stone-800 dark:text-stone-100"><span>Total</span><span>${ssrInterpolate(unref(isGuest) ? "Est. pending" : unref(formatCurrency)(unref(computedTotal), unref(displayCurrency)))}</span></div></div></div>`);
        if (!unref(isGuest)) {
          _push(`<div class="mt-8">`);
          _push(ssrRenderComponent(_component_QuotesQuotePreviewPrice, {
            "draft-id": unref(displayDraft).id,
            "has-items": (unref(displayDraft).items?.length ?? 0) > 0
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="mt-8 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 p-6"><p class="text-sm text-stone-600 dark:text-stone-400"> Sign in and submit to get a price estimate from the shop. </p></div>`);
        }
        if (!unref(isGuest)) {
          _push(ssrRenderComponent(_component_QuotesQuoteTweakItemModal, {
            open: unref(tweakModalOpen),
            "onUpdate:open": ($event) => isRef(tweakModalOpen) ? tweakModalOpen.value = $event : null,
            item: unref(tweakItem),
            "shop-slug": unref(displayDraft)?.shop_slug ?? "",
            onUpdated: ($event) => {
              unref(quoteDraftStore).refreshDraft();
              tweakItem.value = null;
            }
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(canEdit) && (unref(displayDraft).items?.length ?? 0) > 0) {
          _push(`<div class="mt-8 space-y-3">`);
          if (unref(isGuest)) {
            _push(`<p class="text-xs text-stone-500 dark:text-stone-400"> By submitting, you create an account. We&#39;ll use your email to send the quote. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            size: "lg",
            block: "",
            loading: unref(submitting),
            onClick: ($event) => unref(isGuest) ? submitModalOpen.value = true : onRequestQuote()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-send",
                  class: "mr-2 h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(unref(isGuest) ? "Sign in to submit" : "Request Quote")}`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-send",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" " + toDisplayString(unref(isGuest) ? "Sign in to submit" : "Request Quote"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_QuotesGuestSubmitModal, {
          open: unref(submitModalOpen),
          "onUpdate:open": ($event) => isRef(submitModalOpen) ? submitModalOpen.value = $event : null,
          "shop-slug": unref(displayDraft).shop_slug,
          onSubmitted: onGuestSubmitted
        }, null, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<div class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-shopping-cart",
          class: "mx-auto h-16 w-16 text-amber-200 dark:text-amber-800"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No items in your draft</h3><p class="mt-2 text-sm text-stone-500 dark:text-stone-400">Browse shops, add products, or request a custom print to get a quote.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          color: "primary",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Browse shops`);
            } else {
              return [
                createTextVNode("Browse shops")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote-draft.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quote-draft-D90giRUS.mjs.map
