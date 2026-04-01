import { _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "help",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 sm:py-16" }, _attrs))}><div class="max-w-3xl"><h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl"> Help Center </h1><p class="mt-2 text-lg text-gray-600 dark:text-gray-400"> Find answers and get support for Printy. </p><div class="mt-10 space-y-8"><section><h2 class="text-xl font-semibold text-[var(--p-text)]">Getting started</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Create an account, then set up your first shop. Add machines, materials, and finishing options. Configure your pricing logic (digital or large format). Once your shop is ready, customers can browse templates and request quotes. </p></section><section><h2 class="text-xl font-semibold text-[var(--p-text)]">Pricing models</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"><strong>Digital:</strong> Per sheet, per side. Best for SRA3, SRA4, and similar sheet-based work.<br><strong>Large Format:</strong> Area-based (per m²). Best for banners, posters, signage. </p></section><section><h2 class="text-xl font-semibold text-[var(--p-text)]">Templates and quotes</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Templates are pre-configured products (e.g., &quot;Business Cards&quot;, &quot;A3 Poster&quot;). Customers select options and get an instant quote. You manage templates in your shop dashboard under Products. </p></section><section><h2 class="text-xl font-semibold text-[var(--p-text)]">Need more help?</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Check the `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about",
        class: "text-[var(--color-primary-600)] hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About`);
          } else {
            return [
              createTextVNode("About")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` page for an overview. For account or technical issues, contact support through your dashboard or email. </p></section></div><div class="mt-10 flex flex-wrap gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/signup",
        class: "btn-primary inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create account `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "ml-2 h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Create account "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "ml-2 h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse Gallery `);
          } else {
            return [
              createTextVNode(" Browse Gallery ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "mt-12 inline-flex items-center text-[var(--color-primary-600)] hover:underline font-medium"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/help.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=help-CsPPsMjx.mjs.map
