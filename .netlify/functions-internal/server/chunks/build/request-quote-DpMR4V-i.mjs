import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { f as useRoute, g as useAnalyticsTracking, d as _sfc_main$9, Q as _export_sfc, n as navigateTo, a as _sfc_main$f } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_2 } from './QuoteForm-BJ5zWcN4.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { u as useQuoteStore } from './quote-BBvP7CpN.mjs';
import { u as usePricingStore } from './pricing-BwHzPGP8.mjs';
import { u as useNotification } from './useNotification-B7Z2gs_7.mjs';
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
import './FormInput-opqohhBW.mjs';
import './formUi-UcrM_3uE.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-placeholder';
import 'yup';

const titleId = "quote-request-title";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteRequestModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {}
  },
  emits: ["update:open"],
  setup(__props) {
    const props = __props;
    watch(() => props.open, (open) => {
      if (open) (void 0).body.style.overflow = "hidden";
      else (void 0).body.style.overflow = "";
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="quote-request-overlay fixed inset-0 z-50 flex" role="dialog" aria-modal="true" data-v-4b4fa9b3><div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden data-v-4b4fa9b3></div><div class="quote-request-panel drawer-panel relative flex flex-col overflow-hidden border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-xl" role="dialog" aria-modal="true"${ssrRenderAttr("aria-labelledby", titleId)} data-v-4b4fa9b3><div class="flex shrink-0 items-center justify-between border-b border-[var(--p-border)] p-4 sm:px-6" data-v-4b4fa9b3><h2${ssrRenderAttr("id", titleId)} class="text-lg font-semibold text-[var(--p-text)]" data-v-4b4fa9b3>${ssrInterpolate(__props.title)}</h2><button type="button" class="rounded-lg p-1.5 text-[var(--p-text-muted)] transition-colors hover:bg-[var(--p-surface-container-low)] hover:text-[var(--p-text)]" aria-label="Close" data-v-4b4fa9b3>`);
          _push2(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-x",
            class: "h-5 w-5"
          }, null, _parent));
          _push2(`</button></div><div class="flex-1 overflow-y-auto min-h-0" data-v-4b4fa9b3>`);
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
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-4b4fa9b3"]]), { __name: "QuotesQuoteRequestModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "request-quote",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopStore = useShopStore();
    const quoteStore = useQuoteStore();
    const pricingStore = usePricingStore();
    const notification = useNotification();
    const { trackQuoteSubmit } = useAnalyticsTracking();
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
        void trackQuoteSubmit({
          source: "shop_request_quote_page",
          shop_slug: slug.value,
          quote_id: result.quote?.id
        });
        notification.success("Quote request sent");
        await navigateTo(`/shops/${slug.value}`);
      } else {
        notification.error(result.error ?? "Request failed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_QuotesQuoteRequestModal = __nuxt_component_1;
      const _component_QuotesQuoteForm = __nuxt_component_2;
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
//# sourceMappingURL=request-quote-DpMR4V-i.mjs.map
