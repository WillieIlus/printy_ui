import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { f as useRoute, c as useAuthStore, j as useToast, g as useAnalyticsTracking, _ as __nuxt_component_3$1, a as _sfc_main$f, d as _sfc_main$9, J as __nuxt_component_5$1, e as useRuntimeConfig, h as usePublicApi, A as API } from './server.mjs';
import { u as useFavoritesStore, _ as __nuxt_component_3$2 } from './ShopFavoriteToggle-Cbi9rEA3.mjs';
import { _ as __nuxt_component_4 } from './ShopStatusBadge-DBjFhl47.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, isRef, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as __nuxt_component_6$1 } from './RichTextDisplay-CnD11EO8.mjs';
import { a as formatKES } from './formatters-r_qbKRfS.mjs';
import { _ as _sfc_main$6 } from './Textarea-C3ixaFu9.mjs';
import { r as rateShop } from './ratings-CW7X2UfE.mjs';
import { u as useApi } from './useApi-4DUqRt-r.mjs';
import { _ as _sfc_main$7 } from './FormField-DQkJuMh6.mjs';
import { _ as _sfc_main$8 } from './Input-C14QBOm-.mjs';
import { _ as _sfc_main$a } from './SelectMenu-C6Eyp_GI.mjs';
import { _ as _sfc_main$b } from './Checkbox-S5HrhTVg.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-CWZem6wV.mjs';
import { _ as __nuxt_component_9, u as useProductPriceDisplay } from './ProductTweakModal-DTcQxKaX.mjs';
import { u as usePricingStore } from './pricing-BwHzPGP8.mjs';
import { listQuoteRequests } from './quoteDraft-JSimLcx7.mjs';
import { u as usePrintySeo } from './usePrintySeo-e9OTkeHK.mjs';
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
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './Badge-DRRvJchD.mjs';
import './QuoteConfigSection-2YjsyAVn.mjs';
import './gallery-BkPMGgTl.mjs';

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ShopRatingSummary",
  __ssrInlineRender: true,
  props: {
    summary: {}
  },
  setup(__props) {
    function formatRating(avg) {
      return avg.toFixed(1);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      if (__props.summary && __props.summary.count > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 text-amber-300 dark:text-amber-400" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: "h-4 w-4 fill-current"
        }, null, _parent));
        _push(`<span class="text-sm font-medium tabular-nums">${ssrInterpolate(formatRating(__props.summary.average))}</span><span class="text-xs text-white/70 dark:text-[var(--p-text-muted)]">(${ssrInterpolate(__props.summary.count)})</span></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopRatingSummary.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$5, { __name: "ShopsShopRatingSummary" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ShopWorkingHours",
  __ssrInlineRender: true,
  props: {
    hours: {}
  },
  setup(__props) {
    const WEEKDAYS = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday"
    };
    function dayLabel(weekday) {
      return WEEKDAYS[weekday] ?? `Day ${weekday}`;
    }
    function formatTime(time) {
      if (!time) return "--";
      return time.length > 5 ? time.slice(0, 5) : time;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-white/12 bg-white/10 px-4 py-2 backdrop-blur-sm dark:border-[var(--p-border)] dark:bg-[var(--p-surface-container-low)]/70" }, _attrs))}><p class="mb-1.5 text-xs font-medium text-white/72 dark:text-[var(--p-text-muted)]">Working hours</p><div class="space-y-1"><!--[-->`);
      ssrRenderList(__props.hours, (h) => {
        _push(`<div class="flex justify-between text-sm"><span class="text-white/72 dark:text-[var(--p-text-muted)]">${ssrInterpolate(h.weekday_display ?? dayLabel(h.weekday))}</span><span class="tabular-nums text-white/92 dark:text-[var(--p-text-dim)]">${ssrInterpolate(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopWorkingHours.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$4, { __name: "ShopsShopWorkingHours" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RateCardDisplay",
  __ssrInlineRender: true,
  props: {
    rateCard: {},
    shopName: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl" }, _attrs))}>`);
      if (__props.shopName) {
        _push(`<h2 class="mb-6 text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(__props.shopName)} Rate Card </h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">`);
      if (__props.rateCard.paper?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-stack",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Paper (per sheet) </h3><p class="mt-0.5 text-xs text-[var(--p-text-muted)]"> Includes printing. Single = 1 side, Double = 2 sides. </p></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">GSM</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.paper, (price, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(price.gsm)} gsm</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.paper_type)}</td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatKES)(price.single_price))}</span></td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatKES)(price.double_price))}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-6">`);
      if (__props.rateCard.printing?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-printer",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Printing (per side) </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Size</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.printing, (price, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(price.sheet_size)}</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.color_mode)}</td><td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatKES)(price.price_per_side))}</td><td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatKES)(price.price_double_sided))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.rateCard.finishing?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-scissors",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Finishing </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Service</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Unit</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Price</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.finishing, (service, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(service.name)} `);
          if (service.category) {
            _push(`<span class="block text-xs text-[var(--p-text-muted)]">${ssrInterpolate(service.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(service.charge_by)}</td><td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatKES)(service.price))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (!__props.rateCard.printing?.length && !__props.rateCard.paper?.length && !__props.rateCard.finishing?.length) {
        _push(`<div class="py-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-receipt",
          class: "mx-auto h-12 w-12 text-amber-300 dark:text-amber-700"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No pricing available</h3><p class="mt-1 text-sm text-[var(--p-text-muted)]">This shop hasn&#39;t set up their pricing yet.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/RateCardDisplay.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$3, { __name: "PricingRateCardDisplay" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ShopRateForm",
  __ssrInlineRender: true,
  props: {
    shopId: {}
  },
  setup(__props) {
    const props = __props;
    const stars = ref(0);
    const comment = ref("");
    const submitting = ref(false);
    const submitted = ref(false);
    const toast = useToast();
    const api = useApi();
    async function onSubmit() {
      if (stars.value < 1) return;
      submitting.value = true;
      try {
        await rateShop(props.shopId, { stars: stars.value, comment: comment.value || void 0 }, api);
        submitted.value = true;
        toast.add({ title: "Rating submitted", color: "success" });
      } catch {
        toast.add({ title: "Could not submit rating", color: "error" });
      } finally {
        submitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UTextarea = _sfc_main$6;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4" }, _attrs))}><h4 class="mb-2 text-sm font-semibold text-[var(--p-text)]">Rate this shop</h4><p class="mb-3 text-xs text-[var(--p-text-muted)]">You received a quote from this shop. Share your experience.</p><div class="flex flex-wrap items-center gap-3"><div class="flex gap-1"><!--[-->`);
      ssrRenderList(5, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([s <= unref(stars) ? "text-amber-500 dark:text-amber-400" : "text-[var(--p-border-dim)] dark:text-[var(--p-text-muted)]/45", "p-1 rounded transition-colors hover:bg-amber-200/60 dark:hover:bg-amber-700/40"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: ["h-5 w-5", s <= unref(stars) && "fill-current"]
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(comment),
        "onUpdate:modelValue": ($event) => isRef(comment) ? comment.value = $event : null,
        placeholder: "Optional comment...",
        rows: 2,
        class: "min-w-[200px] max-w-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        loading: unref(submitting),
        disabled: unref(stars) < 1,
        onClick: onSubmit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Submit `);
          } else {
            return [
              createTextVNode(" Submit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(submitted)) {
        _push(`<p class="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Thanks for your feedback!</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopRateForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$2, { __name: "ShopsShopRateForm" });
function useApiError() {
  function normalize(err, fallbackTitle = "Error") {
    const defaultError = {
      title: fallbackTitle,
      message: "Something went wrong. Please try again.",
      code: "UNKNOWN",
      fieldErrors: {},
      reason: "",
      retryable: true
    };
    if (!err || typeof err !== "object") {
      return defaultError;
    }
    const e = err;
    const responseData = e.data ?? e.response?._data;
    const status = e.statusCode ?? e.status ?? 500;
    if (typeof responseData === "object" && responseData !== null) {
      const obj = responseData;
      const code = obj.code || _statusToCode(status);
      const message = obj.message || defaultError.message;
      const reason = obj.reason || "";
      const fieldErrors = {};
      const rawFieldErrors = obj.field_errors ?? obj.fieldErrors;
      if (rawFieldErrors && typeof rawFieldErrors === "object") {
        for (const [k, v] of Object.entries(rawFieldErrors)) {
          fieldErrors[k] = Array.isArray(v) ? v : [String(v)];
        }
      }
      const retryable = status >= 500 || status === 408 || code === "NETWORK_ERROR";
      return {
        title: _codeToTitle(code),
        message,
        code,
        fieldErrors,
        reason: reason || _reasonForCode(code),
        retryable
      };
    }
    if (err instanceof Error) {
      return {
        ...defaultError,
        message: err.message,
        code: "NETWORK_ERROR",
        retryable: true
      };
    }
    return {
      ...defaultError,
      code: _statusToCode(status),
      retryable: status >= 500
    };
  }
  return { normalize };
}
function _statusToCode(status) {
  const map = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    408: "TIMEOUT",
    409: "CONFLICT",
    500: "SERVER_ERROR"
  };
  return map[status] || "ERROR";
}
function _codeToTitle(code) {
  const map = {
    VALIDATION_ERROR: "Please fix the errors below",
    BAD_REQUEST: "Invalid request",
    UNAUTHORIZED: "Sign in required",
    FORBIDDEN: "Permission denied",
    NOT_FOUND: "Not found",
    CONFLICT: "Conflict",
    SERVER_ERROR: "Server error",
    NETWORK_ERROR: "Connection error"
  };
  return map[code] || "Error";
}
function _reasonForCode(code) {
  const map = {
    UNAUTHORIZED: "Please sign in to save this quote.",
    FORBIDDEN: "You don't have permission for this action.",
    NOT_FOUND: "The requested resource was not found.",
    SERVER_ERROR: "Something went wrong. Please try again.",
    NETWORK_ERROR: "Could not reach the server. Check your connection."
  };
  return map[code] || "";
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CustomPrintModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    shopSlug: {},
    paperOptions: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const loadError = ref("");
    const submitError = ref("");
    const emit = __emit;
    useQuoteDraftStore();
    useToast();
    const saving = ref(false);
    const form = reactive({
      title: "Custom Artwork Print",
      width_cm: 14,
      height_cm: 17,
      quantity: 400,
      paperId: null,
      paperSpec: "",
      sides: "SIMPLEX",
      color_mode: "COLOR",
      has_artwork: false,
      spec_text: ""
    });
    const sidesOptions = [
      { value: "SIMPLEX", label: "Simplex (1-sided)" },
      { value: "DUPLEX", label: "Duplex (2-sided)" }
    ];
    const colorModeOptions = [
      { value: "BW", label: "Black & White" },
      { value: "COLOR", label: "Color" }
    ];
    const paperOptionsFromApi = ref([]);
    const paperOptions = computed(() => props.paperOptions?.length ? props.paperOptions : paperOptionsFromApi.value);
    async function loadOptions() {
      loadError.value = "";
      try {
        const publicApi = usePublicApi();
        const data = await publicApi(
          API.publicShopCustomOptions(props.shopSlug)
        );
        paperOptionsFromApi.value = (data.available_papers ?? []).map((p) => ({
          value: p.id,
          label: `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}`
        }));
      } catch (err) {
        const { normalize } = useApiError();
        loadError.value = normalize(err, "Could not load options").message;
      }
    }
    watch(() => [props.modelValue, props.shopSlug], ([open, slug]) => {
      if (open && slug) loadOptions();
    }, { immediate: true });
    watch(() => props.modelValue, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    function onKeydown(e) {
      if (e.key === "Escape") emit("update:modelValue", false);
    }
    watch(() => props.modelValue, (open) => {
      if (open) (void 0).addEventListener("keydown", onKeydown);
      else (void 0).removeEventListener("keydown", onKeydown);
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_UFormField = _sfc_main$7;
      const _component_UInput = _sfc_main$8;
      const _component_USelectMenu = _sfc_main$a;
      const _component_UCheckbox = _sfc_main$b;
      const _component_UTextarea = _sfc_main$6;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div><div class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"><div class="sticky top-0 z-10 bg-[var(--p-surface)]/95 backdrop-blur-sm border-b border-[var(--p-border)] px-6 py-4 rounded-t-2xl"><div class="flex items-start justify-between gap-4"><div><h2 class="text-lg font-bold text-[var(--p-text)]"> Request Custom Print </h2><p class="text-sm text-[var(--p-text-muted)] mt-0.5"> Specify your custom print job. Niko na design yangu = I already have artwork. </p></div><button class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors">`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div></div><div class="min-h-[200px] p-6 space-y-4">`);
          if (unref(loadError)) {
            _push2(`<div class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200">${ssrInterpolate(unref(loadError))} `);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "link",
              size: "xs",
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
          } else if (unref(submitError)) {
            _push2(`<div class="rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20 p-3 text-sm text-red-800 dark:text-red-200">${ssrInterpolate(unref(submitError))} <p class="text-xs mt-1">Your entered values are preserved. You can fix and try again.</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<form class="space-y-4">`);
          _push2(ssrRenderComponent(_component_UFormField, {
            label: "Title",
            required: ""
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(form).title,
                  "onUpdate:modelValue": ($event) => unref(form).title = $event,
                  placeholder: "e.g. Custom Artwork Print",
                  required: ""
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UInput, {
                    modelValue: unref(form).title,
                    "onUpdate:modelValue": ($event) => unref(form).title = $event,
                    placeholder: "e.g. Custom Artwork Print",
                    required: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div class="grid grid-cols-2 gap-4">`);
          _push2(ssrRenderComponent(_component_UFormField, {
            label: "Width (cm)",
            required: ""
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(form).width_cm,
                  "onUpdate:modelValue": ($event) => unref(form).width_cm = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: "0.1",
                  step: "0.1",
                  placeholder: "14",
                  required: ""
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UInput, {
                    modelValue: unref(form).width_cm,
                    "onUpdate:modelValue": ($event) => unref(form).width_cm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0.1",
                    step: "0.1",
                    placeholder: "14",
                    required: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_UFormField, {
            label: "Height (cm)",
            required: ""
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(form).height_cm,
                  "onUpdate:modelValue": ($event) => unref(form).height_cm = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: "0.1",
                  step: "0.1",
                  placeholder: "17",
                  required: ""
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UInput, {
                    modelValue: unref(form).height_cm,
                    "onUpdate:modelValue": ($event) => unref(form).height_cm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0.1",
                    step: "0.1",
                    placeholder: "17",
                    required: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div>`);
          _push2(ssrRenderComponent(_component_UFormField, {
            label: "Quantity",
            required: ""
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(form).quantity,
                  "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  min: "1",
                  placeholder: "400",
                  required: ""
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UInput, {
                    modelValue: unref(form).quantity,
                    "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    placeholder: "400",
                    required: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(paperOptions).length) {
            _push2(ssrRenderComponent(_component_UFormField, { label: "Paper" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).paperId,
                    "onUpdate:modelValue": ($event) => unref(form).paperId = $event,
                    items: unref(paperOptions),
                    "value-key": "value",
                    placeholder: "Select paper"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).paperId,
                      "onUpdate:modelValue": ($event) => unref(form).paperId = $event,
                      items: unref(paperOptions),
                      "value-key": "value",
                      placeholder: "Select paper"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(ssrRenderComponent(_component_UFormField, { label: "Paper / specs" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).paperSpec,
                    "onUpdate:modelValue": ($event) => unref(form).paperSpec = $event,
                    placeholder: "e.g. 200gsm duplex"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).paperSpec,
                      "onUpdate:modelValue": ($event) => unref(form).paperSpec = $event,
                      placeholder: "e.g. 200gsm duplex"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push2(ssrRenderComponent(_component_UFormField, { label: "Sides" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_USelectMenu, {
                  modelValue: unref(form).sides,
                  "onUpdate:modelValue": ($event) => unref(form).sides = $event,
                  items: sidesOptions,
                  "value-key": "value"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).sides,
                    "onUpdate:modelValue": ($event) => unref(form).sides = $event,
                    items: sidesOptions,
                    "value-key": "value"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_UFormField, { label: "Color mode" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_USelectMenu, {
                  modelValue: unref(form).color_mode,
                  "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                  items: colorModeOptions,
                  "value-key": "value"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).color_mode,
                    "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                    items: colorModeOptions,
                    "value-key": "value"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div class="flex items-center gap-2">`);
          _push2(ssrRenderComponent(_component_UCheckbox, {
            modelValue: unref(form).has_artwork,
            "onUpdate:modelValue": ($event) => unref(form).has_artwork = $event
          }, null, _parent));
          _push2(`<span class="text-sm">Niko na design yangu (I already have artwork)</span></div>`);
          _push2(ssrRenderComponent(_component_UFormField, { label: "Notes / spec text" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_UTextarea, {
                  modelValue: unref(form).spec_text,
                  "onUpdate:modelValue": ($event) => unref(form).spec_text = $event,
                  placeholder: "e.g. 14cm by 17cm, 200gsm duplex, 400pcs",
                  rows: 3
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UTextarea, {
                    modelValue: unref(form).spec_text,
                    "onUpdate:modelValue": ($event) => unref(form).spec_text = $event,
                    placeholder: "e.g. 14cm by 17cm, 200gsm duplex, 400pcs",
                    rows: 3
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div class="flex justify-end gap-2 pt-4">`);
          _push2(ssrRenderComponent(_component_UButton, {
            variant: "ghost",
            onClick: ($event) => _ctx.$emit("update:modelValue", false)
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
            loading: unref(saving)
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Add to Quote Draft`);
              } else {
                return [
                  createTextVNode("Add to Quote Draft")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></form></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/CustomPrintModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$1, { __name: "QuotesCustomPrintModal" });
function stripHtmlToText(html) {
  if (html == null || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
const RATABLE_STATUSES = ["SENT", "ACCEPTED"];
function useRatableShops() {
  const ratableShopIds = ref(/* @__PURE__ */ new Set());
  const loaded = ref(false);
  async function load() {
    try {
      const quotes = await listQuoteRequests();
      ratableShopIds.value = new Set(
        quotes.filter((q) => RATABLE_STATUSES.includes(q.status)).map((q) => q.shop)
      );
    } catch {
      ratableShopIds.value = /* @__PURE__ */ new Set();
    } finally {
      loaded.value = true;
    }
  }
  function canRate(shopId) {
    return ratableShopIds.value.has(shopId);
  }
  return { ratableShopIds, loaded, load, canRate };
}
const heroHeaderStyle = "background: linear-gradient(135deg, rgba(8, 24, 52, 0.98) 0%, rgba(13, 37, 73, 0.94) 48%, rgba(16, 64, 116, 0.92) 100%);";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const quoteDraftStore = useQuoteDraftStore();
    useAuthStore();
    useFavoritesStore();
    const { canRate } = useRatableShops();
    const toast = useToast();
    const { getMediaUrl } = useApi();
    const { trackProductView, trackQuoteStart, trackShopView } = useAnalyticsTracking();
    const catalog = ref(null);
    const loading = ref(true);
    const customModalOpen = ref(false);
    const ratingSummary = ref(null);
    const pricingStore = usePricingStore();
    const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id));
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    const trackedShopSlug = ref(null);
    function openTweak(product) {
      tweakProduct.value = product;
      void trackProductView({
        source: "shop_catalog_tweak",
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        shop_slug: slug.value
      }, {
        onceKey: `shop-product-view:${slug.value}:${product.id}`
      });
      void trackQuoteStart({
        source: "shop_catalog_tweak",
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        shop_slug: slug.value
      }, {
        onceKey: `shop-quote-start:${slug.value}:${product.id}`
      });
      tweakModalOpen.value = true;
    }
    function onItemAdded() {
      toast.add({ title: "Added to draft", description: `${tweakProduct.value?.name ?? "Product"} added to your draft.` });
    }
    watch([loading, catalog], ([isLoading, currentCatalog]) => {
      if (isLoading || !currentCatalog?.shop || trackedShopSlug.value === currentCatalog.shop.slug) {
        return;
      }
      trackedShopSlug.value = currentCatalog.shop.slug;
      void trackShopView({
        source: "shop_catalog_page",
        shop_id: currentCatalog.shop.id,
        shop_slug: currentCatalog.shop.slug,
        shop_name: currentCatalog.shop.name,
        product_count: currentCatalog.products.length
      });
    }, { immediate: true });
    watch(customModalOpen, (open) => {
      if (!open || !catalog.value?.shop) {
        return;
      }
      void trackQuoteStart({
        source: "shop_custom_request_modal",
        shop_id: catalog.value.shop.id,
        shop_slug: catalog.value.shop.slug,
        shop_name: catalog.value.shop.name
      }, {
        onceKey: `shop-custom-quote-start:${catalog.value.shop.slug}`
      });
    });
    function productImageUrl(product) {
      const path = product.primary_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
    }
    function turnaroundBadge(days) {
      return `${days} day${days === 1 ? "" : "s"}`;
    }
    function productCardDescription(product) {
      const parts = [];
      if (product.category) parts.push(product.category);
      if (product.final_size) parts.push(product.final_size);
      if (product.min_quantity) parts.push(`from ${product.min_quantity} pcs`);
      if (!parts.length) return "Configured by this shop and ready for live quote adjustments.";
      return `${parts.join(" - ")}. Ready for live quote adjustments.`;
    }
    const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay();
    const shopTurnaround = computed(() => {
      const days = (catalog.value?.products ?? []).map((product) => product.turnaround_days).filter((value) => typeof value === "number" && value > 0);
      if (!days.length) return "Ask shop";
      const min = Math.min(...days);
      const max = Math.max(...days);
      if (min === max) return turnaroundBadge(min);
      return `${min}-${max} days`;
    });
    const shopStats = computed(() => [
      {
        label: "Products",
        value: String(catalog.value?.products.length ?? 0),
        icon: "i-lucide-package-2"
      },
      {
        label: "Rating",
        value: ratingSummary.value?.average ? `${ratingSummary.value.average.toFixed(1)}/5` : "New",
        icon: "i-lucide-star"
      },
      {
        label: "Turnaround",
        value: shopTurnaround.value,
        icon: "i-lucide-timer-reset"
      }
    ]);
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    const shopNotFound = computed(() => !loading.value && !catalog.value?.shop);
    usePrintySeo(() => ({
      title: catalog.value?.shop?.name ?? "Shop",
      description: (() => {
        const desc = catalog.value?.shop?.description;
        if (!desc) return `Browse ${catalog.value?.shop?.name ?? "print shop"} products. Get instant quotes for business cards, flyers, posters.`;
        const plain = stripHtmlToText(desc);
        if (!plain) return `Browse ${catalog.value?.shop?.name ?? "print shop"} products. Get instant quotes for business cards, flyers, posters.`;
        return plain.length > 155 ? `${plain.slice(0, 155)}...` : plain;
      })(),
      path: `/shops/${slug.value}`,
      noIndex: shopNotFound.value,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Shops", path: "/shops" },
        { name: catalog.value?.shop?.name ?? "Shop", path: `/shops/${slug.value}` }
      ],
      schema: catalog.value?.shop ? [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: catalog.value.shop.name,
          description: catalog.value.shop.description ? stripHtmlToText(catalog.value.shop.description) || void 0 : void 0,
          url: `${siteUrl}/shops/${slug.value}`
        }
      ] : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ShopsShopFavoriteToggle = __nuxt_component_3$2;
      const _component_ShopsShopStatusBadge = __nuxt_component_4;
      const _component_ShopsShopRatingSummary = __nuxt_component_5;
      const _component_ShopsShopWorkingHours = __nuxt_component_6;
      const _component_EditorRichTextDisplay = __nuxt_component_6$1;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtImg = __nuxt_component_5$1;
      const _component_PricingRateCardDisplay = __nuxt_component_10;
      const _component_ShopsShopRateForm = __nuxt_component_11;
      const _component_QuotesCustomPrintModal = __nuxt_component_12;
      const _component_QuotesProductTweakModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#e9f0fb_0%,#f4f8fd_24%,#eef4fb_56%,#f8fafc_100%)] dark:bg-[#081120]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(catalog)?.shop) {
        _push(`<!--[--><section class="overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white/80 shadow-[0_32px_90px_-52px_rgba(8,24,52,0.42)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90"><div style="${ssrRenderStyle(heroHeaderStyle)}" class="border-b border-sky-100/80 px-6 py-6 text-white dark:border-slate-800 sm:px-8"><div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.95fr)]"><div class="min-w-0"><div class="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "transition-colors hover:text-sky-50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Home`);
            } else {
              return [
                createTextVNode("Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span>/</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shops",
          class: "transition-colors hover:text-sky-50"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Shops`);
            } else {
              return [
                createTextVNode("Shops")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span>/</span><span class="text-white">${ssrInterpolate(unref(catalog).shop.name)}</span></div><div class="flex flex-wrap items-start gap-3"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_16px_32px_-22px_rgba(15,23,42,0.95)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-7 w-7"
        }, null, _parent));
        _push(`</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-3"><h1 class="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">${ssrInterpolate(unref(catalog).shop.name)}</h1>`);
        _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
          "shop-id": unref(catalog).shop.id,
          "shop-name": unref(catalog).shop.name,
          "shop-slug": unref(catalog).shop.slug
        }, null, _parent));
        _push(`</div><p class="mt-2 max-w-2xl text-sm leading-6 text-sky-50/88"> Configure a real product, review pricing signals, and send the job to this shop with the same workflow used elsewhere in Printy. </p></div></div><div class="mt-4 flex flex-wrap items-center gap-2">`);
        if (unref(catalog).shop.status) {
          _push(ssrRenderComponent(_component_ShopsShopStatusBadge, {
            status: unref(catalog).shop.status
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_ShopsShopRatingSummary, { summary: unref(ratingSummary) }, null, _parent));
        _push(`<span class="inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-500/24 px-3 py-1 text-xs font-medium text-orange-50">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-package-search",
          class: "h-3.5 w-3.5"
        }, null, _parent));
        _push(` Ready for configurable quotes </span></div>`);
        if (unref(catalog).shop.opening_hours?.length) {
          _push(ssrRenderComponent(_component_ShopsShopWorkingHours, {
            hours: unref(catalog).shop.opening_hours,
            class: "mt-4"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(catalog).shop.description) {
          _push(`<div class="mt-5 rounded-2xl border border-white/14 bg-slate-950/24 p-4 backdrop-blur-sm"><p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78"> Shop overview </p>`);
          _push(ssrRenderComponent(_component_EditorRichTextDisplay, {
            html: unref(catalog).shop.description,
            class: "text-sm leading-6 text-sky-50/92 prose-a:text-sky-200 prose-strong:text-white prose-headings:text-white"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4"><div class="rounded-[1.75rem] border border-white/14 bg-slate-950/24 p-5 shadow-[0_24px_50px_-36px_rgba(2,6,23,0.96)] backdrop-blur-md"><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78"> Quick actions </p><div class="mt-4 space-y-3">`);
        if (unref(quoteDraftStore).currentShopSlug === unref(slug) && unref(quoteDraftStore).activeDraft?.items?.length) {
          _push(ssrRenderComponent(_component_UButton, {
            to: "/quote-draft",
            color: "primary",
            class: "w-full justify-between rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="inline-flex items-center gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-shopping-cart",
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(` View your draft </span><span${_scopeId}>${ssrInterpolate(unref(quoteDraftStore).activeDraft.items.length)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "inline-flex items-center gap-2" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-shopping-cart",
                      class: "h-4 w-4"
                    }),
                    createTextVNode(" View your draft ")
                  ]),
                  createVNode("span", null, toDisplayString(unref(quoteDraftStore).activeDraft.items.length), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          color: "neutral",
          class: "w-full justify-between rounded-2xl border-white/18 bg-slate-950/42 text-white hover:bg-slate-950/54",
          onClick: ($event) => customModalOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-pen-tool",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` Request custom print </span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-up-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-pen-tool",
                    class: "h-4 w-4"
                  }),
                  createTextVNode(" Request custom print ")
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-up-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          variant: "outline",
          color: "neutral",
          class: "w-full justify-between rounded-2xl border-white/18 bg-slate-950/42 text-white hover:bg-slate-950/54"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` Back to shops </span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "h-4 w-4"
                  }),
                  createTextVNode(" Back to shops ")
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><!--[-->`);
        ssrRenderList(unref(shopStats), (stat) => {
          _push(`<div class="rounded-[1.5rem] border border-white/14 bg-slate-950/38 p-4 backdrop-blur-sm"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: stat.icon,
            class: "h-4.5 w-4.5"
          }, null, _parent));
          _push(`</div><div><p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100/78">${ssrInterpolate(stat.label)}</p><p class="mt-1 text-base font-semibold text-white">${ssrInterpolate(stat.value)}</p></div></div></div>`);
        });
        _push(`<!--]--></div></div></div></div><div class="px-6 py-6 sm:px-8"><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"> Catalog </p><h2 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]"> Configure a product and send it to this shop </h2><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]"> Each card carries real product data from the shop. Open one to tweak quantity, paper, finishing, and other quote options. </p></div><div class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-2 text-xs font-medium text-[var(--p-text-dim)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-sparkles",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(catalog).products.length)} configured product${ssrInterpolate(unref(catalog).products.length === 1 ? "" : "s")}</div></div>`);
        if (unref(catalog).products.length) {
          _push(`<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(catalog).products, (product) => {
            _push(`<article class="group overflow-hidden rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] transition-all hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-[0_30px_70px_-42px_rgba(249,115,22,0.34)]"><button class="block w-full text-left" type="button"><div class="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(140deg,#d9e8fb_0%,#eef5ff_40%,#ffe2cb_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#102746_62%,#1c3552_100%)]">`);
            if (productImageUrl(product)) {
              _push(ssrRenderComponent(_component_NuxtImg, {
                src: productImageUrl(product),
                alt: product.name,
                class: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              }, null, _parent));
            } else {
              _push(`<div class="absolute inset-0 flex items-center justify-center"><div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/75 text-sky-900 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package",
                class: "h-8 w-8"
              }, null, _parent));
              _push(`</div></div>`);
            }
            _push(`<div class="absolute left-4 top-4 flex flex-wrap gap-2">`);
            if (product.category) {
              _push(`<span class="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-3 py-1 text-[11px] font-semibold text-sky-800 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100">${ssrInterpolate(product.category)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (product.turnaround_days) {
              _push(`<span class="inline-flex items-center gap-1 rounded-full border border-orange-200/80 bg-orange-50/92 px-3 py-1 text-[11px] font-semibold text-orange-800 shadow-sm dark:border-orange-700 dark:bg-orange-950/55 dark:text-orange-100">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-timer-reset",
                class: "h-3.5 w-3.5"
              }, null, _parent));
              _push(` ${ssrInterpolate(turnaroundBadge(product.turnaround_days))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></button><div class="space-y-4 p-5"><div><h3 class="text-lg font-semibold tracking-tight text-[var(--p-text)]">${ssrInterpolate(product.name)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(productCardDescription(product))}</p></div><div class="flex flex-wrap gap-2">`);
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-200">${ssrInterpolate(unref(priceDisplaySummary)(product).totalLine)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200">${ssrInterpolate(unref(priceDisplaySummary)(product).perUnitLine)}</span>`);
            } else {
              _push(`<span class="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-200">${ssrInterpolate(unref(priceDisplay)(product))}</span>`);
            }
            _push(`</div><div class="grid grid-cols-1 gap-2 text-xs text-[var(--p-text-muted)]">`);
            if (product.final_size) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-ruler",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(product.final_size)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.imposition_summary) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-grid-2x2",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent));
              _push(`<span>Fits on ${ssrInterpolate(product.imposition_summary)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.min_quantity) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-hash",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent));
              _push(`<span>Minimum ${ssrInterpolate(product.min_quantity)} pcs</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (product.finishing_summary?.length) {
              _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(product.finishing_summary, (finish) => {
                _push(`<span class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-dim)]">${ssrInterpolate(finish)}</span>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_UButton, {
              color: "primary",
              class: "w-full justify-between rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600 dark:bg-flamingo-500 dark:text-white dark:hover:bg-flamingo-400",
              block: "",
              onClick: ($event) => openTweak(product)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="inline-flex items-center gap-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-4 w-4"
                  }, null, _parent2, _scopeId));
                  _push2(` Configure quote </span>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "h-4 w-4"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("span", { class: "inline-flex items-center gap-2" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-sliders-horizontal",
                        class: "h-4 w-4"
                      }),
                      createTextVNode(" Configure quote ")
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "h-4 w-4"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="mt-6 rounded-[1.8rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-12 text-center"><div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-900 shadow-sm dark:bg-slate-900 dark:text-slate-100">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-package",
            class: "h-8 w-8"
          }, null, _parent));
          _push(`</div><h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">No products yet</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">This shop has not published products to its public catalog yet.</p></div>`);
        }
        _push(`</div></section>`);
        if (unref(pricingStore).rateCard) {
          _push(`<section class="mt-8"><div class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]">`);
          _push(ssrRenderComponent(_component_PricingRateCardDisplay, {
            "rate-card": unref(pricingStore).rateCard,
            "shop-name": unref(catalog).shop.name
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canRateShop) && unref(catalog).shop) {
          _push(`<section class="mt-8"><div class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]">`);
          _push(ssrRenderComponent(_component_ShopsShopRateForm, {
            "shop-id": unref(catalog).shop.id
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_QuotesCustomPrintModal, {
          modelValue: unref(customModalOpen),
          "onUpdate:modelValue": ($event) => isRef(customModalOpen) ? customModalOpen.value = $event : null,
          "shop-slug": unref(slug),
          "paper-options": []
        }, null, _parent));
        if (unref(tweakProduct)) {
          _push(ssrRenderComponent(_component_QuotesProductTweakModal, {
            modelValue: unref(tweakModalOpen),
            "onUpdate:modelValue": ($event) => isRef(tweakModalOpen) ? tweakModalOpen.value = $event : null,
            product: unref(tweakProduct),
            "shop-slug": unref(slug),
            "shop-name": unref(catalog).shop.name,
            onAdded: onItemAdded
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-12 text-center shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]"><div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-900 dark:bg-slate-800 dark:text-slate-100">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-8 w-8"
        }, null, _parent));
        _push(`</div><h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">Shop not found</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">The shop you are looking for does not exist or is inactive.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          class: "mt-5 rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600 dark:bg-flamingo-500 dark:text-white dark:hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Browse shops `);
            } else {
              return [
                createTextVNode(" Browse shops ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BXHgeU2o.mjs.map
