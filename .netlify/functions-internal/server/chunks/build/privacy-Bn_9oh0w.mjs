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
  __name: "privacy",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 sm:py-16" }, _attrs))}><div class="max-w-3xl"><h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl"> Privacy Policy </h1><p class="mt-2 text-lg text-gray-600 dark:text-gray-400"> Last updated: ${ssrInterpolate(lastUpdated)}</p><div class="mt-8 prose prose-gray dark:prose-invert max-w-none"><p class="text-gray-600 dark:text-gray-400 leading-relaxed"> Printy (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect your information. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">1. Information We Collect</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> We collect information you provide when registering (name, email, password) and when using the Service (shop data, quotes, usage). We use cookies and similar technologies for authentication and preferences. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">2. How We Use Your Information</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> We use your information to operate the Service, improve it, communicate with you, and comply with legal obligations. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">3. Data Sharing</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> We do not sell your personal data. We may share data with service providers who assist in operating the Service, under strict confidentiality. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">4. Security</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> We implement appropriate technical and organizational measures to protect your data. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">5. Your Rights</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> You may access, correct, or delete your personal data through your account settings. You may also contact us for assistance. </p><h2 class="mt-8 text-xl font-semibold text-[var(--p-text)]">6. Contact</h2><p class="mt-2 text-gray-600 dark:text-gray-400"> For privacy-related questions, use the Help Center or contact us through your dashboard. </p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=privacy-Bn_9oh0w.mjs.map
