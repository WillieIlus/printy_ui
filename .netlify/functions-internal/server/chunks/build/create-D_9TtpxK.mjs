import { _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
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
import './SelectMenu-D3Bra_sq.mjs';
import './Input-Hudv-7BP.mjs';
import './calculationResult-SiwRgRTu.mjs';
import './public-BVuVnl0E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quotes/create",
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Calculators `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" Calculators ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Large-format calculator</h1><p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]"> Price banners, posters, stickers, roll-up banners, and mounted boards from one backend-driven large-format flow. </p></div>`);
      _push(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
        title: "Large-format calculator",
        description: "Use the dedicated large-format engine for area pricing, materials, finishing, hardware, and turnaround.",
        eyebrow: "Large Format"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/large-format/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-D_9TtpxK.mjs.map
