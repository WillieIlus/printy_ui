import { _ as __nuxt_component_0 } from './DashboardPageHeader-C_rdBHa1.mjs';
import { e as useRoute, f as useToast, c as _sfc_main$9, a as _sfc_main$f, s as useNuxtApp, A as API } from './server.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as __nuxt_component_2 } from './SectionCard-CE2OEmkZ.mjs';
import { defineComponent, computed, ref, watch, nextTick, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, isRef, createCommentVNode, createSlots, renderSlot, withDirectives, vModelSelect, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$4 } from './Badge-BGajth1Y.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_5$1 } from './DashboardModalForm-DAnPxHoR.mjs';
import { F as Form, _ as __nuxt_component_1 } from './FormInput-DJBpPoj7.mjs';
import { _ as __nuxt_component_1$1 } from './FormSelect-XAQW_DhA.mjs';
import { object, string } from 'yup';
import { _ as __nuxt_component_0$1 } from './SimpleModal-knQEbNC5.mjs';
import { defineStore } from 'pinia';
import { s as setInterval } from './interval-DiSDr_Za.mjs';
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
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './SelectMenu-iYI0pXjV.mjs';
import './Input-CScRok4n.mjs';
import './api-error-D1IYk86E.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DataTableCard",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardSectionCard = __nuxt_component_2;
      _push(ssrRenderComponent(_component_DashboardSectionCard, mergeProps({
        title: __props.title,
        "col-span": 12
      }, _attrs), createSlots({
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="overflow-x-auto -mx-5 -mt-5"${_scopeId}><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}><thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/95"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "thead", {}, null, _push2, _parent2, _scopeId);
            _push2(`</thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "tbody", {}, null, _push2, _parent2, _scopeId);
            _push2(`</tbody></table></div>`);
            if (_ctx.$slots.pagination) {
              _push2(`<div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700/60"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "pagination", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "overflow-x-auto -mx-5 -mt-5" }, [
                createVNode("table", { class: "min-w-full divide-y divide-gray-200 dark:divide-gray-700" }, [
                  createVNode("thead", { class: "sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/95" }, [
                    renderSlot(_ctx.$slots, "thead")
                  ]),
                  createVNode("tbody", { class: "divide-y divide-gray-200 dark:divide-gray-700" }, [
                    renderSlot(_ctx.$slots, "tbody")
                  ])
                ])
              ]),
              _ctx.$slots.pagination ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700/60"
              }, [
                renderSlot(_ctx.$slots, "pagination")
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 2
      }, [
        _ctx.$slots.toolbar ? {
          name: "card-header",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-wrap items-center justify-between gap-3"${_scopeId}><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(__props.title)}</h3><div class="flex items-center gap-2"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "toolbar", {}, null, _push2, _parent2, _scopeId);
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("h3", { class: "text-sm font-medium text-gray-500 dark:text-gray-400" }, toDisplayString(__props.title), 1),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    renderSlot(_ctx.$slots, "toolbar")
                  ])
                ])
              ];
            }
          }),
          key: "0"
        } : __props.title ? {
          name: "card-header",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400"${_scopeId}>${ssrInterpolate(__props.title)}</h3>`);
            } else {
              return [
                createVNode("h3", { class: "text-sm font-medium text-gray-500 dark:text-gray-400" }, toDisplayString(__props.title), 1)
              ];
            }
          }),
          key: "1"
        } : void 0
      ]), _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/DataTableCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "DashboardDataTableCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MachineForm",
  __ssrInlineRender: true,
  props: {
    machine: {},
    loading: { type: Boolean },
    canAddPrinting: { type: Boolean },
    canAddFinishing: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const PRINTING_TYPES = [
      { label: "Digital Printer", value: "DIGITAL" },
      { label: "Large Format", value: "LARGE_FORMAT" },
      { label: "Offset Press", value: "OFFSET" }
    ];
    const FINISHING_TYPE = { label: "Finishing Equipment", value: "FINISHING" };
    const customTypes = ref([]);
    const typeOptions = computed(() => {
      const canPrint = props.canAddPrinting !== false;
      const canFinish = props.canAddFinishing !== false;
      const base = canPrint ? [...PRINTING_TYPES] : [];
      if (canFinish) base.push(FINISHING_TYPE);
      const allowed = base.length ? base : [...PRINTING_TYPES, FINISHING_TYPE];
      return [...allowed, ...customTypes.value];
    });
    function formatCreateValue(raw) {
      const label = raw.trim();
      if (!label) return "";
      return label.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
    }
    function onCreateType(value) {
      const val = formatCreateValue(value);
      if (!val || customTypes.value.some((o) => o.value === val)) return;
      customTypes.value = [...customTypes.value, { label: value.trim(), value: val }];
    }
    const schema = object({
      name: string().required("Name is required").max(150),
      machine_type: string().default("DIGITAL")
    });
    const initialValues = computed(() => ({
      name: props.machine?.name ?? "",
      machine_type: props.machine?.machine_type ?? props.machine?.type ?? "DIGITAL"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormInput = __nuxt_component_1;
      const _component_FormsFormSelect = __nuxt_component_1$1;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: (values) => _ctx.$emit("submit", values)
      }, _attrs), {
        default: withCtx(({}, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "name",
              label: "Machine name",
              placeholder: "e.g. Xerox Versant 80",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "machine_type",
              label: "Type",
              options: unref(typeOptions),
              placeholder: "Select type",
              portal: "body",
              "create-item": { when: "always" },
              "format-create-value": formatCreateValue,
              onCreate: onCreateType
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end"${_scopeId}>`);
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
              disabled: __props.loading,
              class: "w-full sm:w-auto"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.machine ? "Update" : "Add")} machine `);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.machine ? "Update" : "Add") + " machine ", 1)
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
                  label: "Machine name",
                  placeholder: "e.g. Xerox Versant 80",
                  required: ""
                }),
                createVNode(_component_FormsFormSelect, {
                  name: "machine_type",
                  label: "Type",
                  options: unref(typeOptions),
                  placeholder: "Select type",
                  portal: "body",
                  "create-item": { when: "always" },
                  "format-create-value": formatCreateValue,
                  onCreate: onCreateType
                }, null, 8, ["options"]),
                createVNode("div", { class: "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end" }, [
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
                    disabled: __props.loading,
                    class: "w-full sm:w-auto"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.machine ? "Update" : "Add") + " machine ", 1)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/machines/MachineForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$2, { __name: "MachinesMachineForm" });
const useSubscriptionStore = defineStore("subscription", {
  state: () => ({
    byShop: {},
    plans: [],
    loading: false,
    plansLoading: false
  }),
  getters: {
    getSubscription: (state) => (shopSlug) => state.byShop[shopSlug] ?? null,
    canAddPrintingMachine: (state) => (shopSlug) => state.byShop[shopSlug]?.can_add_printing_machine ?? true,
    canAddFinishingMachine: (state) => (shopSlug) => state.byShop[shopSlug]?.can_add_finishing_machine ?? true
  },
  actions: {
    async fetchSubscription(shopSlug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data = await $api(API.shopSubscription(shopSlug));
        this.byShop = { ...this.byShop, [shopSlug]: data };
        return data;
      } catch (err) {
        const next = { ...this.byShop };
        delete next[shopSlug];
        this.byShop = next;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchPlans() {
      this.plansLoading = true;
      try {
        const { $api } = useNuxtApp();
        this.plans = await $api(API.plans());
        return this.plans;
      } catch (err) {
        throw err;
      } finally {
        this.plansLoading = false;
      }
    },
    clearShop(shopSlug) {
      const next = { ...this.byShop };
      delete next[shopSlug];
      this.byShop = next;
    }
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UpgradeModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    shopSlug: {},
    reason: {},
    plans: {}
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useSubscriptionStore();
    const toast = useToast();
    const selectedPlanId = ref(null);
    const phone = ref("");
    const initiating = ref(false);
    const paymentId = ref(null);
    const paymentFailed = ref(false);
    let pollInterval = null;
    watch(() => props.open, (open) => {
      if (open) {
        selectedPlanId.value = props.plans[0]?.id ?? null;
        phone.value = "";
        paymentId.value = null;
        paymentFailed.value = false;
      } else {
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      }
    }, { immediate: true });
    watch(() => props.plans, (plans) => {
      if (plans.length && !selectedPlanId.value) {
        selectedPlanId.value = plans[0].id;
      }
    }, { immediate: true });
    async function initiatePayment() {
      if (!selectedPlanId.value || !phone.value.trim()) return;
      initiating.value = true;
      try {
        const { $api } = useNuxtApp();
        const res = await $api(API.shopStkPush(props.shopSlug), {
          method: "POST",
          body: { plan_id: selectedPlanId.value, phone: phone.value.trim() }
        });
        paymentId.value = res.id;
        toast.add({ title: "Check your phone", description: res.message });
        startPolling();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to initiate payment";
        toast.add({ title: "Error", description: msg, color: "error" });
      } finally {
        initiating.value = false;
      }
    }
    function startPolling() {
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CommonSimpleModal = __nuxt_component_0$1;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(_component_CommonSimpleModal, mergeProps({
        open: __props.open,
        title: "Upgrade plan",
        description: "Pay via M-Pesa to unlock more machines.",
        "onUpdate:open": ($event) => _ctx.$emit("update:open", $event)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (__props.reason) {
              _push2(`<p class="text-sm text-amber-600 dark:text-amber-400"${_scopeId}>${ssrInterpolate(__props.reason)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (!unref(paymentId)) {
              _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> Select plan </label><select class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"${ssrIncludeBooleanAttr(!__props.plans.length) ? " disabled" : ""}${_scopeId}>`);
              if (!__props.plans.length) {
                _push2(`<option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPlanId)) ? ssrLooseContain(unref(selectedPlanId), "") : ssrLooseEqual(unref(selectedPlanId), "")) ? " selected" : ""}${_scopeId}>No plans available</option>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(__props.plans, (p) => {
                _push2(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedPlanId)) ? ssrLooseContain(unref(selectedPlanId), p.id) : ssrLooseEqual(unref(selectedPlanId), p.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(p.name)} — KES ${ssrInterpolate(p.price)}/${ssrInterpolate((p.billing_period ?? "MONTHLY").toLowerCase())} (${ssrInterpolate(p.max_printing_machines || "∞")} printing, ${ssrInterpolate(p.max_finishing_machines || "∞")} finishing) </option>`);
              });
              _push2(`<!--]--></select>`);
              if (!__props.plans.length) {
                _push2(`<p class="mt-1 text-xs text-amber-600 dark:text-amber-400"${_scopeId}> Plans could not be loaded. Check your connection and try again. </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> M-Pesa phone number </label><input${ssrRenderAttr("value", unref(phone))} type="tel" placeholder="0712345678" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"${_scopeId}></div><div class="flex justify-end gap-2 pt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "outline",
                onClick: ($event) => _ctx.$emit("update:open", false)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Cancel`);
                  } else {
                    return [
                      createTextVNode("Cancel")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UButton, {
                class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                loading: unref(initiating),
                disabled: !unref(selectedPlanId) || !unref(phone).trim() || unref(initiating) || !__props.plans.length,
                onClick: initiatePayment
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Pay via M-Pesa `);
                  } else {
                    return [
                      createTextVNode(" Pay via M-Pesa ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}> Complete payment on your phone. Waiting for confirmation... </p><div class="flex justify-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-lucide-loader-2",
                class: "w-8 h-8 animate-spin text-flamingo-500"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (unref(paymentFailed)) {
                _push2(`<p class="text-sm text-red-600 dark:text-red-400"${_scopeId}> Payment failed or was cancelled. </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                __props.reason ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-sm text-amber-600 dark:text-amber-400"
                }, toDisplayString(__props.reason), 1)) : createCommentVNode("", true),
                !unref(paymentId) ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-4"
                }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" }, " Select plan "),
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => isRef(selectedPlanId) ? selectedPlanId.value = $event : null,
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20",
                      disabled: !__props.plans.length
                    }, [
                      !__props.plans.length ? (openBlock(), createBlock("option", {
                        key: 0,
                        value: ""
                      }, "No plans available")) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.plans, (p) => {
                        return openBlock(), createBlock("option", {
                          key: p.id,
                          value: p.id
                        }, toDisplayString(p.name) + " — KES " + toDisplayString(p.price) + "/" + toDisplayString((p.billing_period ?? "MONTHLY").toLowerCase()) + " (" + toDisplayString(p.max_printing_machines || "∞") + " printing, " + toDisplayString(p.max_finishing_machines || "∞") + " finishing) ", 9, ["value"]);
                      }), 128))
                    ], 8, ["onUpdate:modelValue", "disabled"]), [
                      [vModelSelect, unref(selectedPlanId)]
                    ]),
                    !__props.plans.length ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-xs text-amber-600 dark:text-amber-400"
                    }, " Plans could not be loaded. Check your connection and try again. ")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" }, " M-Pesa phone number "),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => isRef(phone) ? phone.value = $event : null,
                      type: "tel",
                      placeholder: "0712345678",
                      class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(phone)]
                    ])
                  ]),
                  createVNode("div", { class: "flex justify-end gap-2 pt-4" }, [
                    createVNode(_component_UButton, {
                      variant: "outline",
                      onClick: ($event) => _ctx.$emit("update:open", false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UButton, {
                      class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                      loading: unref(initiating),
                      disabled: !unref(selectedPlanId) || !unref(phone).trim() || unref(initiating) || !__props.plans.length,
                      onClick: initiatePayment
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Pay via M-Pesa ")
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 2,
                  class: "space-y-4"
                }, [
                  createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, " Complete payment on your phone. Waiting for confirmation... "),
                  createVNode("div", { class: "flex justify-center" }, [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-loader-2",
                      class: "w-8 h-8 animate-spin text-flamingo-500"
                    })
                  ]),
                  unref(paymentFailed) ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-red-600 dark:text-red-400"
                  }, " Payment failed or was cancelled. ")) : createCommentVNode("", true)
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/subscription/UpgradeModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "SubscriptionUpgradeModal" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const machineStore = useMachineStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const modalOpen = ref(false);
    const formReady = ref(false);
    const editing = ref(null);
    const formLoading = ref(false);
    const upgradeModalOpen = ref(false);
    const subscriptionStore = useSubscriptionStore();
    const subscription = computed(() => subscriptionStore.getSubscription(slug.value));
    function openModal(machine) {
      editing.value = machine ?? null;
      modalOpen.value = true;
    }
    function editMachine(machine) {
      openModal(machine);
    }
    function closeModal() {
      modalOpen.value = false;
      editing.value = null;
    }
    watch(modalOpen, (open) => {
      if (open) {
        formReady.value = false;
        nextTick(() => {
          formReady.value = true;
        });
      } else {
        formReady.value = false;
        editing.value = null;
      }
    }, { immediate: true });
    async function onSubmit(data) {
      const machineType = typeof data.machine_type === "object" && data.machine_type?.value ? data.machine_type.value : data.machine_type ?? "DIGITAL";
      const payload = { name: data.name, machine_type: machineType };
      formLoading.value = true;
      try {
        if (editing.value) {
          await machineStore.updateMachine(slug.value, editing.value.id, payload);
          toast.add({ title: "Updated", description: "Machine updated" });
        } else {
          await machineStore.createMachine(slug.value, payload);
          toast.add({ title: "Added", description: "Machine added" });
        }
        closeModal();
      } catch (err) {
        const msg = err instanceof Error ? err.message : machineStore.error ?? "Failed to save";
        toast.add({ title: "Error", description: msg, color: "error" });
      } finally {
        formLoading.value = false;
      }
    }
    async function confirmDelete(machine) {
      if (!confirm(`Delete "${machine.name}"? This may affect printing prices.`)) return;
      try {
        await machineStore.deleteMachine(slug.value, machine.id);
        toast.add({ title: "Deleted", description: "Machine removed" });
      } catch (err) {
        toast.add({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_DashboardDataTableCard = __nuxt_component_4;
      const _component_UBadge = _sfc_main$4;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_MachinesMachineForm = __nuxt_component_8;
      const _component_SubscriptionUpgradeModal = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Machines",
        subtitle: "Add your printers and equipment. Required before setting printing prices."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
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
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              onClick: ($event) => openModal()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add machine `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Add machine ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                color: "primary",
                onClick: ($event) => openModal()
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Add machine ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="col-span-12">`);
      if (unref(machineStore).loading && !unref(machineStore).machines.length) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "table",
          rows: 5
        }, null, _parent));
      } else {
        _push(`<!--[-->`);
        if (unref(machineStore).machines.length) {
          _push(ssrRenderComponent(_component_DashboardDataTableCard, { title: "Machines" }, {
            thead: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<tr${_scopeId}><th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"${_scopeId}>Name</th><th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"${_scopeId}>Type</th><th class="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"${_scopeId}>Status</th><th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"${_scopeId}>Actions</th></tr>`);
              } else {
                return [
                  createVNode("tr", null, [
                    createVNode("th", { class: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" }, "Name"),
                    createVNode("th", { class: "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" }, "Type"),
                    createVNode("th", { class: "px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" }, "Status"),
                    createVNode("th", { class: "px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400" }, "Actions")
                  ])
                ];
              }
            }),
            tbody: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<!--[-->`);
                ssrRenderList(unref(machineStore).machines, (machine) => {
                  _push2(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50"${_scopeId}><td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white"${_scopeId}>${ssrInterpolate(machine.name)}</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(machine.type_display ?? machine.machine_type ?? "Digital Printer")}</td><td class="px-4 py-3 text-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: machine.is_active !== false ? "success" : "neutral",
                    variant: "soft",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(machine.is_active !== false ? "Active" : "Inactive")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(machine.is_active !== false ? "Active" : "Inactive"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</td><td class="px-4 py-3 text-right"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    size: "xs",
                    onClick: ($event) => editMachine(machine)
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Edit`);
                      } else {
                        return [
                          createTextVNode("Edit")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_component_UButton, {
                    variant: "soft",
                    size: "xs",
                    color: "error",
                    onClick: ($event) => confirmDelete(machine)
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Delete `);
                      } else {
                        return [
                          createTextVNode(" Delete ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</td></tr>`);
                });
                _push2(`<!--]-->`);
              } else {
                return [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(machineStore).machines, (machine) => {
                    return openBlock(), createBlock("tr", {
                      key: machine.id,
                      class: "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }, [
                      createVNode("td", { class: "px-4 py-3 text-sm font-medium text-gray-900 dark:text-white" }, toDisplayString(machine.name), 1),
                      createVNode("td", { class: "px-4 py-3 text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(machine.type_display ?? machine.machine_type ?? "Digital Printer"), 1),
                      createVNode("td", { class: "px-4 py-3 text-center" }, [
                        createVNode(_component_UBadge, {
                          color: machine.is_active !== false ? "success" : "neutral",
                          variant: "soft",
                          size: "xs"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(machine.is_active !== false ? "Active" : "Inactive"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      createVNode("td", { class: "px-4 py-3 text-right" }, [
                        createVNode(_component_UButton, {
                          variant: "soft",
                          size: "xs",
                          onClick: ($event) => editMachine(machine)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Edit")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_UButton, {
                          variant: "soft",
                          size: "xs",
                          color: "error",
                          onClick: ($event) => confirmDelete(machine)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Delete ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ]);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_DashboardEmptyState, {
            title: "No machines yet",
            description: "Add your first printer or equipment. You'll need at least one machine before setting printing prices.",
            icon: "i-lucide-printer"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  onClick: ($event) => openModal()
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Add first machine `);
                    } else {
                      return [
                        createTextVNode(" Add first machine ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    color: "primary",
                    onClick: ($event) => openModal()
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add first machine ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit machine" : "Add machine",
        description: unref(editing) ? "Edit printer or equipment details." : "Add a printer or equipment. Required before setting printing prices."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(formReady)) {
              _push2(ssrRenderComponent(_component_MachinesMachineForm, {
                key: unref(editing)?.id ?? "new",
                machine: unref(editing),
                loading: unref(formLoading),
                "can-add-printing": unref(subscription)?.can_add_printing_machine ?? true,
                "can-add-finishing": unref(subscription)?.can_add_finishing_machine ?? true,
                onSubmit,
                onCancel: closeModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(formReady) ? (openBlock(), createBlock(_component_MachinesMachineForm, {
                key: unref(editing)?.id ?? "new",
                machine: unref(editing),
                loading: unref(formLoading),
                "can-add-printing": unref(subscription)?.can_add_printing_machine ?? true,
                "can-add-finishing": unref(subscription)?.can_add_finishing_machine ?? true,
                onSubmit,
                onCancel: closeModal
              }, null, 8, ["machine", "loading", "can-add-printing", "can-add-finishing"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_SubscriptionUpgradeModal, {
        open: unref(upgradeModalOpen),
        "shop-slug": unref(slug),
        reason: unref(subscription) ? `Your plan allows ${unref(subscription).usage.printing_machines}/${unref(subscription).limits.max_printing_machines || "∞"} printing and ${unref(subscription).usage.finishing_machines}/${unref(subscription).limits.max_finishing_machines || "∞"} finishing machines.` : "Upgrade to add more machines.",
        plans: unref(subscriptionStore).plans,
        "onUpdate:open": ($event) => upgradeModalOpen.value = $event
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/machines/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-dXDYQDAK.mjs.map
