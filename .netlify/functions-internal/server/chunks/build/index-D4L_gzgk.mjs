import { g as useRoute, _ as __nuxt_component_3$1, a as _sfc_main$f, d as _sfc_main$9, v as useNuxtApp, A as API } from './server.mjs';
import { _ as __nuxt_component_2 } from './FormSection-yFTKkshO.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$2 } from './Badge-DzyqaO77.mjs';
import { _ as __nuxt_component_6 } from './EmptyStateCard-sOlbx_Wq.mjs';
import { _ as __nuxt_component_11 } from './InfoCard-CqKU4D2I.mjs';
import { _ as __nuxt_component_5 } from './DashboardModalForm-CK75m_2g.mjs';
import { _ as _sfc_main$3 } from './Input-D98neQoC.mjs';
import { _ as __nuxt_component_6$1 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as __nuxt_component_4 } from './InlineError-DcBNAnP_.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DnLMxdXN.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, isRef, createCommentVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
import { u as useMachineStore } from './machine-Doo-qpdB.mjs';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';
import { defineStore } from 'pinia';
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
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MachineForm",
  __ssrInlineRender: true,
  props: {
    machine: {},
    loading: { type: Boolean },
    canAddPrinting: { type: Boolean },
    canAddFinishing: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const typeOptions = [
      { label: "Digital Printer", value: "DIGITAL" },
      { label: "Large Format", value: "LARGE_FORMAT" },
      { label: "Offset Press", value: "OFFSET" },
      { label: "Finishing Equipment", value: "FINISHING" }
    ].filter((option) => {
      if (option.value === "FINISHING") return props.canAddFinishing !== false;
      return props.canAddPrinting !== false || option.value === "FINISHING";
    });
    const sheetPresets = [
      { label: "A4", value: "A4", width: 210, height: 297 },
      { label: "A3", value: "A3", width: 297, height: 420 },
      { label: "SRA3", value: "SRA3", width: 320, height: 450 },
      { label: "B2", value: "B2", width: 500, height: 707 }
    ];
    const statusOptions = [
      { label: "Active", value: true },
      { label: "Inactive", value: false }
    ];
    const form = reactive({
      name: props.machine?.name ?? "",
      machine_type: props.machine?.machine_type ?? props.machine?.type ?? "DIGITAL",
      max_width_mm: props.machine?.max_width_mm != null ? String(props.machine.max_width_mm) : "",
      max_height_mm: props.machine?.max_height_mm != null ? String(props.machine.max_height_mm) : "",
      min_gsm: props.machine?.min_gsm != null ? String(props.machine.min_gsm) : "",
      max_gsm: props.machine?.max_gsm != null ? String(props.machine.max_gsm) : "",
      is_active: props.machine?.is_active !== false
    });
    const statusValue = computed({
      get: () => form.is_active,
      set: (value) => {
        form.is_active = typeof value === "object" ? value.value : value;
      }
    });
    const selectedSheetPreset = computed({
      get: () => {
        const match = sheetPresets.find(
          (preset) => String(preset.width) === form.max_width_mm && String(preset.height) === form.max_height_mm
        );
        return match?.value ?? null;
      },
      set: (value) => {
        const normalized = typeof value === "object" && value ? value.value : value;
        const preset = sheetPresets.find((item) => item.value === normalized);
        if (!preset) return;
        form.max_width_mm = String(preset.width);
        form.max_height_mm = String(preset.height);
      }
    });
    const errors = computed(() => {
      const minGsm = toNullableNumber(form.min_gsm);
      const maxGsm = toNullableNumber(form.max_gsm);
      return {
        name: form.name.trim() ? null : "Machine name is required.",
        machine_type: form.machine_type ? null : "Machine type is required.",
        min_gsm: minGsm != null && minGsm < 0 ? "Minimum GSM cannot be negative." : null,
        max_gsm: maxGsm != null && maxGsm < 0 ? "Maximum GSM cannot be negative." : minGsm != null && maxGsm != null && maxGsm < minGsm ? "Maximum GSM must be greater than or equal to minimum GSM." : null
      };
    });
    const canSubmit = computed(() => Object.values(errors.value).every((value) => !value));
    const suggestedCategories = computed(() => {
      const map = {
        DIGITAL: "Business cards, flyers, brochures, office print jobs",
        LARGE_FORMAT: "Banners, roll-up stands, posters, signage",
        OFFSET: "Long-run brochures, booklets, catalogues, inserts",
        FINISHING: "Cutting, lamination, folding, binding"
      };
      return map[form.machine_type] ?? "General print production";
    });
    function toNullableNumber(value) {
      if (!value.trim()) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UInput = _sfc_main$3;
      const _component_DashboardFieldHint = __nuxt_component_6$1;
      const _component_DashboardInlineError = __nuxt_component_4;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Why machines matter",
        description: "Machines tell Printy which jobs your shop can run, which parent sheets make sense, and whether a product can be produced without manual guesswork.",
        icon: "i-lucide-printer",
        tone: "orange"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Machine Profile",
        description: "Capture the production details you rely on when choosing equipment for a job."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Machine Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              placeholder: "Xerox Versant 180 Press",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Use the machine name your operators already recognize on the floor." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(errors).name
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Machine Type</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).machine_type,
              "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
              items: unref(typeOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Select machine type",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Type shapes what products and paper setups this machine should handle first." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(errors).machine_type
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Status</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(statusValue),
              "onUpdate:modelValue": ($event) => isRef(statusValue) ? statusValue.value = $event : null,
              items: statusOptions,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Inactive machines stay on record but should not be used as your current production default." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Max Sheet Size</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedSheetPreset),
              "onUpdate:modelValue": ($event) => isRef(selectedSheetPreset) ? selectedSheetPreset.value = $event : null,
              items: sheetPresets,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Pick the largest parent sheet this machine comfortably accepts." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Suggested Print Categories</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              "model-value": unref(suggestedCategories),
              readonly: "",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "This is guidance only. Detailed category support still needs backend rules if you want it enforced automatically." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Minimum GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).min_gsm,
              "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
              type: "number",
              placeholder: "80",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Useful when a machine should avoid very light or specialty stocks." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(errors).min_gsm
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Maximum GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_gsm,
              "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
              type: "number",
              placeholder: "350",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Helps products stay within the paper range your machine can really print." }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(errors).max_gsm
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Machine Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "Xerox Versant 180 Press",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Use the machine name your operators already recognize on the floor." }),
                  createVNode(_component_DashboardInlineError, {
                    message: unref(errors).name
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Machine Type"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).machine_type,
                    "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
                    items: unref(typeOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Select machine type",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  createVNode(_component_DashboardFieldHint, { text: "Type shapes what products and paper setups this machine should handle first." }),
                  createVNode(_component_DashboardInlineError, {
                    message: unref(errors).machine_type
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Status"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(statusValue),
                    "onUpdate:modelValue": ($event) => isRef(statusValue) ? statusValue.value = $event : null,
                    items: statusOptions,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Inactive machines stay on record but should not be used as your current production default." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Max Sheet Size"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(selectedSheetPreset),
                    "onUpdate:modelValue": ($event) => isRef(selectedSheetPreset) ? selectedSheetPreset.value = $event : null,
                    items: sheetPresets,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Pick the largest parent sheet this machine comfortably accepts." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Suggested Print Categories"),
                  createVNode(_component_UInput, {
                    "model-value": unref(suggestedCategories),
                    readonly: "",
                    size: "xl"
                  }, null, 8, ["model-value"]),
                  createVNode(_component_DashboardFieldHint, { text: "This is guidance only. Detailed category support still needs backend rules if you want it enforced automatically." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Minimum GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).min_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                    type: "number",
                    placeholder: "80",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Useful when a machine should avoid very light or specialty stocks." }),
                  createVNode(_component_DashboardInlineError, {
                    message: unref(errors).min_gsm
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Maximum GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                    type: "number",
                    placeholder: "350",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Helps products stay within the paper range your machine can really print." }),
                  createVNode(_component_DashboardInlineError, {
                    message: unref(errors).max_gsm
                  }, null, 8, ["message"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Operational Guidance",
        description: "Use the machine list to make product eligibility and imposition more believable."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3"${_scopeId}><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Production planning</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}> Machine setup helps staff choose the right press before quoting or accepting a job. </p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Paper size compatibility</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}> Matching max sheet size with stock papers reduces invalid assumptions during costing and imposition. </p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Imposition feasibility</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}> If a product assumes SRA3 but your machine only runs A3, Printy should surface that early. </p></div></div><div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "neutral",
              variant: "outline",
              onClick: ($event) => _ctx.$emit("cancel")
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
            _push2(ssrRenderComponent(_component_DashboardLoadingButton, {
              type: "submit",
              color: "primary",
              loading: __props.loading,
              disabled: !unref(canSubmit)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.machine ? "Save Machine" : "Add Machine")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.machine ? "Save Machine" : "Add Machine"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3" }, [
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Production planning"),
                  createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, " Machine setup helps staff choose the right press before quoting or accepting a job. ")
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Paper size compatibility"),
                  createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, " Matching max sheet size with stock papers reduces invalid assumptions during costing and imposition. ")
                ]),
                createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/5 p-4" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Imposition feasibility"),
                  createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, " If a product assumes SRA3 but your machine only runs A3, Printy should surface that early. ")
                ])
              ]),
              createVNode("div", { class: "flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end" }, [
                createVNode(_component_UButton, {
                  color: "neutral",
                  variant: "outline",
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
                  disabled: !unref(canSubmit)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(__props.machine ? "Save Machine" : "Add Machine"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/machines/MachineForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_9 = Object.assign(_sfc_main$1, { __name: "MachinesMachineForm" });
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const notification = useNotification();
    const machineStore = useMachineStore();
    const shopStore = useShopStore();
    const subscriptionStore = useSubscriptionStore();
    const slug = computed(() => route.params.slug);
    const modalOpen = ref(false);
    const editing = ref(null);
    const formLoading = ref(false);
    const subscription = computed(() => subscriptionStore.getSubscription(slug.value));
    const shopName = computed(() => shopStore.currentShop?.name ?? "This shop");
    const sortedMachines = computed(() => [...machineStore.machines].sort((left, right) => {
      if (left.is_active !== false !== (right.is_active !== false)) return left.is_active !== false ? -1 : 1;
      return left.name.localeCompare(right.name);
    }));
    const activeMachines = computed(() => machineStore.machines.filter((machine) => machine.is_active !== false));
    const finishingMachines = computed(() => machineStore.machines.filter((machine) => machine.machine_type === "FINISHING"));
    const printingMachines = computed(() => machineStore.machines.filter((machine) => machine.machine_type !== "FINISHING"));
    const machinesWithSheetSize = computed(() => activeMachines.value.filter((machine) => machine.max_width_mm && machine.max_height_mm));
    const machinesWithGsmRange = computed(() => activeMachines.value.filter((machine) => machine.min_gsm != null || machine.max_gsm != null));
    const largestSheet = computed(() => {
      const sizes = activeMachines.value.map((machine) => ({ width: machine.max_width_mm ?? 0, height: machine.max_height_mm ?? 0 })).sort((left, right) => right.width * right.height - left.width * left.height);
      return sizes[0] ?? null;
    });
    const largestSheetLabel = computed(() => {
      if (!largestSheet.value?.width || !largestSheet.value?.height) return "Not set yet";
      return `${largestSheet.value.width} x ${largestSheet.value.height} mm`;
    });
    const largestSheetNarrative = computed(() => {
      if (!machinesWithSheetSize.value.length) return "No active machine has a reliable parent sheet limit yet.";
      return "This is the largest active sheet footprint available in the current machine list.";
    });
    const machineCoverageLabel = computed(() => {
      if (!machineStore.machines.length) return "No equipment on record";
      if (activeMachines.value.length === machineStore.machines.length) return "All machines active";
      return `${activeMachines.value.length} active / ${machineStore.machines.length} total`;
    });
    const operationsSignal = computed(() => {
      if (!machineStore.machines.length) {
        return {
          title: "Products are still guessing",
          description: "Without at least one machine, product defaults and imposition assumptions have nothing operational to anchor to."
        };
      }
      if (!machinesWithSheetSize.value.length) {
        return {
          title: "Sheet compatibility is still weak",
          description: "Machines exist, but none of the active ones define a max sheet size yet."
        };
      }
      if (!machinesWithGsmRange.value.length) {
        return {
          title: "Paper constraints are mostly implied",
          description: "The machine list is usable, but GSM limits are still too loose to guide product eligibility well."
        };
      }
      return {
        title: "Machine setup is operational",
        description: "This shop has enough machine data to support believable product, stock, and imposition decisions."
      };
    });
    const metrics = computed(() => [
      {
        label: "Total Machines",
        value: machineStore.machines.length,
        icon: "i-lucide-printer",
        iconClass: "text-orange-200",
        description: machineStore.machines.length ? "Registered equipment available to the shop workspace." : "No machine records yet."
      },
      {
        label: "Active Today",
        value: activeMachines.value.length,
        icon: "i-lucide-badge-check",
        iconClass: "text-emerald-200",
        description: activeMachines.value.length ? "Machines currently marked available for production use." : "No active machine currently available."
      },
      {
        label: "Printing Units",
        value: printingMachines.value.length,
        icon: "i-lucide-file-output",
        iconClass: "text-sky-200",
        description: printingMachines.value.length ? "Digital, offset, or large-format devices recorded for print output." : "No printing device recorded yet."
      },
      {
        label: "Finishing Units",
        value: finishingMachines.value.length,
        icon: "i-lucide-scissors",
        iconClass: "text-rose-200",
        description: finishingMachines.value.length ? "Finishing equipment that can support post-press workflow." : "No finishing equipment recorded yet."
      },
      {
        label: "Sized For Imposition",
        value: machinesWithSheetSize.value.length,
        icon: "i-lucide-layout-template",
        iconClass: "text-amber-200",
        description: machinesWithSheetSize.value.length ? "Active machines with max sheet data that products can rely on." : "No active machine has parent sheet limits yet."
      }
    ]);
    const coverageChecks = computed(() => [
      {
        label: "Product compatibility",
        description: machineStore.machines.length ? "Products can start pointing to real equipment instead of relying on generic assumptions." : "Add at least one machine so products have a realistic production target.",
        badge: machineStore.machines.length ? "Connected" : "Missing",
        color: machineStore.machines.length ? "success" : "warning"
      },
      {
        label: "Paper size compatibility",
        description: machinesWithSheetSize.value.length ? "Some active machines define max sheet size, so parent-sheet rules can be checked more confidently." : "No active machine currently defines max sheet size, so sheet fit is still guess-based.",
        badge: machinesWithSheetSize.value.length ? "Usable" : "Weak",
        color: machinesWithSheetSize.value.length ? "success" : "warning"
      },
      {
        label: "Imposition realism",
        description: machinesWithSheetSize.value.length && machineStore.machines.length ? "Imposition logic can start rejecting impossible machine/sheet combinations earlier." : "Imposition assumptions still have too little machine context.",
        badge: machinesWithSheetSize.value.length && machineStore.machines.length ? "Improving" : "Blocked",
        color: machinesWithSheetSize.value.length && machineStore.machines.length ? "success" : "warning"
      }
    ]);
    const nextActions = computed(() => [
      {
        label: "Create a machine-aware product",
        description: "Use this machine data when defining a product so default routing starts from real capacity.",
        to: `/dashboard/shops/${slug.value}/products/create`,
        icon: "i-lucide-package"
      },
      {
        label: "Review stock and pricing",
        description: "Align parent sheets and print pricing with the equipment you have just recorded.",
        to: `/dashboard/shops/${slug.value}/pricing`,
        icon: "i-lucide-wallet"
      },
      {
        label: "Return to shop overview",
        description: "See how machine readiness fits into the rest of the workspace setup.",
        to: `/dashboard/shops/${slug.value}`,
        icon: "i-lucide-layout-dashboard"
      }
    ]);
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
    function machineTypeLabel(machine) {
      return machine.type_display ?? machine.machine_type ?? machine.type ?? "Machine";
    }
    function sheetSizeSummary(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Not defined yet";
      return `${machine.max_width_mm} x ${machine.max_height_mm} mm`;
    }
    function gsmSummary(machine) {
      if (machine.min_gsm != null && machine.max_gsm != null) return `${machine.min_gsm}-${machine.max_gsm} gsm`;
      if (machine.max_gsm != null) return `Up to ${machine.max_gsm} gsm`;
      if (machine.min_gsm != null) return `From ${machine.min_gsm} gsm`;
      return "General stock range";
    }
    function sheetCompatibilityHint(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Add the largest parent sheet this machine can accept.";
      return "Use this when deciding which stock papers and products belong on this machine.";
    }
    function gsmHint(machine) {
      if (machine.min_gsm == null && machine.max_gsm == null) return "No paper-weight guidance recorded yet.";
      return "Useful when heavier boards or lighter text stocks should be screened out.";
    }
    function productFitLabel(machine) {
      if (machine.machine_type === "FINISHING") return "Supports post-press steps";
      if (!machine.max_width_mm || !machine.max_height_mm) return "Needs size details";
      return "Can guide default product routing";
    }
    function paperFitLabel(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Sheet limit missing";
      return "Can validate parent sheet fit";
    }
    function impositionLabel(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Imposition still weak";
      return machine.is_active !== false ? "Operationally useful" : "Stored only";
    }
    function machineNarrative(machine) {
      const type = machineTypeLabel(machine);
      const maxSheet = sheetSizeSummary(machine);
      if (machine.machine_type === "FINISHING") {
        return `${type} supports post-press planning for products that need cutting, lamination, binding, or other finishing steps after printing.`;
      }
      return `${type} is recorded with a max sheet size of ${maxSheet}. Keep this aligned with product defaults and parent sheets so jobs only appear on equipment that can actually run them.`;
    }
    async function onSubmit(data) {
      formLoading.value = true;
      try {
        if (editing.value) {
          await machineStore.updateMachine(slug.value, editing.value.id, data);
          notification.success("Machine updated. Product and paper assumptions can now use the revised limits.");
        } else {
          await machineStore.createMachine(slug.value, data);
          notification.success("Machine added. This shop now has a stronger operational basis for products and imposition.");
        }
        closeModal();
      } catch (error) {
        notification.error(error instanceof Error ? error.message : "We could not save this machine yet. Please check the highlighted fields.");
      } finally {
        formLoading.value = false;
      }
    }
    async function confirmDelete(machine) {
      if (!confirm(`Delete "${machine.name}"? This can affect machine-linked pricing and product assumptions.`)) {
        return;
      }
      try {
        await machineStore.deleteMachine(slug.value, machine.id);
        notification.success("Machine removed successfully.");
      } catch (error) {
        notification.error(error instanceof Error ? error.message : "We could not delete this machine right now.");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_3$1;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardEmptyStateCard = __nuxt_component_6;
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_DashboardModalForm = __nuxt_component_5;
      const _component_MachinesMachineForm = __nuxt_component_9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6 pb-2" }, _attrs))}><section class="relative overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(10,15,26,0.84))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7 lg:p-8"><div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.5),transparent_30%)]"></div><div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"><div class="max-w-4xl space-y-4"><div class="flex flex-wrap items-center gap-2"><span class="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200"><span class="h-2 w-2 rounded-full bg-orange-300"></span> Machine Management </span><span class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">${ssrInterpolate(unref(shopName))}</span></div><div class="space-y-3"><h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"> Build a machine list your products can trust </h1><p class="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base"> Machines are the operational link between products, paper size compatibility, and believable imposition. If the press cannot take the parent sheet, the product should not quietly assume it can. </p></div><div class="grid gap-3 sm:grid-cols-3"><div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Machine coverage</p><p class="mt-3 text-3xl font-semibold text-white">${ssrInterpolate(unref(machineStore).machines.length)}</p><p class="mt-1 text-sm text-slate-300">${ssrInterpolate(unref(machineCoverageLabel))}</p></div><div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Largest parent sheet</p><p class="mt-3 text-base font-semibold text-white">${ssrInterpolate(unref(largestSheetLabel))}</p><p class="mt-1 text-sm text-slate-300">${ssrInterpolate(unref(largestSheetNarrative))}</p></div><div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl"><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Operational signal</p><p class="mt-3 text-base font-semibold text-white">${ssrInterpolate(unref(operationsSignal).title)}</p><p class="mt-1 text-sm text-slate-300">${ssrInterpolate(unref(operationsSignal).description)}</p></div></div></div><div class="grid gap-3 sm:grid-cols-2 xl:w-[27rem]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/dashboard/shops/${unref(slug)}`,
        class: "rounded-[26px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-white/15 hover:bg-white/[0.09]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-start gap-3"${_scopeId}><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Back to shop</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>Return to the main workspace overview for this shop.</p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-start gap-3" }, [
                createVNode("div", { class: "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100" }, [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-arrow-left",
                    class: "h-5 w-5"
                  })
                ]),
                createVNode("div", null, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Back to shop"),
                  createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, "Return to the main workspace overview for this shop.")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="rounded-[26px] border border-flamingo-400/30 bg-flamingo-500/[0.12] p-4 text-left transition hover:bg-flamingo-500/[0.16]"><div class="flex items-start gap-3"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-flamingo-300/25 bg-flamingo-500/15 text-flamingo-100">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-plus",
        class: "h-5 w-5"
      }, null, _parent));
      _push(`</div><div><p class="text-sm font-semibold text-white">Add machine</p><p class="mt-1 text-sm leading-6 text-slate-300">Register the press or finishing unit your team uses most often.</p></div></div></button></div></div></section><section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5"><!--[-->`);
      ssrRenderList(unref(metrics), (metric) => {
        _push(`<article class="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl"><div class="flex items-start justify-between gap-3"><div class="space-y-1"><p class="text-[11px] uppercase tracking-[0.26em] text-slate-500">${ssrInterpolate(metric.label)}</p><p class="text-3xl font-semibold text-white">${ssrInterpolate(metric.value)}</p></div><div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: metric.icon,
          class: ["h-5 w-5", metric.iconClass]
        }, null, _parent));
        _push(`</div></div><p class="mt-4 text-sm leading-6 text-slate-300">${ssrInterpolate(metric.description)}</p></article>`);
      });
      _push(`<!--]--></section><div class="grid gap-6 xl:grid-cols-[1.45fr_1fr]"><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Machine Registry",
        description: "Each machine should tell the team what it can run, what paper sizes fit, and whether products should rely on it for quoting."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              variant: "solid",
              class: "justify-center bg-flamingo-500 text-white hover:bg-flamingo-400",
              onClick: ($event) => openModal()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add machine `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
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
                color: "primary",
                variant: "solid",
                class: "justify-center bg-flamingo-500 text-white hover:bg-flamingo-400",
                onClick: ($event) => openModal()
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add machine ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(machineStore).loading && !unref(machineStore).machines.length) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, {
                variant: "cards",
                "card-count": 4
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(machineStore).machines.length) {
              _push2(`<div class="grid gap-4 lg:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(sortedMachines), (machine) => {
                _push2(`<article class="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 backdrop-blur-xl"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate text-lg font-semibold text-white"${_scopeId}>${ssrInterpolate(machine.name)}</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(machineTypeLabel(machine))}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: machine.is_active !== false ? "success" : "neutral",
                  variant: "soft",
                  size: "sm"
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
                _push2(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"${_scopeId}><div class="rounded-[22px] border border-white/10 bg-slate-950/45 p-3"${_scopeId}><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Parent sheet limit</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(sheetSizeSummary(machine))}</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(sheetCompatibilityHint(machine))}</p></div><div class="rounded-[22px] border border-white/10 bg-slate-950/45 p-3"${_scopeId}><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Paper range</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(gsmSummary(machine))}</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(gsmHint(machine))}</p></div></div><div class="mt-4 grid gap-3 sm:grid-cols-3"${_scopeId}><div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3"${_scopeId}><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Products</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(productFitLabel(machine))}</p></div><div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3"${_scopeId}><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Paper fit</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(paperFitLabel(machine))}</p></div><div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3"${_scopeId}><p class="text-[11px] uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Imposition</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(impositionLabel(machine))}</p></div></div><p class="mt-4 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(machineNarrative(machine))}</p><div class="mt-5 flex flex-wrap gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  color: "primary",
                  variant: "soft",
                  onClick: ($event) => editMachine(machine)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Edit details`);
                    } else {
                      return [
                        createTextVNode("Edit details")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  to: `/dashboard/shops/${unref(slug)}/products/create`
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Add matching product`);
                    } else {
                      return [
                        createTextVNode("Add matching product")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "error",
                  onClick: ($event) => confirmDelete(machine)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Delete`);
                    } else {
                      return [
                        createTextVNode("Delete")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div></article>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_component_DashboardEmptyStateCard, {
                title: "No machines registered yet",
                description: "Start with the press, printer, or finishing unit your team uses most. Once a machine exists, Printy can ground products, parent sheet assumptions, and imposition logic in real capability.",
                icon: "i-lucide-printer"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      color: "primary",
                      class: "justify-center",
                      onClick: ($event) => openModal()
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UIcon, {
                            name: "i-lucide-plus",
                            class: "mr-2 h-4 w-4"
                          }, null, _parent4, _scopeId3));
                          _push4(` Add first machine `);
                        } else {
                          return [
                            createVNode(_component_UIcon, {
                              name: "i-lucide-plus",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" Add first machine ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        color: "primary",
                        class: "justify-center",
                        onClick: ($event) => openModal()
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UIcon, {
                            name: "i-lucide-plus",
                            class: "mr-2 h-4 w-4"
                          }),
                          createTextVNode(" Add first machine ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
          } else {
            return [
              unref(machineStore).loading && !unref(machineStore).machines.length ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-3"
              }, [
                createVNode(_component_DashboardSkeletonState, {
                  variant: "cards",
                  "card-count": 4
                })
              ])) : unref(machineStore).machines.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "grid gap-4 lg:grid-cols-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(sortedMachines), (machine) => {
                  return openBlock(), createBlock("article", {
                    key: machine.id,
                    class: "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                      createVNode("div", { class: "min-w-0" }, [
                        createVNode("p", { class: "truncate text-lg font-semibold text-white" }, toDisplayString(machine.name), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(machineTypeLabel(machine)), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: machine.is_active !== false ? "success" : "neutral",
                        variant: "soft",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(machine.is_active !== false ? "Active" : "Inactive"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    createVNode("div", { class: "mt-4 grid gap-3 sm:grid-cols-2" }, [
                      createVNode("div", { class: "rounded-[22px] border border-white/10 bg-slate-950/45 p-3" }, [
                        createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-slate-500" }, "Parent sheet limit"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(sheetSizeSummary(machine)), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(sheetCompatibilityHint(machine)), 1)
                      ]),
                      createVNode("div", { class: "rounded-[22px] border border-white/10 bg-slate-950/45 p-3" }, [
                        createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-slate-500" }, "Paper range"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(gsmSummary(machine)), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(gsmHint(machine)), 1)
                      ])
                    ]),
                    createVNode("div", { class: "mt-4 grid gap-3 sm:grid-cols-3" }, [
                      createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/[0.05] p-3" }, [
                        createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-slate-500" }, "Products"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(productFitLabel(machine)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/[0.05] p-3" }, [
                        createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-slate-500" }, "Paper fit"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(paperFitLabel(machine)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-white/10 bg-white/[0.05] p-3" }, [
                        createVNode("p", { class: "text-[11px] uppercase tracking-[0.24em] text-slate-500" }, "Imposition"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(impositionLabel(machine)), 1)
                      ])
                    ]),
                    createVNode("p", { class: "mt-4 text-sm leading-6 text-slate-300" }, toDisplayString(machineNarrative(machine)), 1),
                    createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                      createVNode(_component_UButton, {
                        color: "primary",
                        variant: "soft",
                        onClick: ($event) => editMachine(machine)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Edit details")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        to: `/dashboard/shops/${unref(slug)}/products/create`
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Add matching product")
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "error",
                        onClick: ($event) => confirmDelete(machine)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Delete")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ]);
                }), 128))
              ])) : (openBlock(), createBlock(_component_DashboardEmptyStateCard, {
                key: 2,
                title: "No machines registered yet",
                description: "Start with the press, printer, or finishing unit your team uses most. Once a machine exists, Printy can ground products, parent sheet assumptions, and imposition logic in real capability.",
                icon: "i-lucide-printer"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    color: "primary",
                    class: "justify-center",
                    onClick: ($event) => openModal()
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Add first machine ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Why Machines Matter",
        description: "This page should explain operational consequences, not just list equipment names."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-3 md:grid-cols-3"${_scopeId}><div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Products</p><p class="mt-2 text-sm leading-6 text-slate-300"${_scopeId}> Products should only default to machines that can actually handle their finished size, paper expectations, and run type. </p></div><div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Paper compatibility</p><p class="mt-2 text-sm leading-6 text-slate-300"${_scopeId}> If stock papers are larger than the machine can accept, pricing and sheet planning drift away from reality quickly. </p></div><div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>Imposition</p><p class="mt-2 text-sm leading-6 text-slate-300"${_scopeId}> Imposition only stays believable when the assumed parent sheet and the selected machine agree on what can physically run. </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-3 md:grid-cols-3" }, [
                createVNode("div", { class: "rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Products"),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-300" }, " Products should only default to machines that can actually handle their finished size, paper expectations, and run type. ")
                ]),
                createVNode("div", { class: "rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Paper compatibility"),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-300" }, " If stock papers are larger than the machine can accept, pricing and sheet planning drift away from reality quickly. ")
                ]),
                createVNode("div", { class: "rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl" }, [
                  createVNode("p", { class: "text-sm font-semibold text-white" }, "Imposition"),
                  createVNode("p", { class: "mt-2 text-sm leading-6 text-slate-300" }, " Imposition only stays believable when the assumed parent sheet and the selected machine agree on what can physically run. ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Add Machine Guidance",
        description: "What to record first so the machine list becomes useful immediately."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Start with the most-used press",
              description: "Do not wait for a perfect equipment register. Add the machine that handles the highest volume of real jobs first.",
              icon: "i-lucide-printer",
              tone: "orange"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Use true max sheet size",
              description: "Record the largest parent sheet the machine can reliably accept, not the finished size of your most common product.",
              icon: "i-lucide-layout-template",
              tone: "blue"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInfoCard, {
              title: "Keep GSM realistic",
              description: "If a machine struggles with heavy boards or very light stock, capture that now so products are not overly permissive later.",
              icon: "i-lucide-file-stack",
              tone: "green"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                createVNode(_component_DashboardInfoCard, {
                  title: "Start with the most-used press",
                  description: "Do not wait for a perfect equipment register. Add the machine that handles the highest volume of real jobs first.",
                  icon: "i-lucide-printer",
                  tone: "orange"
                }),
                createVNode(_component_DashboardInfoCard, {
                  title: "Use true max sheet size",
                  description: "Record the largest parent sheet the machine can reliably accept, not the finished size of your most common product.",
                  icon: "i-lucide-layout-template",
                  tone: "blue"
                }),
                createVNode(_component_DashboardInfoCard, {
                  title: "Keep GSM realistic",
                  description: "If a machine struggles with heavy boards or very light stock, capture that now so products are not overly permissive later.",
                  icon: "i-lucide-file-stack",
                  tone: "green"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Coverage Checks",
        description: "A fast read on where this machine setup is strong and where it still needs work."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(coverageChecks), (check) => {
              _push2(`<div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><div${_scopeId}><p class="text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(check.label)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(check.description)}</p></div>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: check.color,
                variant: "soft",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(check.badge)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(check.badge), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(coverageChecks), (check) => {
                  return openBlock(), createBlock("div", {
                    key: check.label,
                    class: "rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(check.label), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(check.description), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: check.color,
                        variant: "soft",
                        size: "sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(check.badge), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Next Best Actions",
        description: "Use these when you want the machine list to affect the rest of the shop setup."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(nextActions), (action) => {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                key: action.label,
                to: action.to,
                class: "flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UIcon, {
                      name: action.icon,
                      class: "h-4 w-4 text-orange-200"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}><p class="text-sm font-semibold text-white"${_scopeId2}>${ssrInterpolate(action.label)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId2}>${ssrInterpolate(action.description)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10" }, [
                        createVNode(_component_UIcon, {
                          name: action.icon,
                          class: "h-4 w-4 text-orange-200"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(action.label), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(action.description), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-3" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(nextActions), (action) => {
                  return openBlock(), createBlock(_component_NuxtLink, {
                    key: action.label,
                    to: action.to,
                    class: "flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10" }, [
                        createVNode(_component_UIcon, {
                          name: action.icon,
                          class: "h-4 w-4 text-orange-200"
                        }, null, 8, ["name"])
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-sm font-semibold text-white" }, toDisplayString(action.label), 1),
                        createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(action.description), 1)
                      ])
                    ]),
                    _: 2
                  }, 1032, ["to"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Machine Details" : "Add Machine",
        description: unref(editing) ? "Update this machine so products, paper fit, and pricing reflect current capability." : "Add the equipment your shop relies on so quoting and imposition stop guessing."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(modalOpen)) {
              _push2(ssrRenderComponent(_component_MachinesMachineForm, {
                key: unref(editing)?.id ?? "new-machine",
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
              unref(modalOpen) ? (openBlock(), createBlock(_component_MachinesMachineForm, {
                key: unref(editing)?.id ?? "new-machine",
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
//# sourceMappingURL=index-D4L_gzgk.mjs.map
