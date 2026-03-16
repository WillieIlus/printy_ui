import { u as useAuthStore, c as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_3$1 } from './ShopRatingSummary-DFYuWObK.mjs';
import { u as useFavoritesStore, _ as __nuxt_component_1 } from './ShopFavoriteToggle-COpzvXm4.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './Badge-BGajth1Y.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useFavoritesStore();
    const shops = ref([]);
    const loading = ref(true);
    const ratingSummaries = ref({});
    usePrintySeo({
      title: "Print Shops",
      description: "Discover print shops across Kenya. Browse products and get instant quotes for business cards, flyers, posters, and more.",
      path: "/shops",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Shops", path: "/shops" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_ShopsShopStatusBadge = __nuxt_component_2;
      const _component_ShopsShopRatingSummary = __nuxt_component_3$1;
      const _component_ShopsShopFavoriteToggle = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-amber-50/80 dark:bg-stone-950" }, _attrs))}><div class="border-b border-amber-200/60 dark:border-amber-900/40 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12"><div class="flex items-center justify-between gap-4"><div><h1 class="text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]"> Print Shops </h1><p class="mt-2 text-lg text-stone-600 dark:text-stone-400"> Discover print shops across Kenya. Browse products and get quotes. </p></div>`);
      if (unref(authStore).isAuthenticated) {
        _push(ssrRenderComponent(_component_UButton, {
          to: "/me/favorites",
          variant: "outline",
          color: "neutral",
          size: "sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-heart",
                class: "mr-2 h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` Saved Shops `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-heart",
                  class: "mr-2 h-4 w-4"
                }),
                createTextVNode(" Saved Shops ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(shops).length) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(shops), (shop) => {
          _push(`<div class="group rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm hover:shadow-lg hover:border-amber-400/60 dark:hover:border-amber-600/50 transition-all overflow-hidden"><div class="p-6"><div class="flex items-start justify-between gap-2"><div class="flex items-center gap-3 min-w-0"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-6 w-6 text-amber-600 dark:text-amber-400"
          }, null, _parent));
          _push(`</div><div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><h2 class="text-lg font-semibold text-stone-800 dark:text-stone-100 truncate">${ssrInterpolate(shop.name)}</h2>`);
          if (shop.status) {
            _push(ssrRenderComponent(_component_ShopsShopStatusBadge, {
              status: shop.status
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          _push(ssrRenderComponent(_component_ShopsShopRatingSummary, {
            summary: unref(ratingSummaries)[shop.slug] ?? null
          }, null, _parent));
          _push(`</div></div>`);
          _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
            "shop-id": shop.id,
            "shop-name": shop.name,
            "shop-slug": shop.slug
          }, null, _parent));
          _push(`</div>`);
          _push(ssrRenderComponent(_component_UButton, {
            to: `/shops/${shop.slug}`,
            color: "primary",
            variant: "solid",
            class: "mt-4 w-full",
            block: ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Open Shop `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "ml-2 h-4 w-4"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(" Open Shop "),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "ml-2 h-4 w-4"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "mx-auto h-16 w-16 text-amber-200 dark:text-amber-800"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No shops yet</h3><p class="mt-2 text-sm text-stone-500 dark:text-stone-400">Check back soon for print shops near you.</p></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DPFt0qwS.mjs.map
