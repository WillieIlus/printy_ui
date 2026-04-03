import { d as useAuthStore, e as useToast, n as navigateTo, b as _sfc_main$9 } from './server.mjs';
import { _ as _sfc_main$3 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$2 } from './Badge-Dn_IFHF_.mjs';
import { _ as _sfc_main$4 } from './Input-Hudv-7BP.mjs';
import { _ as _sfc_main$5 } from './Textarea-DUPwu95P.mjs';
import { defineComponent, ref, watchEffect, computed, watch, mergeProps, withCtx, createVNode, unref, createTextVNode, toDisplayString, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { updateItem, removeItem, requestQuoteItem, requestQuote } from './quoteDraft-5mvcgeM-.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { f as formatCurrency } from './formatters-FW8HHCjc.mjs';
import { u as useApi } from './useApi-Cs2GTEbX.mjs';
import { u as useQuoteRequestBlast, _ as __nuxt_component_1, Q as QuotesShopSelectionChips, b as buildQuoteRequestSendSummary, g as getQuoteRequestSendToast, a as getQuoteRequestSendLabel } from './pricingBreakdown-CT3rnr7b.mjs';
import { _ as __nuxt_component_2 } from './BackendQuoteCalculator-LNtZ4F8P.mjs';
import { _ as __nuxt_component_3 } from './BookletCalculator-CV4rstZN.mjs';
import { _ as __nuxt_component_4 } from './LargeFormatCalculator-B6MJg4wd.mjs';
import { l as listShops } from './public-BVuVnl0E.mjs';
import { g as getPostLoginRedirectPath } from './useAuth-D74NSkk_.mjs';
import { u as useActivityBadgesStore } from './activityBadges-B_bMwbEc.mjs';
import { g as getPreviewMoney } from './calculationResult-SiwRgRTu.mjs';
import { e as extractProductionDetails } from './productionDetails-ByImjBQh.mjs';
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
import './machine-DD004_8d.mjs';
import './shop-DqJLBw0V.mjs';
import './browser-storage-CN-SIF_V.mjs';
import './payload-B_6emhZU.mjs';
import './useCurrencyFormatter-tIWAo1tq.mjs';
import './profile-v5Kfn5BI.mjs';
import './useNotifications-BB49WIYK.mjs';
import './interval-DiSDr_Za.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "QuoteBuilderPanel",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useApi();
    const quoteInboxStore = useQuoteInboxStore();
    const toast = useToast();
    const updatingItemId = ref(null);
    const removingItemId = ref(null);
    const submittingDraftId = ref(null);
    const sendingItemId = ref(null);
    const editingItemId = ref(null);
    const editForm = reactive({
      quantity: "1",
      sides: "SIMPLEX",
      color_mode: "COLOR",
      chosen_width_mm: "",
      chosen_height_mm: "",
      special_instructions: ""
    });
    const activeFile = computed(() => quoteInboxStore.activeDraftFile || quoteInboxStore.draftFiles[0] || null);
    const activeFileId = computed(() => activeFile.value?.id);
    const fileOptions = computed(() => quoteInboxStore.draftFiles.map((file) => ({
      value: file.id,
      label: `${file.customer_name || file.company_name} (${file.item_count} item${file.item_count === 1 ? "" : "s"})`
    })));
    const sidesOptions = [
      { label: "Simplex", value: "SIMPLEX" },
      { label: "Duplex", value: "DUPLEX" }
    ];
    const colorOptions = [
      { label: "Colour", value: "COLOR" },
      { label: "Black & white", value: "BW" }
    ];
    function handleFileChange(value) {
      const fileId = Number(value);
      const nextFile = quoteInboxStore.draftFiles.find((file) => file.id === fileId) || null;
      quoteInboxStore.activeDraftFile = nextFile;
    }
    function itemSummary(item) {
      if (item.pricing_mode === "LARGE_FORMAT" && item.chosen_width_mm && item.chosen_height_mm) {
        return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`;
      }
      return "Saved quote configuration";
    }
    function startEdit(item) {
      editingItemId.value = item.id;
      editForm.quantity = String(item.quantity || 1);
      editForm.sides = item.sides || "SIMPLEX";
      editForm.color_mode = item.color_mode || "COLOR";
      editForm.chosen_width_mm = item.chosen_width_mm ? String(item.chosen_width_mm) : "";
      editForm.chosen_height_mm = item.chosen_height_mm ? String(item.chosen_height_mm) : "";
      editForm.special_instructions = item.special_instructions || item.spec_text || "";
    }
    function cancelEdit() {
      editingItemId.value = null;
    }
    async function refreshBuilder() {
      await Promise.all([
        quoteInboxStore.fetchDraftFiles("dashboard"),
        quoteInboxStore.fetchClientRequests()
      ]);
    }
    async function saveItemEdit(draftId, itemId) {
      updatingItemId.value = itemId;
      try {
        await updateItem(draftId, itemId, {
          quantity: Number(editForm.quantity) || 1,
          sides: editForm.sides,
          color_mode: editForm.color_mode,
          chosen_width_mm: editForm.chosen_width_mm ? Number(editForm.chosen_width_mm) : void 0,
          chosen_height_mm: editForm.chosen_height_mm ? Number(editForm.chosen_height_mm) : void 0,
          special_instructions: editForm.special_instructions
        }, api);
        editingItemId.value = null;
        await refreshBuilder();
        toast.add({ title: "Quote item updated", description: "Backend totals were refreshed for this shop quote.", color: "success" });
      } catch (error) {
        toast.add({ title: "Could not update item", description: error instanceof Error ? error.message : "Update failed.", color: "error" });
      } finally {
        updatingItemId.value = null;
      }
    }
    async function removeQuoteItem(draftId, itemId) {
      removingItemId.value = itemId;
      try {
        await removeItem(draftId, itemId, api);
        await refreshBuilder();
        toast.add({ title: "Quote item removed", description: "The shop quote total was updated.", color: "success" });
      } catch (error) {
        toast.add({ title: "Could not remove item", description: error instanceof Error ? error.message : "Remove failed.", color: "error" });
      } finally {
        removingItemId.value = null;
      }
    }
    async function submitShopQuote(group) {
      submittingDraftId.value = group.draft_id;
      try {
        await requestQuote(group.draft_id, api);
        await refreshBuilder();
        toast.add({ title: "Quote submitted", description: `${group.shop_name} received this quote request.`, color: "success" });
      } catch (error) {
        toast.add({ title: "Could not submit quote", description: error instanceof Error ? error.message : "Submit failed.", color: "error" });
      } finally {
        submittingDraftId.value = null;
      }
    }
    async function sendSingleItem(draftId, itemId, shopName) {
      sendingItemId.value = itemId;
      try {
        await requestQuoteItem(draftId, itemId, api);
        await refreshBuilder();
        toast.add({ title: "Quote item sent", description: `One item was sent to ${shopName} and removed from your open quote.`, color: "success" });
      } catch (error) {
        toast.add({ title: "Could not send item", description: error instanceof Error ? error.message : "Send failed.", color: "error" });
      } finally {
        sendingItemId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_USelectMenu = _sfc_main$3;
      const _component_UBadge = _sfc_main$2;
      const _component_UInput = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm" }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">My Quote</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Quote items grouped by shop</h2><p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]"> Keep items shop-scoped, update them in place, and submit one shop quote or one item at a time. </p></div><div class="flex flex-wrap gap-3"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Quote items</p><p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(quoteInboxStore).quoteBuilderItemCount)}</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshBuilder
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(quoteInboxStore).draftFiles.length > 1) {
        _push(`<div class="mt-5">`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          "model-value": unref(activeFileId),
          items: unref(fileOptions),
          "value-key": "value",
          "label-key": "label",
          class: "w-full max-w-xl",
          portal: "body",
          "onUpdate:modelValue": handleFileChange
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(quoteInboxStore).loading && !unref(activeFile)) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(2, (index) => {
          _push(`<div class="h-48 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(activeFile)) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No quote items yet. Use any calculator or product tweak flow to add items to your quote. </div>`);
      } else {
        _push(`<div class="mt-6 space-y-6"><!--[-->`);
        ssrRenderList(unref(activeFile).shop_groups, (group) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex flex-col gap-4 border-b border-[var(--p-border)] pb-4 lg:flex-row lg:items-start lg:justify-between"><div><div class="flex flex-wrap items-center gap-3"><h3 class="text-xl font-semibold text-[var(--p-text)]">${ssrInterpolate(group.shop_name)}</h3>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: group.status === "draft" ? "warning" : "neutral"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(group.status === "draft" ? "Open Quote" : group.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(group.status === "draft" ? "Open Quote" : group.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(group.item_count)} item${ssrInterpolate(group.item_count === 1 ? "" : "s")} in this shop quote. </p></div><div class="grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Quote total</p><p class="mt-1 text-lg font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(formatCurrency)(group.total || group.subtotal, group.shop_currency))}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest turnaround</p><p class="mt-1 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(group.latest_sent_quote?.human_ready_text || "Ready time on request")}</p></div></div></div><div class="mt-5 space-y-4"><!--[-->`);
          ssrRenderList(group.items, (item) => {
            _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div class="min-w-0"><p class="text-base font-semibold text-[var(--p-text)]">${ssrInterpolate(item.product_name || item.title || "Quote item")}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(item.spec_text || item.special_instructions || itemSummary(item))}</p><div class="mt-3 flex flex-wrap gap-2">`);
            _push(ssrRenderComponent(_component_UBadge, {
              variant: "soft",
              color: "neutral"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Qty ${ssrInterpolate(item.quantity)}`);
                } else {
                  return [
                    createTextVNode("Qty " + toDisplayString(item.quantity), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (item.pricing_mode) {
              _push(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "neutral"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(item.pricing_mode)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.pricing_mode), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            if (item.sides) {
              _push(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "neutral"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(item.sides)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.sides), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            if (item.color_mode) {
              _push(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "neutral"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(item.color_mode)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.color_mode), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="text-left lg:text-right"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Line total</p><p class="mt-1 text-lg font-bold text-[var(--p-text)]">${ssrInterpolate(unref(formatCurrency)(item.line_total || "0.00", group.shop_currency))}</p></div></div>`);
            if (unref(editingItemId) === item.id) {
              _push(`<div class="mt-4 grid gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:grid-cols-2"><label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Quantity</span>`);
              _push(ssrRenderComponent(_component_UInput, {
                modelValue: unref(editForm).quantity,
                "onUpdate:modelValue": ($event) => unref(editForm).quantity = $event,
                type: "number",
                min: "1"
              }, null, _parent));
              _push(`</label>`);
              if (item.sides) {
                _push(`<label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Sides</span>`);
                _push(ssrRenderComponent(_component_USelectMenu, {
                  modelValue: unref(editForm).sides,
                  "onUpdate:modelValue": ($event) => unref(editForm).sides = $event,
                  items: sidesOptions,
                  "value-key": "value",
                  "label-key": "label",
                  portal: "body"
                }, null, _parent));
                _push(`</label>`);
              } else {
                _push(`<!---->`);
              }
              if (item.color_mode) {
                _push(`<label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Colour mode</span>`);
                _push(ssrRenderComponent(_component_USelectMenu, {
                  modelValue: unref(editForm).color_mode,
                  "onUpdate:modelValue": ($event) => unref(editForm).color_mode = $event,
                  items: colorOptions,
                  "value-key": "value",
                  "label-key": "label",
                  portal: "body"
                }, null, _parent));
                _push(`</label>`);
              } else {
                _push(`<!---->`);
              }
              if (item.pricing_mode === "LARGE_FORMAT") {
                _push(`<label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Width (mm)</span>`);
                _push(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(editForm).chosen_width_mm,
                  "onUpdate:modelValue": ($event) => unref(editForm).chosen_width_mm = $event,
                  type: "number",
                  min: "1"
                }, null, _parent));
                _push(`</label>`);
              } else {
                _push(`<!---->`);
              }
              if (item.pricing_mode === "LARGE_FORMAT") {
                _push(`<label class="block"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Height (mm)</span>`);
                _push(ssrRenderComponent(_component_UInput, {
                  modelValue: unref(editForm).chosen_height_mm,
                  "onUpdate:modelValue": ($event) => unref(editForm).chosen_height_mm = $event,
                  type: "number",
                  min: "1"
                }, null, _parent));
                _push(`</label>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<label class="block md:col-span-2"><span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Notes</span>`);
              _push(ssrRenderComponent(_component_UTextarea, {
                modelValue: unref(editForm).special_instructions,
                "onUpdate:modelValue": ($event) => unref(editForm).special_instructions = $event,
                rows: 3
              }, null, _parent));
              _push(`</label><div class="flex flex-wrap gap-3 md:col-span-2">`);
              _push(ssrRenderComponent(_component_UButton, {
                color: "primary",
                loading: unref(updatingItemId) === item.id,
                onClick: ($event) => saveItemEdit(group.draft_id, item.id)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`Update item`);
                  } else {
                    return [
                      createTextVNode("Update item")
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(ssrRenderComponent(_component_UButton, {
                variant: "soft",
                onClick: cancelEdit
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
                _: 2
              }, _parent));
              _push(`</div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="mt-4 flex flex-wrap gap-3">`);
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              onClick: ($event) => startEdit(item)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Edit item`);
                } else {
                  return [
                    createTextVNode("Edit item")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(ssrRenderComponent(_component_UButton, {
              variant: "soft",
              size: "sm",
              color: "error",
              loading: unref(removingItemId) === item.id,
              onClick: ($event) => removeQuoteItem(group.draft_id, item.id)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Remove`);
                } else {
                  return [
                    createTextVNode("Remove")
                  ];
                }
              }),
              _: 2
            }, _parent));
            if (group.status === "draft") {
              _push(ssrRenderComponent(_component_UButton, {
                size: "sm",
                color: "primary",
                loading: unref(sendingItemId) === item.id,
                onClick: ($event) => sendSingleItem(group.draft_id, item.id, group.shop_name)
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Send this item `);
                  } else {
                    return [
                      createTextVNode(" Send this item ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`</div></article>`);
          });
          _push(`<!--]--></div><div class="mt-5 flex flex-wrap gap-3">`);
          if (group.can_submit) {
            _push(ssrRenderComponent(_component_UButton, {
              color: "primary",
              loading: unref(submittingDraftId) === group.draft_id,
              onClick: ($event) => submitShopQuote(group)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Submit Quote `);
                } else {
                  return [
                    createTextVNode(" Submit Quote ")
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
            to: `/shops/${group.shop_slug}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open shop`);
              } else {
                return [
                  createTextVNode("Open shop")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/QuoteBuilderPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$1, { __name: "QuotesQuoteBuilderPanel" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quote-draft",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const activityBadgesStore = useActivityBadgesStore();
    const quoteInboxStore = useQuoteInboxStore();
    const { sendSavedDraft } = useQuoteRequestBlast();
    const toast = useToast();
    const statusFilter = ref("pending");
    const availableShops = ref([]);
    const selectedDraftShopSlugs = ref({});
    const sendingDraftId = ref(null);
    const sentDraftSummaries = ref({});
    watchEffect(() => {
      if (!authStore.isClient && authStore.isAuthenticated) {
        navigateTo(getPostLoginRedirectPath(authStore.user, false));
      }
    });
    async function refreshWorkspace() {
      if (!authStore.isClient) return;
      await Promise.all([
        activityBadgesStore.fetchSummary(),
        quoteInboxStore.fetchDraftFiles("dashboard"),
        loadAvailableShops(),
        quoteInboxStore.fetchDrafts(),
        quoteInboxStore.fetchClientRequests()
      ]);
    }
    async function loadAvailableShops() {
      const shops = await listShops();
      availableShops.value = shops.map((shop) => ({ id: shop.id, name: shop.name, slug: shop.slug }));
    }
    const statusTabs = computed(() => [
      { label: "Pending", value: "pending", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "pending").length },
      { label: "Modified", value: "modified", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "modified").length },
      { label: "Accepted", value: "accepted", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "accepted").length },
      { label: "Rejected", value: "rejected", count: quoteInboxStore.clientRequests.filter((request) => request.response_status === "rejected").length },
      { label: "All", value: "all", count: quoteInboxStore.clientRequests.length }
    ]);
    const filteredRequests = computed(() => {
      if (statusFilter.value === "all") return quoteInboxStore.clientRequests;
      return quoteInboxStore.clientRequests.filter((request) => request.response_status === statusFilter.value);
    });
    function draftBadgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    function requestBadgeColor(status) {
      if (status === "accepted") return "success";
      if (status === "rejected") return "error";
      if (status === "modified") return "warning";
      return "neutral";
    }
    function draftProduction(draft) {
      return extractProductionDetails(draft.pricing_snapshot);
    }
    function draftPreviewTotal(draft) {
      return getPreviewMoney(draft.pricing_snapshot, "grand_total") || "Awaiting preview";
    }
    function defaultDraftShopSlugs(draft) {
      const snapshot = draft.request_details_snapshot ?? {};
      const fromSnapshot = Array.isArray(snapshot.selected_shop_slugs) ? snapshot.selected_shop_slugs.filter((value) => typeof value === "string") : [];
      if (fromSnapshot.length) return fromSnapshot;
      if (draft.shop_slug) return [draft.shop_slug];
      const fallbackShop = availableShops.value.find((shop) => shop.id === draft.shop);
      return fallbackShop ? [fallbackShop.slug] : [];
    }
    watch(
      () => [quoteInboxStore.drafts, availableShops.value],
      () => {
        const nextState = { ...selectedDraftShopSlugs.value };
        for (const draft of quoteInboxStore.drafts) {
          if (!nextState[draft.id]?.length) {
            nextState[draft.id] = defaultDraftShopSlugs(draft);
          }
        }
        selectedDraftShopSlugs.value = nextState;
      },
      { immediate: true, deep: true }
    );
    function toggleDraftShop(draftId, slug) {
      const current = selectedDraftShopSlugs.value[draftId] ?? [];
      selectedDraftShopSlugs.value = {
        ...selectedDraftShopSlugs.value,
        [draftId]: current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug]
      };
    }
    function selectedDraftShopIds(draft) {
      return (selectedDraftShopSlugs.value[draft.id] ?? []).map((slug) => availableShops.value.find((shop) => shop.slug === slug)?.id ?? null).filter((value) => typeof value === "number");
    }
    async function sendSavedDraftRequest(draft) {
      if (draft.status !== "draft") return;
      const shopIds = selectedDraftShopIds(draft);
      if (!shopIds.length) return;
      sendingDraftId.value = draft.id;
      try {
        const requests = await sendSavedDraft(
          draft.id,
          shopIds,
          {
            ...draft.request_details_snapshot ?? {},
            selected_shop_slugs: selectedDraftShopSlugs.value[draft.id] ?? [],
            selected_shop_ids: shopIds
          }
        );
        if (requests?.length) {
          sentDraftSummaries.value = {
            ...sentDraftSummaries.value,
            [draft.id]: buildQuoteRequestSendSummary(requests)
          };
          const successToast = getQuoteRequestSendToast(sentDraftSummaries.value[draft.id] ?? null);
          toast.add({ title: successToast.title, description: successToast.description, color: "success" });
          await refreshWorkspace();
        }
      } catch (error) {
        toast.add({ title: "Error", description: error instanceof Error ? error.message : "Could not send this draft.", color: "error" });
      } finally {
        sendingDraftId.value = null;
      }
    }
    function draftSendLabel(draft) {
      const sharedLabel = getQuoteRequestSendLabel(sentDraftSummaries.value[draft.id] ?? null, sendingDraftId.value === draft.id);
      if (sharedLabel) return sharedLabel;
      return draft.status === "draft" ? "Send request to selected shops" : "Request already sent";
    }
    function formatRequestDate(value) {
      if (!value) return "Recently";
      try {
        return new Intl.DateTimeFormat("en-KE", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit"
        }).format(new Date(value));
      } catch {
        return value;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_QuotesQuoteBuilderPanel = __nuxt_component_0;
      const _component_QuotesCalculatorHub = __nuxt_component_1;
      const _component_QuotesBackendQuoteCalculator = __nuxt_component_2;
      const _component_QuotesBookletCalculator = __nuxt_component_3;
      const _component_QuotesLargeFormatCalculator = __nuxt_component_4;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[var(--p-surface)]" }, _attrs))}><main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_QuotesQuoteBuilderPanel, null, null, _parent));
      _push(ssrRenderComponent(_component_QuotesCalculatorHub, null, {
        flat: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_QuotesBackendQuoteCalculator, {
              title: "Requests & quotes workspace",
              description: "Build a request, send it to shops, and come back here to track replies, quotes, and next steps.",
              eyebrow: "Client Workspace",
              mode: "client",
              onDraftSaved: refreshWorkspace,
              onDraftSent: refreshWorkspace
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_QuotesBackendQuoteCalculator, {
                title: "Requests & quotes workspace",
                description: "Build a request, send it to shops, and come back here to track replies, quotes, and next steps.",
                eyebrow: "Client Workspace",
                mode: "client",
                onDraftSaved: refreshWorkspace,
                onDraftSent: refreshWorkspace
              })
            ];
          }
        }),
        booklet: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_QuotesBookletCalculator, {
              title: "Booklet requests & quotes workspace",
              description: "Build a booklet request, save it into your workspace, and keep tracking replies and quotes here.",
              eyebrow: "Client Workspace"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_QuotesBookletCalculator, {
                title: "Booklet requests & quotes workspace",
                description: "Build a booklet request, save it into your workspace, and keep tracking replies and quotes here.",
                eyebrow: "Client Workspace"
              })
            ];
          }
        }),
        large_format: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_QuotesLargeFormatCalculator, {
              title: "Large-format requests & quotes workspace",
              description: "Build a large-format request, save it into your workspace, and keep tracking replies and quotes here.",
              eyebrow: "Client Workspace"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_QuotesLargeFormatCalculator, {
                title: "Large-format requests & quotes workspace",
                description: "Build a large-format request, save it into your workspace, and keep tracking replies and quotes here.",
                eyebrow: "Client Workspace"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved quotes</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Saved quote snapshots</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]">These snapshot drafts still work, but your main quote-builder view now lives above.</p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshWorkspace
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(3, (index) => {
          _push(`<div class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(quoteInboxStore).drafts.length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No saved drafts yet. Start a request above and it will appear here until you send it. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(quoteInboxStore).drafts, (draft) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(draft.title || draft.draft_reference || `Draft #${draft.id}`)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(draft.request_details_snapshot?.customer_name || "No customer name yet")}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: draftBadgeColor(draft.status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(draft.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(draft.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(draft.shop_name || draft.shop_slug || "Unassigned")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Preview total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(draftPreviewTotal(draft))}</p></div></div>`);
          if (draftProduction(draft).piecesPerSheet || draftProduction(draft).sheetsNeeded) {
            _push(`<div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Pcs per sheet</p><p class="mt-2 text-lg font-extrabold text-[var(--p-text)]">${ssrInterpolate(draftProduction(draft).piecesPerSheet)}</p></div><div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Sheets needed</p><p class="mt-2 text-lg font-extrabold text-flamingo-600">${ssrInterpolate(draftProduction(draft).sheetsNeeded)}</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(availableShops).length) {
            _push(`<div class="mt-4 space-y-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Selected shops</p>`);
            _push(ssrRenderComponent(QuotesShopSelectionChips, {
              shops: unref(availableShops).map((shop) => ({ slug: shop.slug, label: shop.name })),
              "selected-slugs": unref(selectedDraftShopSlugs)[draft.id] ?? [],
              onToggle: ($event) => toggleDraftShop(draft.id, $event)
            }, null, _parent));
            _push(ssrRenderComponent(_component_UButton, {
              size: "sm",
              color: "primary",
              loading: unref(sendingDraftId) === draft.id,
              disabled: draft.status !== "draft" || !selectedDraftShopIds(draft).length,
              onClick: ($event) => sendSavedDraftRequest(draft)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(draftSendLabel(draft))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(draftSendLabel(draft)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section><section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Tracking</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Requests and received quotes</h2><p class="mt-2 text-sm text-[var(--p-text-muted)]"> After you send a request, this is where you follow shop replies, received quotes, and final outcomes. </p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        to: "/quotes"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Open full request list`);
          } else {
            return [
              createTextVNode("Open full request list")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        loading: unref(quoteInboxStore).loading,
        onClick: refreshWorkspace
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Refresh`);
          } else {
            return [
              createTextVNode("Refresh")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-5 grid gap-3 md:grid-cols-3"><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">New Quotes</p><p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(activityBadgesStore).summary.client.new_quotes)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Fresh quotes sent by shops.</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop Replies</p><p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(activityBadgesStore).summary.client.shop_replies)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Requests waiting for your answer.</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Request Updates</p><p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">${ssrInterpolate(unref(activityBadgesStore).summary.client.request_updates)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">Declines or other request changes.</p></article></div><div class="mt-5 flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(unref(statusTabs), (tab) => {
        _push(ssrRenderComponent(_component_UButton, {
          key: tab.value,
          variant: unref(statusFilter) === tab.value ? "solid" : "soft",
          color: unref(statusFilter) === tab.value ? "primary" : "neutral",
          onClick: ($event) => statusFilter.value = tab.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tab.label)} <span class="ml-1 opacity-75"${_scopeId}>${ssrInterpolate(tab.count)}</span>`);
            } else {
              return [
                createTextVNode(toDisplayString(tab.label) + " ", 1),
                createVNode("span", { class: "ml-1 opacity-75" }, toDisplayString(tab.count), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(quoteInboxStore).loading && !unref(quoteInboxStore).clientRequests.length) {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(4, (index) => {
          _push(`<div class="h-40 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(filteredRequests).length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"> No requests in this status yet. </div>`);
      } else {
        _push(`<div class="mt-6 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(unref(filteredRequests), (request) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.shop_name)}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(request.customer_name || "No customer name")}</p></div>`);
          _push(ssrRenderComponent(_component_UBadge, {
            variant: "soft",
            color: requestBadgeColor(request.response_status)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(request.response_status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(request.response_status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p><p class="mt-2 text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(request.latest_response?.total || request.latest_sent_quote?.total || "Awaiting shop response")}</p></div><div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p><p class="mt-2 text-sm text-[var(--p-text)]">${ssrInterpolate(request.latest_sent_quote?.human_ready_text || (request.latest_sent_quote?.turnaround_hours ? `${request.latest_sent_quote.turnaround_hours} working hour(s)` : "On request"))}</p></div></div><div class="mt-4 flex items-center justify-between gap-3"><p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(formatRequestDate(request.updated_at || request.created_at))}</p>`);
          _push(ssrRenderComponent(_component_UButton, {
            variant: "soft",
            to: `/quotes/${request.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Open request`);
              } else {
                return [
                  createTextVNode("Open request")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quote-draft.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=quote-draft-D9yunikx.mjs.map
