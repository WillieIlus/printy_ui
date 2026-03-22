import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-InVpxbUI.mjs';
import { g as useRoute, _ as __nuxt_component_3$1$1, a as _sfc_main$f, e as useRuntimeConfig } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { f as fetchSEOProductDetail } from './seo-DOewQL-1.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const categoryFromApi = ref(null);
    const loading = ref(true);
    watch(slug, async (newSlug) => {
      if (newSlug) {
        loading.value = true;
        try {
          categoryFromApi.value = await fetchSEOProductDetail(newSlug);
        } catch {
          categoryFromApi.value = null;
        } finally {
          loading.value = false;
        }
      }
    });
    const products = {
      "business-cards": {
        title: "Business cards",
        description: "Professional business cards in standard and custom sizes. Choose paper stock, finish, and quantity for instant quotes.",
        options: [
          { title: "Size", detail: "Standard 85×55mm or custom. Single or double-sided.", icon: "i-lucide-ruler" },
          { title: "Paper", detail: "Matt, silk, or gloss. 300–400gsm for durability.", icon: "i-lucide-file-text" },
          { title: "Finishing", detail: "Round corners, spot UV, embossing available.", icon: "i-lucide-sparkles" },
          { title: "Quantity", detail: "From 100 to 10,000+. Better rates at higher volumes.", icon: "i-lucide-package" }
        ]
      },
      flyers: {
        title: "Flyers",
        description: "Promotional flyers and handouts. A5, A6, DL, or custom sizes. Perfect for events and marketing.",
        options: [
          { title: "Size", detail: "A5, A6, DL, or custom. Single or double-sided.", icon: "i-lucide-ruler" },
          { title: "Paper", detail: "90–350gsm. Matt or gloss finish.", icon: "i-lucide-file-text" },
          { title: "Finishing", detail: "Folding, perforation, or cut-to-size.", icon: "i-lucide-scissors" },
          { title: "Quantity", detail: "From 100 to 50,000+. Volume discounts apply.", icon: "i-lucide-package" }
        ]
      },
      posters: {
        title: "Posters",
        description: "Large format posters for events, retail, and promotions. High-quality digital or large-format printing.",
        options: [
          { title: "Size", detail: "A3, A2, A1, or custom. Up to 1.2m wide.", icon: "i-lucide-ruler" },
          { title: "Material", detail: "Paper, photo paper, or vinyl. Indoor or outdoor.", icon: "i-lucide-layers" },
          { title: "Finishing", detail: "Lamination, mounting, or framing.", icon: "i-lucide-frame" },
          { title: "Quantity", detail: "Single prints or bulk. Per-sqm pricing.", icon: "i-lucide-package" }
        ]
      }
    };
    const product = computed(() => {
      if (categoryFromApi.value) {
        return {
          title: categoryFromApi.value.name,
          description: categoryFromApi.value.description || products[slug.value]?.description || `Browse ${categoryFromApi.value.name} from print shops.`,
          options: products[slug.value]?.options ?? []
        };
      }
      return products[slug.value];
    });
    const notFound = computed(() => !loading.value && !product.value);
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl || "https://printy.ke";
    usePrintySeo(() => ({
      title: product.value?.title ?? categoryFromApi.value?.name ?? "Product",
      description: product.value?.description ?? categoryFromApi.value?.description ?? "Print products",
      path: `/products/${slug.value}`,
      noIndex: notFound.value,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" },
        { name: product.value?.title ?? categoryFromApi.value?.name ?? slug.value, path: `/products/${slug.value}` }
      ],
      schema: !notFound.value ? [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: product.value?.title ?? categoryFromApi.value?.name ?? slug.value,
          description: product.value?.description ?? categoryFromApi.value?.description ?? "Printing service",
          url: `${siteUrl}/products/${slug.value}`,
          provider: {
            "@type": "Organization",
            name: "Printy",
            url: siteUrl
          }
        }
      ] : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$1;
      const _component_NuxtLink = __nuxt_component_3$1$1;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><article class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(notFound)) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: "Product not found",
          description: "This product category does not exist.",
          icon: "i-lucide-package"
        }, null, _parent));
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/gallery",
          class: "inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] mb-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` All products `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-arrow-left",
                  class: "w-4 h-4"
                }),
                createTextVNode(" All products ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">${ssrInterpolate(unref(product)?.title)}</h1><p class="mt-4 text-lg text-[var(--p-text-muted)]">${ssrInterpolate(unref(product)?.description)}</p>`);
        if (unref(product)?.options?.length) {
          _push(`<div class="mt-12"><h2 class="text-xl font-semibold text-[var(--p-text)]">Options</h2><ul class="mt-4 space-y-3"><!--[-->`);
          ssrRenderList(unref(product).options, (opt) => {
            _push(`<li class="flex items-start gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: opt.icon,
              class: "w-5 h-5 text-flamingo-500 shrink-0 mt-0.5"
            }, null, _parent));
            _push(`<div><p class="font-medium text-[var(--p-text)]">${ssrInterpolate(opt.title)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(opt.detail)}</p></div></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-12 flex flex-wrap gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/gallery",
          class: "btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Get a quote `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "ml-2 w-4 h-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Get a quote "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "ml-2 w-4 h-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shops",
          class: "inline-flex items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
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
        _push(`</div><!--]-->`);
      }
      _push(`</article></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BuJCtaUR.mjs.map
