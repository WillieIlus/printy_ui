import { _ as __nuxt_component_1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as usePrintySeo } from './usePrintySeo-CLnVGaAz.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = ref([]);
    const locationDetails = ref({});
    const publicShops = ref([]);
    const selectedLocationSlug = ref("");
    const loading = ref(true);
    const locationMeta = {
      nairobi: { subtitle: "Capital Region Hub", areaLabel: "Corporate and high-volume demand" },
      westlands: { subtitle: "Commercial District Cluster", areaLabel: "Agency, branding, and premium runs" },
      kilimani: { subtitle: "Creative Studio Corridor", areaLabel: "Events, menus, and short-run design work" },
      cbd: { subtitle: "Central Business Core", areaLabel: "Walk-in business stationery and express jobs" },
      "industrial-area": { subtitle: "Heavy Production Zone", areaLabel: "Packaging, bulk print, and large format" },
      mombasa: { subtitle: "Coastal Logistics", areaLabel: "Hospitality, tourism, and regional fulfillment" },
      kisumu: { subtitle: "Lakeside Trade Center", areaLabel: "Retail, institutions, and regional print demand" }
    };
    const locationCards = computed(() => {
      return locations.value.map((loc) => {
        const detail = locationDetails.value[loc.slug];
        const mappedShops = shopsForLocation(loc.slug, detail);
        const meta = locationMeta[loc.slug] ?? {
          subtitle: locationSubtitle(loc),
          areaLabel: loc.location_type === "city" ? "City-wide print coverage" : "Local neighborhood coverage"
        };
        const printerCount = detail?.shops?.length ?? mappedShops.length;
        const mapQuery = mappedShops.length ? `${loc.name} Kenya print shops ${mappedShops.slice(0, 4).map((shop) => shop.name).join(" ")}` : `${loc.name} Kenya print shops`;
        return {
          ...loc,
          printerCount,
          subtitle: meta.subtitle,
          areaLabel: meta.areaLabel,
          mappedShopsLabel: mappedShops.length ? `${mappedShops.length} on map` : "Area preview",
          mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=12&output=embed`,
          mapNarrative: mappedShops.length ? `Google Maps is centered on ${loc.name} using live shop matches from this region. Open the location page to browse each vendor in detail.` : `Google Maps is centered on ${loc.name} so customers can inspect the area even when individual shop coordinates are not yet available in the listing feed.`
        };
      });
    });
    const activeLocation = computed(() => {
      return locationCards.value.find((loc) => loc.slug === selectedLocationSlug.value) ?? locationCards.value[0] ?? null;
    });
    function normalize(value) {
      return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    }
    function locationSubtitle(loc) {
      const typeLabel = loc.location_type?.replace(/_/g, " ") ?? "print region";
      return `${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)} print cluster`;
    }
    function shopsForLocation(slug, detail) {
      if (!detail?.shops?.length) return [];
      const slugs = new Set(detail.shops.map((shop) => shop.slug));
      return publicShops.value.filter((shop) => {
        if (slugs.has(shop.slug)) return true;
        const locationName = normalize(detail.name);
        const city = normalize(shop.city);
        const state = normalize(shop.state);
        return city === locationName || state === locationName || normalize(shop.address_line).includes(locationName);
      });
    }
    usePrintySeo({
      title: "Print Shops by Location",
      description: "Find print shops near you. Browse by city or neighborhood for business cards, flyers, posters, and more.",
      path: "/locations",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16"><nav class="mb-8 flex items-center gap-2 text-sm text-[var(--p-text-muted)]">`);
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
      _push(`<span class="text-[var(--p-text)]">Locations</span></nav><div class="grid gap-10 xl:grid-cols-[minmax(0,1.05fr)_24rem]"><section class="min-w-0"><div class="max-w-3xl"><span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500"> Print regions </span><h1 class="mt-4 text-3xl font-bold text-[var(--p-text)] sm:text-5xl"> Print shops by location </h1><p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]"> Compare the busiest print regions across Kenya, see how many vendors are active in each market, and jump straight into the area that fits your job. </p></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(locationCards).length) {
        _push(`<div class="mt-12 grid gap-4 sm:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(locationCards), (loc) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: loc.slug,
            to: `/locations/${loc.slug}`,
            class: "group rounded-[1.75rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-200 hover:shadow-[0_20px_45px_rgba(16,24,40,0.08)] dark:hover:border-flamingo-800/50",
            onMouseenter: ($event) => selectedLocationSlug.value = loc.slug,
            onFocus: ($event) => selectedLocationSlug.value = loc.slug
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex items-start gap-4"${_scopeId}><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-flamingo-500/12"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-map-pinned",
                  class: "h-7 w-7 text-flamingo-500"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0"${_scopeId}><h2 class="text-2xl font-bold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.name)}</h2><p class="mt-1 text-sm font-medium text-flamingo-500"${_scopeId}>${ssrInterpolate(loc.subtitle)}</p></div></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-up-right",
                  class: "h-5 w-5 shrink-0 text-[var(--p-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-flamingo-500"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="mt-8 grid grid-cols-2 gap-3"${_scopeId}><div class="rounded-2xl bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Coverage</p><p class="mt-2 text-base font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.areaLabel)}</p></div><div class="rounded-2xl bg-[var(--p-surface-sunken)] p-4"${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}>Mapped shops</p><p class="mt-2 text-base font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.mappedShopsLabel)}</p></div></div><div class="mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4"${_scopeId}><div${_scopeId}><p class="text-3xl font-extrabold text-flamingo-500"${_scopeId}>${ssrInterpolate(loc.printerCount)}</p><p class="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]"${_scopeId}> Printer${ssrInterpolate(loc.printerCount === 1 ? "" : "s")}</p></div><span class="inline-flex items-center gap-2 rounded-full bg-flamingo-500/12 px-3 py-1.5 text-xs font-semibold text-flamingo-500"${_scopeId}> Explore area `);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-4 w-4"
                }, null, _parent2, _scopeId));
                _push2(`</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                    createVNode("div", { class: "flex items-start gap-4" }, [
                      createVNode("div", { class: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-flamingo-500/12" }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-map-pinned",
                          class: "h-7 w-7 text-flamingo-500"
                        })
                      ]),
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("h2", { class: "text-2xl font-bold text-[var(--p-text)]" }, toDisplayString(loc.name), 1),
                        createVNode("p", { class: "mt-1 text-sm font-medium text-flamingo-500" }, toDisplayString(loc.subtitle), 1)
                      ])
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-up-right",
                      class: "h-5 w-5 shrink-0 text-[var(--p-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-flamingo-500"
                    })
                  ]),
                  createVNode("div", { class: "mt-8 grid grid-cols-2 gap-3" }, [
                    createVNode("div", { class: "rounded-2xl bg-[var(--p-surface-sunken)] p-4" }, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Coverage"),
                      createVNode("p", { class: "mt-2 text-base font-semibold text-[var(--p-text)]" }, toDisplayString(loc.areaLabel), 1)
                    ]),
                    createVNode("div", { class: "rounded-2xl bg-[var(--p-surface-sunken)] p-4" }, [
                      createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, "Mapped shops"),
                      createVNode("p", { class: "mt-2 text-base font-semibold text-[var(--p-text)]" }, toDisplayString(loc.mappedShopsLabel), 1)
                    ])
                  ]),
                  createVNode("div", { class: "mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-3xl font-extrabold text-flamingo-500" }, toDisplayString(loc.printerCount), 1),
                      createVNode("p", { class: "mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]" }, " Printer" + toDisplayString(loc.printerCount === 1 ? "" : "s"), 1)
                    ]),
                    createVNode("span", { class: "inline-flex items-center gap-2 rounded-full bg-flamingo-500/12 px-3 py-1.5 text-xs font-semibold text-flamingo-500" }, [
                      createTextVNode(" Explore area "),
                      createVNode(_component_UIcon, {
                        name: "i-lucide-chevron-right",
                        class: "h-4 w-4"
                      })
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-12 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-map-pin",
          class: "mx-auto h-16 w-16 text-[var(--p-border)]"
        }, null, _parent));
        _push(`<h2 class="mt-4 text-lg font-medium text-[var(--p-text)]">No locations yet</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">Check back soon for location-based print shop listings.</p>`);
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
      _push(`<div class="mt-12 flex flex-wrap gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` All shops `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" All shops "),
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
        to: "/products",
        class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Browse products `);
          } else {
            return [
              createTextVNode(" Browse products ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><aside class="xl:sticky xl:top-24 xl:self-start"><div class="overflow-hidden rounded-[2rem] border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.24)]"><div class="border-b border-white/10 p-6"><p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Coverage map</p>`);
      if (unref(activeLocation)) {
        _push(`<!--[--><h2 class="mt-3 text-2xl font-bold">${ssrInterpolate(unref(activeLocation).name)}</h2><p class="mt-2 text-sm leading-6 text-slate-300">${ssrInterpolate(unref(activeLocation).printerCount)} printer${ssrInterpolate(unref(activeLocation).printerCount === 1 ? "" : "s")} active in ${ssrInterpolate(unref(activeLocation).name)}. Review regional shop presence before you open the area page. </p><!--]-->`);
      } else {
        _push(`<p class="mt-3 text-sm leading-6 text-slate-300">Select a location to preview its regional map coverage.</p>`);
      }
      _push(`</div>`);
      if (unref(activeLocation)) {
        _push(`<div class="p-4"><div class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900"><iframe${ssrRenderAttr("src", unref(activeLocation).mapEmbedUrl)} title="Google map of print shop locations" class="h-[22rem] w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4"><div class="flex items-center justify-between gap-3"><div><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Regional note</p><p class="mt-1 text-sm font-medium text-white">${ssrInterpolate(unref(activeLocation).subtitle)}</p></div><span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-xs font-semibold text-flamingo-400">${ssrInterpolate(unref(activeLocation).mappedShopsLabel)}</span></div><p class="mt-3 text-sm leading-6 text-slate-300">${ssrInterpolate(unref(activeLocation).mapNarrative)}</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/locations/${unref(activeLocation).slug}`,
          class: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-flamingo-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Open ${ssrInterpolate(unref(activeLocation).name)} `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Open " + toDisplayString(unref(activeLocation).name) + " ", 1),
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-COUf6k51.mjs.map
