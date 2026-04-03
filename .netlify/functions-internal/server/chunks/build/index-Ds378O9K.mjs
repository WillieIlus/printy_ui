import { _ as __nuxt_component_0 } from './DashboardPageHeader-Cmi_LCe-.mjs';
import { f as useRoute, b as _sfc_main$9, a as _sfc_main$f, m as useNuxtApp, A as API, J as extractApiFeedback, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './Badge-Dn_IFHF_.mjs';
import { _ as __nuxt_component_4 } from './SkeletonState-BhcHA7h3.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6 } from './AdminWorkspaceFormPanel-D_9BQu_x.mjs';
import { _ as __nuxt_component_2 } from './FormSection-CG38mMf8.mjs';
import { _ as _sfc_main$3 } from './Input-Hudv-7BP.mjs';
import { _ as __nuxt_component_4$1 } from './InlineError-CDgd_EMb.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-DEusGFiB.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, reactive, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { g as dashboardInputUi, d as dashboardSelectUi } from './formUi-NbOzRwMW.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { u as useMachineStore } from './machine-DD004_8d.mjs';
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
import 'vue-i18n';
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
    canAddFinishing: { type: Boolean },
    fieldErrors: {}
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
      const maxWidth = toNullableNumber(form.max_width_mm);
      const maxHeight = toNullableNumber(form.max_height_mm);
      return {
        name: form.name.trim() ? null : "Machine name is required.",
        machine_type: form.machine_type ? null : "Machine type is required.",
        max_width_mm: maxWidth != null && maxWidth > 0 ? null : "Choose the largest sheet size this machine can handle.",
        max_height_mm: maxHeight != null && maxHeight > 0 ? null : "Choose the largest sheet size this machine can handle.",
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
      if (value == null) return null;
      if (typeof value === "string" && !value.trim()) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    function fieldError(field) {
      return errors.value[field] || props.fieldErrors?.[field] || null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UInput = _sfc_main$3;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><p class="text-xs leading-5 text-[var(--p-text-muted)]"> Keep this list tight so quoting, sheet fit, and production routing stay accurate. </p>`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Machine setup",
        description: "Fast production entry for equipment your team actually runs."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-4 md:grid-cols-2"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              placeholder: "Xerox Versant 180 Press",
              size: "lg",
              ui: unref(dashboardInputUi)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("name")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Type</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).machine_type,
              "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
              items: unref(typeOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Select type",
              portal: "body",
              size: "lg",
              ui: unref(dashboardSelectUi)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("machine_type")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Status</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(statusValue),
              "onUpdate:modelValue": ($event) => isRef(statusValue) ? statusValue.value = $event : null,
              items: statusOptions,
              "value-key": "value",
              "label-key": "label",
              portal: "body",
              size: "lg",
              ui: unref(dashboardSelectUi)
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><div class="flex items-center justify-between gap-3"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Sheet preset</label><span class="text-[11px] uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Updates width and height</span></div>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedSheetPreset),
              "onUpdate:modelValue": ($event) => isRef(selectedSheetPreset) ? selectedSheetPreset.value = $event : null,
              items: sheetPresets,
              "value-key": "value",
              "label-key": "label",
              portal: "body",
              size: "lg",
              ui: unref(dashboardSelectUi)
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Max width (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_width_mm,
              "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
              type: "number",
              inputmode: "numeric",
              min: "1",
              placeholder: "320",
              size: "lg",
              ui: unref(dashboardInputUi)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("max_width_mm")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Max height (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_height_mm,
              "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
              type: "number",
              inputmode: "numeric",
              min: "1",
              placeholder: "450",
              size: "lg",
              ui: unref(dashboardInputUi)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("max_height_mm")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Min GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).min_gsm,
              "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
              type: "number",
              inputmode: "numeric",
              min: "0",
              placeholder: "80",
              size: "lg",
              ui: unref(dashboardInputUi),
              title: "Optional lower stock limit"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("min_gsm")
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-semibold text-[var(--p-text-dim)]"${_scopeId}>Max GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_gsm,
              "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
              type: "number",
              inputmode: "numeric",
              min: "0",
              placeholder: "350",
              size: "lg",
              ui: unref(dashboardInputUi),
              title: "Optional upper stock limit"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: fieldError("max_gsm")
            }, null, _parent2, _scopeId));
            _push2(`</div></div><details class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]/60 px-4 py-3"${_scopeId}><summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--p-text)]"${_scopeId}><span${_scopeId}>Advanced settings</span>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-down",
              class: "h-4 w-4 text-[var(--p-text-muted)] transition-transform group-open:rotate-180"
            }, null, _parent2, _scopeId));
            _push2(`</summary><div class="mt-3 grid gap-3 border-t border-[var(--p-border)] pt-3 text-sm text-[var(--p-text-muted)]"${_scopeId}><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5"${_scopeId}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId}>Suggested print categories</p><p class="mt-1 text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(unref(suggestedCategories))}</p></div><p${_scopeId}>Use the largest sheet the machine reliably runs. Presets are shortcuts; manual width and height are what get saved.</p><p${_scopeId}>Inactive machines stay on record but should not be your current production default.</p></div></details><div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end"${_scopeId}>`);
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
              createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "Xerox Versant 180 Press",
                    size: "lg",
                    ui: unref(dashboardInputUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("name")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Type"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).machine_type,
                    "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
                    items: unref(typeOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Select type",
                    portal: "body",
                    size: "lg",
                    ui: unref(dashboardSelectUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("machine_type")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Status"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(statusValue),
                    "onUpdate:modelValue": ($event) => isRef(statusValue) ? statusValue.value = $event : null,
                    items: statusOptions,
                    "value-key": "value",
                    "label-key": "label",
                    portal: "body",
                    size: "lg",
                    ui: unref(dashboardSelectUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-3" }, [
                    createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Sheet preset"),
                    createVNode("span", { class: "text-[11px] uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Updates width and height")
                  ]),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(selectedSheetPreset),
                    "onUpdate:modelValue": ($event) => isRef(selectedSheetPreset) ? selectedSheetPreset.value = $event : null,
                    items: sheetPresets,
                    "value-key": "value",
                    "label-key": "label",
                    portal: "body",
                    size: "lg",
                    ui: unref(dashboardSelectUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Max width (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                    type: "number",
                    inputmode: "numeric",
                    min: "1",
                    placeholder: "320",
                    size: "lg",
                    ui: unref(dashboardInputUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("max_width_mm")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Max height (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                    type: "number",
                    inputmode: "numeric",
                    min: "1",
                    placeholder: "450",
                    size: "lg",
                    ui: unref(dashboardInputUi)
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("max_height_mm")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Min GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).min_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                    type: "number",
                    inputmode: "numeric",
                    min: "0",
                    placeholder: "80",
                    size: "lg",
                    ui: unref(dashboardInputUi),
                    title: "Optional lower stock limit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("min_gsm")
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-semibold text-[var(--p-text-dim)]" }, "Max GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                    type: "number",
                    inputmode: "numeric",
                    min: "0",
                    placeholder: "350",
                    size: "lg",
                    ui: unref(dashboardInputUi),
                    title: "Optional upper stock limit"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                  createVNode(_component_DashboardInlineError, {
                    message: fieldError("max_gsm")
                  }, null, 8, ["message"])
                ])
              ]),
              createVNode("details", { class: "group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]/60 px-4 py-3" }, [
                createVNode("summary", { class: "flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--p-text)]" }, [
                  createVNode("span", null, "Advanced settings"),
                  createVNode(_component_UIcon, {
                    name: "i-lucide-chevron-down",
                    class: "h-4 w-4 text-[var(--p-text-muted)] transition-transform group-open:rotate-180"
                  })
                ]),
                createVNode("div", { class: "mt-3 grid gap-3 border-t border-[var(--p-border)] pt-3 text-sm text-[var(--p-text-muted)]" }, [
                  createVNode("div", { class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5" }, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "Suggested print categories"),
                    createVNode("p", { class: "mt-1 text-sm text-[var(--p-text)]" }, toDisplayString(unref(suggestedCategories)), 1)
                  ]),
                  createVNode("p", null, "Use the largest sheet the machine reliably runs. Presets are shortcuts; manual width and height are what get saved."),
                  createVNode("p", null, "Inactive machines stay on record but should not be your current production default.")
                ])
              ]),
              createVNode("div", { class: "flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end" }, [
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
const __nuxt_component_7 = Object.assign(_sfc_main$1, { __name: "MachinesMachineForm" });
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
const formHash = "#machine-form";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const notification = useNotification();
    const machineStore = useMachineStore();
    const subscriptionStore = useSubscriptionStore();
    const slug = computed(() => route.params.slug);
    const panelOpen = ref(false);
    const editing = ref(null);
    const saving = ref(false);
    const fieldErrors = ref({});
    const subscription = computed(() => subscriptionStore.getSubscription(slug.value));
    const items = computed(
      () => [...machineStore.machines].sort((left, right) => left.name.localeCompare(right.name))
    );
    const activeCount = computed(() => items.value.filter((machine) => machine.is_active !== false).length);
    function openCreatePanel(options) {
      editing.value = null;
      fieldErrors.value = {};
      panelOpen.value = true;
      if (options?.updateHash !== false) {
        void syncHash(formHash);
      }
    }
    function editMachine(machine) {
      editing.value = machine;
      fieldErrors.value = {};
      panelOpen.value = true;
      void syncHash(formHash);
    }
    function closePanel() {
      panelOpen.value = false;
      editing.value = null;
      fieldErrors.value = {};
      if (route.hash === formHash) {
        void syncHash("");
      }
    }
    function sheetSizeSummary(machine) {
      if (!machine.max_width_mm || !machine.max_height_mm) return "Not set";
      return `${machine.max_width_mm} x ${machine.max_height_mm} mm`;
    }
    function gsmSummary(machine) {
      if (machine.min_gsm != null && machine.max_gsm != null) return `${machine.min_gsm}-${machine.max_gsm} gsm`;
      if (machine.max_gsm != null) return `Up to ${machine.max_gsm} gsm`;
      if (machine.min_gsm != null) return `From ${machine.min_gsm} gsm`;
      return "Not set";
    }
    async function submitMachine(data) {
      saving.value = true;
      fieldErrors.value = {};
      try {
        if (editing.value) {
          await machineStore.updateMachine(slug.value, editing.value.id, data);
          notification.success("Machine updated successfully.");
        } else {
          await machineStore.createMachine(slug.value, data);
          notification.success("Machine created successfully.");
        }
        closePanel();
      } catch (error) {
        const feedback = extractApiFeedback(error, "We could not save this machine right now.");
        fieldErrors.value = feedback.fieldErrors;
        notification.error(feedback.message);
      } finally {
        saving.value = false;
      }
    }
    async function deleteMachine(machine) {
      if (!confirm(`Delete "${machine.name}"?`)) return;
      try {
        await machineStore.deleteMachine(slug.value, machine.id);
        notification.success("Machine removed successfully.");
      } catch (error) {
        notification.error(error instanceof Error ? error.message : "We could not delete this machine right now.");
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
      const _component_MachinesMachineForm = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Machines",
        subtitle: "Manage machines here. Add and edit equipment from this page instead of large modals."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              color: "primary",
              onClick: () => openCreatePanel()
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
                color: "primary",
                onClick: () => openCreatePanel()
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
      _push(`<div class="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_22rem]"><div class="space-y-4"><div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">Machine registry</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Products, stock fit, and pricing rules should rely on the equipment listed here.</p></div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: unref(activeCount) ? "success" : "warning",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(activeCount))} active / ${ssrInterpolate(unref(items).length)} total `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(activeCount)) + " active / " + toDisplayString(unref(items).length) + " total ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(machineStore).loading && !unref(items).length) {
        _push(ssrRenderComponent(_component_DashboardSkeletonState, {
          variant: "cards",
          "card-count": 4
        }, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(items), (machine) => {
          _push(`<article class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(machine.name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(machine.machine_type || machine.type_display || "Machine")}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: machine.is_active !== false ? "success" : "neutral",
            variant: "soft"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(machine.is_active !== false ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(machine.is_active !== false ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 grid gap-3 md:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3.5"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Sheet Size</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(sheetSizeSummary(machine))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3.5"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">GSM Range</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(gsmSummary(machine))}</p></div></div><div class="mt-4 flex gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            onClick: ($event) => editMachine(machine)
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
            onClick: ($event) => deleteMachine(machine)
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
          title: "No machines yet",
          description: "Add the presses and finishing equipment this shop actually uses.",
          icon: "i-lucide-printer"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                onClick: () => openCreatePanel()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add first machine`);
                  } else {
                    return [
                      createTextVNode("Add first machine")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "primary",
                  onClick: () => openCreatePanel()
                }, {
                  default: withCtx(() => [
                    createTextVNode("Add first machine")
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
      if (unref(panelOpen)) {
        _push(`<div id="machine-form" tabindex="-1">`);
        _push(ssrRenderComponent(_component_DashboardAdminWorkspaceFormPanel, {
          title: unref(editing) ? "Edit Machine" : "Add Machine",
          description: unref(editing) ? "Update machine details for this shop." : "Create a machine record for this shop.",
          onClose: closePanel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_MachinesMachineForm, {
                key: unref(editing)?.id ?? "new-machine",
                machine: unref(editing),
                loading: unref(saving),
                "field-errors": unref(fieldErrors),
                "can-add-printing": unref(subscription)?.can_add_printing_machine ?? true,
                "can-add-finishing": unref(subscription)?.can_add_finishing_machine ?? true,
                onSubmit: submitMachine,
                onCancel: closePanel
              }, null, _parent2, _scopeId));
            } else {
              return [
                (openBlock(), createBlock(_component_MachinesMachineForm, {
                  key: unref(editing)?.id ?? "new-machine",
                  machine: unref(editing),
                  loading: unref(saving),
                  "field-errors": unref(fieldErrors),
                  "can-add-printing": unref(subscription)?.can_add_printing_machine ?? true,
                  "can-add-finishing": unref(subscription)?.can_add_finishing_machine ?? true,
                  onSubmit: submitMachine,
                  onCancel: closePanel
                }, null, 8, ["machine", "loading", "field-errors", "can-add-printing", "can-add-finishing"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/machines/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ds378O9K.mjs.map
