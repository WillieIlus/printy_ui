import { d as _sfc_main$9, a as _sfc_main$f, k as _sfc_main$c, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$5 } from './Badge-DzyqaO77.mjs';
import { _ as __nuxt_component_6 } from './RichTextDisplay-BjJZ3jTm.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$4 } from './Card-rEZVds4M.mjs';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ShopCard",
  __ssrInlineRender: true,
  props: {
    shop: {},
    showActions: { type: Boolean }
  },
  emits: ["view", "edit"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UAvatar = _sfc_main$c;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$5;
      const _component_EditorRichTextDisplay = __nuxt_component_6;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group overflow-hidden rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface)] shadow-sm transition-all hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-lg" }, _attrs))}><div class="relative bg-gradient-to-r from-flamingo-500 to-flamingo-700 px-6 py-5"><div class="flex items-start justify-between"><div class="flex items-center gap-3"><div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/20 backdrop-blur-sm">`);
      if (__props.shop.logo) {
        _push(ssrRenderComponent(_component_UAvatar, {
          src: __props.shop.logo,
          alt: __props.shop.name,
          size: "xl",
          class: "h-full w-full rounded-xl"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-building-2",
          class: "h-6 w-6 text-white"
        }, null, _parent));
      }
      _push(`</div><div class="min-w-0"><div class="flex items-center gap-2"><h3 class="truncate text-lg font-bold text-white">${ssrInterpolate(__props.shop.name)}</h3>`);
      if (__props.shop.is_verified) {
        _push(ssrRenderComponent(_component_UBadge, {
          color: "success",
          variant: "soft",
          size: "xs",
          class: "shrink-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-check",
                class: "h-3 w-3"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-check",
                  class: "h-3 w-3"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-sm text-white/80">${ssrInterpolate(__props.shop.city)}, ${ssrInterpolate(__props.shop.state)}</p></div></div>`);
      if (__props.shop.is_active !== false) {
        _push(`<span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-400/20 px-2.5 py-1 text-xs font-semibold text-green-100"><span class="h-1.5 w-1.5 rounded-full bg-green-300"></span> Active </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="px-6 py-5">`);
      if (__props.shop.description) {
        _push(`<div class="mb-4 line-clamp-2 text-sm text-[var(--p-text-muted)]">`);
        _push(ssrRenderComponent(_component_EditorRichTextDisplay, {
          html: __props.shop.description
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="mb-4"></div>`);
      }
      _push(`<div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">`);
      if (__props.shop.phone_number) {
        _push(`<div class="flex items-center gap-1">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-phone",
          class: "h-4 w-4 shrink-0"
        }, null, _parent));
        _push(` ${ssrInterpolate(__props.shop.phone_number)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.shop.business_email) {
        _push(`<div class="flex items-center gap-1 truncate">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-mail",
          class: "h-4 w-4 shrink-0"
        }, null, _parent));
        _push(` ${ssrInterpolate(__props.shop.business_email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.showActions) {
        _push(`<div class="mt-4 flex gap-2 border-t border-[var(--p-border-dim)] pt-4">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          size: "sm",
          class: "rounded-xl",
          onClick: ($event) => _ctx.$emit("view")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View `);
            } else {
              return [
                createTextVNode(" View ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          variant: "outline",
          size: "sm",
          class: "rounded-xl",
          onClick: ($event) => _ctx.$emit("edit")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Edit `);
            } else {
              return [
                createTextVNode(" Edit ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!__props.showActions) {
        _push(`<div class="flex border-t border-[var(--p-border-dim)]">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/shops/${__props.shop.slug}`,
          class: "flex flex-1 items-center justify-center gap-2 bg-flamingo-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View Details `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-4 w-4 transition-transform group-hover:translate-x-0.5"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" View Details "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4 transition-transform group-hover:translate-x-0.5"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="w-px bg-[var(--p-border-dim)]"></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/shops/${__props.shop.slug}/request-quote`,
          class: "flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` Request Quote `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "h-4 w-4"
                }),
                createTextVNode(" Request Quote ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "ShopsShopCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ShopList",
  __ssrInlineRender: true,
  props: {
    shops: {},
    showActions: { type: Boolean }
  },
  emits: ["view", "edit"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ShopsShopCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.shops, (shop) => {
        _push(ssrRenderComponent(_component_ShopsShopCard, {
          key: shop.id,
          shop,
          "show-actions": __props.showActions,
          onView: ($event) => _ctx.$emit("view", shop),
          onEdit: ($event) => _ctx.$emit("edit", shop)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1$1 = Object.assign(_sfc_main$2, { __name: "ShopsShopList" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NearbyShops",
  __ssrInlineRender: true,
  props: {
    shops: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_ShopsShopList = __nuxt_component_1$1;
      const _component_UCard = _sfc_main$4;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><h2 class="text-xl font-semibold text-gray-900 dark:text-white">Shops nearby</h2>`);
      if (__props.loading) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (__props.shops?.length) {
        _push(ssrRenderComponent(_component_ShopsShopList, { shops: __props.shops }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_UCard, { class: "text-center py-8" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-map-pin",
                class: "w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>No nearby shops or location not set.</p>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-map-pin",
                  class: "w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                }),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, "No nearby shops or location not set.")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/NearbyShops.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "ShopsNearbyShops" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "nearby",
  __ssrInlineRender: true,
  setup(__props) {
    const shopStore = useShopStore();
    const locationError = ref(null);
    function requestLocation() {
      locationError.value = null;
      {
        locationError.value = "Geolocation is not supported by your browser.";
        return;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_ShopsNearbyShops = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Shops nearby</h1><p class="text-gray-600 dark:text-gray-400">Find print shops near you. We&#39;ll use your location when you allow it.</p></div>`);
      if (unref(locationError)) {
        _push(`<div class="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">${ssrInterpolate(unref(locationError))} `);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "sm",
          class: "mt-2",
          onClick: requestLocation
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Try again`);
            } else {
              return [
                createTextVNode("Try again")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ShopsNearbyShops, {
        shops: unref(shopStore).nearbyShops,
        loading: unref(shopStore).loading
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/shops/nearby.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nearby-ksNqEj32.mjs.map
