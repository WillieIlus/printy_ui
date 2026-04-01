import { f as useRoute, e as useToast, _ as __nuxt_component_3$1, a as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2 } from './PublicCalculator-7GJGXk0j.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useQuoteDraftStore } from './quoteDraft-D14UWIgv.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './Input-DZEAnFef.mjs';
import './Textarea-BGCp2SzO.mjs';
import './SelectMenu-DDFAjir1.mjs';
import './quoteInbox-CT7a8yeE.mjs';
import './useQuoteRequestBlast-BX_QZhbB.mjs';
import './gallery-CWXZbZWT.mjs';
import './public-Dys9UREH.mjs';
import './payload-B_6emhZU.mjs';
import './productionDetails-ByImjBQh.mjs';
import './useCurrencyFormatter-BbngrNPq.mjs';
import './formatters-Cc_7PG6h.mjs';
import './useApi-CU6Yy_Y5.mjs';
import './quoteDraft-DMIJySf0.mjs';
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "request-quote",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const shopName = ref("");
    const quoteDraftStore = useQuoteDraftStore();
    const toast = useToast();
    async function onSubmit(payload) {
      if (payload.item_type !== "CUSTOM") return;
      quoteDraftStore.setShop(slug.value);
      await quoteDraftStore.addCustomToQuote(payload);
      toast.add({ title: "Added to draft", description: "Custom request saved to your quote draft.", color: "success" });
      await navigateTo("/quote-draft");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_QuotesPublicCalculator = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/shops/${unref(slug)}`,
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Back to shop `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" Back to shop ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Request custom print</h1><p class="mt-2 max-w-2xl text-sm text-[var(--p-text-muted)]"> This page now uses the same single-shop calculator engine as the homepage and shop custom-print modal. </p></div><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">`);
      _push(ssrRenderComponent(_component_QuotesPublicCalculator, {
        title: "Single-shop custom request",
        description: "Keep the shop fixed, capture a structured custom job spec, and save it into the quote draft workflow.",
        eyebrow: "Request Custom Print",
        mode: "single-shop",
        "fixed-shop-slug": unref(slug),
        "fixed-shop-name": unref(shopName),
        onSubmit
      }, null, _parent));
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/[slug]/request-quote.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=request-quote-BsxS2vLq.mjs.map
