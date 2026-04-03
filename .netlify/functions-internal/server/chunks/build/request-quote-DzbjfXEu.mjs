import { f as useRoute, e as useToast, _ as __nuxt_component_1, a as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_1$1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_3$1 } from './PublicCalculator-kld7cVNY.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useI18n } from 'vue-i18n';
import { u as useQuoteDraftStore } from './quoteDraft-DCmPR0Tc.mjs';
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
import './browser-storage-CN-SIF_V.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "request-quote",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useI18n();
    const slug = computed(() => route.params.slug);
    const shopName = ref("");
    const quoteDraftStore = useQuoteDraftStore();
    const toast = useToast();
    async function onSubmit(payload) {
      if (payload.item_type !== "CUSTOM") return;
      quoteDraftStore.setShop(slug.value);
      await quoteDraftStore.addCustomToQuote(payload);
      toast.add({ title: t("shop.savedToWorkspaceTitle"), description: t("shop.savedToWorkspaceDescription"), color: "success" });
      await navigateTo("/quote-draft");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_QuotesCalculatorHub = __nuxt_component_1$1;
      const _component_QuotesPublicCalculator = __nuxt_component_3$1;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/shops/${unref(slug)}`,
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(t)("shop.backToShop"))}`);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" " + toDisplayString(unref(t)("shop.backToShop")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(t)("shop.requestCustomPrintTitle"))}</h1><p class="mt-2 max-w-2xl text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.requestCustomPrintDescription"))}</p></div>`);
      _push(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
        flat: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesPublicCalculator, {
              title: unref(t)("shop.singleShopCustomRequestTitle"),
              description: unref(t)("shop.singleShopCustomRequestDescription"),
              eyebrow: unref(t)("shop.requestCustomPrintEyebrow"),
              mode: "single-shop",
              "fixed-shop-slug": unref(slug),
              "fixed-shop-name": unref(shopName),
              onSubmit
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesPublicCalculator, {
                  title: unref(t)("shop.singleShopCustomRequestTitle"),
                  description: unref(t)("shop.singleShopCustomRequestDescription"),
                  eyebrow: unref(t)("shop.requestCustomPrintEyebrow"),
                  mode: "single-shop",
                  "fixed-shop-slug": unref(slug),
                  "fixed-shop-name": unref(shopName),
                  onSubmit
                }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
              ])
            ];
          }
        }),
        booklet: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesBookletCalculator, {
              title: unref(t)("shop.singleShopBookletTitle"),
              description: unref(t)("shop.singleShopBookletDescription"),
              eyebrow: unref(t)("shop.requestCustomBookletEyebrow"),
              "fixed-shop-slug": unref(slug),
              "fixed-shop-name": unref(shopName)
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesBookletCalculator, {
                  title: unref(t)("shop.singleShopBookletTitle"),
                  description: unref(t)("shop.singleShopBookletDescription"),
                  eyebrow: unref(t)("shop.requestCustomBookletEyebrow"),
                  "fixed-shop-slug": unref(slug),
                  "fixed-shop-name": unref(shopName)
                }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
              ])
            ];
          }
        }),
        large_format: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
              title: unref(t)("shop.singleShopLargeFormatTitle"),
              description: unref(t)("shop.singleShopLargeFormatDescription"),
              eyebrow: unref(t)("shop.requestLargeFormatEyebrow"),
              "fixed-shop-slug": unref(slug),
              "fixed-shop-name": unref(shopName)
            }, null, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8" }, [
                createVNode(_component_QuotesLargeFormatCalculator, {
                  title: unref(t)("shop.singleShopLargeFormatTitle"),
                  description: unref(t)("shop.singleShopLargeFormatDescription"),
                  eyebrow: unref(t)("shop.requestLargeFormatEyebrow"),
                  "fixed-shop-slug": unref(slug),
                  "fixed-shop-name": unref(shopName)
                }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/[slug]/request-quote.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=request-quote-DzbjfXEu.mjs.map
