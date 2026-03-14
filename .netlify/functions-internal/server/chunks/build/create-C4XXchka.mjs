import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { f as useRoute, c as _sfc_main$9, n as navigateTo, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_2$1 } from './SectionCard-CE2OEmkZ.mjs';
import { F as Form, _ as __nuxt_component_1, a as Field } from './FormInput-BwqVsjAz.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createTextVNode, createVNode, ref, isRef, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './Checkbox-BX22gW7J.mjs';
import { object, string } from 'yup';
import { u as useQuoteStore } from './quote-Bl7wpgEV.mjs';
import { u as useNotification } from './useNotification-Dn_AzVKG.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FormTextarea",
  __ssrInlineRender: true,
  props: {
    name: {},
    label: {},
    placeholder: {},
    rows: { default: 4 },
    disabled: { type: Boolean },
    required: { type: Boolean },
    helper: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeField = Field;
      const _component_UIcon = _sfc_main$f;
      let _temp0;
      _push(ssrRenderComponent(_component_VeeField, mergeProps({
        name: __props.name,
        label: __props.label
      }, _attrs), {
        default: withCtx(({ field, errors }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><label${ssrRenderAttr("for", __props.name)} class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>${ssrInterpolate(__props.label)} `);
            if (__props.required) {
              _push2(`<span class="text-flamingo-500"${_scopeId}>*</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</label><textarea${ssrRenderAttrs(_temp0 = mergeProps(field, {
              id: __props.name,
              placeholder: __props.placeholder,
              rows: __props.rows,
              disabled: __props.disabled,
              class: ["w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-all hover:border-[var(--p-text-muted)] focus:border-flamingo-500 focus:bg-[var(--p-surface)] focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--p-surface-sunken)]", errors.length ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""]
            }), "textarea")}${_scopeId}>${ssrInterpolate("value" in _temp0 ? _temp0.value : "")}</textarea>`);
            if (__props.helper && !errors.length) {
              _push2(`<p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>${ssrInterpolate(__props.helper)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-1 min-h-[1.25rem]"${_scopeId}>`);
            if (errors.length) {
              _push2(`<p class="flex items-center gap-1 text-xs text-red-500"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-alert-circle",
                class: "h-3.5 w-3.5 shrink-0"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(errors[0])}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("label", {
                  for: __props.name,
                  class: "mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]"
                }, [
                  createTextVNode(toDisplayString(__props.label) + " ", 1),
                  __props.required ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-flamingo-500"
                  }, "*")) : createCommentVNode("", true)
                ], 8, ["for"]),
                createVNode("textarea", mergeProps(field, {
                  id: __props.name,
                  placeholder: __props.placeholder,
                  rows: __props.rows,
                  disabled: __props.disabled,
                  class: ["w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-all hover:border-[var(--p-text-muted)] focus:border-flamingo-500 focus:bg-[var(--p-surface)] focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--p-surface-sunken)]", errors.length ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""]
                }), null, 16, ["id", "placeholder", "rows", "disabled"]),
                __props.helper && !errors.length ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-1 text-xs text-[var(--p-text-muted)]"
                }, toDisplayString(__props.helper), 1)) : createCommentVNode("", true),
                createVNode("div", { class: "mt-1 min-h-[1.25rem]" }, [
                  errors.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "flex items-center gap-1 text-xs text-red-500"
                  }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-alert-circle",
                      class: "h-3.5 w-3.5 shrink-0"
                    }),
                    createTextVNode(" " + toDisplayString(errors[0]), 1)
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/FormTextarea.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$2, { __name: "FormsFormTextarea" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProductTemplateForm",
  __ssrInlineRender: true,
  props: {
    product: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isActive = ref(props.product?.is_active ?? true);
    const schema = object({
      name: string().required("Name is required"),
      description: string(),
      base_price: string().required("Base price is required"),
      unit: string().required("Unit is required")
    });
    const initialValues = computed(() => ({
      name: props.product?.name ?? "",
      description: props.product?.description ?? "",
      base_price: props.product?.base_price ?? "",
      unit: props.product?.unit ?? ""
    }));
    function onSubmit(values) {
      emit("submit", { ...values, is_active: isActive.value });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_1;
      const _component_FormsFormTextarea = __nuxt_component_2;
      const _component_UCheckbox = _sfc_main$3;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "name",
              label: "Name",
              placeholder: "Product name",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormTextarea, {
              name: "description",
              label: "Description",
              placeholder: "Description..."
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "base_price",
              label: "Base price",
              placeholder: "0.00",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "unit",
              label: "Unit",
              placeholder: "e.g. sheet, m²",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<label class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(isActive),
              "onUpdate:modelValue": ($event) => isRef(isActive) ? isActive.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-[var(--p-text-dim)]"${_scopeId}>Active</span></label><div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
              onClick: ($event) => _ctx.$emit("cancel")
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Cancel`);
                } else {
                  return [
                    createTextVNode("Cancel")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !meta.valid
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Save`);
                } else {
                  return [
                    createTextVNode("Save")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_FormsFormInput, {
                  name: "name",
                  label: "Name",
                  placeholder: "Product name",
                  required: ""
                }),
                createVNode(_component_FormsFormTextarea, {
                  name: "description",
                  label: "Description",
                  placeholder: "Description..."
                }),
                createVNode(_component_FormsFormInput, {
                  name: "base_price",
                  label: "Base price",
                  placeholder: "0.00",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "unit",
                  label: "Unit",
                  placeholder: "e.g. sheet, m²",
                  required: ""
                }),
                createVNode("label", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(isActive),
                    "onUpdate:modelValue": ($event) => isRef(isActive) ? isActive.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm text-[var(--p-text-dim)]" }, "Active")
                ]),
                createVNode("div", { class: "flex justify-end gap-2" }, [
                  createVNode(_component_UButton, {
                    variant: "outline",
                    onClick: ($event) => _ctx.$emit("cancel")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    color: "primary",
                    loading: __props.loading,
                    disabled: !meta.valid
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Save")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/products/ProductTemplateForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "ProductsProductTemplateForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const quoteStore = useQuoteStore();
    const notification = useNotification();
    const slug = computed(() => route.params.slug);
    function goBack() {
      navigateTo(`/dashboard/shops/${slug.value}/products`);
    }
    async function onSubmit(data) {
      const payload = {
        name: data.name,
        description: data.description ?? null,
        is_active: data.is_active ?? true,
        defaults: {
          ...data.base_price && { base_price: data.base_price },
          ...data.unit && { unit: data.unit }
        }
      };
      const result = await quoteStore.createProductTemplate(slug.value, payload);
      if (result.success && result.product) {
        notification.success("Product template created");
        await navigateTo(`/dashboard/shops/${slug.value}/products`);
      } else {
        notification.error(quoteStore.error ?? "Create failed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSectionCard = __nuxt_component_2$1;
      const _component_ProductsProductTemplateForm = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Add product template",
        subtitle: "Create a preset for quick quoting"
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/products`,
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
                to: `/dashboard/shops/${unref(slug)}/products`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="col-span-12">`);
      _push(ssrRenderComponent(_component_DashboardSectionCard, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ProductsProductTemplateForm, {
              loading: unref(quoteStore).loading,
              onSubmit,
              onCancel: goBack
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ProductsProductTemplateForm, {
                loading: unref(quoteStore).loading,
                onSubmit,
                onCancel: goBack
              }, null, 8, ["loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/products/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-C4XXchka.mjs.map
