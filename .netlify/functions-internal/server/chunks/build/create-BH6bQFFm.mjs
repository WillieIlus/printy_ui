import { _ as __nuxt_component_0 } from './DashboardPageHeader-CNDLBEHT.mjs';
import { d as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2 } from './FormSection-yFTKkshO.mjs';
import { _ as __nuxt_component_3 } from './ShopForm-BE_pDNNA.mjs';
import { _ as __nuxt_component_11 } from './InfoCard-CqKU4D2I.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
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
import './Alert-nALN31Ul.mjs';
import './Input-D98neQoC.mjs';
import './FieldHint-ZRUlwJL3.mjs';
import './InlineError-DcBNAnP_.mjs';
import './Textarea-m5qrWcEy.mjs';
import './LoadingButton-CX_axkrT.mjs';
import './seller-B-6aM_bM.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const notification = useNotification();
    const shopStore = useShopStore();
    const sellerStore = useSellerStore();
    const saving = ref(false);
    async function onSubmit(data) {
      saving.value = true;
      try {
        const result = await shopStore.createShop(data);
        if (!result.success || !result.shop) {
          notification.error(shopStore.error ?? "Shop creation failed. The backend may only support basic shop workspace fields right now.");
          return;
        }
        await sellerStore.fetchShops();
        notification.success(`"${result.shop.name}" workspace created. Contact and address details still need backend persistence, but you can continue with setup now.`);
        await navigateTo(`/dashboard/shops/${result.shop.slug}/setup`);
      } catch (error) {
        notification.error(error instanceof Error ? error.message : "Shop creation failed unexpectedly. Please try again.");
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_ShopsShopForm = __nuxt_component_3;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Register a Print Shop",
        subtitle: "Create the business workspace first, then continue with machines, stock papers, parent sheet defaults, and product setup."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: "/dashboard/shops",
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to Shops`);
                } else {
                  return [
                    createTextVNode("Back to Shops")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: "/dashboard/shops",
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to Shops")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Shop Details",
        description: "Give Printy the details it needs to guide production, location confidence, and setup reminders."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ShopsShopForm, {
              loading: unref(saving),
              error: unref(shopStore).error,
              onSubmit,
              onCancel: () => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/dashboard/shops")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ShopsShopForm, {
                loading: unref(saving),
                error: unref(shopStore).error,
                onSubmit,
                onCancel: () => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/dashboard/shops")
              }, null, 8, ["loading", "error", "onCancel"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "What happens next",
        description: "After you save the shop, Printy will take you straight into setup so you can add machines, parent sheets, and the first sellable products.",
        icon: "i-lucide-route",
        tone: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Current backend support",
        description: "The current shop-create API reliably saves the workspace name and slug. Contact and address fields are collected here for a fuller setup flow, but backend persistence for those fields still needs support.",
        icon: "i-lucide-server",
        tone: "orange"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Kenyan address examples",
        description: "County: Nairobi. Town / Area: Westlands. Street / Building: Muthithi Road, Madonna House, 2nd Floor. Landmark: Opposite Sarit Centre.",
        icon: "i-lucide-map"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Manual address entry always works",
        description: "Even if map search is unavailable, you can still create the shop with county, area, street/building, and an optional landmark or postal code.",
        icon: "i-lucide-map-pinned",
        tone: "orange"
      }, null, _parent));
      _push(`</div></div></div>`);
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
//# sourceMappingURL=create-BH6bQFFm.mjs.map
