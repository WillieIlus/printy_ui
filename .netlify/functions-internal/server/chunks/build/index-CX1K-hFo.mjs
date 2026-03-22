import { _ as __nuxt_component_3$1, a as _sfc_main$f, b as __nuxt_component_2$1, u as useAsyncData } from './server.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, withAsyncContext, unref, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderSlot, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { l as listShops } from './public-B7HBUiIZ.mjs';
import { g as getRatingSummary } from './ratings-Do1hf-Ug.mjs';
import { g as getAllProducts } from './gallery-B-1C6f8x.mjs';
import { u as usePrintySeo } from './usePrintySeo-wTwluGFY.mjs';
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
      const match = props.headline.match(/^(.*)\s+(seconds)$/i);
      if (!match) {
        return {
          leading: "",
          trailing: ""
        };
      }
      return {
        leading: match[1],
        trailing: match[2].toUpperCase()
      };
    });
    const heroHeadlineStyle = computed(() => {
      if (!heroHeadline.value.leading) return {};
      return {
        width: `${Math.max(heroHeadline.value.leading.length - 1, heroHeadline.value.trailing.length)}ch`,
        maxWidth: "100%"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ClientOnly = __nuxt_component_2$1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "top",
        class: "relative overflow-hidden bg-[#101828] py-16 sm:py-24 w-screen max-w-none left-1/2 -translate-x-1/2"
      }, _attrs))}><div class="absolute inset-0 opacity-20"><div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div><div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div><div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div></div><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start"><div class="max-w-xl"><h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">`);
      if (heroHeadline.value.leading) {
        _push(`<!--[--><span class="block">${ssrInterpolate(heroHeadline.value.leading)}</span><span class="mt-2 block uppercase tracking-[0.12em] text-flamingo-500 sm:text-[1.08em] lg:text-[1.02em]" style="${ssrRenderStyle(heroHeadlineStyle.value)}">${ssrInterpolate(heroHeadline.value.trailing)}</span><!--]-->`);
      } else {
        _push(`<!--[-->${ssrInterpolate(props.headline)}<!--]-->`);
      }
      _push(`</h1><p class="mt-5 text-lg text-gray-300 leading-relaxed">${ssrInterpolate(props.subheadline)}</p><div class="mt-8 flex flex-col sm:flex-row gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: props.primaryCtaTo,
        class: "btn-primary inline-flex items-center justify-center rounded-xl bg-white/95 px-6 py-3.5 text-sm font-bold text-[#101828] hover:bg-white transition-colors shadow-lg"
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
        class: "inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
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
      _push(`</div></div><div class="mt-12 lg:mt-0">`);
      ssrRenderSlot(_ctx.$slots, "demo", {}, () => {
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="mt-12 lg:mt-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-48"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "mt-12 lg:mt-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-48" })
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
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl text-center"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]"> How it works </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> A cleaner route from selection to a production-ready quote </h2><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> Choose a live catalog product, refine the specification, compare shops, and send one precise request. </p></div><div class="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]"><article class="rounded-2xl bg-[var(--p-surface)] p-1"><div class="h-full rounded-xl bg-[var(--p-surface-sunken)] p-8"><div class="flex items-start justify-between gap-4"><div><span class="inline-flex rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"> Step 1 </span><h3 class="mt-5 text-2xl font-bold tracking-tight text-[var(--p-text)]">${ssrInterpolate(steps[0].title)}</h3><p class="mt-3 max-w-md text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(steps[0].body)}</p></div><div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: steps[0].icon,
        class: "h-7 w-7 text-[var(--p-primary)]"
      }, null, _parent));
      _push(`</div></div><div class="mt-8 grid grid-cols-3 gap-4"><!--[-->`);
      ssrRenderList(sizes, (size) => {
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-white p-4 text-center shadow-sm"><div class="${ssrRenderClass([size.previewClass, "mx-auto mb-4 border-2 border-[var(--p-border)]/70 bg-[var(--p-surface-sunken)]"])}"></div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(size.label)}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]">${ssrInterpolate(size.caption)}</p></div>`);
      });
      _push(`<!--]--></div></div></article><!--[-->`);
      ssrRenderList(steps.slice(1), (step) => {
        _push(`<article class="rounded-2xl bg-[var(--p-surface)] p-1"><div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-8"><div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: step.icon,
          class: "h-7 w-7 text-[var(--p-primary)]"
        }, null, _parent));
        _push(`</div><span class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-primary)]"> Step ${ssrInterpolate(step.number)}</span><h3 class="mt-3 text-2xl font-bold tracking-tight text-[var(--p-text)]">${ssrInterpolate(step.title)}</h3><p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(step.body)}</p><div class="mt-6 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(step.tags, (tag) => {
          _push(`<span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div></div></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeHowItWorks.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$5, { __name: "HomeHowItWorks" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HomePopularProducts",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: productsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("home-public-products", () => getAllProducts())), __temp = await __temp, __restore(), __temp);
    const { data: shopsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("home-public-shops", () => listShops())), __temp = await __temp, __restore(), __temp);
    const { data: ratingSummaries } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-rating-summaries", async () => {
      const products2 = await getAllProducts();
      const slugs = [...new Set(products2.map((product) => product.shop?.slug).filter(Boolean))];
      const summaries = await Promise.all(
        slugs.map(async (slug) => ({ slug, summary: await getRatingSummary(slug) }))
      );
      return Object.fromEntries(
        summaries.filter((entry) => entry.summary && entry.summary.count > 0).map((entry) => [entry.slug, entry.summary])
      );
    })), __temp = await __temp, __restore(), __temp);
    const products = computed(() => productsData.value ?? []);
    const shops = computed(() => shopsData.value ?? []);
    const ratings = computed(() => ratingSummaries.value ?? {});
    const productCards = computed(() => {
      return products.value.filter((product) => product.slug && product.shop?.slug).slice(0, 5).map((product) => ({
        slug: product.slug,
        shopSlug: product.shop.slug,
        to: `/products/${product.slug}`,
        title: product.name,
        description: trimDescription(product.description, productCategoryName(product)),
        icon: iconForProduct(product),
        capsules: capsulesForProduct(product),
        priceLabel: productPriceLabel(product),
        deliveryLabel: turnaroundLabel(product.turnaround_days),
        shopName: product.shop.name,
        ratingLabel: ratingLabel(product.shop.slug)
      }));
    });
    const quoteCards = computed(() => {
      return products.value.filter((product) => product.shop?.slug).slice(0, 3).map((product) => ({
        shopSlug: product.shop.slug,
        shopName: product.shop.name,
        productSlug: product.slug ?? String(product.id),
        productTitle: product.name,
        priceLabel: productPriceLabel(product),
        deliveryLabel: turnaroundLabel(product.turnaround_days),
        badge: shopBadge(product.shop, shops.value),
        icon: iconForProduct(product),
        to: `/shops/${product.shop.slug}`,
        ratingLabel: ratingLabel(product.shop.slug)
      }));
    });
    function ratingLabel(shopSlug) {
      if (!shopSlug) return null;
      const summary = ratings.value[shopSlug];
      if (!summary?.count) return null;
      return `${summary.average.toFixed(1)} (${summary.count})`;
    }
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
    function turnaroundLabel(days) {
      if (!days) return "On request";
      return `${days} business day${days === 1 ? "" : "s"}`;
    }
    function capsulesForProduct(product) {
      const capsules = [];
      const category = productCategoryName(product);
      if (category) capsules.push(category);
      capsules.push(product.pricing_mode === "LARGE_FORMAT" ? "Large Format" : "Sheet Print");
      if (product.min_quantity) capsules.push(`Min ${product.min_quantity}`);
      return capsules.slice(0, 3);
    }
    function shopBadge(shop, publicShops) {
      const current = publicShops.find((entry) => entry.slug === shop?.slug);
      if (current?.status === "opening") return "Open now";
      if (current?.status === "closing_soon") return "Closing soon";
      if (current?.status === "closed") return "Offline";
      return "Quote ready";
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
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-surface)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div class="max-w-2xl"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> Popular Products </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> Live catalog products, presented with a cleaner corporate edge </h2><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> This section now pulls from real product and shop data, while staying close to the tonal stitch layout. </p></div>`);
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
      _push(`</div><div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(productCards), (product) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: `${product.shopSlug}-${product.slug}`,
          to: product.to,
          class: "group relative rounded-2xl bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--p-surface-container)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-8"${_scopeId}><div${_scopeId}><div class="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm transition-transform duration-300 group-hover:scale-105"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: product.icon,
                class: "h-7 w-7 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`</div><h3 class="text-2xl font-bold tracking-tight text-flamingo-500"${_scopeId}>${ssrInterpolate(product.title)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.description)}</p><div class="mt-4 flex items-center gap-3 text-xs text-[var(--p-text-muted)]"${_scopeId}><span class="font-medium text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(product.shopName)}</span>`);
              if (product.ratingLabel) {
                _push2(`<span class="inline-flex items-center gap-1 text-amber-600"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-star",
                  class: "h-3.5 w-3.5 fill-current"
                }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(product.ratingLabel)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="mt-6 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(product.capsules, (capsule) => {
                _push2(`<span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(capsule)}</span>`);
              });
              _push2(`<!--]--></div></div><div class="mt-8 flex items-center justify-between border-t border-white/50 pt-4"${_scopeId}><div${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Starting from</p><p class="mt-1 text-xl font-extrabold text-flamingo-500"${_scopeId}>${ssrInterpolate(product.priceLabel)}</p><p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.deliveryLabel)}</p></div><span class="flex h-12 w-12 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-5 w-5"
              }, null, _parent2, _scopeId));
              _push2(`</span></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-8" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm transition-transform duration-300 group-hover:scale-105" }, [
                      createVNode(_component_UIcon, {
                        name: product.icon,
                        class: "h-7 w-7 text-flamingo-500"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("h3", { class: "text-2xl font-bold tracking-tight text-flamingo-500" }, toDisplayString(product.title), 1),
                    createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(product.description), 1),
                    createVNode("div", { class: "mt-4 flex items-center gap-3 text-xs text-[var(--p-text-muted)]" }, [
                      createVNode("span", { class: "font-medium text-[var(--p-text)]" }, toDisplayString(product.shopName), 1),
                      product.ratingLabel ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex items-center gap-1 text-amber-600"
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-star",
                          class: "h-3.5 w-3.5 fill-current"
                        }),
                        createTextVNode(" " + toDisplayString(product.ratingLabel), 1)
                      ])) : createCommentVNode("", true)
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
                  createVNode("div", { class: "mt-8 flex items-center justify-between border-t border-white/50 pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Starting from"),
                      createVNode("p", { class: "mt-1 text-xl font-extrabold text-flamingo-500" }, toDisplayString(product.priceLabel), 1),
                      createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, toDisplayString(product.deliveryLabel), 1)
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
      _push(`<!--]--><div class="overflow-hidden rounded-3xl border border-flamingo-500/20 bg-[var(--p-text)] text-white md:col-span-2 xl:col-span-1"><div class="relative h-full p-10"><div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div><div class="relative z-10 flex h-full flex-col justify-between"><div><span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80"> Custom Work </span><h3 class="mt-6 text-3xl font-bold tracking-tight text-white">Can&#39;t find what you&#39;re looking for?</h3><p class="mt-4 text-base leading-7 text-slate-300"> Request a custom quote for bespoke packaging, specialty finishing, unusual dimensions, or multi-part jobs. </p></div><div class="mt-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quotes/create",
        class: "inline-flex items-center gap-3 rounded-xl bg-flamingo-500 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Request Custom Quote `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Request Custom Quote "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div><section class="mt-20"><div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div class="max-w-2xl"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> Quote-Ready Shops </span><h3 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)]">Nearby quote opportunities from active shops</h3><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> This borrows the stronger quote-card structure from the stitch references, but uses live shop and product records. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "inline-flex items-center gap-2 self-start rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View shops `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View shops "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-8 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(quoteCards), (quote) => {
        _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0px_20px_40px_rgba(20,27,44,0.04)] transition-colors hover:bg-[var(--p-surface-sunken)]"><div class="mb-6 flex items-start justify-between gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-flamingo-500/12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: quote.icon,
          class: "h-6 w-6 text-flamingo-500"
        }, null, _parent));
        _push(`</div><div class="rounded-full bg-[var(--p-surface-sunken)] px-2.5 py-1 text-[12px] font-bold text-[var(--p-text)]">${ssrInterpolate(quote.badge)}</div></div><h4 class="text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(quote.shopName)}</h4><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(quote.productTitle)}</p>`);
        if (quote.ratingLabel) {
          _push(`<div class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-star",
            class: "h-4 w-4 fill-current"
          }, null, _parent));
          _push(` ${ssrInterpolate(quote.ratingLabel)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-5 space-y-3"><div class="flex items-center justify-between text-sm"><span class="text-[var(--p-text-muted)]">Estimated Price</span><span class="font-bold text-flamingo-500">${ssrInterpolate(quote.priceLabel)}</span></div><div class="flex items-center justify-between text-sm"><span class="text-[var(--p-text-muted)]">Delivery Time</span><span class="flex items-center gap-1 font-medium text-[var(--p-text)]">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-clock-3",
          class: "h-4 w-4 text-flamingo-500"
        }, null, _parent));
        _push(` ${ssrInterpolate(quote.deliveryLabel)}</span></div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: quote.to,
          class: "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Request Quote `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Request Quote "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><div class="overflow-hidden rounded-xl bg-[var(--p-text)] text-white lg:col-span-2"><div class="relative h-full"><div class="absolute right-0 top-0 h-full w-1/3 opacity-20"><div class="absolute inset-0 bg-gradient-to-l from-flamingo-500 to-transparent"></div></div><div class="relative z-10 flex h-full flex-col gap-8 p-10 md:flex-row md:items-center md:justify-between md:p-14"><div class="max-w-xl"><span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80"> Open Request </span><h3 class="mt-5 text-3xl font-bold tracking-tight text-white">Send one brief and let multiple shops respond</h3><p class="mt-4 text-base leading-7 text-slate-300"> Use a single request for jobs that are too custom for fixed pricing, then compare replies from available print shops. </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/quotes/create",
        class: "mt-8 inline-flex items-center gap-3 rounded-xl bg-flamingo-500 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Start Custom Request `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Start Custom Request "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden w-full max-w-[220px] grid-cols-2 gap-3 md:grid"><div class="aspect-square rounded-lg bg-white/8"></div><div class="aspect-square rounded-lg bg-white/12"></div><div class="aspect-square rounded-lg bg-white/12"></div><div class="aspect-square rounded-lg bg-white/8"></div></div></div></div></div></div></section></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomePopularProducts.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "HomePopularProducts" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HomePopularLocations",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = [
      {
        slug: "nairobi",
        name: "Nairobi",
        description: "The broadest mix of commercial print shops, express turnaround, and corporate-ready vendors.",
        badge: "High Volume",
        caption: "CBD, Westlands, Kilimani and more",
        icon: "i-lucide-building-2",
        tags: ["Corporate print", "Fast quotes"]
      },
      {
        slug: "westlands",
        name: "Westlands",
        description: "Ideal for agency work, polished marketing collateral, and premium small-batch printing.",
        badge: "Premium",
        caption: "Brand and campaign work",
        icon: "i-lucide-briefcase-business",
        tags: ["Branding", "Short runs"]
      },
      {
        slug: "kilimani",
        name: "Kilimani",
        description: "A strong option for studio print jobs, event materials, menus, and creative business assets.",
        badge: "Creative",
        caption: "Studios, menus, promo jobs",
        icon: "i-lucide-palette",
        tags: ["Menus", "Event print"]
      },
      {
        slug: "cbd",
        name: "CBD",
        description: "Best for walk-in convenience, urgent business stationery, and quick same-day production.",
        badge: "Express",
        caption: "Fast access and dense vendor coverage",
        icon: "i-lucide-map-pinned",
        tags: ["Same day", "Business cards"]
      },
      {
        slug: "industrial-area",
        name: "Industrial Area",
        description: "Built for volume, packaging, large format, and heavier commercial production requirements.",
        badge: "Production",
        caption: "Bulk and large-format capacity",
        icon: "i-lucide-factory",
        tags: ["Bulk print", "Large format"]
      },
      {
        slug: "mombasa",
        name: "Mombasa",
        description: "Coastal print capacity for hospitality, events, branding, and regional business operations.",
        badge: "Coastal",
        caption: "Tourism and hospitality demand",
        icon: "i-lucide-ship-wheel",
        tags: ["Hospitality", "Regional reach"]
      },
      {
        slug: "kisumu",
        name: "Kisumu",
        description: "Growing lakeside print market with strong demand for retail, corporate, and school-related jobs.",
        badge: "Regional",
        caption: "Retail and institutional work",
        icon: "i-lucide-land-plot",
        tags: ["Schools", "Retail print"]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-bg)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mx-auto max-w-2xl text-center"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]"> Popular Locations </span><h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl"> Browse active print hubs across Kenya&#39;s busiest business districts </h2><p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]"> Jump straight into the areas where print demand is strongest, compare nearby shops, and start from the location that fits your job best. </p></div><div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(locations, (loc) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: loc.slug,
          to: `/locations/${loc.slug}`,
          class: "group rounded-2xl bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--p-surface-container)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-6"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: loc.icon,
                class: "h-6 w-6 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`</div><span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(loc.badge)}</span></div><h3 class="mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.name)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(loc.description)}</p><div class="mt-5 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(loc.tags, (tag) => {
                _push2(`<span class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"${_scopeId}>${ssrInterpolate(tag)}</span>`);
              });
              _push2(`<!--]--></div><div class="mt-8 flex items-center justify-between border-t border-white/50 pt-4"${_scopeId}><div${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Explore Area</p><p class="mt-1 text-sm font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.caption)}</p></div><span class="flex h-11 w-11 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5"${_scopeId}>`);
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
                    createVNode("span", { class: "rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]" }, toDisplayString(loc.badge), 1)
                  ]),
                  createVNode("h3", { class: "mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]" }, toDisplayString(loc.name), 1),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(loc.description), 1),
                  createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(loc.tags, (tag) => {
                      return openBlock(), createBlock("span", {
                        key: tag,
                        class: "rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"
                      }, toDisplayString(tag), 1);
                    }), 128))
                  ]),
                  createVNode("div", { class: "mt-8 flex items-center justify-between border-t border-white/50 pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Explore Area"),
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
const __nuxt_component_3 = Object.assign(_sfc_main$3, { __name: "HomePopularLocations" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeWhyPrinty",
  __ssrInlineRender: true,
  setup(__props) {
    const features = [
      {
        title: "Instant print calculations",
        body: "See estimated prices as you configure—no waiting for quotes.",
        icon: "i-lucide-zap"
      },
      {
        title: "Nearby print shops",
        body: "Find and compare local printers by location.",
        icon: "i-lucide-store"
      },
      {
        title: "Clear pricing breakdown",
        body: "Material, print, finishing—all itemized so you know what you pay.",
        icon: "i-lucide-receipt"
      },
      {
        title: "Faster client response",
        body: "Shops get structured requests and can respond quickly.",
        icon: "i-lucide-clock"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 sm:py-24 bg-[var(--p-surface)] border-t border-[var(--p-border)]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center"> Why Printy </h2><p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto"> Built for print customers and shops in Kenya. </p><div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(features, (feature, i) => {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-6"><div class="flex h-10 w-10 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: feature.icon,
          class: "w-5 h-5"
        }, null, _parent));
        _push(`</div><h3 class="mt-4 font-semibold text-[var(--p-text)]">${ssrInterpolate(feature.title)}</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(feature.body)}</p></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/HomeWhyPrinty.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$2, { __name: "HomeWhyPrinty" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HomeShopOwnerCTA",
  __ssrInlineRender: true,
  props: {
    headline: { default: "" },
    body: { default: "" },
    primaryCtaTo: { default: "/auth/signup" },
    primaryCtaLabel: { default: "Create your shop" },
    secondaryCtaTo: { default: "/dashboard" },
    secondaryCtaLabel: { default: "View dashboard" }
  },
  setup(__props) {
    const highlights = [
      {
        title: "Quote inbox",
        body: "Review submitted requests, send revisions, and track accepted quotes from one workflow.",
        icon: "i-lucide-inbox"
      },
      {
        title: "Product and pricing control",
        body: "Keep catalog products, paper pricing, machines, and turnaround settings aligned.",
        icon: "i-lucide-package-search"
      },
      {
        title: "Production handoff",
        body: "Move accepted work into the next operational step without losing quote context.",
        icon: "i-lucide-clipboard-list"
      },
      {
        title: "Operational visibility",
        body: "See what is awaiting response, what was accepted, and what is ready for fulfillment.",
        icon: "i-lucide-chart-column"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-[var(--p-surface)] py-16 sm:py-24" }, _attrs))}><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div class="overflow-hidden rounded-3xl border border-flamingo-500/20 bg-[var(--p-text)] text-white"><div class="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14"><div class="absolute right-0 top-0 h-48 w-48 rounded-full bg-flamingo-500/16 blur-3xl"></div><div class="relative z-10"><span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500"> For Print Shops </span><h2 class="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl"> Manage requests, quotes, revisions, and production from one place </h2><p class="mt-4 max-w-2xl text-base leading-7 text-slate-300"> Set up your catalog, respond to incoming requests faster, track accepted quotes, and keep the team aligned on turnaround. </p><div class="mt-8 flex flex-col gap-4 sm:flex-row">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.primaryCtaTo,
        class: "group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
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
        class: "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.secondaryCtaLabel)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-layout-dashboard",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(__props.secondaryCtaLabel) + " ", 1),
              createVNode(_component_UIcon, {
                name: "i-lucide-layout-dashboard",
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
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "HomeShopOwnerCTA" });
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
      const _component_HomeHowItWorks = __nuxt_component_1;
      const _component_HomePopularProducts = __nuxt_component_2;
      const _component_HomePopularLocations = __nuxt_component_3;
      const _component_HomeWhyPrinty = __nuxt_component_4;
      const _component_HomeShopOwnerCTA = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_HomeHero, {
        headline: "Get print prices in seconds",
        subheadline: "Find nearby print shops in Kenya, compare offers clearly, and configure jobs like business cards, flyers, brochures, and banners without confusion.",
        "primary-cta-to": "/shops",
        "primary-cta-label": "Find a print shop",
        "secondary-cta-to": "/#demo",
        "secondary-cta-label": "Try live pricing"
      }, null, _parent));
      _push(ssrRenderComponent(_component_HomeHowItWorks, null, null, _parent));
      _push(ssrRenderComponent(_component_HomePopularProducts, null, null, _parent));
      _push(ssrRenderComponent(_component_HomePopularLocations, null, null, _parent));
      _push(ssrRenderComponent(_component_HomeWhyPrinty, null, null, _parent));
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
//# sourceMappingURL=index-CX1K-hFo.mjs.map
