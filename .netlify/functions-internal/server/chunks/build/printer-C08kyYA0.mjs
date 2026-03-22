import { a as _sfc_main$f, d as _sfc_main$9, _ as __nuxt_component_3$1, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_5 } from './DashboardModalForm-CK75m_2g.mjs';
import { _ as __nuxt_component_3 } from './ShopForm-BE_pDNNA.mjs';
import { defineComponent, ref, watch, nextTick, mergeProps, withCtx, createVNode, createTextVNode, isRef, unref, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
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
import './InfoCard-CqKU4D2I.mjs';
import './Alert-nALN31Ul.mjs';
import './FormSection-yFTKkshO.mjs';
import './Input-D98neQoC.mjs';
import './FieldHint-ZRUlwJL3.mjs';
import './InlineError-DcBNAnP_.mjs';
import './Textarea-m5qrWcEy.mjs';
import './LoadingButton-CX_axkrT.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "printer",
  __ssrInlineRender: true,
  setup(__props) {
    const shopStore = useShopStore();
    const notification = useNotification();
    const modalOpen = ref(false);
    const formReady = ref(false);
    const formLoading = ref(false);
    watch(modalOpen, (open) => {
      if (open) {
        formReady.value = false;
        nextTick(() => {
          formReady.value = true;
        });
      } else {
        formReady.value = false;
      }
    }, { immediate: true });
    function closeModal() {
      modalOpen.value = false;
    }
    async function onSubmit(data) {
      formLoading.value = true;
      try {
        const result = await shopStore.createShop(data);
        if (result.success && result.shop) {
          notification.success("Shop created! Add machines, then stock and prices.");
          closeModal();
          await navigateTo("/dashboard");
        } else {
          notification.error(shopStore.error ?? "Create failed");
        }
      } finally {
        formLoading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_DashboardModalForm = __nuxt_component_5;
      const _component_ShopsShopForm = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8" }, _attrs))}><div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-8 sm:p-10 text-center"><div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-flamingo-500 to-flamingo-700 text-white shadow-lg shadow-flamingo-500/25">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-store",
        class: "h-8 w-8"
      }, null, _parent));
      _push(`</div><h1 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white"> You&#39;re almost ready — create your print shop </h1><p class="mt-3 text-gray-600 dark:text-gray-400"> Set up your first shop to start receiving quotes and customers. It only takes a few minutes. </p><div class="mt-8">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "lg",
        onClick: ($event) => modalOpen.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-5 w-5 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Create Shop `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-5 w-5 mr-2"
              }),
              createTextVNode(" Create Shop ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="mt-4 text-sm text-gray-500 dark:text-gray-500">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "text-primary-600 hover:underline dark:text-primary-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Skip for now `);
          } else {
            return [
              createTextVNode(" Skip for now ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div>`);
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: "Create shop",
        description: "Add your first business listing to start receiving quotes."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(formReady)) {
              _push2(ssrRenderComponent(_component_ShopsShopForm, {
                loading: unref(formLoading),
                error: unref(shopStore).error,
                onSubmit,
                onCancel: closeModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(formReady) ? (openBlock(), createBlock(_component_ShopsShopForm, {
                key: 0,
                loading: unref(formLoading),
                error: unref(shopStore).error,
                onSubmit,
                onCancel: closeModal
              }, null, 8, ["loading", "error"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding/printer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=printer-C08kyYA0.mjs.map
