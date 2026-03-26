import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, d as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_3 } from './ShopForm-D1VvaWR5.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-B7Z2gs_7.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { u as useSellerStore } from './seller-DvrkRojT.mjs';
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
import './FormSection-BF6FM0xo.mjs';
import './Alert-CI_a20A7.mjs';
import './Input-C14QBOm-.mjs';
import './FieldHint-i6LQE4WY.mjs';
import './InlineError-CDgd_EMb.mjs';
import './Textarea-C3ixaFu9.mjs';
import './LoadingButton-CX_axkrT.mjs';
import './seller-9NDANUZF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const notification = useNotification();
    const shopStore = useShopStore();
    const sellerStore = useSellerStore();
    const slug = computed(() => route.params.slug);
    function goBack() {
      navigateTo(`/dashboard/shops/${slug.value}`);
    }
    async function onSubmit(data) {
      const result = await shopStore.updateShop(slug.value, data);
      if (!result.success) {
        if (!shopStore.updateFieldErrors || Object.keys(shopStore.updateFieldErrors).length === 0) {
          notification.error(shopStore.error ?? "We could not update this shop right now.");
        }
        return;
      }
      notification.success("Shop profile updated successfully.");
      await sellerStore.fetchShops();
      await navigateTo(`/dashboard/shops/${slug.value}`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_ShopsShopForm = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Shop Profile",
        subtitle: "Edit the business details for this shop in a proper page, not a modal."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to workspace`);
                } else {
                  return [
                    createTextVNode("Back to workspace")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to workspace")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(shopStore).loading && !unref(shopStore).currentShop) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, { variant: "block" }, null, _parent));
      } else if (unref(shopStore).currentShop) {
        _push(`<div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">`);
        _push(ssrRenderComponent(_component_ShopsShopForm, {
          shop: unref(shopStore).currentShop,
          loading: unref(shopStore).loading,
          error: unref(shopStore).error,
          "field-errors": unref(shopStore).updateFieldErrors,
          onSubmit,
          onCancel: goBack
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=edit-hbf7nSfv.mjs.map
