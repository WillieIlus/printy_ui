import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { g as useRoute, e as _sfc_main$9, a as _sfc_main$f, v as useNuxtApp, A as API } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_11 } from './InfoCard-K1X9VF5P.mjs';
import { _ as __nuxt_component_4, a as __nuxt_component_7 } from './EmptyStateCard-BgXxuhOj.mjs';
import { _ as __nuxt_component_3 } from './SkeletonState-CnWAboWg.mjs';
import { _ as _sfc_main$2 } from './Badge-CHxS7t2J.mjs';
import { _ as __nuxt_component_5 } from './DashboardModalForm-DxuRCbSc.mjs';
import { _ as _sfc_main$3 } from './Input-DA2ySSK8.mjs';
import { _ as __nuxt_component_6 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as __nuxt_component_4$1 } from './InlineError-DcBNAnP_.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DTjoEp_W.mjs';
import { _ as __nuxt_component_10$1 } from './LoadingButton-CZOYt8xS.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, isRef, createCommentVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
import { u as useMachineStore } from './machine-Doo-qpdB.mjs';
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
      const _component_DashboardFieldHint = __nuxt_component_6;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10$1;
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
const __nuxt_component_10 = Object.assign(_sfc_main$1, { __name: "MachinesMachineForm" });
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
    const subscriptionStore = useSubscriptionStore();
    const slug = computed(() => route.params.slug);
    const modalOpen = ref(false);
    const editing = ref(null);
    const formLoading = ref(false);
    const subscription = computed(() => subscriptionStore.getSubscription(slug.value));
    const activeMachines = computed(() => machineStore.machines.filter((machine) => machine.is_active !== false));
    const largestSheetLabel = computed(() => {
      const sizes = activeMachines.value.map((machine) => ({ width: machine.max_width_mm ?? 0, height: machine.max_height_mm ?? 0 })).sort((left, right) => right.width * right.height - left.width * left.height);
      const biggest = sizes[0];
      if (!biggest || !biggest.width || !biggest.height) return "Not set";
      return `${biggest.width} × ${biggest.height} mm`;
    });
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
    function sheetSizeSummary(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Not defined yet";
      return `${machine.max_width_mm} × ${machine.max_height_mm} mm`;
    }
    function gsmSummary(machine) {
      if (machine.min_gsm && machine.max_gsm) return `${machine.min_gsm}–${machine.max_gsm} gsm`;
      if (machine.max_gsm) return `Up to ${machine.max_gsm} gsm`;
      if (machine.min_gsm) return `From ${machine.min_gsm} gsm`;
      return "General stock range";
    }
    function machineNarrative(machine) {
      const type = machine.type_display ?? machine.machine_type ?? "Machine";
      const maxSheet = sheetSizeSummary(machine);
      return `${type} is set up with a max sheet size of ${maxSheet}. Keep this aligned with your product defaults so jobs only appear on equipment that can actually run them.`;
    }
    async function onSubmit(data) {
      formLoading.value = true;
      try {
        if (editing.value) {
          await machineStore.updateMachine(slug.value, editing.value.id, data);
          notification.success("Machine updated successfully.");
        } else {
          await machineStore.createMachine(slug.value, data);
          notification.success("Machine added successfully.");
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
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_DashboardStatCard = __nuxt_component_4;
      const _component_DashboardSkeletonState = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardEmptyStateCard = __nuxt_component_7;
      const _component_DashboardInfoCard = __nuxt_component_11;
      const _component_DashboardModalForm = __nuxt_component_5;
      const _component_MachinesMachineForm = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Machines",
        subtitle: "Track the presses and finishing equipment your shop depends on so product setup, paper compatibility, and imposition assumptions stay grounded in real production."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}`,
              variant: "soft"
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
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add Machine `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Machine ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}`,
                variant: "soft"
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
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add Machine ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]"><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Machine Readiness",
        description: "Use machine setup to make job eligibility and pricing more operational than guess-based."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_DashboardStatCard, {
              label: "Total Machines",
              value: unref(machineStore).machines.length,
              icon: "i-lucide-printer",
              variant: "orange"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardStatCard, {
              label: "Active Today",
              value: unref(activeMachines).length,
              icon: "i-lucide-check-circle-2",
              variant: "green"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardStatCard, {
              label: "Largest Parent Sheet",
              value: unref(largestSheetLabel),
              icon: "i-lucide-layout-template",
              variant: "blue"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3" }, [
                createVNode(_component_DashboardStatCard, {
                  label: "Total Machines",
                  value: unref(machineStore).machines.length,
                  icon: "i-lucide-printer",
                  variant: "orange"
                }, null, 8, ["value"]),
                createVNode(_component_DashboardStatCard, {
                  label: "Active Today",
                  value: unref(activeMachines).length,
                  icon: "i-lucide-check-circle-2",
                  variant: "green"
                }, null, 8, ["value"]),
                createVNode(_component_DashboardStatCard, {
                  label: "Largest Parent Sheet",
                  value: unref(largestSheetLabel),
                  icon: "i-lucide-layout-template",
                  variant: "blue"
                }, null, 8, ["value"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Configured Machines",
        description: "Each machine card should tell an operator whether the setup is production-ready."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(machineStore).loading && !unref(machineStore).machines.length) {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_DashboardSkeletonState, {
                variant: "cards",
                "card-count": 3
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(machineStore).machines.length) {
              _push2(`<div class="grid gap-4 lg:grid-cols-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(machineStore).machines, (machine) => {
                _push2(`<article class="rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div${_scopeId}><p class="text-lg font-semibold text-white"${_scopeId}>${ssrInterpolate(machine.name)}</p><p class="mt-1 text-sm text-slate-300"${_scopeId}>${ssrInterpolate(machine.type_display ?? machine.machine_type ?? "Machine")}</p></div>`);
                _push2(ssrRenderComponent(_component_UBadge, {
                  color: machine.is_active !== false ? "success" : "neutral",
                  variant: "soft"
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
                _push2(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"${_scopeId}><div class="rounded-2xl border border-white/10 bg-slate-950/45 p-3"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Max Sheet</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(sheetSizeSummary(machine))}</p></div><div class="rounded-2xl border border-white/10 bg-slate-950/45 p-3"${_scopeId}><p class="text-xs uppercase tracking-[0.24em] text-slate-500"${_scopeId}>Paper Range</p><p class="mt-2 text-sm font-semibold text-white"${_scopeId}>${ssrInterpolate(gsmSummary(machine))}</p></div></div><p class="mt-4 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(machineNarrative(machine))}</p><div class="mt-5 flex flex-wrap gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  color: "primary",
                  onClick: ($event) => editMachine(machine)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Details`);
                    } else {
                      return [
                        createTextVNode("Details")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_UButton, {
                  variant: "soft",
                  onClick: ($event) => editMachine(machine)
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Manage Shop`);
                    } else {
                      return [
                        createTextVNode("Manage Shop")
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
                title: "Add your first machine",
                description: "Start with the press or finishing machine you rely on most. This helps Printy explain product eligibility, paper size compatibility, and imposition feasibility.",
                icon: "i-lucide-printer"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UButton, {
                      color: "primary",
                      onClick: ($event) => openModal()
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Add Machine`);
                        } else {
                          return [
                            createTextVNode("Add Machine")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UButton, {
                        color: "primary",
                        onClick: ($event) => openModal()
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Add Machine")
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
                  "card-count": 3
                })
              ])) : unref(machineStore).machines.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "grid gap-4 lg:grid-cols-2"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(machineStore).machines, (machine) => {
                  return openBlock(), createBlock("article", {
                    key: machine.id,
                    class: "rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl"
                  }, [
                    createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-lg font-semibold text-white" }, toDisplayString(machine.name), 1),
                        createVNode("p", { class: "mt-1 text-sm text-slate-300" }, toDisplayString(machine.type_display ?? machine.machine_type ?? "Machine"), 1)
                      ]),
                      createVNode(_component_UBadge, {
                        color: machine.is_active !== false ? "success" : "neutral",
                        variant: "soft"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(machine.is_active !== false ? "Active" : "Inactive"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    createVNode("div", { class: "mt-4 grid gap-3 sm:grid-cols-2" }, [
                      createVNode("div", { class: "rounded-2xl border border-white/10 bg-slate-950/45 p-3" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Max Sheet"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(sheetSizeSummary(machine)), 1)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-white/10 bg-slate-950/45 p-3" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-[0.24em] text-slate-500" }, "Paper Range"),
                        createVNode("p", { class: "mt-2 text-sm font-semibold text-white" }, toDisplayString(gsmSummary(machine)), 1)
                      ])
                    ]),
                    createVNode("p", { class: "mt-4 text-sm leading-6 text-slate-300" }, toDisplayString(machineNarrative(machine)), 1),
                    createVNode("div", { class: "mt-5 flex flex-wrap gap-2" }, [
                      createVNode(_component_UButton, {
                        variant: "soft",
                        color: "primary",
                        onClick: ($event) => editMachine(machine)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Details")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButton, {
                        variant: "soft",
                        onClick: ($event) => editMachine(machine)
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Manage Shop")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
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
                title: "Add your first machine",
                description: "Start with the press or finishing machine you rely on most. This helps Printy explain product eligibility, paper size compatibility, and imposition feasibility.",
                icon: "i-lucide-printer"
              }, {
                default: withCtx(() => [
                  createVNode(_component_UButton, {
                    color: "primary",
                    onClick: ($event) => openModal()
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Add Machine")
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
      _push(`</div><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Production planning",
        description: "A machine list is more than inventory. It is the operational map Printy uses to connect jobs to the right press and paper.",
        icon: "i-lucide-wrench",
        tone: "orange"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Paper size compatibility",
        description: "When the machine and parent sheet disagree, imposition assumptions become expensive. Keep max sheet size and stock paper aligned.",
        icon: "i-lucide-file-stack",
        tone: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Backend note",
        description: "Detailed supported print categories, color/mono capability, and operator notes still need dedicated backend fields if you want them persisted and enforced.",
        icon: "i-lucide-server"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Machine Details" : "Add Machine",
        description: unref(editing) ? "Update this machine so products and pricing can reference current capability." : "Add the equipment your shop uses most often for day-to-day production."
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
//# sourceMappingURL=index-BPnnbMeU.mjs.map
