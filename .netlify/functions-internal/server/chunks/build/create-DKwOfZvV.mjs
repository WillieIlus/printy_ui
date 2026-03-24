import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { g as useRoute, d as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2 } from './QuoteForm-hMVtdwL8.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useQuoteStore } from './quote-BBvP7CpN.mjs';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
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
import './FormInput-Cb8fwOas.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-placeholder';
import 'yup';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const quoteStore = useQuoteStore();
    const pricingStore = usePricingStore();
    const notification = useNotification();
    const slug = computed(() => route.params.slug);
    const rateCard = computed(() => pricingStore.rateCard);
    function goBack() {
      navigateTo(`/dashboard/shops/${slug.value}/quotes`);
    }
    async function onSubmit(data) {
      const result = await quoteStore.createQuote(slug.value, data);
      if (result.success && result.quote) {
        notification.success("Quote created");
        await navigateTo(`/dashboard/shops/${slug.value}/quotes/${result.quote.id}`);
      } else {
        notification.error(quoteStore.error ?? "Create failed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_QuotesQuoteForm = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Calculate New Job",
        subtitle: `Create a quote for ${unref(slug)}`
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/quotes`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="col-span-12">`);
      _push(ssrRenderComponent(_component_QuotesQuoteForm, {
        slug: unref(slug),
        "rate-card": unref(rateCard),
        loading: unref(quoteStore).loading,
        "submit-label": "Create Quote",
        onSubmit,
        onCancel: goBack
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/quotes/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-DKwOfZvV.mjs.map
