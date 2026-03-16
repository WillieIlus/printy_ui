import { _ as _sfc_main$1 } from './SelectMenu-iYI0pXjV.mjs';
import { c as _sfc_main$9, a as _sfc_main$f, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-BGajth1Y.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-D2SuzRcB.mjs';
import { b as listMachinesBySlug } from './seller-COByQR0i.mjs';
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
import './api-error-D1IYk86E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "machines",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    const items = ref([]);
    const loading = ref(true);
    const selectedSlug = ref("");
    const shopOptions = computed(
      () => sellerStore.shops.map((s) => ({ value: s.slug, label: s.name }))
    );
    function goToShopMachines() {
      if (selectedSlug.value) {
        navigateTo(`/dashboard/shops/${selectedSlug.value}/machines`);
      }
    }
    async function load() {
      if (!selectedSlug.value) {
        loading.value = false;
        return;
      }
      loading.value = true;
      try {
        items.value = await listMachinesBySlug(selectedSlug.value);
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
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">Machines</h1><p class="text-sm text-[var(--p-text-muted)]">Manage printers and equipment across your shops.</p></div><div class="flex items-center gap-3">`);
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
        onClick: goToShopMachines
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add machine `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Add machine ")
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
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage machines.</p>`);
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
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Type</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (m) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(m.name)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(m.machine_type)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: m.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(m.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(m.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            to: `/dashboard/shops/${unref(selectedSlug)}/machines`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Manage`);
              } else {
                return [
                  createTextVNode("Manage")
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
          name: "i-lucide-printer",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No machines yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add your first printer or equipment.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: goToShopMachines
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add machine`);
            } else {
              return [
                createTextVNode("Add machine")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/machines.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=machines-CN6gCPRV.mjs.map
