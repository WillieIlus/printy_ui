import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { f as useRoute, e as useToast, d as _sfc_main$9, a as _sfc_main$f, I as extractApiFeedback, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-C1UUP90f.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6 } from './AdminWorkspaceFormPanel-D166ogpE.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-CXwkCB6L.mjs';
import { _ as _sfc_main$3 } from './Alert-BD7KCbft.mjs';
import { _ as __nuxt_component_4$1 } from './InlineError-CDgd_EMb.mjs';
import { _ as __nuxt_component_4$2 } from './FormSelect-WoeVYZuO.mjs';
import { _ as __nuxt_component_5$1 } from './FormTextarea-VR2V5fgE.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { object, string, number } from 'yup';
import { u as usePricingStore } from './pricing-C5Uphe2w.mjs';
import { u as useSellerStore } from './seller-B_HIq8FR.mjs';
import { u as useCurrencyFormatter } from './useCurrencyFormatter-BbngrNPq.mjs';
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
import './formUi-DTjrawz_.mjs';
import './SelectMenu-DDFAjir1.mjs';
import './Input-DZEAnFef.mjs';
import './seller-B7IxAeLp.mjs';
import './formatters-Cc_7PG6h.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FinishingServiceForm",
  __ssrInlineRender: true,
  props: {
    service: {},
    loading: { type: Boolean },
    errorMessage: {},
    fieldErrors: {}
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const editing = computed(() => !!props.service);
    const categoryOptions = [
      { label: "Lamination", value: "LAMINATION" },
      { label: "Binding", value: "BINDING" },
      { label: "Cutting", value: "CUTTING" },
      { label: "Folding", value: "FOLDING" },
      { label: "Other", value: "OTHER" }
    ];
    const chargeUnitOptions = [
      { label: "Per Piece", value: "PER_PIECE" },
      { label: "Per Side", value: "PER_SIDE" },
      { label: "Per Sheet", value: "PER_SHEET" },
      { label: "Per Side Per Sheet", value: "PER_SIDE_PER_SHEET" },
      { label: "Per Square Meter", value: "PER_SQM" },
      { label: "Flat", value: "FLAT" }
    ];
    const billingBasisOptions = [
      { label: "Per Sheet", value: "per_sheet" },
      { label: "Per Piece", value: "per_piece" },
      { label: "Flat Per Job", value: "flat_per_job" },
      { label: "Flat Per Group", value: "flat_per_group" },
      { label: "Flat Per Line", value: "flat_per_line" }
    ];
    const sideModeOptions = [
      { label: "Ignore Sides", value: "ignore_sides" },
      { label: "Per Selected Side", value: "per_selected_side" }
    ];
    const initialValues = computed(() => ({
      name: props.service?.name ?? "",
      category: props.service?.category ?? "OTHER",
      charge_unit: props.service?.charge_unit ?? "PER_PIECE",
      billing_basis: props.service?.billing_basis ?? "per_piece",
      side_mode: props.service?.side_mode ?? "ignore_sides",
      price: props.service?.price ?? "",
      double_side_price: props.service?.double_side_price ?? "",
      setup_fee: props.service?.setup_fee ?? "",
      minimum_charge: props.service?.minimum_charge ?? "",
      min_qty: props.service?.min_qty ?? "",
      help_text: props.service?.help_text ?? ""
    }));
    const schema = object({
      name: string().required("Name is required"),
      category: string().oneOf(["LAMINATION", "BINDING", "CUTTING", "FOLDING", "OTHER"]).required("Category is required"),
      charge_unit: string().oneOf(["PER_PIECE", "PER_SIDE", "PER_SHEET", "PER_SIDE_PER_SHEET", "PER_SQM", "FLAT"]).required("Charge unit is required"),
      billing_basis: string().oneOf(["per_sheet", "per_piece", "flat_per_job", "flat_per_group", "flat_per_line"]).required("Billing basis is required"),
      side_mode: string().oneOf(["ignore_sides", "per_selected_side"]).required("Side mode is required"),
      price: string().required("Price is required"),
      double_side_price: string().optional(),
      setup_fee: string().optional(),
      minimum_charge: string().optional(),
      min_qty: number().transform((value, originalValue) => originalValue === "" ? void 0 : value).nullable().optional(),
      help_text: string().optional()
    });
    function onSubmit(values) {
      emit("submit", values);
    }
    function fieldError(field) {
      return props.fieldErrors?.[field] ?? null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_UAlert = _sfc_main$3;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_FormsFormSelect = __nuxt_component_4$2;
      const _component_FormsFormTextarea = __nuxt_component_5$1;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save finishing service",
                description: __props.errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "name",
              label: "Service Name",
              placeholder: "e.g. Matt Lamination A3",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("name")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "category",
              label: "Category",
              options: categoryOptions,
              placeholder: "Select category",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("category")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "charge_unit",
              label: "Charge Unit",
              options: chargeUnitOptions,
              placeholder: "Select charge unit",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("charge_unit")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "billing_basis",
              label: "Billing Basis",
              options: billingBasisOptions,
              placeholder: "Select billing basis",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("billing_basis")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "side_mode",
              label: "Side Mode",
              options: sideModeOptions,
              placeholder: "Select side mode",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("side_mode")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "price",
              label: "Price",
              type: "number",
              placeholder: "0.00",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("price")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "double_side_price",
              label: "Double-side Price",
              type: "number",
              placeholder: "Optional"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("double_side_price")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "setup_fee",
              label: "Setup Fee",
              type: "number",
              placeholder: "Optional"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("setup_fee")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "minimum_charge",
              label: "Minimum Charge",
              type: "number",
              placeholder: "Optional"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("minimum_charge")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "min_qty",
              label: "Minimum Quantity",
              type: "number",
              placeholder: "Optional"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("min_qty")
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormTextarea, {
              name: "help_text",
              label: "Help Text",
              placeholder: "Optional customer-facing explanation"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("help_text")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--p-border)] pt-4 sm:flex-row sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "ghost",
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
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: __props.loading || !meta.valid,
              class: "w-full sm:w-auto"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Finishing Service")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Finishing Service"), 1)
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
                  title: "Could not save finishing service",
                  description: __props.errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode(_component_FormsFormInput, {
                  name: "name",
                  label: "Service Name",
                  placeholder: "e.g. Matt Lamination A3",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("name")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormSelect, {
                  name: "category",
                  label: "Category",
                  options: categoryOptions,
                  placeholder: "Select category",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("category")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormSelect, {
                  name: "charge_unit",
                  label: "Charge Unit",
                  options: chargeUnitOptions,
                  placeholder: "Select charge unit",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("charge_unit")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormSelect, {
                  name: "billing_basis",
                  label: "Billing Basis",
                  options: billingBasisOptions,
                  placeholder: "Select billing basis",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("billing_basis")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormSelect, {
                  name: "side_mode",
                  label: "Side Mode",
                  options: sideModeOptions,
                  placeholder: "Select side mode",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("side_mode")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormInput, {
                  name: "price",
                  label: "Price",
                  type: "number",
                  placeholder: "0.00",
                  required: ""
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("price")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormInput, {
                  name: "double_side_price",
                  label: "Double-side Price",
                  type: "number",
                  placeholder: "Optional"
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("double_side_price")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormInput, {
                  name: "setup_fee",
                  label: "Setup Fee",
                  type: "number",
                  placeholder: "Optional"
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("setup_fee")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormInput, {
                  name: "minimum_charge",
                  label: "Minimum Charge",
                  type: "number",
                  placeholder: "Optional"
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("minimum_charge")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormInput, {
                  name: "min_qty",
                  label: "Minimum Quantity",
                  type: "number",
                  placeholder: "Optional"
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("min_qty")
                }, null, 8, ["message"]),
                createVNode(_component_FormsFormTextarea, {
                  name: "help_text",
                  label: "Help Text",
                  placeholder: "Optional customer-facing explanation"
                }),
                createVNode(_component_DashboardInlineError, {
                  message: fieldError("help_text")
                }, null, 8, ["message"])
              ]),
              createVNode("div", { class: "mt-6 flex flex-col-reverse gap-2 border-t border-[var(--p-border)] pt-4 sm:flex-row sm:justify-end" }, [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "ghost",
                  class: "w-full sm:w-auto",
                  onClick: ($event) => _ctx.$emit("cancel")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Cancel ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  type: "submit",
                  color: "primary",
                  loading: __props.loading,
                  disabled: __props.loading || !meta.valid,
                  class: "w-full sm:w-auto"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Finishing Service"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pricing/FinishingServiceForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "PricingFinishingServiceForm" });
const formHash = "#finishing-form";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const pricingStore = usePricingStore();
    const sellerStore = useSellerStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const { formatMoney } = useCurrencyFormatter(computed(() => sellerStore.getShopBySlug(slug.value)?.currency ?? null));
    const loading = ref(true);
    const panelOpen = ref(false);
    const saving = ref(false);
    const editingFinishing = ref(null);
    const errorMessage = ref(null);
    const fieldErrors = ref({});
    const items = computed(() => pricingStore.finishingServices);
    function openCreatePanel(options) {
      editingFinishing.value = null;
      errorMessage.value = null;
      fieldErrors.value = {};
      panelOpen.value = true;
      if (options?.updateHash !== false) {
        void syncHash(formHash);
      }
    }
    function editFinishing(item) {
      editingFinishing.value = item;
      errorMessage.value = null;
      fieldErrors.value = {};
      panelOpen.value = true;
      void syncHash(formHash);
    }
    function closePanel() {
      panelOpen.value = false;
      editingFinishing.value = null;
      errorMessage.value = null;
      fieldErrors.value = {};
      if (route.hash === formHash) {
        void syncHash("");
      }
    }
    async function submitFinishing(data) {
      saving.value = true;
      errorMessage.value = null;
      fieldErrors.value = {};
      try {
        if (editingFinishing.value) {
          await pricingStore.updateFinishingService(slug.value, editingFinishing.value.id, data);
          toast.add({ title: "Saved", description: "Finishing updated successfully.", color: "success" });
        } else {
          await pricingStore.createFinishingService(slug.value, data);
          toast.add({ title: "Saved", description: "Finishing added successfully.", color: "success" });
        }
        closePanel();
      } catch (error) {
        const feedback = extractApiFeedback(error, "We could not save this finishing service right now.");
        errorMessage.value = feedback.message;
        fieldErrors.value = feedback.fieldErrors;
      } finally {
        saving.value = false;
      }
    }
    async function deleteFinishing(id) {
      if (!confirm("Delete this finishing service?")) return;
      try {
        await pricingStore.deleteFinishingService(slug.value, id);
        toast.add({ title: "Deleted", description: "Finishing removed.", color: "success" });
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Failed to delete finishing.", color: "error" });
      }
    }
    watch(panelOpen, (open) => {
      if (!open) return;
    });
    watch(() => route.hash, (hash) => {
      if (hash === formHash && !panelOpen.value) {
        openCreatePanel({ updateHash: false });
        return;
      }
      if (!hash && panelOpen.value) {
        closePanel();
      }
    });
    function syncHash(hash) {
      return navigateTo({
        path: route.path,
        query: route.query,
        hash: hash || void 0
      }, { replace: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardSkeletonState = __nuxt_component_4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardAdminWorkspaceFormPanel = __nuxt_component_6;
      const _component_PricingFinishingServiceForm = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Finishings",
        subtitle: "Manage finishing services here. Keep post-press setup separate from pricing and product pages."
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
                  _push3(` Add Finishing `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Finishing ")
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
                  createTextVNode(" Add Finishing ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]"><div class="space-y-4"><div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">Finishing services</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Lamination, binding, cutting, and similar services now have a dedicated section.</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(items).length ? "success" : "warning",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(items).length)} services`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(items).length) + " services", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 4
        }, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(item.name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(item.category)}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: item.is_active ? "success" : "neutral"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm text-[var(--p-text-muted)]">Backend billing rule</p><p class="mt-1 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(item.charge_unit)} · ${ssrInterpolate(item.billing_basis)} · ${ssrInterpolate(item.side_mode)}</p><p class="mt-3 text-sm text-[var(--p-text-muted)]">Price</p><p class="mt-1 text-lg font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(formatMoney)(item.price))}</p></div><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editFinishing(item)
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
            onClick: ($event) => deleteFinishing(item.id)
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
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_DashboardEmptyState, {
          title: "No finishing services yet",
          description: "Add the post-press services your team actually offers.",
          icon: "i-lucide-scissors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                onClick: openCreatePanel
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add first finishing`);
                  } else {
                    return [
                      createTextVNode("Add first finishing")
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
                    createTextVNode("Add first finishing")
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
        _push(`<div id="finishing-form" tabindex="-1">`);
        _push(ssrRenderComponent(_component_DashboardAdminWorkspaceFormPanel, {
          title: unref(editingFinishing) ? "Edit Finishing" : "Add Finishing",
          description: unref(editingFinishing) ? "Update this finishing service." : "Create a finishing service for this shop.",
          onClose: closePanel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_PricingFinishingServiceForm, {
                key: unref(editingFinishing)?.id ?? "new-finishing",
                service: unref(editingFinishing),
                loading: unref(saving),
                "error-message": unref(errorMessage),
                "field-errors": unref(fieldErrors),
                onSubmit: submitFinishing,
                onCancel: closePanel
              }, null, _parent2, _scopeId));
            } else {
              return [
                (openBlock(), createBlock(_component_PricingFinishingServiceForm, {
                  key: unref(editingFinishing)?.id ?? "new-finishing",
                  service: unref(editingFinishing),
                  loading: unref(saving),
                  "error-message": unref(errorMessage),
                  "field-errors": unref(fieldErrors),
                  onSubmit: submitFinishing,
                  onCancel: closePanel
                }, null, 8, ["service", "loading", "error-message", "field-errors"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/finishing/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bh1to8rY.mjs.map
