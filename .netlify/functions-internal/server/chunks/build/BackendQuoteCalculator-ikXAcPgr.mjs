import { j as useToast, k as useNuxtApp, A as API, d as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-C6Eyp_GI.mjs';
import { _ as _sfc_main$3 } from './Input-C14QBOm-.mjs';
import { _ as _sfc_main$4 } from './Checkbox-S5HrhTVg.mjs';
import { _ as _sfc_main$5 } from './Textarea-C3ixaFu9.mjs';
import { _ as _sfc_main$6 } from './Badge-DRRvJchD.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, isRef, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { n as normalizeNumberValue, a as normalizeOptionalText, b as normalizeSelectValue } from './payload-B09QCjlG.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalculationBreakdownCard",
  __ssrInlineRender: true,
  props: {
    preview: {}
  },
  setup(__props) {
    const props = __props;
    const totalLabel = computed(() => props.preview?.totals?.grand_total || props.preview?.total || "Awaiting preview");
    function isLamination(line) {
      const name = `${line.slug || ""} ${line.name || ""}`.toLowerCase();
      return name.includes("lamination");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UBadge = _sfc_main$6;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm" }, _attrs))}><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Backend Preview</p><h3 class="mt-2 text-xl font-semibold text-[var(--p-text)]">${ssrInterpolate(unref(totalLabel))}</h3>`);
      if (__props.preview?.reason) {
        _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.preview.reason)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UBadge, {
        color: __props.preview?.can_calculate === false ? "warning" : "success",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.preview?.can_calculate === false ? "Needs attention" : "Ready")}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.preview?.can_calculate === false ? "Needs attention" : "Ready"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (__props.preview?.paper || __props.preview?.printing || __props.preview?.totals) {
        _push(`<div class="mt-5 grid gap-3 md:grid-cols-3"><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Paper</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(__props.preview?.paper?.label || "Not selected")}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.preview?.totals?.paper_cost || "0")}</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Printing</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(__props.preview?.printing?.machine_name || "Not selected")}</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.preview?.totals?.print_cost || "0")}</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Imposition</p><p class="mt-2 text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(__props.preview?.copies_per_sheet ?? 0)} up</p><p class="mt-1 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.preview?.good_sheets ?? 0)} good sheets</p></article></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.preview?.finishings?.length) {
        _push(`<div class="mt-5 space-y-3"><h4 class="text-sm font-semibold text-[var(--p-text)]">Finishing Breakdown</h4><!--[-->`);
        ssrRenderList(__props.preview.finishings, (line) => {
          _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(line.name)}</p><p class="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(line.billing_basis)} · ${ssrInterpolate(line.side_mode)}</p>`);
          if (isLamination(line)) {
            _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(__props.preview.good_sheets || 0)} good sheets × ${ssrInterpolate(line.rate || "0")} × ${ssrInterpolate(line.selected_side_count || 1)} side(s) </p>`);
          } else {
            _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(line.units || 1)} unit(s) × ${ssrInterpolate(line.rate || "0")}</p>`);
          }
          _push(`</div><p class="text-sm font-semibold text-[var(--p-text)]">${ssrInterpolate(line.total)}</p></div></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.preview?.suggestions?.length) {
        _push(`<div class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><p class="text-sm font-semibold text-[var(--p-text)]">Suggestions</p><!--[-->`);
        ssrRenderList(__props.preview.suggestions, (suggestion) => {
          _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(suggestion.message)}</p>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/CalculationBreakdownCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$1, { __name: "QuotesCalculationBreakdownCard" });
function useAnchoredForm() {
  function scrollToAnchor(anchorId, focusSelector) {
    return;
  }
  function scrollToFirstInvalid(formRoot) {
    return;
  }
  return {
    scrollToAnchor,
    scrollToFirstInvalid
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BackendQuoteCalculator",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: { default: "Quote Calculator" },
    mode: { default: "client" },
    fixedShopSlug: { default: null },
    anchorId: { default: "quote-calculator" }
  },
  emits: ["draftSaved", "draftSent"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const authStore = useAuthStore();
    useShopStore();
    const calculatorStore = useCalculatorStore();
    const quoteInboxStore = useQuoteInboxStore();
    const { scrollToFirstInvalid } = useAnchoredForm();
    const toast = useToast();
    const formRef = ref(null);
    const contactName = ref("");
    const contactPhone = ref("");
    const notes = ref("");
    const selectedShopSlug = ref(props.fixedShopSlug ?? null);
    const selectedProductId = ref(null);
    const selectedPaperId = ref(null);
    const selectedMachineId = ref(null);
    const quantity = ref(100);
    const sides = ref("SIMPLEX");
    const selectedFinishings = ref([]);
    const shopOptions = ref([]);
    const productOptions = ref([]);
    const paperOptions = ref([]);
    const machineOptions = ref([]);
    const finishingOptions = ref([]);
    const activeShopId = ref(null);
    const allowShopSelection = computed(() => !props.fixedShopSlug);
    const sidesOptions = [
      { label: "Front only", value: "SIMPLEX" },
      { label: "Both sides", value: "DUPLEX" }
    ];
    const laminationSides = [
      { label: "Front only", value: "front" },
      { label: "Back only", value: "back" },
      { label: "Both sides", value: "both" }
    ];
    watch(selectedShopSlug, async (slug) => {
      if (!slug) return;
      await loadShopResources(slug);
    }, { immediate: true });
    watch(selectedProductId, async (productId) => {
      if (!productId) return;
      await loadProductOptions(productId);
    }, { immediate: true });
    async function loadShopResources(shopSlug) {
      const { $publicApi } = useNuxtApp();
      const catalogResponse = await $publicApi(
        API.publicShopCatalog(shopSlug)
      );
      activeShopId.value = catalogResponse.shop.id;
      productOptions.value = catalogResponse.products.map((product) => ({ label: product.name, value: product.id }));
      if (!selectedProductId.value) {
        selectedProductId.value = productOptions.value[0]?.value ?? null;
      }
    }
    async function loadProductOptions(productId) {
      const { $publicApiNoAuth } = useNuxtApp();
      const detail = await $publicApiNoAuth(API.publicProductOptions(productId));
      paperOptions.value = (detail.available_papers ?? []).map((paper) => ({
        label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
        value: Number(paper.id)
      }));
      machineOptions.value = (detail.available_machines ?? []).map((machine) => ({
        label: String(machine.name),
        value: Number(machine.id)
      }));
      finishingOptions.value = detail.available_finishings ?? [];
      selectedPaperId.value = selectedPaperId.value ?? paperOptions.value[0]?.value ?? null;
      selectedMachineId.value = selectedMachineId.value ?? Number(detail.default_machine ?? machineOptions.value[0]?.value ?? null);
      sides.value = detail.default_sides === "DUPLEX" ? "DUPLEX" : "SIMPLEX";
    }
    function toggleFinishing(finishing) {
      const existing = selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishing.id);
      if (existing) {
        selectedFinishings.value = selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== finishing.id);
        return;
      }
      selectedFinishings.value = [
        ...selectedFinishings.value,
        {
          finishing_rate_id: Number(finishing.id),
          selected_side: isLamination(finishing) ? "both" : "both"
        }
      ];
    }
    function updateFinishingSide(finishingId, value) {
      const normalized = normalizeSelectValue(value) ?? "both";
      selectedFinishings.value = selectedFinishings.value.map(
        (entry) => entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry
      );
    }
    function selectedFinishingSide(finishingId) {
      return selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)?.selected_side ?? "both";
    }
    function isLamination(finishing) {
      return `${finishing.slug || ""} ${finishing.name || ""}`.toLowerCase().includes("lamination");
    }
    function validateForm() {
      return Boolean(activeShopId.value && selectedProductId.value && selectedPaperId.value && selectedMachineId.value && normalizeNumberValue(quantity.value));
    }
    async function previewQuote() {
      if (!validateForm()) {
        scrollToFirstInvalid(formRef.value);
        toast.add({ title: "Incomplete form", description: "Pick a shop, product, paper, machine, and quantity before previewing.", color: "warning" });
        return;
      }
      calculatorStore.setContext({
        shopId: activeShopId.value,
        shopSlug: selectedShopSlug.value,
        productId: selectedProductId.value,
        quantity: normalizeNumberValue(quantity.value) ?? 100,
        paperId: selectedPaperId.value,
        machineId: selectedMachineId.value,
        sides: sides.value,
        finishings: selectedFinishings.value
      });
      try {
        await calculatorStore.fetchPreview();
      } catch (error) {
        toast.add({ title: "Preview failed", description: error instanceof Error ? error.message : "Preview failed.", color: "error" });
      }
    }
    async function saveDraft() {
      if (!calculatorStore.preview) return;
      if (!authStore.isAuthenticated) {
        await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
        return;
      }
      if (!authStore.isClient) {
        toast.add({ title: "Preview only", description: "This backend draft flow is currently client-only.", color: "warning" });
        return;
      }
      const draft = await quoteInboxStore.saveDraft({
        title: contactName.value || "Saved draft",
        shop: activeShopId.value,
        selected_product: selectedProductId.value,
        calculator_inputs_snapshot: {
          quantity: normalizeNumberValue(quantity.value),
          paper: selectedPaperId.value,
          machine: selectedMachineId.value,
          sides: sides.value,
          finishings: selectedFinishings.value,
          notes: notes.value
        },
        pricing_snapshot: calculatorStore.preview,
        request_details_snapshot: {
          customer_name: normalizeOptionalText(contactName.value),
          customer_phone: normalizeOptionalText(contactPhone.value),
          notes: normalizeOptionalText(notes.value)
        }
      });
      emit("draftSaved", draft);
      toast.add({ title: "Draft saved", description: "The backend stored this quote draft.", color: "success" });
    }
    async function sendDraft() {
      if (!calculatorStore.preview) return;
      if (!authStore.isAuthenticated) {
        await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
        return;
      }
      if (!authStore.isClient) {
        toast.add({ title: "Preview only", description: "Sending backend drafts is currently client-only.", color: "warning" });
        return;
      }
      const draft = await quoteInboxStore.saveDraft({
        title: contactName.value || "Prepared quote",
        shop: activeShopId.value,
        selected_product: selectedProductId.value,
        calculator_inputs_snapshot: {
          quantity: normalizeNumberValue(quantity.value),
          paper: selectedPaperId.value,
          machine: selectedMachineId.value,
          sides: sides.value,
          finishings: selectedFinishings.value,
          notes: notes.value
        },
        pricing_snapshot: calculatorStore.preview,
        request_details_snapshot: {
          customer_name: normalizeOptionalText(contactName.value),
          customer_phone: normalizeOptionalText(contactPhone.value),
          notes: normalizeOptionalText(notes.value)
        }
      });
      const requests = await quoteInboxStore.sendDraft(draft.id, activeShopId.value ? [activeShopId.value] : [], {
        customer_name: normalizeOptionalText(contactName.value),
        customer_phone: normalizeOptionalText(contactPhone.value),
        notes: normalizeOptionalText(notes.value)
      });
      emit("draftSent", requests);
      toast.add({ title: "Quote request sent", description: "The backend created quote requests from this draft.", color: "success" });
    }
    async function copyPreview() {
      const text = [
        `Total: ${calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || ""}`,
        `Paper: ${calculatorStore.preview?.paper?.label || ""}`,
        `Printing: ${calculatorStore.preview?.printing?.machine_name || ""}`
      ].join("\n");
      await (void 0).clipboard.writeText(text);
      toast.add({ title: "Copied", description: "Preview copied to the clipboard.", color: "success" });
    }
    function shareWhatsApp() {
      const total = calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || "";
      const text = encodeURIComponent(`Quote preview
Customer: ${contactName.value || "-"}
Phone: ${contactPhone.value || "-"}
Total: ${total}`);
      (void 0).open(`https://wa.me/?text=${text}`, "_blank", "noopener");
    }
    function printPreview() {
      (void 0).print();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      const _component_USelectMenu = _sfc_main$2;
      const _component_UInput = _sfc_main$3;
      const _component_UCheckbox = _sfc_main$4;
      const _component_UTextarea = _sfc_main$5;
      const _component_QuotesCalculationBreakdownCard = __nuxt_component_5;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: __props.anchorId,
        class: "rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"
      }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">${ssrInterpolate(__props.eyebrow)}</p><h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">${ssrInterpolate(__props.title)}</h2><p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--p-text-muted)]">${ssrInterpolate(__props.description)}</p></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        loading: unref(calculatorStore).previewLoading,
        onClick: previewQuote
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Preview`);
          } else {
            return [
              createTextVNode("Preview")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: !unref(calculatorStore).preview,
        onClick: saveDraft
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Save draft`);
          } else {
            return [
              createTextVNode("Save draft")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: !unref(calculatorStore).preview,
        onClick: sendDraft
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Send to shop`);
          } else {
            return [
              createTextVNode("Send to shop")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: !unref(calculatorStore).preview,
        onClick: copyPreview
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Copy`);
          } else {
            return [
              createTextVNode("Copy")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: !unref(calculatorStore).preview,
        onClick: shareWhatsApp
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`WhatsApp`);
          } else {
            return [
              createTextVNode("WhatsApp")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        variant: "soft",
        disabled: !unref(calculatorStore).preview,
        onClick: printPreview
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`PDF`);
          } else {
            return [
              createTextVNode("PDF")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><form class="space-y-6"><div class="grid gap-4 md:grid-cols-2">`);
      if (unref(allowShopSelection)) {
        _push(`<label class="space-y-2 md:col-span-2"><span class="text-sm font-medium text-[var(--p-text)]">Shop</span>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(selectedShopSlug),
          "onUpdate:modelValue": ($event) => isRef(selectedShopSlug) ? selectedShopSlug.value = $event : null,
          items: unref(shopOptions),
          "value-key": "value",
          "label-key": "label",
          class: "w-full",
          portal: "body"
        }, null, _parent));
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Enquirer</span>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(contactName),
        "onUpdate:modelValue": ($event) => isRef(contactName) ? contactName.value = $event : null,
        placeholder: "Client or company name"
      }, null, _parent));
      _push(`</label><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Phone / contact</span>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(contactPhone),
        "onUpdate:modelValue": ($event) => isRef(contactPhone) ? contactPhone.value = $event : null,
        placeholder: "+254..."
      }, null, _parent));
      _push(`</label><label class="space-y-2 md:col-span-2"><span class="text-sm font-medium text-[var(--p-text)]">Product</span>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(selectedProductId),
        "onUpdate:modelValue": ($event) => isRef(selectedProductId) ? selectedProductId.value = $event : null,
        items: unref(productOptions),
        "value-key": "value",
        "label-key": "label",
        class: "w-full",
        portal: "body"
      }, null, _parent));
      _push(`</label><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Quantity</span>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(quantity),
        "onUpdate:modelValue": ($event) => isRef(quantity) ? quantity.value = $event : null,
        type: "number",
        min: "1"
      }, null, _parent));
      _push(`</label><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Sides</span>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(sides),
        "onUpdate:modelValue": ($event) => isRef(sides) ? sides.value = $event : null,
        items: sidesOptions,
        "value-key": "value",
        "label-key": "label",
        portal: "body",
        class: "w-full"
      }, null, _parent));
      _push(`</label><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Paper</span>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(selectedPaperId),
        "onUpdate:modelValue": ($event) => isRef(selectedPaperId) ? selectedPaperId.value = $event : null,
        items: unref(paperOptions),
        "value-key": "value",
        "label-key": "label",
        portal: "body",
        class: "w-full"
      }, null, _parent));
      _push(`</label><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Machine</span>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(selectedMachineId),
        "onUpdate:modelValue": ($event) => isRef(selectedMachineId) ? selectedMachineId.value = $event : null,
        items: unref(machineOptions),
        "value-key": "value",
        "label-key": "label",
        portal: "body",
        class: "w-full"
      }, null, _parent));
      _push(`</label></div><div class="space-y-3"><div class="flex items-center justify-between gap-3"><div><p class="text-sm font-medium text-[var(--p-text)]">Finishing</p><p class="text-sm text-[var(--p-text-muted)]">Use backend finishing rules. Lamination stays per sheet per side.</p></div></div><div class="grid gap-3 md:grid-cols-2"><!--[-->`);
      ssrRenderList(unref(finishingOptions), (finishing) => {
        _push(`<article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"><label class="flex items-start gap-3">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          "model-value": unref(selectedFinishings).some((entry) => entry.finishing_rate_id === finishing.id),
          "onUpdate:modelValue": ($event) => toggleFinishing(finishing)
        }, null, _parent));
        _push(`<div class="min-w-0"><p class="text-sm font-medium text-[var(--p-text)]">${ssrInterpolate(finishing.name)}</p><p class="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">${ssrInterpolate(finishing.billing_basis || finishing.charge_unit || "backend rule")}</p>`);
        if (finishing.help_text || finishing.display_unit_label) {
          _push(`<p class="mt-2 text-sm text-[var(--p-text-muted)]">${ssrInterpolate(finishing.help_text || finishing.display_unit_label)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></label>`);
        if (unref(selectedFinishings).some((entry) => entry.finishing_rate_id === finishing.id) && isLamination(finishing)) {
          _push(`<div class="mt-3">`);
          _push(ssrRenderComponent(_component_USelectMenu, {
            "model-value": selectedFinishingSide(finishing.id),
            items: laminationSides,
            "value-key": "value",
            "label-key": "label",
            portal: "body",
            class: "w-full",
            "onUpdate:modelValue": ($event) => updateFinishingSide(finishing.id, $event)
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div></div><label class="space-y-2"><span class="text-sm font-medium text-[var(--p-text)]">Notes</span>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(notes),
        "onUpdate:modelValue": ($event) => isRef(notes) ? notes.value = $event : null,
        rows: 4,
        placeholder: "Turnaround, delivery notes, or customer context"
      }, null, _parent));
      _push(`</label></form>`);
      _push(ssrRenderComponent(_component_QuotesCalculationBreakdownCard, {
        preview: unref(calculatorStore).preview
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/BackendQuoteCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "QuotesBackendQuoteCalculator" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=BackendQuoteCalculator-ikXAcPgr.mjs.map
