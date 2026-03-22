import { h as useToast, d as _sfc_main$9, l as __nuxt_component_5, a as _sfc_main$f, _ as __nuxt_component_3$1$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-InVpxbUI.mjs';
import { _ as _sfc_main$1 } from './Badge-DzyqaO77.mjs';
import { _ as _sfc_main$1$1, a as __nuxt_component_8 } from './GalleryProductDetailModal-Dzs5R61L.mjs';
import { _ as __nuxt_component_9, u as useProductPriceDisplay } from './ProductTweakModal-vQASSQYo.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, isRef, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useApi } from './useApi-FvTSG0mK.mjs';
import { u as usePrintySeo } from './usePrintySeo-wTwluGFY.mjs';
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
import './Checkbox-8D35u7U_.mjs';
import './Textarea-m5qrWcEy.mjs';
import './gallery-B-1C6f8x.mjs';
import './formatters-D5StX5za.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { getMediaUrl } = useApi();
    const toast = useToast();
    const products = ref([]);
    const loading = ref(true);
    const fetchError = ref(null);
    const categoryFilter = ref("");
    const tweakModalOpen = ref(false);
    const tweakProduct = ref(null);
    const tweakShopSlug = ref("");
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
    const filteredProducts = computed(() => {
      if (!categoryFilter.value) return products.value;
      return products.value.filter((p) => productCategoryName(p).toLowerCase() === categoryFilter.value.toLowerCase());
    });
    const categories = computed(() => {
      const cats = /* @__PURE__ */ new Set();
      for (const p of products.value) {
        const name = productCategoryName(p);
        if (name) cats.add(name);
      }
      return Array.from(cats).sort();
    });
    function productImageUrl(product) {
      const path = product.primary_image;
      if (!path) return null;
      if (path.startsWith("http")) return path;
      return getMediaUrl(path);
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
    function openTweak(product, event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (!product.shop?.slug) {
        toast.add({ title: "No shop", description: "This product is not linked to a shop.", color: "error" });
        return;
      }
      tweakProduct.value = product;
      tweakShopSlug.value = product.shop.slug;
      nextTick(() => {
        tweakModalOpen.value = true;
      });
    }
    function onDetailsTweak() {
      if (detailsProduct.value?.shop?.slug) {
        detailsModalOpen.value = false;
        tweakProduct.value = detailsProduct.value;
        tweakShopSlug.value = detailsProduct.value.shop.slug;
        nextTick(() => {
          tweakModalOpen.value = true;
        });
      }
    }
    function onItemAdded() {
      toast.add({ title: "Added to draft", description: `${tweakProduct.value?.name ?? "Product"} added to your draft.` });
    }
    usePrintySeo({
      title: "Product Gallery",
      description: "Browse products from print shops across Kenya. Click any product to customize and add to your quote.",
      path: "/gallery",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$1;
      const _component_NuxtImg = __nuxt_component_5;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$1;
      const _component_UTooltip = _sfc_main$1$1;
      const _component_NuxtLink = __nuxt_component_3$1$1;
      const _component_GalleryProductDetailModal = __nuxt_component_8;
      const _component_QuotesProductTweakModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 sm:py-12" }, _attrs))}><div class="mb-8"><h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl"> Product Gallery </h1><p class="mt-2 text-lg text-[var(--p-text-muted)]"> Browse products from print shops across Kenya. Click any product to customize and add to your quote. </p></div>`);
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
      } else if (unref(fetchError) || !unref(products).length) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: unref(fetchError) ? "Could not load products" : "No products available yet",
          description: unref(fetchError) ? "Something went wrong. Please try again later." : "Check back later for new products.",
          icon: "i-lucide-package"
        }, null, _parent));
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(unref(filteredProducts), (product) => {
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
          if (product.shop) {
            _push(`<div class="absolute top-3 left-3"><span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-surface)]/90 backdrop-blur-sm border border-[var(--p-border)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "h-3 w-3 text-flamingo-500"
            }, null, _parent));
            _push(`<span class="text-flamingo-500">${ssrInterpolate(product.shop.name)}</span></span></div>`);
          } else {
            _push(`<!---->`);
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
            variant: "solid",
            size: "sm",
            class: "group/tweak rounded-full bg-flamingo-500 text-white hover:bg-flamingo-400",
            onClick: ($event) => openTweak(product, $event)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-sliders-horizontal",
                  class: "mr-1 h-4 w-4 transition-transform duration-200 group-hover/tweak:rotate-12 group-hover/tweak:scale-110"
                }, null, _parent2, _scopeId));
                _push2(` Tweak `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-sliders-horizontal",
                    class: "mr-1 h-4 w-4 transition-transform duration-200 group-hover/tweak:rotate-12 group-hover/tweak:scale-110"
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
      if (!unref(loading) && unref(filteredProducts).length) {
        _push(`<div class="mt-10 overflow-hidden rounded-3xl border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.28)]"><div class="relative p-8 sm:p-10"><div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-flamingo-500/18 blur-3xl"></div><div class="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-mirage-500/18 blur-3xl"></div><div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div class="max-w-2xl"><span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-400"> Custom sourcing </span><h2 class="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl"> Can&#39;t find what you&#39;re looking for? </h2><p class="mt-4 text-base leading-7 text-slate-300"> Send a custom request to all top-rated vendors in the city and get competitive bids within minutes. </p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/quotes/create",
          class: "inline-flex items-center justify-center gap-2 rounded-2xl bg-flamingo-500 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Blast Custom request `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-send",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Blast Custom request "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-send",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
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
          "shop-slug": unref(tweakShopSlug),
          "shop-name": unref(tweakProduct)?.shop?.name,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gallery/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-mTfb4phN.mjs.map
