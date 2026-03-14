import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { g as useToast, c as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_3 } from './ShopForm-99DmI3W_.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
import { u as useSellerStore } from './seller-BozDQWbD.mjs';
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
import './FormInput-BwqVsjAz.mjs';
import './Alert-Dt8CKxt0.mjs';
import './FormRichText-CJOuStKS.mjs';
import '@tiptap/vue-3';
import '@tiptap/starter-kit';
import '@tiptap/extension-placeholder';
import 'yup';
import './api-error-D1IYk86E.mjs';
import './seller-laoC9_qJ.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const shopStore = useShopStore();
    const sellerStore = useSellerStore();
    const toast = useToast();
    const saving = ref(false);
    async function onSubmit(data) {
      saving.value = true;
      try {
        const result = await shopStore.createShop(data);
        if (result.success && result.shop) {
          await sellerStore.fetchShops();
          toast.add({ title: "Shop created", color: "success" });
          await navigateTo(`/dashboard/shops/${result.shop.slug}/setup`);
        } else {
          toast.add({ title: "Error", description: shopStore.error ?? "Failed to create", color: "error" });
        }
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed to create", color: "error" });
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_ShopsShopForm = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Create shop",
        subtitle: "Add a new business listing"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/shops",
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
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/shops",
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">`);
      _push(ssrRenderComponent(_component_ShopsShopForm, {
        loading: unref(saving),
        error: unref(shopStore).error,
        onSubmit,
        onCancel: () => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/dashboard/shops")
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-CLAd9cHK.mjs.map
