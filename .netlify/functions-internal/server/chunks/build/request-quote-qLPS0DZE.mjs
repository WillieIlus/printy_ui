import { _ as __nuxt_component_2 } from './LoadingSpinner-DUXHKoma.mjs';
import { f as useRoute, c as _sfc_main$9, J as _export_sfc, n as navigateTo, a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_2$1 } from './QuoteForm-CA9oWdq2.mjs';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
import { u as useQuoteStore } from './quote-Bl7wpgEV.mjs';
import { u as usePricingStore } from './pricing-b9_FMs6x.mjs';
import { u as useNotification } from './useNotification-Dn_AzVKG.mjs';
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
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './FormInput-BwqVsjAz.mjs';
import './FormRichText-CJOuStKS.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-placeholder';
import 'yup';
import './api-error-D1IYk86E.mjs';

const titleId = "quote-request-title";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteRequestModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    watch(() => props.open, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="quote-request-overlay fixed inset-0 z-50 flex" role="dialog" aria-modal="true" data-v-61e4d3f0><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden data-v-61e4d3f0></div><div class="quote-request-panel drawer-panel relative flex flex-col bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden" role="dialog" aria-modal="true"${ssrRenderAttr("aria-labelledby", titleId)} data-v-61e4d3f0><div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0" data-v-61e4d3f0><h2${ssrRenderAttr("id", titleId)} class="text-lg font-semibold text-gray-900 dark:text-white" data-v-61e4d3f0>${ssrInterpolate(__props.title)}</h2><button type="button" class="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Close" data-v-61e4d3f0>`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto min-h-0" data-v-61e4d3f0>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteRequestModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-61e4d3f0"]]), { __name: "QuotesQuoteRequestModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "request-quote",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore();
    const quoteStore = useQuoteStore();
    const pricingStore = usePricingStore();
    const notification = useNotification();
    const slug = computed(() => route.params.slug);
    const rateCard = computed(() => pricingStore.rateCard);
    function goBack() {
      navigateTo(`/shops/${slug.value}`);
    }
    function onClose() {
      goBack();
    }
    async function onSubmit(data) {
      const result = await quoteStore.requestQuote(slug.value, data);
      if (result.success) {
        notification.success("Quote request sent");
        await navigateTo(`/shops/${slug.value}`);
      } else {
        notification.error(result.error ?? "Request failed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_2;
      const _component_QuotesQuoteRequestModal = __nuxt_component_1;
      const _component_QuotesQuoteForm = __nuxt_component_2$1;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-[60vh] flex items-center justify-center p-4" }, _attrs))}>`);
      if (!unref(shopStore).currentShop && unref(shopStore).loading) {
        _push(`<div class="flex justify-center py-12">`);
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
        _push(`</div>`);
      } else if (unref(shopStore).currentShop) {
        _push(ssrRenderComponent(_component_QuotesQuoteRequestModal, {
          open: true,
          title: "Request a quote",
          "onUpdate:open": onClose
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_QuotesQuoteForm, {
                slug: unref(slug),
                "rate-card": unref(rateCard),
                loading: unref(quoteStore).loading,
                onSubmit,
                onCancel: goBack
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_QuotesQuoteForm, {
                  slug: unref(slug),
                  "rate-card": unref(rateCard),
                  loading: unref(quoteStore).loading,
                  onSubmit,
                  onCancel: goBack
                }, null, 8, ["slug", "rate-card", "loading"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="text-center text-gray-500"><p>Shop not found.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          variant: "link",
          class: "mt-2"
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
      _push(`</div>`);
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
//# sourceMappingURL=request-quote-qLPS0DZE.mjs.map
