import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, e as useToast, b as _sfc_main$9, a as _sfc_main$f, J as extractApiFeedback } from './server.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6$1 } from './AdminWorkspaceFormPanel-D_9BQu_x.mjs';
import { F as Form, _ as __nuxt_component_2, a as Field } from './FormInput-Ci9MIR6u.mjs';
import { _ as _sfc_main$4 } from './Alert-BQjQ5uNh.mjs';
import { _ as __nuxt_component_4$1 } from './FormSelect-B_nao_f-.mjs';
import { _ as __nuxt_component_4$2 } from './InlineError-CDgd_EMb.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-DEusGFiB.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { object, string, boolean, number } from 'yup';
import { u as usePricingStore } from './pricing-UjDz6xlt.mjs';
import { u as useMachineStore } from './machine-DD004_8d.mjs';
import { u as useSellerStore } from './seller-mv0Z_U7J.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-tIWAo1tq.mjs';
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
import './formUi-NbOzRwMW.mjs';
import './SelectMenu-D3Bra_sq.mjs';
import './Input-Hudv-7BP.mjs';
import './seller-9NDANUZF.mjs';
import './formatters-FW8HHCjc.mjs';

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
      duplex_surcharge: props.price?.duplex_surcharge ?? "0",
      duplex_surcharge_enabled: props.price?.duplex_surcharge_enabled ?? false,
      duplex_surcharge_min_gsm: props.price?.duplex_surcharge_min_gsm ?? "",
      buying_price_per_side: props.price?.buying_price_per_side ?? ""
    }));
    const schema = object({
      machine: number().required("Machine is required"),
      sheet_size: string().oneOf(["A4", "A3", "SRA3", "A2", "A1", "A0", "CUSTOM"]).required("Size is required"),
      color_mode: string().oneOf(["BW", "COLOR"]).required("Color mode is required"),
      selling_price_per_side: string().required("Selling price is required"),
      selling_price_duplex_per_sheet: string().optional().nullable(),
      duplex_surcharge: string().optional(),
      duplex_surcharge_enabled: boolean().optional(),
      duplex_surcharge_min_gsm: string().optional().nullable(),
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
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Print Price (per side)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_per_side",
              label: "Print Price (per side)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("selling_price_per_side")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Duplex Override (optional)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_duplex_per_sheet",
              label: "Duplex Override (optional)",
              type: "number",
              placeholder: "Leave blank to use per-side x 2 + surcharge",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("selling_price_duplex_per_sheet")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Duplex Surcharge</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "duplex_surcharge",
              label: "Duplex Surcharge",
              type: "number",
              placeholder: "0.00",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`<div class="mt-2 flex items-center gap-3 text-sm text-[var(--p-text-muted)]"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Field), { name: "duplex_surcharge_enabled" }, {
              default: withCtx(({ field }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<input${ssrRenderAttrs(mergeProps(field, {
                    type: "checkbox",
                    class: "h-4 w-4 rounded border-[var(--p-border)]",
                    checked: Boolean(field.value)
                  }))}${_scopeId2}>`);
                } else {
                  return [
                    createVNode("input", mergeProps(field, {
                      type: "checkbox",
                      class: "h-4 w-4 rounded border-[var(--p-border)]",
                      checked: Boolean(field.value)
                    }), null, 16, ["checked"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Enable duplex surcharge rule</span></div>`);
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("duplex_surcharge")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("duplex_surcharge_enabled")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Duplex Surcharge Min GSM</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "duplex_surcharge_min_gsm",
              label: "Duplex Surcharge Min GSM",
              type: "number",
              placeholder: "e.g. 150",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`<p class="mt-1 text-xs text-[var(--p-text-muted)]"${_scopeId}>Leave blank to apply the duplex surcharge to every duplex paper on this rate.</p>`);
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("duplex_surcharge_min_gsm")
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
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Printing Rate")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Printing Rate"), 1)
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
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Print Price (per side)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "selling_price_per_side",
                          label: "Print Price (per side)",
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
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Duplex Override (optional)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "selling_price_duplex_per_sheet",
                          label: "Duplex Override (optional)",
                          type: "number",
                          placeholder: "Leave blank to use per-side x 2 + surcharge",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("selling_price_duplex_per_sheet")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Duplex Surcharge"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "duplex_surcharge",
                          label: "Duplex Surcharge",
                          type: "number",
                          placeholder: "0.00",
                          "hide-label": ""
                        }),
                        createVNode("div", { class: "mt-2 flex items-center gap-3 text-sm text-[var(--p-text-muted)]" }, [
                          createVNode(unref(Field), { name: "duplex_surcharge_enabled" }, {
                            default: withCtx(({ field }) => [
                              createVNode("input", mergeProps(field, {
                                type: "checkbox",
                                class: "h-4 w-4 rounded border-[var(--p-border)]",
                                checked: Boolean(field.value)
                              }), null, 16, ["checked"])
                            ]),
                            _: 1
                          }),
                          createVNode("span", null, "Enable duplex surcharge rule")
                        ]),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("duplex_surcharge")
                        }, null, 8, ["message"]),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("duplex_surcharge_enabled")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Duplex Surcharge Min GSM"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "duplex_surcharge_min_gsm",
                          label: "Duplex Surcharge Min GSM",
                          type: "number",
                          placeholder: "e.g. 150",
                          "hide-label": ""
                        }),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--p-text-muted)]" }, "Leave blank to apply the duplex surcharge to every duplex paper on this rate."),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("duplex_surcharge_min_gsm")
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
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Printing Rate"), 1)
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
    const sellerStore = useSellerStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const { formatMoney } = useCurrencyFormatter(computed(() => sellerStore.getShopBySlug(slug.value)?.currency ?? null));
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative space-y-6" }, _attrs))}><div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(243,115,68,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_30%)] blur-2xl"></div>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Pricing",
        subtitle: "Manage per-side printing rates, duplex surcharge rules, material pricing, and discounts here. Paper stock and finishings now have their own pages."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              class: "softui-pill-input !bg-transparent px-4",
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
              class: "softui-pill-input !bg-transparent px-4",
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
              class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_12px_24px_rgba(225,53,21,0.18)] hover:!bg-[var(--color-primary-700)]",
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
                class: "softui-pill-input !bg-transparent px-4",
                to: `/dashboard/shops/${unref(slug)}/papers`
              }, {
                default: withCtx(() => [
                  createTextVNode("Paper Stock")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                variant: "soft",
                class: "softui-pill-input !bg-transparent px-4",
                to: `/dashboard/shops/${unref(slug)}/finishing`
              }, {
                default: withCtx(() => [
                  createTextVNode("Finishings")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                color: "primary",
                class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_12px_24px_rgba(225,53,21,0.18)] hover:!bg-[var(--color-primary-700)]",
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
        _push(`<div class="softui-card group relative overflow-hidden rounded-[1.9rem] border-[color:color-mix(in_srgb,var(--p-border)_58%,rgb(245_158_11)_42%)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--p-surface-raised)_84%,rgb(251_191_36)_16%),color-mix(in_srgb,var(--p-surface-container)_78%,rgb(249_115_22)_22%))] p-5 shadow-[var(--shadow-panel),0_0_0_1px_rgb(245_158_11_/_0.08)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[color:color-mix(in_srgb,var(--p-border)_42%,rgb(245_158_11)_58%)] hover:shadow-[var(--shadow-modal),0_0_0_1px_rgb(245_158_11_/_0.14)] focus-within:border-[color:color-mix(in_srgb,var(--p-border)_38%,rgb(245_158_11)_62%)] focus-within:shadow-[var(--shadow-modal),0_0_0_1px_rgb(245_158_11_/_0.16)]"><div class="pointer-events-none absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_68%)] opacity-80"></div><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div class="flex items-start gap-3"><span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[color:color-mix(in_srgb,var(--p-border)_44%,rgb(245_158_11)_56%)] bg-[color:color-mix(in_srgb,var(--p-surface)_58%,rgb(245_158_11)_42%)] text-[color:color-mix(in_srgb,var(--p-text)_68%,rgb(180_83_9)_32%)] shadow-sm">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-triangle-alert",
          class: "h-4.5 w-4.5"
        }, null, _parent));
        _push(`</span><div class="relative"><p class="text-base font-semibold tracking-[0.01em] text-[var(--p-text)]">Setup incomplete</p><p class="mt-1 text-sm leading-6 text-[color:color-mix(in_srgb,var(--p-text)_82%,rgb(120_53_15)_18%)]"> Pricing is still missing. You can load starter defaults, then refine them section by section. </p></div></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          loading: unref(seedLoading),
          color: "primary",
          class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_12px_24px_rgba(225,53,21,0.24)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:!bg-[var(--color-primary-700)] hover:shadow-[0_16px_32px_rgba(225,53,21,0.28)] focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--p-surface)]",
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
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]"><div class="space-y-4"><div class="softui-segment flex flex-wrap gap-2 rounded-[1.75rem] p-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-flamingo-50 text-flamingo-700 shadow-[0_14px_28px_rgba(225,53,21,0.12)] ring-1 ring-flamingo-200/70 dark:bg-flamingo-500/14 dark:text-flamingo-100 dark:ring-flamingo-400/20" : "text-[var(--p-text-muted)] hover:bg-flamingo-50/55 hover:text-[var(--p-text)] dark:hover:bg-flamingo-900/20", "rounded-full px-4 py-3 text-sm font-semibold transition-all"])}">${ssrInterpolate(tab.name)}</button>`);
      });
      _push(`<!--]--></div><div class="grid gap-4 md:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(summaryCards), (card) => {
        _push(`<article class="softui-card rounded-[1.85rem] p-5"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(card.label)}</p><p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(card.value)}</p><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(card.note)}</p></article>`);
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "table",
          "show-header": false
        }, null, _parent));
      } else if (unref(activeTab) === "printing") {
        _push(`<div class="softui-panel overflow-hidden rounded-[2rem]"><table class="min-w-full divide-y divide-white/8"><thead class="bg-white/4"><tr><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Machine</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Size</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Color</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Per Side</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Duplex Rule</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th></tr></thead><tbody class="divide-y divide-white/6"><!--[-->`);
        ssrRenderList(unref(pricingStore).printingPrices, (price) => {
          _push(`<tr><td class="px-4 py-4 text-sm text-[var(--p-text)]">${ssrInterpolate(machineName(price.machine))}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.sheet_size)}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(price.color_mode)}</td><td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(price.selling_price_per_side))}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">`);
          if (price.selling_price_duplex_per_sheet) {
            _push(`<span> Override ${ssrInterpolate(unref(formatMoney)(price.selling_price_duplex_per_sheet))}</span>`);
          } else if (price.duplex_surcharge_enabled && price.duplex_surcharge && price.duplex_surcharge !== "0" && price.duplex_surcharge !== "0.00") {
            _push(`<span> +${ssrInterpolate(unref(formatMoney)(price.duplex_surcharge))}`);
            if (price.duplex_surcharge_min_gsm) {
              _push(`<span> from ${ssrInterpolate(price.duplex_surcharge_min_gsm)}gsm</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          } else {
            _push(`<span>2 sides, no surcharge</span>`);
          }
          _push(`</td><td class="px-4 py-4"><div class="flex justify-end gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            class: "softui-pill-input !bg-transparent px-3",
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
            class: "softui-pill-input !bg-transparent px-3",
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
                  class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)] disabled:!bg-[var(--p-border)] disabled:!text-[var(--p-text-muted)]",
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
                    class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)] disabled:!bg-[var(--p-border)] disabled:!text-[var(--p-text-muted)]",
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
          _push(`<article class="softui-card rounded-[1.85rem] p-5"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(material.material_name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(material.unit)}</p><p class="mt-4 text-lg font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(material.selling_price))}</p><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            class: "softui-pill-input !bg-transparent px-3",
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
            class: "softui-pill-input !bg-transparent px-3",
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
                  class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]",
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
                    class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]",
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
          _push(`<article class="softui-card rounded-[1.85rem] p-5"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(discount.name)}</p><p class="mt-2 text-3xl font-semibold text-[var(--p-text)]">${ssrInterpolate(discount.discount_percent)}%</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Min quantity: ${ssrInterpolate(discount.min_quantity)}</p><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            class: "softui-pill-input !bg-transparent px-3",
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
            class: "softui-pill-input !bg-transparent px-3",
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
                  class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]",
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
                    class: "softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]",
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
//# sourceMappingURL=index-bP1eo9Xm.mjs.map
