import { _ as __nuxt_component_2, a as _sfc_main$f } from './server.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_2;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 sm:py-16" }, _attrs))}><div class="max-w-3xl"><h1 class="text-3xl font-extrabold tracking-tight text-[#101828] dark:text-white sm:text-4xl"> About Printy </h1><p class="mt-2 text-lg text-gray-600 dark:text-gray-400"> Your Price, Instantly. The intelligent quoting and pricing engine for modern print shops. </p><div class="mt-10 space-y-10"><section><h2 class="text-xl font-semibold text-[#101828] dark:text-white">What is Printy?</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Printy is not a marketplace. It is a pricing brain that helps print shops generate fast, accurate quotes using their own machines, materials, and operational costs. Shops configure their pricing logic once; customers get instant, consistent quotes. </p></section><section><h2 class="text-xl font-semibold text-[#101828] dark:text-white">How it works</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Two engines drive the pricing: Digital (sheet-based, per side) and Large Format (area-based, per m²). Finishing options attach cleanly to both. Shops define materials, click costs, and finishing rules. Customers browse templates and get a quote in seconds. </p></section><section id="mock-templates" class="scroll-mt-24"><h2 class="text-xl font-semibold text-[#101828] dark:text-white">Mock Templates</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Mock templates are sample product configurations that demonstrate how Printy calculates quotes. They use placeholder pricing to illustrate the flow: customer selects options, system applies your shop&#39;s logic, and returns a price. Browse the `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "text-[#e13515] hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Template Gallery`);
          } else {
            return [
              createTextVNode("Template Gallery")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` to see mock templates from different shops. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "mt-4 inline-flex items-center rounded-xl bg-[#e13515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c92f13] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse Gallery `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "ml-2 h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Browse Gallery "),
              createVNode(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "ml-2 h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section><h2 class="text-xl font-semibold text-[#101828] dark:text-white">Get started</h2><p class="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed"> Create an account, set up your first shop, and start generating quotes. No long-term commitment required. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/signup",
        class: "mt-4 inline-flex items-center rounded-xl bg-[#e13515] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c92f13] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create your shop `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "ml-2 h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Create your shop "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "ml-2 h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "mt-12 inline-flex items-center text-[#e13515] hover:underline font-medium"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-DzTeSD6-.mjs.map
