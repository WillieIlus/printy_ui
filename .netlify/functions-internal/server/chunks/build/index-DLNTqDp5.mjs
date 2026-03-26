import { c as useAuthStore, g as useAnalyticsTracking, a as _sfc_main$f, d as _sfc_main$9, _ as __nuxt_component_3$1$1, s as safeLogError } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_4 } from './ShopStatusBadge-DBjFhl47.mjs';
import { u as useFavoritesStore, _ as __nuxt_component_3$1 } from './ShopFavoriteToggle-Cbi9rEA3.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { g as getAllProducts } from './gallery-BkPMGgTl.mjs';
import { l as listShops } from './public-DzjHCo_M.mjs';
import { g as getRatingSummary } from './ratings-CW7X2UfE.mjs';
import { u as useApi } from './useApi-4DUqRt-r.mjs';
import { u as usePrintySeo } from './usePrintySeo-e9OTkeHK.mjs';
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
import './Badge-DRRvJchD.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const favoritesStore = useFavoritesStore();
    const { trackSearch } = useAnalyticsTracking();
    const { getMediaUrl } = useApi();
    const shops = ref([]);
    const products = ref([]);
    const loading = ref(true);
    const fetchError = ref(null);
    const ratingSummaries = ref({});
    const searchQuery = ref("");
    const activeFilter = ref("all");
    const lastTrackedSearch = ref("");
    let searchTrackTimer = null;
    const filterChips = [
      { value: "all", label: "All Shops" },
      { value: "sheet", label: "Digital Print" },
      { value: "large-format", label: "Large Format" },
      { value: "business-cards", label: "Business Cards" },
      { value: "brochure", label: "Brochures" },
      { value: "sticker", label: "Stickers & Labels" }
    ];
    const productsByShop = computed(() => {
      return products.value.reduce((acc, product) => {
        const slug = product.shop?.slug;
        if (!slug) return acc;
        acc[slug] ||= [];
        acc[slug].push(product);
        return acc;
      }, {});
    });
    const shopCards = computed(() => {
      return shops.value.map((shop) => {
        const shopProducts = productsByShop.value[shop.slug] ?? [];
        const tags = buildTags(shopProducts);
        return {
          ...shop,
          imageUrl: shopImageUrl(shopProducts),
          tags,
          searchText: [
            shop.name,
            shop.slug,
            shop.description ?? "",
            ...shopProducts.map((product) => `${product.name} ${productCategory(product)} ${product.pricing_mode}`),
            ...tags
          ].join(" ").toLowerCase(),
          primaryBadge: primaryBadge(shopProducts),
          secondaryLine: secondaryLine(shopProducts),
          descriptionText: shop.description?.trim() || fallbackDescription(shopProducts),
          capabilityLine: capabilityLine(shopProducts),
          rating: ratingSummaries.value[shop.slug] ?? null
        };
      });
    });
    const filteredShops = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      return shopCards.value.filter((shop) => {
        const matchesQuery = !query || shop.searchText.includes(query);
        const matchesFilter = matchesChip(shop, activeFilter.value);
        return matchesQuery && matchesFilter;
      });
    });
    function productCategory(product) {
      const category = product.category;
      if (typeof category === "string") return category;
      if (category && typeof category === "object" && "name" in category && typeof category.name === "string") {
        return category.name;
      }
      return "";
    }
    function normalizeTag(value) {
      return value.trim().toUpperCase();
    }
    function buildTags(shopProducts) {
      const tags = [];
      for (const product of shopProducts) {
        const category = productCategory(product);
        if (category) tags.push(normalizeTag(category));
        if (product.pricing_mode === "LARGE_FORMAT") tags.push("LARGE FORMAT");
        if (product.pricing_mode === "SHEET") tags.push("DIGITAL PRINT");
        if (tags.length >= 6) break;
      }
      return [...new Set(tags)].slice(0, 3);
    }
    function primaryBadge(shopProducts) {
      if (shopProducts.some((product) => product.pricing_mode === "LARGE_FORMAT")) return "LARGE FORMAT";
      if (shopProducts.some((product) => `${product.name} ${productCategory(product)}`.toLowerCase().includes("business"))) return "BUSINESS READY";
      if (shopProducts.length >= 6) return "PRO PREFERRED";
      return null;
    }
    function secondaryLine(shopProducts) {
      if (!shopProducts.length) return "Print partner";
      const categoryCounts = /* @__PURE__ */ new Map();
      for (const product of shopProducts) {
        const category = productCategory(product) || product.pricing_mode;
        categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
      }
      const top = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return top ? `${top} specialist` : "Print partner";
    }
    function fallbackDescription(shopProducts) {
      if (!shopProducts.length) return "Browse this shop for quote-ready print work and tailored production support.";
      const names = shopProducts.slice(0, 2).map((product) => product.name).join(", ");
      return `Explore quote-ready work including ${names}${shopProducts.length > 2 ? " and more" : ""}.`;
    }
    function capabilityLine(shopProducts) {
      if (!shopProducts.length) return "Quote-ready setup available";
      const categories = [...new Set(shopProducts.map((product) => productCategory(product)).filter(Boolean))];
      if (categories.length) return categories.slice(0, 2).join(" • ");
      return `${shopProducts.length} live product${shopProducts.length === 1 ? "" : "s"}`;
    }
    function shopImageUrl(shopProducts) {
      const image = shopProducts.find((product) => product.primary_image)?.primary_image ?? shopProducts.flatMap((product) => product.images ?? []).find((img) => img.image)?.image ?? null;
      if (!image) return null;
      return image.startsWith("http") ? image : getMediaUrl(image);
    }
    function matchesChip(shop, chip) {
      if (chip === "all") return true;
      if (chip === "sheet") return shop.searchText.includes("sheet") || shop.searchText.includes("digital");
      if (chip === "large-format") return shop.searchText.includes("large format");
      if (chip === "business-cards") return shop.searchText.includes("business");
      if (chip === "brochure") return shop.searchText.includes("brochure");
      if (chip === "sticker") return shop.searchText.includes("sticker") || shop.searchText.includes("label");
      return true;
    }
    async function loadMarketplace() {
      fetchError.value = null;
      loading.value = true;
      try {
        const [shopList, productList] = await Promise.all([
          listShops(),
          getAllProducts()
        ]);
        shops.value = shopList;
        products.value = productList;
        if (authStore.isAuthenticated) {
          favoritesStore.loadFavorites();
        }
        const summaries = await Promise.all(
          shopList.map(async (shop) => ({ slug: shop.slug, summary: await getRatingSummary(shop.slug) }))
        );
        ratingSummaries.value = Object.fromEntries(
          summaries.filter((entry) => entry.summary).map((entry) => [entry.slug, entry.summary])
        );
      } catch (err) {
        safeLogError(err, "shops.index");
        shops.value = [];
        products.value = [];
        ratingSummaries.value = {};
        fetchError.value = err instanceof Error ? err.message : "Something went wrong while loading shops.";
      } finally {
        loading.value = false;
      }
    }
    watch(searchQuery, (value) => {
      if (searchTrackTimer) {
        clearTimeout(searchTrackTimer);
      }
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        return;
      }
      searchTrackTimer = setTimeout(() => {
        const normalized = trimmed.toLowerCase();
        if (normalized === lastTrackedSearch.value) {
          return;
        }
        lastTrackedSearch.value = normalized;
        void trackSearch(trimmed, {
          source: "shops_index",
          active_filter: activeFilter.value,
          results_count: filteredShops.value.length
        });
      }, 500);
    });
    usePrintySeo({
      title: "Print Shops",
      description: "Discover highly rated print shops across Kenya. Compare specialties, browse live products, and request quotes from the right production partner.",
      path: "/shops",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Shops", path: "/shops" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_ShopsShopStatusBadge = __nuxt_component_4;
      const _component_ShopsShopFavoriteToggle = __nuxt_component_3$1;
      const _component_NuxtLink = __nuxt_component_3$1$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-surface)] pb-20" }, _attrs))}><section class="border-b border-[var(--p-border)] bg-[var(--p-surface-raised)]/82 backdrop-blur-sm"><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div class="max-w-2xl"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]"> Local Print Experts </span><h1 class="mt-4 text-4xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-5xl"> Expert print partners, locally sourced. </h1><p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]"> Discover highly rated print shops, browse their specialties, and find the right production partner for business cards, packaging, large format, and more. </p></div><div class="w-full max-w-md space-y-4"><label class="group relative block"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search print shops, products, or capabilities..." class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] py-4 pl-12 pr-4 text-[var(--p-text)] outline-none transition-all focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-search",
        class: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--p-text-muted)] transition-colors group-focus-within:text-[var(--p-primary)]"
      }, null, _parent));
      _push(`</label><div class="flex items-center justify-between gap-3"><p class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(filteredShops).length)} shop${ssrInterpolate(unref(filteredShops).length === 1 ? "" : "s")} matched </p>`);
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
      _push(`</div></div></div><div class="mt-8 flex flex-wrap gap-3"><!--[-->`);
      ssrRenderList(filterChips, (chip) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeFilter) === chip.value ? "bg-flamingo-500 text-white shadow-lg shadow-flamingo-500/20" : "bg-[var(--p-surface-container)] text-[var(--p-text-muted)] hover:bg-[var(--p-surface-container-high)] hover:text-[var(--p-text)]", "rounded-full px-5 py-2.5 text-sm font-semibold transition-all"])}">${ssrInterpolate(chip.label)}</button>`);
      });
      _push(`<!--]--></div></div></section><section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(fetchError)) {
        _push(`<div class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-circle-alert",
          class: "mx-auto h-14 w-14 text-red-500"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-xl font-semibold text-red-700 dark:text-red-300">Could not load shops</h3><p class="mt-2 text-sm text-red-600/90 dark:text-red-300/90">${ssrInterpolate(unref(fetchError))}</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-5",
          onClick: loadMarketplace
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Try again `);
            } else {
              return [
                createTextVNode(" Try again ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(filteredShops).length) {
        _push(`<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(filteredShops), (shop) => {
          _push(`<article class="group overflow-hidden rounded-2xl bg-[var(--p-surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_40px_rgba(20,27,44,0.08)]"><div class="relative h-64 overflow-hidden">`);
          if (shop.imageUrl) {
            _push(`<img${ssrRenderAttr("src", shop.imageUrl)}${ssrRenderAttr("alt", shop.name)} class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">`);
          } else {
            _push(`<div class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(225,53,21,0.16),_transparent_55%),linear-gradient(135deg,var(--p-surface-container),var(--p-surface-sunken))]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-store",
              class: "h-16 w-16 text-[var(--p-primary)]/65"
            }, null, _parent));
            _push(`</div>`);
          }
          if (shop.rating) {
            _push(`<div class="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-raised)]/92 px-3 py-1 shadow-sm backdrop-blur-md">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-star",
              class: "h-4 w-4 fill-current text-amber-500"
            }, null, _parent));
            _push(`<span class="text-xs font-bold text-[var(--p-text)]">${ssrInterpolate(shop.rating.average.toFixed(1))}</span><span class="text-[11px] text-[var(--p-text-muted)]">(${ssrInterpolate(shop.rating.count)})</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute bottom-4 left-4 flex flex-wrap gap-2">`);
          if (shop.primaryBadge) {
            _push(`<span class="rounded-lg bg-[var(--p-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">${ssrInterpolate(shop.primaryBadge)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (shop.status) {
            _push(ssrRenderComponent(_component_ShopsShopStatusBadge, {
              status: shop.status
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex h-[calc(100%-16rem)] flex-col p-6"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><h2 class="truncate text-xl font-bold text-[var(--p-text)]">${ssrInterpolate(shop.name)}</h2><p class="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(shop.secondaryLine)}</p></div>`);
          _push(ssrRenderComponent(_component_ShopsShopFavoriteToggle, {
            "shop-id": shop.id,
            "shop-name": shop.name,
            "shop-slug": shop.slug
          }, null, _parent));
          _push(`</div><p class="mt-4 line-clamp-2 text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(shop.descriptionText)}</p><div class="mt-5 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(shop.tags, (tag) => {
            _push(`<span class="rounded-md bg-[var(--p-surface-sunken)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div><div class="mt-8 flex items-center justify-between border-t border-[var(--p-border)] pt-4"><div><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Capabilities</p><p class="mt-1 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(shop.capabilityLine)}</p></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/shops/${shop.slug}`,
            class: "cta-button inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors group-hover:bg-flamingo-400"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View Shop `);
              } else {
                return [
                  createTextVNode(" View Shop ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-search-x",
          class: "mx-auto h-14 w-14 text-[var(--p-border)]"
        }, null, _parent));
        _push(`<h3 class="mt-4 text-xl font-semibold text-[var(--p-text)]">No shops match this search</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Try another keyword or remove the current filter chip. </p></div>`);
      }
      _push(`</section></div>`);
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
//# sourceMappingURL=index-DLNTqDp5.mjs.map
