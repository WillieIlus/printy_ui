import { defineComponent, computed, mergeProps, unref, ref, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { c as formatDate, b as formatKES } from './formatters-C39vX7Ji.mjs';
import { g as useRoute } from './server.mjs';
import { defineStore } from 'pinia';
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
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

function loadFromStorage() {
  return [];
}
function saveToStorage(quotes) {
  return;
}
function generateId() {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
const useLocalQuotesStore = defineStore("localQuotes", () => {
  const quotes = ref(loadFromStorage());
  watch(
    quotes,
    (val) => saveToStorage(),
    { deep: true }
  );
  function addQuote(payload) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const quote = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    quotes.value = [quote, ...quotes.value];
    return quote;
  }
  function updateQuote(id, payload) {
    const idx = quotes.value.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    const updated = {
      ...quotes.value[idx],
      ...payload,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    quotes.value = [...quotes.value];
    quotes.value[idx] = updated;
    return updated;
  }
  function getById(id) {
    return quotes.value.find((q) => q.id === id) ?? null;
  }
  function removeQuote(id) {
    const idx = quotes.value.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    quotes.value = quotes.value.filter((q) => q.id !== id);
    return true;
  }
  return {
    quotes,
    addQuote,
    updateQuote,
    getById,
    removeQuote
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "print",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const localQuotesStore = useLocalQuotesStore();
    const quoteId = computed(() => route.query.id);
    const quote = computed(
      () => quoteId.value ? localQuotesStore.getById(quoteId.value) : null
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white dark:bg-gray-900 p-8 print:p-4 print:!bg-white" }, _attrs))}>`);
      if (!unref(quote)) {
        _push(`<div class="text-center py-12 text-gray-500 dark:text-gray-400"> Quote not found. Go back and save a quote first. </div>`);
      } else {
        _push(`<article class="max-w-2xl mx-auto"><header class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(quote).shopName)}</h1><p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Quote #${ssrInterpolate(unref(quote).id)}</p><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${ssrInterpolate(unref(formatDate)(unref(quote).createdAt))}</p></header>`);
        if (unref(quote).customerName || unref(quote).customerEmail) {
          _push(`<section class="mb-6"><h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Client</h2>`);
          if (unref(quote).customerName) {
            _push(`<p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(quote).customerName)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(quote).customerEmail) {
            _push(`<p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(quote).customerEmail)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(quote).customerPhone) {
            _push(`<p class="text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(unref(quote).customerPhone)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="mb-6"><h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Job Summary</h2><p class="text-gray-900 dark:text-white">${ssrInterpolate(unref(quote).snapshot.sheetSize)} | ${ssrInterpolate(unref(quote).snapshot.gsm)}gsm ${ssrInterpolate(unref(quote).snapshot.paperType)}</p><p class="text-gray-900 dark:text-white">Qty: ${ssrInterpolate(unref(quote).snapshot.quantity)} sheets | ${ssrInterpolate(unref(quote).snapshot.sides === 2 ? "Double-sided" : "Single-sided")}</p>`);
        if (unref(quote).snapshot.finishingNames?.length) {
          _push(`<p class="text-gray-900 dark:text-white">Finishing: ${ssrInterpolate(unref(quote).snapshot.finishingNames.join(", "))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section>`);
        if (unref(quote).costBreakdown?.length) {
          _push(`<section class="mb-6"><h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Cost Breakdown</h2><table class="w-full text-sm"><tbody><!--[-->`);
          ssrRenderList(unref(quote).costBreakdown, (row) => {
            _push(`<tr class="border-b border-gray-100 dark:border-gray-800"><td class="py-1.5 text-gray-600 dark:text-gray-400">${ssrInterpolate(row.label)}</td><td class="py-1.5 text-right font-medium text-gray-900 dark:text-white">${ssrInterpolate(unref(formatKES)(row.amount))}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6"><div class="flex justify-between items-center"><span class="text-lg font-semibold text-gray-900 dark:text-white">Suggested Selling Price</span><span class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(formatKES)(unref(quote).suggestedPrice))}</span></div></section><footer class="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4"><p>Valid for ${ssrInterpolate(unref(quote).snapshot.validityDays ?? 7)} days from date of quote.</p><p class="mt-2">Delivery terms as agreed. Payment on completion unless otherwise stated.</p></footer></article>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote/print.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=print-D-v68SWV.mjs.map
