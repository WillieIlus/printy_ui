import { _ as __nuxt_component_3$1, a as _sfc_main$f, b as __nuxt_component_2$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { u as usePrintySeo } from './usePrintySeo-Dsj3z4wM.mjs';
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_ClientOnly = __nuxt_component_2$1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "top",
        class: "relative overflow-hidden bg-[#101828] py-16 sm:py-24 w-screen max-w-none left-1/2 -translate-x-1/2"
      }, _attrs))}><div class="absolute inset-0 opacity-20"><div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div><div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div><div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div></div><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start"><div class="max-w-xl"><h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">${ssrInterpolate(__props.headline)}</h1><p class="mt-5 text-lg text-gray-300 leading-relaxed">${ssrInterpolate(__props.subheadline)}</p><div class="mt-8 flex flex-col sm:flex-row gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.primaryCtaTo,
        class: "btn-primary inline-flex items-center justify-center rounded-xl bg-white/95 px-6 py-3.5 text-sm font-bold text-[#101828] hover:bg-white transition-colors shadow-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.primaryCtaLabel)} `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "ml-2 w-4 h-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(toDisplayString(__props.primaryCtaLabel) + " ", 1),
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
        to: __props.secondaryCtaTo,
        class: "inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.secondaryCtaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.secondaryCtaLabel), 1)
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
        title: "Choose location & product",
        body: "Pick your area and what you need—business cards, flyers, brochures, or more.",
        icon: "i-lucide-map-pin"
      },
      {
        number: 2,
        title: "Compare options & pricing",
        body: "See instant estimates from nearby shops. Tweak quantity, paper, finishing.",
        icon: "i-lucide-scale"
      },
      {
        number: 3,
        title: "Request quote or continue",
        body: "Submit your request. Shops respond with final pricing and delivery.",
        icon: "i-lucide-send"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "how-it-works",
        class: "py-16 sm:py-24 bg-[var(--p-bg)] scroll-mt-20"
      }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center"> How it works </h2><p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto"> Three steps to get your print job quoted. </p><div class="mt-12 grid gap-8 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(steps, (step, i) => {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-center"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: step.icon,
          class: "w-6 h-6"
        }, null, _parent));
        _push(`</div><h3 class="mt-4 font-semibold text-[var(--p-text)]">${ssrInterpolate(step.number)}. ${ssrInterpolate(step.title)}</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(step.body)}</p></div>`);
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
  setup(__props) {
    const products = [
      { slug: "business-cards", title: "Business cards", short: "Standard & premium", icon: "i-lucide-credit-card", to: "/products/business-cards" },
      { slug: "flyers", title: "Flyers", short: "A4, A5, promotional", icon: "i-lucide-file-text", to: "/products/flyers" },
      { slug: "brochures", title: "Brochures", short: "Tri-fold, bi-fold", icon: "i-lucide-book-open", to: "/products/brochures" },
      { slug: "stickers", title: "Stickers", short: "Vinyl, paper, custom", icon: "i-lucide-sticker", to: "/products/stickers" },
      { slug: "banners", title: "Banners", short: "Roll-up, outdoor", icon: "i-lucide-panel-top", to: "/products/banners" },
      { slug: "receipt-books", title: "Receipt books", short: "Carbon, duplicate", icon: "i-lucide-receipt", to: "/products/receipt-books" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 sm:py-24 bg-[var(--p-surface)] border-t border-[var(--p-border)]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center"> Popular products </h2><p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto"> Get instant quotes for the most requested print jobs in Kenya. </p><div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
      ssrRenderList(products, (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.slug,
          to: p.to,
          class: "group flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-5 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: p.icon,
                class: "w-6 h-6"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400"${_scopeId}>${ssrInterpolate(p.title)}</h3><p class="text-sm text-[var(--p-text-muted)] truncate"${_scopeId}>${ssrInterpolate(p.short)}</p></div>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "w-5 h-5 text-[var(--p-text-muted)] group-hover:text-flamingo-500 shrink-0"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400" }, [
                  createVNode(_component_UIcon, {
                    name: p.icon,
                    class: "w-6 h-6"
                  }, null, 8, ["name"])
                ]),
                createVNode("div", { class: "min-w-0 flex-1" }, [
                  createVNode("h3", { class: "font-semibold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400" }, toDisplayString(p.title), 1),
                  createVNode("p", { class: "text-sm text-[var(--p-text-muted)] truncate" }, toDisplayString(p.short), 1)
                ]),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "w-5 h-5 text-[var(--p-text-muted)] group-hover:text-flamingo-500 shrink-0"
                })
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
const __nuxt_component_2 = Object.assign(_sfc_main$4, { __name: "HomePopularProducts" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HomePopularLocations",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = [
      { slug: "nairobi", name: "Nairobi" },
      { slug: "westlands", name: "Westlands" },
      { slug: "kilimani", name: "Kilimani" },
      { slug: "cbd", name: "CBD" },
      { slug: "industrial-area", name: "Industrial Area" },
      { slug: "mombasa", name: "Mombasa" },
      { slug: "kisumu", name: "Kisumu" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 sm:py-24 bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center"> Popular locations </h2><p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto"> Find print shops near you across Kenya. </p><div class="mt-10 flex flex-wrap justify-center gap-3"><!--[-->`);
      ssrRenderList(locations, (loc) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: loc.slug,
          to: `/locations/${loc.slug}`,
          class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-3 text-sm font-medium text-[var(--p-text)] transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-map-pin",
                class: "w-4 h-4 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(loc.name)}`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-map-pin",
                  class: "w-4 h-4 text-flamingo-500"
                }),
                createTextVNode(" " + toDisplayString(loc.name), 1)
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
    headline: { default: "Run a print shop?" },
    body: { default: "Join Printy to get more quote requests and respond faster. Set your pricing once—generate accurate quotes every time." },
    primaryCtaTo: { default: "/auth/signup" },
    primaryCtaLabel: { default: "Create your shop" },
    secondaryCtaTo: { default: "/help" },
    secondaryCtaLabel: { default: "Learn how it works" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 sm:py-24 bg-[#101828] text-white" }, _attrs))}><div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">${ssrInterpolate(__props.headline)}</h2><p class="mt-4 text-lg text-gray-300">${ssrInterpolate(__props.body)}</p><div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.primaryCtaTo,
        class: "btn-primary inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#101828] hover:bg-gray-100 transition-colors shadow-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.primaryCtaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.primaryCtaLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.secondaryCtaTo,
        class: "inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.secondaryCtaLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.secondaryCtaLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
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
      _push(ssrRenderComponent(_component_HomeHero, null, null, _parent));
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
//# sourceMappingURL=index-DtnNx_et.mjs.map
