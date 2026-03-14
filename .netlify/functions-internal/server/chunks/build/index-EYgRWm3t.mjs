import { c as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-DKHttVBV.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { b as formatKES } from './formatters-C4IR8tCh.mjs';
import { u as useLocalQuotesStore } from './localQuotes-D2lGtMae.mjs';
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
    const localQuotesStore = useLocalQuotesStore();
    const quotes = computed(() => localQuotesStore.quotes);
    function openPrint(id) {
      (void 0).open(`/quote/print?id=${encodeURIComponent(id)}`, "_blank");
    }
    function confirmDelete(q) {
      if (confirm(`Delete quote for ${q.shopName}?`)) {
        localQuotesStore.removeQuote(q.id);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto p-6 space-y-6" }, _attrs))}><div class="flex justify-between items-center"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Quotes</h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/shops",
        variant: "outline",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Browse Shops`);
          } else {
            return [
              createTextVNode("Browse Shops")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="text-gray-600 dark:text-gray-400"> Quotes saved locally. Visit a shop page to create and save new quotes. </p>`);
      if (!unref(quotes).length) {
        _push(`<div class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-text",
          class: "w-12 h-12 text-gray-400 mx-auto mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-600 dark:text-gray-400">No quotes yet</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/shops",
          class: "mt-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Find a shop to quote`);
            } else {
              return [
                createTextVNode("Find a shop to quote")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(quotes), (q) => {
          _push(ssrRenderComponent(_component_UCard, {
            key: q.id,
            class: "hover:shadow-md transition-shadow"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex justify-between items-start gap-4"${_scopeId}><div${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(q.shopName)}</h3><p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(q.snapshot.sheetSize)} ${ssrInterpolate(q.snapshot.gsm)}gsm · ${ssrInterpolate(q.snapshot.quantity)} sheets </p><p class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2"${_scopeId}>${ssrInterpolate(unref(formatKES)(q.suggestedPrice))}</p></div><div class="flex gap-2 shrink-0"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "outline",
                  size: "sm",
                  onClick: ($event) => openPrint(q.id)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Export PDF `);
                    } else {
                      return [
                        createTextVNode(" Export PDF ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "error",
                  size: "sm",
                  onClick: ($event) => confirmDelete(q)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Delete `);
                    } else {
                      return [
                        createTextVNode(" Delete ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex justify-between items-start gap-4" }, [
                    createVNode("div", null, [
                      createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, toDisplayString(q.shopName), 1),
                      createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400 mt-0.5" }, toDisplayString(q.snapshot.sheetSize) + " " + toDisplayString(q.snapshot.gsm) + "gsm · " + toDisplayString(q.snapshot.quantity) + " sheets ", 1),
                      createVNode("p", { class: "text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2" }, toDisplayString(unref(formatKES)(q.suggestedPrice)), 1)
                    ]),
                    createVNode("div", { class: "flex gap-2 shrink-0" }, [
                      createVNode(_component_UButton, {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => openPrint(q.id)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Export PDF ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "error",
                        size: "sm",
                        onClick: ($event) => confirmDelete(q)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Delete ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-EYgRWm3t.mjs.map
