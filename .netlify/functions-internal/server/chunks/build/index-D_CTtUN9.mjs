import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { g as useRoute, c as useAuthStore, h as useToast, _ as __nuxt_component_3$1, a as _sfc_main$f, d as _sfc_main$9, l as __nuxt_component_5$1, e as useRuntimeConfig, f as usePublicApi, A as API } from './server.mjs';
import { u as useFavoritesStore, _ as __nuxt_component_3$2 } from './ShopFavoriteToggle-BdSURm0h.mjs';
import { _ as __nuxt_component_4 } from './ShopStatusBadge-MUkvVG5a.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, isRef, reactive, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as __nuxt_component_6$1 } from './RichTextDisplay-BjJZ3jTm.mjs';
import { a as formatKES } from './formatters-D5StX5za.mjs';
import { _ as _sfc_main$6 } from './Textarea-m5qrWcEy.mjs';
import { r as rateShop } from './ratings-Do1hf-Ug.mjs';
import { _ as _sfc_main$7 } from './FormField-Dl4QZCpm.mjs';
import { _ as _sfc_main$8 } from './Input-D98neQoC.mjs';
import { _ as _sfc_main$a } from './SelectMenu-DnLMxdXN.mjs';
import { _ as _sfc_main$b } from './Checkbox-8D35u7U_.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-C-yOw8FU.mjs';
import { _ as __nuxt_component_9, u as useProductPriceDisplay } from './ProductTweakModal-vQASSQYo.mjs';
import { u as usePricingStore } from './pricing-CccrVSfA.mjs';
import { listQuoteRequests } from './quoteDraft-BpsjrEHr.mjs';
import { u as useApi } from './useApi-FvTSG0mK.mjs';
import { u as usePrintySeo } from './usePrintySeo-wTwluGFY.mjs';
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
import './Badge-DzyqaO77.mjs';
import './gallery-B-1C6f8x.mjs';

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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 text-amber-600 dark:text-amber-400" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: "h-4 w-4 fill-current"
        }, null, _parent));
        _push(`<span class="text-sm font-medium tabular-nums">${ssrInterpolate(formatRating(__props.summary.average))}</span><span class="text-xs text-stone-500 dark:text-stone-400">(${ssrInterpolate(__props.summary.count)})</span></div>`);
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/30 px-4 py-2" }, _attrs))}><p class="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">Working hours</p><div class="space-y-1"><!--[-->`);
      ssrRenderList(__props.hours, (h) => {
        _push(`<div class="flex justify-between text-sm"><span class="text-stone-600 dark:text-stone-400">${ssrInterpolate(h.weekday_display ?? dayLabel(h.weekday))}</span><span class="text-stone-700 dark:text-stone-300 tabular-nums">${ssrInterpolate(h.is_closed ? "Closed" : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}`)}</span></div>`);
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
    const props = __props;
    computed(() => {
      const rc = props.rateCard;
      return (rc.printing?.length ?? 0) > 0 || (rc.paper?.length ?? 0) > 0 || (rc.finishing?.length ?? 0) > 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto" }, _attrs))}>`);
      if (__props.shopName) {
        _push(`<h2 class="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">${ssrInterpolate(__props.shopName)} Rate Card </h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
      if (__props.rateCard.paper?.length) {
        _push(`<section class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"><div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40"><h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-stack",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Paper (per sheet) </h3><p class="mt-0.5 text-xs text-amber-700/80 dark:text-amber-300/80"> Includes printing. Single = 1 side, Double = 2 sides. </p></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30"><thead class="bg-amber-50/50 dark:bg-stone-800/80"><tr><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">GSM</th><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Type</th><th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Single</th><th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Double</th></tr></thead><tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30"><!--[-->`);
        ssrRenderList(__props.rateCard.paper, (price, index) => {
          _push(`<tr class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30"><td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">${ssrInterpolate(price.gsm)} gsm</td><td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">${ssrInterpolate(price.paper_type)}</td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-stone-800 dark:text-stone-200">${ssrInterpolate(unref(formatKES)(price.single_price))}</span></td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-stone-800 dark:text-stone-200">${ssrInterpolate(unref(formatKES)(price.double_price))}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-6">`);
      if (__props.rateCard.printing?.length) {
        _push(`<section class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"><div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40"><h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-printer",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Printing (per side) </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30"><thead class="bg-amber-50/50 dark:bg-stone-800/80"><tr><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Size</th><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Type</th><th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Single</th><th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Double</th></tr></thead><tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30"><!--[-->`);
        ssrRenderList(__props.rateCard.printing, (price, index) => {
          _push(`<tr class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30"><td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">${ssrInterpolate(price.sheet_size)}</td><td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">${ssrInterpolate(price.color_mode)}</td><td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">${ssrInterpolate(unref(formatKES)(price.price_per_side))}</td><td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">${ssrInterpolate(unref(formatKES)(price.price_double_sided))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.rateCard.finishing?.length) {
        _push(`<section class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"><div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40"><h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-scissors",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Finishing </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30"><thead class="bg-amber-50/50 dark:bg-stone-800/80"><tr><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Service</th><th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Unit</th><th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Price</th></tr></thead><tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30"><!--[-->`);
        ssrRenderList(__props.rateCard.finishing, (service, index) => {
          _push(`<tr class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30"><td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">${ssrInterpolate(service.name)} `);
          if (service.category) {
            _push(`<span class="block text-xs text-stone-500 dark:text-stone-400">${ssrInterpolate(service.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">${ssrInterpolate(service.charge_by)}</td><td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">${ssrInterpolate(unref(formatKES)(service.price))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (!__props.rateCard.printing?.length && !__props.rateCard.paper?.length && !__props.rateCard.finishing?.length) {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-receipt",
          class: "mx-auto h-12 w-12 text-amber-300 dark:text-amber-700"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300">No pricing available</h3><p class="mt-1 text-sm text-stone-500 dark:text-stone-400">This shop hasn&#39;t set up their pricing yet.</p></div>`);
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
    async function onSubmit() {
      if (stars.value < 1) return;
      submitting.value = true;
      try {
        await rateShop(props.shopId, { stars: stars.value, comment: comment.value || void 0 });
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-amber-200/80 dark:border-amber-800/50 bg-amber-50/50 dark:bg-stone-800/50 p-4" }, _attrs))}><h4 class="text-sm font-semibold text-stone-800 dark:text-stone-100 mb-2">Rate this shop</h4><p class="text-xs text-stone-500 dark:text-stone-400 mb-3">You received a quote from this shop. Share your experience.</p><div class="flex flex-wrap items-center gap-3"><div class="flex gap-1"><!--[-->`);
      ssrRenderList(5, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([s <= unref(stars) ? "text-amber-500 dark:text-amber-400" : "text-stone-300 dark:text-stone-600", "p-1 rounded transition-colors hover:bg-amber-200/60 dark:hover:bg-amber-700/40"])}">`);
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
    const catalog = ref(null);
    const loading = ref(true);
    const customModalOpen = ref(false);
    const ratingSummary = ref(null);
    const pricingStore = usePricingStore();
    const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id));
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    function openTweak(product) {
      tweakProduct.value = product;
      tweakModalOpen.value = true;
    }
    function onItemAdded() {
      toast.add({ title: "Added to draft", description: `${tweakProduct.value?.name ?? "Product"} added to your draft.` });
    }
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[linear-gradient(180deg,#f7f0df_0%,#f9f7f1_32%,#f5f4ef_100%)] dark:bg-stone-950" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(catalog)?.shop) {
        _push(`<!--[--><section class="overflow-hidden rounded-[2rem] border border-stone-300/70 bg-white/90 shadow-[0_28px_80px_-48px_rgba(68,46,17,0.45)] backdrop-blur dark:border-stone-800 dark:bg-stone-900/90"><div class="border-b border-stone-200/80 bg-[radial-gradient(circle_at_top_left,#f6d8a8_0%,#f7ecd2_32%,transparent_72%)] px-6 py-6 dark:border-stone-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16)_0%,rgba(41,37,36,0.88)_58%,transparent_100%)] sm:px-8"><div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.95fr)]"><div class="min-w-0"><div class="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "transition-colors hover:text-stone-900 dark:hover:text-white"
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
          class: "transition-colors hover:text-stone-900 dark:hover:text-white"
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
        _push(`<span>/</span><span class="text-stone-800 dark:text-stone-100">${ssrInterpolate(unref(catalog).shop.name)}</span></div><div class="flex flex-wrap items-start gap-3"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-stone-300/80 bg-white/80 text-stone-700 shadow-sm dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-7 w-7"
        }, null, _parent));
        _push(`</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-3"><h1 class="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">${ssrInterpolate(unref(catalog).shop.name)}</h1>`);
        _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
          "shop-id": unref(catalog).shop.id,
          "shop-name": unref(catalog).shop.name,
          "shop-slug": unref(catalog).shop.slug
        }, null, _parent));
        _push(`</div><p class="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-300"> Configure a real product, review pricing signals, and send the job to this shop with the same workflow used elsewhere in Printy. </p></div></div><div class="mt-4 flex flex-wrap items-center gap-2">`);
        if (unref(catalog).shop.status) {
          _push(ssrRenderComponent(_component_ShopsShopStatusBadge, {
            status: unref(catalog).shop.status
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_ShopsShopRatingSummary, { summary: unref(ratingSummary) }, null, _parent));
        _push(`<span class="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/80 px-3 py-1 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-200">`);
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
          _push(`<div class="mt-5 rounded-2xl border border-stone-200 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-950/55"><p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"> Shop overview </p>`);
          _push(ssrRenderComponent(_component_EditorRichTextDisplay, {
            html: unref(catalog).shop.description,
            class: "text-sm leading-6 text-stone-700 dark:text-stone-300"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4"><div class="rounded-[1.75rem] border border-stone-300/80 bg-white/85 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-950/65"><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"> Quick actions </p><div class="mt-4 space-y-3">`);
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
          class: "w-full justify-between rounded-2xl border-stone-300 bg-white/80 text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:hover:bg-stone-800/80",
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
          class: "w-full justify-between rounded-2xl border-stone-300 bg-white/80 text-stone-800 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-100 dark:hover:bg-stone-800/80"
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
          _push(`<div class="rounded-[1.5rem] border border-stone-300/70 bg-stone-50/90 p-4 dark:border-stone-800 dark:bg-stone-950/60"><div class="flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: stat.icon,
            class: "h-4.5 w-4.5"
          }, null, _parent));
          _push(`</div><div><p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">${ssrInterpolate(stat.label)}</p><p class="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">${ssrInterpolate(stat.value)}</p></div></div></div>`);
        });
        _push(`<!--]--></div></div></div></div><div class="px-6 py-6 sm:px-8"><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400"> Catalog </p><h2 class="mt-2 text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100"> Configure a product and send it to this shop </h2><p class="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-300"> Each card carries real product data from the shop. Open one to tweak quantity, paper, finishing, and other quote options. </p></div><div class="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-200">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-sparkles",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(catalog).products.length)} configured product${ssrInterpolate(unref(catalog).products.length === 1 ? "" : "s")}</div></div>`);
        if (unref(catalog).products.length) {
          _push(`<div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(catalog).products, (product) => {
            _push(`<article class="group overflow-hidden rounded-[1.8rem] border border-stone-300/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_26px_60px_-38px_rgba(68,46,17,0.45)] dark:border-stone-800 dark:bg-stone-900"><button class="block w-full text-left" type="button"><div class="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#f5e6c8_0%,#f9f6ee_58%,#efe8db_100%)] dark:bg-[linear-gradient(135deg,#292524_0%,#1c1917_62%,#0f0f0f_100%)]">`);
            if (productImageUrl(product)) {
              _push(ssrRenderComponent(_component_NuxtImg, {
                src: productImageUrl(product),
                alt: product.name,
                class: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              }, null, _parent));
            } else {
              _push(`<div class="absolute inset-0 flex items-center justify-center"><div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/70 text-stone-700 shadow-sm dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package",
                class: "h-8 w-8"
              }, null, _parent));
              _push(`</div></div>`);
            }
            _push(`<div class="absolute left-4 top-4 flex flex-wrap gap-2">`);
            if (product.category) {
              _push(`<span class="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-3 py-1 text-[11px] font-semibold text-stone-700 shadow-sm dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100">${ssrInterpolate(product.category)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (product.turnaround_days) {
              _push(`<span class="inline-flex items-center gap-1 rounded-full border border-white/75 bg-white/88 px-3 py-1 text-[11px] font-semibold text-stone-700 shadow-sm dark:border-stone-700 dark:bg-stone-950/80 dark:text-stone-100">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-timer-reset",
                class: "h-3.5 w-3.5"
              }, null, _parent));
              _push(` ${ssrInterpolate(turnaroundBadge(product.turnaround_days))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></button><div class="space-y-4 p-5"><div><h3 class="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">${ssrInterpolate(product.name)}</h3><p class="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">${ssrInterpolate(productCardDescription(product))}</p></div><div class="flex flex-wrap gap-2">`);
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">${ssrInterpolate(unref(priceDisplaySummary)(product).totalLine)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-200">${ssrInterpolate(unref(priceDisplaySummary)(product).perUnitLine)}</span>`);
            } else {
              _push(`<span class="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">${ssrInterpolate(unref(priceDisplay)(product))}</span>`);
            }
            _push(`</div><div class="grid grid-cols-1 gap-2 text-xs text-stone-600 dark:text-stone-300">`);
            if (product.final_size) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 px-3 py-2 dark:border-stone-800 dark:bg-stone-950/60">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-ruler",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(product.final_size)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.imposition_summary) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 px-3 py-2 dark:border-stone-800 dark:bg-stone-950/60">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-grid-2x2",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent));
              _push(`<span>Fits on ${ssrInterpolate(product.imposition_summary)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.min_quantity) {
              _push(`<div class="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 px-3 py-2 dark:border-stone-800 dark:bg-stone-950/60">`);
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
                _push(`<span class="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-950/70 dark:text-stone-200">${ssrInterpolate(finish)}</span>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_UButton, {
              color: "primary",
              class: "w-full justify-between rounded-2xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white",
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
          _push(`<div class="mt-6 rounded-[1.8rem] border border-dashed border-stone-300 bg-stone-50/80 p-12 text-center dark:border-stone-700 dark:bg-stone-950/60"><div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-stone-700 shadow-sm dark:bg-stone-900 dark:text-stone-100">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-package",
            class: "h-8 w-8"
          }, null, _parent));
          _push(`</div><h3 class="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">No products yet</h3><p class="mt-2 text-sm text-stone-600 dark:text-stone-300">This shop has not published products to its public catalog yet.</p></div>`);
        }
        _push(`</div></section>`);
        if (unref(pricingStore).rateCard) {
          _push(`<section class="mt-8"><div class="rounded-[1.8rem] border border-stone-300/80 bg-white/90 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/90">`);
          _push(ssrRenderComponent(_component_PricingRateCardDisplay, {
            "rate-card": unref(pricingStore).rateCard,
            "shop-name": unref(catalog).shop.name
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canRateShop) && unref(catalog).shop) {
          _push(`<section class="mt-8"><div class="rounded-[1.8rem] border border-stone-300/80 bg-white/90 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/90">`);
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
        _push(`<div class="rounded-[1.8rem] border border-stone-300/80 bg-white/90 p-12 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900/90"><div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-100">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-8 w-8"
        }, null, _parent));
        _push(`</div><h3 class="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-100">Shop not found</h3><p class="mt-2 text-sm text-stone-600 dark:text-stone-300">The shop you are looking for does not exist or is inactive.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          class: "mt-5 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
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
//# sourceMappingURL=index-D_CTtUN9.mjs.map
