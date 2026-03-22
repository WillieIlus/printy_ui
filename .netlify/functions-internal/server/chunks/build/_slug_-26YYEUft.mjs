import { g as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$2 } from './EmptyState-InVpxbUI.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { a as fetchSEOLocationDetail, b as fetchSEOLocationProducts, c as fetchSEOLocations } from './seo-DOewQL-1.mjs';
import { g as getRatingSummary } from './ratings-Do1hf-Ug.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "LocationFaq",
  __ssrInlineRender: true,
  props: {
    locationName: {},
    shopCount: { default: 0 },
    items: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const defaultFaqs = computed(() => [
      {
        question: `How do I get a printing quote in ${props.locationName}?`,
        answer: `Browse our list of print shops in ${props.locationName}, pick a shop, and add products to your quote. You can customize paper, quantity, and finishing options. Most shops provide instant pricing for standard items like business cards and flyers.`
      },
      {
        question: `What can I print?`,
        answer: `Print shops in ${props.locationName} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog—browse their products to see available sizes, paper stocks, and finishing options.`
      },
      {
        question: `How long does printing take?`,
        answer: `Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1–3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines.`
      },
      {
        question: `Can I compare prices between shops?`,
        answer: `Yes. Add the same or similar products from different shops to get quotes. Printy shows you pricing as you customize, so you can compare before requesting a formal quote.`
      }
    ]);
    const faqItems = computed(
      () => props.items.length > 0 ? props.items : defaultFaqs.value
    );
    const openIndex = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 sm:p-8" }, _attrs))}><h2 class="text-xl font-semibold text-[var(--p-text)] sm:text-2xl"> Frequently asked questions </h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"> Common questions about printing in ${ssrInterpolate(__props.locationName)}</p><ul class="mt-6 space-y-4"><!--[-->`);
      ssrRenderList(unref(faqItems), (item, i) => {
        _push(`<li class="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] overflow-hidden"><button type="button" class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"><span>${ssrInterpolate(item.question)}</span>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: unref(openIndex) === i ? "i-lucide-chevron-up" : "i-lucide-chevron-down",
          class: "h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`</button><div class="border-t border-[var(--p-border)] px-4 py-3 text-sm text-[var(--p-text-muted)]" style="${ssrRenderStyle(unref(openIndex) === i ? null : { display: "none" })}">${ssrInterpolate(item.answer)}</div></li>`);
      });
      _push(`<!--]--></ul></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/locations/LocationFaq.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "LocationsLocationFaq" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const location = ref(null);
    const productsInLocation = ref([]);
    const nearbyLocations = ref([]);
    const ratingSummaries = ref({});
    const loading = ref(true);
    const locationMeta = {
      westlands: { hub: "Central Westlands Hub", shopTagline: "Modern printing facility" },
      nairobi: { hub: "Capital Region Hub", shopTagline: "High-volume production cluster" },
      mombasa: { hub: "Coastal Logistics", shopTagline: "Fast-moving hospitality print network" },
      kisumu: { hub: "Lakeside Trade Hub", shopTagline: "Regional retail and education demand" },
      cbd: { hub: "Central Business District", shopTagline: "Express business print corridor" },
      kilimani: { hub: "Creative Studio Cluster", shopTagline: "Short-run design and event production" },
      "industrial-area": { hub: "Industrial Production Zone", shopTagline: "Large-format and packaging capacity" }
    };
    const featuredShop = computed(() => location.value?.shops?.[0] ?? null);
    const featuredShopInitials = computed(() => initials(featuredShop.value?.name));
    const featuredShopTagline = computed(() => {
      return locationMeta[slug.value]?.shopTagline ?? "Trusted local print partner";
    });
    const featuredRating = computed(() => {
      if (!featuredShop.value) return null;
      return ratingSummaries.value[featuredShop.value.slug] ?? null;
    });
    const featuredRatingLabel = computed(() => {
      if (!featuredRating.value?.count) return "Top rated local shop";
      return `${featuredRating.value.average.toFixed(1)} (${featuredRating.value.count} reviews)`;
    });
    const featuredStarIcons = computed(() => {
      const average = featuredRating.value?.average ?? 4.5;
      return Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        if (average >= starNumber) return "i-lucide-star";
        if (average >= starNumber - 0.5) return "i-lucide-star-half";
        return "i-lucide-star";
      });
    });
    const featuredServices = computed(() => {
      const services = productsInLocation.value.slice(0, 3).map((product) => product.name.toUpperCase());
      if (!services.length) return ["BUSINESS CARDS", "LARGE FORMAT", "LAMINATING"];
      return services;
    });
    const featuredDescription = computed(() => {
      const place = location.value?.name ?? "this area";
      return `Specializing in high-precision offset and digital printing. Known for rapid turnaround times in ${place} and strong coverage across business stationery, display work, and premium finishing.`;
    });
    const locationSummary = computed(() => {
      const place = location.value?.name ?? "";
      return `Find trusted print shops in ${place}. Compare prices for business cards, flyers, posters, and more. Get instant quotes, customize paper and finishing, and request formal quotes all in one place.`;
    });
    const locationMapLabel = computed(() => {
      return locationMeta[slug.value]?.hub ?? `${location.value?.name ?? "Regional"} print hub`;
    });
    const locationMapEmbedUrl = computed(() => {
      const place = location.value?.name ?? slug.value;
      const shopNames = location.value?.shops?.slice(0, 3).map((shop) => shop.name).join(" ") ?? "";
      return `https://www.google.com/maps?q=${encodeURIComponent(`${place} Kenya print shops ${shopNames}`)}&z=13&output=embed`;
    });
    const productCards = computed(() => {
      return productsInLocation.value.slice(0, 6).map((product) => ({
        slug: product.slug,
        name: product.name,
        icon: iconForProduct(product.name),
        detail: detailForProduct(product.name),
        priceLine: priceLineForProduct(product.name)
      }));
    });
    const nearbyLocationCards = computed(() => nearbyLocations.value.slice(0, 6));
    function initials(name) {
      if (!name) return "PS";
      return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
    }
    function iconForProduct(name) {
      const key = name.toLowerCase();
      if (key.includes("business")) return "i-lucide-credit-card";
      if (key.includes("flyer")) return "i-lucide-file-text";
      if (key.includes("banner")) return "i-lucide-flag";
      if (key.includes("sticker") || key.includes("label")) return "i-lucide-sticker";
      if (key.includes("brochure")) return "i-lucide-book-open";
      return "i-lucide-package";
    }
    function priceLineForProduct(name) {
      const key = name.toLowerCase();
      if (key.includes("business")) return "Starts from KES 1,500 / 100pcs";
      if (key.includes("flyer")) return "A5 single sided";
      if (key.includes("banner")) return "Weather resistant";
      if (key.includes("sticker")) return "Cut to size";
      if (key.includes("brochure")) return "Folded marketing set";
      return "Quote-ready setup";
    }
    function detailForProduct(name) {
      const key = name.toLowerCase();
      if (key.includes("business")) return "Popular for walk-in corporate stationery and quick reorders.";
      if (key.includes("flyer")) return "Built for promotions, menus, campaigns, and event distribution.";
      if (key.includes("banner")) return "Suitable for outdoor promos, retail activations, and events.";
      if (key.includes("sticker")) return "Used for packaging, branding labels, and product finishing.";
      if (key.includes("brochure")) return "Strong fit for premium folded collateral and company profiles.";
      return "Frequently requested print product in this location.";
    }
    async function load() {
      loading.value = true;
      try {
        const [detail, products, allLocations] = await Promise.all([
          fetchSEOLocationDetail(slug.value),
          fetchSEOLocationProducts(slug.value),
          fetchSEOLocations()
        ]);
        location.value = detail;
        productsInLocation.value = products;
        nearbyLocations.value = (allLocations ?? []).filter((l) => l.slug !== slug.value).slice(0, 8);
        if (detail?.shops?.length) {
          const ratingEntries = await Promise.all(
            detail.shops.slice(0, 6).map(async (shop) => [shop.slug, await getRatingSummary(shop.slug)])
          );
          ratingSummaries.value = Object.fromEntries(ratingEntries);
        } else {
          ratingSummaries.value = {};
        }
      } catch {
        location.value = null;
        productsInLocation.value = [];
        nearbyLocations.value = [];
        ratingSummaries.value = {};
      } finally {
        loading.value = false;
      }
    }
    watch(slug, load);
    const faqSchema = computed(() => {
      if (!location.value) return void 0;
      const name = location.value.name;
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I get a printing quote in ${name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Browse our list of print shops in ${name}, pick a shop, and add products to your quote. You can customize paper, quantity, and finishing options. Most shops provide instant pricing for standard items like business cards and flyers.`
            }
          },
          {
            "@type": "Question",
            name: "What can I print?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Print shops in ${name} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog. Browse their products to see available sizes, paper stocks, and finishing options.`
            }
          },
          {
            "@type": "Question",
            name: "How long does printing take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1 to 3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines."
            }
          },
          {
            "@type": "Question",
            name: "Can I compare prices between shops?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Add the same or similar products from different shops to get quotes. Printy shows you pricing as you customize, so you can compare before requesting a formal quote."
            }
          }
        ]
      };
    });
    usePrintySeo(() => ({
      title: location.value ? `Print Shops in ${location.value.name}` : "Location",
      description: location.value ? `Find print shops in ${location.value.name}. Compare business cards, flyers, posters, and get quotes.` : "Print shops by location",
      path: `/locations/${slug.value}`,
      noIndex: !loading.value && !location.value,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Shops", path: "/shops" },
        { name: location.value?.name ?? slug.value, path: `/locations/${slug.value}` }
      ],
      schema: location.value && faqSchema.value ? [faqSchema.value] : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$2;
      const _component_LocationsLocationFaq = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16"><nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--p-text-muted)]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-chevron-right",
        class: "h-4 w-4 shrink-0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Shops`);
          } else {
            return [
              createTextVNode("Shops")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-chevron-right",
        class: "h-4 w-4 shrink-0"
      }, null, _parent));
      _push(`<span class="text-[var(--p-text)]">${ssrInterpolate(unref(location)?.name)}</span></nav>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (!unref(location)) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: "Location not found",
          description: "This location does not exist or is no longer active.",
          icon: "i-lucide-map-pin"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/shops",
                class: "btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Browse all shops `);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createTextVNode(" Browse all shops "),
                      createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-right",
                        class: "h-4 w-4"
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtLink, {
                  to: "/shops",
                  class: "btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Browse all shops "),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4"
                    })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!--[--><header class="max-w-4xl"><h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-5xl"> Print shops in ${ssrInterpolate(unref(location).name)}</h1><p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]">${ssrInterpolate(unref(locationSummary))}</p></header><section class="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_25rem]"><div class="space-y-8">`);
        if (unref(featuredShop)) {
          _push(`<div class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_20px_45px_rgba(16,24,40,0.08)]"><div class="border-b border-[var(--p-border)] bg-[linear-gradient(135deg,rgba(240,82,36,0.12),rgba(243,246,252,0.1))] p-6 sm:p-8"><div class="flex flex-wrap items-center gap-3"><span class="inline-flex items-center gap-1.5 rounded-full bg-flamingo-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-badge-check",
            class: "h-3.5 w-3.5"
          }, null, _parent));
          _push(` Top rated region </span><span class="text-sm font-medium text-[var(--p-text-muted)]">${ssrInterpolate(unref(featuredShopTagline))}</span></div></div><div class="p-6 sm:p-8"><div class="flex items-start gap-4"><div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-mirage-950 text-xl font-bold text-white">${ssrInterpolate(unref(featuredShopInitials))}</div><div class="min-w-0 flex-1"><h2 class="text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(featuredShop).name)}</h2><div class="mt-3 flex flex-wrap items-center gap-3"><div class="flex items-center gap-1 text-amber-500"><!--[-->`);
          ssrRenderList(unref(featuredStarIcons), (star) => {
            _push(ssrRenderComponent(_component_UIcon, {
              key: `${unref(featuredShop).slug}-${star}`,
              name: star,
              class: "h-4 w-4"
            }, null, _parent));
          });
          _push(`<!--]--></div><span class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(featuredRatingLabel))}</span></div></div></div><div class="mt-6 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(featuredServices), (service) => {
            _push(`<span class="rounded-full bg-[var(--p-surface-sunken)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-flamingo-500">${ssrInterpolate(service)}</span>`);
          });
          _push(`<!--]--></div><p class="mt-6 text-base leading-7 text-[var(--p-text-muted)]">${ssrInterpolate(unref(featuredDescription))}</p><div class="mt-8 flex flex-wrap gap-3">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/shops/${unref(featuredShop).slug}`,
            class: "inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View catalog &amp; get quote `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createTextVNode(" View catalog & get quote "),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/shops/${unref(featuredShop).slug}/request-quote`,
            class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-3 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface-sunken)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Message Shop `);
              } else {
                return [
                  createTextVNode(" Message Shop ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(productsInLocation).length) {
          _push(`<section><h2 class="text-2xl font-semibold text-[var(--p-text)]">Popular products in ${ssrInterpolate(unref(location).name)}</h2><div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(productCards), (product) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: product.slug,
              to: `/locations/${unref(slug)}/products/${product.slug}`,
              class: "group rounded-[1.6rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-all hover:-translate-y-1 hover:border-flamingo-200 hover:shadow-[0_18px_40px_rgba(16,24,40,0.08)]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-flamingo-500/12"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: product.icon,
                    class: "h-6 w-6 text-flamingo-500"
                  }, null, _parent2, _scopeId));
                  _push2(`</div><h3 class="mt-4 text-lg font-bold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(product.name)}</h3><p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(product.detail)}</p><div class="mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4"${_scopeId}><span class="text-sm font-semibold text-flamingo-500"${_scopeId}>${ssrInterpolate(product.priceLine)}</span>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "h-5 w-5 text-[var(--p-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-flamingo-500"
                  }, null, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex h-12 w-12 items-center justify-center rounded-2xl bg-flamingo-500/12" }, [
                      createVNode(_component_UIcon, {
                        name: product.icon,
                        class: "h-6 w-6 text-flamingo-500"
                      }, null, 8, ["name"])
                    ]),
                    createVNode("h3", { class: "mt-4 text-lg font-bold text-[var(--p-text)]" }, toDisplayString(product.name), 1),
                    createVNode("p", { class: "mt-2 text-sm leading-6 text-[var(--p-text-muted)]" }, toDisplayString(product.detail), 1),
                    createVNode("div", { class: "mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4" }, [
                      createVNode("span", { class: "text-sm font-semibold text-flamingo-500" }, toDisplayString(product.priceLine), 1),
                      createVNode(_component_UIcon, {
                        name: "i-lucide-chevron-right",
                        class: "h-5 w-5 text-[var(--p-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-flamingo-500"
                      })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(nearbyLocations).length) {
          _push(`<section><h2 class="text-2xl font-semibold text-[var(--p-text)]">Other locations</h2><div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(nearbyLocationCards), (loc) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: loc.slug,
              to: `/locations/${loc.slug}`,
              class: "flex items-center justify-between rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] transition-all hover:border-flamingo-200 hover:bg-[var(--p-surface-sunken)]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="flex items-center gap-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-map-pin",
                    class: "h-4 w-4 text-flamingo-500"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(loc.name)}</span>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "h-4 w-4 text-[var(--p-text-muted)]"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("span", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-map-pin",
                        class: "h-4 w-4 text-flamingo-500"
                      }),
                      createTextVNode(" " + toDisplayString(loc.name), 1)
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "h-4 w-4 text-[var(--p-text-muted)]"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="overflow-hidden rounded-[2rem] border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.22)]"><div class="relative p-6 sm:p-8"><div class="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-flamingo-500/18 blur-3xl"></div><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-flamingo-400">Pro feature</p><h2 class="mt-4 text-2xl font-bold">Are you a shop owner?</h2><p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300"> Join the Precision Press network and reach thousands of customers in ${ssrInterpolate(unref(location).name)}. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/signup",
          class: "mt-6 inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Register your shop `);
            } else {
              return [
                createTextVNode(" Register your shop ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section></div><aside class="space-y-6 xl:sticky xl:top-24 xl:self-start"><section class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_20px_45px_rgba(16,24,40,0.08)]"><div class="border-b border-[var(--p-border)] p-6"><h2 class="text-2xl font-semibold text-[var(--p-text)]">Map of ${ssrInterpolate(unref(location).name)}</h2><div class="mt-4 flex items-center gap-3 text-sm text-[var(--p-text-muted)]"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-flamingo-500/12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-map-pinned",
          class: "h-5 w-5 text-flamingo-500"
        }, null, _parent));
        _push(`</div><div><p class="font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(locationMapLabel))}</p><p>${ssrInterpolate(unref(location).shops?.length ?? 0)} Print Shop${ssrInterpolate((unref(location).shops?.length ?? 0) === 1 ? "" : "s")} nearby</p></div></div></div><div class="p-4"><div class="overflow-hidden rounded-[1.5rem] border border-[var(--p-border)] bg-mirage-950"><iframe${ssrRenderAttr("src", unref(locationMapEmbedUrl))} title="Google map of location" class="h-[22rem] w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div></section><section class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0_20px_45px_rgba(16,24,40,0.08)]"><h2 class="text-xl font-semibold text-[var(--p-text)]">Print shops in ${ssrInterpolate(unref(location).name)}</h2><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(location).shops?.length ?? 0)} shop${ssrInterpolate((unref(location).shops?.length ?? 0) === 1 ? "" : "s")} available </p>`);
        if (unref(location).shops?.length) {
          _push(`<div class="mt-6 space-y-3"><!--[-->`);
          ssrRenderList(unref(location).shops, (shop) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: shop.slug,
              to: `/shops/${shop.slug}`,
              class: "flex items-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm transition hover:border-flamingo-200"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flamingo-500/12 text-sm font-bold text-flamingo-500"${_scopeId}>${ssrInterpolate(initials(shop.name))}</div><div class="min-w-0 flex-1"${_scopeId}><p class="truncate font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(shop.name)}</p><p class="truncate text-xs text-[var(--p-text-muted)]"${_scopeId}>View catalog &amp; get quote</p></div>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-4 w-4 text-[var(--p-text-muted)]"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flamingo-500/12 text-sm font-bold text-flamingo-500" }, toDisplayString(initials(shop.name)), 1),
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("p", { class: "truncate font-semibold text-[var(--p-text)]" }, toDisplayString(shop.name), 1),
                      createVNode("p", { class: "truncate text-xs text-[var(--p-text-muted)]" }, "View catalog & get quote")
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-4 w-4 text-[var(--p-text-muted)]"
                    })
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
        _push(`</section></aside></section><section class="mt-16">`);
        _push(ssrRenderComponent(_component_LocationsLocationFaq, {
          "location-name": unref(location).name,
          "shop-count": unref(location).shops?.length ?? 0
        }, null, _parent));
        _push(`</section><!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-26YYEUft.mjs.map
