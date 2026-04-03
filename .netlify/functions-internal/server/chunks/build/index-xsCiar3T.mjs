import { _ as __nuxt_component_1$1, a as _sfc_main$f, c as __nuxt_component_2, u as useAsyncData } from './server.mjs';
import { defineComponent, withCtx, createVNode, computed, mergeProps, createTextVNode, toDisplayString, withAsyncContext, unref, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_1 } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_3$1 } from './PublicCalculator-kld7cVNY.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { g as getAllProducts } from './gallery-DpmXPp8_.mjs';
import { f as formatTurnaroundBadge } from './turnaround-D4yRvJpV.mjs';
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
import './public-BVuVnl0E.mjs';
import './activityBadges-B_bMwbEc.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';
import './payload-B_6emhZU.mjs';
import './productionDetails-ByImjBQh.mjs';
import './useCurrencyFormatter-tIWAo1tq.mjs';
import './formatters-FW8HHCjc.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "HomeHero",
  __ssrInlineRender: true,
  props: {
    headline: { default: "Get print prices in seconds" },
    subheadline: { default: "Find nearby print shops, configure your job, and see clear estimates fast. Business cards, flyers, brochures—no confusion." },
    primaryCtaTo: { default: "/shops" },
    primaryCtaLabel: { default: "Find a print shop" },
    secondaryCtaTo: { default: "/#demo" },
    secondaryCtaLabel: { default: "Try live pricing" }
  },
  setup(__props) {
    const props = __props;
    const heroHeadline = computed(() => {
      const match = props.headline.match(/^(.*)\s+(in seconds)$/i);
      if (!match) {
        return {
          leading: "",
          trailing: ""
        };
      }
      return {
        leading: match[1],
        trailing: "in Seconds"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ClientOnly = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "top",
        class: "relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-[#08111f] py-16 text-white sm:py-24"
      }, _attrs))}><div class="pointer-events-none absolute inset-0"><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(27,46,86,0.42),transparent_34%),linear-gradient(180deg,#0b1424_0%,#08111f_52%,#09101d_100%)]"></div><div class="absolute right-[8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(68,103,178,0.2)_0%,rgba(68,103,178,0.08)_34%,transparent_72%)] blur-3xl"></div><div class="absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.09)_0%,rgba(251,146,60,0.04)_30%,transparent_72%)] blur-3xl"></div><div class="absolute bottom-[-8rem] left-[18%] h-[18rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08)_0%,rgba(244,114,182,0.03)_34%,transparent_76%)] blur-3xl"></div></div><div class="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8"><div class="lg:grid lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:items-start lg:gap-10 xl:gap-14"><div class="max-w-xl self-start lg:max-w-[31rem] lg:pr-2 xl:max-w-[33rem]"><h1 class="max-w-[14ch] text-[clamp(1.75rem,5.8vw,2.6rem)] font-bold leading-[0.94] tracking-[-0.04em] text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:max-w-[16ch] sm:text-[clamp(2rem,4.4vw,2.95rem)] lg:max-w-[15ch] lg:text-[clamp(2.3rem,3.2vw,3.2rem)]">`);
      if (heroHeadline.value.leading) {
        _push(`<!--[--><span class="block max-w-full whitespace-nowrap">${ssrInterpolate(heroHeadline.value.leading)}</span><span class="mt-2 block w-full text-[1.24em] font-extrabold leading-[0.9] tracking-[-0.055em] text-flamingo-500 drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)] sm:mt-2.5">${ssrInterpolate(heroHeadline.value.trailing)}</span><!--]-->`);
      } else {
        _push(`<!--[-->${ssrInterpolate(props.headline)}<!--]-->`);
      }
      _push(`</h1><p class="mt-5 max-w-xl text-[1rem] leading-7 text-slate-300 sm:text-[1.03rem]">${ssrInterpolate(props.subheadline)}</p><div class="mt-8 flex flex-col gap-3 sm:flex-row">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: props.primaryCtaTo,
        class: "cta-button inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-flamingo-500/25 transition-colors hover:bg-flamingo-400 hover:shadow-flamingo-500/35"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.primaryCtaLabel)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "ml-2 w-4 h-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(props.primaryCtaLabel) + " ", 1),
              createVNode(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "ml-2 w-4 h-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: props.secondaryCtaTo,
        class: "cta-button inline-flex items-center justify-center rounded-xl border border-white/20 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-white transition-colors backdrop-blur-sm hover:bg-slate-800/72"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.secondaryCtaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.secondaryCtaLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-12 min-w-0 lg:mt-0 lg:self-start">`);
      ssrRenderSlot(_ctx.$slots, "demo", {}, () => {
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mt-12 h-48 rounded-2xl border border-white/12 bg-slate-950/72 p-6 backdrop-blur-xl lg:mt-0"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "mt-12 h-48 rounded-2xl border border-white/12 bg-slate-950/72 p-6 backdrop-blur-xl lg:mt-0" })
              ];
            }
          })
        }, _parent));
      }, _push, _parent);
      _push(`</div></div></div></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeHero.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$6, { __name: "HomeHero" });
const iconShellClass$1 = "flex h-11 w-11 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 text-flamingo-500 shadow-[0_10px_24px_rgba(8,17,31,0.24)]";
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HomeWhyPrinty",
  __ssrInlineRender: true,
  setup(__props) {
    const features = [
      {
        problem: "Guessing print prices",
        solution: "Get instant pricing",
        body: "See estimated cost as you configure quantity, paper, and finishing instead of waiting for a callback.",
        icon: "i-lucide-zap"
      },
      {
        problem: "Waiting for quotes",
        solution: "Compare shops faster",
        body: "Browse nearby print shops and move into the right option quickly when you already know the job basics.",
        icon: "i-lucide-store"
      },
      {
        problem: "Confusing specifications",
        solution: "Use guided configuration",
        body: "Choose the product, size, quantity, and extras in a flow that is easier to follow than manual quote chats.",
        icon: "i-lucide-sliders-horizontal"
      },
      {
        problem: "Messy quote requests",
        solution: "Send cleaner briefs",
        body: "Shops receive clearer job details, which makes follow-up and revisions quicker for both sides.",
        icon: "i-lucide-send"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "border-t border-[var(--p-border)] bg-[var(--p-surface)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl text-center"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> Why Printy </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> Solve the common print buying friction first </h2><p class="mt-3 text-base leading-7 text-[var(--p-text)]"> Printy removes the parts of buying print that usually waste time before a shop can even respond. </p></div><div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-6 shadow-sm"><div class="${ssrRenderClass(iconShellClass$1)}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: feature.icon,
          class: "h-5 w-5"
        }, null, _parent));
        _push(`</div><p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--p-text)]">${ssrInterpolate(feature.problem)}</p><h3 class="mt-2 text-lg font-semibold text-[var(--p-text)]">${ssrInterpolate(feature.solution)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text)]">${ssrInterpolate(feature.body)}</p></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeWhyPrinty.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$5, { __name: "HomeWhyPrinty" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HomePopularProducts",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: productsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("home-public-products", () => getAllProducts())), __temp = await __temp, __restore(), __temp);
    const products = computed(() => productsData.value ?? []);
    const productCards = computed(() => {
      return products.value.filter((product) => product.slug && product.shop?.slug).slice(0, 6).map((product) => ({
        slug: product.slug,
        shopSlug: product.shop.slug,
        to: `/products/${product.slug}`,
        title: product.name,
        description: trimDescription(product.description, productCategoryName(product)),
        icon: iconForProduct(product),
        capsules: capsulesForProduct(product),
        priceLabel: productPriceLabel(product),
        deliveryLabel: formatTurnaroundBadge(
          product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null),
          product.turnaround_label
        ),
        shopName: product.shop.name,
        minQuantityLabel: minimumQuantityLabel(product.min_quantity)
      }));
    });
    function productCategoryName(product) {
      const category = product.category;
      if (typeof category === "string") return category.trim();
      if (category && typeof category === "object" && "name" in category && typeof category.name === "string") {
        return category.name.trim();
      }
      return "";
    }
    function trimDescription(description, category) {
      const text = (description || "").trim();
      if (text) return text.length > 110 ? `${text.slice(0, 107)}...` : text;
      if (category) return `${category} print product with live pricing signals and quote-ready setup.`;
      return "Live product listing with quote-ready setup and clear pricing cues.";
    }
    function productPriceLabel(product) {
      const direct = product.price_hint?.price_display;
      if (direct) return direct.replace(/\bKSh\b/gi, "KES");
      const low = product.price_range_est?.lowest?.total;
      const high = product.price_range_est?.highest?.total;
      if (low && high && Number(high) > Number(low)) {
        return `KES ${formatNumber(low)} - ${formatNumber(high)}`;
      }
      if (low) return `KES ${formatNumber(low)}`;
      const hintLow = product.price_hint?.min_price;
      const hintHigh = product.price_hint?.max_price;
      if (hintLow != null && hintHigh != null && Number(hintHigh) > Number(hintLow)) {
        return `KES ${formatNumber(hintLow)} - ${formatNumber(hintHigh)}`;
      }
      if (hintLow != null) return `KES ${formatNumber(hintLow)}`;
      return "Price on request";
    }
    function minimumQuantityLabel(quantity) {
      if (!quantity) return "Minimum on request";
      return `Min ${formatNumber(quantity)}`;
    }
    function capsulesForProduct(product) {
      const capsules = [];
      const category = productCategoryName(product);
      if (category) capsules.push(category);
      capsules.push(product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet Print");
      if (product.min_quantity) capsules.push(`Min ${formatNumber(product.min_quantity)}`);
      return capsules.slice(0, 3);
    }
    function formatNumber(value) {
      const amount = typeof value === "number" ? value : Number.parseFloat(value);
      if (!Number.isFinite(amount)) return value;
      return new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount);
    }
    function iconForProduct(product) {
      const key = `${product.slug ?? ""} ${product.name} ${productCategoryName(product)}`.toLowerCase();
      if (key.includes("business")) return "i-lucide-credit-card";
      if (key.includes("flyer")) return "i-lucide-file-text";
      if (key.includes("brochure")) return "i-lucide-book-open";
      if (key.includes("sticker") || key.includes("label")) return "i-lucide-sticker";
      if (key.includes("banner")) return "i-lucide-panel-top";
      if (key.includes("receipt")) return "i-lucide-receipt";
      if (key.includes("poster")) return "i-lucide-image";
      return "i-lucide-package";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-surface)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div class="max-w-2xl"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> Popular Products </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> Start with products people request most often </h2><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> Browse common print jobs first, see entry pricing quickly, and jump into a product page with fewer decisions upfront. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center gap-2 self-start rounded-xl border border-flamingo-500/30 bg-flamingo-500/12 px-4 py-2.5 text-sm font-semibold text-flamingo-500 transition-colors hover:bg-flamingo-500/18"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse full gallery `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4 text-flamingo-500"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Browse full gallery "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4 text-flamingo-500"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(productCards), (product) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: `${product.shopSlug}-${product.slug}`,
          to: product.to,
          class: "group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-300/40 hover:bg-[var(--p-surface-container)] dark:hover:border-flamingo-700/40"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-7"${_scopeId}><div${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex h-14 w-14 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm transition-transform duration-300 group-hover:scale-105"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: product.icon,
                class: "h-7 w-7 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`</div><span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.minQuantityLabel)}</span></div><h3 class="mt-7 text-2xl font-bold tracking-tight text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(product.title)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.description)}</p><div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--p-text-muted)]"${_scopeId}><span class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(product.shopName)}</span><span class="inline-flex items-center gap-1"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-clock-3",
                class: "h-3.5 w-3.5 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(product.deliveryLabel)}</span></div><div class="mt-6 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(product.capsules, (capsule) => {
                _push2(`<span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(capsule)}</span>`);
              });
              _push2(`<!--]--></div></div><div class="mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4"${_scopeId}><div${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}> From price </p><p class="mt-1 text-xl font-extrabold text-flamingo-500"${_scopeId}>${ssrInterpolate(product.priceLabel)}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.minQuantityLabel)}</p></div><span class="flex h-12 w-12 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-7" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                      createVNode("div", { class: "flex h-14 w-14 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm transition-transform duration-300 group-hover:scale-105" }, [
                        createVNode(_component_UIcon, {
                          name: product.icon,
                          class: "h-7 w-7 text-flamingo-500"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("span", { class: "rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]" }, toDisplayString(product.minQuantityLabel), 1)
                    ]),
                    createVNode("h3", { class: "mt-7 text-2xl font-bold tracking-tight text-[var(--p-text)]" }, toDisplayString(product.title), 1),
                    createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(product.description), 1),
                    createVNode("div", { class: "mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--p-text-muted)]" }, [
                      createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(product.shopName), 1),
                      createVNode("span", { class: "inline-flex items-center gap-1" }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-clock-3",
                          class: "h-3.5 w-3.5 text-flamingo-500"
                        }),
                        createTextVNode(" " + toDisplayString(product.deliveryLabel), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-6 flex flex-wrap gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(product.capsules, (capsule) => {
                        return openBlock(), createBlock("span", {
                          key: capsule,
                          class: "rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"
                        }, toDisplayString(capsule), 1);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", { class: "mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, " From price "),
                      createVNode("p", { class: "mt-1 text-xl font-extrabold text-flamingo-500" }, toDisplayString(product.priceLabel), 1),
                      createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(product.minQuantityLabel), 1)
                    ]),
                    createVNode("span", { class: "flex h-12 w-12 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "h-5 w-5"
                      })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomePopularProducts.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$4, { __name: "HomePopularProducts" });
const HERO_LOCATION_METADATA = {
  cbd: {
    slug: "cbd",
    label: "Nairobi CBD",
    shops: 48,
    deliveryMode: "pickup same day available",
    serviceNote: "Most shops offer same-day pickup in CBD"
  },
  westlands: {
    slug: "westlands",
    label: "Westlands",
    shops: 21,
    deliveryMode: "pickup or delivery"
  },
  kilimani: {
    slug: "kilimani",
    label: "Kilimani",
    shops: 14,
    deliveryMode: "delivery available"
  },
  "industrial-area": {
    slug: "industrial-area",
    label: "Industrial Area",
    shops: 9,
    deliveryMode: "pickup preferred",
    serviceNote: "Industrial area shops often have lower minimums"
  },
  nairobi: {
    slug: "nairobi",
    label: "Thika Road / Nairobi North",
    shops: 12,
    deliveryMode: "pickup or delivery"
  },
  mombasa: {
    slug: "mombasa",
    label: "Mombasa",
    shops: 16,
    deliveryMode: "pickup or delivery",
    serviceNote: "1–2 day turnaround for Mombasa orders"
  },
  kisumu: {
    slug: "kisumu",
    label: "Kisumu",
    shops: 8,
    deliveryMode: "pickup or delivery",
    serviceNote: "2–3 day turnaround for Kisumu orders"
  }
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HomePopularLocations",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = [
      {
        slug: "nairobi",
        name: "Nairobi",
        description: "The broadest mix of commercial print shops, express turnaround, and corporate-ready vendors.",
        caption: "Corporate jobs and high-volume requests",
        icon: "i-lucide-building-2",
        tags: ["Corporate print", "Fast quotes"]
      },
      {
        slug: "westlands",
        name: "Westlands",
        description: "Ideal for agency work, polished marketing collateral, and premium small-batch printing.",
        caption: "Brand and campaign work",
        icon: "i-lucide-briefcase-business",
        tags: ["Branding", "Short runs"]
      },
      {
        slug: "kilimani",
        name: "Kilimani",
        description: "A strong option for studio print jobs, event materials, menus, and creative business assets.",
        caption: "Studios, menus, promo jobs",
        icon: "i-lucide-palette",
        tags: ["Menus", "Event print"]
      },
      {
        slug: "cbd",
        name: "CBD",
        description: "Best for walk-in convenience, urgent business stationery, and quick same-day production.",
        caption: "Fast access and dense vendor coverage",
        icon: "i-lucide-map-pinned",
        tags: ["Same day", "Business cards"]
      },
      {
        slug: "industrial-area",
        name: "Industrial Area",
        description: "Built for volume, packaging, large format, and heavier commercial production requirements.",
        caption: "Bulk and large-format capacity",
        icon: "i-lucide-factory",
        tags: ["Bulk print", "Large format"]
      },
      {
        slug: "mombasa",
        name: "Mombasa",
        description: "Coastal print capacity for hospitality, events, branding, and regional business operations.",
        caption: "Tourism and hospitality demand",
        icon: "i-lucide-ship-wheel",
        tags: ["Hospitality", "Regional reach"]
      }
    ].map((location) => ({
      ...location,
      shopsLabel: `${HERO_LOCATION_METADATA[location.slug]?.shops ?? 0} shops`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-bg)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl text-center"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]"> Popular Locations </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> Start with the locations where demand is highest </h2><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> Pick a location first when you already know where the job should be printed, collected, or delivered. </p></div><div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(locations), (loc) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: loc.slug,
          to: `/locations/${loc.slug}`,
          class: "group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-300/40 hover:bg-[var(--p-surface-container)] dark:hover:border-flamingo-700/40"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-6"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: loc.icon,
                class: "h-6 w-6 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`</div><span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(loc.shopsLabel)}</span></div><h3 class="mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.name)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(loc.description)}</p><div class="mt-5 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(loc.tags, (tag) => {
                _push2(`<span class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"${_scopeId}>${ssrInterpolate(tag)}</span>`);
              });
              _push2(`<!--]--></div><div class="mt-8 flex items-center justify-between border-t border-[var(--p-border)] pt-4"${_scopeId}><div${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Best for</p><p class="mt-1 text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.caption)}</p></div><span class="flex h-11 w-11 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-6" }, [
                  createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                    createVNode("div", { class: "flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm" }, [
                      createVNode(_component_UIcon, {
                        name: loc.icon,
                        class: "h-6 w-6 text-flamingo-500"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("span", { class: "rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]" }, toDisplayString(loc.shopsLabel), 1)
                  ]),
                  createVNode("h3", { class: "mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]" }, toDisplayString(loc.name), 1),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(loc.description), 1),
                  createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(loc.tags, (tag) => {
                      return openBlock(), createBlock("span", {
                        key: tag,
                        class: "rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"
                      }, toDisplayString(tag), 1);
                    }), 128))
                  ]),
                  createVNode("div", { class: "mt-8 flex items-center justify-between border-t border-[var(--p-border)] pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Best for"),
                      createVNode("p", { class: "mt-1 text-sm font-semibold text-[var(--p-text)]" }, toDisplayString(loc.caption), 1)
                    ]),
                    createVNode("span", { class: "flex h-11 w-11 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "h-5 w-5"
                      })
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomePopularLocations.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$3, { __name: "HomePopularLocations" });
const iconShellClass = "flex h-14 w-14 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 shadow-[0_12px_30px_rgba(8,17,31,0.28)]";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeHowItWorks",
  __ssrInlineRender: true,
  setup(__props) {
    const steps = [
      {
        number: 1,
        title: "Choose a product and the right format",
        body: "Start with real catalog products, then select the size, quantity, and production brief that matches the job.",
        icon: "i-lucide-layout-panel-top",
        tags: ["Live catalog", "Size options"]
      },
      {
        number: 2,
        title: "Compare shops, pricing, and turnaround",
        body: "Review nearby shops with pricing cues, delivery timing, and rating signals before sending the request.",
        icon: "i-lucide-scale-3d",
        tags: ["Ratings", "Delivery time"]
      },
      {
        number: 3,
        title: "Send the request and track the response",
        body: "Receive sent or revised quotes, accept the best option, and move the job into the next production step.",
        icon: "i-lucide-send",
        tags: ["Revisions", "Accepted quotes"]
      }
    ];
    const sizes = [
      { label: "Standard", caption: "Classic card format", previewClass: "h-10 w-16 rounded-sm" },
      { label: "Rounded", caption: "Modern edge", previewClass: "h-10 w-16 rounded-lg" },
      { label: "Square", caption: "Compact impact", previewClass: "h-12 w-12 rounded-sm" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "how-it-works",
        class: "scroll-mt-20 bg-[var(--p-bg)] py-16 sm:py-24"
      }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl text-center"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> How it works </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> A cleaner route from selection to a production-ready quote </h2><p class="mt-3 text-base leading-7 text-[var(--p-text)]"> Choose a live catalog product, refine the specification, compare shops, and send one precise request. </p></div><div class="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]"><article class="rounded-2xl bg-[var(--p-surface)] p-1"><div class="h-full rounded-xl bg-[var(--p-surface-sunken)] p-8"><div class="flex items-start justify-between gap-4"><div><span class="inline-flex rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text)]"> Step 1 </span><h3 class="mt-5 text-2xl font-bold tracking-tight text-[var(--p-text)]">${ssrInterpolate(steps[0].title)}</h3><p class="mt-3 max-w-md text-sm leading-6 text-[var(--p-text)]">${ssrInterpolate(steps[0].body)}</p></div><div class="${ssrRenderClass(iconShellClass)}">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: steps[0].icon,
        class: "h-7 w-7 text-flamingo-500"
      }, null, _parent));
      _push(`</div></div><div class="mt-8 grid grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(sizes, (size) => {
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-white p-4 text-center shadow-sm"><div class="${ssrRenderClass([size.previewClass, "mx-auto mb-4 border-2 border-[var(--p-border)]/70 bg-[var(--p-surface-sunken)]"])}"></div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(size.label)}</p><p class="mt-1 text-xs text-[var(--p-text)]">${ssrInterpolate(size.caption)}</p></div>`);
      });
      _push(`<!--]--></div></div></article><!--[-->`);
      ssrRenderList(steps.slice(1), (step) => {
        _push(`<article class="rounded-2xl bg-[var(--p-surface)] p-1"><div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-8"><div class="${ssrRenderClass(iconShellClass)}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: step.icon,
          class: "h-7 w-7 text-flamingo-500"
        }, null, _parent));
        _push(`</div><span class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500"> Step ${ssrInterpolate(step.number)}</span><h3 class="mt-3 text-2xl font-bold tracking-tight text-[var(--p-text)]">${ssrInterpolate(step.title)}</h3><p class="mt-3 text-sm leading-6 text-[var(--p-text)]">${ssrInterpolate(step.body)}</p><div class="mt-6 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(step.tags, (tag) => {
          _push(`<span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text)]">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div></div></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeHowItWorks.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "HomeHowItWorks" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HomeShopOwnerCTA",
  __ssrInlineRender: true,
  props: {
    primaryCtaTo: { default: "/#demo" },
    primaryCtaLabel: { default: "Try live pricing" },
    secondaryCtaTo: { default: "/shops" },
    secondaryCtaLabel: { default: "Browse shops" }
  },
  setup(__props) {
    const highlights = [
      {
        title: "Configure before you call",
        body: "Start with product, quantity, paper, and finishing so you already know the shape of the job.",
        icon: "i-lucide-sliders-horizontal"
      },
      {
        title: "See pricing early",
        body: "Use the live calculator to get orientation on cost before you commit to one shop.",
        icon: "i-lucide-badge-dollar-sign"
      },
      {
        title: "Compare nearby options",
        body: "Move from pricing into shop comparison without restarting the whole process.",
        icon: "i-lucide-map-pinned"
      },
      {
        title: "Send a cleaner request",
        body: "When you are ready, share a more complete brief that is easier for shops to respond to.",
        icon: "i-lucide-send"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-surface)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div class="overflow-hidden rounded-3xl border border-flamingo-500/20 bg-[var(--p-text)] text-white"><div class="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14"><div class="absolute right-0 top-0 h-48 w-48 rounded-full bg-flamingo-500/16 blur-3xl"></div><div class="relative z-10"><span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500"> Try Printy </span><h2 class="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl"> Start with the calculator, then send a cleaner print request </h2><p class="mt-4 max-w-2xl text-base leading-7 text-slate-300"> Use live pricing to understand the job first, then compare shops or open a request once the basics are already clear. </p><div class="mt-8 flex flex-col gap-4 sm:flex-row">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.primaryCtaTo,
        class: "cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.primaryCtaLabel)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(__props.primaryCtaLabel) + " ", 1),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.secondaryCtaTo,
        class: "cta-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.secondaryCtaLabel)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(__props.secondaryCtaLabel) + " ", 1),
              createVNode(_component_UIcon, {
                name: "i-lucide-store",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative z-10 grid gap-4 sm:grid-cols-2"><!--[-->`);
      ssrRenderList(highlights, (item) => {
        _push(`<div class="rounded-2xl border border-white/10 bg-white/5 p-5"><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: item.icon,
          class: "h-6 w-6 text-flamingo-500"
        }, null, _parent));
        _push(`</div><h3 class="mt-4 text-base font-semibold text-white">${ssrInterpolate(item.title)}</h3><p class="mt-2 text-sm leading-6 text-slate-300">${ssrInterpolate(item.body)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeShopOwnerCTA.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "HomeShopOwnerCTA" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    usePrintySeo({
      title: "Print Prices in Seconds | Find Print Shops in Kenya",
      description: "Get instant printing quotes for business cards, flyers, brochures, and more. Find nearby print shops in Nairobi, Mombasa, Kisumu. Compare prices and request quotes fast."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HomeHero = __nuxt_component_0;
      const _component_QuotesCalculatorHub = __nuxt_component_1;
      const _component_QuotesPublicCalculator = __nuxt_component_3$1;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      const _component_HomeWhyPrinty = __nuxt_component_5;
      const _component_HomePopularProducts = __nuxt_component_6;
      const _component_HomePopularLocations = __nuxt_component_7;
      const _component_HomeHowItWorks = __nuxt_component_8;
      const _component_HomeShopOwnerCTA = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_HomeHero, {
        headline: "Get print prices in seconds",
        subheadline: "Find nearby print shops in Kenya, compare offers clearly, and configure jobs like business cards, flyers, brochures, and banners without confusion.",
        "primary-cta-to": "/shops",
        "primary-cta-label": "Find a print shop",
        "secondary-cta-to": "/#hero-calculator",
        "secondary-cta-label": "Open calculator"
      }, {
        demo: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
              flat: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_QuotesPublicCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    mode: "marketplace",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_QuotesPublicCalculator, {
                      "anchor-id": "hero-calculator",
                      eyebrow: "",
                      title: "",
                      description: "",
                      mode: "marketplace",
                      compact: "",
                      "calculator-type": slotProps.activeType,
                      "calculator-type-options": slotProps.availableOptions,
                      "calculator-switcher-placement": "preview",
                      "onUpdate:calculatorType": slotProps.setActiveType
                    }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                  ];
                }
              }),
              booklet: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_QuotesBookletCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_QuotesBookletCalculator, {
                      "anchor-id": "hero-calculator",
                      eyebrow: "",
                      title: "",
                      description: "",
                      compact: "",
                      "calculator-type": slotProps.activeType,
                      "calculator-type-options": slotProps.availableOptions,
                      "calculator-switcher-placement": "preview",
                      "onUpdate:calculatorType": slotProps.setActiveType
                    }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                  ];
                }
              }),
              large_format: withCtx((slotProps, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_QuotesLargeFormatCalculator, {
                      "anchor-id": "hero-calculator",
                      eyebrow: "",
                      title: "",
                      description: "",
                      compact: "",
                      "calculator-type": slotProps.activeType,
                      "calculator-type-options": slotProps.availableOptions,
                      "calculator-switcher-placement": "preview",
                      "onUpdate:calculatorType": slotProps.setActiveType
                    }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_QuotesCalculatorHub, null, {
                flat: withCtx((slotProps) => [
                  createVNode(_component_QuotesPublicCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    mode: "marketplace",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                ]),
                booklet: withCtx((slotProps) => [
                  createVNode(_component_QuotesBookletCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                ]),
                large_format: withCtx((slotProps) => [
                  createVNode(_component_QuotesLargeFormatCalculator, {
                    "anchor-id": "hero-calculator",
                    eyebrow: "",
                    title: "",
                    description: "",
                    compact: "",
                    "calculator-type": slotProps.activeType,
                    "calculator-type-options": slotProps.availableOptions,
                    "calculator-switcher-placement": "preview",
                    "onUpdate:calculatorType": slotProps.setActiveType
                  }, null, 8, ["calculator-type", "calculator-type-options", "onUpdate:calculatorType"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_HomeWhyPrinty, null, null, _parent));
      _push(ssrRenderComponent(_component_HomePopularProducts, null, null, _parent));
      _push(ssrRenderComponent(_component_HomePopularLocations, null, null, _parent));
      _push(ssrRenderComponent(_component_HomeHowItWorks, null, null, _parent));
      _push(ssrRenderComponent(_component_HomeShopOwnerCTA, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-xsCiar3T.mjs.map
