import { _ as _sfc_main$1 } from './SelectMenu-DnLMxdXN.mjs';
import { d as _sfc_main$9, a as _sfc_main$f, j as useApi, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-DzyqaO77.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
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
import './Input-D98neQoC.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "finishing",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    const items = ref([]);
    const categories = ref([]);
    const loading = ref(true);
    const selectedSlug = ref("");
    const selectedCategory = ref("");
    const shopOptions = computed(
      () => sellerStore.shops.map((s) => ({ value: s.slug, label: s.name }))
    );
    const filteredItems = computed(() => {
      if (!selectedCategory.value) return items.value;
      return items.value.filter((f) => f.category_detail?.slug === selectedCategory.value);
    });
    function goToShopSetup() {
      if (selectedSlug.value) {
        navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`);
      }
    }
    async function load() {
      if (!selectedSlug.value) {
        loading.value = false;
        return;
      }
      loading.value = true;
      const api = useApi();
      try {
        const data = await api(
          `shops/${selectedSlug.value}/finishing-rates/`
        );
        items.value = Array.isArray(data) ? data : data.results ?? [];
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch(selectedSlug, () => load());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">Finishing</h1><p class="text-sm text-[var(--p-text-muted)]">Manage finishing rates (lamination, binding, folding, etc.).</p></div><div class="flex items-center gap-3">`);
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
        onClick: goToShopSetup
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add finishing `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Add finishing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(categories).length) {
        _push(`<div class="flex items-center gap-2 flex-wrap">`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: !unref(selectedCategory) ? "primary" : "neutral",
          variant: "soft",
          class: "cursor-pointer",
          onClick: ($event) => selectedCategory.value = ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` All `);
            } else {
              return [
                createTextVNode(" All ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(ssrRenderComponent(_component_UBadge, {
            key: cat.slug,
            color: unref(selectedCategory) === cat.slug ? "primary" : "neutral",
            variant: "soft",
            class: "cursor-pointer",
            onClick: ($event) => selectedCategory.value = cat.slug
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(sellerStore).shops.length && !unref(sellerStore).loading) {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage finishing rates.</p>`);
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
      } else if (unref(filteredItems).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Category</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Charge unit</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Price</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(filteredItems), (f) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(f.name)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(f.category_detail?.name ?? "—")}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(f.charge_unit)}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">${ssrInterpolate(f.price)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: f.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(f.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(f.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-scissors",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No finishing rates yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add finishing services like lamination, binding, or folding.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: goToShopSetup
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add finishing`);
            } else {
              return [
                createTextVNode("Add finishing")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/finishing.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=finishing-B1B809Xk.mjs.map
