import { g as useRoute, h as useToast, e as _sfc_main$9, a as _sfc_main$f } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$1 } from './Input-DA2ySSK8.mjs';
import { _ as _sfc_main$2 } from './Badge-CHxS7t2J.mjs';
import { _ as __nuxt_component_5 } from './DashboardModalForm-DxuRCbSc.mjs';
import { _ as _sfc_main$3 } from './FormField-GgyjmRXz.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-DTjoEp_W.mjs';
import { _ as _sfc_main$5 } from './Checkbox-8D35u7U_.mjs';
import { defineComponent, computed, ref, reactive, mergeProps, unref, withCtx, createVNode, createTextVNode, isRef, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { u as updatePrintingRate, d as deletePrintingRate, c as createPrintingRate, g as getMachineBySlug, e as listPrintingRates } from './seller-B-6aM_bM.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "rates",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const machineId = computed(() => parseInt(route.params.id, 10));
    const shopSlug = computed(() => route.query.shop);
    const backUrl = computed(() => shopSlug.value ? `/dashboard/shops/${shopSlug.value}/setup` : "/dashboard");
    const toast = useToast();
    const machineName = ref("");
    const items = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const modalOpen = ref(false);
    const editing = ref(null);
    const editingCell = ref(null);
    const editValue = ref("");
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
    async function saveCell(r, field) {
      if (editingCell.value !== `${r.id}-${field}`) return;
      const val = editValue.value.trim();
      if (!val) {
        editingCell.value = null;
        return;
      }
      const payload = field === "single" ? { single_price: val } : { double_price: val };
      try {
        const updated = await updatePrintingRate(machineId.value, r.id, payload);
        const idx = items.value.findIndex((i) => i.id === r.id);
        if (idx >= 0) items.value[idx] = updated;
        toast.add({ title: "Updated", color: "success" });
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      }
      editingCell.value = null;
    }
    function openModal(r) {
      editing.value = r ?? null;
      if (r) {
        form.sheet_size = r.sheet_size;
        form.color_mode = r.color_mode;
        form.single_price = r.single_price;
        form.double_price = r.double_price;
        form.is_active = r.is_active;
      } else {
        form.sheet_size = "A4";
        form.color_mode = "BW";
        form.single_price = "0";
        form.double_price = "0";
        form.is_active = true;
      }
      modalOpen.value = true;
    }
    function edit(r) {
      openModal(r);
    }
    async function onSubmit() {
      saving.value = true;
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
        modalOpen.value = false;
        await load();
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      } finally {
        saving.value = false;
      }
    }
    async function confirmDelete(r) {
      if (!confirm(`Delete ${r.sheet_size} ${r.color_mode} rate?`)) return;
      try {
        await deletePrintingRate(machineId.value, r.id);
        toast.add({ title: "Deleted", color: "success" });
        await load();
      } catch (e) {
        toast.add({ title: "Error", description: e instanceof Error ? e.message : "Failed", color: "error" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UInput = _sfc_main$1;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardModalForm = __nuxt_component_5;
      const _component_UFormField = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UCheckbox = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(machineName) ? `${unref(machineName)} — Printing rates` : "Printing rates")}</h1><p class="text-gray-600 dark:text-gray-400 mt-1"> Set prices per sheet by size and color. Single = simplex (1-sided), Double = duplex (2-sided). </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        to: unref(backUrl),
        variant: "soft",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-left",
              class: "mr-2 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` Back to setup `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-left",
                class: "mr-2 h-4 w-4"
              }),
              createTextVNode(" Back to setup ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading) && !unref(items).length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else {
        _push(`<div class="space-y-4"><div class="flex justify-end">`);
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
              _push2(` Add rate `);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: "i-lucide-plus",
                  class: "h-4 w-4 mr-2"
                }),
                createTextVNode(" Add rate ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(items).length) {
          _push(`<div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sheet size</th><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color mode</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Single</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Double</th><th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
          ssrRenderList(unref(items), (r) => {
            _push(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(r.sheet_size)}</td><td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(r.color_mode === "BW" ? "Black & White" : "Color")}</td><td class="px-4 py-2 text-right">`);
            if (unref(editingCell) !== `${r.id}-single`) {
              _push(`<span class="inline-block min-w-[4rem] px-2 py-1 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm tabular-nums">${ssrInterpolate(r.single_price)}</span>`);
            } else {
              _push(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editValue),
                "onUpdate:modelValue": ($event) => isRef(editValue) ? editValue.value = $event : null,
                type: "text",
                size: "xs",
                class: "w-20 text-right tabular-nums",
                placeholder: "0.00",
                onBlur: ($event) => saveCell(r, "single"),
                onKeydown: ($event) => saveCell(r, "single")
              }, null, _parent));
            }
            _push(`</td><td class="px-4 py-2 text-right">`);
            if (unref(editingCell) !== `${r.id}-double`) {
              _push(`<span class="inline-block min-w-[4rem] px-2 py-1 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm tabular-nums">${ssrInterpolate(r.double_price)}</span>`);
            } else {
              _push(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editValue),
                "onUpdate:modelValue": ($event) => isRef(editValue) ? editValue.value = $event : null,
                type: "text",
                size: "xs",
                class: "w-20 text-right tabular-nums",
                placeholder: "0.00",
                onBlur: ($event) => saveCell(r, "double"),
                onKeydown: ($event) => saveCell(r, "double")
              }, null, _parent));
            }
            _push(`</td><td class="px-4 py-3 text-center">`);
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
            _push(`</td><td class="px-4 py-3 text-right">`);
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
            _push(`</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        } else {
          _push(`<div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-printer",
            class: "mx-auto h-12 w-12 text-gray-400"
          }, null, _parent));
          _push(`<p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No printing rates yet</p><p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add rates for each sheet size and color mode.</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            color: "primary",
            class: "mt-4",
            onClick: ($event) => openModal()
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Add rate`);
              } else {
                return [
                  createTextVNode("Add rate")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit printing rate" : "Add printing rate",
        description: unref(editing) ? "Update rate." : "Add a printing rate."
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
            _push2(`<form class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UFormField, { label: "Sheet size" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_USelectMenu, {
                    modelValue: unref(form).sheet_size,
                    "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                    items: sheetSizeOptions,
                    "value-key": "value"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                      items: sheetSizeOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                    "value-key": "value"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).color_mode,
                      "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                      items: colorModeOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).single_price,
                      "onUpdate:modelValue": ($event) => unref(form).single_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: unref(form).double_price,
                      "onUpdate:modelValue": ($event) => unref(form).double_price = $event,
                      type: "text",
                      placeholder: "0.00",
                      required: ""
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
                createVNode(_component_UFormField, { label: "Sheet size" }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).sheet_size,
                      "onUpdate:modelValue": ($event) => unref(form).sheet_size = $event,
                      items: sheetSizeOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_UFormField, { label: "Color mode" }, {
                  default: withCtx(() => [
                    createVNode(_component_USelectMenu, {
                      modelValue: unref(form).color_mode,
                      "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                      items: colorModeOptions,
                      "value-key": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/machines/[id]/rates.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rates-BUEIcyUu.mjs.map
