import { _ as __nuxt_component_0 } from './DashboardPageHeader-5_E3NIzR.mjs';
import { g as useRoute, i as useToast, d as _sfc_main$9, a as _sfc_main$f, v as extractApiFeedback } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-xP9ZTQag.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6 } from './AdminWorkspaceFormPanel-MfBDvykR.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-Cb8fwOas.mjs';
import { _ as _sfc_main$3 } from './Alert-CRX5veBl.mjs';
import { _ as __nuxt_component_4$1 } from './FormSelect-D72CKzmZ.mjs';
import { _ as __nuxt_component_4$2 } from './InlineError-CDgd_EMb.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { u as usePricingStore } from './pricing-BwHzPGP8.mjs';
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
import './SelectMenu-CJtBgKsS.mjs';
import './Input-C16lzpZD.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PaperPriceForm",
  __ssrInlineRender: true,
  props: {
    price: {},
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
    const paperTypeOptions = [
      { label: "Coated", value: "COATED" },
      { label: "Uncoated", value: "UNCOATED" },
      { label: "Recycled", value: "RECYCLED" },
      { label: "Gloss", value: "GLOSS" },
      { label: "Matte", value: "MATTE" },
      { label: "Other", value: "OTHER" }
    ];
    const initialValues = computed(() => ({
      sheet_size: props.price?.sheet_size ?? "A3",
      gsm: props.price?.gsm ?? "",
      paper_type: props.price?.paper_type ?? "UNCOATED",
      buying_price: props.price?.buying_price ?? "",
      selling_price: props.price?.selling_price ?? ""
    }));
    const schema = object({
      sheet_size: string().oneOf(["A4", "A3", "SRA3", "A2", "A1", "A0", "CUSTOM"]).required("Size is required"),
      gsm: number().min(60, "Min 60 GSM").max(500, "Max 500 GSM").required("GSM is required"),
      paper_type: string().oneOf(["COATED", "UNCOATED", "RECYCLED", "GLOSS", "MATTE", "OTHER"]).required("Paper type is required"),
      buying_price: string().required("Buying price is required"),
      selling_price: string().required("Selling price is required")
    });
    function fieldError(field) {
      return props.fieldErrors?.[field] ?? null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$3;
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
                title: "Could not save paper price",
                description: __props.errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<table class="w-full text-sm"${_scopeId}><tbody class="divide-y divide-[var(--p-border-dim)]"${_scopeId}><tr${_scopeId}><td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Sheet Size</td><td class="py-3"${_scopeId}>`);
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
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>GSM (weight)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "gsm",
              label: "GSM (weight)",
              type: "number",
              placeholder: "e.g. 130, 150, 200",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("gsm")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Paper Type</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "paper_type",
              label: "Paper Type",
              options: paperTypeOptions,
              placeholder: "Select type",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("paper_type")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Buying Price (per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price",
              label: "Buying Price (per sheet)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("buying_price")
            }, null, _parent2, _scopeId));
            _push2(`</td></tr><tr${_scopeId}><td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]"${_scopeId}>Selling Price (per sheet)</td><td class="py-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price",
              label: "Selling Price (per sheet)",
              type: "number",
              placeholder: "0.00",
              required: "",
              "hide-label": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("selling_price")
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
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Paper Price")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Paper Price"), 1)
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
                  title: "Could not save paper price",
                  description: __props.errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode("table", { class: "w-full text-sm" }, [
                  createVNode("tbody", { class: "divide-y divide-[var(--p-border-dim)]" }, [
                    createVNode("tr", null, [
                      createVNode("td", { class: "w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Sheet Size"),
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
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "GSM (weight)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "gsm",
                          label: "GSM (weight)",
                          type: "number",
                          placeholder: "e.g. 130, 150, 200",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("gsm")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Paper Type"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormSelect, {
                          name: "paper_type",
                          label: "Paper Type",
                          options: paperTypeOptions,
                          placeholder: "Select type",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("paper_type")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Buying Price (per sheet)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "buying_price",
                          label: "Buying Price (per sheet)",
                          type: "number",
                          placeholder: "0.00",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("buying_price")
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("tr", null, [
                      createVNode("td", { class: "py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]" }, "Selling Price (per sheet)"),
                      createVNode("td", { class: "py-3" }, [
                        createVNode(_component_FormsFormInput, {
                          name: "selling_price",
                          label: "Selling Price (per sheet)",
                          type: "number",
                          placeholder: "0.00",
                          required: "",
                          "hide-label": ""
                        }),
                        createVNode(_component_DashboardInlineError, {
                          message: fieldError("selling_price")
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
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Paper Price"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/PaperPriceForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "PricingPaperPriceForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const pricingStore = usePricingStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const loading = ref(true);
    const panelOpen = ref(false);
    const saving = ref(false);
    const editingPaper = ref(null);
    const errorMessage = ref(null);
    const fieldErrors = ref({});
    const items = computed(() => pricingStore.paperPrices);
    function openCreatePanel() {
      editingPaper.value = null;
      errorMessage.value = null;
      fieldErrors.value = {};
      panelOpen.value = true;
    }
    function editPaper(item) {
      editingPaper.value = item;
      errorMessage.value = null;
      fieldErrors.value = {};
      panelOpen.value = true;
    }
    function closePanel() {
      panelOpen.value = false;
      editingPaper.value = null;
      errorMessage.value = null;
      fieldErrors.value = {};
    }
    async function submitPaper(data) {
      saving.value = true;
      errorMessage.value = null;
      fieldErrors.value = {};
      try {
        if (editingPaper.value) {
          await pricingStore.updatePaperPrice(slug.value, editingPaper.value.id, data);
          toast.add({ title: "Saved", description: "Paper updated successfully.", color: "success" });
        } else {
          await pricingStore.createPaperPrice(slug.value, data);
          toast.add({ title: "Saved", description: "Paper added successfully.", color: "success" });
        }
        closePanel();
      } catch (error) {
        const feedback = extractApiFeedback(error, "We could not save this paper right now.");
        errorMessage.value = feedback.message;
        fieldErrors.value = feedback.fieldErrors;
      } finally {
        saving.value = false;
      }
    }
    async function deletePaper(id) {
      if (!confirm("Delete this paper stock line?")) return;
      try {
        await pricingStore.deletePaperPrice(slug.value, id);
        toast.add({ title: "Deleted", description: "Paper removed.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete paper.", color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardAdminWorkspaceFormPanel = __nuxt_component_6;
      const _component_PricingPaperPriceForm = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Paper Stock",
        subtitle: "Manage paper stock here. Add and edit paper lines from this page only."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
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
                  _push3(` Add Paper `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Paper ")
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
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add Paper ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]"><div class="space-y-4"><div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">Stock list</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Paper setup is separate from pricing so stock management has a clear home.</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(items).length ? "success" : "warning",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(items).length)} paper lines`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(items).length) + " paper lines", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "table",
          "show-header": false
        }, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Size</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Type</th><th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">GSM</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Selling Price</th><th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<tr class="bg-[var(--p-surface)]"><td class="px-4 py-4 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(item.sheet_size)}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(item.paper_type)}</td><td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(item.gsm)} gsm</td><td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">KES ${ssrInterpolate(item.selling_price)}</td><td class="px-4 py-4"><div class="flex justify-end gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editPaper(item)
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
            onClick: ($event) => deletePaper(item.id)
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
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No paper stock yet",
          description: "Add the paper lines you actually keep or price against. This page now owns that workflow.",
          icon: "i-lucide-file-stack"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                onClick: openCreatePanel
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add first paper`);
                  } else {
                    return [
                      createTextVNode("Add first paper")
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
                    createTextVNode("Add first paper")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
      if (unref(panelOpen)) {
        _push(ssrRenderComponent(_component_DashboardAdminWorkspaceFormPanel, {
          title: unref(editingPaper) ? "Edit Paper" : "Add Paper",
          description: unref(editingPaper) ? "Update this paper stock line." : "Create a new paper stock line for this shop.",
          onClose: closePanel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_PricingPaperPriceForm, {
                key: unref(editingPaper)?.id ?? "new-paper",
                price: unref(editingPaper),
                loading: unref(saving),
                "error-message": unref(errorMessage),
                "field-errors": unref(fieldErrors),
                onSubmit: submitPaper,
                onCancel: closePanel
              }, null, _parent2, _scopeId));
            } else {
              return [
                (openBlock(), createBlock(_component_PricingPaperPriceForm, {
                  key: unref(editingPaper)?.id ?? "new-paper",
                  price: unref(editingPaper),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitPaper,
                  onCancel: closePanel
                }, null, 8, ["price", "loading", "error-message", "field-errors"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/papers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DbQ1DvFp.mjs.map
