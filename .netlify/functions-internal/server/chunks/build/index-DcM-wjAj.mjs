import { g as useRoute, i as useToast, _ as __nuxt_component_3$1, a as _sfc_main$f, d as _sfc_main$9, H as __nuxt_component_5 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$2 } from './EmptyState-D4DrOsbN.mjs';
import { _ as _sfc_main$1 } from './Badge-xP9ZTQag.mjs';
import { _ as _sfc_main$1$1, a as __nuxt_component_8 } from './GalleryProductDetailModal-CoXykatt.mjs';
import { _ as __nuxt_component_9, u as useProductPriceDisplay } from './ProductTweakModal-Cbxgoa2E.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, withModifiers, isRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { b as getShopCatalog } from './gallery-GtLUt84g.mjs';
import { u as useQuoteDraftStore } from './quoteDraft-CE4LeCAM.mjs';
import { u as useApi } from './useApi-4DUqRt-r.mjs';
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
import './Checkbox-Cm9Vi01u.mjs';
import './Textarea-CeohXmxE.mjs';
import './formatters-C39vX7Ji.mjs';
import './quoteDraft-BhhNn4oA.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const shopSlug = computed(() => String(route.params.shopSlug));
    const quoteDraftStore = useQuoteDraftStore();
    const toast = useToast();
    const { getMediaUrl } = useApi();
    const catalog = ref(null);
    const loading = ref(true);
    const fetchError = ref(null);
    const categoryFilter = ref("");
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    const detailsModalOpen = ref(false);
    const detailsProduct = ref(null);
    function productCategoryName(p) {
      const c = p.category;
      if (typeof c === "string") return c.trim();
      if (c && typeof c === "object" && "name" in c && typeof c.name === "string") {
        return c.name.trim();
      }
      return "";
    }
    const products = computed(() => {
      const list = catalog.value?.products ?? [];
      if (!categoryFilter.value) return list;
      return list.filter((p) => productCategoryName(p).toLowerCase() === categoryFilter.value.toLowerCase());
    });
    const categories = computed(() => {
      const cats = /* @__PURE__ */ new Set();
      for (const p of catalog.value?.products ?? []) {
        const name = productCategoryName(p);
        if (name) cats.add(name);
      }
      return Array.from(cats).sort();
    });
    async function fetchData() {
      if (!shopSlug.value) return;
      loading.value = true;
      fetchError.value = null;
      try {
        catalog.value = await getShopCatalog(shopSlug.value);
        if (!catalog.value) fetchError.value = "Failed to load catalog";
      } catch {
        catalog.value = null;
        fetchError.value = "Failed to load products";
      } finally {
        loading.value = false;
      }
    }
    function productImageUrl(product) {
      const path = product.primary_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
    }
    function openTweak(product, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      tweakProduct.value = product;
      nextTick(() => {
        tweakModalOpen.value = true;
      });
    }
    function onDetailsTweak() {
      if (detailsProduct.value) {
        tweakProduct.value = detailsProduct.value;
        tweakModalOpen.value = true;
      }
    }
    function onItemAdded() {
      toast.add({ title: "Added to draft", description: `${tweakProduct.value?.name ?? "Product"} added to your draft.` });
    }
    const { priceDisplay, priceDisplaySummary, priceDiagnostics } = useProductPriceDisplay();
    function priceDiagnosticsText(product) {
      const d = priceDiagnostics(product);
      if (!d) return "";
      const parts = [];
      if (d.reason) parts.push(d.reason);
      if (d.suggestions?.length) {
        parts.push(d.suggestions.map((s) => s.message).filter(Boolean).join(" "));
      }
      return parts.join(" ");
    }
    watch(shopSlug, () => {
      quoteDraftStore.setShop(shopSlug.value);
      fetchData();
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$2;
      const _component_NuxtImg = __nuxt_component_5;
      const _component_UBadge = _sfc_main$1;
      const _component_UTooltip = _sfc_main$1$1;
      const _component_GalleryProductDetailModal = __nuxt_component_8;
      const _component_QuotesProductTweakModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 sm:py-12" }, _attrs))}><div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-flamingo-600 dark:hover:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Back to gallery `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "h-4 w-4"
              }),
              createTextVNode(" Back to gallery ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(catalog)?.shop) {
        _push(`<div class="flex items-center gap-2"><span class="text-[var(--p-border)]">·</span><h1 class="text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(catalog).shop.name)}</h1></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(categories).length) {
        _push(`<div class="flex flex-wrap gap-2 mb-6">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: !unref(categoryFilter) ? "solid" : "outline",
          color: !unref(categoryFilter) ? "primary" : "neutral",
          size: "sm",
          class: "rounded-full",
          onClick: ($event) => categoryFilter.value = ""
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
          _push(ssrRenderComponent(_component_UButton, {
            key: cat,
            variant: unref(categoryFilter) === cat ? "solid" : "outline",
            color: unref(categoryFilter) === cat ? "primary" : "neutral",
            size: "sm",
            class: "rounded-full",
            onClick: ($event) => categoryFilter.value = cat
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat), 1)
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
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(fetchError) || !unref(catalog)?.shop) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: unref(fetchError) ? "Could not load products" : "Shop not found",
          description: unref(fetchError) ? "Something went wrong. Please try again." : "This shop does not exist or is inactive.",
          icon: "i-lucide-package"
        }, null, _parent));
      } else if (!unref(products).length) {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-package",
          class: "mx-auto h-16 w-16 text-[var(--p-border)]"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-lg font-medium text-[var(--p-text-dim)]">No products yet</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(categoryFilter) ? "No products in this category." : "This shop has not added any products.")}</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(`<article class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all cursor-pointer"><div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">`);
          if (productImageUrl(product)) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: productImageUrl(product),
              alt: product.name,
              class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            }, null, _parent));
          } else {
            _push(`<div class="absolute inset-0 flex items-center justify-center">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-package",
              class: "h-16 w-16 text-[var(--p-border)]"
            }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="p-5"><h3 class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors cursor-pointer">${ssrInterpolate(product.name)}</h3>`);
          if (productCategoryName(product)) {
            _push(`<p class="mt-0.5 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(productCategoryName(product))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-3 space-y-1.5">`);
          if (product.final_size) {
            _push(`<div class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-ruler",
              class: "h-3.5 w-3.5 shrink-0"
            }, null, _parent));
            _push(`<span>${ssrInterpolate(product.final_size)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (product.imposition_summary) {
            _push(`<div class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-grid-2x2",
              class: "h-3.5 w-3.5 shrink-0"
            }, null, _parent));
            _push(`<span>Fits on ${ssrInterpolate(product.imposition_summary)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (product.min_quantity) {
            _push(`<div class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-hash",
              class: "h-3.5 w-3.5 shrink-0"
            }, null, _parent));
            _push(`<span>Min ${ssrInterpolate(product.min_quantity)} pcs</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (product.finishing_summary?.length) {
            _push(`<div class="flex flex-wrap gap-1 mt-1"><!--[-->`);
            ssrRenderList(product.finishing_summary, (finish) => {
              _push(ssrRenderComponent(_component_UBadge, {
                key: finish,
                variant: "soft",
                color: "neutral",
                size: "xs"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(finish)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(finish), 1)
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
          _push(`</div><div class="mt-4 flex items-start justify-between gap-2"><div class="min-w-0 flex-1">`);
          if (unref(priceDisplaySummary)(product)) {
            _push(`<!--[--><div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400"> Total: ${ssrInterpolate(unref(priceDisplaySummary)(product).totalLine)}</div><div class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(priceDisplaySummary)(product).perUnitLine)}</div><!--]-->`);
          } else {
            _push(`<div class="flex items-center gap-1.5"><span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(unref(priceDisplay)(product))}</span>`);
            if (unref(priceDiagnostics)(product)) {
              _push(ssrRenderComponent(_component_UTooltip, {
                text: priceDiagnosticsText(product),
                popper: { placement: "top" }
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<button type="button" class="inline-flex text-[var(--p-text-muted)] hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors"${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-info",
                      class: "h-4 w-4"
                    }, null, _parent2, _scopeId));
                    _push2(`</button>`);
                  } else {
                    return [
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex text-[var(--p-text-muted)] hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-info",
                          class: "h-4 w-4"
                        })
                      ], 8, ["onClick"])
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</div>`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            variant: "soft",
            size: "sm",
            onClick: ($event) => openTweak(product, $event)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-sliders-horizontal",
                  class: "h-4 w-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Tweak `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "h-4 w-4 mr-1"
                  }),
                  createTextVNode(" Tweak ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_component_GalleryProductDetailModal, {
        modelValue: unref(detailsModalOpen),
        "onUpdate:modelValue": ($event) => isRef(detailsModalOpen) ? detailsModalOpen.value = $event : null,
        product: unref(detailsProduct),
        "product-image-url": unref(detailsProduct) ? productImageUrl(unref(detailsProduct)) : null,
        onTweak: onDetailsTweak
      }, null, _parent));
      if (unref(tweakProduct)) {
        _push(ssrRenderComponent(_component_QuotesProductTweakModal, {
          modelValue: unref(tweakModalOpen),
          "onUpdate:modelValue": ($event) => isRef(tweakModalOpen) ? tweakModalOpen.value = $event : null,
          product: unref(tweakProduct),
          "shop-slug": unref(shopSlug),
          "shop-name": unref(catalog)?.shop?.name,
          onAdded: onItemAdded
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery/[shopSlug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DcM-wjAj.mjs.map
