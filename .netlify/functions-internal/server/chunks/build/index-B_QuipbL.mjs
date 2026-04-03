import { _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const products = [
      { slug: "business-cards", title: "Business cards", short: "Professional cards in standard or custom sizes.", icon: "i-lucide-credit-card" },
      { slug: "flyers", title: "Flyers", short: "Promotional handouts for events and marketing.", icon: "i-lucide-file-text" },
      { slug: "posters", title: "Posters", short: "Large format for events, retail, and promotions.", icon: "i-lucide-image" }
    ];
    usePrintySeo({
      title: "Printing Products",
      description: "Get instant printing quotes for business cards, flyers, posters, and more. Browse options and request quotes from trusted print shops.",
      path: "/products"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"><h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl"> Printing products </h1><p class="mt-4 text-lg text-[var(--p-text-muted)]"> Get instant quotes for popular print products. Choose your product to see options and pricing. </p><div class="mt-12 grid gap-6 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(products, (p) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: p.slug,
          to: `/products/${p.slug}`,
          class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: p.icon,
                class: "w-10 h-10 text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`<h2 class="mt-4 font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(p.title)}</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(p.short)}</p><span class="mt-4 inline-flex items-center text-sm font-medium text-flamingo-600 dark:text-flamingo-400"${_scopeId}> Learn more `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "ml-1 w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(`</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: p.icon,
                  class: "w-10 h-10 text-flamingo-500"
                }, null, 8, ["name"]),
                createVNode("h2", { class: "mt-4 font-semibold text-[var(--p-text)]" }, toDisplayString(p.title), 1),
                createVNode("p", { class: "mt-2 text-sm text-[var(--p-text-muted)]" }, toDisplayString(p.short), 1),
                createVNode("span", { class: "mt-4 inline-flex items-center text-sm font-medium text-flamingo-600 dark:text-flamingo-400" }, [
                  createTextVNode(" Learn more "),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "ml-1 w-4 h-4"
                  })
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="mt-12 flex flex-wrap gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "btn-primary inline-flex items-center rounded-xl px-6 py-3.5 text-sm font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Get a quote `);
          } else {
            return [
              createTextVNode(" Get a quote ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "inline-flex items-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse shops `);
          } else {
            return [
              createTextVNode(" Browse shops ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_QuipbL.mjs.map
