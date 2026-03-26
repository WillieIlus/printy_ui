import { _ as __nuxt_component_0 } from './DashboardPageHeader-2WLhb5mv.mjs';
import { f as useRoute, d as _sfc_main$9, a as _sfc_main$f, k as useNuxtApp, A as API } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-DRRvJchD.mjs';
import { _ as _sfc_main$3 } from './FormField-DQkJuMh6.mjs';
import { _ as _sfc_main$4 } from './SelectMenu-C6Eyp_GI.mjs';
import { _ as _sfc_main$5 } from './Input-C14QBOm-.mjs';
import { _ as _sfc_main$6 } from './Checkbox-S5HrhTVg.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, reactive, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as formatKES, f as formatDate } from './formatters-r_qbKRfS.mjs';
import { d as dashboardFormFieldUi, e as dashboardSelectUi, g as dashboardInputUi } from './formUi-UcrM_3uE.mjs';
import { useDebounceFn } from '@vueuse/core';
import { g as getWhatsAppShareUrl } from './quoteMessage-Bmp83pcs.mjs';
import { u as useNotification } from './useNotification-B7Z2gs_7.mjs';
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

function useCalculatorQuoteItem(options) {
  const { $api } = useNuxtApp();
  const debounceMs = options?.debounceMs;
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);
  async function fetch(input) {
    if (!input.product_id || input.quantity <= 0) {
      result.value = null;
      error.value = null;
      return null;
    }
    const payload = {
      product_id: input.product_id,
      quantity: input.quantity,
      sides: input.sides ?? "SIMPLEX",
      color_mode: input.color_mode ?? "COLOR",
      finishing_ids: input.finishing_ids ?? []
    };
    if (input.width_mm != null) payload.width_mm = input.width_mm;
    if (input.height_mm != null) payload.height_mm = input.height_mm;
    if (input.paper_id != null) payload.paper_id = input.paper_id;
    if (input.grammage != null) payload.grammage = input.grammage;
    if (input.paper_type) payload.paper_type = input.paper_type;
    if (input.sheet_size) payload.sheet_size = input.sheet_size;
    if (input.machine_id != null) payload.machine_id = input.machine_id;
    loading.value = true;
    error.value = null;
    try {
      const data = await $api(API.calculatorQuoteItem(), {
        method: "POST",
        body: payload
      });
      result.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to calculate";
      result.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }
  const debouncedFetch = useDebounceFn(fetch, debounceMs);
  function calculate(input) {
    debouncedFetch(input);
  }
  return {
    result,
    loading,
    error,
    calculate,
    fetch
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteItemAddForm",
  __ssrInlineRender: true,
  props: {
    shopSlug: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const products = ref([]);
    const papers = ref([]);
    const machines = ref([]);
    const materials = ref([]);
    const finishingRates = ref([]);
    const selectedProductId = ref(null);
    const selectedPaperId = ref(null);
    const selectedMachineId = ref(null);
    const selectedMaterialId = ref(null);
    const form = reactive({
      item_type: "PRODUCT",
      product: 0,
      quantity: 100,
      paper: null,
      material: null,
      chosen_width_mm: null,
      chosen_height_mm: null,
      sides: "SIMPLEX",
      color_mode: "COLOR",
      machine: null,
      finishings: []
    });
    const product = computed(() => products.value.find((p) => p.id === form.product));
    const minQty = computed(() => product.value?.min_quantity ?? 100);
    const { result: calcResult, loading: calcLoading, error: calcError, calculate: calcCalculate } = useCalculatorQuoteItem({ debounceMs: 450 });
    const canPreview = computed(() => {
      if (!product.value || product.value.pricing_mode !== "SHEET") return false;
      const qty = form.quantity || 0;
      if (qty < minQty.value) return false;
      return !!(selectedPaperId.value ?? form.paper);
    });
    const leadTimeLabel = computed(() => {
      const h = calcResult.value?.lead_time_estimate_hours;
      if (!h) return "";
      const n = parseFloat(h);
      if (n < 1) return `${Math.round(n * 60)} min`;
      return `${n.toFixed(1)} hrs`;
    });
    const productOptions = computed(
      () => products.value.map((p) => ({ value: p.id, label: `${p.name} (${p.pricing_mode})` }))
    );
    const paperOptions = computed(
      () => papers.value.map((p) => ({ value: p.id, label: `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}` }))
    );
    const machineOptions = computed(
      () => machines.value.map((m) => ({ value: m.id, label: m.name }))
    );
    const materialOptions = computed(
      () => materials.value.map((m) => ({ value: m.id, label: `${m.material_type ?? m.id} (${m.unit})` }))
    );
    function toggleFinishing(id, checked) {
      const current = form.finishings ?? [];
      if (checked) {
        form.finishings = [...current, { finishing_rate: id }];
      } else {
        form.finishings = current.filter((f) => f.finishing_rate !== id);
      }
    }
    watch(selectedProductId, (v) => {
      form.product = v ?? 0;
      const p = products.value.find((x) => x.id === form.product);
      form.quantity = p?.min_quantity ?? 100;
      if (papers.value.length && selectedPaperId.value == null) {
        selectedPaperId.value = papers.value[0]?.id ?? null;
      }
    });
    watch(selectedPaperId, (v) => {
      form.paper = v ?? null;
    });
    watch(selectedMachineId, (v) => {
      form.machine = v ?? null;
    });
    watch(selectedMaterialId, (v) => {
      form.material = v ?? null;
    });
    watch(
      () => ({
        product_id: form.product,
        quantity: Math.max(minQty.value, form.quantity || minQty.value),
        paper_id: selectedPaperId.value ?? form.paper,
        machine_id: selectedMachineId.value ?? form.machine,
        sides: form.sides,
        color_mode: form.color_mode,
        finishing_ids: (form.finishings ?? []).map((f) => f.finishing_rate)
      }),
      (input) => {
        if (canPreview.value && input.product_id && input.quantity > 0 && input.paper_id) {
          calcCalculate({
            product_id: input.product_id,
            quantity: input.quantity,
            paper_id: input.paper_id,
            machine_id: input.machine_id ?? void 0,
            sides: input.sides,
            color_mode: input.color_mode,
            finishing_ids: input.finishing_ids
          });
        }
      },
      { deep: true, immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UFormField = _sfc_main$3;
      const _component_USelectMenu = _sfc_main$4;
      const _component_UInput = _sfc_main$5;
      const _component_UCheckbox = _sfc_main$6;
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-4 space-y-4" }, _attrs))}><h3 class="font-semibold text-[var(--p-text)]">Add item</h3><form class="space-y-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Product",
        required: "",
        ui: unref(dashboardFormFieldUi)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedProductId),
              "onUpdate:modelValue": ($event) => isRef(selectedProductId) ? selectedProductId.value = $event : null,
              items: unref(productOptions),
              "value-key": "value",
              placeholder: "Select product",
              class: "w-full",
              ui: unref(dashboardSelectUi)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_USelectMenu, {
                modelValue: unref(selectedProductId),
                "onUpdate:modelValue": ($event) => isRef(selectedProductId) ? selectedProductId.value = $event : null,
                items: unref(productOptions),
                "value-key": "value",
                placeholder: "Select product",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "ui"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid grid-cols-2 gap-4">`);
      _push(ssrRenderComponent(_component_UFormField, {
        label: "Quantity",
        required: "",
        hint: `Min ${unref(minQty)} pcs`,
        ui: unref(dashboardFormFieldUi)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).quantity,
              "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
              modelModifiers: { number: true },
              type: "number",
              min: unref(minQty),
              placeholder: String(unref(minQty)),
              ui: unref(dashboardInputUi),
              onBlur: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity || unref(minQty))
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UInput, {
                modelValue: unref(form).quantity,
                "onUpdate:modelValue": ($event) => unref(form).quantity = $event,
                modelModifiers: { number: true },
                type: "number",
                min: unref(minQty),
                placeholder: String(unref(minQty)),
                ui: unref(dashboardInputUi),
                onBlur: ($event) => unref(form).quantity = Math.max(unref(minQty), unref(form).quantity || unref(minQty))
              }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "placeholder", "ui", "onBlur"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(product)?.pricing_mode === "SHEET") {
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Paper",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelectMenu, {
                modelValue: unref(selectedPaperId),
                "onUpdate:modelValue": ($event) => isRef(selectedPaperId) ? selectedPaperId.value = $event : null,
                items: unref(paperOptions),
                "value-key": "value",
                placeholder: "Select paper",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(selectedPaperId),
                  "onUpdate:modelValue": ($event) => isRef(selectedPaperId) ? selectedPaperId.value = $event : null,
                  items: unref(paperOptions),
                  "value-key": "value",
                  placeholder: "Select paper",
                  class: "w-full",
                  ui: unref(dashboardSelectUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(product)?.pricing_mode === "SHEET") {
        _push(`<div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Machine",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelectMenu, {
                modelValue: unref(selectedMachineId),
                "onUpdate:modelValue": ($event) => isRef(selectedMachineId) ? selectedMachineId.value = $event : null,
                items: unref(machineOptions),
                "value-key": "value",
                placeholder: "Select machine",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(selectedMachineId),
                  "onUpdate:modelValue": ($event) => isRef(selectedMachineId) ? selectedMachineId.value = $event : null,
                  items: unref(machineOptions),
                  "value-key": "value",
                  placeholder: "Select machine",
                  class: "w-full",
                  ui: unref(dashboardSelectUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Sides",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelectMenu, {
                modelValue: unref(form).sides,
                "onUpdate:modelValue": ($event) => unref(form).sides = $event,
                items: [{ value: "SIMPLEX", label: "Single" }, { value: "DUPLEX", label: "Double" }],
                "value-key": "value",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(form).sides,
                  "onUpdate:modelValue": ($event) => unref(form).sides = $event,
                  items: [{ value: "SIMPLEX", label: "Single" }, { value: "DUPLEX", label: "Double" }],
                  "value-key": "value",
                  class: "w-full",
                  ui: unref(dashboardSelectUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(product)?.pricing_mode === "SHEET") {
        _push(`<div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Color",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelectMenu, {
                modelValue: unref(form).color_mode,
                "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                items: [{ value: "COLOR", label: "Color" }, { value: "BW", label: "B&W" }],
                "value-key": "value",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(form).color_mode,
                  "onUpdate:modelValue": ($event) => unref(form).color_mode = $event,
                  items: [{ value: "COLOR", label: "Color" }, { value: "BW", label: "B&W" }],
                  "value-key": "value",
                  class: "w-full",
                  ui: unref(dashboardSelectUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(product)?.pricing_mode === "LARGE_FORMAT") {
        _push(`<div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Material",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_USelectMenu, {
                modelValue: unref(selectedMaterialId),
                "onUpdate:modelValue": ($event) => isRef(selectedMaterialId) ? selectedMaterialId.value = $event : null,
                items: unref(materialOptions),
                "value-key": "value",
                placeholder: "Select material",
                class: "w-full",
                ui: unref(dashboardSelectUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_USelectMenu, {
                  modelValue: unref(selectedMaterialId),
                  "onUpdate:modelValue": ($event) => isRef(selectedMaterialId) ? selectedMaterialId.value = $event : null,
                  items: unref(materialOptions),
                  "value-key": "value",
                  placeholder: "Select material",
                  class: "w-full",
                  ui: unref(dashboardSelectUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Width (mm)",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(form).chosen_width_mm,
                "onUpdate:modelValue": ($event) => unref(form).chosen_width_mm = $event,
                modelModifiers: { number: true },
                type: "number",
                placeholder: "600",
                ui: unref(dashboardInputUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(form).chosen_width_mm,
                  "onUpdate:modelValue": ($event) => unref(form).chosen_width_mm = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  placeholder: "600",
                  ui: unref(dashboardInputUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UFormField, {
          label: "Height (mm)",
          ui: unref(dashboardFormFieldUi)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(form).chosen_height_mm,
                "onUpdate:modelValue": ($event) => unref(form).chosen_height_mm = $event,
                modelModifiers: { number: true },
                type: "number",
                placeholder: "900",
                ui: unref(dashboardInputUi)
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UInput, {
                  modelValue: unref(form).chosen_height_mm,
                  "onUpdate:modelValue": ($event) => unref(form).chosen_height_mm = $event,
                  modelModifiers: { number: true },
                  type: "number",
                  placeholder: "900",
                  ui: unref(dashboardInputUi)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(finishingRates).length) {
        _push(`<div><label class="block text-sm font-medium text-[var(--p-text-dim)] mb-2">Finishing</label><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(finishingRates), (fr) => {
          _push(ssrRenderComponent(_component_UCheckbox, {
            key: fr.id,
            "model-value": (unref(form).finishings ?? []).some((f) => f.finishing_rate === fr.id),
            label: fr.name,
            "onUpdate:modelValue": ($event) => toggleFinishing(fr.id, !!$event)
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(product)?.pricing_mode === "SHEET" && unref(canPreview)) {
        _push(`<div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-3">`);
        if (unref(calcError)) {
          _push(`<div class="text-sm text-red-600 dark:text-red-400">${ssrInterpolate(unref(calcError))}</div>`);
        } else {
          _push(`<!--[--><div class="flex items-baseline justify-between gap-4"><span class="text-sm font-medium text-[var(--p-text-muted)]">Suggested price</span>`);
          if (unref(calcLoading)) {
            _push(`<span class="text-lg font-bold text-[var(--p-text)] animate-pulse"> Calculating… </span>`);
          } else if (unref(calcResult)?.costs?.suggested_price) {
            _push(`<span class="text-2xl font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(unref(formatKES)(unref(calcResult).costs.suggested_price))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(calcResult)?.lead_time_estimate_hours && !unref(calcLoading)) {
            _push(`<div class="text-sm text-[var(--p-text-dim)]">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-clock",
              class: "inline w-4 h-4 mr-1 align-middle"
            }, null, _parent));
            _push(` ~${ssrInterpolate(unref(leadTimeLabel))} production time </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<details class="group"><summary class="flex items-center gap-2 cursor-pointer text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text-dim)] list-none">`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-lucide-chevron-right",
            class: "w-4 h-4 transition-transform group-open:rotate-90"
          }, null, _parent));
          _push(` Details </summary>`);
          if (unref(calcResult) && !unref(calcLoading)) {
            _push(`<div class="mt-2 pl-6 border-l-2 border-[var(--p-border)] space-y-1 text-sm"><div class="flex justify-between"><span class="text-[var(--p-text-muted)]">Sheets required</span><span class="text-[var(--p-text)]">${ssrInterpolate(unref(calcResult).sheets_required)}</span></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</details><!--]-->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "submit",
        color: "primary",
        loading: props.loading
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Add item`);
          } else {
            return [
              createTextVNode("Add item")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        onClick: ($event) => _ctx.$emit("cancel")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cancel`);
          } else {
            return [
              createTextVNode("Cancel")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/quotes/QuoteItemAddForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$1, { __name: "DashboardQuotesQuoteItemAddForm" });
function useStaffQuotes() {
  const { $api } = useNuxtApp();
  async function list(params) {
    return $api(API.staffQuotes(), { params });
  }
  async function get(id) {
    return $api(API.staffQuoteDetail(id));
  }
  async function create(payload) {
    return $api(API.staffQuotes(), { method: "POST", body: payload });
  }
  async function addItem(quoteId, payload) {
    return $api(API.staffQuoteItems(quoteId), { method: "POST", body: payload });
  }
  async function updateItem(quoteId, itemId, payload) {
    return $api(API.staffQuoteItemDetail(quoteId, itemId), {
      method: "PATCH",
      body: payload
    });
  }
  async function deleteItem(quoteId, itemId) {
    return $api(API.staffQuoteItemDetail(quoteId, itemId), { method: "DELETE" });
  }
  async function send(quoteId) {
    return $api(API.staffQuoteSend(quoteId), {
      method: "POST",
      body: {}
    });
  }
  async function whatsappPreview(quoteId) {
    return $api(API.staffQuoteWhatsappPreview(quoteId), {
      method: "POST",
      body: {}
    });
  }
  return {
    list,
    get,
    create,
    addItem,
    updateItem,
    deleteItem,
    send,
    whatsappPreview
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = computed(() => Number(route.params.id));
    const staffQuotes = useStaffQuotes();
    const sellerStore = useSellerStore();
    const notification = useNotification();
    const quote = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const sending = ref(false);
    const addingItem = ref(false);
    const showAddForm = ref(false);
    const previewMessage = ref("");
    const loadingPreview = ref(false);
    const previewError = ref(null);
    const shopSlug = computed(() => {
      if (!quote.value) return "";
      return quote.value.shop_slug ?? sellerStore.getShop(quote.value.shop)?.slug ?? "";
    });
    const canShowWhatsAppSection = computed(() => {
      if (!quote.value) return false;
      return ["DRAFT", "PRICED", "SENT"].includes(quote.value.status);
    });
    const displayMessage = computed(() => {
      if (!quote.value) return "";
      if (quote.value.status === "SENT" && quote.value.whatsapp_message) {
        return quote.value.whatsapp_message;
      }
      return previewMessage.value;
    });
    function statusColor(s) {
      const m = {
        DRAFT: "neutral",
        SENT: "warning",
        ACCEPTED: "success",
        EXPIRED: "error"
      };
      return m[s] ?? "neutral";
    }
    async function fetchPreview() {
      if (!quote.value || quote.value.status === "SENT") return;
      loadingPreview.value = true;
      previewError.value = null;
      try {
        const { message } = await staffQuotes.whatsappPreview(id.value);
        previewMessage.value = message;
      } catch (e) {
        previewError.value = e instanceof Error ? e.message : "Failed to load preview";
        previewMessage.value = "";
      } finally {
        loadingPreview.value = false;
      }
    }
    async function onCopyMessage() {
      let msg = displayMessage.value;
      if (!msg) {
        await fetchPreview();
        msg = previewMessage.value;
      }
      if (!msg) {
        notification.error("No message to copy");
        return;
      }
      try {
        await copyToClipboard(msg);
        notification.success("Message copied to clipboard");
      } catch {
        notification.error("Could not copy. Try Open WhatsApp instead.");
      }
    }
    async function copyToClipboard(text) {
      if ((void 0).clipboard?.writeText) {
        await (void 0).clipboard.writeText(text);
      } else {
        throw new Error("Clipboard not available");
      }
    }
    function onOpenWhatsApp() {
      const msg = displayMessage.value;
      if (!msg) return;
      const phone = quote.value?.customer_phone;
      const url = getWhatsAppShareUrl(msg, phone);
      (void 0).open(url, "_blank", "noopener,noreferrer");
    }
    async function onMarkAsSent() {
      sending.value = true;
      try {
        quote.value = await staffQuotes.send(id.value);
        notification.success("Quote marked as sent");
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to send");
      } finally {
        sending.value = false;
      }
    }
    async function fetchQuote() {
      loading.value = true;
      error.value = null;
      try {
        quote.value = await staffQuotes.get(id.value);
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Failed to load quote";
        quote.value = null;
      } finally {
        loading.value = false;
      }
    }
    async function onAddItem(payload) {
      addingItem.value = true;
      try {
        await staffQuotes.addItem(id.value, payload);
        notification.success("Item added");
        showAddForm.value = false;
        await fetchQuote();
      } catch (e) {
        notification.error(e instanceof Error ? e.message : "Failed to add item");
      } finally {
        addingItem.value = false;
      }
    }
    watch(
      () => quote.value,
      (q) => {
        if (q?.items?.length && (q.status === "DRAFT" || q.status === "PRICED")) {
          fetchPreview();
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      const _component_DashboardQuotesQuoteItemAddForm = __nuxt_component_4;
      const _component_UIcon = _sfc_main$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: `Quote #${unref(id)}`,
        subtitle: unref(quote)?.shop_name
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              to: "/dashboard/quotes"
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
          } else {
            return [
              createVNode(_component_UButton, {
                variant: "soft",
                size: "sm",
                to: "/dashboard/quotes"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loading) && !unref(quote)) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"><p class="text-sm text-red-700 dark:text-red-300">${ssrInterpolate(unref(error))}</p></div>`);
      } else if (unref(quote)) {
        _push(`<!--[--><div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 grid gap-6 sm:grid-cols-2"><div><h3 class="text-sm font-medium text-[var(--p-text-muted)]">Customer</h3><p class="mt-1 font-medium text-[var(--p-text)]">${ssrInterpolate(unref(quote).customer_name || "—")}</p><p class="text-sm text-[var(--p-text-dim)]">${ssrInterpolate(unref(quote).customer_email || "—")}</p><p class="text-sm text-[var(--p-text-dim)]">${ssrInterpolate(unref(quote).customer_phone || "—")}</p></div><div><h3 class="text-sm font-medium text-[var(--p-text-muted)]">Status</h3>`);
        _push(ssrRenderComponent(_component_UBadge, {
          color: statusColor(unref(quote).status),
          variant: "soft",
          class: "mt-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(quote).status)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(quote).status), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="mt-3 text-2xl font-bold text-[var(--p-text)]">${ssrInterpolate(unref(quote).total ? unref(formatKES)(unref(quote).total) : "—")}</p></div></div><div><h2 class="text-lg font-semibold text-[var(--p-text)] mb-4">Items</h2>`);
        if (unref(quote).items?.length) {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(quote).items, (item) => {
            _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"><div class="flex justify-between items-start"><div><p class="font-medium text-[var(--p-text)]">${ssrInterpolate(item.product_name || item.title || "Item")}</p><p class="text-sm text-[var(--p-text-muted)]">${ssrInterpolate(item.quantity)} pcs × ${ssrInterpolate(item.unit_price ? unref(formatKES)(item.unit_price) : "—")}</p></div><p class="font-semibold text-[var(--p-text)]">${ssrInterpolate(item.line_total ? unref(formatKES)(item.line_total) : "—")}</p></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-[var(--p-text-muted)]">No items yet.</p>`);
        }
        if (unref(quote).status === "DRAFT" && unref(shopSlug)) {
          _push(`<div class="mt-6">`);
          if (unref(showAddForm)) {
            _push(ssrRenderComponent(_component_DashboardQuotesQuoteItemAddForm, {
              "shop-slug": unref(shopSlug),
              loading: unref(addingItem),
              onSubmit: onAddItem,
              onCancel: ($event) => showAddForm.value = false
            }, null, _parent));
          } else {
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              color: "primary",
              onClick: ($event) => showAddForm.value = true
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-plus",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push2(` Add item `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-plus",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Add item ")
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
        _push(`</div>`);
        if (unref(quote).items?.length && unref(canShowWhatsAppSection)) {
          _push(`<div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 space-y-4"><h3 class="text-sm font-medium text-[var(--p-text-muted)]">Send via WhatsApp</h3><div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">`);
          if (unref(displayMessage)) {
            _push(`<p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono">${ssrInterpolate(unref(displayMessage))}</p>`);
          } else if (unref(loadingPreview)) {
            _push(`<p class="text-sm text-[var(--p-text-muted)]">Loading message…</p>`);
          } else if (unref(previewError)) {
            _push(`<p class="text-sm text-red-600 dark:text-red-400">${ssrInterpolate(unref(previewError))}</p>`);
          } else {
            _push(`<p class="text-sm text-[var(--p-text-muted)]">No message to display.</p>`);
          }
          _push(`</div><div class="flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            loading: unref(loadingPreview),
            disabled: unref(loadingPreview),
            onClick: onCopyMessage
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-copy",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Copy WhatsApp Message `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-copy",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Copy WhatsApp Message ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            size: "sm",
            disabled: !unref(displayMessage) || unref(loadingPreview),
            onClick: onOpenWhatsApp
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: "i-lucide-message-circle",
                  class: "w-4 h-4 mr-2"
                }, null, _parent2, _scopeId));
                _push2(` Open WhatsApp `);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: "i-lucide-message-circle",
                    class: "w-4 h-4 mr-2"
                  }),
                  createTextVNode(" Open WhatsApp ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(quote).status === "DRAFT" || unref(quote).status === "PRICED") {
            _push(ssrRenderComponent(_component_UButton, {
              color: "primary",
              size: "sm",
              loading: unref(sending),
              onClick: onMarkAsSent
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-send",
                    class: "w-4 h-4 mr-2"
                  }, null, _parent2, _scopeId));
                  _push2(` Mark as Sent `);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: "i-lucide-send",
                      class: "w-4 h-4 mr-2"
                    }),
                    createTextVNode(" Mark as Sent ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(quote).status === "SENT" && unref(quote).sent_at) {
            _push(`<p class="text-xs text-[var(--p-text-muted)]"> Sent ${ssrInterpolate(unref(formatDate)(unref(quote).sent_at))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/quotes/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Vp21NxKy.mjs.map
