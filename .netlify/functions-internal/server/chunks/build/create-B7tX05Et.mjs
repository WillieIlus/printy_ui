import { _ as __nuxt_component_1, a as _sfc_main$f, b as _sfc_main$9 } from './server.mjs';
import { _ as __nuxt_component_1$1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_3$1 } from './PublicCalculator-kld7cVNY.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
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
import './calculationResult-SiwRgRTu.mjs';
import './SelectMenu-D3Bra_sq.mjs';
import './Input-Hudv-7BP.mjs';
import './quoteInbox-BZeZ2Gtb.mjs';
import './quoteDraft-5mvcgeM-.mjs';
import './useApi-Cs2GTEbX.mjs';
import './Textarea-DUPwu95P.mjs';
import './gallery-DpmXPp8_.mjs';
import './public-BVuVnl0E.mjs';
import './activityBadges-B_bMwbEc.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './payload-B_6emhZU.mjs';
import './productionDetails-ByImjBQh.mjs';
import './useCurrencyFormatter-tIWAo1tq.mjs';
import './formatters-FW8HHCjc.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_QuotesCalculatorHub = __nuxt_component_1$1;
      const _component_QuotesPublicCalculator = __nuxt_component_3$1;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
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
      _push(`<h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Send custom request to shops</h1><p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]"> Use the shared marketplace calculator to match shops, see backend price ranges, and then continue from your requests and quotes workspace. </p></div>`);
      _push(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
        flat: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesPublicCalculator, {
              title: "Marketplace request calculator",
              description: "Structured custom-job matching with backend exact previews where possible and price-range fallback across shops.",
              eyebrow: "Request Flow",
              mode: "marketplace"
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesPublicCalculator, {
                  title: "Marketplace request calculator",
                  description: "Structured custom-job matching with backend exact previews where possible and price-range fallback across shops.",
                  eyebrow: "Request Flow",
                  mode: "marketplace"
                })
              ])
            ];
          }
        }),
        booklet: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesBookletCalculator, {
              title: "Marketplace booklet request calculator",
              description: "Build a booklet brief, preview backend pricing, and save it into the same requests workspace.",
              eyebrow: "Request Flow"
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesBookletCalculator, {
                  title: "Marketplace booklet request calculator",
                  description: "Build a booklet brief, preview backend pricing, and save it into the same requests workspace.",
                  eyebrow: "Request Flow"
                })
              ])
            ];
          }
        }),
        large_format: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
              title: "Marketplace large-format request calculator",
              description: "Build a large-format brief, preview backend pricing, and save it into the same requests workspace.",
              eyebrow: "Request Flow"
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesLargeFormatCalculator, {
                  title: "Marketplace large-format request calculator",
                  description: "Build a large-format brief, preview backend pricing, and save it into the same requests workspace.",
                  eyebrow: "Request Flow"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-6 flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_UButton, { to: "/quote-draft" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Open requests &amp; quotes workspace`);
          } else {
            return [
              createTextVNode("Open requests & quotes workspace")
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
//# sourceMappingURL=create-B7tX05Et.mjs.map
