import { _ as __nuxt_component_0$1 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, d as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_4$1 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as _sfc_main$3 } from './Card-D3ia-hWt.mjs';
import { _ as _sfc_main$4 } from './Badge-DRRvJchD.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, renderSlot, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { u as useQuoteStore } from './quote-BBvP7CpN.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "QuoteCard",
  __ssrInlineRender: true,
  props: {
    quote: {}
  },
  setup(__props) {
    const props = __props;
    const statusColor = computed(() => {
      const m = {
        draft: "neutral",
        pending: "warning",
        approved: "success",
        rejected: "error",
        completed: "success"
      };
      return m[props.quote.status] ?? "neutral";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "hover:shadow-lg transition-shadow" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><div class="flex justify-between items-start"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>#${ssrInterpolate(__props.quote.id)} ${ssrInterpolate(__props.quote.customer_name)}</h3>`);
            _push2(ssrRenderComponent(_component_UBadge, {
              color: unref(statusColor),
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.quote.status)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.quote.status), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(__props.quote.customer_email)}</p><p class="text-lg font-bold text-gray-900 dark:text-white"${_scopeId}>Total: ${ssrInterpolate(__props.quote.total)}</p>`);
            ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("div", { class: "flex justify-between items-start" }, [
                  createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, "#" + toDisplayString(__props.quote.id) + " " + toDisplayString(__props.quote.customer_name), 1),
                  createVNode(_component_UBadge, {
                    color: unref(statusColor),
                    variant: "soft",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.quote.status), 1)
                    ]),
                    _: 1
                  }, 8, ["color"])
                ]),
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(__props.quote.customer_email), 1),
                createVNode("p", { class: "text-lg font-bold text-gray-900 dark:text-white" }, "Total: " + toDisplayString(__props.quote.total), 1),
                renderSlot(_ctx.$slots, "actions")
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "QuotesQuoteCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteList",
  __ssrInlineRender: true,
  props: {
    quotes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesQuoteCard = __nuxt_component_0;
      const _component_DashboardEmptyState = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (__props.quotes?.length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(__props.quotes, (q) => {
          _push(ssrRenderComponent(_component_QuotesQuoteCard, {
            key: q.id,
            quote: q
          }, {
            actions: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, "card-actions", { quote: q }, null, _push2, _parent2, _scopeId);
              } else {
                return [
                  renderSlot(_ctx.$slots, "card-actions", { quote: q })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No incoming requests",
          description: "New quote requests from customers will appear here when they submit.",
          icon: "i-lucide-file-text"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "empty-actions", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "empty-actions")
              ];
            }
          }),
          _: 3
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "QuotesQuoteList" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useShopStore();
    const quoteStore = useQuoteStore();
    const slug = computed(() => route.params.slug);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_4$1;
      const _component_QuotesQuoteList = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Incoming Requests",
        subtitle: "Quote requests from customers. Send a quote or decline."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
              variant: "soft",
              size: "sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back`);
                } else {
                  return [
                    createTextVNode("Back")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/quotes/create`,
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Send Quote `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Send Quote ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes/create`,
                color: "primary"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Send Quote ")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(quoteStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 6
        }, null, _parent));
      } else {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_QuotesQuoteList, {
          quotes: unref(quoteStore).quotes
        }, {
          "card-actions": withCtx(({ quote }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes/${quote.id}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`View`);
                  } else {
                    return [
                      createTextVNode("View")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/quotes/${quote.id}`,
                  variant: "soft",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode("View")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          "empty-actions": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/quotes/create`,
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Send Quote`);
                  } else {
                    return [
                      createTextVNode("Send Quote")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/quotes/create`,
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Send Quote")
                  ]),
                  _: 1
                }, 8, ["to"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/quotes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DZ7NNntk.mjs.map
