import { _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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

const lastUpdated = "February 2025";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 sm:py-16" }, _attrs))}><div class="max-w-3xl"><h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl"> Terms of Service </h1><p class="mt-2 text-lg text-gray-600 dark:text-gray-400"> Last updated: ${ssrInterpolate(lastUpdated)}</p><div class="mt-8 prose prose-gray dark:prose-invert max-w-none"><p class="text-gray-600 dark:text-gray-400 leading-relaxed"> By using Printy (&quot;the Service&quot;), you agree to these Terms of Service. Please read them carefully. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">1. Acceptance of Terms</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> By accessing or using Printy, you agree to be bound by these Terms. If you do not agree, do not use the Service. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">2. Description of Service</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> Printy provides quoting and pricing tools for print shops. It is not a marketplace—it is a pricing engine that helps shops generate fast, accurate quotes. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">3. Account and Responsibility</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> You are responsible for maintaining the confidentiality of your account and for all activities under your account. </p><p class="mt-2 text-gray-600 dark:text-gray-400"><strong>Quote submission:</strong> You may add products to a quote without signing in. When you submit a quote request, an account will be created for you if you do not already have one. We use your email to send the quote and communicate about your order. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">4. Changes</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> We may modify these Terms from time to time. Continued use of the Service after changes constitutes acceptance. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">5. Contact</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> For questions about these Terms, please contact us through the Help Center or your account dashboard. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "mt-10 inline-flex items-center text-[var(--color-primary-600)] hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Back to home `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Back to home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-CvlxgIuz.mjs.map
