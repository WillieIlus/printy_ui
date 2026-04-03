import { _ as _sfc_main$1 } from './SelectMenu-D3Bra_sq.mjs';
import { _ as _sfc_main$2 } from './Input-Hudv-7BP.mjs';
import { d as useAuthStore, e as useToast, m as useNuxtApp, a as _sfc_main$f, A as API, n as navigateTo } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, createSlots, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, isRef, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { s as sizePresets, g as getPreviewMoney, f as formatSizeSummary, C as CalculatorShell, b as CalculatorTypeSwitcher, Q as QuotePreviewPanel, d as QuotePreviewMeta, e as QuotePreviewRequirementsState, h as CalculatorFormGrid, i as CalculatorFieldGroup, j as calculatorSelectUi, k as CalculatorHeaderBlock, o as getSizePreset, m as convertInputToMm, n as convertMmToDisplay, l as inferSizePresetLabel } from './calculationResult-SiwRgRTu.mjs';
import { g as getCatalog, a as getShopCustomOptions } from './public-BVuVnl0E.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BookletCalculator",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: { default: "Booklet Calculator" },
    fixedShopSlug: { default: null },
    fixedShopName: { default: null },
    anchorId: { default: "booklet-calculator" },
    compact: { type: Boolean, default: false },
    calculatorType: { default: null },
    calculatorTypeOptions: { default: () => [] },
    calculatorSwitcherPlacement: { default: "header" }
  },
  emits: ["update:calculatorType"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectUi = calculatorSelectUi;
    const inputUi = { base: "w-full px-4 text-sm" };
    const authStore = useAuthStore();
    const toast = useToast();
    const { $api } = useNuxtApp();
    const showEmbeddedCalculatorTypes = computed(() => Boolean(props.calculatorType && props.calculatorTypeOptions.length));
    const showHeaderContent = computed(() => Boolean(props.eyebrow || props.title || props.description));
    const showHeaderSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === "header");
    const showPreviewSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === "preview");
    const shopOptions = ref([]);
    const selectedShopSlug = ref(props.fixedShopSlug);
    const selectedShopName = ref(props.fixedShopName || "");
    const selectedShopId = ref(null);
    const paperOptions = ref([]);
    const finishingOptions = ref([]);
    const sizeMode = ref("standard");
    const sizeLabel = ref("A5");
    const inputUnit = ref("mm");
    const widthInput = ref("");
    const heightInput = ref("");
    const widthMm = ref(148);
    const heightMm = ref(210);
    const quantity = ref(100);
    const totalPages = ref(12);
    const selectedCoverPaperId = ref(null);
    const selectedInsertPaperId = ref(null);
    const coverSides = ref("DUPLEX");
    const insertSides = ref("DUPLEX");
    const coverColorMode = ref("COLOR");
    const insertColorMode = ref("COLOR");
    const coverLaminationMode = ref("none");
    const bindingType = ref("saddle_stitch");
    const turnaroundHours = ref(24);
    const preview = ref(null);
    const previewLoading = ref(false);
    const savingDraft = ref(false);
    const sizeModeOptions = [{ label: "Standard size", value: "standard" }, { label: "Custom size", value: "custom" }];
    const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }));
    const sizeUnitOptions = [{ label: "mm", value: "mm" }, { label: "cm", value: "cm" }, { label: "m", value: "m" }, { label: "inches", value: "in" }];
    const sidesOptions = [{ label: "Front only", value: "SIMPLEX" }, { label: "Both sides", value: "DUPLEX" }];
    const colorModeOptions = [{ label: "Black and white", value: "BW" }, { label: "Full colour", value: "COLOR" }];
    const laminationModeOptions = [{ label: "No lamination", value: "none" }, { label: "Front only", value: "front" }, { label: "Both sides", value: "both" }];
    const bindingTypeOptions = [{ label: "Saddle stitch", value: "saddle_stitch" }, { label: "Perfect bind", value: "perfect_bind" }, { label: "Wire-O", value: "wire_o" }];
    const laminationOptions = computed(() => finishingOptions.value.filter((option) => haystack(option).includes("lamination")));
    const bindingOptions = computed(() => finishingOptions.value.filter((option) => {
      const text = haystack(option);
      return text.includes("bind") || text.includes("wire") || text.includes("stitch");
    }));
    const selectedLaminationRateId = computed(() => {
      if (coverLaminationMode.value === "none") return null;
      return laminationOptions.value[0]?.id ?? null;
    });
    const selectedBindingRateId = computed(() => {
      const tokens = {
        saddle_stitch: ["saddle", "stitch"],
        perfect_bind: ["perfect", "bind"],
        wire_o: ["wire", "wire-o", "wireo"]
      }[bindingType.value];
      return bindingOptions.value.find((option) => tokens.some((token) => haystack(option).includes(token)))?.id ?? null;
    });
    const previewGrandTotal = computed(() => getPreviewMoney(preview.value, "grand_total") || "Awaiting preview");
    const canPreview = computed(() => Boolean(
      selectedShopId.value && widthMm.value && heightMm.value && quantity.value > 0 && totalPages.value >= 4 && selectedCoverPaperId.value && selectedInsertPaperId.value && selectedBindingRateId.value && (coverLaminationMode.value === "none" || selectedLaminationRateId.value)
    ));
    const missingItems = computed(() => {
      const items = [];
      if (!selectedShopId.value) items.push("Choose a shop");
      if (!widthMm.value || !heightMm.value) items.push("Set the finished size");
      if (!selectedCoverPaperId.value) items.push("Choose a cover stock");
      if (!selectedInsertPaperId.value) items.push("Choose an insert stock");
      if (!selectedBindingRateId.value) items.push("This shop needs a binding rate for the selected binding type");
      if (coverLaminationMode.value !== "none" && !selectedLaminationRateId.value) items.push("This shop needs an active lamination rate");
      return items;
    });
    const summaryLines = computed(() => [
      { label: "Shop", value: selectedShopName.value || "" },
      { label: "Finished size", value: formatSizeSummary(widthMm.value, heightMm.value, sizeLabel.value || null) || "" },
      { label: "Quantity", value: `${quantity.value} booklet(s)` },
      { label: "Total pages", value: `${totalPages.value} total page(s)` }
    ]);
    const previewTotalPerBooklet = computed(() => {
      const totals = preview.value?.totals;
      return totals?.total_per_booklet || totals?.unit_price || "Awaiting preview";
    });
    const coverSummary = computed(() => {
      const section = preview.value?.breakdown?.cover;
      const paper = section?.paper;
      const totals = section?.totals;
      return `Stock: ${String(paper?.label || "Not priced")} | Printing: ${String(totals?.print_cost || "0.00")} | Lamination: ${String(totals?.finishing_total || "0.00")} | Subtotal: ${String(totals?.subtotal || "0.00")}`;
    });
    const insertSummary = computed(() => {
      const section = preview.value?.breakdown?.inserts;
      const paper = section?.paper;
      const totals = section?.totals;
      const booklet = preview.value?.breakdown?.booklet;
      return `Stock: ${String(paper?.label || "Not priced")} | Printing: ${String(totals?.print_cost || "0.00")} | ${String(booklet?.insert_sheets_per_booklet || 0)} insert sheet(s) per booklet | Subtotal: ${String(totals?.subtotal || "0.00")}`;
    });
    const bindingSummary = computed(() => {
      const section = preview.value?.breakdown?.binding;
      return `${String(section?.label || "Binding")} | Total: ${String(section?.total || "0.00")}`;
    });
    const turnaroundSummary = computed(() => `${preview.value?.turnaround_text || "On request"} | ${preview.value?.human_ready_text || "Ready on request"}`);
    watch(selectedShopSlug, async (slug) => {
      preview.value = null;
      if (!slug) return;
      await loadShopContext(slug);
    }, { immediate: true });
    async function loadShopContext(shopSlug) {
      const shop = shopOptions.value.find((entry) => entry.value === shopSlug);
      selectedShopId.value = shop?.id ?? null;
      selectedShopName.value = props.fixedShopName || shop?.label || shopSlug;
      const [catalog, options] = await Promise.all([getCatalog(shopSlug), getShopCustomOptions(shopSlug)]);
      if (!selectedShopId.value && catalog?.shop?.id) selectedShopId.value = catalog.shop.id;
      paperOptions.value = (options.available_papers ?? []).map((paper) => ({ value: paper.id, label: `${paper.sheet_size} ${paper.gsm}gsm ${paper.paper_type}` }));
      finishingOptions.value = normalizeFinishings(options);
      if (!selectedCoverPaperId.value && paperOptions.value.length) selectedCoverPaperId.value = paperOptions.value[0].value;
      if (!selectedInsertPaperId.value && paperOptions.value.length) selectedInsertPaperId.value = paperOptions.value[0].value;
    }
    function normalizeFinishings(options) {
      return (options.available_finishings ?? []).map((finishing) => ({
        id: finishing.id,
        name: finishing.name,
        slug: finishing.slug,
        category: finishing.category,
        price: finishing.price
      }));
    }
    function resetBookletForm() {
      quantity.value = 100;
      totalPages.value = 12;
      bindingType.value = "saddle_stitch";
      turnaroundHours.value = 24;
      coverSides.value = "DUPLEX";
      insertSides.value = "DUPLEX";
      coverColorMode.value = "COLOR";
      insertColorMode.value = "COLOR";
      coverLaminationMode.value = "none";
      sizeMode.value = "standard";
      sizeLabel.value = "A5";
      inputUnit.value = "mm";
      widthMm.value = 148;
      heightMm.value = 210;
      widthInput.value = "";
      heightInput.value = "";
      syncPresetToInputs();
      selectedCoverPaperId.value = paperOptions.value[0]?.value ?? null;
      selectedInsertPaperId.value = paperOptions.value[0]?.value ?? null;
      preview.value = null;
    }
    function haystack(option) {
      return `${option.name || ""} ${option.slug || ""} ${option.category || ""}`.trim().toLowerCase();
    }
    function normalizeNumber(value, minimum = 0) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return null;
      return Math.max(minimum, Math.round(parsed));
    }
    function normalizeInteger(value, minimum) {
      return normalizeNumber(value, minimum) ?? minimum;
    }
    function normalizeStringValue(value) {
      if (typeof value === "string" && value.trim()) return value;
      return null;
    }
    function handleSizeModeChange(value) {
      sizeMode.value = normalizeStringValue(value) ?? "standard";
      if (sizeMode.value === "standard" && !sizeLabel.value) sizeLabel.value = "A5";
      syncPresetToInputs();
    }
    function handleSizePresetChange(value) {
      sizeLabel.value = normalizeStringValue(value) || "A5";
      const preset = getSizePreset(sizeLabel.value);
      if (!preset) return;
      widthMm.value = preset.widthMm;
      heightMm.value = preset.heightMm;
      syncPresetToInputs();
    }
    function handleInputUnitChange(value) {
      const normalized = normalizeStringValue(value);
      if (!normalized || !["mm", "cm", "m", "in"].includes(normalized)) return;
      inputUnit.value = normalized;
      syncPresetToInputs();
    }
    function handleWidthChange(value) {
      widthInput.value = value == null ? "" : String(value);
      widthMm.value = convertInputToMm(widthInput.value, inputUnit.value);
    }
    function handleHeightChange(value) {
      heightInput.value = value == null ? "" : String(value);
      heightMm.value = convertInputToMm(heightInput.value, inputUnit.value);
    }
    function syncPresetToInputs() {
      if (sizeMode.value === "standard") {
        const preset = getSizePreset(sizeLabel.value || "A5");
        if (preset) {
          widthMm.value = preset.widthMm;
          heightMm.value = preset.heightMm;
        }
      }
      widthInput.value = convertMmToDisplay(widthMm.value, inputUnit.value);
      heightInput.value = convertMmToDisplay(heightMm.value, inputUnit.value);
      if (sizeMode.value === "standard") {
        const inferred = inferSizePresetLabel(widthMm.value, heightMm.value);
        if (inferred) sizeLabel.value = inferred;
      }
    }
    function buildPreviewPayload() {
      return {
        shop: selectedShopId.value,
        quantity: quantity.value,
        total_pages: totalPages.value,
        binding_type: bindingType.value,
        cover_paper: selectedCoverPaperId.value,
        insert_paper: selectedInsertPaperId.value,
        cover_sides: coverSides.value,
        insert_sides: insertSides.value,
        cover_color_mode: coverColorMode.value,
        insert_color_mode: insertColorMode.value,
        cover_lamination_mode: coverLaminationMode.value,
        cover_lamination_finishing_rate: selectedLaminationRateId.value,
        binding_finishing_rate: selectedBindingRateId.value,
        turnaround_hours: turnaroundHours.value,
        size_mode: sizeMode.value,
        size_label: sizeLabel.value,
        input_unit: inputUnit.value,
        width_input: widthInput.value,
        height_input: heightInput.value,
        width_mm: widthMm.value,
        height_mm: heightMm.value
      };
    }
    async function previewBooklet() {
      if (!canPreview.value) return;
      previewLoading.value = true;
      try {
        preview.value = await $api(API.calculatorBookletPreview(), {
          method: "POST",
          body: buildPreviewPayload()
        });
      } catch (error) {
        toast.add({ title: "Preview failed", description: error instanceof Error ? error.message : "Could not price this booklet yet.", color: "error" });
      } finally {
        previewLoading.value = false;
      }
    }
    async function saveDraft() {
      if (!preview.value || !selectedShopId.value) return;
      if (!authStore.isAuthenticated) {
        await navigateTo({ path: "/auth/login", query: { redirect: "/quote-draft" } });
        return;
      }
      savingDraft.value = true;
      try {
        await $api(API.calculatorDrafts(), {
          method: "POST",
          body: {
            title: `Booklet - ${sizeLabel.value || formatSizeSummary(widthMm.value, heightMm.value, null)}`,
            shop: selectedShopId.value,
            calculator_inputs_snapshot: {
              quote_type: "booklet",
              ...buildPreviewPayload()
            },
            pricing_snapshot: preview.value,
            custom_product_snapshot: {
              quote_type: "booklet",
              title: "Booklet job",
              spec_text: `${totalPages.value} pages, ${bindingType.value}`
            },
            request_details_snapshot: {
              source: "booklet_calculator",
              selected_shop_slug: selectedShopSlug.value
            }
          }
        });
        toast.add({ title: "Saved to workspace", description: "This booklet preview is now stored in your requests and quotes workspace.", color: "success" });
      } catch (error) {
        toast.add({ title: "Could not save draft", description: error instanceof Error ? error.message : "Save failed.", color: "error" });
      } finally {
        savingDraft.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UIcon = _sfc_main$f;
      _push(ssrRenderComponent(CalculatorShell, mergeProps({ "anchor-id": __props.anchorId }, _attrs), createSlots({
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(CalculatorFormGrid, { onSubmit: previewBooklet }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<section class="space-y-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId2}>1. Shop &amp; size</p>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Print shop" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!__props.fixedShopSlug) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(selectedShopSlug) || void 0,
                            items: unref(shopOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedShopSlug.value = normalizeStringValue($event)
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(selectedShopName),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          !__props.fixedShopSlug ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            "model-value": unref(selectedShopSlug) || void 0,
                            items: unref(shopOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedShopSlug.value = normalizeStringValue($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                            key: 1,
                            "model-value": unref(selectedShopName),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, 8, ["model-value"]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_auto] md:items-start"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Size mode" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-wrap gap-2"${_scopeId3}><!--[-->`);
                        ssrRenderList(sizeModeOptions, (option) => {
                          _push4(`<button type="button" class="${ssrRenderClass([unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white", "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors"])}"${_scopeId3}>${ssrInterpolate(option.label)}</button>`);
                        });
                        _push4(`<!--]--></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                              return createVNode("button", {
                                key: option.value,
                                type: "button",
                                class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                onClick: ($event) => handleSizeModeChange(option.value)
                              }, toDisplayString(option.label), 11, ["onClick"]);
                            }), 64))
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(sizeMode) === "custom") {
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Unit" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex flex-wrap gap-2"${_scopeId3}><!--[-->`);
                          ssrRenderList(sizeUnitOptions, (option) => {
                            _push4(`<button type="button" class="${ssrRenderClass([unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white", "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors"])}"${_scopeId3}>${ssrInterpolate(option.label)}</button>`);
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleInputUnitChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (unref(sizeMode) === "standard") {
                    _push3(`<div class="grid gap-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Standard size" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_USelectMenu, {
                            "model-value": unref(sizeLabel),
                            items: unref(sizePresetOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": handleSizePresetChange
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(sizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleSizePresetChange
                            }, null, 8, ["model-value", "items", "ui"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(sizeMode) === "custom") {
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: `Width (${unref(inputUnit)})`
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(widthInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            "onUpdate:modelValue": handleWidthChange
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(widthInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              "onUpdate:modelValue": handleWidthChange
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(CalculatorFieldGroup, {
                      label: `Height (${unref(inputUnit)})`
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_UInput, {
                            "model-value": unref(heightInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            "onUpdate:modelValue": handleHeightChange
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_UInput, {
                              "model-value": unref(heightInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              "onUpdate:modelValue": handleHeightChange
                            }, null, 8, ["model-value"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</section><section class="space-y-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId2}>2. Booklet structure</p><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Quantity" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          "model-value": unref(quantity),
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": ($event) => quantity.value = normalizeInteger($event, 1)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            "model-value": unref(quantity),
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => quantity.value = normalizeInteger($event, 1)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Total pages" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          "model-value": unref(totalPages),
                          ui: inputUi,
                          type: "number",
                          min: "4",
                          "onUpdate:modelValue": ($event) => totalPages.value = normalizeInteger($event, 4)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            "model-value": unref(totalPages),
                            ui: inputUi,
                            type: "number",
                            min: "4",
                            "onUpdate:modelValue": ($event) => totalPages.value = normalizeInteger($event, 4)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Binding type" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(bindingType),
                          "onUpdate:modelValue": ($event) => isRef(bindingType) ? bindingType.value = $event : null,
                          items: bindingTypeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(bindingType),
                            "onUpdate:modelValue": ($event) => isRef(bindingType) ? bindingType.value = $event : null,
                            items: bindingTypeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Turnaround" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_UInput, {
                          "model-value": unref(turnaroundHours) || void 0,
                          ui: inputUi,
                          type: "number",
                          min: "1",
                          "onUpdate:modelValue": ($event) => turnaroundHours.value = normalizeNumber($event)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_UInput, {
                            "model-value": unref(turnaroundHours) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => turnaroundHours.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></section><section class="space-y-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]"${_scopeId2}>3. Cover &amp; inserts</p><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Cover stock" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          "model-value": unref(selectedCoverPaperId) ?? void 0,
                          items: unref(paperOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedCoverPaperId.value = normalizeNumber($event)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedCoverPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedCoverPaperId.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Insert stock" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          "model-value": unref(selectedInsertPaperId) ?? void 0,
                          items: unref(paperOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedInsertPaperId.value = normalizeNumber($event)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedInsertPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedInsertPaperId.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Cover print sides" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(coverSides),
                          "onUpdate:modelValue": ($event) => isRef(coverSides) ? coverSides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverSides),
                            "onUpdate:modelValue": ($event) => isRef(coverSides) ? coverSides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Insert print sides" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(insertSides),
                          "onUpdate:modelValue": ($event) => isRef(insertSides) ? insertSides.value = $event : null,
                          items: sidesOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(insertSides),
                            "onUpdate:modelValue": ($event) => isRef(insertSides) ? insertSides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="grid gap-4 md:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Cover lamination" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(coverLaminationMode),
                          "onUpdate:modelValue": ($event) => isRef(coverLaminationMode) ? coverLaminationMode.value = $event : null,
                          items: laminationModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverLaminationMode),
                            "onUpdate:modelValue": ($event) => isRef(coverLaminationMode) ? coverLaminationMode.value = $event : null,
                            items: laminationModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Cover colour mode" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(coverColorMode),
                          "onUpdate:modelValue": ($event) => isRef(coverColorMode) ? coverColorMode.value = $event : null,
                          items: colorModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverColorMode),
                            "onUpdate:modelValue": ($event) => isRef(coverColorMode) ? coverColorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(CalculatorFieldGroup, { label: "Insert colour mode" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_USelectMenu, {
                          modelValue: unref(insertColorMode),
                          "onUpdate:modelValue": ($event) => isRef(insertColorMode) ? insertColorMode.value = $event : null,
                          items: colorModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(insertColorMode),
                            "onUpdate:modelValue": ($event) => isRef(insertColorMode) ? insertColorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</section><div class="flex items-center gap-2"${_scopeId2}><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(previewLoading) || !unref(canPreview)) ? " disabled" : ""} title="Preview booklet pricing" aria-label="Preview booklet pricing"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: unref(previewLoading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                    class: unref(previewLoading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white" title="Reset booklet calculator" aria-label="Reset booklet calculator"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-rotate-ccw",
                    class: "h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(`</button><button type="button" class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(preview) || unref(savingDraft)) ? " disabled" : ""}${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UIcon, {
                    name: "i-lucide-arrow-up-right",
                    class: "mr-2 h-4 w-4"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save to workspace </button></div>`);
                } else {
                  return [
                    createVNode("section", { class: "space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "1. Shop & size"),
                      createVNode(CalculatorFieldGroup, { label: "Print shop" }, {
                        default: withCtx(() => [
                          !__props.fixedShopSlug ? (openBlock(), createBlock(_component_USelectMenu, {
                            key: 0,
                            "model-value": unref(selectedShopSlug) || void 0,
                            items: unref(shopOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedShopSlug.value = normalizeStringValue($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                            key: 1,
                            "model-value": unref(selectedShopName),
                            ui: inputUi,
                            readonly: "",
                            disabled: ""
                          }, null, 8, ["model-value"]))
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-[minmax(0,1.1fr)_auto] md:items-start" }, [
                        createVNode(CalculatorFieldGroup, { label: "Size mode" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleSizeModeChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ]),
                          _: 1
                        }),
                        unref(sizeMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                          key: 0,
                          label: "Unit"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                                return createVNode("button", {
                                  key: option.value,
                                  type: "button",
                                  class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                  onClick: ($event) => handleInputUnitChange(option.value)
                                }, toDisplayString(option.label), 11, ["onClick"]);
                              }), 64))
                            ])
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      unref(sizeMode) === "standard" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-4"
                      }, [
                        createVNode(CalculatorFieldGroup, { label: "Standard size" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(sizeLabel),
                              items: unref(sizePresetOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": handleSizePresetChange
                            }, null, 8, ["model-value", "items", "ui"])
                          ]),
                          _: 1
                        })
                      ])) : createCommentVNode("", true),
                      unref(sizeMode) === "custom" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "grid gap-4 md:grid-cols-2"
                      }, [
                        createVNode(CalculatorFieldGroup, {
                          label: `Width (${unref(inputUnit)})`
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(widthInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              "onUpdate:modelValue": handleWidthChange
                            }, null, 8, ["model-value"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(CalculatorFieldGroup, {
                          label: `Height (${unref(inputUnit)})`
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(heightInput) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "0.1",
                              step: "0.01",
                              "onUpdate:modelValue": handleHeightChange
                            }, null, 8, ["model-value"])
                          ]),
                          _: 1
                        }, 8, ["label"])
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("section", { class: "space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "2. Booklet structure"),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(quantity),
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              "onUpdate:modelValue": ($event) => quantity.value = normalizeInteger($event, 1)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(CalculatorFieldGroup, { label: "Total pages" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(totalPages),
                              ui: inputUi,
                              type: "number",
                              min: "4",
                              "onUpdate:modelValue": ($event) => totalPages.value = normalizeInteger($event, 4)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(CalculatorFieldGroup, { label: "Binding type" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(bindingType),
                              "onUpdate:modelValue": ($event) => isRef(bindingType) ? bindingType.value = $event : null,
                              items: bindingTypeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ]),
                          _: 1
                        }),
                        createVNode(CalculatorFieldGroup, { label: "Turnaround" }, {
                          default: withCtx(() => [
                            createVNode(_component_UInput, {
                              "model-value": unref(turnaroundHours) || void 0,
                              ui: inputUi,
                              type: "number",
                              min: "1",
                              "onUpdate:modelValue": ($event) => turnaroundHours.value = normalizeNumber($event)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    createVNode("section", { class: "space-y-4" }, [
                      createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "3. Cover & inserts"),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(CalculatorFieldGroup, { label: "Cover stock" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(selectedCoverPaperId) ?? void 0,
                              items: unref(paperOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedCoverPaperId.value = normalizeNumber($event)
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(CalculatorFieldGroup, { label: "Insert stock" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              "model-value": unref(selectedInsertPaperId) ?? void 0,
                              items: unref(paperOptions),
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full",
                              "onUpdate:modelValue": ($event) => selectedInsertPaperId.value = normalizeNumber($event)
                            }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(CalculatorFieldGroup, { label: "Cover print sides" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(coverSides),
                              "onUpdate:modelValue": ($event) => isRef(coverSides) ? coverSides.value = $event : null,
                              items: sidesOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ]),
                          _: 1
                        }),
                        createVNode(CalculatorFieldGroup, { label: "Insert print sides" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(insertSides),
                              "onUpdate:modelValue": ($event) => isRef(insertSides) ? insertSides.value = $event : null,
                              items: sidesOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode(CalculatorFieldGroup, { label: "Cover lamination" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(coverLaminationMode),
                              "onUpdate:modelValue": ($event) => isRef(coverLaminationMode) ? coverLaminationMode.value = $event : null,
                              items: laminationModeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ]),
                          _: 1
                        }),
                        createVNode(CalculatorFieldGroup, { label: "Cover colour mode" }, {
                          default: withCtx(() => [
                            createVNode(_component_USelectMenu, {
                              modelValue: unref(coverColorMode),
                              "onUpdate:modelValue": ($event) => isRef(coverColorMode) ? coverColorMode.value = $event : null,
                              items: colorModeOptions,
                              "value-key": "value",
                              "label-key": "label",
                              ui: unref(selectUi),
                              portal: "body",
                              class: "w-full"
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(CalculatorFieldGroup, { label: "Insert colour mode" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(insertColorMode),
                            "onUpdate:modelValue": ($event) => isRef(insertColorMode) ? insertColorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: unref(previewLoading) || !unref(canPreview),
                        title: "Preview booklet pricing",
                        "aria-label": "Preview booklet pricing",
                        onClick: previewBooklet
                      }, [
                        createVNode(_component_UIcon, {
                          name: unref(previewLoading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                          class: unref(previewLoading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                        }, null, 8, ["name", "class"])
                      ], 8, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                        title: "Reset booklet calculator",
                        "aria-label": "Reset booklet calculator",
                        onClick: resetBookletForm
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-rotate-ccw",
                          class: "h-4 w-4"
                        })
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                        disabled: !unref(preview) || unref(savingDraft),
                        onClick: saveDraft
                      }, [
                        createVNode(_component_UIcon, {
                          name: "i-lucide-arrow-up-right",
                          class: "mr-2 h-4 w-4"
                        }),
                        createTextVNode(" Save to workspace ")
                      ], 8, ["disabled"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(CalculatorFormGrid, { onSubmit: previewBooklet }, {
                default: withCtx(() => [
                  createVNode("section", { class: "space-y-4" }, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "1. Shop & size"),
                    createVNode(CalculatorFieldGroup, { label: "Print shop" }, {
                      default: withCtx(() => [
                        !__props.fixedShopSlug ? (openBlock(), createBlock(_component_USelectMenu, {
                          key: 0,
                          "model-value": unref(selectedShopSlug) || void 0,
                          items: unref(shopOptions),
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full",
                          "onUpdate:modelValue": ($event) => selectedShopSlug.value = normalizeStringValue($event)
                        }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])) : (openBlock(), createBlock(_component_UInput, {
                          key: 1,
                          "model-value": unref(selectedShopName),
                          ui: inputUi,
                          readonly: "",
                          disabled: ""
                        }, null, 8, ["model-value"]))
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-[minmax(0,1.1fr)_auto] md:items-start" }, [
                      createVNode(CalculatorFieldGroup, { label: "Size mode" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(sizeModeOptions, (option) => {
                              return createVNode("button", {
                                key: option.value,
                                type: "button",
                                class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors", unref(sizeMode) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                onClick: ($event) => handleSizeModeChange(option.value)
                              }, toDisplayString(option.label), 11, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        _: 1
                      }),
                      unref(sizeMode) === "custom" ? (openBlock(), createBlock(CalculatorFieldGroup, {
                        key: 0,
                        label: "Unit"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(sizeUnitOptions, (option) => {
                              return createVNode("button", {
                                key: option.value,
                                type: "button",
                                class: ["inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold uppercase transition-colors", unref(inputUnit) === option.value ? "border-flamingo-400 bg-flamingo-500/18 text-white" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-flamingo-300/70 hover:text-white"],
                                onClick: ($event) => handleInputUnitChange(option.value)
                              }, toDisplayString(option.label), 11, ["onClick"]);
                            }), 64))
                          ])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    unref(sizeMode) === "standard" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-4"
                    }, [
                      createVNode(CalculatorFieldGroup, { label: "Standard size" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(sizeLabel),
                            items: unref(sizePresetOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": handleSizePresetChange
                          }, null, 8, ["model-value", "items", "ui"])
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true),
                    unref(sizeMode) === "custom" ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "grid gap-4 md:grid-cols-2"
                    }, [
                      createVNode(CalculatorFieldGroup, {
                        label: `Width (${unref(inputUnit)})`
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(widthInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            "onUpdate:modelValue": handleWidthChange
                          }, null, 8, ["model-value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(CalculatorFieldGroup, {
                        label: `Height (${unref(inputUnit)})`
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(heightInput) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "0.1",
                            step: "0.01",
                            "onUpdate:modelValue": handleHeightChange
                          }, null, 8, ["model-value"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("section", { class: "space-y-4" }, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "2. Booklet structure"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Quantity" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(quantity),
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => quantity.value = normalizeInteger($event, 1)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Total pages" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(totalPages),
                            ui: inputUi,
                            type: "number",
                            min: "4",
                            "onUpdate:modelValue": ($event) => totalPages.value = normalizeInteger($event, 4)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Binding type" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(bindingType),
                            "onUpdate:modelValue": ($event) => isRef(bindingType) ? bindingType.value = $event : null,
                            items: bindingTypeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Turnaround" }, {
                        default: withCtx(() => [
                          createVNode(_component_UInput, {
                            "model-value": unref(turnaroundHours) || void 0,
                            ui: inputUi,
                            type: "number",
                            min: "1",
                            "onUpdate:modelValue": ($event) => turnaroundHours.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode("section", { class: "space-y-4" }, [
                    createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]" }, "3. Cover & inserts"),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Cover stock" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedCoverPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedCoverPaperId.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Insert stock" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            "model-value": unref(selectedInsertPaperId) ?? void 0,
                            items: unref(paperOptions),
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full",
                            "onUpdate:modelValue": ($event) => selectedInsertPaperId.value = normalizeNumber($event)
                          }, null, 8, ["model-value", "items", "ui", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Cover print sides" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverSides),
                            "onUpdate:modelValue": ($event) => isRef(coverSides) ? coverSides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Insert print sides" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(insertSides),
                            "onUpdate:modelValue": ($event) => isRef(insertSides) ? insertSides.value = $event : null,
                            items: sidesOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode(CalculatorFieldGroup, { label: "Cover lamination" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverLaminationMode),
                            "onUpdate:modelValue": ($event) => isRef(coverLaminationMode) ? coverLaminationMode.value = $event : null,
                            items: laminationModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      }),
                      createVNode(CalculatorFieldGroup, { label: "Cover colour mode" }, {
                        default: withCtx(() => [
                          createVNode(_component_USelectMenu, {
                            modelValue: unref(coverColorMode),
                            "onUpdate:modelValue": ($event) => isRef(coverColorMode) ? coverColorMode.value = $event : null,
                            items: colorModeOptions,
                            "value-key": "value",
                            "label-key": "label",
                            ui: unref(selectUi),
                            portal: "body",
                            class: "w-full"
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(CalculatorFieldGroup, { label: "Insert colour mode" }, {
                      default: withCtx(() => [
                        createVNode(_component_USelectMenu, {
                          modelValue: unref(insertColorMode),
                          "onUpdate:modelValue": ($event) => isRef(insertColorMode) ? insertColorMode.value = $event : null,
                          items: colorModeOptions,
                          "value-key": "value",
                          "label-key": "label",
                          ui: unref(selectUi),
                          portal: "body",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "ui"])
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: unref(previewLoading) || !unref(canPreview),
                      title: "Preview booklet pricing",
                      "aria-label": "Preview booklet pricing",
                      onClick: previewBooklet
                    }, [
                      createVNode(_component_UIcon, {
                        name: unref(previewLoading) ? "i-lucide-loader-circle" : "i-lucide-refresh-cw",
                        class: unref(previewLoading) ? "h-4 w-4 animate-spin" : "h-4 w-4"
                      }, null, 8, ["name", "class"])
                    ], 8, ["disabled"]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                      title: "Reset booklet calculator",
                      "aria-label": "Reset booklet calculator",
                      onClick: resetBookletForm
                    }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-rotate-ccw",
                        class: "h-4 w-4"
                      })
                    ]),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50",
                      disabled: !unref(preview) || unref(savingDraft),
                      onClick: saveDraft
                    }, [
                      createVNode(_component_UIcon, {
                        name: "i-lucide-arrow-up-right",
                        class: "mr-2 h-4 w-4"
                      }),
                      createTextVNode(" Save to workspace ")
                    ], 8, ["disabled"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        preview: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}>`);
            if (unref(showPreviewSwitcher)) {
              _push2(`<div class="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(CalculatorTypeSwitcher, {
                "model-value": __props.calculatorType ?? void 0,
                options: __props.calculatorTypeOptions,
                size: "sm",
                tone: "embedded",
                "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(QuotePreviewPanel, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(QuotePreviewMeta, {
                    title: "Booklet summary",
                    lines: unref(summaryLines),
                    placeholder: "Choose a shop and booklet details to unlock the backend booklet preview."
                  }, null, _parent3, _scopeId2));
                  if (unref(missingItems).length) {
                    _push3(ssrRenderComponent(QuotePreviewRequirementsState, {
                      title: "Complete these details",
                      items: unref(missingItems),
                      helper: "Booklet pricing uses shop papers and finishing rates, so the backend needs these inputs first."
                    }, null, _parent3, _scopeId2));
                  } else if (unref(preview)) {
                    _push3(`<div class="space-y-4"${_scopeId2}><div class="grid gap-4 md:grid-cols-2"${_scopeId2}><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Total</p><p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(previewGrandTotal))}</p>`);
                    if (unref(preview).human_ready_text) {
                      _push3(`<p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId2}>${ssrInterpolate(unref(preview).human_ready_text)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Per booklet</p><p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(previewTotalPerBooklet))}</p>`);
                    if (unref(preview).turnaround_text) {
                      _push3(`<p class="mt-1 text-sm text-[var(--p-text-muted)]"${_scopeId2}>${ssrInterpolate(unref(preview).turnaround_text)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</article></div><div class="grid gap-4 lg:grid-cols-2"${_scopeId2}><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Cover</p><p class="mt-3 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(coverSummary))}</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Inserts</p><p class="mt-3 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(insertSummary))}</p></article></div><div class="grid gap-4 lg:grid-cols-2"${_scopeId2}><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Binding</p><p class="mt-3 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(bindingSummary))}</p></article><article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"${_scopeId2}><p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"${_scopeId2}>Turnaround</p><p class="mt-3 text-sm text-[var(--p-text)]"${_scopeId2}>${ssrInterpolate(unref(turnaroundSummary))}</p></article></div>`);
                    if (unref(preview).warnings?.length || unref(preview).assumptions?.length) {
                      _push3(`<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"${_scopeId2}><p class="font-semibold"${_scopeId2}>Booklet notes</p><ul class="mt-2 space-y-1"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(preview).warnings || [], (warning) => {
                        _push3(`<li${_scopeId2}>${ssrInterpolate(warning)}</li>`);
                      });
                      _push3(`<!--]--><!--[-->`);
                      ssrRenderList(unref(preview).assumptions || [], (assumption) => {
                        _push3(`<li${_scopeId2}>${ssrInterpolate(assumption)}</li>`);
                      });
                      _push3(`<!--]--></ul></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<div class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]"${_scopeId2}> Preview pricing to see the cover, inserts, binding, total, and turnaround sections. </div>`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(QuotePreviewMeta, {
                        title: "Booklet summary",
                        lines: unref(summaryLines),
                        placeholder: "Choose a shop and booklet details to unlock the backend booklet preview."
                      }, null, 8, ["lines"]),
                      unref(missingItems).length ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                        key: 0,
                        title: "Complete these details",
                        items: unref(missingItems),
                        helper: "Booklet pricing uses shop papers and finishing rates, so the backend needs these inputs first."
                      }, null, 8, ["items"])) : unref(preview) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-4"
                      }, [
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Total"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold text-[var(--p-text)]" }, toDisplayString(unref(previewGrandTotal)), 1),
                            unref(preview).human_ready_text ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "mt-1 text-sm text-[var(--p-text-muted)]"
                            }, toDisplayString(unref(preview).human_ready_text), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Per booklet"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold text-[var(--p-text)]" }, toDisplayString(unref(previewTotalPerBooklet)), 1),
                            unref(preview).turnaround_text ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "mt-1 text-sm text-[var(--p-text-muted)]"
                            }, toDisplayString(unref(preview).turnaround_text), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Cover"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(coverSummary)), 1)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Inserts"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(insertSummary)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Binding"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(bindingSummary)), 1)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Turnaround"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(turnaroundSummary)), 1)
                          ])
                        ]),
                        unref(preview).warnings?.length || unref(preview).assumptions?.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                        }, [
                          createVNode("p", { class: "font-semibold" }, "Booklet notes"),
                          createVNode("ul", { class: "mt-2 space-y-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(preview).warnings || [], (warning) => {
                              return openBlock(), createBlock("li", { key: warning }, toDisplayString(warning), 1);
                            }), 128)),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(preview).assumptions || [], (assumption) => {
                              return openBlock(), createBlock("li", { key: assumption }, toDisplayString(assumption), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]"
                      }, " Preview pricing to see the cover, inserts, binding, total, and turnaround sections. "))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                unref(showPreviewSwitcher) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                }, [
                  createVNode(CalculatorTypeSwitcher, {
                    "model-value": __props.calculatorType ?? void 0,
                    options: __props.calculatorTypeOptions,
                    size: "sm",
                    tone: "embedded",
                    "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                  }, null, 8, ["model-value", "options", "onUpdate:modelValue"])
                ])) : createCommentVNode("", true),
                createVNode(QuotePreviewPanel, null, {
                  default: withCtx(() => [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode(QuotePreviewMeta, {
                        title: "Booklet summary",
                        lines: unref(summaryLines),
                        placeholder: "Choose a shop and booklet details to unlock the backend booklet preview."
                      }, null, 8, ["lines"]),
                      unref(missingItems).length ? (openBlock(), createBlock(QuotePreviewRequirementsState, {
                        key: 0,
                        title: "Complete these details",
                        items: unref(missingItems),
                        helper: "Booklet pricing uses shop papers and finishing rates, so the backend needs these inputs first."
                      }, null, 8, ["items"])) : unref(preview) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "space-y-4"
                      }, [
                        createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Total"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold text-[var(--p-text)]" }, toDisplayString(unref(previewGrandTotal)), 1),
                            unref(preview).human_ready_text ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "mt-1 text-sm text-[var(--p-text-muted)]"
                            }, toDisplayString(unref(preview).human_ready_text), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Per booklet"),
                            createVNode("p", { class: "mt-2 text-2xl font-extrabold text-[var(--p-text)]" }, toDisplayString(unref(previewTotalPerBooklet)), 1),
                            unref(preview).turnaround_text ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "mt-1 text-sm text-[var(--p-text-muted)]"
                            }, toDisplayString(unref(preview).turnaround_text), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Cover"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(coverSummary)), 1)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Inserts"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(insertSummary)), 1)
                          ])
                        ]),
                        createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Binding"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(bindingSummary)), 1)
                          ]),
                          createVNode("article", { class: "rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4" }, [
                            createVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]" }, "Turnaround"),
                            createVNode("p", { class: "mt-3 text-sm text-[var(--p-text)]" }, toDisplayString(unref(turnaroundSummary)), 1)
                          ])
                        ]),
                        unref(preview).warnings?.length || unref(preview).assumptions?.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                        }, [
                          createVNode("p", { class: "font-semibold" }, "Booklet notes"),
                          createVNode("ul", { class: "mt-2 space-y-1" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(preview).warnings || [], (warning) => {
                              return openBlock(), createBlock("li", { key: warning }, toDisplayString(warning), 1);
                            }), 128)),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(preview).assumptions || [], (assumption) => {
                              return openBlock(), createBlock("li", { key: assumption }, toDisplayString(assumption), 1);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true)
                      ])) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]"
                      }, " Preview pricing to see the cover, inserts, binding, total, and turnaround sections. "))
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 2
      }, [
        unref(showHeaderContent) || unref(showHeaderSwitcher) ? {
          name: "header",
          fn: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass(__props.compact ? "space-y-3" : "space-y-4")}"${_scopeId}><div class="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"${_scopeId}>`);
              _push2(ssrRenderComponent(CalculatorHeaderBlock, {
                eyebrow: __props.eyebrow,
                title: __props.title,
                description: __props.description,
                compact: __props.compact
              }, null, _parent2, _scopeId));
              if (unref(showHeaderSwitcher)) {
                _push2(ssrRenderComponent(CalculatorTypeSwitcher, {
                  "model-value": __props.calculatorType ?? void 0,
                  options: __props.calculatorTypeOptions,
                  size: "sm",
                  tone: "embedded",
                  "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", {
                  class: __props.compact ? "space-y-3" : "space-y-4"
                }, [
                  createVNode("div", { class: "flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between" }, [
                    createVNode(CalculatorHeaderBlock, {
                      eyebrow: __props.eyebrow,
                      title: __props.title,
                      description: __props.description,
                      compact: __props.compact
                    }, null, 8, ["eyebrow", "title", "description", "compact"]),
                    unref(showHeaderSwitcher) ? (openBlock(), createBlock(CalculatorTypeSwitcher, {
                      key: 0,
                      "model-value": __props.calculatorType ?? void 0,
                      options: __props.calculatorTypeOptions,
                      size: "sm",
                      tone: "embedded",
                      "onUpdate:modelValue": ($event) => emit("update:calculatorType", $event)
                    }, null, 8, ["model-value", "options", "onUpdate:modelValue"])) : createCommentVNode("", true)
                  ])
                ], 2)
              ];
            }
          }),
          key: "0"
        } : void 0
      ]), _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quotes/BookletCalculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "QuotesBookletCalculator" });

export { __nuxt_component_3 as _ };
//# sourceMappingURL=BookletCalculator-CV4rstZN.mjs.map
