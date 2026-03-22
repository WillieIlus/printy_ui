import { _ as _sfc_main$1 } from './SelectMenu-DTjoEp_W.mjs';
import { h as useToast, j as useApi, e as _sfc_main$9, a as _sfc_main$f, A as API, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-CHxS7t2J.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
import { u as useSetupStatus } from './useSetupStatus-DT7QXIaC.mjs';
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
import './Input-DA2ySSK8.mjs';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "products",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    const { status: setupStatus, refresh: refreshSetup } = useSetupStatus();
    const toast = useToast();
    const rawApi = useApi();
    const items = ref([]);
    const loading = ref(true);
    const publishingId = ref(null);
    const selectedSlug = ref("");
    const shopOptions = computed(
      () => sellerStore.shops.map((s) => ({ value: s.slug, label: s.name }))
    );
    function statusColor(status) {
      if (status === "PUBLISHED") return "success";
      if (status === "UNAVAILABLE") return "error";
      return "neutral";
    }
    function goToAddProduct() {
      if (selectedSlug.value) {
        navigateTo(`/dashboard/shops/${selectedSlug.value}/setup`);
      }
    }
    async function publishProduct(product) {
      publishingId.value = product.id;
      try {
        await rawApi(API.shopProductDetail(selectedSlug.value, product.id), {
          method: "PATCH",
          body: { status: "PUBLISHED" }
        });
        toast.add({ title: "Published", description: `${product.name} is now visible to buyers.`, color: "success" });
        await load();
        await refreshSetup();
      } catch (err) {
        toast.add({ title: "Cannot publish", description: err instanceof Error ? err.message : "Failed to publish", color: "error" });
      } finally {
        publishingId.value = null;
      }
    }
    async function load() {
      if (!selectedSlug.value) {
        loading.value = false;
        return;
      }
      loading.value = true;
      try {
        const data = await rawApi(API.shopProducts(selectedSlug.value));
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
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">Products</h1><p class="text-sm text-[var(--p-text-muted)]">Manage your product catalog. Publish products when pricing is ready.</p></div><div class="flex items-center gap-3">`);
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
        onClick: goToAddProduct
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add product `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Add product ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(setupStatus) && !unref(setupStatus).has_pricing && unref(sellerStore).shops.length) {
        _push(`<div class="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-alert-triangle",
          class: "h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
        }, null, _parent));
        _push(`<div class="min-w-0"><p class="text-sm font-medium text-amber-800 dark:text-amber-200">Pricing not set up</p><p class="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Products will be saved as Draft until you add pricing. Buyers won&#39;t see Draft products.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          variant: "soft",
          size: "xs",
          class: "mt-2",
          to: "/dashboard/pricing"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Go to Pricing `);
            } else {
              return [
                createTextVNode(" Go to Pricing ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(sellerStore).shops.length && !unref(sellerStore).loading) {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to manage products.</p>`);
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
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Mode</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (p) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3"><div class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(p.name)}</div>`);
          if (p.category) {
            _push(`<div class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(p.category)}</div>`);
          } else {
            _push(`<!---->`);
          }
          if (p.publish_block_reason) {
            _push(`<div class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">${ssrInterpolate(p.publish_block_reason)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.pricing_mode)}</td><td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.min_quantity ?? 100)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: statusColor(p.status),
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.status ?? "DRAFT")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.status ?? "DRAFT"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right space-x-1">`);
          if (p.status !== "PUBLISHED" && p.can_publish) {
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "xs",
              color: "success",
              loading: unref(publishingId) === p.id,
              onClick: ($event) => publishProduct(p)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Publish `);
                } else {
                  return [
                    createTextVNode(" Publish ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else if (p.status !== "PUBLISHED" && !p.can_publish) {
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "xs",
              color: "neutral",
              disabled: "",
              title: "Add pricing to publish products"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Publish `);
                } else {
                  return [
                    createTextVNode(" Publish ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            to: `/dashboard/shops/${unref(selectedSlug)}/setup`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
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
          name: "i-lucide-package",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No products yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add products to your catalog for buyers to quote.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: goToAddProduct
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add product`);
            } else {
              return [
                createTextVNode("Add product")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/products.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=products-CbjF1UCq.mjs.map
