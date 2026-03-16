import { _ as _sfc_main$1 } from './SelectMenu-iYI0pXjV.mjs';
import { c as _sfc_main$9, a as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { defineComponent, ref, computed, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-D2SuzRcB.mjs';
import 'reka-ui';
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
import '@vueuse/core';
import './Input-CScRok4n.mjs';
import 'pinia';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-COByQR0i.mjs';
import './api-error-D1IYk86E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pricing",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    const loading = ref(true);
    const selectedSlug = ref("");
    const shopOptions = computed(
      () => sellerStore.shops.map((s) => ({ value: s.slug, label: s.name }))
    );
    const selectedShop = computed(
      () => sellerStore.shops.find((s) => s.slug === selectedSlug.value)
    );
    function goToShopPricing() {
      if (selectedSlug.value) {
        navigateTo(`/dashboard/shops/${selectedSlug.value}/pricing`);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">Pricing</h1><p class="text-sm text-[var(--p-text-muted)]">Manage printing rates, paper prices, and finishing rates per shop.</p></div><div class="flex items-center gap-3">`);
      if (unref(sellerStore).shops.length > 1) {
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(selectedSlug),
          "onUpdate:modelValue": ($event) => isRef(selectedSlug) ? selectedSlug.value = $event : null,
          items: unref(shopOptions),
          "value-key": "value",
          class: "w-48"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        disabled: !unref(selectedSlug),
        onClick: goToShopPricing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-banknote",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add pricing `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-banknote",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Add pricing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (!unref(sellerStore).shops.length && !unref(sellerStore).loading) {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to set up pricing.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          to: "/dashboard/shops/create"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Create shop`);
            } else {
              return [
                createTextVNode("Create shop")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(selectedSlug)) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><div class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h2 class="text-lg font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(selectedShop)?.name ?? unref(selectedSlug))}</h2><p class="text-sm text-[var(--p-text-muted)]">Configure printing, paper, and finishing rates for this shop.</p></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          onClick: goToShopPricing
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-banknote",
                class: "w-4 h-4 mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Manage pricing `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-banknote",
                  class: "w-4 h-4 mr-2"
                }),
                createTextVNode(" Manage pricing ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-banknote",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No pricing configured</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Select a shop and add printing rates, paper prices, and finishing.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          to: "/dashboard/shops"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Select shop`);
            } else {
              return [
                createTextVNode("Select shop")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/pricing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pricing-D-l0HNVc.mjs.map
