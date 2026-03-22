import { _ as __nuxt_component_0$1 } from './DashboardPageHeader-CNDLBEHT.mjs';
import { g as useRoute, d as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$3 } from './Card-rEZVds4M.mjs';
import { _ as _sfc_main$4 } from './Badge-DzyqaO77.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, renderSlot, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
import { u as useQuoteStore } from './quote-AqUrOX8l.mjs';
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
  __name: "ProductTemplateCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    const props = __props;
    const priceLabel = computed(() => {
      const p = props.product;
      const price = p.base_price ?? p.defaults?.base_price;
      const unit = p.unit ?? p.defaults?.unit;
      if (price && unit) return `${price} / ${unit}`;
      if (price) return String(price);
      return null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UCard = _sfc_main$3;
      const _component_UBadge = _sfc_main$4;
      _push(ssrRenderComponent(_component_UCard, mergeProps({ class: "hover:shadow-lg transition-shadow" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(__props.product.name)}</h3>`);
            if (__props.product.description) {
              _push2(`<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"${_scopeId}>${ssrInterpolate(__props.product.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(priceLabel)) {
              _push2(`<p class="font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(unref(priceLabel))}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (!__props.product.is_active) {
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "neutral",
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Inactive`);
                  } else {
                    return [
                      createTextVNode("Inactive")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white" }, toDisplayString(__props.product.name), 1),
                __props.product.description ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                }, toDisplayString(__props.product.description), 1)) : createCommentVNode("", true),
                unref(priceLabel) ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "font-medium text-gray-900 dark:text-white"
                }, toDisplayString(unref(priceLabel)), 1)) : createCommentVNode("", true),
                !__props.product.is_active ? (openBlock(), createBlock(_component_UBadge, {
                  key: 2,
                  color: "neutral",
                  variant: "soft",
                  size: "sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Inactive")
                  ]),
                  _: 1
                })) : createCommentVNode("", true),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/products/ProductTemplateCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "ProductsProductTemplateCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProductTemplateList",
  __ssrInlineRender: true,
  props: {
    products: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductsProductTemplateCard = __nuxt_component_0;
      const _component_DashboardEmptyState = __nuxt_component_5;
      if (__props.products?.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, _attrs))}><!--[-->`);
        ssrRenderList(__props.products, (p) => {
          _push(ssrRenderComponent(_component_ProductsProductTemplateCard, {
            key: p.id,
            product: p
          }, {
            actions: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, "card-actions", { product: p }, null, _push2, _parent2, _scopeId);
              } else {
                return [
                  renderSlot(_ctx.$slots, "card-actions", { product: p })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, mergeProps({
          title: "No product templates yet",
          description: "Add product templates to speed up quoting.",
          icon: "i-lucide-package"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "empty", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "empty")
              ];
            }
          }),
          _: 3
        }, _parent));
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/products/ProductTemplateList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "ProductsProductTemplateList" });
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
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_ProductsProductTemplateList = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Product templates",
        subtitle: "Presets for quick quoting"
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
              to: `/dashboard/shops/${unref(slug)}/products/create`,
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add product `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Add product ")
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
                to: `/dashboard/shops/${unref(slug)}/products/create`,
                color: "primary"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Add product ")
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
        _push(ssrRenderComponent(_component_ProductsProductTemplateList, {
          products: unref(quoteStore).productTemplates
        }, {
          "card-actions": withCtx(({ product }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/products/${product.id}`,
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
                  to: `/dashboard/shops/${unref(slug)}/products/${product.id}`,
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
          empty: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/products/create`,
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add first product`);
                  } else {
                    return [
                      createTextVNode("Add first product")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: `/dashboard/shops/${unref(slug)}/products/create`,
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Add first product")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/products/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BKTO9vuj.mjs.map
