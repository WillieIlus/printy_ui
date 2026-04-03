import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { b as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as _sfc_main$1 } from './FormField-DY4KZuoQ.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$3 } from './Input-Hudv-7BP.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, createVNode, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
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
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const sellerStore = useSellerStore();
    useNotification();
    const selectedShop = ref(null);
    const companyName = ref("");
    const contactName = ref("");
    const contactEmail = ref("");
    const contactPhone = ref("");
    const loading = ref(false);
    const shopOptions = computed(
      () => sellerStore.shops.map((shop) => ({
        value: shop.id,
        label: `${shop.name} (${shop.slug})`,
        slug: shop.slug
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UFormField = _sfc_main$1;
      const _component_USelectMenu = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Create Quote File",
        subtitle: "Start one grouped quote file for a person or company, then attach shop-specific quote sections."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              to: "/dashboard/quotes"
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
                variant: "soft",
                size: "sm",
                to: "/dashboard/quotes"
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
      _push(`<form class="max-w-2xl space-y-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Shop",
        required: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedShop),
              "onUpdate:modelValue": ($event) => isRef(selectedShop) ? selectedShop.value = $event : null,
              items: unref(shopOptions),
              "value-key": "value",
              placeholder: "Select initial shop section",
              class: "w-full"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelectMenu, {
                modelValue: unref(selectedShop),
                "onUpdate:modelValue": ($event) => isRef(selectedShop) ? selectedShop.value = $event : null,
                items: unref(shopOptions),
                "value-key": "value",
                placeholder: "Select initial shop section",
                class: "w-full"
              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Company / customer name",
        required: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(companyName),
              "onUpdate:modelValue": ($event) => isRef(companyName) ? companyName.value = $event : null,
              placeholder: "Acme Ltd or John Doe"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(companyName),
                "onUpdate:modelValue": ($event) => isRef(companyName) ? companyName.value = $event : null,
                placeholder: "Acme Ltd or John Doe"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, { label: "Contact name" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(contactName),
              "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
              placeholder: "Primary contact person"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(contactName),
                "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
                placeholder: "Primary contact person"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, { label: "Customer email" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(contactEmail),
              "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
              type: "email",
              placeholder: "contact@example.com"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(contactEmail),
                "onUpdate:modelValue": ($event) => isRef(contactEmail) ? contactEmail.value = $event : null,
                type: "email",
                placeholder: "contact@example.com"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UFormField, { label: "Customer phone" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(contactPhone),
              "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
              placeholder: "+254 700 000 000"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(contactPhone),
                "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
                placeholder: "+254 700 000 000"
              }, null, 8, ["modelValue", "onUpdate:modelValue"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        loading: unref(loading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create Quote File `);
          } else {
            return [
              createTextVNode(" Create Quote File ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        to: "/dashboard/quotes"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cancel`);
          } else {
            return [
              createTextVNode("Cancel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form>`);
      if (!unref(sellerStore).shops.length && !unref(sellerStore).loading) {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-store",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to create grouped quote files.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          to: "/dashboard/shops/create"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Create shop`);
            } else {
              return [
                createTextVNode("Create shop")
              ];
            }
          }),
          _: 1
        }, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/quotes/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-7SxNUDGd.mjs.map
