import { g as useRoute, h as useToast, e as _sfc_main$9, a as _sfc_main$f, v as useNuxtApp, A as API, w as parseApiError } from './server.mjs';
import { _ as __nuxt_component_3 } from './LoadingSpinner-DC3DKYaG.mjs';
import { _ as _sfc_main$2 } from './Badge-CHxS7t2J.mjs';
import { _ as __nuxt_component_3$1 } from './EmptyState-InVpxbUI.mjs';
import { _ as __nuxt_component_5 } from './DashboardModalForm-DxuRCbSc.mjs';
import { F as Form, _ as __nuxt_component_2 } from './FormInput-9hgb7rOA.mjs';
import { _ as __nuxt_component_1 } from './FormSelect-uLWI1dG3.mjs';
import { defineComponent, computed, ref, watch, nextTick, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, isRef, openBlock, createBlock, createCommentVNode, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { object, number, string } from 'yup';
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
import './SelectMenu-DTjoEp_W.mjs';
import './Input-DA2ySSK8.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PaperStockForm",
  __ssrInlineRender: true,
  props: {
    stock: {},
    loading: { type: Boolean }
  },
  emits: ["submit", "cancel"],
  setup(__props) {
    const props = __props;
    const sheetSizeOptions = [
      { label: "A5 (148 × 210 mm)", value: "A5" },
      { label: "A4 (210 × 297 mm)", value: "A4" },
      { label: "A3 (297 × 420 mm)", value: "A3" },
      { label: "SRA3 (320 × 450 mm)", value: "SRA3" },
      { label: "SRA4 (225 × 320 mm)", value: "SRA4" }
    ];
    const paperTypeOptions = [
      { label: "Gloss", value: "GLOSS" },
      { label: "Matte", value: "MATTE" },
      { label: "Bond", value: "BOND" },
      { label: "Art Paper", value: "ART" }
    ];
    const schema = object({
      sheet_size: string().oneOf(["A5", "A4", "A3", "SRA3", "SRA4"]).required("Size is required"),
      gsm: number().min(60, "Min 60 GSM").max(500, "Max 500 GSM").required("GSM is required"),
      paper_type: string().oneOf(["GLOSS", "MATTE", "BOND", "ART"]).required("Paper type is required"),
      buying_price: string().required("Buying price is required"),
      selling_price: string().required("Selling price is required"),
      quantity_in_stock: number().min(0).optional().nullable(),
      reorder_level: number().min(0).optional().nullable()
    });
    const initialValues = computed(() => ({
      sheet_size: props.stock?.sheet_size ?? "SRA3",
      gsm: props.stock?.gsm ?? "",
      paper_type: props.stock?.paper_type ?? "GLOSS",
      buying_price: props.stock?.buying_price ?? "",
      selling_price: props.stock?.selling_price ?? "",
      quantity_in_stock: props.stock?.quantity_in_stock ?? "",
      reorder_level: props.stock?.reorder_level ?? ""
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VeeForm = Form;
      const _component_FormsFormSelect = __nuxt_component_1;
      const _component_FormsFormInput = __nuxt_component_2;
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_VeeForm, mergeProps({
        "validation-schema": unref(schema),
        "initial-values": unref(initialValues),
        onSubmit: ($event) => _ctx.$emit("submit", $event)
      }, _attrs), {
        default: withCtx(({ meta }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "sheet_size",
              label: "Sheet size",
              options: sheetSizeOptions,
              placeholder: "Select size",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "gsm",
              label: "GSM (weight)",
              type: "number",
              placeholder: "e.g. 80, 130, 150, 200, 300",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormSelect, {
              name: "paper_type",
              label: "Paper type",
              options: paperTypeOptions,
              placeholder: "Select type",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "buying_price",
              label: "Buying price per sheet",
              type: "number",
              placeholder: "0.00",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "selling_price",
              label: "Selling price per sheet",
              type: "number",
              placeholder: "0.00",
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "quantity_in_stock",
              label: "Quantity in stock (optional)",
              type: "number",
              placeholder: "Leave empty"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FormsFormInput, {
              name: "reorder_level",
              label: "Reorder level (optional)",
              type: "number",
              placeholder: "100"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-end gap-2 pt-4"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              variant: "outline",
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
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
              loading: __props.loading,
              disabled: __props.loading
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(__props.stock ? "Update" : "Add")} paper `);
                } else {
                  return [
                    createTextVNode(toDisplayString(__props.stock ? "Update" : "Add") + " paper ", 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode(_component_FormsFormSelect, {
                  name: "sheet_size",
                  label: "Sheet size",
                  options: sheetSizeOptions,
                  placeholder: "Select size",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "gsm",
                  label: "GSM (weight)",
                  type: "number",
                  placeholder: "e.g. 80, 130, 150, 200, 300",
                  required: ""
                }),
                createVNode(_component_FormsFormSelect, {
                  name: "paper_type",
                  label: "Paper type",
                  options: paperTypeOptions,
                  placeholder: "Select type",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "buying_price",
                  label: "Buying price per sheet",
                  type: "number",
                  placeholder: "0.00",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "selling_price",
                  label: "Selling price per sheet",
                  type: "number",
                  placeholder: "0.00",
                  required: ""
                }),
                createVNode(_component_FormsFormInput, {
                  name: "quantity_in_stock",
                  label: "Quantity in stock (optional)",
                  type: "number",
                  placeholder: "Leave empty"
                }),
                createVNode(_component_FormsFormInput, {
                  name: "reorder_level",
                  label: "Reorder level (optional)",
                  type: "number",
                  placeholder: "100"
                }),
                createVNode("div", { class: "flex justify-end gap-2 pt-4" }, [
                  createVNode(_component_UButton, {
                    variant: "outline",
                    onClick: ($event) => _ctx.$emit("cancel")
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    type: "submit",
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    loading: __props.loading,
                    disabled: __props.loading
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.stock ? "Update" : "Add") + " paper ", 1)
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/materials/PaperStockForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_6 = Object.assign(_sfc_main$1, { __name: "MaterialsPaperStockForm" });
const usePaperStockStore = defineStore("paperStock", {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  getters: {
    lowStockItems: (state) => state.items.filter(
      (p) => p.needs_reorder ?? (p.quantity_in_stock != null && p.reorder_level != null && p.quantity_in_stock <= p.reorder_level)
    ),
    activeItems: (state) => state.items.filter((p) => p.is_active !== false)
  },
  actions: {
    async fetchPaperStock(shopSlug) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const response = await $api(API.shopPaper(shopSlug));
        this.items = Array.isArray(response) ? response : response?.results ?? [];
        return this.items;
      } catch (err) {
        this.error = parseApiError(err, "Failed to fetch paper");
        this.items = [];
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async createPaperStock(shopSlug, data) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const payload = {
          sheet_size: data.sheet_size,
          gsm: Number(data.gsm),
          paper_type: data.paper_type,
          buying_price: String(data.buying_price),
          selling_price: String(data.selling_price),
          quantity_in_stock: data.quantity_in_stock ?? null,
          reorder_level: data.reorder_level ?? null,
          is_active: data.is_active ?? true
        };
        const item = await $api(API.shopPaper(shopSlug), {
          method: "POST",
          body: payload
        });
        this.items.push(item);
        return { success: true, item };
      } catch (err) {
        const message = parseApiError(err, "Failed to create paper");
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
    async updatePaperStock(shopSlug, id, data) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const payload = { ...data };
        if (data.gsm != null) payload.gsm = Number(data.gsm);
        if (data.buying_price != null) payload.buying_price = String(data.buying_price);
        if (data.selling_price != null) payload.selling_price = String(data.selling_price);
        const item = await $api(API.shopPaperDetail(shopSlug, id), {
          method: "PATCH",
          body: payload
        });
        const idx = this.items.findIndex((p) => p.id === id);
        if (idx >= 0) this.items[idx] = item;
        return { success: true, item };
      } catch (err) {
        const message = parseApiError(err, "Failed to update paper");
        this.error = message;
        throw new Error(message);
      } finally {
        this.loading = false;
      }
    },
    async deletePaperStock(shopSlug, id) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        await $api(API.shopPaperDetail(shopSlug, id), { method: "DELETE" });
        this.items = this.items.filter((p) => p.id !== id);
        return { success: true };
      } catch (err) {
        this.error = parseApiError(err, "Failed to delete");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async adjustStock(shopSlug, id, adjustment) {
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        const item = await $api(API.shopPaperAdjust(shopSlug, id), {
          method: "POST",
          body: { adjustment }
        });
        const idx = this.items.findIndex((p) => p.id === id);
        if (idx >= 0) this.items[idx] = item;
        return { success: true, item };
      } catch (err) {
        const message = parseApiError(err, "Failed to adjust stock");
        this.error = message;
        throw new Error(message);
      }
    },
    clear() {
      this.items = [];
      this.error = null;
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const paperStockStore = usePaperStockStore();
    const toast = useToast();
    const slug = computed(() => route.params.slug);
    const modalOpen = ref(false);
    const formReady = ref(false);
    const editing = ref(null);
    const formLoading = ref(false);
    const adjustModalOpen = ref(false);
    const adjustingItem = ref(null);
    const adjustmentValue = ref("");
    const adjustLoading = ref(false);
    function openModal(item) {
      editing.value = item ?? null;
      modalOpen.value = true;
    }
    function editItem(item) {
      openModal(item);
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
    function openAdjustModal(item) {
      adjustingItem.value = item;
      adjustmentValue.value = "";
      adjustModalOpen.value = true;
    }
    function closeAdjustModal() {
      adjustModalOpen.value = false;
      adjustingItem.value = null;
      adjustmentValue.value = "";
    }
    async function onSubmit(data) {
      formLoading.value = true;
      try {
        const payload = {
          sheet_size: data.sheet_size,
          gsm: data.gsm,
          paper_type: data.paper_type,
          buying_price: data.buying_price,
          selling_price: data.selling_price,
          quantity_in_stock: data.quantity_in_stock ?? null,
          reorder_level: data.reorder_level ?? null
        };
        if (editing.value) {
          await paperStockStore.updatePaperStock(slug.value, editing.value.id, payload);
          toast.add({ title: "Updated", description: "Paper stock updated" });
        } else {
          await paperStockStore.createPaperStock(slug.value, payload);
          toast.add({ title: "Added", description: "Paper stock added" });
        }
        closeModal();
      } catch (err) {
        const msg = err instanceof Error ? err.message : paperStockStore.error ?? "Failed to save";
        toast.add({ title: "Error", description: msg, color: "error" });
      } finally {
        formLoading.value = false;
      }
    }
    async function applyAdjustment() {
      if (!adjustingItem.value) return;
      const adj = parseInt(adjustmentValue.value, 10);
      if (Number.isNaN(adj) || adj === 0 || adjustmentValue.value.trim() === "") {
        toast.add({ title: "Invalid", description: "Enter a non-zero number", color: "error" });
        return;
      }
      adjustLoading.value = true;
      try {
        await paperStockStore.adjustStock(slug.value, adjustingItem.value.id, adj);
        toast.add({
          title: "Stock updated",
          description: adj > 0 ? `Added ${adj} sheets` : `Removed ${Math.abs(adj)} sheets`
        });
        closeAdjustModal();
      } catch (err) {
        const msg = err instanceof Error ? err.message : paperStockStore.error ?? "Failed to adjust";
        toast.add({ title: "Error", description: msg, color: "error" });
      } finally {
        adjustLoading.value = false;
      }
    }
    async function confirmDelete(item) {
      const name = `${item.sheet_size} ${item.gsm}gsm ${item.paper_type}`;
      if (!confirm(`Delete "${name}"? This may affect quotes using this stock.`)) return;
      try {
        await paperStockStore.deletePaperStock(slug.value, item.id);
        toast.add({ title: "Deleted", description: "Paper stock removed" });
      } catch (err) {
        toast.add({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to delete",
          color: "error"
        });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_UIcon = _sfc_main$f;
      const _component_CommonLoadingSpinner = __nuxt_component_3;
      const _component_UBadge = _sfc_main$2;
      const _component_CommonEmptyState = __nuxt_component_3$1;
      const _component_DashboardModalForm = __nuxt_component_5;
      const _component_MaterialsPaperStockForm = __nuxt_component_6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex justify-between items-center"><div><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Paper stock &amp; materials</h1><p class="text-gray-600 dark:text-gray-400 mt-1"> Track paper inventory by size, GSM and type. Adjust stock levels as you use or receive stock. </p></div><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: `/dashboard/shops/${unref(slug)}`,
        variant: "soft",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Back`);
          } else {
            return [
              createTextVNode("Back")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
        onClick: ($event) => openModal()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-plus",
              class: "w-4 h-4 mr-2"
            }, null, _parent2, _scopeId));
            _push2(` Add paper stock `);
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-lucide-plus",
                class: "w-4 h-4 mr-2"
              }),
              createTextVNode(" Add paper stock ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(paperStockStore).loading && !unref(paperStockStore).items.length) {
        _push(ssrRenderComponent(_component_CommonLoadingSpinner, null, null, _parent));
      } else {
        _push(`<!--[-->`);
        if (unref(paperStockStore).items.length) {
          _push(`<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paper</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">In stock</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reorder at</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy / Sell</th><th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th><th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`);
          ssrRenderList(unref(paperStockStore).items, (item) => {
            _push(`<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td class="px-4 py-3"><div class="text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(item.sheet_size_display ?? item.sheet_size)} ${ssrInterpolate(item.gsm)}gsm </div><div class="text-xs text-gray-500 dark:text-gray-400">${ssrInterpolate(item.paper_type_display ?? item.paper_type)}</div></td><td class="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">${ssrInterpolate(item.quantity_in_stock != null ? `${item.quantity_in_stock} sheets` : "-")}</td><td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">${ssrInterpolate(item.reorder_level ?? "-")}</td><td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400"> KES ${ssrInterpolate(item.buying_price)} / KES ${ssrInterpolate(item.selling_price)}</td><td class="px-4 py-3 text-center">`);
            _push(ssrRenderComponent(_component_UBadge, {
              color: item.needs_reorder ?? (item.quantity_in_stock != null && item.reorder_level != null && item.quantity_in_stock <= item.reorder_level) ? "error" : "success",
              variant: "soft",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.needs_reorder ?? (item.quantity_in_stock != null && item.reorder_level != null && item.quantity_in_stock <= item.reorder_level) ? "Low stock" : "OK")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.needs_reorder ?? (item.quantity_in_stock != null && item.reorder_level != null && item.quantity_in_stock <= item.reorder_level) ? "Low stock" : "OK"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</td><td class="px-4 py-3 text-right">`);
            if (item.quantity_in_stock != null) {
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                size: "xs",
                onClick: ($event) => openAdjustModal(item)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(ssrRenderComponent(_component_UIcon, {
                      name: "i-lucide-plus-minus",
                      class: "w-4 h-4"
                    }, null, _parent2, _scopeId));
                  } else {
                    return [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-plus-minus",
                        class: "w-4 h-4"
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "xs",
              onClick: ($event) => editItem(item)
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
              onClick: ($event) => confirmDelete(item)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Delete `);
                } else {
                  return [
                    createTextVNode(" Delete ")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        } else {
          _push(ssrRenderComponent(_component_CommonEmptyState, {
            title: "No paper stock yet",
            description: "Add your first paper stock entry. Track inventory by size, GSM and paper type."
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UButton, {
                  type: "button",
                  class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                  onClick: ($event) => openModal()
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Add first paper stock `);
                    } else {
                      return [
                        createTextVNode(" Add first paper stock ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_UButton, {
                    type: "button",
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    onClick: ($event) => openModal()
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add first paper stock ")
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
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(modalOpen),
        "onUpdate:modelValue": ($event) => isRef(modalOpen) ? modalOpen.value = $event : null,
        title: unref(editing) ? "Edit paper stock" : "Add paper stock",
        description: unref(editing) ? "Edit paper inventory details." : "Add paper inventory by size, GSM and type."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(formReady)) {
              _push2(ssrRenderComponent(_component_MaterialsPaperStockForm, {
                key: unref(editing)?.id ?? "new",
                stock: unref(editing),
                loading: unref(formLoading),
                onSubmit,
                onCancel: closeModal
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(formReady) ? (openBlock(), createBlock(_component_MaterialsPaperStockForm, {
                key: unref(editing)?.id ?? "new",
                stock: unref(editing),
                loading: unref(formLoading),
                onSubmit,
                onCancel: closeModal
              }, null, 8, ["stock", "loading"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardModalForm, {
        modelValue: unref(adjustModalOpen),
        "onUpdate:modelValue": ($event) => isRef(adjustModalOpen) ? adjustModalOpen.value = $event : null,
        title: "Adjust stock",
        description: "Add or remove sheets from inventory."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(adjustingItem)) {
              _push2(`<div class="space-y-4"${_scopeId}><p class="text-sm text-gray-600 dark:text-gray-400"${_scopeId}>${ssrInterpolate(unref(adjustingItem).sheet_size)} ${ssrInterpolate(unref(adjustingItem).gsm)}gsm ${ssrInterpolate(unref(adjustingItem).paper_type)} — current: ${ssrInterpolate(unref(adjustingItem).quantity_in_stock ?? 0)} sheets </p><div${_scopeId}><label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"${_scopeId}> Adjustment (+ to add, - to remove) </label><input${ssrRenderAttr("value", unref(adjustmentValue))} type="number" placeholder="e.g. 50 or -20" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"${_scopeId}></div><div class="flex justify-end gap-2 pt-4"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                variant: "outline",
                onClick: closeAdjustModal
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
                loading: unref(adjustLoading),
                disabled: unref(adjustLoading) || unref(adjustmentValue) === "" || unref(adjustmentValue) === null,
                onClick: applyAdjustment
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Apply `);
                  } else {
                    return [
                      createTextVNode(" Apply ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(adjustingItem) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "space-y-4"
              }, [
                createVNode("p", { class: "text-sm text-gray-600 dark:text-gray-400" }, toDisplayString(unref(adjustingItem).sheet_size) + " " + toDisplayString(unref(adjustingItem).gsm) + "gsm " + toDisplayString(unref(adjustingItem).paper_type) + " — current: " + toDisplayString(unref(adjustingItem).quantity_in_stock ?? 0) + " sheets ", 1),
                createVNode("div", null, [
                  createVNode("label", { class: "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" }, " Adjustment (+ to add, - to remove) "),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(adjustmentValue) ? adjustmentValue.value = $event : null,
                    type: "number",
                    placeholder: "e.g. 50 or -20",
                    class: "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:outline-none focus:ring-2 focus:ring-flamingo-500/20"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(adjustmentValue)]
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-2 pt-4" }, [
                  createVNode(_component_UButton, {
                    variant: "outline",
                    onClick: closeAdjustModal
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Cancel")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_UButton, {
                    class: "rounded-xl bg-flamingo-500 hover:bg-flamingo-600",
                    loading: unref(adjustLoading),
                    disabled: unref(adjustLoading) || unref(adjustmentValue) === "" || unref(adjustmentValue) === null,
                    onClick: applyAdjustment
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Apply ")
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ])
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/materials/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DFB2ogev.mjs.map
