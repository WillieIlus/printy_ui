import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { f as useRoute, d as useAuthStore, e as useToast, g as useAnalyticsTracking, _ as __nuxt_component_1, K as __nuxt_component_5, a as _sfc_main$f, b as _sfc_main$9, h as useRuntimeConfig } from './server.mjs';
import { u as useFavoritesStore, _ as __nuxt_component_4 } from './ShopFavoriteToggle-Dh_FXpje.mjs';
import { _ as __nuxt_component_5$1 } from './ShopStatusBadge-1GLjQN6D.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, openBlock, createBlock, Fragment, renderList, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderSlot, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { useI18n } from 'vue-i18n';
import { _ as __nuxt_component_6$1 } from './RichTextDisplay-CnD11EO8.mjs';
import { _ as _sfc_main$7 } from './Card-euyZbd6S.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-tIWAo1tq.mjs';
import { _ as _sfc_main$8 } from './Textarea-DUPwu95P.mjs';
import { r as rateShop } from './ratings-DT0xG04r.mjs';
import { u as useApi } from './useApi-Cs2GTEbX.mjs';
import { _ as __nuxt_component_3$2 } from './PublicCalculator-kld7cVNY.mjs';
import { _ as __nuxt_component_1$1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_3$1 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4$1 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-DCmPR0Tc.mjs';
import { _ as __nuxt_component_9, u as useProductPriceDisplay } from './ProductTweakModal-EHKZZOYs.mjs';
import { u as usePricingStore } from './pricing-UjDz6xlt.mjs';
import { a as formatWorkingHours, b as formatReadySummary, f as formatTurnaroundBadge } from './turnaround-D4yRvJpV.mjs';
import { listQuoteRequests } from './quoteDraft-5mvcgeM-.mjs';
import { u as usePrintySeo } from './usePrintySeo-CLnVGaAz.mjs';
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
import './Badge-Dn_IFHF_.mjs';
import './formatters-FW8HHCjc.mjs';
import './Input-Hudv-7BP.mjs';
import './SelectMenu-D3Bra_sq.mjs';
import './calculationResult-SiwRgRTu.mjs';
import './gallery-DpmXPp8_.mjs';
import './public-BVuVnl0E.mjs';
import './activityBadges-B_bMwbEc.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './payload-B_6emhZU.mjs';
import './productionDetails-ByImjBQh.mjs';
import './quoteInbox-BZeZ2Gtb.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './guestQuote-BUq63JnA.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ShopRatingSummary",
  __ssrInlineRender: true,
  props: {
    summary: {}
  },
  setup(__props) {
    function formatRating(avg) {
      return avg.toFixed(1);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      if (__props.summary && __props.summary.count > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 text-amber-300 dark:text-amber-400" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: "h-4 w-4 fill-current"
        }, null, _parent));
        _push(`<span class="text-sm font-medium tabular-nums">${ssrInterpolate(formatRating(__props.summary.average))}</span><span class="text-xs text-white/70 dark:text-[var(--p-text-muted)]">(${ssrInterpolate(__props.summary.count)})</span></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopRatingSummary.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$6, { __name: "ShopsShopRatingSummary" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ShopWorkingHours",
  __ssrInlineRender: true,
  props: {
    hours: {}
  },
  setup(__props) {
    const { t } = useI18n();
    function dayLabel(weekday) {
      const weekdayKey = `weekdays.${weekday}`;
      const translated = t(weekdayKey);
      return translated === weekdayKey ? t("shop.dayFallback", { day: weekday }) : translated;
    }
    function formatTime(time) {
      if (!time) return "--";
      return time.length > 5 ? time.slice(0, 5) : time;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-white/12 bg-white/10 px-4 py-2 backdrop-blur-sm dark:border-[var(--p-border)] dark:bg-[var(--p-surface-container-low)]/70" }, _attrs))}><p class="mb-1.5 text-xs font-medium text-white/72 dark:text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.workingHours"))}</p><div class="space-y-1"><!--[-->`);
      ssrRenderList(__props.hours, (h) => {
        _push(`<div class="flex justify-between text-sm"><span class="text-white/72 dark:text-[var(--p-text-muted)]">${ssrInterpolate(h.weekday_display ?? dayLabel(h.weekday))}</span><span class="tabular-nums text-white/92 dark:text-[var(--p-text-dim)]">${ssrInterpolate(h.is_closed ? unref(t)("shop.closed") : `${formatTime(h.from_hour)} - ${formatTime(h.to_hour)}`)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopWorkingHours.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$5, { __name: "ShopsShopWorkingHours" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ShopSocialLinks",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    const PLATFORM_ICONS = {
      facebook: "i-simple-icons-facebook",
      twitter: "i-simple-icons-x",
      instagram: "i-simple-icons-instagram",
      linkedin: "i-simple-icons-linkedin",
      youtube: "i-simple-icons-youtube",
      tiktok: "i-simple-icons-tiktok",
      pinterest: "i-simple-icons-pinterest",
      website: "i-lucide-globe"
    };
    const { t } = useI18n();
    function platformIcon(platform) {
      return PLATFORM_ICONS[platform.toLowerCase()] ?? "i-lucide-link";
    }
    function formatPlatform(platform) {
      return platform.replace(/[-_]/g, " ").trim();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$7;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_UCard, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="text-lg font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(t)("shop.socialLinks"))}</h3>`);
          } else {
            return [
              createVNode("h3", { class: "text-lg font-semibold text-[var(--p-text)]" }, toDisplayString(unref(t)("shop.socialLinks")), 1)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.links?.length) {
              _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.links, (link) => {
                _push2(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener" class="flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3 transition-colors hover:bg-[var(--p-surface-container)]"${_scopeId}><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-700)]"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: platformIcon(link.platform),
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><div class="font-medium capitalize text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(formatPlatform(link.platform))}</div><div class="truncate text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(link.url)}</div></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-up-right",
                  class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
                }, null, _parent2, _scopeId));
                _push2(`</a>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(t)("shop.noSocialLinks"))}</p>`);
            }
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              __props.links?.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.links, (link) => {
                  return openBlock(), createBlock("a", {
                    key: link.id,
                    href: link.url,
                    target: "_blank",
                    rel: "noopener",
                    class: "flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3 transition-colors hover:bg-[var(--p-surface-container)]"
                  }, [
                    createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-700)]" }, [
                      createVNode(_component_UIcon, {
                        name: platformIcon(link.platform),
                        class: "h-4 w-4"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("div", { class: "font-medium capitalize text-[var(--p-text)]" }, toDisplayString(formatPlatform(link.platform)), 1),
                      createVNode("div", { class: "truncate text-sm text-[var(--p-text-muted)]" }, toDisplayString(link.url), 1)
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
                    })
                  ], 8, ["href"]);
                }), 128))
              ])) : (openBlock(), createBlock("p", {
                key: 1,
                class: "text-sm text-[var(--p-text-muted)]"
              }, toDisplayString(unref(t)("shop.noSocialLinks")), 1)),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopSocialLinks.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$4, { __name: "ShopsShopSocialLinks" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "RateCardDisplay",
  __ssrInlineRender: true,
  props: {
    rateCard: {},
    shopName: {}
  },
  setup(__props) {
    const { formatMoney } = useCurrencyFormatter();
    function normalizeServiceUnit(value) {
      return value.replace("PER_SIDE_PER_SHEET", "Per sheet").replace("per sheet per side", "per sheet");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-5xl" }, _attrs))}>`);
      if (__props.shopName) {
        _push(`<h2 class="mb-6 text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(__props.shopName)} Rate Card </h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">`);
      if (__props.rateCard.paper?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-stack",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Paper (per sheet) </h3><p class="mt-0.5 text-xs text-[var(--p-text-muted)]"> Includes printing. Single = 1 side, Double = 2 sides. </p></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">GSM</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.paper, (price, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(price.gsm)} gsm</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.paper_type)}</td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(price.single_price))}</span></td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(price.double_price))}</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-6">`);
      if (__props.rateCard.printing?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-printer",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Printing (per side) </h3><p class="mt-0.5 text-xs text-[var(--p-text-muted)]"> Duplex is calculated from both printed sides, plus any shop duplex surcharge or override. </p></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Size</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.printing, (price, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(price.sheet_size)}</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.color_mode)}</td><td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(price.price_per_side))}</td><td class="px-3 py-2 text-right"><span class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(price.price_double_sided))}</span>`);
          if (price.duplex_surcharge_enabled && price.duplex_surcharge && price.duplex_surcharge !== "0.00") {
            _push(`<span class="mt-0.5 block text-[0.72rem] text-[var(--p-text-muted)]"> Includes ${ssrInterpolate(unref(formatMoney)(price.duplex_surcharge))} surcharge`);
            if (price.duplex_surcharge_min_gsm) {
              _push(`<span> from ${ssrInterpolate(price.duplex_surcharge_min_gsm)}gsm</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.rateCard.finishing?.length) {
        _push(`<section class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"><div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3"><h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-scissors",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` Finishing </h3></div><div class="overflow-x-auto"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-container)]"><tr><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Service</th><th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Unit</th><th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Price</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(__props.rateCard.finishing, (service, index) => {
          _push(`<tr class="hover:bg-[var(--p-surface-container)]"><td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(service.name)} `);
          if (service.category) {
            _push(`<span class="block text-xs text-[var(--p-text-muted)]">${ssrInterpolate(service.category)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(normalizeServiceUnit(service.display_unit_label || service.charge_unit || ""))}</td><td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(service.price))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (!__props.rateCard.printing?.length && !__props.rateCard.paper?.length && !__props.rateCard.finishing?.length) {
        _push(`<div class="py-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-receipt",
          class: "mx-auto h-12 w-12 text-amber-300 dark:text-amber-700"
        }, null, _parent));
        _push(`<h3 class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No pricing available</h3><p class="mt-1 text-sm text-[var(--p-text-muted)]">This shop hasn&#39;t set up their pricing yet.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/RateCardDisplay.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_11 = Object.assign(_sfc_main$3, { __name: "PricingRateCardDisplay" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ShopRateForm",
  __ssrInlineRender: true,
  props: {
    shopId: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const stars = ref(0);
    const comment = ref("");
    const submitting = ref(false);
    const submitted = ref(false);
    const toast = useToast();
    const api = useApi();
    async function onSubmit() {
      if (stars.value < 1) return;
      submitting.value = true;
      try {
        await rateShop(props.shopId, { stars: stars.value, comment: comment.value || void 0 }, api);
        submitted.value = true;
        toast.add({ title: t("shop.ratingSubmitted"), color: "success" });
      } catch {
        toast.add({ title: t("shop.ratingSubmitFailed"), color: "error" });
      } finally {
        submitting.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UTextarea = _sfc_main$8;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4" }, _attrs))}><h4 class="mb-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(t)("shop.rateThisShop"))}</h4><p class="mb-3 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.rateThisShopDescription"))}</p><div class="flex flex-wrap items-center gap-3"><div class="flex gap-1"><!--[-->`);
      ssrRenderList(5, (s) => {
        _push(`<button type="button" class="${ssrRenderClass([s <= unref(stars) ? "text-amber-500 dark:text-amber-400" : "text-[var(--p-border-dim)] dark:text-[var(--p-text-muted)]/45", "p-1 rounded transition-colors hover:bg-amber-200/60 dark:hover:bg-amber-700/40"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-star",
          class: ["h-5 w-5", s <= unref(stars) && "fill-current"]
        }, null, _parent));
        _push(`</button>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(comment),
        "onUpdate:modelValue": ($event) => isRef(comment) ? comment.value = $event : null,
        placeholder: unref(t)("shop.optionalComment"),
        rows: 2,
        class: "min-w-[200px] max-w-full"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        loading: unref(submitting),
        disabled: unref(stars) < 1,
        onClick: onSubmit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("shop.submitRating"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("shop.submitRating")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(submitted)) {
        _push(`<p class="mt-2 text-sm text-emerald-600 dark:text-emerald-400">${ssrInterpolate(unref(t)("shop.ratingThanks"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopRateForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_12 = Object.assign(_sfc_main$2, { __name: "ShopsShopRateForm" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CustomPrintModal",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    shopSlug: {},
    paperOptions: {},
    fixedShopName: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { t } = useI18n();
    const quoteDraftStore = useQuoteDraftStore();
    const toast = useToast();
    const customPrintTitle = computed(() => props.fixedShopName ? t("shop.requestCustomPrintFor", { shop: props.fixedShopName }) : t("shop.requestCustomPrintTitle"));
    const customBookletTitle = computed(() => props.fixedShopName ? t("shop.requestCustomBookletFor", { shop: props.fixedShopName }) : t("shop.singleShopBookletTitle"));
    const customLargeFormatTitle = computed(() => props.fixedShopName ? t("shop.requestLargeFormatFor", { shop: props.fixedShopName }) : t("shop.singleShopLargeFormatTitle"));
    async function onSubmit(payload) {
      if (payload.item_type !== "CUSTOM") return;
      quoteDraftStore.setShop(props.shopSlug);
      await quoteDraftStore.addCustomToQuote(payload);
      toast.add({
        title: t("shop.addedToQuoteTitle"),
        description: t("shop.addedToQuoteDescription", { name: payload.title }),
        color: "success"
      });
      emit("update:modelValue", false);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesPublicCalculator = __nuxt_component_3$2;
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.modelValue) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative z-[100010] max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-white/10 bg-mirage-950 shadow-lg"><div class="p-5 sm:p-6">`);
          _push2(ssrRenderComponent(__nuxt_component_1$1, null, {
            flat: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_QuotesPublicCalculator, {
                  title: unref(customPrintTitle),
                  description: unref(t)("shop.customPrintModalDescription"),
                  eyebrow: unref(t)("shop.customPrintRequestEyebrow"),
                  mode: "single-shop",
                  "fixed-shop-slug": __props.shopSlug,
                  "fixed-shop-name": __props.fixedShopName,
                  onSubmit
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_QuotesPublicCalculator, {
                    title: unref(customPrintTitle),
                    description: unref(t)("shop.customPrintModalDescription"),
                    eyebrow: unref(t)("shop.customPrintRequestEyebrow"),
                    mode: "single-shop",
                    "fixed-shop-slug": __props.shopSlug,
                    "fixed-shop-name": __props.fixedShopName,
                    onSubmit
                  }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
                ];
              }
            }),
            booklet: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(__nuxt_component_3$1, {
                  title: unref(customBookletTitle),
                  description: unref(t)("shop.customBookletModalDescription"),
                  eyebrow: unref(t)("shop.customBookletRequestEyebrow"),
                  "fixed-shop-slug": __props.shopSlug,
                  "fixed-shop-name": __props.fixedShopName
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(__nuxt_component_3$1, {
                    title: unref(customBookletTitle),
                    description: unref(t)("shop.customBookletModalDescription"),
                    eyebrow: unref(t)("shop.customBookletRequestEyebrow"),
                    "fixed-shop-slug": __props.shopSlug,
                    "fixed-shop-name": __props.fixedShopName
                  }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
                ];
              }
            }),
            large_format: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(__nuxt_component_4$1, {
                  title: unref(customLargeFormatTitle),
                  description: unref(t)("shop.customLargeFormatModalDescription"),
                  eyebrow: unref(t)("shop.customLargeFormatRequestEyebrow"),
                  "fixed-shop-slug": __props.shopSlug,
                  "fixed-shop-name": __props.fixedShopName
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(__nuxt_component_4$1, {
                    title: unref(customLargeFormatTitle),
                    description: unref(t)("shop.customLargeFormatModalDescription"),
                    eyebrow: unref(t)("shop.customLargeFormatRequestEyebrow"),
                    "fixed-shop-slug": __props.shopSlug,
                    "fixed-shop-name": __props.fixedShopName
                  }, null, 8, ["title", "description", "eyebrow", "fixed-shop-slug", "fixed-shop-name"])
                ];
              }
            }),
            _: 1
          }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/CustomPrintModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_13 = Object.assign(_sfc_main$1, { __name: "QuotesCustomPrintModal" });
function stripHtmlToText(html) {
  if (html == null || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
const RATABLE_STATUSES = ["SENT", "ACCEPTED"];
function useRatableShops() {
  const ratableShopIds = ref(/* @__PURE__ */ new Set());
  const loaded = ref(false);
  async function load() {
    try {
      const quotes = await listQuoteRequests();
      ratableShopIds.value = new Set(
        quotes.filter((q) => RATABLE_STATUSES.includes(q.status)).map((q) => q.shop)
      );
    } catch {
      ratableShopIds.value = /* @__PURE__ */ new Set();
    } finally {
      loaded.value = true;
    }
  }
  function canRate(shopId) {
    return ratableShopIds.value.has(shopId);
  }
  return { ratableShopIds, loaded, load, canRate };
}
const heroHeaderStyle = "background: linear-gradient(135deg, var(--color-mirage-950) 0%, var(--color-mirage-900) 48%, var(--color-mirage-800) 100%);";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t } = useI18n();
    const slug = computed(() => route.params.slug);
    const quoteDraftStore = useQuoteDraftStore();
    useAuthStore();
    useFavoritesStore();
    const { canRate } = useRatableShops();
    const toast = useToast();
    const { getMediaUrl } = useApi();
    const { trackProductView, trackQuoteStart, trackShopView } = useAnalyticsTracking();
    const catalog = ref(null);
    const loading = ref(true);
    const customModalOpen = ref(false);
    const ratingSummary = ref(null);
    const pricingStore = usePricingStore();
    const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id));
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    const trackedShopSlug = ref(null);
    function openTweak(product) {
      tweakProduct.value = product;
      void trackProductView({
        source: "shop_catalog_tweak",
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        shop_slug: slug.value
      }, {
        onceKey: `shop-product-view:${slug.value}:${product.id}`
      });
      void trackQuoteStart({
        source: "shop_catalog_tweak",
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        shop_slug: slug.value
      }, {
        onceKey: `shop-quote-start:${slug.value}:${product.id}`
      });
      tweakModalOpen.value = true;
    }
    function onItemAdded() {
      toast.add({
        title: t("shop.addedToDraftTitle"),
        description: t("shop.addedToDraftDescription", {
          name: tweakProduct.value?.name ?? t("shop.products")
        })
      });
    }
    watch([loading, catalog], ([isLoading, currentCatalog]) => {
      if (isLoading || !currentCatalog?.shop || trackedShopSlug.value === currentCatalog.shop.slug) {
        return;
      }
      trackedShopSlug.value = currentCatalog.shop.slug;
      void trackShopView({
        source: "shop_catalog_page",
        shop_id: currentCatalog.shop.id,
        shop_slug: currentCatalog.shop.slug,
        shop_name: currentCatalog.shop.name,
        product_count: currentCatalog.products.length
      });
    }, { immediate: true });
    watch(customModalOpen, (open) => {
      if (!open || !catalog.value?.shop) {
        return;
      }
      void trackQuoteStart({
        source: "shop_custom_request_modal",
        shop_id: catalog.value.shop.id,
        shop_slug: catalog.value.shop.slug,
        shop_name: catalog.value.shop.name
      }, {
        onceKey: `shop-custom-quote-start:${catalog.value.shop.slug}`
      });
    });
    function productImageUrl(product) {
      const path = product.primary_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
    }
    function turnaroundBadge(product) {
      return formatTurnaroundBadge(
        product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null),
        product.turnaround_label
      );
    }
    function productCardDescription(product) {
      const parts = [];
      if (product.category) parts.push(product.category);
      if (product.final_size) parts.push(product.final_size);
      if (product.min_quantity) parts.push(t("shop.minimumPieces", { count: product.min_quantity }));
      if (!parts.length) return t("shop.productCardFallback");
      return `${parts.join(" - ")}. ${t("shop.productCardReadySuffix")}`;
    }
    const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay();
    const shopTurnaround = computed(() => {
      const hours = (catalog.value?.products ?? []).map((product) => product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null)).filter((value) => typeof value === "number" && value > 0);
      if (!hours.length) return t("shop.askShop");
      const min = Math.min(...hours);
      const max = Math.max(...hours);
      if (min === max) return formatWorkingHours(min);
      return t("turnaround.workingHoursRange", { min, max });
    });
    const shopStats = computed(() => [
      {
        label: t("shop.products"),
        value: String(catalog.value?.products.length ?? 0),
        icon: "i-lucide-package-2"
      },
      {
        label: t("shop.rating"),
        value: ratingSummary.value?.average ? `${ratingSummary.value.average.toFixed(1)}/5` : t("shop.new"),
        icon: "i-lucide-star"
      },
      {
        label: t("shop.turnaround"),
        value: shopTurnaround.value,
        icon: "i-lucide-timer-reset"
      }
    ]);
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    const shopNotFound = computed(() => !loading.value && !catalog.value?.shop);
    usePrintySeo(() => ({
      title: catalog.value?.shop?.name ?? t("shop.breadcrumbs.shop"),
      description: (() => {
        const desc = catalog.value?.shop?.description;
        if (!desc) return `Browse ${catalog.value?.shop?.name ?? "print shop"} products. Get instant quotes for business cards, flyers, posters.`;
        const plain = stripHtmlToText(desc);
        if (!plain) return `Browse ${catalog.value?.shop?.name ?? "print shop"} products. Get instant quotes for business cards, flyers, posters.`;
        return plain.length > 155 ? `${plain.slice(0, 155)}...` : plain;
      })(),
      path: `/shops/${slug.value}`,
      noIndex: shopNotFound.value,
      breadcrumbs: [
        { name: t("shop.breadcrumbs.home"), path: "/" },
        { name: t("shop.breadcrumbs.shops"), path: "/shops" },
        { name: catalog.value?.shop?.name ?? t("shop.breadcrumbs.shop"), path: `/shops/${slug.value}` }
      ],
      schema: catalog.value?.shop ? [
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: catalog.value.shop.name,
          description: catalog.value.shop.description ? stripHtmlToText(catalog.value.shop.description) || void 0 : void 0,
          url: `${siteUrl}/shops/${slug.value}`
        }
      ] : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_1;
      const _component_NuxtImg = __nuxt_component_5;
      const _component_UIcon = _sfc_main$f;
      const _component_ShopsShopFavoriteToggle = __nuxt_component_4;
      const _component_ShopsShopStatusBadge = __nuxt_component_5$1;
      const _component_ShopsShopRatingSummary = __nuxt_component_6;
      const _component_ShopsShopWorkingHours = __nuxt_component_7;
      const _component_EditorRichTextDisplay = __nuxt_component_6$1;
      const _component_UButton = _sfc_main$9;
      const _component_ShopsShopSocialLinks = __nuxt_component_10;
      const _component_PricingRateCardDisplay = __nuxt_component_11;
      const _component_ShopsShopRateForm = __nuxt_component_12;
      const _component_QuotesCustomPrintModal = __nuxt_component_13;
      const _component_QuotesProductTweakModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)] relative overflow-hidden" }, _attrs))}><div class="pointer-events-none absolute inset-0 -z-10"><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--p-surface-sunken),transparent_45%),linear-gradient(180deg,var(--p-surface-container-low)_0%,var(--p-bg)_52%,var(--p-bg)_100%)]"></div><div class="absolute right-[5%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--color-primary-500)/0.04_0%,transparent_70%)] blur-3xl"></div><div class="absolute left-[2%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,var(--color-mirage-500)/0.05_0%,transparent_70%)] blur-3xl"></div></div><div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(catalog)?.shop) {
        _push(`<!--[--><section class="overflow-hidden rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[var(--p-soft-shadow)] backdrop-blur-xl"><div style="${ssrRenderStyle(heroHeaderStyle)}" class="border-b border-white/10 px-6 py-8 text-white sm:px-10 sm:py-10"><div class="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.95fr)]"><div class="min-w-0"><div class="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("shop.breadcrumbs.home"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("shop.breadcrumbs.home")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span>/</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shops",
          class: "transition-colors hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("shop.breadcrumbs.shops"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("shop.breadcrumbs.shops")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span>/</span><span class="text-white">${ssrInterpolate(unref(catalog).shop.name)}</span></div><div class="flex flex-wrap items-start gap-4"><div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white shadow-lg backdrop-blur-md">`);
        if (unref(catalog).shop.logo) {
          _push(ssrRenderComponent(_component_NuxtImg, {
            src: unref(getMediaUrl)(unref(catalog).shop.logo) || "",
            alt: unref(catalog).shop.name,
            class: "h-full w-full object-cover"
          }, null, _parent));
        } else {
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-8 w-8"
          }, null, _parent));
        }
        _push(`</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-4"><h1 class="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">${ssrInterpolate(unref(catalog).shop.name)}</h1>`);
        _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
          "shop-id": unref(catalog).shop.id,
          "shop-name": unref(catalog).shop.name,
          "shop-slug": unref(catalog).shop.slug
        }, null, _parent));
        _push(`</div><p class="mt-3 max-w-2xl text-base leading-relaxed text-white/80">${ssrInterpolate(unref(t)("shop.heroDescription"))}</p></div></div><div class="mt-6 flex flex-wrap items-center gap-3">`);
        if (unref(catalog).shop.status) {
          _push(ssrRenderComponent(_component_ShopsShopStatusBadge, {
            status: unref(catalog).shop.status
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_ShopsShopRatingSummary, { summary: unref(ratingSummary) }, null, _parent));
        _push(`<span class="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-400)]/20 bg-[var(--color-primary-500)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary-100)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-package-search",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)("shop.readyForQuotes"))}</span></div>`);
        if (unref(catalog).shop.opening_hours?.length) {
          _push(ssrRenderComponent(_component_ShopsShopWorkingHours, {
            hours: unref(catalog).shop.opening_hours,
            class: "mt-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(catalog).shop.description) {
          _push(`<div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"><p class="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">${ssrInterpolate(unref(t)("shop.overview"))}</p>`);
          _push(ssrRenderComponent(_component_EditorRichTextDisplay, {
            html: unref(catalog).shop.description,
            class: "text-sm leading-relaxed text-white/90 prose-a:text-[var(--color-primary-300)] prose-strong:text-white prose-headings:text-white"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4"><div class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md"><p class="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">${ssrInterpolate(unref(t)("shop.quickActions"))}</p><div class="mt-5 space-y-3.5">`);
        if (unref(quoteDraftStore).currentShopSlug === unref(slug) && unref(quoteDraftStore).activeDraft?.items?.length) {
          _push(ssrRenderComponent(_component_UButton, {
            to: "/quote-draft",
            class: "btn-primary w-full justify-between rounded-xl px-5 py-3"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span class="inline-flex items-center gap-2.5"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-shopping-cart",
                  class: "h-5 w-5"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(unref(t)("shop.openRequestsWorkspace"))}</span><span class="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold"${_scopeId}>${ssrInterpolate(unref(quoteDraftStore).activeDraft.items.length)}</span>`);
              } else {
                return [
                  createVNode("span", { class: "inline-flex items-center gap-2.5" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-shopping-cart",
                      class: "h-5 w-5"
                    }),
                    createTextVNode(" " + toDisplayString(unref(t)("shop.openRequestsWorkspace")), 1)
                  ]),
                  createVNode("span", { class: "rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold" }, toDisplayString(unref(quoteDraftStore).activeDraft.items.length), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          class: "w-full justify-between rounded-xl border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10",
          onClick: ($event) => customModalOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center gap-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-pen-tool",
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("shop.requestCustomPrint"))}</span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-up-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center gap-2.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-pen-tool",
                    class: "h-5 w-5"
                  }),
                  createTextVNode(" " + toDisplayString(unref(t)("shop.requestCustomPrint")), 1)
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-up-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          variant: "outline",
          class: "w-full justify-between rounded-xl border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="inline-flex items-center gap-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(t)("shop.backToShops"))}</span>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", { class: "inline-flex items-center gap-2.5" }, [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "h-5 w-5"
                  }),
                  createTextVNode(" " + toDisplayString(unref(t)("shop.backToShops")), 1)
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"><!--[-->`);
        ssrRenderList(unref(shopStats), (stat) => {
          _push(`<div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4.5 backdrop-blur-md"><div class="flex items-center gap-4"><div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-500)] text-white shadow-lg shadow-[var(--color-primary-500)]/20">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: stat.icon,
            class: "h-5 w-5"
          }, null, _parent));
          _push(`</div><div><p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">${ssrInterpolate(stat.label)}</p><p class="mt-0.5 text-lg font-bold text-white tracking-tight">${ssrInterpolate(stat.value)}</p></div></div></div>`);
        });
        _push(`<!--]--></div></div></div></div><div class="px-6 py-6 sm:px-8">`);
        if (unref(catalog).shop.social_links?.length) {
          _push(ssrRenderComponent(_component_ShopsShopSocialLinks, {
            links: unref(catalog).shop.social_links,
            class: "mb-8"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.catalog"))}</p><h2 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">${ssrInterpolate(unref(t)("shop.catalogTitle"))}</h2><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.catalogDescription"))}</p></div><div class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-2 text-xs font-medium text-[var(--p-text-dim)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-sparkles",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(t)(`shop.configuredProducts_${unref(catalog).products.length === 1 ? "one" : "other"}`, { count: unref(catalog).products.length }))}</div></div>`);
        if (unref(catalog).products.length) {
          _push(`<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(catalog).products, (product) => {
            _push(`<article class="group overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[var(--color-primary-300)] hover:shadow-2xl hover:shadow-[var(--color-primary-500)]/10"><button class="block w-full text-left" type="button"><div class="relative aspect-[4/3] overflow-hidden bg-[var(--p-surface-sunken)]">`);
            if (productImageUrl(product)) {
              _push(ssrRenderComponent(_component_NuxtImg, {
                src: productImageUrl(product),
                alt: product.name,
                class: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              }, null, _parent));
            } else {
              _push(`<div class="absolute inset-0 flex items-center justify-center"><div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-muted)] shadow-sm">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-package",
                class: "h-8 w-8"
              }, null, _parent));
              _push(`</div></div>`);
            }
            _push(`<div class="absolute left-4 top-4 flex flex-wrap gap-2">`);
            if (product.category) {
              _push(`<span class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]/90 px-3 py-1 text-[11px] font-bold text-[var(--p-text)] shadow-sm backdrop-blur-md">${ssrInterpolate(product.category)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (product.turnaround_hours || product.turnaround_days) {
              _push(`<span class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-200)]/30 bg-[var(--color-primary-500)]/10 px-3 py-1 text-[11px] font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)] shadow-sm backdrop-blur-md">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-timer-reset",
                class: "h-3.5 w-3.5"
              }, null, _parent));
              _push(` ${ssrInterpolate(turnaroundBadge(product))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></button><div class="space-y-5 p-6"><div><h3 class="text-xl font-bold tracking-tight text-[var(--p-text)] group-hover:text-[var(--color-primary-600)] transition-colors">${ssrInterpolate(product.name)}</h3><p class="mt-2.5 text-sm leading-relaxed text-[var(--p-text-muted)] line-clamp-2">${ssrInterpolate(productCardDescription(product))}</p></div><div class="flex flex-wrap gap-2.5">`);
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]/30 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]">${ssrInterpolate(unref(priceDisplaySummary)(product).totalLine)}</span>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(priceDisplaySummary)(product)) {
              _push(`<span class="inline-flex items-center rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-1.5 text-xs font-bold text-[var(--p-text-dim)]">${ssrInterpolate(unref(priceDisplaySummary)(product).perUnitLine)}</span>`);
            } else {
              _push(`<span class="inline-flex items-center rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]/30 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]">${ssrInterpolate(unref(priceDisplay)(product))}</span>`);
            }
            _push(`</div><div class="grid grid-cols-1 gap-2.5 text-xs text-[var(--p-text-muted)]">`);
            if (product.final_size) {
              _push(`<div class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-ruler",
                class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(product.final_size)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.imposition_summary) {
              _push(`<div class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-grid-2x2",
                class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(unref(t)("shop.fitsOn", { value: product.imposition_summary }))}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.min_quantity) {
              _push(`<div class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-hash",
                class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(unref(t)("shop.minimumPieces", { count: product.min_quantity }))}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            if (product.human_ready_text || product.turnaround_hours) {
              _push(`<div class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">`);
              _push(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-clock-3",
                class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
              }, null, _parent));
              _push(`<span>${ssrInterpolate(unref(formatReadySummary)(product.turnaround_hours, product.human_ready_text))}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (product.finishing_summary?.length) {
              _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(product.finishing_summary, (finish) => {
                _push(`<span class="inline-flex items-center rounded-md border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--p-text-muted)]">${ssrInterpolate(finish)}</span>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_UButton, {
              class: "btn-primary w-full justify-between rounded-xl px-5 py-3.5",
              onClick: ($event) => openTweak(product)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="inline-flex items-center gap-2.5"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-5 w-5"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(unref(t)("shop.configureQuote"))}</span>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "h-4 w-4"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("span", { class: "inline-flex items-center gap-2.5" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-sliders-horizontal",
                        class: "h-5 w-5"
                      }),
                      createTextVNode(" " + toDisplayString(unref(t)("shop.configureQuote")), 1)
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "h-4 w-4"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="mt-12 rounded-[2.5rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-16 text-center"><div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--p-surface)] text-[var(--p-text-muted)] shadow-sm">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-package",
            class: "h-10 w-10"
          }, null, _parent));
          _push(`</div><h3 class="mt-6 text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(t)("shop.noProductsTitle"))}</h3><p class="mt-2 text-base text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.noProductsDescription"))}</p></div>`);
        }
        _push(`</div></section>`);
        if (unref(pricingStore).rateCard) {
          _push(`<section class="mt-10"><div class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-[var(--p-soft-shadow)]">`);
          _push(ssrRenderComponent(_component_PricingRateCardDisplay, {
            "rate-card": unref(pricingStore).rateCard,
            "shop-name": unref(catalog).shop.name
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(canRateShop) && unref(catalog).shop) {
          _push(`<section class="mt-10"><div class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-[var(--p-soft-shadow)]">`);
          _push(ssrRenderComponent(_component_ShopsShopRateForm, {
            "shop-id": unref(catalog).shop.id
          }, null, _parent));
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_QuotesCustomPrintModal, {
          modelValue: unref(customModalOpen),
          "onUpdate:modelValue": ($event) => isRef(customModalOpen) ? customModalOpen.value = $event : null,
          "shop-slug": unref(slug),
          "fixed-shop-name": unref(catalog).shop.name,
          "paper-options": []
        }, null, _parent));
        if (unref(tweakProduct)) {
          _push(ssrRenderComponent(_component_QuotesProductTweakModal, {
            modelValue: unref(tweakModalOpen),
            "onUpdate:modelValue": ($event) => isRef(tweakModalOpen) ? tweakModalOpen.value = $event : null,
            product: unref(tweakProduct),
            "shop-slug": unref(slug),
            "shop-name": unref(catalog).shop.name,
            onAdded: onItemAdded
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-16 text-center shadow-[var(--p-soft-shadow)]"><div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "h-10 w-10"
        }, null, _parent));
        _push(`</div><h3 class="mt-6 text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(t)("shop.shopNotFoundTitle"))}</h3><p class="mt-2 text-base text-[var(--p-text-muted)]">${ssrInterpolate(unref(t)("shop.shopNotFoundDescription"))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          class: "btn-primary mt-8 rounded-xl px-8 py-3.5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("shop.browseShops"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("shop.browseShops")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dovsz3Y6.mjs.map
