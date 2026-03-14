import { f as useRoute, g as useToast, c as _sfc_main$9, a as _sfc_main$f, _ as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$5 } from './Badge-CGrQBVmm.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-InVpxbUI.mjs';
import { _ as __nuxt_component_0 } from './SimpleModal-knQEbNC5.mjs';
import { F as Form, _ as __nuxt_component_1$1 } from './FormInput-BwqVsjAz.mjs';
import { _ as __nuxt_component_1 } from './FormSelect-COX9zeAz.mjs';
import { defineComponent, computed, ref, watch, nextTick, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { _ as _sfc_main$6 } from './Checkbox-BX22gW7J.mjs';
import { _ as __nuxt_component_2$1 } from './LoadingSpinner-DUXHKoma.mjs';
import { u as usePricingStore } from './pricing-b9_FMs6x.mjs';
import { u as useMachineStore } from './machine-DJGepYrp.mjs';
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
import './SelectMenu-Cud-scqw.mjs';
import './Input-il5BObb7.mjs';
import './api-error-D1IYk86E.mjs';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "PrintingPriceForm",
  __ssrInlineRender: true,
  props: {
    price: {},
    machineOptions: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const editing = computed(() => !!props.price);
    const sheetSizeOptions = [
      { label: "A5", value: "A5" },
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "SRA3", value: "SRA3" }
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
      sheet_size: string().oneOf(["A5", "A4", "A3", "SRA3"]).required("Size is required"),
      color_mode: string().oneOf(["BW", "COLOR"]).required("Color mode is required"),
      selling_price_per_side: string().required("Selling price is required"),
      selling_price_duplex_per_sheet: string().optional().nullable(),
      buying_price_per_side: string().optional()
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormSelect = __nuxt_component_1;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40"${_scopeId}>Machine</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "machine",
              label: "Machine",
              options: __props.machineOptions,
              placeholder: "Select machine",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Sheet Size</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "sheet_size",
              label: "Sheet Size",
              options: sheetSizeOptions,
              placeholder: "Select size",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Color Mode</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "color_mode",
              label: "Color Mode",
              options: colorModeOptions,
              placeholder: "Select color",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Selling Price (per side)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_per_side",
              label: "Selling Price (per side)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Selling Price (duplex per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price_duplex_per_sheet",
              label: "Selling Price (duplex per sheet)",
              type: "number",
              placeholder: "0.00 (optional override)",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Buying Price (per side)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price_per_side",
              label: "Buying Price (per side)",
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
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40" }, "Machine"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "machine",
                        label: "Machine",
                        options: __props.machineOptions,
                        placeholder: "Select machine",
                        required: "",
                        "hide-label": ""
                      }, null, 8, ["options"])
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Sheet Size"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "sheet_size",
                        label: "Sheet Size",
                        options: sheetSizeOptions,
                        placeholder: "Select size",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Color Mode"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "color_mode",
                        label: "Color Mode",
                        options: colorModeOptions,
                        placeholder: "Select color",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Selling Price (per side)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "selling_price_per_side",
                        label: "Selling Price (per side)",
                        type: "number",
                        placeholder: "0.00",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Selling Price (duplex per sheet)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "selling_price_duplex_per_sheet",
                        label: "Selling Price (duplex per sheet)",
                        type: "number",
                        placeholder: "0.00 (optional override)",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Buying Price (per side)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "buying_price_per_side",
                        label: "Buying Price (per side)",
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/PrintingPriceForm.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$4, { __name: "PricingPrintingPriceForm" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PaperPriceForm",
  __ssrInlineRender: true,
  props: {
    price: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const editing = computed(() => !!props.price);
    const sheetSizeOptions = [
      { label: "A5", value: "A5" },
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "SRA3", value: "SRA3" }
    ];
    const paperTypeOptions = [
      { label: "Gloss", value: "GLOSS" },
      { label: "Matte", value: "MATTE" },
      { label: "Bond", value: "BOND" },
      { label: "Art Paper", value: "ART" }
    ];
    const initialValues = computed(() => ({
      sheet_size: props.price?.sheet_size ?? "A3",
      gsm: props.price?.gsm ?? "",
      paper_type: props.price?.paper_type ?? "GLOSS",
      buying_price: props.price?.buying_price ?? "",
      selling_price: props.price?.selling_price ?? ""
    }));
    const schema = object({
      sheet_size: string().oneOf(["A5", "A4", "A3", "SRA3"]).required("Size is required"),
      gsm: number().min(60, "Min 60 GSM").max(500, "Max 500 GSM").required("GSM is required"),
      paper_type: string().oneOf(["GLOSS", "MATTE", "BOND", "ART"]).required("Paper type is required"),
      buying_price: string().required("Buying price is required"),
      selling_price: string().required("Selling price is required")
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormSelect = __nuxt_component_1;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40"${_scopeId}>Sheet Size</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "sheet_size",
              label: "Sheet Size",
              options: sheetSizeOptions,
              placeholder: "Select size",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>GSM (weight)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "gsm",
              label: "GSM (weight)",
              type: "number",
              placeholder: "e.g. 130, 150, 200",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Paper Type</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "paper_type",
              label: "Paper Type",
              options: paperTypeOptions,
              placeholder: "Select type",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Buying Price (per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price",
              label: "Buying Price (per sheet)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Selling Price (per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price",
              label: "Selling Price (per sheet)",
              type: "number",
              placeholder: "0.00",
              required: "",
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
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40" }, "Sheet Size"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "sheet_size",
                        label: "Sheet Size",
                        options: sheetSizeOptions,
                        placeholder: "Select size",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "GSM (weight)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "gsm",
                        label: "GSM (weight)",
                        type: "number",
                        placeholder: "e.g. 130, 150, 200",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Paper Type"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormSelect, {
                        name: "paper_type",
                        label: "Paper Type",
                        options: paperTypeOptions,
                        placeholder: "Select type",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Buying Price (per sheet)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "buying_price",
                        label: "Buying Price (per sheet)",
                        type: "number",
                        placeholder: "0.00",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Selling Price (per sheet)"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "selling_price",
                        label: "Selling Price (per sheet)",
                        type: "number",
                        placeholder: "0.00",
                        required: "",
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/PaperPriceForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$3, { __name: "PricingPaperPriceForm" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FinishingServiceForm",
  __ssrInlineRender: true,
  props: {
    service: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editing = computed(() => !!props.service);
    const isDefault = ref(props.service?.is_default ?? false);
    const categoryOptions = [
      { label: "Lamination", value: "LAMINATION" },
      { label: "Binding", value: "BINDING" },
      { label: "Cutting", value: "CUTTING" },
      { label: "Folding", value: "FOLDING" },
      { label: "Other", value: "OTHER" }
    ];
    const chargeByOptions = [
      { label: "Per Sheet", value: "PER_SHEET" },
      { label: "Per Piece/Item", value: "PER_PIECE" },
      { label: "Per Job (Flat Fee)", value: "PER_JOB" }
    ];
    const initialValues = computed(() => ({
      name: props.service?.name ?? "",
      category: props.service?.category ?? "OTHER",
      charge_by: props.service?.charge_by ?? "PER_SHEET",
      buying_price: props.service?.buying_price ?? "",
      selling_price: props.service?.selling_price ?? ""
    }));
    const schema = object({
      name: string().required("Name is required"),
      category: string().oneOf(["LAMINATION", "BINDING", "CUTTING", "FOLDING", "OTHER"]).required("Category is required"),
      charge_by: string().oneOf(["PER_SHEET", "PER_PIECE", "PER_JOB"]).required("Charge by is required"),
      buying_price: string().optional(),
      selling_price: string().required("Selling price is required")
    });
    function onSubmit(values) {
      emit("submit", { ...values, is_default: isDefault.value });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_FormsFormSelect = __nuxt_component_1;
      const _component_UCheckbox = _sfc_main$6;
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
              label: "Service Name",
              placeholder: "e.g. Matt Lamination A3",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "category",
              label: "Category",
              options: categoryOptions,
              placeholder: "Select category",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "charge_by",
              label: "Charge By",
              options: chargeByOptions,
              placeholder: "Select",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price",
              label: "Buying Price (optional)",
              type: "number",
              placeholder: "0.00"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price",
              label: "Selling Price",
              type: "number",
              placeholder: "0.00",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(isDefault),
              "onUpdate:modelValue": ($event) => isRef(isDefault) ? isDefault.value = $event : null
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-gray-700 dark:text-gray-300"${_scopeId}>Default selection for customers</span></div></div><div class="mt-6 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              class: "w-full sm:w-auto",
              onClick: ($event) => _ctx.$emit("cancel")
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: __props.loading || !meta.valid,
              class: "w-full sm:w-auto"
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
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_FormsFormInput, {
                  name: "name",
                  label: "Service Name",
                  placeholder: "e.g. Matt Lamination A3",
                  required: ""
                }),
                createVNode(_component_FormsFormSelect, {
                  name: "category",
                  label: "Category",
                  options: categoryOptions,
                  placeholder: "Select category",
                  required: ""
                }),
                createVNode(_component_FormsFormSelect, {
                  name: "charge_by",
                  label: "Charge By",
                  options: chargeByOptions,
                  placeholder: "Select",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "buying_price",
                  label: "Buying Price (optional)",
                  type: "number",
                  placeholder: "0.00"
                }),
                createVNode(_component_FormsFormInput, {
                  name: "selling_price",
                  label: "Selling Price",
                  type: "number",
                  placeholder: "0.00",
                  required: ""
                }),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(isDefault),
                    "onUpdate:modelValue": ($event) => isRef(isDefault) ? isDefault.value = $event : null
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm text-gray-700 dark:text-gray-300" }, "Default selection for customers")
                ])
              ]),
              createVNode("div", { class: "mt-6 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end" }, [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
                  class: "w-full sm:w-auto",
                  onClick: ($event) => _ctx.$emit("cancel")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Cancel ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_UButton, {
                  type: "submit",
                  color: "primary",
                  loading: __props.loading,
                  disabled: __props.loading || !meta.valid,
                  class: "w-full sm:w-auto"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/FinishingServiceForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$2, { __name: "PricingFinishingServiceForm" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VolumeDiscountForm",
  __ssrInlineRender: true,
  props: {
    discount: {},
    loading: { type: Boolean }
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_1$1;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40"${_scopeId}>Discount Name</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "name",
              label: "Discount Name",
              placeholder: "e.g. Bulk Order 10% Off",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Minimum Quantity</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "min_quantity",
              label: "Minimum Quantity",
              type: "number",
              placeholder: "e.g. 100",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top"${_scopeId}>Discount %</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "discount_percent",
              label: "Discount %",
              type: "number",
              placeholder: "e.g. 10",
              required: "",
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
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40" }, "Discount Name"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "name",
                        label: "Discount Name",
                        placeholder: "e.g. Bulk Order 10% Off",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Minimum Quantity"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "min_quantity",
                        label: "Minimum Quantity",
                        type: "number",
                        placeholder: "e.g. 100",
                        required: "",
                        "hide-label": ""
                      })
                    ])
                  ]),
                  createVNode("tr", null, [
                    createVNode("td", { class: "py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top" }, "Discount %"),
                    createVNode("td", { class: "py-3" }, [
                      createVNode(_component_FormsFormInput, {
                        name: "discount_percent",
                        label: "Discount %",
                        type: "number",
                        placeholder: "e.g. 10",
                        required: "",
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/VolumeDiscountForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$1, { __name: "PricingVolumeDiscountForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { id: "printing", name: "Printing" },
      { id: "paper", name: "Paper" },
      { id: "finishing", name: "Finishing" },
      { id: "discounts", name: "Discounts" }
    ];
    const route = useRoute();
    const pricingStore = usePricingStore();
    const machineStore = useMachineStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const activeTab = ref("printing");
    const loading = ref(true);
    ref(false);
    const printingModalOpen = ref(false);
    const paperModalOpen = ref(false);
    const finishingModalOpen = ref(false);
    const discountModalOpen = ref(false);
    const printingFormReady = ref(false);
    const paperFormReady = ref(false);
    const finishingFormReady = ref(false);
    const discountFormReady = ref(false);
    const editingPrintingPrice = ref(null);
    const editingPaperPrice = ref(null);
    const editingFinishingService = ref(null);
    const editingDiscount = ref(null);
    const formLoading = ref(false);
    const viewDefaultsOpen = ref(false);
    const defaultsLoading = ref(false);
    const seedLoading = ref(false);
    const machineOptions = computed(() => machineStore.machineOptions);
    const hasAnyDefaults = computed(
      () => pricingStore.defaultPrinting.length > 0 || pricingStore.defaultPapers.length > 0 || pricingStore.defaultMaterials.length > 0 || pricingStore.defaultFinishing.length > 0
    );
    async function openViewDefaults() {
      viewDefaultsOpen.value = true;
      defaultsLoading.value = true;
      try {
        await pricingStore.fetchPricingDefaults();
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to load defaults", color: "error" });
      } finally {
        defaultsLoading.value = false;
      }
    }
    async function loadStarterDefaults() {
      seedLoading.value = true;
      pricingStore.error = null;
      try {
        await pricingStore.seedShopDefaults(slug.value);
        toast.add({ title: "Loaded", description: "Starter defaults have been added to your shop." });
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to seed defaults", color: "error" });
      } finally {
        seedLoading.value = false;
      }
    }
    const openPrintingModal = (price) => {
      editingPrintingPrice.value = price ?? null;
      printingModalOpen.value = true;
    };
    const editPrintingPrice = (price) => openPrintingModal(price);
    const closePrintingModal = () => {
      printingModalOpen.value = false;
      editingPrintingPrice.value = null;
    };
    function onPrintingModalOpenChange(open) {
      printingModalOpen.value = open;
      if (!open) editingPrintingPrice.value = null;
    }
    watch(printingModalOpen, (open) => {
      if (open) {
        printingFormReady.value = false;
        nextTick(() => {
          printingFormReady.value = true;
        });
      } else {
        printingFormReady.value = false;
        editingPrintingPrice.value = null;
      }
    }, { immediate: true });
    async function submitPrintingPrice(data) {
      const existing = editingPrintingPrice.value;
      formLoading.value = true;
      try {
        if (existing) {
          await pricingStore.updatePrintingPrice(slug.value, existing.id, {
            selling_price_per_side: data.selling_price_per_side,
            selling_price_duplex_per_sheet: data.selling_price_duplex_per_sheet
          });
          toast.add({ title: "Updated", description: "Printing price updated" });
          closePrintingModal();
          refreshPrinting();
        } else {
          await pricingStore.createPrintingPrice(slug.value, {
            machine: data.machine,
            sheet_size: data.sheet_size,
            color_mode: data.color_mode,
            selling_price_per_side: data.selling_price_per_side,
            selling_price_duplex_per_sheet: data.selling_price_duplex_per_sheet ?? void 0
          });
          toast.add({ title: "Added", description: "Printing price added" });
          closePrintingModal();
          refreshPrinting();
        }
      } catch (err) {
        toast.add({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to save",
          color: "error"
        });
      } finally {
        formLoading.value = false;
      }
    }
    async function deletePrintingPrice(id) {
      try {
        await pricingStore.deletePrintingPrice(slug.value, id);
        toast.add({ title: "Deleted", description: "Printing price removed" });
        refreshPrinting();
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", color: "error" });
      }
    }
    const openPaperModal = (price) => {
      editingPaperPrice.value = price ?? null;
      paperModalOpen.value = true;
    };
    const editPaperPrice = (price) => openPaperModal(price);
    const closePaperModal = () => {
      paperModalOpen.value = false;
      editingPaperPrice.value = null;
    };
    function onPaperModalOpenChange(open) {
      paperModalOpen.value = open;
      if (!open) editingPaperPrice.value = null;
    }
    watch(paperModalOpen, (open) => {
      if (open) {
        paperFormReady.value = false;
        nextTick(() => {
          paperFormReady.value = true;
        });
      } else {
        paperFormReady.value = false;
        editingPaperPrice.value = null;
      }
    }, { immediate: true });
    async function submitPaperPrice(data) {
      formLoading.value = true;
      try {
        if (editingPaperPrice.value) {
          await pricingStore.updatePaperPrice(slug.value, editingPaperPrice.value.id, data);
          toast.add({ title: "Updated", description: "Paper price updated" });
        } else {
          await pricingStore.createPaperPrice(slug.value, data);
          toast.add({ title: "Added", description: "Paper price added" });
        }
        closePaperModal();
        await pricingStore.fetchPaperPrices(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", color: "error" });
      } finally {
        formLoading.value = false;
      }
    }
    async function deletePaperPrice(id) {
      try {
        await pricingStore.deletePaperPrice(slug.value, id);
        toast.add({ title: "Deleted", description: "Paper price removed" });
        await pricingStore.fetchPaperPrices(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", color: "error" });
      }
    }
    const openFinishingModal = (service) => {
      editingFinishingService.value = service ?? null;
      finishingModalOpen.value = true;
    };
    const editFinishingService = (service) => openFinishingModal(service);
    const closeFinishingModal = () => {
      finishingModalOpen.value = false;
      editingFinishingService.value = null;
    };
    function onFinishingModalOpenChange(open) {
      finishingModalOpen.value = open;
      if (!open) editingFinishingService.value = null;
    }
    watch(finishingModalOpen, (open) => {
      if (open) {
        finishingFormReady.value = false;
        nextTick(() => {
          finishingFormReady.value = true;
        });
      } else {
        finishingFormReady.value = false;
        editingFinishingService.value = null;
      }
    }, { immediate: true });
    async function submitFinishingService(data) {
      formLoading.value = true;
      try {
        if (editingFinishingService.value) {
          await pricingStore.updateFinishingService(slug.value, editingFinishingService.value.id, data);
          toast.add({ title: "Updated", description: "Finishing service updated" });
        } else {
          await pricingStore.createFinishingService(slug.value, data);
          toast.add({ title: "Added", description: "Finishing service added" });
        }
        closeFinishingModal();
        await pricingStore.fetchFinishingServices(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", color: "error" });
      } finally {
        formLoading.value = false;
      }
    }
    async function deleteFinishingService(id) {
      try {
        await pricingStore.deleteFinishingService(slug.value, id);
        toast.add({ title: "Deleted", description: "Finishing service removed" });
        await pricingStore.fetchFinishingServices(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", color: "error" });
      }
    }
    const openDiscountModal = (discount) => {
      editingDiscount.value = discount ?? null;
      discountModalOpen.value = true;
    };
    const editDiscount = (discount) => openDiscountModal(discount);
    const closeDiscountModal = () => {
      discountModalOpen.value = false;
      editingDiscount.value = null;
    };
    function onDiscountModalOpenChange(open) {
      discountModalOpen.value = open;
      if (!open) editingDiscount.value = null;
    }
    watch(discountModalOpen, (open) => {
      if (open) {
        discountFormReady.value = false;
        nextTick(() => {
          discountFormReady.value = true;
        });
      } else {
        discountFormReady.value = false;
        editingDiscount.value = null;
      }
    }, { immediate: true });
    async function submitVolumeDiscount(data) {
      formLoading.value = true;
      try {
        if (editingDiscount.value) {
          await pricingStore.updateVolumeDiscount(slug.value, editingDiscount.value.id, data);
          toast.add({ title: "Updated", description: "Volume discount updated" });
        } else {
          await pricingStore.createVolumeDiscount(slug.value, data);
          toast.add({ title: "Added", description: "Volume discount added" });
        }
        closeDiscountModal();
        await pricingStore.fetchVolumeDiscounts(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", color: "error" });
      } finally {
        formLoading.value = false;
      }
    }
    async function deleteDiscount(id) {
      try {
        await pricingStore.deleteVolumeDiscount(slug.value, id);
        toast.add({ title: "Deleted", description: "Volume discount removed" });
        await pricingStore.fetchVolumeDiscounts(slug.value);
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", color: "error" });
      }
    }
    function refreshPrinting() {
      pricingStore.fetchPrintingPrices(slug.value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_2;
      const _component_UBadge = _sfc_main$5;
      const _component_CommonEmptyState = __nuxt_component_3$1;
      const _component_CommonSimpleModal = __nuxt_component_0;
      const _component_PricingPrintingPriceForm = __nuxt_component_7;
      const _component_PricingPaperPriceForm = __nuxt_component_8;
      const _component_PricingFinishingServiceForm = __nuxt_component_9;
      const _component_PricingVolumeDiscountForm = __nuxt_component_10;
      const _component_CommonLoadingSpinner = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Rate Card / Pricing Setup</h1><p class="text-gray-600 dark:text-gray-400 mt-1">Machine printing prices and large format material rates</p></div><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "outline",
        size: "sm",
        loading: unref(defaultsLoading),
        onClick: openViewDefaults
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-file-text",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` View defaults `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-file-text",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" View defaults ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: `/dashboard/shops/${unref(slug)}`,
        variant: "soft",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Back`);
          } else {
            return [
              createTextVNode("Back")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: `/shops/${unref(slug)}`,
        target: "_blank",
        variant: "outline",
        class: "rounded-xl border-gray-200 dark:border-gray-700 hover:border-flamingo-300 dark:hover:border-flamingo-600 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/30 hover:text-flamingo-600 dark:hover:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-eye",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Preview Public Page `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-eye",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Preview Public Page ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (!unref(loading) && !unref(pricingStore).hasPricing) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><p class="text-sm font-medium text-amber-800 dark:text-amber-200">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-alert-triangle",
          class: "inline w-4 h-4 mr-1"
        }, null, _parent));
        _push(` Setup incomplete: add pricing </p><p class="mt-1 text-sm text-amber-700 dark:text-amber-300"> Without pricing, customers won&#39;t be able to request quotes. Load starter defaults below, then adjust prices to match your shop. </p></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600 shrink-0",
          loading: unref(seedLoading),
          onClick: loadStarterDefaults
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-download",
                class: "w-4 h-4 mr-2"
              }, null, _parent2, _scopeId));
              _push2(` Load starter defaults `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-download",
                  class: "w-4 h-4 mr-2"
                }),
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
      if (!unref(loading) && unref(pricingStore).hasPricing && unref(pricingStore).hasNeedsReview) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4"><p class="text-sm text-amber-800 dark:text-amber-200">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-alert-triangle",
          class: "inline w-4 h-4 mr-1"
        }, null, _parent));
        _push(` Starter prices loaded—adjust before using </p><p class="mt-1 text-sm text-amber-700 dark:text-amber-300"> Edit any price row to confirm and remove the review flag. </p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(pricingStore).error) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4"><p class="text-sm text-red-800 dark:text-red-200">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-alert-circle",
          class: "inline w-4 h-4 mr-1"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(pricingStore).error)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-flamingo-500 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white", "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"])}">${ssrInterpolate(tab.name)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "table",
          "show-header": false,
          class: "col-span-12"
        }, null, _parent));
      } else {
        _push(`<!--[-->`);
        if (unref(activeTab) === "printing") {
          _push(`<div class="space-y-4">`);
          if (!unref(machineStore).machines.length) {
            _push(`<div class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4"><p class="text-sm text-amber-800 dark:text-amber-200">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-alert-circle",
              class: "inline w-4 h-4 mr-1"
            }, null, _parent));
            _push(` Add machines first in `);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/dashboard/shops/${unref(slug)}/machines`,
              class: "font-semibold text-amber-700 dark:text-amber-300 hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Machines`);
                } else {
                  return [
                    createTextVNode("Machines")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(` before setting printing prices. </p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex justify-between items-center"><p class="text-sm text-gray-600 dark:text-gray-400">Set the price per printed side for each paper size and color mode.</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
            disabled: !unref(machineStore).machines.length,
            onClick: ($event) => openPrintingModal()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "w-4 h-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Add Printing Price `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-1"
                  }),
                  createTextVNode(" Add Printing Price ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (unref(pricingStore).printingPrices.length) {
            _push(`<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sell Price</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy Price</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit</th><th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Active</th><th class="px-4 py-3"></th></tr></thead><tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
            ssrRenderList(unref(pricingStore).printingPrices, (price) => {
              _push(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800"><td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(price.sheet_size)}</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(price.color_mode)}</td><td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">KES ${ssrInterpolate(price.selling_price_per_side)}</td><td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">${ssrInterpolate(price.buying_price_per_side ? `KES ${price.buying_price_per_side}` : "-")}</td><td class="px-4 py-3 text-sm text-right text-green-600">KES ${ssrInterpolate(price.profit_per_side)}</td><td class="px-4 py-3 text-center"><div class="flex items-center justify-center gap-1">`);
              _push(ssrRenderComponent(_component_UBadge, {
                color: price.is_active ? "success" : "neutral",
                variant: "soft"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(price.is_active ? "Yes" : "No")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(price.is_active ? "Yes" : "No"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if (price.needs_review) {
                _push(ssrRenderComponent(_component_UBadge, {
                  color: "warning",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Review`);
                    } else {
                      return [
                        createTextVNode("Review")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</div></td><td class="px-4 py-3 text-right">`);
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                onClick: ($event) => editPrintingPrice(price)
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
                size: "xs",
                color: "error",
                onClick: ($event) => deletePrintingPrice(price.id)
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
              _push(`</td></tr>`);
            });
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(ssrRenderComponent(_component_CommonEmptyState, {
              title: "No printing prices",
              description: "Add machines first, then add printing prices per machine and paper size."
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (!unref(machineStore).machines.length) {
                    _push2(ssrRenderComponent(_component_NuxtLink, {
                      to: `/dashboard/shops/${unref(slug)}/machines`
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(ssrRenderComponent(_component_UButton, { class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600" }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`Add machines first`);
                              } else {
                                return [
                                  createTextVNode("Add machines first")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent3, _scopeId2));
                        } else {
                          return [
                            createVNode(_component_UButton, { class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600" }, {
                              default: withCtx(() => [
                                createTextVNode("Add machines first")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(ssrRenderComponent(_component_UButton, {
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      onClick: ($event) => openPrintingModal()
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Add first printing price `);
                        } else {
                          return [
                            createTextVNode(" Add first printing price ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  }
                } else {
                  return [
                    !unref(machineStore).machines.length ? (openBlock(), createBlock(_component_NuxtLink, {
                      key: 0,
                      to: `/dashboard/shops/${unref(slug)}/machines`
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UButton, { class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600" }, {
                          default: withCtx(() => [
                            createTextVNode("Add machines first")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["to"])) : (openBlock(), createBlock(_component_UButton, {
                      key: 1,
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      onClick: ($event) => openPrintingModal()
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Add first printing price ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]))
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "paper") {
          _push(`<div class="space-y-4"><div class="flex justify-between items-center"><p class="text-sm text-gray-600 dark:text-gray-400">Set paper prices by GSM (weight). Customers see this as their rate card.</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
            onClick: ($event) => openPaperModal()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "w-4 h-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Add Paper Price `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-1"
                  }),
                  createTextVNode(" Add Paper Price ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (unref(pricingStore).paperPrices.length) {
            _push(`<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">GSM</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy Price</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sell Price</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Profit</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Margin</th><th class="px-4 py-3"></th></tr></thead><tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
            ssrRenderList(unref(pricingStore).paperPrices, (price) => {
              _push(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800"><td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(price.gsm)} gsm</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(price.sheet_size)}</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(price.paper_type)}</td><td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">KES ${ssrInterpolate(price.buying_price)}</td><td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">KES ${ssrInterpolate(price.selling_price)}</td><td class="px-4 py-3 text-sm text-right text-green-600">KES ${ssrInterpolate(price.profit)}</td><td class="px-4 py-3 text-sm text-right text-gray-500 dark:text-gray-400">${ssrInterpolate(parseFloat(price.margin_percent).toFixed(1))}%</td><td class="px-4 py-3 text-right"><div class="flex items-center justify-end gap-1">`);
              if (price.needs_review) {
                _push(ssrRenderComponent(_component_UBadge, {
                  color: "warning",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Review`);
                    } else {
                      return [
                        createTextVNode("Review")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                onClick: ($event) => editPaperPrice(price)
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
                size: "xs",
                color: "error",
                onClick: ($event) => deletePaperPrice(price.id)
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
            _push(`<!--]--></tbody></table></div>`);
          } else {
            _push(ssrRenderComponent(_component_CommonEmptyState, {
              title: "No paper prices",
              description: "Add paper prices by GSM to create your rate card."
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    onClick: ($event) => openPaperModal()
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Add First Paper Price`);
                      } else {
                        return [
                          createTextVNode("Add First Paper Price")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      onClick: ($event) => openPaperModal()
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add First Paper Price")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "finishing") {
          _push(`<div class="space-y-4"><div class="flex justify-between items-center"><p class="text-sm text-gray-600 dark:text-gray-400">Add finishing services like lamination, binding, and cutting.</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
            onClick: ($event) => openFinishingModal()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "w-4 h-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Add Finishing Service `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-1"
                  }),
                  createTextVNode(" Add Finishing Service ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (unref(pricingStore).finishingServices.length) {
            _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
            ssrRenderList(unref(pricingStore).finishingServices, (service) => {
              _push(`<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow"><div class="flex justify-between items-start"><div><h3 class="font-medium text-gray-900 dark:text-white">${ssrInterpolate(service.name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(service.category)}</p></div><div class="flex gap-1">`);
              if (service.is_default) {
                _push(ssrRenderComponent(_component_UBadge, {
                  color: "info",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Default`);
                    } else {
                      return [
                        createTextVNode("Default")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              if (service.needs_review) {
                _push(ssrRenderComponent(_component_UBadge, {
                  color: "warning",
                  variant: "soft",
                  size: "xs"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Review`);
                    } else {
                      return [
                        createTextVNode("Review")
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div><div class="mt-3 flex justify-between items-center"><span class="text-lg font-semibold text-gray-900 dark:text-white">KES ${ssrInterpolate(service.selling_price)}</span><span class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(service.charge_by.replace("PER_", "").toLowerCase())}</span></div><div class="mt-3 flex gap-2">`);
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                onClick: ($event) => editFinishingService(service)
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
                size: "xs",
                color: "error",
                onClick: ($event) => deleteFinishingService(service.id)
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
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(ssrRenderComponent(_component_CommonEmptyState, {
              title: "No finishing services",
              description: "Add services like lamination and binding."
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    onClick: ($event) => openFinishingModal()
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Add First Finishing Service`);
                      } else {
                        return [
                          createTextVNode("Add First Finishing Service")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      onClick: ($event) => openFinishingModal()
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add First Finishing Service")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(activeTab) === "discounts") {
          _push(`<div class="space-y-4"><div class="flex justify-between items-center"><p class="text-sm text-gray-600 dark:text-gray-400">Set up bulk discounts for large orders.</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
            onClick: ($event) => openDiscountModal()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "w-4 h-4 mr-1"
                }, null, _parent2, _scopeId));
                _push2(` Add Volume Discount `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-1"
                  }),
                  createTextVNode(" Add Volume Discount ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
          if (unref(pricingStore).volumeDiscounts.length) {
            _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
            ssrRenderList(unref(pricingStore).volumeDiscounts, (discount) => {
              _push(`<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"><h3 class="font-medium text-gray-900 dark:text-white">${ssrInterpolate(discount.name)}</h3><p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">${ssrInterpolate(discount.discount_percent)}% OFF</p><p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Min. ${ssrInterpolate(discount.min_quantity)} items</p><div class="mt-3 flex gap-2">`);
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
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
                size: "xs",
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
              _push(`</div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(ssrRenderComponent(_component_CommonEmptyState, {
              title: "No volume discounts",
              description: "Encourage bulk orders with volume discounts."
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UButton, {
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    onClick: ($event) => openDiscountModal()
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Add First Discount`);
                      } else {
                        return [
                          createTextVNode("Add First Discount")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_UButton, {
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      onClick: ($event) => openDiscountModal()
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Add First Discount")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(ssrRenderComponent(_component_CommonSimpleModal, {
        open: unref(printingModalOpen),
        title: unref(editingPrintingPrice) ? "Edit Printing Price" : "Add Printing Price",
        description: unref(editingPrintingPrice) ? "Edit price per printed side." : "Set price per printed side for paper size and color mode.",
        "onUpdate:open": onPrintingModalOpenChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(printingFormReady)) {
              _push2(ssrRenderComponent(_component_PricingPrintingPriceForm, {
                key: unref(editingPrintingPrice)?.id ?? "new",
                price: unref(editingPrintingPrice),
                "machine-options": unref(machineOptions),
                loading: unref(formLoading),
                onSubmit: submitPrintingPrice,
                onCancel: closePrintingModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(printingFormReady) ? (openBlock(), createBlock(_component_PricingPrintingPriceForm, {
                key: unref(editingPrintingPrice)?.id ?? "new",
                price: unref(editingPrintingPrice),
                "machine-options": unref(machineOptions),
                loading: unref(formLoading),
                onSubmit: submitPrintingPrice,
                onCancel: closePrintingModal
              }, null, 8, ["price", "machine-options", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CommonSimpleModal, {
        open: unref(paperModalOpen),
        title: unref(editingPaperPrice) ? "Edit Paper Price" : "Add Paper Price",
        description: unref(editingPaperPrice) ? "Edit paper price by GSM." : "Set paper price by GSM for your rate card.",
        "onUpdate:open": onPaperModalOpenChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(paperFormReady)) {
              _push2(ssrRenderComponent(_component_PricingPaperPriceForm, {
                key: unref(editingPaperPrice)?.id ?? "new",
                price: unref(editingPaperPrice),
                loading: unref(formLoading),
                onSubmit: submitPaperPrice,
                onCancel: closePaperModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(paperFormReady) ? (openBlock(), createBlock(_component_PricingPaperPriceForm, {
                key: unref(editingPaperPrice)?.id ?? "new",
                price: unref(editingPaperPrice),
                loading: unref(formLoading),
                onSubmit: submitPaperPrice,
                onCancel: closePaperModal
              }, null, 8, ["price", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CommonSimpleModal, {
        open: unref(finishingModalOpen),
        title: unref(editingFinishingService) ? "Edit Finishing Service" : "Add Finishing Service",
        description: unref(editingFinishingService) ? "Edit finishing service details." : "Add finishing services like lamination and binding.",
        "onUpdate:open": onFinishingModalOpenChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(finishingFormReady)) {
              _push2(ssrRenderComponent(_component_PricingFinishingServiceForm, {
                key: unref(editingFinishingService)?.id ?? "new",
                service: unref(editingFinishingService),
                loading: unref(formLoading),
                onSubmit: submitFinishingService,
                onCancel: closeFinishingModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(finishingFormReady) ? (openBlock(), createBlock(_component_PricingFinishingServiceForm, {
                key: unref(editingFinishingService)?.id ?? "new",
                service: unref(editingFinishingService),
                loading: unref(formLoading),
                onSubmit: submitFinishingService,
                onCancel: closeFinishingModal
              }, null, 8, ["service", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CommonSimpleModal, {
        open: unref(discountModalOpen),
        title: unref(editingDiscount) ? "Edit Volume Discount" : "Add Volume Discount",
        description: unref(editingDiscount) ? "Edit bulk discount details." : "Set up bulk discounts for large orders.",
        "onUpdate:open": onDiscountModalOpenChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(discountFormReady)) {
              _push2(ssrRenderComponent(_component_PricingVolumeDiscountForm, {
                key: unref(editingDiscount)?.id ?? "new",
                discount: unref(editingDiscount),
                loading: unref(formLoading),
                onSubmit: submitVolumeDiscount,
                onCancel: closeDiscountModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(discountFormReady) ? (openBlock(), createBlock(_component_PricingVolumeDiscountForm, {
                key: unref(editingDiscount)?.id ?? "new",
                discount: unref(editingDiscount),
                loading: unref(formLoading),
                onSubmit: submitVolumeDiscount,
                onCancel: closeDiscountModal
              }, null, 8, ["discount", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CommonSimpleModal, {
        open: unref(viewDefaultsOpen),
        title: "Starter pricing defaults",
        description: "Reference templates you can load into your shop. These are read-only.",
        "onUpdate:open": ($event) => viewDefaultsOpen.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6 max-h-[60vh] overflow-y-auto"${_scopeId}>`);
            if (unref(defaultsLoading)) {
              _push2(`<div class="py-8 text-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!--[-->`);
              if (unref(pricingStore).defaultPrinting.length) {
                _push2(`<div class="space-y-2"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>Printing</h4><div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm"${_scopeId}><table class="min-w-full"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Size</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Color</th><th class="px-3 py-2 text-right text-xs font-medium text-gray-500"${_scopeId}>Sell/side</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white"${_scopeId}><!--[-->`);
                ssrRenderList(unref(pricingStore).defaultPrinting, (t, i) => {
                  _push2(`<tr${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.sheet_size)}</td><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.color_mode)}</td><td class="px-3 py-2 text-right"${_scopeId}>KES ${ssrInterpolate(t.selling_price_per_side)}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(pricingStore).defaultPapers.length) {
                _push2(`<div class="space-y-2"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>Paper</h4><div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm"${_scopeId}><table class="min-w-full"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Size</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>GSM</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Type</th><th class="px-3 py-2 text-right text-xs font-medium text-gray-500"${_scopeId}>Sell</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white"${_scopeId}><!--[-->`);
                ssrRenderList(unref(pricingStore).defaultPapers, (t, i) => {
                  _push2(`<tr${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.sheet_size)}</td><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.gsm)} gsm</td><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.paper_type)}</td><td class="px-3 py-2 text-right"${_scopeId}>KES ${ssrInterpolate(t.selling_price)}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(pricingStore).defaultMaterials.length) {
                _push2(`<div class="space-y-2"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>Materials</h4><div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm"${_scopeId}><table class="min-w-full"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Material</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Unit</th><th class="px-3 py-2 text-right text-xs font-medium text-gray-500"${_scopeId}>Sell</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white"${_scopeId}><!--[-->`);
                ssrRenderList(unref(pricingStore).defaultMaterials, (t, i) => {
                  _push2(`<tr${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.material_name)}</td><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.unit)}</td><td class="px-3 py-2 text-right"${_scopeId}>KES ${ssrInterpolate(t.selling_price)}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(pricingStore).defaultFinishing.length) {
                _push2(`<div class="space-y-2"${_scopeId}><h4 class="text-sm font-semibold text-gray-900 dark:text-white"${_scopeId}>Finishing</h4><div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm"${_scopeId}><table class="min-w-full"${_scopeId}><thead class="bg-gray-50 dark:bg-gray-800"${_scopeId}><tr${_scopeId}><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Name</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-500"${_scopeId}>Category</th><th class="px-3 py-2 text-right text-xs font-medium text-gray-500"${_scopeId}>Sell</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white"${_scopeId}><!--[-->`);
                ssrRenderList(unref(pricingStore).defaultFinishing, (t, i) => {
                  _push2(`<tr${_scopeId}><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.name)}</td><td class="px-3 py-2"${_scopeId}>${ssrInterpolate(t.category)}</td><td class="px-3 py-2 text-right"${_scopeId}>KES ${ssrInterpolate(t.selling_price)}</td></tr>`);
                });
                _push2(`<!--]--></tbody></table></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (!unref(hasAnyDefaults)) {
                _push2(`<div class="py-6 text-center text-sm text-gray-500 dark:text-gray-400"${_scopeId}> No default templates available. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6 max-h-[60vh] overflow-y-auto" }, [
                unref(defaultsLoading) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "py-8 text-center"
                }, [
                  createVNode(_component_CommonLoadingSpinner)
                ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  unref(pricingStore).defaultPrinting.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-2"
                  }, [
                    createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, "Printing"),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm" }, [
                      createVNode("table", { class: "min-w-full" }, [
                        createVNode("thead", { class: "bg-gray-50 dark:bg-gray-800" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Size"),
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Color"),
                            createVNode("th", { class: "px-3 py-2 text-right text-xs font-medium text-gray-500" }, "Sell/side")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingStore).defaultPrinting, (t, i) => {
                            return openBlock(), createBlock("tr", {
                              key: `p-${i}`
                            }, [
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.sheet_size), 1),
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.color_mode), 1),
                              createVNode("td", { class: "px-3 py-2 text-right" }, "KES " + toDisplayString(t.selling_price_per_side), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(pricingStore).defaultPapers.length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-2"
                  }, [
                    createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, "Paper"),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm" }, [
                      createVNode("table", { class: "min-w-full" }, [
                        createVNode("thead", { class: "bg-gray-50 dark:bg-gray-800" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Size"),
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "GSM"),
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Type"),
                            createVNode("th", { class: "px-3 py-2 text-right text-xs font-medium text-gray-500" }, "Sell")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingStore).defaultPapers, (t, i) => {
                            return openBlock(), createBlock("tr", {
                              key: `pa-${i}`
                            }, [
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.sheet_size), 1),
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.gsm) + " gsm", 1),
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.paper_type), 1),
                              createVNode("td", { class: "px-3 py-2 text-right" }, "KES " + toDisplayString(t.selling_price), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(pricingStore).defaultMaterials.length ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "space-y-2"
                  }, [
                    createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, "Materials"),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm" }, [
                      createVNode("table", { class: "min-w-full" }, [
                        createVNode("thead", { class: "bg-gray-50 dark:bg-gray-800" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Material"),
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Unit"),
                            createVNode("th", { class: "px-3 py-2 text-right text-xs font-medium text-gray-500" }, "Sell")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingStore).defaultMaterials, (t, i) => {
                            return openBlock(), createBlock("tr", {
                              key: `m-${i}`
                            }, [
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.material_name), 1),
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.unit), 1),
                              createVNode("td", { class: "px-3 py-2 text-right" }, "KES " + toDisplayString(t.selling_price), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  unref(pricingStore).defaultFinishing.length ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "space-y-2"
                  }, [
                    createVNode("h4", { class: "text-sm font-semibold text-gray-900 dark:text-white" }, "Finishing"),
                    createVNode("div", { class: "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm" }, [
                      createVNode("table", { class: "min-w-full" }, [
                        createVNode("thead", { class: "bg-gray-50 dark:bg-gray-800" }, [
                          createVNode("tr", null, [
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Name"),
                            createVNode("th", { class: "px-3 py-2 text-left text-xs font-medium text-gray-500" }, "Category"),
                            createVNode("th", { class: "px-3 py-2 text-right text-xs font-medium text-gray-500" }, "Sell")
                          ])
                        ]),
                        createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(pricingStore).defaultFinishing, (t, i) => {
                            return openBlock(), createBlock("tr", {
                              key: `f-${i}`
                            }, [
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.name), 1),
                              createVNode("td", { class: "px-3 py-2" }, toDisplayString(t.category), 1),
                              createVNode("td", { class: "px-3 py-2 text-right" }, "KES " + toDisplayString(t.selling_price), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])
                  ])) : createCommentVNode("", true),
                  !unref(hasAnyDefaults) ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  }, " No default templates available. ")) : createCommentVNode("", true)
                ], 64))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/pricing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BHeh6aT_.mjs.map
