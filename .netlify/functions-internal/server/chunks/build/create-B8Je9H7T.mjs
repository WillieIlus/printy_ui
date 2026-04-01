import { _ as __nuxt_component_3$1, a as _sfc_main$f, d as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_2 } from './PublicCalculator-7GJGXk0j.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_QuotesPublicCalculator = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quotes",
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Quote requests `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" Quote requests ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Send custom request to shops</h1><p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]"> Use the shared marketplace calculator to match shops, see backend price ranges, and then continue from the quote-draft workspace. </p></div><section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">`);
      _push(ssrRenderComponent(_component_QuotesPublicCalculator, {
        title: "Marketplace request calculator",
        description: "Structured custom-job matching with backend exact previews where possible and price-range fallback across shops.",
        eyebrow: "Request Flow",
        mode: "marketplace"
      }, null, _parent));
      _push(`</section><div class="mt-6 flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_UButton, { to: "/quote-draft" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Open quote draft workspace`);
          } else {
            return [
              createTextVNode("Open quote draft workspace")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: "/shops",
        variant: "soft"
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
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-B8Je9H7T.mjs.map
