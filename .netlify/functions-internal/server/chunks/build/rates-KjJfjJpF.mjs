import { _ as __nuxt_component_0 } from './DashboardPageHeader-By409uiV.mjs';
import { f as useRoute, e as useToast, d as _sfc_main$9, a as _sfc_main$f, I as extractApiFeedback } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Badge-C1UUP90f.mjs';
import { _ as __nuxt_component_5 } from './DashboardEmptyState-BX9Z7Yh3.mjs';
import { _ as __nuxt_component_6 } from './AdminWorkspaceFormPanel-D166ogpE.mjs';
import { _ as _sfc_main$2 } from './Alert-BD7KCbft.mjs';
import { _ as _sfc_main$3 } from './FormField-ChkzAQqB.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DDFAjir1.mjs';
import { _ as __nuxt_component_4 } from './InlineError-CDgd_EMb.mjs';
import { _ as _sfc_main$5 } from './Input-DZEAnFef.mjs';
import { _ as _sfc_main$6 } from './Checkbox-Bxr7OL_4.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { d as deletePrintingRate, u as updatePrintingRate, c as createPrintingRate, g as getMachineBySlug, a as listPrintingRates } from './seller-B7IxAeLp.mjs';
import { d as dashboardSelectUi } from './formUi-DTjrawz_.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "rates",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const machineId = computed(() => parseInt(route.params.id, 10));
    const shopSlug = computed(() => route.query.shop);
    const backUrl = computed(() => shopSlug.value ? `/dashboard/shops/${shopSlug.value}/pricing` : "/dashboard");
    const toast = useToast();
    const machineName = ref("");
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const panelOpen = ref(false);
    const editing = ref(null);
    const formError = ref(null);
    const formFieldErrors = ref({});
    const form = reactive({
      sheet_size: "A4",
      color_mode: "BW",
      single_price: "0",
      double_price: "0",
      is_active: true
    });
    const sheetSizeOptions = [
      { value: "A4", label: "A4" },
      { value: "A3", label: "A3" },
      { value: "SRA3", label: "SRA3" },
      { value: "A2", label: "A2" },
      { value: "A1", label: "A1" },
      { value: "A0", label: "A0" },
      { value: "CUSTOM", label: "Custom" }
    ];
    const colorModeOptions = [
      { value: "BW", label: "Black & White" },
      { value: "COLOR", label: "Color" }
    ];
    async function load() {
      if (Number.isNaN(machineId.value)) return;
      loading.value = true;
      try {
        if (shopSlug.value) {
          const m = await getMachineBySlug(shopSlug.value, machineId.value);
          machineName.value = m?.name ?? "";
        }
        items.value = await listPrintingRates(machineId.value);
      } catch {
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    function openPanel(rate) {
      editing.value = rate ?? null;
      formError.value = null;
      formFieldErrors.value = {};
      if (rate) {
        form.sheet_size = rate.sheet_size;
        form.color_mode = rate.color_mode;
        form.single_price = rate.single_price;
        form.double_price = rate.double_price;
        form.is_active = rate.is_active;
      } else {
        form.sheet_size = "A4";
        form.color_mode = "BW";
        form.single_price = "0";
        form.double_price = "0";
        form.is_active = true;
      }
      panelOpen.value = true;
    }
    function edit(rate) {
      openPanel(rate);
    }
    function closePanel() {
      panelOpen.value = false;
      editing.value = null;
      formError.value = null;
      formFieldErrors.value = {};
    }
    async function onSubmit() {
      saving.value = true;
      formError.value = null;
      formFieldErrors.value = {};
      try {
        const payload = {
          sheet_size: form.sheet_size,
          color_mode: form.color_mode,
          single_price: form.single_price,
          double_price: form.double_price,
          is_active: form.is_active
        };
        if (editing.value) {
          await updatePrintingRate(machineId.value, editing.value.id, payload);
          toast.add({ title: "Updated", color: "success" });
        } else {
          await createPrintingRate(machineId.value, payload);
          toast.add({ title: "Added", color: "success" });
        }
        closePanel();
        await load();
      } catch (e) {
        const feedback = extractApiFeedback(e, "Failed to save printing rate");
        formError.value = feedback.message;
        formFieldErrors.value = feedback.fieldErrors;
        if (!Object.keys(feedback.fieldErrors).length) {
          toast.add({ title: "Error", description: feedback.message, color: "error" });
        }
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(rate) {
      if (!confirm(`Delete ${rate.sheet_size} ${rate.color_mode} rate?`)) return;
      try {
        await deletePrintingRate(machineId.value, rate.id);
        toast.add({ title: "Deleted", color: "success" });
        await load();
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$1;
      const _component_DashboardEmptyState = __nuxt_component_5;
      const _component_DashboardAdminWorkspaceFormPanel = __nuxt_component_6;
      const _component_UAlert = _sfc_main$2;
      const _component_UFormField = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_DashboardInlineError = __nuxt_component_4;
      const _component_UInput = _sfc_main$5;
      const _component_UCheckbox = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: unref(machineName) ? `${unref(machineName)} Rates` : "Printing Rates",
        subtitle: "Edit machine-specific printing rates in the main workspace instead of a modal."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: unref(backUrl),
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
              onClick: ($event) => openPanel()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Add Rate `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "mr-2 h-4 w-4"
                    }),
                    createTextVNode(" Add Rate ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: unref(backUrl),
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              }, 8, ["to"]),
              createVNode(_component_UButton, {
                color: "primary",
                onClick: ($event) => openPanel()
              }, {
                default: withCtx(() => [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "mr-2 h-4 w-4"
                  }),
                  createTextVNode(" Add Rate ")
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_24rem]"><div class="space-y-4">`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(items).length) {
        _push(`<div class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm"><table class="min-w-full divide-y divide-[var(--p-border)]"><thead class="bg-[var(--p-surface-sunken)]"><tr><th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Sheet size</th><th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Color mode</th><th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th><th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th><th class="px-4 py-3 text-center text-xs font-medium uppercase text-[var(--p-text-muted)]">Status</th><th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Actions</th></tr></thead><tbody class="divide-y divide-[var(--p-border)]"><!--[-->`);
        ssrRenderList(unref(items), (r) => {
          _push(`<tr><td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(r.sheet_size)}</td><td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(r.color_mode === "BW" ? "Black & White" : "Color")}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text)]">${ssrInterpolate(r.single_price)}</td><td class="px-4 py-3 text-right text-sm text-[var(--p-text)]">${ssrInterpolate(r.double_price)}</td><td class="px-4 py-3 text-center">`);
          _push(ssrRenderComponent(_component_UBadge, {
            color: r.is_active ? "success" : "neutral",
            variant: "soft",
            size: "xs"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(r.is_active ? "Active" : "Inactive")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(r.is_active ? "Active" : "Inactive"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td><td class="px-4 py-3"><div class="flex justify-end gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "xs",
            onClick: ($event) => edit(r)
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
            onClick: ($event) => confirmDelete(r)
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
          title: "No printing rates yet",
          description: "Add rates for each sheet size and color mode.",
          icon: "i-lucide-banknote"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, {
                color: "primary",
                onClick: ($event) => openPanel()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add rate`);
                  } else {
                    return [
                      createTextVNode("Add rate")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, {
                  color: "primary",
                  onClick: ($event) => openPanel()
                }, {
                  default: withCtx(() => [
                    createTextVNode("Add rate")
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
        _push(ssrRenderComponent(_component_DashboardAdminWorkspaceFormPanel, {
          title: unref(editing) ? "Edit Printing Rate" : "Add Printing Rate",
          description: unref(editing) ? "Update this printing rate." : "Create a new printing rate for this machine.",
          onClose: closePanel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<form class="space-y-4"${_scopeId}>`);
              if (unref(formError)) {
                _push2(ssrRenderComponent(_component_UAlert, {
                  color: "error",
                  variant: "soft",
                  title: "Could not save printing rate",
                  description: unref(formError),
                  icon: "i-lucide-alert-circle"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_UFormField, { label: "Sheet size" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelectMenu, {
                      modelValue: unref(form).sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                      items: sheetSizeOptions,
                      "value-key": "value",
                      portal: "body",
                      ui: unref(dashboardSelectUi)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DashboardInlineError, {
                      message: unref(formFieldErrors).sheet_size
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).sheet_size,
                        "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                        items: sheetSizeOptions,
                        "value-key": "value",
                        portal: "body",
                        ui: unref(dashboardSelectUi)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).sheet_size
                      }, null, 8, ["message"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, { label: "Color mode" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_USelectMenu, {
                      modelValue: unref(form).color_mode,
                      "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                      items: colorModeOptions,
                      "value-key": "value",
                      portal: "body",
                      ui: unref(dashboardSelectUi)
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DashboardInlineError, {
                      message: unref(formFieldErrors).color_mode
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).color_mode,
                        "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                        items: colorModeOptions,
                        "value-key": "value",
                        portal: "body",
                        ui: unref(dashboardSelectUi)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).color_mode
                      }, null, 8, ["message"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, { label: "Single (simplex) price" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(form).single_price,
                      "onUpdate:modelValue": ($event) => unref(form).single_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DashboardInlineError, {
                      message: unref(formFieldErrors).single_price
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).single_price,
                        "onUpdate:modelValue": ($event) => unref(form).single_price = $event,
                        type: "text",
                        placeholder: "0.00",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).single_price
                      }, null, 8, ["message"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_UFormField, { label: "Double (duplex) price" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_UInput, {
                      modelValue: unref(form).double_price,
                      "onUpdate:modelValue": ($event) => unref(form).double_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_DashboardInlineError, {
                      message: unref(formFieldErrors).double_price
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).double_price,
                        "onUpdate:modelValue": ($event) => unref(form).double_price = $event,
                        type: "text",
                        placeholder: "0.00",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).double_price
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
              _push2(`<span class="text-sm"${_scopeId}>Active</span></div><div class="flex justify-end gap-2 pt-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "ghost",
                onClick: closePanel
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
                color: "primary",
                loading: unref(saving),
                type: "submit"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Save`);
                  } else {
                    return [
                      createTextVNode("Save")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></form>`);
            } else {
              return [
                createVNode("form", {
                  class: "space-y-4",
                  onSubmit: withModifiers(onSubmit, ["prevent"])
                }, [
                  unref(formError) ? (openBlock(), createBlock(_component_UAlert, {
                    key: 0,
                    color: "error",
                    variant: "soft",
                    title: "Could not save printing rate",
                    description: unref(formError),
                    icon: "i-lucide-alert-circle"
                  }, null, 8, ["description"])) : createCommentVNode("", true),
                  createVNode(_component_UFormField, { label: "Sheet size" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).sheet_size,
                        "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                        items: sheetSizeOptions,
                        "value-key": "value",
                        portal: "body",
                        ui: unref(dashboardSelectUi)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).sheet_size
                      }, null, 8, ["message"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Color mode" }, {
                    default: withCtx(() => [
                      createVNode(_component_USelectMenu, {
                        modelValue: unref(form).color_mode,
                        "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                        items: colorModeOptions,
                        "value-key": "value",
                        portal: "body",
                        ui: unref(dashboardSelectUi)
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).color_mode
                      }, null, 8, ["message"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Single (simplex) price" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).single_price,
                        "onUpdate:modelValue": ($event) => unref(form).single_price = $event,
                        type: "text",
                        placeholder: "0.00",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).single_price
                      }, null, 8, ["message"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UFormField, { label: "Double (duplex) price" }, {
                    default: withCtx(() => [
                      createVNode(_component_UInput, {
                        modelValue: unref(form).double_price,
                        "onUpdate:modelValue": ($event) => unref(form).double_price = $event,
                        type: "text",
                        placeholder: "0.00",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_component_DashboardInlineError, {
                        message: unref(formFieldErrors).double_price
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
                  ]),
                  createVNode("div", { class: "flex justify-end gap-2 pt-2" }, [
                    createVNode(_component_UButton, {
                      variant: "ghost",
                      onClick: closePanel
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_UButton, {
                      color: "primary",
                      loading: unref(saving),
                      type: "submit"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Save")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/machines/[id]/rates.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rates-KjJfjJpF.mjs.map
