import { _ as __nuxt_component_0 } from './DashboardPageHeader-DY_0uFAc.mjs';
import { g as useRoute, e as _sfc_main$9, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_2, a as __nuxt_component_11 } from './InfoCard-K1X9VF5P.mjs';
import { _ as _sfc_main$1 } from './Input-DA2ySSK8.mjs';
import { _ as __nuxt_component_4 } from './InlineError-DcBNAnP_.mjs';
import { _ as _sfc_main$2 } from './SelectMenu-DTjoEp_W.mjs';
import { _ as __nuxt_component_6 } from './FieldHint-ZRUlwJL3.mjs';
import { _ as _sfc_main$3 } from './Textarea-D4hEpwmG.mjs';
import { _ as _sfc_main$4 } from './Checkbox-8D35u7U_.mjs';
import { _ as _sfc_main$5 } from './Alert-RLPfncBZ.mjs';
import { _ as __nuxt_component_10 } from './LoadingButton-CZOYt8xS.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, withCtx, unref, createTextVNode, createVNode, isRef, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
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
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useNotification();
    const slug = computed(() => route.params.slug);
    const saving = ref(false);
    const submitError = ref("");
    const selectedFinishing = ref([]);
    const machines = ref([]);
    const exampleOptions = [
      { label: "Business Cards", value: "business_cards" },
      { label: "Flyers", value: "flyers" },
      { label: "Brochures", value: "brochures" },
      { label: "Roll Up Banners", value: "roll_up_banners" },
      { label: "Booklets", value: "booklets" },
      { label: "Stickers", value: "stickers" }
    ];
    const examples = {
      business_cards: {
        name: "Business Cards",
        description: "Premium business cards for walk-ins, teams, and small business orders.",
        pricing_mode: "SHEET",
        default_finished_width_mm: 90,
        default_finished_height_mm: 54,
        default_sheet_size: "SRA3",
        min_quantity: 100,
        min_gsm: 250,
        max_gsm: 350,
        turnaround_days: 2,
        default_sides: "DUPLEX"
      },
      flyers: {
        name: "Flyers",
        description: "Promotional flyers for events, launches, and local campaigns.",
        pricing_mode: "SHEET",
        default_finished_width_mm: 210,
        default_finished_height_mm: 297,
        default_sheet_size: "SRA3",
        min_quantity: 100,
        min_gsm: 130,
        max_gsm: 170,
        turnaround_days: 2,
        default_sides: "SIMPLEX"
      },
      brochures: {
        name: "Brochures",
        description: "Folded marketing brochures for sales kits and product information.",
        pricing_mode: "SHEET",
        default_finished_width_mm: 210,
        default_finished_height_mm: 297,
        default_sheet_size: "SRA3",
        min_quantity: 100,
        min_gsm: 130,
        max_gsm: 170,
        turnaround_days: 3,
        default_sides: "DUPLEX"
      },
      roll_up_banners: {
        name: "Roll Up Banners",
        description: "Portable event banners produced on large-format media.",
        pricing_mode: "LARGE_FORMAT",
        default_finished_width_mm: 850,
        default_finished_height_mm: 2e3,
        default_sheet_size: "",
        min_quantity: 1,
        turnaround_days: 2,
        default_sides: "SIMPLEX"
      },
      booklets: {
        name: "Booklets",
        description: "Short-run booklets for profiles, reports, and event guides.",
        pricing_mode: "SHEET",
        default_finished_width_mm: 210,
        default_finished_height_mm: 297,
        default_sheet_size: "SRA3",
        min_quantity: 50,
        min_gsm: 80,
        max_gsm: 170,
        turnaround_days: 4,
        default_sides: "DUPLEX"
      },
      stickers: {
        name: "Stickers",
        description: "Cut stickers for packaging, branding, and promo items.",
        pricing_mode: "SHEET",
        default_finished_width_mm: 80,
        default_finished_height_mm: 50,
        default_sheet_size: "SRA3",
        min_quantity: 50,
        turnaround_days: 2,
        default_sides: "SIMPLEX"
      }
    };
    const pricingModes = [
      { label: "Sheet Product", value: "SHEET" },
      { label: "Large Format", value: "LARGE_FORMAT" }
    ];
    const sidesOptions = [
      { label: "Simplex", value: "SIMPLEX" },
      { label: "Duplex", value: "DUPLEX" }
    ];
    const sheetSizeOptions = [
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "SRA3", value: "SRA3" },
      { label: "SRA4", value: "SRA4" },
      { label: "B2", value: "B2" }
    ];
    const finishingLabels = ["Lamination", "Rounded corners", "Folding", "Binding", "Creasing", "Cutting"];
    const selectedExample = ref(null);
    const form = reactive({
      name: "",
      description: "",
      pricing_mode: "SHEET",
      default_finished_width_mm: "90",
      default_finished_height_mm: "54",
      default_bleed_mm: "3",
      default_sides: "DUPLEX",
      min_quantity: "100",
      turnaround_days: "2",
      default_sheet_size: "SRA3",
      default_machine: null,
      allowed_sheet_sizes: ["SRA3"],
      min_gsm: "250",
      max_gsm: "350",
      max_width_mm: "",
      max_height_mm: "",
      allow_simplex: true,
      allow_duplex: true
    });
    const machineOptions = computed(() => machines.value.map((machine) => ({
      label: machine.name,
      value: machine.id
    })));
    const errors = computed(() => ({
      name: form.name.trim() ? null : "Product name is required.",
      finished_width: Number(form.default_finished_width_mm) > 0 ? null : "Finished width must be greater than zero.",
      finished_height: Number(form.default_finished_height_mm) > 0 ? null : "Finished height must be greater than zero."
    }));
    const canSubmit = computed(() => Object.values(errors.value).every((value) => !value));
    const impositionPreview = computed(() => {
      const sizeMap = {
        A4: { width: 210, height: 297 },
        A3: { width: 297, height: 420 },
        SRA3: { width: 320, height: 450 },
        SRA4: { width: 225, height: 320 },
        B2: { width: 500, height: 707 }
      };
      const parent = sizeMap[form.default_sheet_size] ?? sizeMap.SRA3;
      const width = Number(form.default_finished_width_mm) || 0;
      const height = Number(form.default_finished_height_mm) || 0;
      const bleed = Number(form.default_bleed_mm) || 0;
      const quantity = 1e3;
      if (form.pricing_mode !== "SHEET" || !width || !height) {
        return {
          fitCount: 0,
          parentSheets: 0,
          summary: "Large-format products price by area rather than parent-sheet imposition."
        };
      }
      const effectiveWidth = width + bleed * 2;
      const effectiveHeight = height + bleed * 2;
      const normal = Math.floor(parent.width / effectiveWidth) * Math.floor(parent.height / effectiveHeight);
      const rotated = Math.floor(parent.width / effectiveHeight) * Math.floor(parent.height / effectiveWidth);
      const fitCount = Math.max(1, normal, rotated);
      const parentSheets = Math.ceil(quantity / fitCount);
      return {
        fitCount,
        parentSheets,
        summary: `${fitCount} finished pieces fit on ${form.default_sheet_size || "the selected parent sheet"}, so 1,000 pieces need about ${parentSheets} parent sheets before spoilage and finishing allowances.`
      };
    });
    watch(selectedExample, (value) => {
      if (!value || !examples[value]) return;
      const example = examples[value];
      form.name = example.name;
      form.description = example.description;
      form.pricing_mode = example.pricing_mode;
      form.default_finished_width_mm = String(example.default_finished_width_mm);
      form.default_finished_height_mm = String(example.default_finished_height_mm);
      form.default_sheet_size = example.default_sheet_size;
      form.min_quantity = String(example.min_quantity);
      form.turnaround_days = String(example.turnaround_days ?? "");
      form.default_sides = example.default_sides;
      form.min_gsm = example.min_gsm != null ? String(example.min_gsm) : "";
      form.max_gsm = example.max_gsm != null ? String(example.max_gsm) : "";
      form.allowed_sheet_sizes = example.default_sheet_size ? [example.default_sheet_size] : [];
    });
    function toggleSheet(sheet) {
      if (form.allowed_sheet_sizes.includes(sheet)) {
        form.allowed_sheet_sizes = form.allowed_sheet_sizes.filter((item) => item !== sheet);
        return;
      }
      form.allowed_sheet_sizes = [...form.allowed_sheet_sizes, sheet];
    }
    function toggleFinishing(option) {
      if (selectedFinishing.value.includes(option)) {
        selectedFinishing.value = selectedFinishing.value.filter((item) => item !== option);
        return;
      }
      selectedFinishing.value = [...selectedFinishing.value, option];
    }
    function goBack() {
      navigateTo(`/dashboard/shops/${slug.value}/products`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DashboardPageHeader = __nuxt_component_0;
      const _component_UButton = _sfc_main$9;
      const _component_DashboardFormSection = __nuxt_component_2;
      const _component_UInput = _sfc_main$1;
      const _component_DashboardInlineError = __nuxt_component_4;
      const _component_USelectMenu = _sfc_main$2;
      const _component_DashboardFieldHint = __nuxt_component_6;
      const _component_UTextarea = _sfc_main$3;
      const _component_UCheckbox = _sfc_main$4;
      const _component_UAlert = _sfc_main$5;
      const _component_DashboardLoadingButton = __nuxt_component_10;
      const _component_DashboardInfoCard = __nuxt_component_11;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-span-12 space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_DashboardPageHeader, {
        title: "Create a Product",
        subtitle: "Guide Printy through the finished size, print rules, parent sheet logic, and finishing assumptions your shop uses for real production."
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UButton, {
              to: `/dashboard/shops/${unref(slug)}/products`,
              variant: "soft"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Back to Products`);
                } else {
                  return [
                    createTextVNode("Back to Products")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UButton, {
                to: `/dashboard/shops/${unref(slug)}/products`,
                variant: "soft"
              }, {
                default: withCtx(() => [
                  createTextVNode("Back to Products")
                ]),
                _: 1
              }, 8, ["to"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]"><form class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Product Basics",
        description: "Start with a product your team already understands and can produce today."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Product Name</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).name,
              "onUpdate:modelValue": ($event) => unref(form).name = $event,
              placeholder: "Business Cards",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardInlineError, {
              message: unref(errors).name
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Use Example</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(selectedExample),
              "onUpdate:modelValue": ($event) => isRef(selectedExample) ? selectedExample.value = $event : null,
              items: exampleOptions,
              "value-key": "value",
              "label-key": "label",
              placeholder: "Choose a realistic product example",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Choosing an example pre-fills dimensions and common production defaults. You can still edit everything." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Pricing Mode</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).pricing_mode,
              "onUpdate:modelValue": ($event) => unref(form).pricing_mode = $event,
              items: pricingModes,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Sheet products use parent sheet imposition. Large-format products use area-based pricing." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Description</label>`);
            _push2(ssrRenderComponent(_component_UTextarea, {
              modelValue: unref(form).description,
              "onUpdate:modelValue": ($event) => unref(form).description = $event,
              rows: 4,
              placeholder: "Premium matt laminated business cards printed on 350gsm stock for walk-in clients and sales teams."
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Product Name"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).name,
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    placeholder: "Business Cards",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardInlineError, {
                    message: unref(errors).name
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Use Example"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(selectedExample),
                    "onUpdate:modelValue": ($event) => isRef(selectedExample) ? selectedExample.value = $event : null,
                    items: exampleOptions,
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Choose a realistic product example",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Choosing an example pre-fills dimensions and common production defaults. You can still edit everything." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Pricing Mode"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).pricing_mode,
                    "onUpdate:modelValue": ($event) => unref(form).pricing_mode = $event,
                    items: pricingModes,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Sheet products use parent sheet imposition. Large-format products use area-based pricing." })
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Description"),
                  createVNode(_component_UTextarea, {
                    modelValue: unref(form).description,
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: 4,
                    placeholder: "Premium matt laminated business cards printed on 350gsm stock for walk-in clients and sales teams."
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Print Specifications",
        description: "These settings define the finished item buyers order, not the parent sheet it starts from."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Finished Width (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).default_finished_width_mm,
              "onUpdate:modelValue": ($event) => unref(form).default_finished_width_mm = $event,
              type: "number",
              placeholder: "90",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Finished Height (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).default_finished_height_mm,
              "onUpdate:modelValue": ($event) => unref(form).default_finished_height_mm = $event,
              type: "number",
              placeholder: "54",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Bleed (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).default_bleed_mm,
              "onUpdate:modelValue": ($event) => unref(form).default_bleed_mm = $event,
              type: "number",
              placeholder: "3",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Minimum Quantity</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).min_quantity,
              "onUpdate:modelValue": ($event) => unref(form).min_quantity = $event,
              type: "number",
              placeholder: "100",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Default Sides</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).default_sides,
              "onUpdate:modelValue": ($event) => unref(form).default_sides = $event,
              items: sidesOptions,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Turnaround (business days)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).turnaround_days,
              "onUpdate:modelValue": ($event) => unref(form).turnaround_days = $event,
              type: "number",
              placeholder: "2",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Finished Width (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).default_finished_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_finished_width_mm = $event,
                    type: "number",
                    placeholder: "90",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Finished Height (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).default_finished_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_finished_height_mm = $event,
                    type: "number",
                    placeholder: "54",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Bleed (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).default_bleed_mm,
                    "onUpdate:modelValue": ($event) => unref(form).default_bleed_mm = $event,
                    type: "number",
                    placeholder: "3",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Minimum Quantity"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).min_quantity,
                    "onUpdate:modelValue": ($event) => unref(form).min_quantity = $event,
                    type: "number",
                    placeholder: "100",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Default Sides"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).default_sides,
                    "onUpdate:modelValue": ($event) => unref(form).default_sides = $event,
                    items: sidesOptions,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Turnaround (business days)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).turnaround_days,
                    "onUpdate:modelValue": ($event) => unref(form).turnaround_days = $event,
                    type: "number",
                    placeholder: "2",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Paper / Parent Sheet Logic",
        description: "Default paper means the parent sheet this product is usually imposed on, such as SRA3. Stock paper means the actual paper you keep in the shop for costing."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Default Parent Sheet</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).default_sheet_size,
              "onUpdate:modelValue": ($event) => unref(form).default_sheet_size = $event,
              items: sheetSizeOptions,
              "value-key": "value",
              "label-key": "label",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Example: business cards often start from SRA3 stock, then multiple finished cards are imposed on each sheet." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Recommended Machine</label>`);
            _push2(ssrRenderComponent(_component_USelectMenu, {
              modelValue: unref(form).default_machine,
              "onUpdate:modelValue": ($event) => unref(form).default_machine = $event,
              items: unref(machineOptions),
              "value-key": "value",
              "label-key": "label",
              placeholder: "Optional machine default",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Optional today. It helps keep product assumptions tied to an actual press." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2 md:col-span-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Allowed Parent Sheets</label><div class="grid gap-2 sm:grid-cols-2"${_scopeId}><!--[-->`);
            ssrRenderList(sheetSizeOptions, (sheet) => {
              _push2(`<label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                "model-value": unref(form).allowed_sheet_sizes.includes(sheet.value),
                "onUpdate:modelValue": ($event) => toggleSheet(sheet.value)
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(sheet.label)}</span></label>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Allowed sheets define the parent sheet sizes this product may use. Leave several selected if your shop can produce the job on more than one parent sheet." }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Estimated Fit on Parent Sheet</label><div class="rounded-2xl border border-white/10 bg-slate-950/45 p-4"${_scopeId}><p class="text-lg font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(impositionPreview).fitCount)} up</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}>${ssrInterpolate(unref(impositionPreview).summary)}</p></div></div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Parent Sheets Needed for 1,000 pcs</label><div class="rounded-2xl border border-white/10 bg-slate-950/45 p-4"${_scopeId}><p class="text-lg font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(impositionPreview).parentSheets)}</p><p class="mt-1 text-sm leading-6 text-slate-300"${_scopeId}> This estimate helps downstream costing, print charges, and finishing quantities derive from the parent sheet count. </p></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Default Parent Sheet"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).default_sheet_size,
                    "onUpdate:modelValue": ($event) => unref(form).default_sheet_size = $event,
                    items: sheetSizeOptions,
                    "value-key": "value",
                    "label-key": "label",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_component_DashboardFieldHint, { text: "Example: business cards often start from SRA3 stock, then multiple finished cards are imposed on each sheet." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Recommended Machine"),
                  createVNode(_component_USelectMenu, {
                    modelValue: unref(form).default_machine,
                    "onUpdate:modelValue": ($event) => unref(form).default_machine = $event,
                    items: unref(machineOptions),
                    "value-key": "value",
                    "label-key": "label",
                    placeholder: "Optional machine default",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"]),
                  createVNode(_component_DashboardFieldHint, { text: "Optional today. It helps keep product assumptions tied to an actual press." })
                ]),
                createVNode("div", { class: "space-y-2 md:col-span-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Allowed Parent Sheets"),
                  createVNode("div", { class: "grid gap-2 sm:grid-cols-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(sheetSizeOptions, (sheet) => {
                      return createVNode("label", {
                        key: sheet.value,
                        class: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                      }, [
                        createVNode(_component_UCheckbox, {
                          "model-value": unref(form).allowed_sheet_sizes.includes(sheet.value),
                          "onUpdate:modelValue": ($event) => toggleSheet(sheet.value)
                        }, null, 8, ["model-value", "onUpdate:modelValue"]),
                        createVNode("span", null, toDisplayString(sheet.label), 1)
                      ]);
                    }), 64))
                  ]),
                  createVNode(_component_DashboardFieldHint, { text: "Allowed sheets define the parent sheet sizes this product may use. Leave several selected if your shop can produce the job on more than one parent sheet." })
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Estimated Fit on Parent Sheet"),
                  createVNode("div", { class: "rounded-2xl border border-white/10 bg-slate-950/45 p-4" }, [
                    createVNode("p", { class: "text-lg font-semibold text-white" }, toDisplayString(unref(impositionPreview).fitCount) + " up", 1),
                    createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, toDisplayString(unref(impositionPreview).summary), 1)
                  ])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Parent Sheets Needed for 1,000 pcs"),
                  createVNode("div", { class: "rounded-2xl border border-white/10 bg-slate-950/45 p-4" }, [
                    createVNode("p", { class: "text-lg font-semibold text-white" }, toDisplayString(unref(impositionPreview).parentSheets), 1),
                    createVNode("p", { class: "mt-1 text-sm leading-6 text-slate-300" }, " This estimate helps downstream costing, print charges, and finishing quantities derive from the parent sheet count. ")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Pricing / Production Rules",
        description: "These rules stop unsuitable stock or oversized jobs from appearing as valid options."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-5 md:grid-cols-2"${_scopeId}><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Minimum GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).min_gsm,
              "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
              type: "number",
              placeholder: "250",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Maximum GSM</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_gsm,
              "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
              type: "number",
              placeholder: "350",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Max Finished Width (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_width_mm,
              "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
              type: "number",
              placeholder: "90",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2"${_scopeId}><label class="block text-sm font-medium text-white"${_scopeId}>Max Finished Height (mm)</label>`);
            _push2(ssrRenderComponent(_component_UInput, {
              modelValue: unref(form).max_height_mm,
              "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
              type: "number",
              placeholder: "54",
              size: "xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).allow_simplex,
              "onUpdate:modelValue": ($event) => unref(form).allow_simplex = $event
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Allow simplex jobs</span></label><label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(form).allow_duplex,
              "onUpdate:modelValue": ($event) => unref(form).allow_duplex = $event
            }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Allow duplex jobs</span></label></div>`);
          } else {
            return [
              createVNode("div", { class: "grid gap-5 md:grid-cols-2" }, [
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Minimum GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).min_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).min_gsm = $event,
                    type: "number",
                    placeholder: "250",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Maximum GSM"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_gsm,
                    "onUpdate:modelValue": ($event) => unref(form).max_gsm = $event,
                    type: "number",
                    placeholder: "350",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Max Finished Width (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_width_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_width_mm = $event,
                    type: "number",
                    placeholder: "90",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("label", { class: "block text-sm font-medium text-white" }, "Max Finished Height (mm)"),
                  createVNode(_component_UInput, {
                    modelValue: unref(form).max_height_mm,
                    "onUpdate:modelValue": ($event) => unref(form).max_height_mm = $event,
                    type: "number",
                    placeholder: "54",
                    size: "xl"
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createVNode("label", { class: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).allow_simplex,
                    "onUpdate:modelValue": ($event) => unref(form).allow_simplex = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", null, "Allow simplex jobs")
                ]),
                createVNode("label", { class: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200" }, [
                  createVNode(_component_UCheckbox, {
                    modelValue: unref(form).allow_duplex,
                    "onUpdate:modelValue": ($event) => unref(form).allow_duplex = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("span", null, "Allow duplex jobs")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_DashboardFormSection, {
        title: "Finishing Options",
        description: "Finishing can stay simple at first. The important part is telling the team what usually happens after print."
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid gap-2 sm:grid-cols-2"${_scopeId}><!--[-->`);
            ssrRenderList(finishingLabels, (option) => {
              _push2(`<label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UCheckbox, {
                "model-value": unref(selectedFinishing).includes(option),
                "onUpdate:modelValue": ($event) => toggleFinishing(option)
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(option)}</span></label>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_component_DashboardFieldHint, { text: "Finishing selections are guidance-only in this first pass. Persisted finishing linking still depends on available backend finishing-rate records." }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "grid gap-2 sm:grid-cols-2" }, [
                (openBlock(), createBlock(Fragment, null, renderList(finishingLabels, (option) => {
                  return createVNode("label", {
                    key: option,
                    class: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  }, [
                    createVNode(_component_UCheckbox, {
                      "model-value": unref(selectedFinishing).includes(option),
                      "onUpdate:modelValue": ($event) => toggleFinishing(option)
                    }, null, 8, ["model-value", "onUpdate:modelValue"]),
                    createVNode("span", null, toDisplayString(option), 1)
                  ]);
                }), 64))
              ]),
              createVNode(_component_DashboardFieldHint, { text: "Finishing selections are guidance-only in this first pass. Persisted finishing linking still depends on available backend finishing-rate records." })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(submitError)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "soft",
          title: "We could not save this product yet.",
          description: unref(submitError),
          icon: "i-lucide-alert-circle"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "neutral",
        variant: "outline",
        onClick: goBack
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
      _push(ssrRenderComponent(_component_DashboardLoadingButton, {
        type: "submit",
        color: "primary",
        loading: unref(saving),
        disabled: !unref(canSubmit)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create Product `);
          } else {
            return [
              createTextVNode(" Create Product ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "How imposition works",
        description: "Finished size is the piece you hand to the customer. Parent sheet is the larger stock sheet you print first. Printy estimates how many finished pieces fit on that parent sheet, then uses that fit count to estimate parent sheets needed.",
        icon: "i-lucide-layout-template",
        tone: "orange"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Stock paper vs default paper",
        description: "Stock paper is the real paper you keep in inventory. Default paper size is the parent sheet you want this product to prefer when quoting and costing.",
        icon: "i-lucide-file-stack",
        tone: "blue"
      }, null, _parent));
      _push(ssrRenderComponent(_component_DashboardInfoCard, {
        title: "Good first products",
        description: "Business cards, flyers, brochures, roll-up banners, booklets, and stickers are practical first products because the team already understands the production path.",
        icon: "i-lucide-lightbulb"
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/shops/[slug]/products/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-XnngaKgA.mjs.map
