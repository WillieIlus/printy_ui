import { d as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$1 } from './ShopFavoriteToggle-Cbi9rEA3.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "favorites",
  __ssrInlineRender: true,
  setup(__props) {
    const favoritesStore = useFavoritesStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_ShopsShopFavoriteToggle = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"><h1 class="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--p-text)] sm:text-3xl"> Saved Shops </h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/shops",
        variant: "outline",
        color: "neutral"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Browse shops `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-store",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Browse shops ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(favoritesStore).loading && !unref(favoritesStore).loaded) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(favoritesStore).favorites.length) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(favoritesStore).favorites, (shop) => {
          _push(`<div class="flex items-center justify-between gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-sm transition-shadow hover:shadow-md"><div class="flex items-center gap-4 min-w-0"><div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--p-surface-container)]">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "h-6 w-6 text-amber-600 dark:text-amber-400"
          }, null, _parent));
          _push(`</div><div class="min-w-0"><h2 class="truncate font-semibold text-[var(--p-text)]">${ssrInterpolate(shop.name)}</h2><p class="text-sm text-[var(--p-text-muted)]">/${ssrInterpolate(shop.slug)}</p></div></div><div class="flex items-center gap-2 shrink-0">`);
          _push(ssrRenderComponent(_component_UButton, {
            to: `/shops/${shop.slug}`,
            color: "primary",
            size: "sm"
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
          _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
            "shop-id": shop.id,
            "shop-name": shop.name,
            "shop-slug": shop.slug
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-heart",
          class: "mx-auto h-16 w-16 text-amber-200 dark:text-amber-800"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-lg font-medium text-[var(--p-text)]">No saved shops yet</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">Browse shops and tap the heart to save your favorites.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          color: "primary",
          class: "mt-4"
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
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/me/favorites.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=favorites-mk6XTjBx.mjs.map
