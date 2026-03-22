import { g as useRoute, d as _sfc_main$9, a as _sfc_main$f, h as useToast, j as useApi, A as API, y as safeLogError } from './server.mjs';
import { _ as __nuxt_component_3$1 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$7 } from './Badge-DzyqaO77.mjs';
import { _ as __nuxt_component_5$1 } from './DashboardModalForm-CK75m_2g.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, watch, toDisplayString, isRef, withModifiers, openBlock, createBlock, createCommentVNode, withKeys, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$8 } from './Alert-nALN31Ul.mjs';
import { _ as _sfc_main$a } from './FormField-Dl4QZCpm.mjs';
import { _ as _sfc_main$b } from './Input-D98neQoC.mjs';
import { _ as __nuxt_component_4$1 } from './InlineError-DcBNAnP_.mjs';
import { _ as _sfc_main$c } from './SelectMenu-DnLMxdXN.mjs';
import { _ as _sfc_main$d } from './Checkbox-8D35u7U_.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CX_axkrT.mjs';
import { useStorage } from '@vueuse/core';
import { b as listMachinesBySlug, h as deleteMachineBySlug, i as updateMachineBySlug, j as createMachineBySlug, a as listPapersBySlug, k as deletePaperBySlug, m as updatePaperBySlug, n as createPaperBySlug, o as listFinishingRatesBySlug, p as deleteFinishingRateBySlug, q as updateFinishingRateBySlug, r as createFinishingRateBySlug, f as listMaterialsBySlug, s as deleteMaterialBySlug, t as updateMaterialBySlug, v as createMaterialBySlug, w as listProductsBySlug, x as listProductCategoriesBySlug, y as deleteProductBySlug, z as createProductCategoryBySlug, A as updateProductBySlug, B as createProductBySlug } from './seller-B-6aM_bM.mjs';
import { u as useSubmissionFeedback } from './useSubmissionFeedback-DEV14iGN.mjs';
import { _ as _sfc_main$e } from './Textarea-m5qrWcEy.mjs';
import { u as useApi$1 } from './useApi-FvTSG0mK.mjs';
import { u as useSellerStore } from './seller-Bmym44up.mjs';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './useNotification-DukejKDK.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "LocalDraftNotice",
  __ssrInlineRender: true,
  props: {
    entityLabel: { default: "changes" },
    showClear: { type: Boolean, default: false }
  },
  emits: ["clear"],
  setup(__props) {
    const props = __props;
    const title = computed(() => `Local ${props.entityLabel} draft`);
    const description = computed(() => `This draft is stored only on this device. Nothing is saved to your shop until you click Save.`);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100 sm:flex-row sm:items-start sm:justify-between" }, _attrs))}><div class="space-y-1"><p class="font-semibold">${ssrInterpolate(unref(title))}</p><p class="leading-6 text-amber-900/80 dark:text-amber-100/85">${ssrInterpolate(unref(description))}</p></div>`);
      if (__props.showClear) {
        _push(ssrRenderComponent(_component_UButton, {
          variant: "ghost",
          color: "warning",
          size: "sm",
          class: "shrink-0",
          onClick: ($event) => _ctx.$emit("clear")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Discard Draft `);
            } else {
              return [
                createTextVNode(" Discard Draft ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/LocalDraftNotice.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_6$1 = Object.assign(_sfc_main$6, { __name: "DashboardLocalDraftNotice" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "SetupMachines",
  __ssrInlineRender: true,
  props: {
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const feedback = useSubmissionFeedback();
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const DRAFT_KEY = computed(() => `machine-draft-${props.shopSlug}`);
    const defaultForm = {
      name: "",
      machine_type: "DIGITAL",
      max_width_mm: 297,
      max_height_mm: 420,
      min_gsm: null,
      max_gsm: null,
      is_active: true
    };
    const form = useStorage(DRAFT_KEY.value, { ...defaultForm });
    const hasDraft = computed(() => (form.value.name?.trim().length ?? 0) > 0);
    const machineTypeOptions = [
      { value: "OFFSET", label: "Offset" },
      { value: "DIGITAL", label: "Digital" },
      { value: "LARGE_FORMAT", label: "Large Format" }
    ];
    const validationErrors = computed(() => ({
      name: form.value.name?.trim() ? null : "Machine name is required.",
      machine_type: form.value.machine_type ? null : "Machine type is required.",
      max_width_mm: Number(form.value.max_width_mm) > 0 ? null : "Max width must be greater than 0.",
      max_height_mm: Number(form.value.max_height_mm) > 0 ? null : "Max height must be greater than 0."
    }));
    const canSubmit = computed(() => Object.values(validationErrors.value).every((value) => !value));
    function fieldError(field) {
      return validationErrors.value[field];
    }
    function machineTypeLabel(t) {
      return machineTypeOptions.find((o) => o.value === t)?.label ?? t;
    }
    async function load() {
      if (!props.shopSlug) return;
      loading.value = true;
      try {
        items.value = await listMachinesBySlug(props.shopSlug);
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function openModal(m) {
      feedback.reset();
      editing.value = m ?? null;
      if (m) {
        form.value = {
          name: m.name,
          machine_type: m.machine_type,
          max_width_mm: m.max_width_mm,
          max_height_mm: m.max_height_mm,
          min_gsm: m.min_gsm,
          max_gsm: m.max_gsm,
          is_active: m.is_active
        };
      } else if (!form.value.name?.trim()) {
        form.value = { ...defaultForm };
      }
      modalOpen.value = true;
    }
    function clearDraft() {
      form.value = { ...defaultForm };
    }
    function edit(m) {
      openModal(m);
    }
    async function onSubmit() {
      feedback.reset();
      if (!canSubmit.value) {
        feedback.setError("Please correct the highlighted machine fields.", "Validation", false);
        return;
      }
      saving.value = true;
      try {
        const payload = {
          name: form.value.name,
          machine_type: form.value.machine_type,
          max_width_mm: form.value.max_width_mm,
          max_height_mm: form.value.max_height_mm,
          min_gsm: form.value.min_gsm ?? void 0,
          max_gsm: form.value.max_gsm ?? void 0,
          is_active: form.value.is_active
        };
        if (editing.value) {
          await updateMachineBySlug(props.shopSlug, editing.value.id, payload);
          feedback.setSuccess("Machine saved successfully.");
        } else {
          await createMachineBySlug(props.shopSlug, payload);
          feedback.setSuccess("Machine saved successfully.");
        }
        clearDraft();
        modalOpen.value = false;
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not save this machine right now.");
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(m) {
      if (!confirm(`Delete "${m.name}"?`)) return;
      try {
        await deleteMachineBySlug(props.shopSlug, m.id);
        feedback.setSuccess("Machine deleted successfully.");
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not delete this machine right now.");
      }
    }
    watch(() => props.shopSlug, () => load(), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$7;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_DashboardLocalDraftNotice = __nuxt_component_6$1;
      const _component_UAlert = _sfc_main$8;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_USelectMenu = _sfc_main$c;
      const _component_UCheckbox = _sfc_main$d;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex justify-between items-center"><p class="text-sm text-[var(--p-text-muted)]">Add printers and equipment. Set printing rates per machine.</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-4 w-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add machine `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4 mr-2"
              }),
              createTextVNode(" Add machine ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Type</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (m) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(m.name)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(machineTypeLabel(m.machine_type))}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(m.max_width_mm)} × ${ssrInterpolate(m.max_height_mm)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: m.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(m.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(m.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right space-x-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            to: `/dashboard/machines/${m.id}/rates?shop=${props.shopSlug}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Rates `);
              } else {
                return [
                  createTextVNode(" Rates ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(m)
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
            onClick: ($event) => confirmDelete(m)
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
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-printer",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No machines yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add your first printer to set printing rates.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: ($event) => openModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add machine`);
            } else {
              return [
                createTextVNode("Add machine")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit machine" : "Add machine",
        description: unref(editing) ? "Update printer details." : "Add a printer or equipment."
      }, {
        footer: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              onClick: close
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
              color: "primary",
              loading: unref(saving) || unref(feedback).submitting,
              disabled: !unref(canSubmit),
              onClick: onSubmit
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Machine")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Machine"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  color: "primary",
                  loading: unref(saving) || unref(feedback).submitting,
                  disabled: !unref(canSubmit),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Machine"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            if (unref(hasDraft) && !unref(editing)) {
              _push2(ssrRenderComponent(_component_DashboardLocalDraftNotice, {
                "entity-label": "machine",
                "show-clear": true,
                onClear: clearDraft
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save machine",
                description: unref(feedback).errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Name",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "e.g. HP Indigo",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("name")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "e.g. HP Indigo",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("name")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Type",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).machine_type,
                    "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
                    items: machineTypeOptions,
                    "value-key": "value",
                    class: "rounded-xl"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("machine_type")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).machine_type,
                      "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
                      items: machineTypeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("machine_type")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Max width (mm)",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("max_width_mm")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_width_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("max_width_mm")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Max height (mm)",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("max_height_mm")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_height_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("max_height_mm")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Min GSM" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).min_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Max GSM" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).is_active,
              "onUpdate:modelValue": ($event) => unref(form).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>Active</span></div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(onSubmit, ["prevent"])
              }, [
                unref(hasDraft) && !unref(editing) ? (openBlock(), createBlock(_component_DashboardLocalDraftNotice, {
                  key: 0,
                  "entity-label": "machine",
                  "show-clear": true,
                  onClear: clearDraft
                })) : createCommentVNode("", true),
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "error",
                  variant: "soft",
                  title: "Could not save machine",
                  description: unref(feedback).errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode(_component_UFormField, {
                  label: "Name",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "e.g. HP Indigo",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("name")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Type",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).machine_type,
                      "onUpdate:modelValue": ($event) => unref(form).machine_type = $event,
                      items: machineTypeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("machine_type")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Max width (mm)",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_width_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("max_width_mm")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Max height (mm)",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_height_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("max_height_mm")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Min GSM" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Max GSM" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).is_active,
                    "onUpdate:modelValue": ($event) => unref(form).is_active = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm" }, "Active")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/seller/SetupMachines.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$5, { __name: "DashboardSellerSetupMachines" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SetupPapers",
  __ssrInlineRender: true,
  props: {
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const feedback = useSubmissionFeedback();
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const DRAFT_KEY = computed(() => `paper-draft-${props.shopSlug}`);
    const defaultForm = {
      sheet_size: "A4",
      gsm: 80,
      paper_type: "UNCOATED",
      buying_price: "0",
      selling_price: "0",
      quantity_in_stock: null,
      reorder_level: null,
      is_active: true
    };
    const form = useStorage(DRAFT_KEY.value, { ...defaultForm });
    const hasDraft = computed(() => form.value.buying_price !== "0" || form.value.selling_price !== "0" || (form.value.gsm ?? 0) > 0);
    const sheetSizeOptions = [
      { value: "A4", label: "A4" },
      { value: "A3", label: "A3" },
      { value: "SRA3", label: "SRA3" },
      { value: "A2", label: "A2" },
      { value: "A1", label: "A1" },
      { value: "A0", label: "A0" },
      { value: "CUSTOM", label: "Custom" }
    ];
    const paperTypeOptions = [
      { value: "COATED", label: "Coated" },
      { value: "UNCOATED", label: "Uncoated" },
      { value: "RECYCLED", label: "Recycled" },
      { value: "GLOSS", label: "Gloss" },
      { value: "MATTE", label: "Matte" },
      { value: "OTHER", label: "Other" }
    ];
    const validationErrors = computed(() => ({
      sheet_size: form.value.sheet_size ? null : "Sheet size is required.",
      gsm: Number(form.value.gsm) > 0 ? null : "GSM must be greater than 0.",
      paper_type: form.value.paper_type ? null : "Paper type is required.",
      buying_price: String(form.value.buying_price).trim() ? null : "Buying price is required.",
      selling_price: String(form.value.selling_price).trim() ? null : "Selling price is required."
    }));
    const canSubmit = computed(() => Object.values(validationErrors.value).every((value) => !value));
    function fieldError(field) {
      return validationErrors.value[field];
    }
    async function load() {
      if (!props.shopSlug) return;
      loading.value = true;
      try {
        items.value = await listPapersBySlug(props.shopSlug);
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function openModal(p) {
      feedback.reset();
      editing.value = p ?? null;
      if (p) {
        form.value = {
          sheet_size: p.sheet_size,
          gsm: p.gsm,
          paper_type: p.paper_type,
          buying_price: p.buying_price,
          selling_price: p.selling_price,
          quantity_in_stock: p.quantity_in_stock,
          reorder_level: p.reorder_level,
          is_active: p.is_active
        };
      } else if (!hasDraft.value) {
        form.value = { ...defaultForm };
      }
      modalOpen.value = true;
    }
    function edit(p) {
      openModal(p);
    }
    function clearDraft() {
      form.value = { ...defaultForm };
    }
    async function onSubmit() {
      feedback.reset();
      if (!canSubmit.value) {
        feedback.setError("Please correct the highlighted paper fields.", "Validation", false);
        return;
      }
      saving.value = true;
      try {
        const payload = {
          sheet_size: form.value.sheet_size,
          gsm: form.value.gsm,
          paper_type: form.value.paper_type,
          buying_price: form.value.buying_price,
          selling_price: form.value.selling_price,
          quantity_in_stock: form.value.quantity_in_stock ?? void 0,
          reorder_level: form.value.reorder_level ?? void 0,
          is_active: form.value.is_active
        };
        if (editing.value) {
          await updatePaperBySlug(props.shopSlug, editing.value.id, payload);
          feedback.setSuccess("Paper saved successfully.");
        } else {
          await createPaperBySlug(props.shopSlug, payload);
          feedback.setSuccess("Paper saved successfully.");
        }
        clearDraft();
        modalOpen.value = false;
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not save this paper right now.");
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(p) {
      if (!confirm(`Delete ${p.sheet_size} ${p.gsm}gsm ${p.paper_type}?`)) return;
      try {
        await deletePaperBySlug(props.shopSlug, p.id);
        feedback.setSuccess("Paper deleted successfully.");
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not delete this paper right now.");
      }
    }
    watch(() => props.shopSlug, () => load(), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$7;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_DashboardLocalDraftNotice = __nuxt_component_6$1;
      const _component_UAlert = _sfc_main$8;
      const _component_UFormField = _sfc_main$a;
      const _component_USelectMenu = _sfc_main$c;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_UInput = _sfc_main$b;
      const _component_UCheckbox = _sfc_main$d;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex justify-between items-center"><p class="text-sm text-[var(--p-text-muted)]">Paper stock by size, GSM and type. Used for SHEET pricing.</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-4 w-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add paper `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4 mr-2"
              }),
              createTextVNode(" Add paper ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Paper</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">In stock</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buy / Sell</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (p) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3"><div class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(p.sheet_size)} ${ssrInterpolate(p.gsm)}gsm</div><div class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(p.paper_type)}</div></td><td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.quantity_in_stock ?? "-")}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.buying_price)} / ${ssrInterpolate(p.selling_price)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: p.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(p)
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
            onClick: ($event) => confirmDelete(p)
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
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-file-stack",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No papers yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add paper stock for sheet-fed printing.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: ($event) => openModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add paper`);
            } else {
              return [
                createTextVNode("Add paper")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit paper" : "Add paper",
        description: unref(editing) ? "Update paper stock." : "Add paper stock."
      }, {
        footer: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              onClick: close
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
              color: "primary",
              loading: unref(saving) || unref(feedback).submitting,
              disabled: !unref(canSubmit),
              onClick: onSubmit
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Paper")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Paper"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  color: "primary",
                  loading: unref(saving) || unref(feedback).submitting,
                  disabled: !unref(canSubmit),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Paper"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            if (unref(hasDraft) && !unref(editing)) {
              _push2(ssrRenderComponent(_component_DashboardLocalDraftNotice, {
                "entity-label": "paper",
                "show-clear": true,
                onClear: clearDraft
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save paper",
                description: unref(feedback).errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Sheet size",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).sheet_size,
                    "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                    items: sheetSizeOptions,
                    "value-key": "value",
                    class: "rounded-xl"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("sheet_size")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                      items: sheetSizeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("sheet_size")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "GSM",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).gsm,
                    "onUpdate:modelValue": ($event) => unref(form).gsm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("gsm")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).gsm,
                      "onUpdate:modelValue": ($event) => unref(form).gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("gsm")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Paper type",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).paper_type,
                    "onUpdate:modelValue": ($event) => unref(form).paper_type = $event,
                    items: paperTypeOptions,
                    "value-key": "value",
                    class: "rounded-xl"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("paper_type")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).paper_type,
                      "onUpdate:modelValue": ($event) => unref(form).paper_type = $event,
                      items: paperTypeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("paper_type")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Buying price",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).buying_price,
                    "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                    type: "text",
                    placeholder: "0.00",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("buying_price")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).buying_price,
                      "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("buying_price")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Selling price",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).selling_price,
                    "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                    type: "text",
                    placeholder: "0.00",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("selling_price")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).selling_price,
                      "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("selling_price")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Quantity in stock" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).quantity_in_stock,
                    "onUpdate:modelValue": ($event) => unref(form).quantity_in_stock = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).quantity_in_stock,
                      "onUpdate:modelValue": ($event) => unref(form).quantity_in_stock = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Reorder level" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).reorder_level,
                    "onUpdate:modelValue": ($event) => unref(form).reorder_level = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).reorder_level,
                      "onUpdate:modelValue": ($event) => unref(form).reorder_level = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).is_active,
              "onUpdate:modelValue": ($event) => unref(form).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>Active</span></div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(onSubmit, ["prevent"])
              }, [
                unref(hasDraft) && !unref(editing) ? (openBlock(), createBlock(_component_DashboardLocalDraftNotice, {
                  key: 0,
                  "entity-label": "paper",
                  "show-clear": true,
                  onClear: clearDraft
                })) : createCommentVNode("", true),
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "error",
                  variant: "soft",
                  title: "Could not save paper",
                  description: unref(feedback).errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode(_component_UFormField, {
                  label: "Sheet size",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                      items: sheetSizeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("sheet_size")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "GSM",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).gsm,
                      "onUpdate:modelValue": ($event) => unref(form).gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("gsm")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Paper type",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).paper_type,
                      "onUpdate:modelValue": ($event) => unref(form).paper_type = $event,
                      items: paperTypeOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("paper_type")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Buying price",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).buying_price,
                      "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("buying_price")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Selling price",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).selling_price,
                      "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("selling_price")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Quantity in stock" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).quantity_in_stock,
                      "onUpdate:modelValue": ($event) => unref(form).quantity_in_stock = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Reorder level" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).reorder_level,
                      "onUpdate:modelValue": ($event) => unref(form).reorder_level = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).is_active,
                    "onUpdate:modelValue": ($event) => unref(form).is_active = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm" }, "Active")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/seller/SetupPapers.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$4, { __name: "DashboardSellerSetupPapers" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SetupFinishing",
  __ssrInlineRender: true,
  props: {
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const feedback = useSubmissionFeedback();
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const DRAFT_KEY = computed(() => `finishing-draft-${props.shopSlug}`);
    const defaultForm = {
      name: "",
      charge_unit: "PER_PIECE",
      price: "0",
      setup_fee: null,
      min_qty: null,
      is_active: true
    };
    const form = useStorage(DRAFT_KEY.value, { ...defaultForm });
    const hasDraft = computed(() => (form.value.name?.trim().length ?? 0) > 0);
    const chargeUnitOptions = [
      { value: "PER_PIECE", label: "Per piece" },
      { value: "PER_SIDE", label: "Per side" },
      { value: "PER_SHEET", label: "Per sheet" },
      { value: "PER_SIDE_PER_SHEET", label: "Per side per sheet" },
      { value: "PER_SQM", label: "Per sqm" },
      { value: "FLAT", label: "Flat" }
    ];
    const validationErrors = computed(() => ({
      name: form.value.name?.trim() ? null : "Name is required.",
      charge_unit: form.value.charge_unit ? null : "Charge unit is required.",
      price: String(form.value.price).trim() ? null : "Price is required."
    }));
    const canSubmit = computed(() => Object.values(validationErrors.value).every((value) => !value));
    function fieldError(field) {
      return validationErrors.value[field];
    }
    function chargeUnitLabel(u) {
      return chargeUnitOptions.find((o) => o.value === u)?.label ?? u;
    }
    async function load() {
      if (!props.shopSlug) return;
      loading.value = true;
      try {
        items.value = await listFinishingRatesBySlug(props.shopSlug);
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function openModal(f) {
      feedback.reset();
      editing.value = f ?? null;
      if (f) {
        form.value = {
          name: f.name,
          charge_unit: f.charge_unit,
          price: f.price,
          setup_fee: f.setup_fee,
          min_qty: f.min_qty,
          is_active: f.is_active
        };
      } else if (!hasDraft.value) {
        form.value = { ...defaultForm };
      }
      modalOpen.value = true;
    }
    function edit(f) {
      openModal(f);
    }
    function clearDraft() {
      form.value = { ...defaultForm };
    }
    async function onSubmit() {
      feedback.reset();
      if (!canSubmit.value) {
        feedback.setError("Please correct the highlighted finishing fields.", "Validation", false);
        return;
      }
      saving.value = true;
      try {
        const payload = {
          name: form.value.name,
          charge_unit: form.value.charge_unit,
          price: form.value.price,
          setup_fee: form.value.setup_fee || void 0,
          min_qty: form.value.min_qty ?? void 0,
          is_active: form.value.is_active
        };
        if (editing.value) {
          await updateFinishingRateBySlug(props.shopSlug, editing.value.id, payload);
          feedback.setSuccess("Finishing service saved successfully.");
        } else {
          await createFinishingRateBySlug(props.shopSlug, payload);
          feedback.setSuccess("Finishing service saved successfully.");
        }
        clearDraft();
        modalOpen.value = false;
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not save this finishing rate right now.");
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(f) {
      if (!confirm(`Delete "${f.name}"?`)) return;
      try {
        await deleteFinishingRateBySlug(props.shopSlug, f.id);
        feedback.setSuccess("Finishing rate deleted successfully.");
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not delete this finishing rate right now.");
      }
    }
    watch(() => props.shopSlug, () => load(), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$7;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_DashboardLocalDraftNotice = __nuxt_component_6$1;
      const _component_UAlert = _sfc_main$8;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_USelectMenu = _sfc_main$c;
      const _component_UCheckbox = _sfc_main$d;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex justify-between items-center"><p class="text-sm text-[var(--p-text-muted)]">Finishing services (lamination, binding, etc.) with charge units.</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-4 w-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add finishing `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4 mr-2"
              }),
              createTextVNode(" Add finishing ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Charge</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Price</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (f) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(f.name)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(chargeUnitLabel(f.charge_unit))}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">${ssrInterpolate(f.price)}${ssrInterpolate(f.setup_fee ? ` + ${f.setup_fee} setup` : "")}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: f.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(f.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(f.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(f)
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
            onClick: ($event) => confirmDelete(f)
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
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-scissors",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No finishing rates yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add lamination, binding, etc.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: ($event) => openModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add finishing`);
            } else {
              return [
                createTextVNode("Add finishing")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit finishing" : "Add finishing",
        description: unref(editing) ? "Update finishing rate." : "Add a finishing service."
      }, {
        footer: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              onClick: close
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
              color: "primary",
              loading: unref(saving) || unref(feedback).submitting,
              disabled: !unref(canSubmit),
              onClick: onSubmit
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Finishing")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Finishing"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  color: "primary",
                  loading: unref(saving) || unref(feedback).submitting,
                  disabled: !unref(canSubmit),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Finishing"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            if (unref(hasDraft) && !unref(editing)) {
              _push2(ssrRenderComponent(_component_DashboardLocalDraftNotice, {
                "entity-label": "finishing",
                "show-clear": true,
                onClear: clearDraft
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save finishing rate",
                description: unref(feedback).errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Name",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "e.g. Lamination",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("name")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "e.g. Lamination",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("name")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Charge unit",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).charge_unit,
                    "onUpdate:modelValue": ($event) => unref(form).charge_unit = $event,
                    items: chargeUnitOptions,
                    "value-key": "value",
                    class: "rounded-xl"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("charge_unit")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).charge_unit,
                      "onUpdate:modelValue": ($event) => unref(form).charge_unit = $event,
                      items: chargeUnitOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("charge_unit")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Price",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).price,
                    "onUpdate:modelValue": ($event) => unref(form).price = $event,
                    type: "text",
                    placeholder: "0.00",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("price")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).price,
                      "onUpdate:modelValue": ($event) => unref(form).price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("price")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Setup fee" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).setup_fee,
                    "onUpdate:modelValue": ($event) => unref(form).setup_fee = $event,
                    type: "text",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).setup_fee,
                      "onUpdate:modelValue": ($event) => unref(form).setup_fee = $event,
                      type: "text",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, { label: "Min quantity" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).min_qty,
                    "onUpdate:modelValue": ($event) => unref(form).min_qty = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_qty,
                      "onUpdate:modelValue": ($event) => unref(form).min_qty = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).is_active,
              "onUpdate:modelValue": ($event) => unref(form).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>Active</span></div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(onSubmit, ["prevent"])
              }, [
                unref(hasDraft) && !unref(editing) ? (openBlock(), createBlock(_component_DashboardLocalDraftNotice, {
                  key: 0,
                  "entity-label": "finishing",
                  "show-clear": true,
                  onClear: clearDraft
                })) : createCommentVNode("", true),
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "error",
                  variant: "soft",
                  title: "Could not save finishing rate",
                  description: unref(feedback).errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode(_component_UFormField, {
                  label: "Name",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "e.g. Lamination",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("name")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Charge unit",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).charge_unit,
                      "onUpdate:modelValue": ($event) => unref(form).charge_unit = $event,
                      items: chargeUnitOptions,
                      "value-key": "value",
                      class: "rounded-xl"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("charge_unit")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Price",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).price,
                      "onUpdate:modelValue": ($event) => unref(form).price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("price")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Setup fee" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).setup_fee,
                      "onUpdate:modelValue": ($event) => unref(form).setup_fee = $event,
                      type: "text",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Min quantity" }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_qty,
                      "onUpdate:modelValue": ($event) => unref(form).min_qty = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).is_active,
                    "onUpdate:modelValue": ($event) => unref(form).is_active = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm" }, "Active")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/seller/SetupFinishing.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "DashboardSellerSetupFinishing" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SetupMaterials",
  __ssrInlineRender: true,
  props: {
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const feedback = useSubmissionFeedback();
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const DRAFT_KEY = computed(() => `material-draft-${props.shopSlug}`);
    const defaultForm = {
      material_type: "",
      unit: "SQM",
      buying_price: "0",
      selling_price: "0",
      is_active: true
    };
    const form = useStorage(DRAFT_KEY.value, { ...defaultForm });
    const hasDraft = computed(() => (form.value.material_type?.trim().length ?? 0) > 0);
    const validationErrors = computed(() => ({
      material_type: form.value.material_type?.trim() ? null : "Material type is required.",
      unit: form.value.unit?.trim() ? null : "Unit is required.",
      buying_price: String(form.value.buying_price).trim() ? null : "Buying price is required.",
      selling_price: String(form.value.selling_price).trim() ? null : "Selling price is required."
    }));
    const canSubmit = computed(() => Object.values(validationErrors.value).every((value) => !value));
    function fieldError(field) {
      return validationErrors.value[field];
    }
    async function load() {
      if (!props.shopSlug) return;
      loading.value = true;
      try {
        items.value = await listMaterialsBySlug(props.shopSlug);
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function openModal(m) {
      feedback.reset();
      editing.value = m ?? null;
      if (m) {
        form.value = {
          material_type: m.material_type,
          unit: m.unit,
          buying_price: m.buying_price,
          selling_price: m.selling_price,
          is_active: m.is_active
        };
      } else if (!hasDraft.value) {
        form.value = { ...defaultForm };
      }
      modalOpen.value = true;
    }
    function edit(m) {
      openModal(m);
    }
    function clearDraft() {
      form.value = { ...defaultForm };
    }
    async function onSubmit() {
      feedback.reset();
      if (!canSubmit.value) {
        feedback.setError("Please correct the highlighted material fields.", "Validation", false);
        return;
      }
      saving.value = true;
      try {
        const payload = {
          material_type: form.value.material_type,
          unit: form.value.unit,
          buying_price: form.value.buying_price,
          selling_price: form.value.selling_price,
          is_active: form.value.is_active
        };
        if (editing.value) {
          await updateMaterialBySlug(props.shopSlug, editing.value.id, payload);
          feedback.setSuccess("Material saved successfully.");
        } else {
          await createMaterialBySlug(props.shopSlug, payload);
          feedback.setSuccess("Material saved successfully.");
        }
        clearDraft();
        modalOpen.value = false;
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not save this material right now.");
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(m) {
      if (!confirm(`Delete "${m.material_type}"?`)) return;
      try {
        await deleteMaterialBySlug(props.shopSlug, m.id);
        feedback.setSuccess("Material deleted successfully.");
        await load();
      } catch (e) {
        feedback.applyApiError(e, "We could not delete this material right now.");
      }
    }
    watch(() => props.shopSlug, () => load(), { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_UBadge = _sfc_main$7;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_DashboardLocalDraftNotice = __nuxt_component_6$1;
      const _component_UAlert = _sfc_main$8;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_DashboardInlineError = __nuxt_component_4$1;
      const _component_UCheckbox = _sfc_main$d;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex justify-between items-center"><p class="text-sm text-[var(--p-text-muted)]">Large-format materials (vinyl, banner, etc.) sold by area. Used for LARGE_FORMAT pricing.</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-4 w-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add material `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4 mr-2"
              }),
              createTextVNode(" Add material ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Material</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Unit</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buy / Sell</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (m) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(m.material_type)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(m.unit)}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">${ssrInterpolate(m.buying_price)} / ${ssrInterpolate(m.selling_price)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: m.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(m.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(m.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(m)
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
            onClick: ($event) => confirmDelete(m)
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
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-layers",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No materials yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add vinyl, banner, etc. for large-format printing.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: ($event) => openModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add material`);
            } else {
              return [
                createTextVNode("Add material")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit material" : "Add material",
        description: unref(editing) ? "Update material." : "Add large-format material."
      }, {
        footer: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              onClick: close
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
              color: "primary",
              loading: unref(saving) || unref(feedback).submitting,
              disabled: !unref(canSubmit),
              onClick: onSubmit
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(editing) ? "Save Changes" : "Save Material")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Material"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_DashboardLoadingButton, {
                  color: "primary",
                  loading: unref(saving) || unref(feedback).submitting,
                  disabled: !unref(canSubmit),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(editing) ? "Save Changes" : "Save Material"), 1)
                  ]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-4"${_scopeId}>`);
            if (unref(hasDraft) && !unref(editing)) {
              _push2(ssrRenderComponent(_component_DashboardLocalDraftNotice, {
                "entity-label": "material",
                "show-clear": true,
                onClear: clearDraft
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(feedback).errorMessage) {
              _push2(ssrRenderComponent(_component_UAlert, {
                color: "error",
                variant: "soft",
                title: "Could not save material",
                description: unref(feedback).errorMessage,
                icon: "i-lucide-alert-circle"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Material type",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).material_type,
                    "onUpdate:modelValue": ($event) => unref(form).material_type = $event,
                    placeholder: "e.g. Vinyl, Banner",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("material_type")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).material_type,
                      "onUpdate:modelValue": ($event) => unref(form).material_type = $event,
                      placeholder: "e.g. Vinyl, Banner",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("material_type")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Unit",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).unit,
                    "onUpdate:modelValue": ($event) => unref(form).unit = $event,
                    placeholder: "e.g. SQM",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("unit")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).unit,
                      "onUpdate:modelValue": ($event) => unref(form).unit = $event,
                      placeholder: "e.g. SQM",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("unit")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Buying price",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).buying_price,
                    "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                    type: "text",
                    placeholder: "0.00",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("buying_price")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).buying_price,
                      "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("buying_price")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Selling price",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).selling_price,
                    "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                    type: "text",
                    placeholder: "0.00",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_DashboardInlineError, {
                    message: fieldError("selling_price")
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).selling_price,
                      "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("selling_price")
                    }, null, 8, ["message"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).is_active,
              "onUpdate:modelValue": ($event) => unref(form).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm"${_scopeId}>Active</span></div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-4",
                onSubmit: withModifiers(onSubmit, ["prevent"])
              }, [
                unref(hasDraft) && !unref(editing) ? (openBlock(), createBlock(_component_DashboardLocalDraftNotice, {
                  key: 0,
                  "entity-label": "material",
                  "show-clear": true,
                  onClear: clearDraft
                })) : createCommentVNode("", true),
                unref(feedback).errorMessage ? (openBlock(), createBlock(_component_UAlert, {
                  key: 1,
                  color: "error",
                  variant: "soft",
                  title: "Could not save material",
                  description: unref(feedback).errorMessage,
                  icon: "i-lucide-alert-circle"
                }, null, 8, ["description"])) : createCommentVNode("", true),
                createVNode(_component_UFormField, {
                  label: "Material type",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).material_type,
                      "onUpdate:modelValue": ($event) => unref(form).material_type = $event,
                      placeholder: "e.g. Vinyl, Banner",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("material_type")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Unit",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).unit,
                      "onUpdate:modelValue": ($event) => unref(form).unit = $event,
                      placeholder: "e.g. SQM",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("unit")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Buying price",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).buying_price,
                      "onUpdate:modelValue": ($event) => unref(form).buying_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("buying_price")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, {
                  label: "Selling price",
                  required: ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).selling_price,
                      "onUpdate:modelValue": ($event) => unref(form).selling_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_component_DashboardInlineError, {
                      message: fieldError("selling_price")
                    }, null, 8, ["message"])
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).is_active,
                    "onUpdate:modelValue": ($event) => unref(form).is_active = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm" }, "Active")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/seller/SetupMaterials.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$2, { __name: "DashboardSellerSetupMaterials" });
const ADD_CATEGORY_VALUE = "__add__";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SetupProducts",
  __ssrInlineRender: true,
  props: {
    shopSlug: {},
    shopExists: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const toast = useToast();
    const { getMediaUrl: composableGetMediaUrl } = useApi$1();
    const items = ref([]);
    const loadError = ref(null);
    const submitError = ref(null);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const productCategories = ref([]);
    const productCategoriesLoading = ref(false);
    const showAddCategory = ref(false);
    const newCategoryName = ref("");
    const addingCategory = ref(false);
    const shopMachines = ref([]);
    const shopFinishingRates = ref([]);
    const finishingCategories = ref([]);
    const finishingRatesLoading = ref(false);
    const finishingCategoryFilter = ref("");
    const filteredFinishingRates = computed(() => {
      if (!finishingCategoryFilter.value) return shopFinishingRates.value;
      return shopFinishingRates.value.filter(
        (fr) => fr.category_detail?.slug === finishingCategoryFilter.value
      );
    });
    const categorySelectItems = computed(() => {
      const items2 = [
        { value: null, label: "— None —" },
        ...productCategories.value.map((c) => ({ value: c.id, label: c.name })),
        { value: ADD_CATEGORY_VALUE, label: "+ Add new category..." }
      ];
      return items2;
    });
    const categorySelectValue = computed(() => {
      if (showAddCategory.value) return ADD_CATEGORY_VALUE;
      const c = form.value.category;
      return typeof c === "number" ? c : null;
    });
    function onCategorySelect(v) {
      if (v === ADD_CATEGORY_VALUE) {
        showAddCategory.value = true;
        newCategoryName.value = "";
      } else {
        showAddCategory.value = false;
        form.value.category = v;
      }
    }
    async function loadProductCategories() {
      if (!props.shopSlug) return;
      productCategoriesLoading.value = true;
      try {
        productCategories.value = await listProductCategoriesBySlug(props.shopSlug);
      } catch {
        productCategories.value = [];
      } finally {
        productCategoriesLoading.value = false;
      }
    }
    async function addNewCategory() {
      const name = newCategoryName.value.trim();
      if (!name) return;
      addingCategory.value = true;
      try {
        const created = await createProductCategoryBySlug(props.shopSlug, { name });
        productCategories.value = [...productCategories.value, created];
        form.value.category = created.id;
        showAddCategory.value = false;
        newCategoryName.value = "";
        toast.add({ title: "Category added", color: "success" });
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      } finally {
        addingCategory.value = false;
      }
    }
    const newImageFiles = ref([]);
    const imagePreviews = ref([]);
    const existingImages = ref([]);
    const imagesToDelete = ref([]);
    const DRAFT_KEY = computed(() => `product-draft-${props.shopSlug}`);
    const defaultForm = {
      name: "",
      description: "",
      category: null,
      pricing_mode: "SHEET",
      default_finished_width_mm: 90,
      default_finished_height_mm: 54,
      default_sheet_size: "",
      default_bleed_mm: 3,
      min_quantity: 1,
      turnaround_days: null,
      min_width_mm: null,
      min_height_mm: null,
      max_width_mm: null,
      max_height_mm: null,
      min_gsm: null,
      max_gsm: null,
      allowed_sheet_sizes_str: "",
      allow_simplex: true,
      allow_duplex: true,
      default_sides: "SIMPLEX",
      default_machine: null,
      is_active: true,
      finishing_options: []
    };
    const form = useStorage(DRAFT_KEY.value, { ...defaultForm });
    const hasDraft = computed(() => form.value.name.trim().length > 0);
    const pricingModeOptions = [
      { value: "SHEET", label: "Sheet" },
      { value: "LARGE_FORMAT", label: "Large Format" }
    ];
    const sidesOptions = [
      { value: "SIMPLEX", label: "Simplex (1-sided)" },
      { value: "DUPLEX", label: "Duplex (2-sided)" }
    ];
    function toggleFinishing(finishingRateId, checked) {
      if (checked) {
        form.value.finishing_options.push({
          finishing_rate: finishingRateId,
          is_default: false,
          price_adjustment: null
        });
      } else {
        form.value.finishing_options = form.value.finishing_options.filter(
          (fo) => fo.finishing_rate !== finishingRateId
        );
      }
    }
    function onFileSelect(event) {
      const target = event.target;
      if (!target.files) return;
      for (const file of Array.from(target.files)) {
        newImageFiles.value.push(file);
        imagePreviews.value.push(URL.createObjectURL(file));
      }
      target.value = "";
    }
    function removeNewImage(index) {
      URL.revokeObjectURL(imagePreviews.value[index]);
      newImageFiles.value.splice(index, 1);
      imagePreviews.value.splice(index, 1);
    }
    function removeExistingImage(imageId) {
      imagesToDelete.value.push(imageId);
      existingImages.value = existingImages.value.filter((img) => img.id !== imageId);
    }
    function getMediaUrl(path) {
      return composableGetMediaUrl(path) ?? "";
    }
    function formatTurnaround(days) {
      if (!days) return "On request";
      return `${days} day${days === 1 ? "" : "s"}`;
    }
    async function loadFinishingData() {
      finishingRatesLoading.value = true;
      try {
        const [rates, categories] = await Promise.all([
          listFinishingRatesBySlug(props.shopSlug),
          loadCategories()
        ]);
        shopFinishingRates.value = rates;
        finishingCategories.value = categories;
      } catch {
        shopFinishingRates.value = [];
        finishingCategories.value = [];
      } finally {
        finishingRatesLoading.value = false;
      }
    }
    async function loadCategories() {
      const api = useApi();
      try {
        const data = await api(API.finishingCategories());
        return Array.isArray(data) ? data : data.results ?? [];
      } catch {
        return [];
      }
    }
    async function load() {
      if (!props.shopSlug) return;
      loading.value = true;
      loadError.value = null;
      try {
        items.value = await listProductsBySlug(props.shopSlug);
      } catch (e) {
        items.value = [];
        const err = e;
        const status = err?.statusCode ?? err?.status;
        loadError.value = status === 500 ? "Server error (500) — products API may need a backend deploy." : e instanceof Error ? e.message : "Failed to load products";
      } finally {
        loading.value = false;
      }
    }
    function clearDraft() {
      Object.assign(form.value, { ...defaultForm, finishing_options: [] });
    }
    function openModal(p) {
      submitError.value = null;
      editing.value = p ?? null;
      imagePreviews.value = [];
      newImageFiles.value = [];
      imagesToDelete.value = [];
      existingImages.value = [];
      if (p) {
        form.value.name = p.name;
        form.value.description = p.description ?? "";
        form.value.category = typeof p.category === "number" ? p.category : null;
        form.value.pricing_mode = p.pricing_mode;
        form.value.default_finished_width_mm = p.default_finished_width_mm;
        form.value.default_finished_height_mm = p.default_finished_height_mm;
        form.value.default_bleed_mm = p.default_bleed_mm;
        form.value.min_quantity = p.min_quantity ?? 1;
        form.value.turnaround_days = p.turnaround_days ?? null;
        form.value.min_width_mm = p.min_width_mm ?? null;
        form.value.min_height_mm = p.min_height_mm ?? null;
        form.value.max_width_mm = p.max_width_mm ?? null;
        form.value.max_height_mm = p.max_height_mm ?? null;
        form.value.min_gsm = p.min_gsm ?? null;
        form.value.max_gsm = p.max_gsm ?? null;
        form.value.default_sheet_size = p.default_sheet_size ?? "";
        form.value.allowed_sheet_sizes_str = Array.isArray(p.allowed_sheet_sizes) ? p.allowed_sheet_sizes.join(", ") : "";
        form.value.allow_simplex = p.allow_simplex ?? true;
        form.value.allow_duplex = p.allow_duplex ?? true;
        form.value.default_sides = p.default_sides;
        form.value.default_machine = p.default_machine ?? null;
        form.value.is_active = p.is_active;
        form.value.finishing_options = (p.finishing_options ?? []).map((fo) => ({
          finishing_rate: fo.finishing_rate,
          is_default: fo.is_default ?? false,
          price_adjustment: fo.price_adjustment ?? null
        }));
        loadExistingImages(p.id);
      } else if (!hasDraft.value) {
        clearDraft();
      }
      showAddCategory.value = false;
      loadProductCategories();
      modalOpen.value = true;
    }
    async function loadExistingImages(productId) {
      const api = useApi();
      try {
        const data = await api(API.shopProductImages(props.shopSlug, productId));
        const images = Array.isArray(data) ? data : data?.results ?? [];
        existingImages.value = images;
      } catch {
        existingImages.value = [];
      }
    }
    function edit(p) {
      openModal(p);
    }
    async function uploadImages(productId) {
      const api = useApi();
      for (const imageId of imagesToDelete.value) {
        try {
          await api(API.shopProductImageDetail(props.shopSlug, productId, imageId), { method: "DELETE" });
        } catch {
        }
      }
      for (let i = 0; i < newImageFiles.value.length; i++) {
        const formData = new FormData();
        formData.append("image", newImageFiles.value[i]);
        formData.append("display_order", String(existingImages.value.length + i));
        if (existingImages.value.length === 0 && i === 0) {
          formData.append("is_primary", "true");
        }
        try {
          await api(API.shopProductImages(props.shopSlug, productId), {
            method: "POST",
            body: formData
          });
        } catch (e) {
          safeLogError(e, "SetupProducts.uploadImage");
        }
      }
    }
    function extractBackendError(err) {
      if (!err || typeof err !== "object") return "Failed to save product.";
      const o = err;
      if (typeof o.data === "object" && o.data !== null) {
        const d = o.data;
        if (typeof d.detail === "string") return d.detail;
        if (typeof d.message === "string") return d.message;
        if (Array.isArray(d.detail)) {
          const msgs = d.detail.map((x) => x.msg ?? (typeof x === "string" ? x : "")).filter(Boolean);
          if (msgs.length) return msgs.join("; ");
        }
      }
      return err instanceof Error ? err.message : "Failed to save product.";
    }
    async function onSubmit() {
      submitError.value = null;
      const slug = props.shopSlug?.trim();
      if (!slug) {
        submitError.value = "No shop selected. Reload the page and try again.";
        return;
      }
      if (props.shopExists === false) {
        submitError.value = "Shop not found. The URL may be incorrect. Go back to the dashboard and select a shop.";
        return;
      }
      saving.value = true;
      try {
        const categoryId = typeof form.value.category === "number" ? form.value.category : null;
        const payload = {
          name: form.value.name.trim(),
          description: form.value.description?.trim() ?? "",
          category: categoryId,
          pricing_mode: form.value.pricing_mode,
          default_finished_width_mm: Number(form.value.default_finished_width_mm) || 90,
          default_finished_height_mm: Number(form.value.default_finished_height_mm) || 54,
          default_bleed_mm: Number(form.value.default_bleed_mm) ?? 3,
          min_quantity: Math.max(1, Number(form.value.min_quantity) || 1),
          turnaround_days: form.value.turnaround_days ?? null,
          default_sides: form.value.default_sides,
          is_active: form.value.is_active,
          finishing_options: form.value.finishing_options
        };
        payload.min_width_mm = form.value.min_width_mm ?? null;
        payload.min_height_mm = form.value.min_height_mm ?? null;
        payload.max_width_mm = form.value.max_width_mm ?? null;
        payload.max_height_mm = form.value.max_height_mm ?? null;
        payload.default_sheet_size = form.value.default_sheet_size?.trim() || null;
        const allowedStr = form.value.allowed_sheet_sizes_str?.trim();
        payload.allowed_sheet_sizes = allowedStr ? allowedStr.split(",").map((s) => s.trim()).filter(Boolean) : null;
        payload.allow_simplex = form.value.allow_simplex;
        payload.allow_duplex = form.value.allow_duplex;
        payload.min_gsm = form.value.min_gsm ?? null;
        payload.max_gsm = form.value.max_gsm ?? null;
        payload.default_machine = form.value.default_machine ?? null;
        let productId;
        if (editing.value) {
          const updated = await updateProductBySlug(slug, editing.value.id, payload);
          productId = updated.id;
          toast.add({ title: "Updated", color: "success" });
        } else {
          const created = await createProductBySlug(slug, payload);
          productId = created.id;
          toast.add({ title: "Added", color: "success" });
        }
        if (newImageFiles.value.length || imagesToDelete.value.length) {
          await uploadImages(productId);
        }
        clearDraft();
        modalOpen.value = false;
        await load();
      } catch (e) {
        const msg = extractBackendError(e);
        submitError.value = msg;
        toast.add({ title: "Error", description: msg, color: "error" });
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(p) {
      if (!confirm(`Delete "${p.name}"?`)) return;
      try {
        await deleteProductBySlug(props.shopSlug, p.id);
        toast.add({ title: "Deleted", color: "success" });
        await load();
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      }
    }
    async function loadMachines() {
      if (!props.shopSlug) return;
      try {
        const api = useApi();
        const data = await api(
          API.shopMachines(props.shopSlug)
        );
        shopMachines.value = Array.isArray(data) ? data : data.results ?? [];
      } catch {
        shopMachines.value = [];
      }
    }
    watch(
      () => props.shopSlug,
      (slug) => {
        if (slug) {
          load();
          loadFinishingData();
          loadProductCategories();
          loadMachines();
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3$1;
      const _component_UAlert = _sfc_main$8;
      const _component_UBadge = _sfc_main$7;
      const _component_DashboardModalForm = __nuxt_component_5$1;
      const _component_DashboardLocalDraftNotice = __nuxt_component_6$1;
      const _component_UFormField = _sfc_main$a;
      const _component_UInput = _sfc_main$b;
      const _component_UTextarea = _sfc_main$e;
      const _component_USelectMenu = _sfc_main$c;
      const _component_UCheckbox = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex justify-between items-center"><p class="text-sm text-[var(--p-text-muted)]">Products in your catalog. Link to papers/materials and finishing options.</p>`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "sm",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "h-4 w-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add product `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "h-4 w-4 mr-2"
              }),
              createTextVNode(" Add product ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(loadError)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: unref(loadError),
          icon: "i-lucide-alert-circle",
          description: "The products API may be unavailable. Check your connection and try again."
        }, {
          actions: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                onClick: load
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Retry`);
                  } else {
                    return [
                      createTextVNode("Retry")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  variant: "soft",
                  size: "xs",
                  onClick: load
                }, {
                  default: withCtx(() => [
                    createTextVNode("Retry")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (unref(items).length) {
        _push(`<div class="rounded-xl border border-[var(--p-border)] overflow-hidden"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Mode</th><th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Delivery</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Finishings</th><th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border-dim)]"><!--[-->`);
        ssrRenderList(unref(items), (p) => {
          _push(`<tr class="hover:bg-[var(--p-surface-sunken)]/50"><td class="px-4 py-3"><div class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(p.name)}</div>`);
          if (p.category) {
            _push(`<div class="text-xs text-[var(--p-text-muted)]">${ssrInterpolate(p.category)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.pricing_mode)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.default_finished_width_mm)} × ${ssrInterpolate(p.default_finished_height_mm)}</td><td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">${ssrInterpolate(formatTurnaround(p.turnaround_days))}</td><td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.min_quantity ?? 1)}</td><td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">${ssrInterpolate(p.finishing_options?.length ?? 0)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: p.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3 text-right">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(p)
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
            onClick: ($event) => confirmDelete(p)
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
      } else if (!unref(loadError)) {
        _push(`<div class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-lucide-package",
          class: "mx-auto h-12 w-12 text-[var(--p-text-muted)]"
        }, null, _parent));
        _push(`<p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No products yet</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Add products to your catalog for buyers to quote.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          color: "primary",
          class: "mt-4",
          onClick: ($event) => openModal()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Add product`);
            } else {
              return [
                createTextVNode("Add product")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit product" : "Add product",
        description: unref(editing) ? "Update product." : "Add a product to your catalog.",
        ui: { content: "w-[calc(100vw-2rem)] max-w-2xl rounded-lg shadow-xl ring ring-default" }
      }, {
        footer: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-end gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "ghost",
              onClick: close
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
              color: "primary",
              loading: unref(saving),
              onClick: onSubmit
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
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex justify-end gap-2" }, [
                createVNode(_component_UButton, {
                  variant: "ghost",
                  onClick: close
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_UButton, {
                  color: "primary",
                  loading: unref(saving),
                  onClick: onSubmit
                }, {
                  default: withCtx(() => [
                    createTextVNode("Save")
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="space-y-6"${_scopeId}>`);
            if (unref(submitError)) {
              _push2(`<div class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300"${_scopeId}>${ssrInterpolate(unref(submitError))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(hasDraft) && !unref(editing)) {
              _push2(ssrRenderComponent(_component_DashboardLocalDraftNotice, {
                "entity-label": "product",
                "show-clear": true,
                onClear: clearDraft
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>Basic info</p>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Name",
              description: "Display name of the product.",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "e.g. Business Cards",
                    required: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).name,
                      "onUpdate:modelValue": ($event) => unref(form).name = $event,
                      placeholder: "e.g. Business Cards",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Description",
              description: "Product description."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UTextarea, {
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    placeholder: "Optional",
                    rows: 2
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UTextarea, {
                      modelValue: unref(form).description,
                      "onUpdate:modelValue": ($event) => unref(form).description = $event,
                      placeholder: "Optional",
                      rows: 2
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Category",
              description: "Product category for gallery grouping."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    "model-value": unref(categorySelectValue),
                    items: unref(categorySelectItems),
                    "value-key": "value",
                    "onUpdate:modelValue": onCategorySelect
                  }, null, _parent3, _scopeId2));
                  if (unref(showAddCategory)) {
                    _push3(`<div class="flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(newCategoryName),
                      "onUpdate:modelValue": ($event) => isRef(newCategoryName) ? newCategoryName.value = $event : null,
                      placeholder: "New category name",
                      class: "flex-1",
                      onKeydown: addNewCategory
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      size: "sm",
                      color: "primary",
                      loading: unref(addingCategory),
                      onClick: addNewCategory
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Add `);
                        } else {
                          return [
                            createTextVNode(" Add ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_UButton, {
                      size: "sm",
                      variant: "ghost",
                      onClick: ($event) => showAddCategory.value = false
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` Cancel `);
                        } else {
                          return [
                            createTextVNode(" Cancel ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(_component_USelectMenu, {
                        "model-value": unref(categorySelectValue),
                        items: unref(categorySelectItems),
                        "value-key": "value",
                        "onUpdate:modelValue": onCategorySelect
                      }, null, 8, ["model-value", "items"]),
                      unref(showAddCategory) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"
                      }, [
                        createVNode(_component_UInput, {
                          modelValue: unref(newCategoryName),
                          "onUpdate:modelValue": ($event) => isRef(newCategoryName) ? newCategoryName.value = $event : null,
                          placeholder: "New category name",
                          class: "flex-1",
                          onKeydown: withKeys(withModifiers(addNewCategory, ["prevent"]), ["enter"])
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                        createVNode(_component_UButton, {
                          size: "sm",
                          color: "primary",
                          loading: unref(addingCategory),
                          onClick: addNewCategory
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Add ")
                          ]),
                          _: 1
                        }, 8, ["loading"]),
                        createVNode(_component_UButton, {
                          size: "sm",
                          variant: "ghost",
                          onClick: ($event) => showAddCategory.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Pricing mode",
              description: "Sheet or large format pricing.",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).pricing_mode,
                    "onUpdate:modelValue": ($event) => unref(form).pricing_mode = $event,
                    items: pricingModeOptions,
                    "value-key": "value"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).pricing_mode,
                      "onUpdate:modelValue": ($event) => unref(form).pricing_mode = $event,
                      items: pricingModeOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(form).pricing_mode === "SHEET" && unref(shopMachines).length) {
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Default machine",
                description: "Default printing machine for this product. Clients can override when adding to quote."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelectMenu, {
                      "model-value": unref(form).default_machine,
                      items: [{ value: null, label: "— None —" }, ...unref(shopMachines).map((m) => ({ value: m.id, label: m.name }))],
                      "value-key": "value",
                      "onUpdate:modelValue": (v) => {
                        unref(form).default_machine = v;
                      }
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelectMenu, {
                        "model-value": unref(form).default_machine,
                        items: [{ value: null, label: "— None —" }, ...unref(shopMachines).map((m) => ({ value: m.id, label: m.name }))],
                        "value-key": "value",
                        "onUpdate:modelValue": (v) => {
                          unref(form).default_machine = v;
                        }
                      }, null, 8, ["model-value", "items", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="space-y-4"${_scopeId}><p class="text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>Dimensions</p><p class="text-xs text-[var(--p-text-muted)]"${_scopeId}>Bleed is 3mm (used for auto imposition).</p><div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Default width (mm)",
              description: "Required for price range.",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).default_finished_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_finished_width_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).default_finished_width_mm,
                      "onUpdate:modelValue": ($event) => unref(form).default_finished_width_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Default height (mm)",
              description: "Required for price range.",
              required: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).default_finished_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_finished_height_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    required: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).default_finished_height_mm,
                      "onUpdate:modelValue": ($event) => unref(form).default_finished_height_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Bleed (mm)",
              description: "Used for imposition calculation (default 3mm)."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).default_bleed_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_bleed_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).default_bleed_mm,
                      "onUpdate:modelValue": ($event) => unref(form).default_bleed_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Minimum quantity",
              description: "Minimum order quantity for price range calculation."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).min_quantity,
                    "onUpdate:modelValue": ($event) => unref(form).min_quantity = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    placeholder: "1"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_quantity,
                      "onUpdate:modelValue": ($event) => unref(form).min_quantity = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      placeholder: "1"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Delivery time (days)",
              description: "Typical turnaround for this product."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).turnaround_days,
                    "onUpdate:modelValue": ($event) => unref(form).turnaround_days = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "1",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).turnaround_days,
                      "onUpdate:modelValue": ($event) => unref(form).turnaround_days = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "1",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(form).pricing_mode === "LARGE_FORMAT") {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Min width (mm)",
                description: "For LARGE_FORMAT price range."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(form).min_width_mm,
                      "onUpdate:modelValue": ($event) => unref(form).min_width_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).min_width_mm,
                        "onUpdate:modelValue": ($event) => unref(form).min_width_mm = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: "0",
                        placeholder: "Optional"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, {
                label: "Min height (mm)",
                description: "For LARGE_FORMAT price range."
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(form).min_height_mm,
                      "onUpdate:modelValue": ($event) => unref(form).min_height_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).min_height_mm,
                        "onUpdate:modelValue": ($event) => unref(form).min_height_mm = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: "0",
                        placeholder: "Optional"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Max width (mm)",
              description: "e.g. 105 for A6 business cards."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_width_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Max height (mm)",
              description: "e.g. 148 for A6."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_height_mm,
                      "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Default sheet size",
              description: "Preferred sheet for price range (e.g. SRA3, A4)."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).default_sheet_size,
                    "onUpdate:modelValue": ($event) => unref(form).default_sheet_size = $event,
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).default_sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).default_sheet_size = $event,
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Default sides",
              description: "Simplex (1-sided) or duplex (2-sided)."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).default_sides,
                    "onUpdate:modelValue": ($event) => unref(form).default_sides = $event,
                    items: sidesOptions,
                    "value-key": "value"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).default_sides,
                      "onUpdate:modelValue": ($event) => unref(form).default_sides = $event,
                      items: sidesOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="space-y-4"${_scopeId}><p class="text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>Paper constraints</p><p class="text-xs text-[var(--p-text-muted)]"${_scopeId}>e.g. business card 250–350 gsm; flyer 130–170 gsm.</p><div class="grid grid-cols-2 gap-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Min GSM",
              description: "Minimum paper grammage allowed."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).min_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).min_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Max GSM",
              description: "Maximum paper grammage allowed."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).max_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                    modelModifiers: { number: true },
                    type: "number",
                    min: "0",
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).max_gsm,
                      "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                      modelModifiers: { number: true },
                      type: "number",
                      min: "0",
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UFormField, {
              label: "Allowed sheet sizes",
              description: "Comma-separated (e.g. A4,A3,SRA3). Empty = no restriction."
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(form).allowed_sheet_sizes_str,
                    "onUpdate:modelValue": ($event) => unref(form).allowed_sheet_sizes_str = $event,
                    placeholder: "Optional"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).allowed_sheet_sizes_str,
                      "onUpdate:modelValue": ($event) => unref(form).allowed_sheet_sizes_str = $event,
                      placeholder: "Optional"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex gap-6"${_scopeId}><label class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).allow_simplex,
              "onUpdate:modelValue": ($event) => unref(form).allow_simplex = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-[var(--p-text-dim)]"${_scopeId}>Allow simplex</span></label><label class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).allow_duplex,
              "onUpdate:modelValue": ($event) => unref(form).allow_duplex = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-[var(--p-text-dim)]"${_scopeId}>Allow duplex</span></label></div></div><div class="space-y-4"${_scopeId}><p class="text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>Finishings</p><p class="text-xs text-[var(--p-text-muted)]"${_scopeId}>Select finishing services applicable to this product.</p>`);
            if (unref(finishingCategories).length) {
              _push2(`<div class="flex items-center gap-2 flex-wrap"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: !unref(finishingCategoryFilter) ? "primary" : "neutral",
                variant: "soft",
                class: "cursor-pointer text-xs",
                onClick: ($event) => finishingCategoryFilter.value = ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` All `);
                  } else {
                    return [
                      createTextVNode(" All ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--[-->`);
              ssrRenderList(unref(finishingCategories), (cat) => {
                _push2(ssrRenderComponent(_component_UBadge, {
                  key: cat.slug,
                  color: unref(finishingCategoryFilter) === cat.slug ? "primary" : "neutral",
                  variant: "soft",
                  class: "cursor-pointer text-xs",
                  onClick: ($event) => finishingCategoryFilter.value = cat.slug
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(cat.name)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(cat.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(finishingRatesLoading)) {
              _push2(`<div class="text-sm text-[var(--p-text-muted)]"${_scopeId}>Loading finishing rates...</div>`);
            } else if (!unref(filteredFinishingRates).length) {
              _push2(`<div class="text-sm text-[var(--p-text-muted)]"${_scopeId}>No finishing rates available. Add them in the Finishing setup tab first.</div>`);
            } else {
              _push2(`<div class="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-[var(--p-border)] p-2"${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredFinishingRates), (fr) => {
                _push2(`<label class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--p-surface-sunken)] cursor-pointer"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UCheckbox, {
                  "model-value": unref(form).finishing_options.some((fo) => fo.finishing_rate === fr.id),
                  "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                }, null, _parent2, _scopeId));
                _push2(`<div class="flex-1 min-w-0"${_scopeId}><span class="text-sm text-[var(--p-text)]"${_scopeId}>${ssrInterpolate(fr.name)}</span>`);
                if (fr.category_detail) {
                  _push2(`<span class="ml-2 text-xs text-[var(--p-text-muted)]"${_scopeId}>(${ssrInterpolate(fr.category_detail.name)})</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><span class="text-xs text-[var(--p-text-muted)] shrink-0"${_scopeId}>${ssrInterpolate(fr.price)} / ${ssrInterpolate(fr.charge_unit)}</span></label>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div><div class="space-y-4"${_scopeId}><p class="text-sm font-medium text-[var(--p-text-dim)]"${_scopeId}>Product Images</p><p class="text-xs text-[var(--p-text-muted)]"${_scopeId}>Upload images for this product. The first image is used as the primary image.</p>`);
            if (unref(existingImages).length) {
              _push2(`<div class="flex flex-wrap gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(existingImages), (img) => {
                _push2(`<div class="relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"${_scopeId}><img${ssrRenderAttr("src", getMediaUrl(img.image))}${ssrRenderAttr("alt", `Product image ${img.id}`)} class="w-full h-full object-cover"${_scopeId}>`);
                if (img.is_primary) {
                  _push2(`<div class="absolute top-1 left-1"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_UBadge, {
                    color: "primary",
                    variant: "solid",
                    size: "xs"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Primary`);
                      } else {
                        return [
                          createTextVNode("Primary")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}> × </button></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-wrap gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(unref(imagePreviews), (preview, i) => {
              _push2(`<div class="relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"${_scopeId}><img${ssrRenderAttr("src", preview)} alt="Preview" class="w-full h-full object-cover"${_scopeId}><button type="button" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}> × </button></div>`);
            });
            _push2(`<!--]--><label class="w-24 h-24 rounded-lg border-2 border-dashed border-[var(--p-border)] flex items-center justify-center cursor-pointer hover:border-flamingo-400 transition-colors"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-6 h-6 text-[var(--p-text-muted)]"
            }, null, _parent2, _scopeId));
            _push2(`<input type="file" accept="image/*" multiple class="hidden"${_scopeId}></label></div></div><div class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).is_active,
              "onUpdate:modelValue": ($event) => unref(form).is_active = $event
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm text-[var(--p-text-dim)]"${_scopeId}>Active</span></div></form>`);
          } else {
            return [
              createVNode("form", {
                class: "space-y-6",
                onSubmit: withModifiers(onSubmit, ["prevent"])
              }, [
                unref(submitError) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300"
                }, toDisplayString(unref(submitError)), 1)) : createCommentVNode("", true),
                unref(hasDraft) && !unref(editing) ? (openBlock(), createBlock(_component_DashboardLocalDraftNotice, {
                  key: 1,
                  "entity-label": "product",
                  "show-clear": true,
                  onClear: clearDraft
                })) : createCommentVNode("", true),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text-dim)]" }, "Basic info"),
                  createVNode(_component_UFormField, {
                    label: "Name",
                    description: "Display name of the product.",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).name,
                        "onUpdate:modelValue": ($event) => unref(form).name = $event,
                        placeholder: "e.g. Business Cards",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Description",
                    description: "Product description."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UTextarea, {
                        modelValue: unref(form).description,
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        placeholder: "Optional",
                        rows: 2
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Category",
                    description: "Product category for gallery grouping."
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(_component_USelectMenu, {
                          "model-value": unref(categorySelectValue),
                          items: unref(categorySelectItems),
                          "value-key": "value",
                          "onUpdate:modelValue": onCategorySelect
                        }, null, 8, ["model-value", "items"]),
                        unref(showAddCategory) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3"
                        }, [
                          createVNode(_component_UInput, {
                            modelValue: unref(newCategoryName),
                            "onUpdate:modelValue": ($event) => isRef(newCategoryName) ? newCategoryName.value = $event : null,
                            placeholder: "New category name",
                            class: "flex-1",
                            onKeydown: withKeys(withModifiers(addNewCategory, ["prevent"]), ["enter"])
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                          createVNode(_component_UButton, {
                            size: "sm",
                            color: "primary",
                            loading: unref(addingCategory),
                            onClick: addNewCategory
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Add ")
                            ]),
                            _: 1
                          }, 8, ["loading"]),
                          createVNode(_component_UButton, {
                            size: "sm",
                            variant: "ghost",
                            onClick: ($event) => showAddCategory.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Pricing mode",
                    description: "Sheet or large format pricing.",
                    required: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).pricing_mode,
                        "onUpdate:modelValue": ($event) => unref(form).pricing_mode = $event,
                        items: pricingModeOptions,
                        "value-key": "value"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  unref(form).pricing_mode === "SHEET" && unref(shopMachines).length ? (openBlock(), createBlock(_component_UFormField, {
                    key: 0,
                    label: "Default machine",
                    description: "Default printing machine for this product. Clients can override when adding to quote."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        "model-value": unref(form).default_machine,
                        items: [{ value: null, label: "— None —" }, ...unref(shopMachines).map((m) => ({ value: m.id, label: m.name }))],
                        "value-key": "value",
                        "onUpdate:modelValue": (v) => {
                          unref(form).default_machine = v;
                        }
                      }, null, 8, ["model-value", "items", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text-dim)]" }, "Dimensions"),
                  createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "Bleed is 3mm (used for auto imposition)."),
                  createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormField, {
                      label: "Default width (mm)",
                      description: "Required for price range.",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).default_finished_width_mm,
                          "onUpdate:modelValue": ($event) => unref(form).default_finished_width_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "1",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Default height (mm)",
                      description: "Required for price range.",
                      required: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).default_finished_height_mm,
                          "onUpdate:modelValue": ($event) => unref(form).default_finished_height_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "1",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_UFormField, {
                    label: "Bleed (mm)",
                    description: "Used for imposition calculation (default 3mm)."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).default_bleed_mm,
                        "onUpdate:modelValue": ($event) => unref(form).default_bleed_mm = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: "0"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Minimum quantity",
                    description: "Minimum order quantity for price range calculation."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).min_quantity,
                        "onUpdate:modelValue": ($event) => unref(form).min_quantity = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: "1",
                        placeholder: "1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Delivery time (days)",
                    description: "Typical turnaround for this product."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).turnaround_days,
                        "onUpdate:modelValue": ($event) => unref(form).turnaround_days = $event,
                        modelModifiers: { number: true },
                        type: "number",
                        min: "1",
                        placeholder: "Optional"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  unref(form).pricing_mode === "LARGE_FORMAT" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode(_component_UFormField, {
                      label: "Min width (mm)",
                      description: "For LARGE_FORMAT price range."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).min_width_mm,
                          "onUpdate:modelValue": ($event) => unref(form).min_width_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Min height (mm)",
                      description: "For LARGE_FORMAT price range."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).min_height_mm,
                          "onUpdate:modelValue": ($event) => unref(form).min_height_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ], 64)) : createCommentVNode("", true),
                  createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormField, {
                      label: "Max width (mm)",
                      description: "e.g. 105 for A6 business cards."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).max_width_mm,
                          "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Max height (mm)",
                      description: "e.g. 148 for A6."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).max_height_mm,
                          "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_UFormField, {
                    label: "Default sheet size",
                    description: "Preferred sheet for price range (e.g. SRA3, A4)."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).default_sheet_size,
                        "onUpdate:modelValue": ($event) => unref(form).default_sheet_size = $event,
                        placeholder: "Optional"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, {
                    label: "Default sides",
                    description: "Simplex (1-sided) or duplex (2-sided)."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).default_sides,
                        "onUpdate:modelValue": ($event) => unref(form).default_sides = $event,
                        items: sidesOptions,
                        "value-key": "value"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text-dim)]" }, "Paper constraints"),
                  createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "e.g. business card 250–350 gsm; flyer 130–170 gsm."),
                  createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                    createVNode(_component_UFormField, {
                      label: "Min GSM",
                      description: "Minimum paper grammage allowed."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).min_gsm,
                          "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UFormField, {
                      label: "Max GSM",
                      description: "Maximum paper grammage allowed."
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_UInput, {
                          modelValue: unref(form).max_gsm,
                          "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                          modelModifiers: { number: true },
                          type: "number",
                          min: "0",
                          placeholder: "Optional"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_UFormField, {
                    label: "Allowed sheet sizes",
                    description: "Comma-separated (e.g. A4,A3,SRA3). Empty = no restriction."
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).allowed_sheet_sizes_str,
                        "onUpdate:modelValue": ($event) => unref(form).allowed_sheet_sizes_str = $event,
                        placeholder: "Optional"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "flex gap-6" }, [
                    createVNode("label", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UCheckbox, {
                        modelValue: unref(form).allow_simplex,
                        "onUpdate:modelValue": ($event) => unref(form).allow_simplex = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("span", { class: "text-sm text-[var(--p-text-dim)]" }, "Allow simplex")
                    ]),
                    createVNode("label", { class: "flex items-center gap-2" }, [
                      createVNode(_component_UCheckbox, {
                        modelValue: unref(form).allow_duplex,
                        "onUpdate:modelValue": ($event) => unref(form).allow_duplex = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("span", { class: "text-sm text-[var(--p-text-dim)]" }, "Allow duplex")
                    ])
                  ])
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text-dim)]" }, "Finishings"),
                  createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "Select finishing services applicable to this product."),
                  unref(finishingCategories).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center gap-2 flex-wrap"
                  }, [
                    createVNode(_component_UBadge, {
                      color: !unref(finishingCategoryFilter) ? "primary" : "neutral",
                      variant: "soft",
                      class: "cursor-pointer text-xs",
                      onClick: ($event) => finishingCategoryFilter.value = ""
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" All ")
                      ]),
                      _: 1
                    }, 8, ["color", "onClick"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(finishingCategories), (cat) => {
                      return openBlock(), createBlock(_component_UBadge, {
                        key: cat.slug,
                        color: unref(finishingCategoryFilter) === cat.slug ? "primary" : "neutral",
                        variant: "soft",
                        class: "cursor-pointer text-xs",
                        onClick: ($event) => finishingCategoryFilter.value = cat.slug
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(cat.name), 1)
                        ]),
                        _: 2
                      }, 1032, ["color", "onClick"]);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  unref(finishingRatesLoading) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-sm text-[var(--p-text-muted)]"
                  }, "Loading finishing rates...")) : !unref(filteredFinishingRates).length ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "text-sm text-[var(--p-text-muted)]"
                  }, "No finishing rates available. Add them in the Finishing setup tab first.")) : (openBlock(), createBlock("div", {
                    key: 3,
                    class: "max-h-48 overflow-y-auto space-y-1 rounded-lg border border-[var(--p-border)] p-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredFinishingRates), (fr) => {
                      return openBlock(), createBlock("label", {
                        key: fr.id,
                        class: "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--p-surface-sunken)] cursor-pointer"
                      }, [
                        createVNode(_component_UCheckbox, {
                          "model-value": unref(form).finishing_options.some((fo) => fo.finishing_rate === fr.id),
                          "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, $event)
                        }, null, 8, ["model-value", "onUpdate:modelValue"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("span", { class: "text-sm text-[var(--p-text)]" }, toDisplayString(fr.name), 1),
                          fr.category_detail ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "ml-2 text-xs text-[var(--p-text-muted)]"
                          }, "(" + toDisplayString(fr.category_detail.name) + ")", 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("span", { class: "text-xs text-[var(--p-text-muted)] shrink-0" }, toDisplayString(fr.price) + " / " + toDisplayString(fr.charge_unit), 1)
                      ]);
                    }), 128))
                  ]))
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("p", { class: "text-sm font-medium text-[var(--p-text-dim)]" }, "Product Images"),
                  createVNode("p", { class: "text-xs text-[var(--p-text-muted)]" }, "Upload images for this product. The first image is used as the primary image."),
                  unref(existingImages).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex flex-wrap gap-3"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(existingImages), (img) => {
                      return openBlock(), createBlock("div", {
                        key: img.id,
                        class: "relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: getMediaUrl(img.image),
                          alt: `Product image ${img.id}`,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"]),
                        img.is_primary ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "absolute top-1 left-1"
                        }, [
                          createVNode(_component_UBadge, {
                            color: "primary",
                            variant: "solid",
                            size: "xs"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Primary")
                            ]),
                            _: 1
                          })
                        ])) : createCommentVNode("", true),
                        createVNode("button", {
                          type: "button",
                          class: "absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                          onClick: ($event) => removeExistingImage(img.id)
                        }, " × ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex flex-wrap gap-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(imagePreviews), (preview, i) => {
                      return openBlock(), createBlock("div", {
                        key: i,
                        class: "relative group w-24 h-24 rounded-lg overflow-hidden border border-[var(--p-border)]"
                      }, [
                        createVNode("img", {
                          src: preview,
                          alt: "Preview",
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src"]),
                        createVNode("button", {
                          type: "button",
                          class: "absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                          onClick: ($event) => removeNewImage(i)
                        }, " × ", 8, ["onClick"])
                      ]);
                    }), 128)),
                    createVNode("label", { class: "w-24 h-24 rounded-lg border-2 border-dashed border-[var(--p-border)] flex items-center justify-center cursor-pointer hover:border-flamingo-400 transition-colors" }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus",
                        class: "w-6 h-6 text-[var(--p-text-muted)]"
                      }),
                      createVNode("input", {
                        type: "file",
                        accept: "image/*",
                        multiple: "",
                        class: "hidden",
                        onChange: onFileSelect
                      }, null, 32)
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).is_active,
                    "onUpdate:modelValue": ($event) => unref(form).is_active = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", { class: "text-sm text-[var(--p-text-dim)]" }, "Active")
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/seller/SetupProducts.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "DashboardSellerSetupProducts" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "setup",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const sellerStore = useSellerStore();
    const shopSlug = computed(() => route.params.slug);
    const shop = computed(() => sellerStore.getShopBySlug(shopSlug.value));
    const activeTab = ref("machines");
    const tabItems = computed(() => [
      { label: "Machines", value: "machines", icon: "i-lucide-printer", isLink: false },
      { label: "Papers", value: "papers", icon: "i-lucide-file-stack", isLink: false },
      { label: "Finishing", value: "finishing", icon: "i-lucide-scissors", isLink: false },
      { label: "Materials", value: "materials", icon: "i-lucide-layers", isLink: false },
      { label: "Pricing", value: "pricing", icon: "i-lucide-banknote", isLink: true, to: `/dashboard/shops/${shopSlug.value}/pricing` },
      { label: "Products", value: "products", icon: "i-lucide-package", isLink: false }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_DashboardSellerSetupMachines = __nuxt_component_2;
      const _component_DashboardSellerSetupPapers = __nuxt_component_3;
      const _component_DashboardSellerSetupFinishing = __nuxt_component_4;
      const _component_DashboardSellerSetupMaterials = __nuxt_component_5;
      const _component_DashboardSellerSetupProducts = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(shop)?.name ?? "Shop Setup")}</h1><p class="text-[var(--p-text-muted)] mt-1">Configure machines, papers, finishing, materials, and products.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/dashboard",
        variant: "soft",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Back to dashboard `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Back to dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex gap-1 overflow-x-auto rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1.5"><!--[-->`);
      ssrRenderList(unref(tabItems), (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.value ? "bg-flamingo-500 text-white shadow-sm" : "text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)]", "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"])}">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: tab.icon,
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="py-4">`);
      if (unref(activeTab) === "machines") {
        _push(ssrRenderComponent(_component_DashboardSellerSetupMachines, { "shop-slug": unref(shopSlug) }, null, _parent));
      } else if (unref(activeTab) === "papers") {
        _push(ssrRenderComponent(_component_DashboardSellerSetupPapers, { "shop-slug": unref(shopSlug) }, null, _parent));
      } else if (unref(activeTab) === "finishing") {
        _push(ssrRenderComponent(_component_DashboardSellerSetupFinishing, { "shop-slug": unref(shopSlug) }, null, _parent));
      } else if (unref(activeTab) === "materials") {
        _push(ssrRenderComponent(_component_DashboardSellerSetupMaterials, { "shop-slug": unref(shopSlug) }, null, _parent));
      } else if (unref(activeTab) === "products") {
        _push(ssrRenderComponent(_component_DashboardSellerSetupProducts, {
          "shop-slug": unref(shopSlug),
          "shop-exists": !!unref(shop)
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/setup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=setup-jkW0abea.mjs.map
