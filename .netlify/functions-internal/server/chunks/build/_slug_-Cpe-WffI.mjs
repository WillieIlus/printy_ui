import { g as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$2 } from './EmptyState-InVpxbUI.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { a as fetchSEOLocationDetail, b as fetchSEOLocationProducts, c as fetchSEOLocations } from './seo-DAQhuVkA.mjs';
import { u as usePrintySeo } from './usePrintySeo-Bv_R7Bu0.mjs';
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
    const loading = ref(true);
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
      } catch {
        location.value = null;
        productsInLocation.value = [];
        nearbyLocations.value = [];
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
              text: `Print shops in ${name} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog—browse their products to see available sizes, paper stocks, and finishing options.`
            }
          },
          {
            "@type": "Question",
            name: "How long does printing take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1–3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines."
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"><nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--p-text-muted)]">`);
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
        _push(`<!--[--><header><h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl"> Print shops in ${ssrInterpolate(unref(location).name)}</h1><div class="mt-4 space-y-3 text-lg text-[var(--p-text-muted)]">`);
        if (unref(location).description) {
          _push(`<p class="leading-relaxed">${ssrInterpolate(unref(location).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="leading-relaxed"> Find trusted print shops in ${ssrInterpolate(unref(location).name)}${ssrInterpolate(unref(location).city ? `, ${unref(location).city}` : "")}. Compare prices for business cards, flyers, posters, and more. Get instant quotes, customize paper and finishing, and request formal quotes—all in one place. </p></div></header><section class="mt-12"><h2 class="text-xl font-semibold text-[var(--p-text)]"> Print shops in ${ssrInterpolate(unref(location).name)}</h2><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(unref(location).shops?.length ?? 0)} shop${ssrInterpolate((unref(location).shops?.length ?? 0) === 1 ? "" : "s")} available </p>`);
        if (unref(location).shops?.length) {
          _push(`<div class="mt-6 grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(location).shops, (shop) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: shop.slug,
              to: `/shops/${shop.slug}`,
              class: "flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-store",
                    class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(shop.name)}</h3><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>View catalog &amp; get quote</p></div>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "h-5 w-5 shrink-0 text-[var(--p-text-muted)]"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-store",
                        class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                      })
                    ]),
                    createVNode("div", { class: "min-w-0 flex-1" }, [
                      createVNode("h3", { class: "font-semibold text-[var(--p-text)]" }, toDisplayString(shop.name), 1),
                      createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, "View catalog & get quote")
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "h-5 w-5 shrink-0 text-[var(--p-text-muted)]"
                    })
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="mt-6 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-store",
            class: "mx-auto h-16 w-16 text-[var(--p-border)]"
          }, null, _parent));
          _push(`<h3 class="mt-4 text-lg font-medium text-[var(--p-text)]">No shops yet</h3><p class="mt-2 text-sm text-[var(--p-text-muted)]">Check back soon for print shops in ${ssrInterpolate(unref(location).name)}.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/shops",
            class: "btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Browse all shops `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
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
          }, _parent));
          _push(`</div>`);
        }
        _push(`</section>`);
        if (unref(productsInLocation).length) {
          _push(`<section class="mt-16"><h2 class="text-xl font-semibold text-[var(--p-text)]"> Popular products in ${ssrInterpolate(unref(location).name)}</h2><p class="mt-1 text-sm text-[var(--p-text-muted)]"> Shops in this area offer these product types. Click to see which shops and get quotes. </p><div class="mt-6 flex flex-wrap gap-3"><!--[-->`);
          ssrRenderList(unref(productsInLocation), (product) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: product.slug,
              to: `/locations/${unref(slug)}/products/${product.slug}`,
              class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:bg-[var(--p-surface-sunken)] transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-package",
                    class: "h-4 w-4 text-flamingo-500"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(product.name)}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-package",
                      class: "h-4 w-4 text-flamingo-500"
                    }),
                    createTextVNode(" " + toDisplayString(product.name), 1)
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
          _push(`<section class="mt-16"><h2 class="text-xl font-semibold text-[var(--p-text)]"> Other locations </h2><p class="mt-1 text-sm text-[var(--p-text-muted)]"> Find print shops in nearby areas </p><div class="mt-6 flex flex-wrap gap-3"><!--[-->`);
          ssrRenderList(unref(nearbyLocations), (loc) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: loc.slug,
              to: `/locations/${loc.slug}`,
              class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:bg-[var(--p-surface-sunken)] transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-map-pin",
                    class: "h-4 w-4 text-flamingo-500"
                  }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(loc.name)}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-map-pin",
                      class: "h-4 w-4 text-flamingo-500"
                    }),
                    createTextVNode(" " + toDisplayString(loc.name), 1)
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
        _push(`<section class="mt-16">`);
        _push(ssrRenderComponent(_component_LocationsLocationFaq, {
          "location-name": unref(location).name,
          "shop-count": unref(location).shops?.length ?? 0
        }, null, _parent));
        _push(`</section><div class="mt-12 flex flex-wrap gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/gallery",
          class: "btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Browse products `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Browse products "),
                createVNode(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/shops",
          class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` All shops `);
            } else {
              return [
                createTextVNode(" All shops ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><!--]-->`);
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
//# sourceMappingURL=_slug_-Cpe-WffI.mjs.map
