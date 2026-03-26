import { f as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as __nuxt_component_3$2 } from './EmptyState-CeDSO_D4.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { d as fetchSEOLocationProduct } from './seo-Dcr3aNUz.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[product]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const locationSlug = computed(() => route.params.location);
    const productSlug = computed(() => route.params.product);
    const data = ref(null);
    const loading = ref(true);
    async function load() {
      loading.value = true;
      try {
        data.value = await fetchSEOLocationProduct(locationSlug.value, productSlug.value);
      } catch {
        data.value = null;
      } finally {
        loading.value = false;
      }
    }
    watch([locationSlug, productSlug], load);
    usePrintySeo(() => ({
      title: data.value ? `${data.value.category.name} in ${data.value.location.name}` : "Print by location",
      description: data.value ? `Find ${data.value.category.name.toLowerCase()} printing in ${data.value.location.name}. Compare shops and get quotes.` : "Print products by location",
      path: `/locations/${locationSlug.value}/products/${productSlug.value}`,
      noIndex: !loading.value && !data.value,
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Shops", path: "/shops" },
        { name: data.value?.location?.name ?? locationSlug.value, path: `/locations/${locationSlug.value}` },
        { name: data.value?.category?.name ?? productSlug.value, path: `/locations/${locationSlug.value}/products/${productSlug.value}` }
      ]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_CommonEmptyState = __nuxt_component_3$2;
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
        class: "h-4 w-4"
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/locations/${unref(locationSlug)}`,
        class: "hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(data)?.location?.name ?? unref(locationSlug))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(data)?.location?.name ?? unref(locationSlug)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-chevron-right",
        class: "h-4 w-4"
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/products/${unref(productSlug)}`,
        class: "hover:text-[var(--p-text)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(data)?.category?.name ?? unref(productSlug))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(data)?.category?.name ?? unref(productSlug)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (!unref(data)) {
        _push(ssrRenderComponent(_component_CommonEmptyState, {
          title: "Page not found",
          description: "This location or product combination does not exist.",
          icon: "i-lucide-file-question"
        }, null, _parent));
      } else {
        _push(`<!--[--><h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">${ssrInterpolate(unref(data).category.name)} in ${ssrInterpolate(unref(data).location.name)}</h1><p class="mt-4 text-lg text-[var(--p-text-muted)]"> Find ${ssrInterpolate(unref(data).category.name.toLowerCase())} printing in ${ssrInterpolate(unref(data).location.name)}. Compare shops and get instant quotes. </p>`);
        if (unref(data).shops?.length) {
          _push(`<div class="mt-12 grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(unref(data).shops, (shop) => {
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
                  _push2(`</div><div class="min-w-0"${_scopeId}><h2 class="font-semibold text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(shop.name)}</h2><p class="text-sm text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(unref(data).category.name)} — View &amp; quote</p></div>`);
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-right",
                    class: "ml-auto h-5 w-5 text-[var(--p-text-muted)]"
                  }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-store",
                        class: "h-6 w-6 text-amber-600 dark:text-amber-400"
                      })
                    ]),
                    createVNode("div", { class: "min-w-0" }, [
                      createVNode("h2", { class: "font-semibold text-[var(--p-text)]" }, toDisplayString(shop.name), 1),
                      createVNode("p", { class: "text-sm text-[var(--p-text-muted)]" }, toDisplayString(unref(data).category.name) + " — View & quote", 1)
                    ]),
                    createVNode(_component_UIcon, {
                      name: "i-lucide-arrow-right",
                      class: "ml-auto h-5 w-5 text-[var(--p-text-muted)]"
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
            name: "i-lucide-package",
            class: "mx-auto h-16 w-16 text-[var(--p-border)]"
          }, null, _parent));
          _push(`<h2 class="mt-4 text-lg font-medium text-[var(--p-text)]">No shops yet</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"> No shops in ${ssrInterpolate(unref(data).location.name)} offer ${ssrInterpolate(unref(data).category.name.toLowerCase())} yet. </p><div class="mt-6 flex flex-wrap justify-center gap-4">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/locations/${unref(locationSlug)}`,
            class: "btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Shops in ${ssrInterpolate(unref(data).location.name)}`);
              } else {
                return [
                  createTextVNode(" Shops in " + toDisplayString(unref(data).location.name), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/gallery",
            class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] px-6 py-3 text-sm font-semibold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Browse all products `);
              } else {
                return [
                  createTextVNode(" Browse all products ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        }
        _push(`<div class="mt-12 flex flex-wrap gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/products/${unref(productSlug)}`,
          class: "btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(data).category.name)} everywhere `);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(toDisplayString(unref(data).category.name) + " everywhere ", 1),
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
          to: `/locations/${unref(locationSlug)}`,
          class: "inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] px-6 py-3.5 text-sm font-semibold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` More in ${ssrInterpolate(unref(data).location.name)}`);
            } else {
              return [
                createTextVNode(" More in " + toDisplayString(unref(data).location.name), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/locations/[location]/products/[product].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_product_-53UH0f18.mjs.map
