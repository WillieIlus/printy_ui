import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, j as useToast, d as _sfc_main$9, a as _sfc_main$f, H as extractApiFeedback } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6$1 } from './AdminWorkspaceFormPanel-MfBDvykR.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-opqohhBW.mjs';
import { _ as _sfc_main$4 } from './Alert-CI_a20A7.mjs';
import { _ as __nuxt_component_4$1 } from './FormSelect-TZT0cZMX.mjs';
import { _ as __nuxt_component_4$2 } from './InlineError-CDgd_EMb.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { u as usePricingStore } from './pricing-BwHzPGP8.mjs';
import { u as useMachineStore } from './machine-fWdswZHZ.mjs';
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
import './formUi-UcrM_3uE.mjs';
import './SelectMenu-C6Eyp_GI.mjs';
import './Input-C14QBOm-.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PrintingPriceForm",
  __ssrInlineRender: true,
  props: {
    price: {},
    machineOptions: {},
    loading: { type: Boolean },
    errorMessage: {},
    fieldErrors: {}
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const editing = computed(() => !!props.price);
    const sheetSizeOptions = [
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "SRA3", value: "SRA3" },
      { label: "A2", value: "A2" },
      { label: "A1", value: "A1" },
      { label: "A0", value: "A0" },
      { label: "Custom", value: "CUSTOM" }
    ];
    const colorModeOptions = [
      { label: "Black & White", value: "BW" },
      { label: "Full Color", value: "COLOR" }
    ];
    const initialValues = computed(() => ({
      machine: props.price?.machine ?? "",
      sheet_size: props.price?.sheet_size ?? "A4",
      color_mode: props.price?.color_mode ?? "COLOR",
      selling_price_per_side: props.price?.selling_price_per_side ?? "",
      selling_price_duplex_per_sheet: props.price?.selling_price_duplex_per_sheet ?? "",
      buying_price_per_side: props.price?.buying_price_per_side ?? ""
    }));
    const schema = object({
      machine: number().required("Machine is required"),
      sheet_size: string().oneOf(["A4", "A3", "SRA3", "A2", "A1", "A0", "CUSTOM"]).required("Size is required"),
      color_mode: string().oneOf(["BW", "COLOR"]).required("Color mode is required"),
      selling_price_per_side: string().required("Selling price is required"),
      selling_price_duplex_per_sheet: string().optional().nullable(),
      buying_price_per_side: string().optional()
    });
    function fieldError(field) {
      return props.fieldErrors?.[field] ?? null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$4;
      const _component_FormsFormSelect = __nuxt_component_4$1;
      const _component_DashboardInlineError = __nuxt_component_4$2;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save printing price",
                description: __props.errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-[var(--p-border-dim)]"${_scopeId}><tr${_scopeId}><td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Machine</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "machine",
              label: "Machine",
              options: __props.machineOptions,
              placeholder: "Select machine",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("machine")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Sheet Size</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "sheet_size",
              label: "Sheet Size",
              options: sheetSizeOptions,
              placeholder: "Select size",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("sheet_size")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Color Mode</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "color_mode",
              label: "Color Mode",
              options: colorModeOptions,
              placeholder: "Select color",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("color_mode")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Selling Price (per side)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_per_side",
              label: "Selling Price (per side)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("selling_price_per_side")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Selling Price (duplex per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_duplex_per_sheet",
              label: "Selling Price (duplex per sheet)",
              type: "number",
              placeholder: "0.00 (optional override)",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("selling_price_duplex_per_sheet")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Buying Price (per side)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price_per_side",
              label: "Buying Price (per side)",
              type: "number",
              placeholder: "0.00 (optional)",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("buying_price_per_side")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr></tbody></table></div><div class="mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
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
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !meta.valid
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Printing Price")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Printing Price"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                __props.errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "soft",
                  title: "Could not save printing price",
                  description: __props.errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode("table", { class: "w-full text-sm" }, [
                  createVNode("tbody", { class: "divide-y divide-[var(--p-border-dim)]" }, [
                    createVNode("tr", null, [
                      createVNode("td", { class: "w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Machine"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormSelect, {
                          name: "machine",
                          label: "Machine",
                          options: __props.machineOptions,
                          placeholder: "Select machine",
                          required: "",
                          "hide-label": ""
                        }, null, 8, ["options"]),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("machine")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Sheet Size"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormSelect, {
                          name: "sheet_size",
                          label: "Sheet Size",
                          options: sheetSizeOptions,
                          placeholder: "Select size",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("sheet_size")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Color Mode"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormSelect, {
                          name: "color_mode",
                          label: "Color Mode",
                          options: colorModeOptions,
                          placeholder: "Select color",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("color_mode")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Selling Price (per side)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "selling_price_per_side",
                          label: "Selling Price (per side)",
                          type: "number",
                          placeholder: "0.00",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("selling_price_per_side")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Selling Price (duplex per sheet)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "selling_price_duplex_per_sheet",
                          label: "Selling Price (duplex per sheet)",
                          type: "number",
                          placeholder: "0.00 (optional override)",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("selling_price_duplex_per_sheet")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Buying Price (per side)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "buying_price_per_side",
                          label: "Buying Price (per side)",
                          type: "number",
                          placeholder: "0.00 (optional)",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("buying_price_per_side")
                        }, null, 8, ["message"])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: ($event) => _ctx.$emit("cancel")
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  type: "submit",
                  color: "primary",
                  loading: __props.loading,
                  disabled: !meta.valid
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Printing Price"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/PrintingPriceForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$3, { __name: "PricingPrintingPriceForm" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MaterialPriceForm",
  __ssrInlineRender: true,
  props: {
    price: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const editing = computed(() => !!props.price);
    const materialTypeOptions = [
      { label: "Banner", value: "BANNER" },
      { label: "Vinyl", value: "VINYL" },
      { label: "Reflective", value: "REFLECTIVE" },
      { label: "Canvas", value: "CANVAS" },
      { label: "Mesh", value: "MESH" }
    ];
    const unitOptions = [
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "SRA3", value: "SRA3" },
      { label: "SQM", value: "SQM" }
    ];
    const initialValues = computed(() => ({
      material_type: props.price?.material_type ?? "BANNER",
      unit: props.price?.unit ?? "SQM",
      selling_price: props.price?.selling_price ?? "",
      buying_price: props.price?.buying_price ?? ""
    }));
    const schema = object({
      material_type: string().oneOf(["BANNER", "VINYL", "REFLECTIVE", "CANVAS", "MESH"]).required("Material type is required"),
      unit: string().oneOf(["A4", "A3", "SRA3", "SQM"]).required("Unit is required"),
      selling_price: string().required("Selling price is required"),
      buying_price: string().optional().nullable()
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormSelect = __nuxt_component_4$1;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40"${_scopeId}>Material Type</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "material_type",
              label: "Material Type",
              options: materialTypeOptions,
              placeholder: "Select material",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Unit</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "unit",
              label: "Unit",
              options: unitOptions,
              placeholder: "Select unit",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Selling Price</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price",
              label: "Selling Price",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Buying Price</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price",
              label: "Buying Price",
              type: "number",
              placeholder: "0.00 (optional)",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr></tbody></table><div class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"${_scopeId}>`);
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
                  _push3(`${ssrInterpolate(unref(editing) ? "Update" : "Add")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Update" : "Add"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("table", { class: "w-full text-sm" }, [
                createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40" }, "Material Type"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "material_type",
                        label: "Material Type",
                        options: materialTypeOptions,
                        placeholder: "Select material",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Unit"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "unit",
                        label: "Unit",
                        options: unitOptions,
                        placeholder: "Select unit",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Selling Price"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "selling_price",
                        label: "Selling Price",
                        type: "number",
                        placeholder: "0.00",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Buying Price"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "buying_price",
                        label: "Buying Price",
                        type: "number",
                        placeholder: "0.00 (optional)",
                        "hide-label": ""
                      })
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700" }, [
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
                    createTextVNode(toDisplayString(unref(editing) ? "Update" : "Add"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/MaterialPriceForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$2, { __name: "PricingMaterialPriceForm" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VolumeDiscountForm",
  __ssrInlineRender: true,
  props: {
    discount: {},
    loading: { type: Boolean },
    errorMessage: {},
    fieldErrors: {}
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const editing = computed(() => !!props.discount);
    const initialValues = computed(() => ({
      name: props.discount?.name ?? "",
      min_quantity: props.discount?.min_quantity ?? 100,
      discount_percent: props.discount?.discount_percent ?? "10"
    }));
    const schema = object({
      name: string().required("Name is required"),
      min_quantity: number().min(1, "Min 1").required("Minimum quantity is required"),
      discount_percent: string().required("Discount % is required")
    });
    function fieldError(field) {
      return props.fieldErrors?.[field] ?? null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$4;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_DashboardInlineError = __nuxt_component_4$2;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save volume discount",
                description: __props.errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-[var(--p-border-dim)]"${_scopeId}><tr${_scopeId}><td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Discount Name</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "name",
              label: "Discount Name",
              placeholder: "e.g. Bulk Order 10% Off",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("name")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Minimum Quantity</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "min_quantity",
              label: "Minimum Quantity",
              type: "number",
              placeholder: "e.g. 100",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("min_quantity")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Discount %</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "discount_percent",
              label: "Discount %",
              type: "number",
              placeholder: "e.g. 10",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("discount_percent")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr></tbody></table></div><div class="mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
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
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !meta.valid
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Discount")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Discount"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                __props.errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 0,
                  color: "error",
                  variant: "soft",
                  title: "Could not save volume discount",
                  description: __props.errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode("table", { class: "w-full text-sm" }, [
                  createVNode("tbody", { class: "divide-y divide-[var(--p-border-dim)]" }, [
                    createVNode("tr", null, [
                      createVNode("td", { class: "w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Discount Name"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "name",
                          label: "Discount Name",
                          placeholder: "e.g. Bulk Order 10% Off",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("name")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Minimum Quantity"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "min_quantity",
                          label: "Minimum Quantity",
                          type: "number",
                          placeholder: "e.g. 100",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("min_quantity")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Discount %"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "discount_percent",
                          label: "Discount %",
                          type: "number",
                          placeholder: "e.g. 10",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("discount_percent")
                        }, null, 8, ["message"])
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: ($event) => _ctx.$emit("cancel")
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  type: "submit",
                  color: "primary",
                  loading: __props.loading,
                  disabled: !meta.valid
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Discount"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/VolumeDiscountForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$1, { __name: "PricingVolumeDiscountForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const pricingStore = usePricingStore();
    const machineStore = useMachineStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const tabs = [
      { id: "printing", name: "Printing Rates" },
      { id: "materials", name: "Materials" },
      { id: "discounts", name: "Discounts" }
    ];
    const activeTab = ref("printing");
    const loading = ref(true);
    const panelOpen = ref(false);
    const saving = ref(false);
    const seedLoading = ref(false);
    const errorMessage = ref(null);
    const fieldErrors = ref({});
    const editingPrinting = ref(null);
    const editingMaterial = ref(null);
    const editingDiscount = ref(null);
    const machineOptions = computed(() => machineStore.machineOptions);
    const createLabel = computed(() => {
      if (activeTab.value === "printing") return "Add Pricing";
      if (activeTab.value === "materials") return "Add Material Price";
      return "Add Discount";
    });
    const panelTitle = computed(() => {
      if (activeTab.value === "printing") return editingPrinting.value ? "Edit Printing Rate" : "Add Printing Rate";
      if (activeTab.value === "materials") return editingMaterial.value ? "Edit Material Price" : "Add Material Price";
      return editingDiscount.value ? "Edit Volume Discount" : "Add Volume Discount";
    });
    const panelDescription = computed(() => {
      if (activeTab.value === "printing") return "Printing rate forms now open in the page workspace instead of a modal.";
      if (activeTab.value === "materials") return "Manage material pricing inside the pricing workspace.";
      return "Discount rules now live in the page workspace instead of a modal.";
    });
    const summaryCards = computed(() => [
      {
        label: "Printing Rates",
        value: pricingStore.printingPrices.length,
        note: "Machine-specific pricing rows."
      },
      {
        label: "Material Prices",
        value: pricingStore.materialPrices.length,
        note: "Large-format and material charges."
      },
      {
        label: "Discount Rules",
        value: pricingStore.volumeDiscounts.length,
        note: "Volume discounts available."
      }
    ]);
    function machineName(machineId) {
      return machineStore.machines.find((machine) => machine.id === machineId)?.name ?? `Machine #${machineId}`;
    }
    function resetErrors() {
      errorMessage.value = null;
      fieldErrors.value = {};
    }
    function closePanel() {
      panelOpen.value = false;
      editingPrinting.value = null;
      editingMaterial.value = null;
      editingDiscount.value = null;
      resetErrors();
    }
    function openCreatePanel() {
      editingPrinting.value = null;
      editingMaterial.value = null;
      editingDiscount.value = null;
      resetErrors();
      panelOpen.value = true;
    }
    function editPrinting(price) {
      activeTab.value = "printing";
      editingPrinting.value = price;
      editingMaterial.value = null;
      editingDiscount.value = null;
      resetErrors();
      panelOpen.value = true;
    }
    function editMaterial(price) {
      activeTab.value = "materials";
      editingMaterial.value = price;
      editingPrinting.value = null;
      editingDiscount.value = null;
      resetErrors();
      panelOpen.value = true;
    }
    function editDiscount(discount) {
      activeTab.value = "discounts";
      editingDiscount.value = discount;
      editingPrinting.value = null;
      editingMaterial.value = null;
      resetErrors();
      panelOpen.value = true;
    }
    async function submitPrinting(data) {
      saving.value = true;
      resetErrors();
      try {
        if (editingPrinting.value) {
          await pricingStore.updatePrintingPrice(slug.value, editingPrinting.value.id, data);
          toast.add({ title: "Saved", description: "Printing rate updated.", color: "success" });
        } else {
          await pricingStore.createPrintingPrice(slug.value, data);
          toast.add({ title: "Saved", description: "Printing rate added.", color: "success" });
        }
        closePanel();
        await pricingStore.fetchPrintingPrices(slug.value);
      } catch (error) {
        const feedback = extractApiFeedback(error, "We could not save this printing rate right now.");
        errorMessage.value = feedback.message;
        fieldErrors.value = feedback.fieldErrors;
      } finally {
        saving.value = false;
      }
    }
    async function submitMaterial(data) {
      saving.value = true;
      try {
        if (editingMaterial.value) {
          await pricingStore.updateMaterialPrice(slug.value, editingMaterial.value.id, data);
          toast.add({ title: "Saved", description: "Material price updated.", color: "success" });
        } else {
          await pricingStore.createMaterialPrice(slug.value, data);
          toast.add({ title: "Saved", description: "Material price added.", color: "success" });
        }
        closePanel();
        await pricingStore.fetchMaterialPrices(slug.value);
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to save material price.", color: "error" });
      } finally {
        saving.value = false;
      }
    }
    async function submitDiscount(data) {
      saving.value = true;
      resetErrors();
      try {
        if (editingDiscount.value) {
          await pricingStore.updateVolumeDiscount(slug.value, editingDiscount.value.id, data);
          toast.add({ title: "Saved", description: "Discount updated.", color: "success" });
        } else {
          await pricingStore.createVolumeDiscount(slug.value, data);
          toast.add({ title: "Saved", description: "Discount added.", color: "success" });
        }
        closePanel();
        await pricingStore.fetchVolumeDiscounts(slug.value);
      } catch (error) {
        const feedback = extractApiFeedback(error, "We could not save this discount right now.");
        errorMessage.value = feedback.message;
        fieldErrors.value = feedback.fieldErrors;
      } finally {
        saving.value = false;
      }
    }
    async function deletePrinting(id) {
      if (!confirm("Delete this printing rate?")) return;
      try {
        await pricingStore.deletePrintingPrice(slug.value, id);
        toast.add({ title: "Deleted", description: "Printing rate removed.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete printing rate.", color: "error" });
      }
    }
    async function deleteMaterial(id) {
      if (!confirm("Delete this material price?")) return;
      try {
        await pricingStore.deleteMaterialPrice(slug.value, id);
        toast.add({ title: "Deleted", description: "Material price removed.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete material price.", color: "error" });
      }
    }
    async function deleteDiscount(id) {
      if (!confirm("Delete this discount?")) return;
      try {
        await pricingStore.deleteVolumeDiscount(slug.value, id);
        toast.add({ title: "Deleted", description: "Discount removed.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete discount.", color: "error" });
      }
    }
    async function loadStarterDefaults() {
      seedLoading.value = true;
      try {
        await pricingStore.seedShopDefaults(slug.value);
        toast.add({ title: "Loaded", description: "Starter defaults have been added to this shop.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to load starter defaults.", color: "error" });
      } finally {
        seedLoading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardAdminWorkspaceFormPanel = __nuxt_component_6$1;
      const _component_PricingPrintingPriceForm = __nuxt_component_6;
      const _component_PricingMaterialPriceForm = __nuxt_component_7;
      const _component_PricingVolumeDiscountForm = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Pricing",
        subtitle: "Manage printing rates, material pricing, and discounts here. Paper stock and finishings now have their own pages."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              to: `/dashboard/shops/${unref(slug)}/papers`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Paper Stock`);
                } else {
                  return [
                    createTextVNode("Paper Stock")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              to: `/dashboard/shops/${unref(slug)}/finishing`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Finishings`);
                } else {
                  return [
                    createTextVNode("Finishings")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              onClick: openCreatePanel
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` ${ssrInterpolate(unref(createLabel))}`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" " + toDisplayString(unref(createLabel)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "soft",
                to: `/dashboard/shops/${unref(slug)}/papers`
              }, {
                default: withCtx(() => [
                  createTextVNode("Paper Stock")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                variant: "soft",
                to: `/dashboard/shops/${unref(slug)}/finishing`
              }, {
                default: withCtx(() => [
                  createTextVNode("Finishings")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                color: "primary",
                onClick: openCreatePanel
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" " + toDisplayString(unref(createLabel)), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!unref(loading) && !unref(pricingStore).hasPricing) {
        _push(`<div class="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p class="text-sm font-semibold">Setup incomplete</p><p class="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-200"> Pricing is still missing. You can load starter defaults, then refine them section by section. </p></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          loading: unref(seedLoading),
          color: "primary",
          onClick: loadStarterDefaults
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Load starter defaults `);
            } else {
              return [
                createTextVNode(" Load starter defaults ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]"><div class="space-y-4"><div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: tab.id,
          variant: unref(activeTab) === tab.id ? "solid" : "soft",
          color: unref(activeTab) === tab.id ? "primary" : "neutral",
          onClick: ($event) => activeTab.value = tab.id
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tab.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(tab.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="grid gap-4 md:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(summaryCards), (card) => {
        _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(card.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(card.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(card.note)}</p></article>`);
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "table",
          "show-header": false
        }, null, _parent));
      } else if (unref(activeTab) === "printing") {
        _push(`<div class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Machine</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Size</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Color</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Sell / Side</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(unref(pricingStore).printingPrices, (price) => {
          _push(`<tr><td class="px-4 py-4 text-sm text-[var(--p-text)]">${ssrInterpolate(machineName(price.machine))}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.sheet_size)}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.color_mode)}</td><td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">KES ${ssrInterpolate(price.selling_price_per_side)}</td><td class="px-4 py-4"><div class="flex justify-end gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editPrinting(price)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            color: "error",
            onClick: ($event) => deletePrinting(price.id)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Delete`);
              } else {
                return [
                  createTextVNode("Delete")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></td></tr>`);
        });
        _push(`<!--]--></tbody></table>`);
        if (!unref(pricingStore).printingPrices.length) {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No printing rates yet",
            description: "Add machine-specific printing rates from this page.",
            icon: "i-lucide-banknote"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  disabled: !unref(machineStore).machines.length,
                  onClick: openCreatePanel
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add pricing`);
                    } else {
                      return [
                        createTextVNode("Add pricing")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "primary",
                    disabled: !unref(machineStore).machines.length,
                    onClick: openCreatePanel
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add pricing")
                    ]),
                    _: 1
                  }, 8, ["disabled"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(activeTab) === "materials") {
        _push(`<div class="grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(pricingStore).materialPrices, (material) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(material.material_name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(material.unit)}</p><p class="mt-4 text-lg font-semibold text-[var(--p-text)]">KES ${ssrInterpolate(material.selling_price)}</p><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editMaterial(material)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            color: "error",
            onClick: ($event) => deleteMaterial(material.id)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Delete`);
              } else {
                return [
                  createTextVNode("Delete")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]-->`);
        if (!unref(pricingStore).materialPrices.length) {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No material prices yet",
            description: "Add large-format or material pricing from this page.",
            icon: "i-lucide-layers"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  onClick: openCreatePanel
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add material price`);
                    } else {
                      return [
                        createTextVNode("Add material price")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "primary",
                    onClick: openCreatePanel
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add material price")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(pricingStore).volumeDiscounts, (discount) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(discount.name)}</p><p class="mt-2 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(discount.discount_percent)}%</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Min quantity: ${ssrInterpolate(discount.min_quantity)}</p><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editDiscount(discount)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Edit`);
              } else {
                return [
                  createTextVNode("Edit")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            color: "error",
            onClick: ($event) => deleteDiscount(discount.id)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Delete`);
              } else {
                return [
                  createTextVNode("Delete")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]-->`);
        if (!unref(pricingStore).volumeDiscounts.length) {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No discounts yet",
            description: "Add volume discounts when the offer is ready.",
            icon: "i-lucide-percent"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  onClick: openCreatePanel
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add discount`);
                    } else {
                      return [
                        createTextVNode("Add discount")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "primary",
                    onClick: openCreatePanel
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add discount")
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
      if (unref(panelOpen)) {
        _push(ssrRenderComponent(_component_DashboardAdminWorkspaceFormPanel, {
          title: unref(panelTitle),
          description: unref(panelDescription),
          onClose: closePanel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(activeTab) === "printing") {
                _push2(ssrRenderComponent(_component_PricingPrintingPriceForm, {
                  key: unref(editingPrinting)?.id ?? "new-printing",
                  price: unref(editingPrinting),
                  "machine-options": unref(machineOptions),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitPrinting,
                  onCancel: closePanel
                }, null, _parent2, _scopeId));
              } else if (unref(activeTab) === "materials") {
                _push2(ssrRenderComponent(_component_PricingMaterialPriceForm, {
                  key: unref(editingMaterial)?.id ?? "new-material",
                  price: unref(editingMaterial),
                  loading: unref(saving),
                  onSubmit: submitMaterial,
                  onCancel: closePanel
                }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(_component_PricingVolumeDiscountForm, {
                  key: unref(editingDiscount)?.id ?? "new-discount",
                  discount: unref(editingDiscount),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitDiscount,
                  onCancel: closePanel
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                unref(activeTab) === "printing" ? (openBlock(), createBlock(_component_PricingPrintingPriceForm, {
                  key: unref(editingPrinting)?.id ?? "new-printing",
                  price: unref(editingPrinting),
                  "machine-options": unref(machineOptions),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitPrinting,
                  onCancel: closePanel
                }, null, 8, ["price", "machine-options", "loading", "error-message", "field-errors"])) : unref(activeTab) === "materials" ? (openBlock(), createBlock(_component_PricingMaterialPriceForm, {
                  key: unref(editingMaterial)?.id ?? "new-material",
                  price: unref(editingMaterial),
                  loading: unref(saving),
                  onSubmit: submitMaterial,
                  onCancel: closePanel
                }, null, 8, ["price", "loading"])) : (openBlock(), createBlock(_component_PricingVolumeDiscountForm, {
                  key: unref(editingDiscount)?.id ?? "new-discount",
                  discount: unref(editingDiscount),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitDiscount,
                  onCancel: closePanel
                }, null, 8, ["discount", "loading", "error-message", "field-errors"]))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/pricing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B10Fnlmr.mjs.map
