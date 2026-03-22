import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { g as useRoute, s as useRouter, h as useToast, e as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_3$1 } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_5$1 } from './DashboardModalForm-DxuRCbSc.mjs';
import { _ as __nuxt_component_3$2 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Alert-RLPfncBZ.mjs';
import { _ as __nuxt_component_3$3 } from './ShopForm-C9IX-G4S.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
import { u as useShopStore } from './shop-3BUogFP6.mjs';
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
import './InfoCard-K1X9VF5P.mjs';
import './Input-DA2ySSK8.mjs';
import './FieldHint-ZRUlwJL3.mjs';
import './InlineError-DcBNAnP_.mjs';
import './Textarea-D4hEpwmG.mjs';
import './LoadingButton-CZOYt8xS.mjs';
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const sellerStore = useSellerStore();
    const shopStore = useShopStore();
    const toast = useToast();
    const editModalOpen = ref(false);
    function openEditModal(slug) {
      router.replace({ path: "/dashboard/shops", query: { edit: slug } });
    }
    function closeEditModal() {
      editModalOpen.value = false;
    }
    async function onEditSubmit(data) {
      const editSlug = route.query.edit;
      if (!editSlug) return;
      const result = await shopStore.updateShop(editSlug, data);
      if (result.success) {
        toast.add({ title: "Shop updated", color: "success" });
        closeEditModal();
        await sellerStore.fetchShops();
      } else {
        toast.add({ title: "Error", description: shopStore.error ?? "Failed to update", color: "error" });
      }
    }
    watch(
      () => route.query.edit,
      async (editSlug) => {
        if (editSlug) {
          await shopStore.fetchShopBySlug(editSlug);
          editModalOpen.value = true;
        } else {
          editModalOpen.value = false;
        }
      },
      { immediate: true }
    );
    watch(editModalOpen, (open) => {
      if (!open && route.query.edit) {
        const q = { ...route.query };
        delete q.edit;
        router.replace({ path: "/dashboard/shops", query: q });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_CommonLoadingSpinner = __nuxt_component_3$2;
      const _component_UAlert = _sfc_main$1;
      const _component_ShopsShopForm = __nuxt_component_3$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "My Shops",
        subtitle: "Manage your business listings"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/shops/create",
              color: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add New Shop `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Add New Shop ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/shops/create",
                color: "primary"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Add New Shop ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(sellerStore).loading) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 6
        }, null, _parent));
      } else if (unref(sellerStore).shops.length) {
        _push(`<div class="col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"><!--[-->`);
        ssrRenderList(unref(sellerStore).shops, (shop) => {
          _push(`<div class="group relative flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/50 dark:hover:bg-flamingo-900/20">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/dashboard/shops/${shop.slug}/setup`,
            class: "flex min-w-0 flex-1 items-center gap-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-store",
                  class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="min-w-0 flex-1"${_scopeId}><h3 class="font-semibold text-gray-900 dark:text-white truncate"${_scopeId}>${ssrInterpolate(shop.name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400"${_scopeId}>/${ssrInterpolate(shop.slug)}</p></div>`);
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-chevron-right",
                  class: "h-5 w-5 text-gray-400 shrink-0"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode("div", { class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-store",
                      class: "h-6 w-6 text-flamingo-600 dark:text-flamingo-400"
                    })
                  ]),
                  createVNode("div", { class: "min-w-0 flex-1" }, [
                    createVNode("h3", { class: "font-semibold text-gray-900 dark:text-white truncate" }, toDisplayString(shop.name), 1),
                    createVNode("p", { class: "text-sm text-gray-500 dark:text-gray-400" }, "/" + toDisplayString(shop.slug), 1)
                  ]),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-chevron-right",
                    class: "h-5 w-5 text-gray-400 shrink-0"
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            icon: "i-lucide-pencil",
            "aria-label": "Edit shop",
            class: "shrink-0 opacity-70 group-hover:opacity-100",
            onClick: ($event) => openEditModal(shop.slug)
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="col-span-12">`);
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No shops yet",
          description: "Create your first shop to start receiving quotes and customers.",
          icon: "i-lucide-store"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                to: "/dashboard/shops/create",
                color: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Create Your First Shop`);
                  } else {
                    return [
                      createTextVNode("Create Your First Shop")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  to: "/dashboard/shops/create",
                  color: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Create Your First Shop")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(editModalOpen),
        "onUpdate:modelValue": ($event) => isRef(editModalOpen) ? editModalOpen.value = $event : null,
        title: "Edit shop",
        description: "Update your shop details."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(editModalOpen) && unref(shopStore).loading && !unref(shopStore).currentShop) {
              _push2(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent2, _scopeId));
            } else if (unref(editModalOpen) && unref(shopStore).error && !unref(shopStore).currentShop) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: unref(shopStore).error,
                icon: "i-lucide-alert-circle",
                class: "mb-4"
              }, {
                description: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="mt-2 text-sm"${_scopeId2}>The shop may not exist or the backend may not support slug-based lookup yet.</p>`);
                    _push3(ssrRenderComponent(_component_UButton, {
                      variant: "soft",
                      size: "sm",
                      class: "mt-2",
                      onClick: closeEditModal
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Close`);
                        } else {
                          return [
                            createTextVNode("Close")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("p", { class: "mt-2 text-sm" }, "The shop may not exist or the backend may not support slug-based lookup yet."),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        size: "sm",
                        class: "mt-2",
                        onClick: closeEditModal
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Close")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(editModalOpen) && unref(shopStore).currentShop) {
              _push2(ssrRenderComponent(_component_ShopsShopForm, {
                key: unref(shopStore).currentShop?.id ?? "edit",
                shop: unref(shopStore).currentShop,
                loading: unref(shopStore).loading,
                error: unref(shopStore).error,
                onSubmit: onEditSubmit,
                onCancel: closeEditModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(editModalOpen) && unref(shopStore).loading && !unref(shopStore).currentShop ? (openBlock(), createBlock(_component_CommonLoadingSpinner, { key: 0 })) : unref(editModalOpen) && unref(shopStore).error && !unref(shopStore).currentShop ? (openBlock(), createBlock(_component_UAlert, {
                key: 1,
                color: "error",
                variant: "soft",
                title: unref(shopStore).error,
                icon: "i-lucide-alert-circle",
                class: "mb-4"
              }, {
                description: withCtx(() => [
                  createVNode("p", { class: "mt-2 text-sm" }, "The shop may not exist or the backend may not support slug-based lookup yet."),
                  createVNode(_component_UButton, {
                    variant: "soft",
                    size: "sm",
                    class: "mt-2",
                    onClick: closeEditModal
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Close")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["title"])) : unref(editModalOpen) && unref(shopStore).currentShop ? (openBlock(), createBlock(_component_ShopsShopForm, {
                key: unref(shopStore).currentShop?.id ?? "edit",
                shop: unref(shopStore).currentShop,
                loading: unref(shopStore).loading,
                error: unref(shopStore).error,
                onSubmit: onEditSubmit,
                onCancel: closeEditModal
              }, null, 8, ["shop", "loading", "error"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-eL7XVGqV.mjs.map
