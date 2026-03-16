import { _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as usePrintySeo } from './usePrintySeo-Dsj3z4wM.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const locations = ref([]);
    const loading = ref(true);
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
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-bg)]" }, _attrs))}><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"><nav class="mb-8 flex items-center gap-2 text-sm text-[var(--p-text-muted)]">`);
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
      _push(`<span class="text-[var(--p-text)]">Locations</span></nav><h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl"> Print shops by location </h1><p class="mt-4 text-lg text-[var(--p-text-muted)]"> Find print shops near you. Browse by city or neighborhood to compare business cards, flyers, posters, and more. </p>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(locations).length) {
        _push(`<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(locations), (loc) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: loc.slug,
            to: `/locations/${loc.slug}`,
            class: "flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-map-pin",
                  class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h2 class="font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(loc.name)}</h2><p class="text-sm text-[var(--p-text-muted)] capitalize"${_scopeId}>${ssrInterpolate(loc.location_type)}</p></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-arrow-right",
                  class: "h-5 w-5 shrink-0 text-[var(--p-text-muted)]"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-map-pin",
                      class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                    })
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("h2", { class: "font-semibold text-[var(--p-text)]" }, toDisplayString(loc.name), 1),
                    createVNode("p", { class: "text-sm text-[var(--p-text-muted)] capitalize" }, toDisplayString(loc.location_type), 1)
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
      _push(`</div></div></div>`);
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
//# sourceMappingURL=index-BV_le6dt.mjs.map
