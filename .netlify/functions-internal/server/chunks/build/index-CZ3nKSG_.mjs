import { _ as __nuxt_component_2, a as _sfc_main$f, b as __nuxt_component_3$1, c as _sfc_main$9, u as usePublicApi, A as API } from './server.mjs';
import { _ as _sfc_main$1 } from './Badge-CGrQBVmm.mjs';
import { defineComponent, ref, computed, watch, withCtx, createTextVNode, createVNode, unref, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { u as usePrintySeo } from './usePrintySeo-DXO0KIvW.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const printProShop = {
  name: "PrintPro Nairobi",
  slug: "printpro-nairobi"
};
const templates = [
  // ── Business Cards ──
  {
    id: 1,
    name: "Standard Business Card",
    description: "Classic 90×50 mm cards, ideal for networking.",
    category: "business_cards",
    pricing_mode: "SHEET",
    default_finished_width_mm: 90,
    default_finished_height_mm: 50,
    default_bleed_mm: 3,
    default_sides: "DUPLEX",
    min_quantity: 100,
    default_sheet_size: "SRA3",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 250,
    max_gsm: 350,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: "3500",
    highest_price: "6500",
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null },
      { finishing_rate: 2, is_default: false, price_adjustment: null }
    ],
    copies_per_sheet: 10,
    badge: "Popular",
    created_by_shop: printProShop
  },
  {
    id: 2,
    name: "Premium Business Card",
    description: "Thick art card with rounded corners.",
    category: "business_cards",
    pricing_mode: "SHEET",
    default_finished_width_mm: 90,
    default_finished_height_mm: 50,
    default_bleed_mm: 3,
    default_sides: "DUPLEX",
    min_quantity: 100,
    default_sheet_size: "SRA3",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 300,
    max_gsm: 350,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: "5000",
    highest_price: "8000",
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null }
    ],
    copies_per_sheet: 10
  },
  // ── Flyers ──
  {
    id: 3,
    name: "A5 Flyer",
    description: "Compact flyers for events and promotions.",
    category: "flyers",
    pricing_mode: "SHEET",
    default_finished_width_mm: 148,
    default_finished_height_mm: 210,
    default_bleed_mm: 3,
    default_sides: "DUPLEX",
    min_quantity: 100,
    default_sheet_size: "SRA3",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 300,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: "8000",
    highest_price: "15000",
    finishing_options: [
      { finishing_rate: 3, is_default: false, price_adjustment: null }
    ],
    copies_per_sheet: 4,
    badge: "Popular"
  },
  {
    id: 4,
    name: "A4 Flyer",
    description: "Larger format for detailed messaging.",
    category: "flyers",
    pricing_mode: "SHEET",
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_bleed_mm: 3,
    default_sides: "DUPLEX",
    min_quantity: 50,
    default_sheet_size: "SRA3",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 300,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: "5000",
    highest_price: "12000",
    finishing_options: [],
    copies_per_sheet: 2
  },
  // ── Billboards (large format) ──
  {
    id: 5,
    name: "6×3 m Billboard",
    description: "Large format outdoor advertising.",
    category: "billboards",
    pricing_mode: "LARGE_FORMAT",
    default_finished_width_mm: 6e3,
    default_finished_height_mm: 3e3,
    default_bleed_mm: 0,
    default_sides: "SIMPLEX",
    min_quantity: 1,
    default_sheet_size: "",
    min_width_mm: 1e3,
    min_height_mm: 1e3,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: "15300",
    highest_price: "15300",
    finishing_options: [
      { finishing_rate: 6, is_default: true, price_adjustment: null }
    ],
    copies_per_sheet: 1
  },
  {
    id: 6,
    name: "4×2 m Billboard",
    description: "Medium format outdoor display.",
    category: "billboards",
    pricing_mode: "LARGE_FORMAT",
    default_finished_width_mm: 4e3,
    default_finished_height_mm: 2e3,
    default_bleed_mm: 0,
    default_sides: "SIMPLEX",
    min_quantity: 1,
    default_sheet_size: "",
    min_width_mm: 1e3,
    min_height_mm: 1e3,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: "6400",
    highest_price: "6400",
    finishing_options: [],
    copies_per_sheet: 1
  },
  // ── Roll-up banners (large format) ──
  {
    id: 7,
    name: "85×200 cm Roll-up",
    description: "Standard exhibition roll-up banner.",
    category: "rollup_banners",
    pricing_mode: "LARGE_FORMAT",
    default_finished_width_mm: 850,
    default_finished_height_mm: 2e3,
    default_bleed_mm: 0,
    default_sides: "SIMPLEX",
    min_quantity: 1,
    default_sheet_size: "",
    min_width_mm: 600,
    min_height_mm: 1500,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: "1292",
    highest_price: "1292",
    finishing_options: [],
    copies_per_sheet: 1,
    badge: "Popular"
  },
  {
    id: 8,
    name: "100×200 cm Roll-up",
    description: "Wide format roll-up for events.",
    category: "rollup_banners",
    pricing_mode: "LARGE_FORMAT",
    default_finished_width_mm: 1e3,
    default_finished_height_mm: 2e3,
    default_bleed_mm: 0,
    default_sides: "SIMPLEX",
    min_quantity: 1,
    default_sheet_size: "",
    min_width_mm: 600,
    min_height_mm: 1500,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: "1520",
    highest_price: "1520",
    finishing_options: [],
    copies_per_sheet: 1
  },
  // ── Notebooks (sheet mode) ──
  {
    id: 9,
    name: "A5 Notebook",
    description: "Custom branded notebooks, 50 sheets.",
    category: "notebooks",
    pricing_mode: "SHEET",
    default_finished_width_mm: 148,
    default_finished_height_mm: 210,
    default_bleed_mm: 0,
    default_sides: "DUPLEX",
    min_quantity: 50,
    default_sheet_size: "A4",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 60,
    max_gsm: 100,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: "4000",
    highest_price: "8000",
    finishing_options: [],
    copies_per_sheet: 1
  },
  // ── Magazines (sheet mode) ──
  {
    id: 10,
    name: "A4 Magazine",
    description: "Glossy magazine, saddle-stitched.",
    category: "magazines",
    pricing_mode: "SHEET",
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_bleed_mm: 3,
    default_sides: "DUPLEX",
    min_quantity: 50,
    default_sheet_size: "SRA3",
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 170,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: "16000",
    highest_price: "28000",
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null }
    ],
    copies_per_sheet: 2
  }
];
const shop = {
  id: 1,
  name: "PrintPro Nairobi",
  slug: "printpro-nairobi",
  currency: "KES",
  is_active: true
};
const machines = [
  { id: 1, name: "Konica Minolta C308", machine_type: "DIGITAL", max_width_mm: 320, max_height_mm: 450, min_gsm: 60, max_gsm: 350, is_active: true },
  { id: 2, name: "Roland TrueVIS VG3-640", machine_type: "LARGE_FORMAT", max_width_mm: 1625, max_height_mm: 99999, min_gsm: null, max_gsm: null, is_active: true }
];
const printingRatesArr = [
  { id: 1, sheet_size: "A4", color_mode: "BW", single_price: "10", double_price: "18", is_active: true },
  { id: 2, sheet_size: "A4", color_mode: "COLOR", single_price: "18", double_price: "32", is_active: true },
  { id: 3, sheet_size: "A3", color_mode: "BW", single_price: "20", double_price: "35", is_active: true },
  { id: 4, sheet_size: "A3", color_mode: "COLOR", single_price: "35", double_price: "60", is_active: true },
  { id: 5, sheet_size: "SRA3", color_mode: "BW", single_price: "25", double_price: "42", is_active: true },
  { id: 6, sheet_size: "SRA3", color_mode: "COLOR", single_price: "45", double_price: "75", is_active: true }
];
const papersArr = [
  { id: 1, sheet_size: "A4", gsm: 80, paper_type: "UNCOATED", width_mm: null, height_mm: null, buying_price: "2", selling_price: "3.5", quantity_in_stock: 5e3, reorder_level: 500, is_active: true },
  { id: 2, sheet_size: "A4", gsm: 130, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "4", selling_price: "6", quantity_in_stock: 3e3, reorder_level: 300, is_active: true },
  { id: 3, sheet_size: "A4", gsm: 150, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "5", selling_price: "8", quantity_in_stock: 2e3, reorder_level: 200, is_active: true },
  { id: 4, sheet_size: "A4", gsm: 300, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "7", selling_price: "12", quantity_in_stock: 1e3, reorder_level: 100, is_active: true },
  { id: 5, sheet_size: "A4", gsm: 350, paper_type: "COATED", width_mm: null, height_mm: null, buying_price: "9", selling_price: "15", quantity_in_stock: 800, reorder_level: 100, is_active: true },
  { id: 6, sheet_size: "A3", gsm: 130, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "8", selling_price: "12", quantity_in_stock: 1500, reorder_level: 200, is_active: true },
  { id: 7, sheet_size: "A3", gsm: 300, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "12", selling_price: "20", quantity_in_stock: 800, reorder_level: 100, is_active: true },
  { id: 8, sheet_size: "SRA3", gsm: 150, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "10", selling_price: "16", quantity_in_stock: 1e3, reorder_level: 100, is_active: true },
  { id: 9, sheet_size: "SRA3", gsm: 300, paper_type: "GLOSS", width_mm: null, height_mm: null, buying_price: "15", selling_price: "24", quantity_in_stock: 600, reorder_level: 100, is_active: true },
  { id: 10, sheet_size: "SRA3", gsm: 350, paper_type: "COATED", width_mm: null, height_mm: null, buying_price: "18", selling_price: "28", quantity_in_stock: 400, reorder_level: 50, is_active: true }
];
const finishingRatesArr = [
  { id: 1, name: "Lamination", charge_unit: "PER_SHEET", price: "25", setup_fee: null, min_qty: null, is_active: true },
  { id: 2, name: "Round Edges", charge_unit: "FLAT", price: "15", setup_fee: null, min_qty: null, is_active: true },
  { id: 3, name: "Cutting", charge_unit: "PER_PIECE", price: "1", setup_fee: null, min_qty: null, is_active: true },
  { id: 4, name: "Binding", charge_unit: "FLAT", price: "120", setup_fee: null, min_qty: 10, is_active: true },
  { id: 5, name: "Folding", charge_unit: "PER_SHEET", price: "2", setup_fee: null, min_qty: null, is_active: true },
  { id: 6, name: "Eyelets", charge_unit: "PER_PIECE", price: "20", setup_fee: null, min_qty: null, is_active: true }
];
const materialsArr = [
  { id: 1, material_type: "Vinyl", unit: "SQM", buying_price: "300", selling_price: "450", is_active: true },
  { id: 2, material_type: "Banner", unit: "SQM", buying_price: "250", selling_price: "380", is_active: true },
  { id: 3, material_type: "Reflective", unit: "SQM", buying_price: "380", selling_price: "520", is_active: true }
];
const demoRateCard = {
  shop,
  machines,
  printing_rates: printingRatesArr,
  papers: papersArr,
  finishing_rates: finishingRatesArr,
  materials: materialsArr
};
function toRateCardForCompute(rc) {
  if ("templates" in rc) {
    return {
      printing_rates: rc.printing_rates,
      papers: rc.papers,
      finishing_rates: rc.finishing_rates,
      materials: rc.materials
    };
  }
  return {
    printing_rates: rc.printing_rates,
    papers: rc.papers,
    finishing_rates: rc.finishing_rates,
    materials: rc.materials
  };
}
function computeDemoQuote(template, rateCard) {
  const rc = toRateCardForCompute(rateCard);
  if (template.pricing_mode === "LARGE_FORMAT") {
    return computeLargeFormatQuote(template, rc);
  }
  return computeSheetQuote(template, rc);
}
function computeSheetQuote(template, rateCard) {
  const qty = template.min_quantity;
  const copiesPerSheet = Math.max(1, template.copies_per_sheet);
  const sheetsNeeded = Math.ceil(qty / copiesPerSheet);
  const sheetSize = template.default_sheet_size || "SRA3";
  const isDuplex = template.default_sides === "DUPLEX";
  const printRate = rateCard.printing_rates.find(
    (r) => r.sheet_size === sheetSize && r.color_mode === "COLOR" && r.is_active
  );
  const printing = printRate ? sheetsNeeded * parseFloat(isDuplex ? printRate.double_price : printRate.single_price) : 0;
  const targetGsm = template.min_gsm ?? 150;
  const eligiblePapers = rateCard.papers.filter(
    (p) => p.sheet_size === sheetSize && p.gsm >= targetGsm && p.is_active
  );
  const paper = eligiblePapers.length ? eligiblePapers.sort((a, b) => a.gsm - b.gsm)[0] : rateCard.papers.filter((p) => p.sheet_size === sheetSize && p.is_active).sort((a, b) => a.gsm - b.gsm)[0];
  const materialCost = paper ? sheetsNeeded * parseFloat(paper.selling_price) : 0;
  const finishing = computeFinishingCost(template, rateCard, sheetsNeeded, qty);
  return {
    printing,
    material: materialCost,
    finishing,
    total: printing + materialCost + finishing
  };
}
function computeLargeFormatQuote(template, rateCard) {
  const widthM = template.default_finished_width_mm / 1e3;
  const heightM = template.default_finished_height_mm / 1e3;
  const qty = template.min_quantity;
  const areaSqm = widthM * heightM * qty;
  const mat = rateCard.materials.find((m) => m.is_active);
  const materialCost = mat ? areaSqm * parseFloat(mat.selling_price) : 0;
  const sqmPrintRate = 350;
  const printing = areaSqm * sqmPrintRate;
  const finishing = computeFinishingCost(template, rateCard, qty, qty);
  return {
    printing,
    material: materialCost,
    finishing,
    total: printing + materialCost + finishing
  };
}
function computeFinishingCost(template, rateCard, sheets, pieces) {
  let total = 0;
  for (const opt of template.finishing_options) {
    const rate = rateCard.finishing_rates.find((f) => f.id === opt.finishing_rate);
    if (!rate || !rate.is_active) continue;
    const price = opt.price_adjustment != null && opt.price_adjustment !== "" ? parseFloat(opt.price_adjustment) : parseFloat(rate.price);
    switch (rate.charge_unit) {
      case "PER_SHEET":
        total += sheets * price;
        break;
      case "PER_PIECE":
        total += pieces * price;
        break;
      case "PER_SQM":
        total += pieces * price;
        break;
      case "FLAT":
        total += price;
        break;
    }
    if (rate.setup_fee) {
      total += parseFloat(rate.setup_fee);
    }
  }
  return total;
}
function normalizeApiTemplate(t) {
  return {
    ...t,
    default_bleed_mm: 3,
    min_width_mm: null,
    min_height_mm: null,
    allow_simplex: true,
    allow_duplex: true,
    lowest_price: null,
    highest_price: null,
    finishing_options: t.finishing_options.map((o) => ({
      finishing_rate: o.finishing_rate,
      is_default: o.is_default,
      price_adjustment: o.price_adjustment
    }))
  };
}
function useDemoCalculator() {
  const publicApi = usePublicApi();
  const rateCardFromApi = ref(null);
  const demoTemplatesList = computed(() => {
    const rc = rateCardFromApi.value;
    if (rc?.templates?.length) {
      return rc.templates.map(normalizeApiTemplate);
    }
    return templates;
  });
  const apiAvailable = computed(() => !!rateCardFromApi.value);
  const finishingRatesForLabels = computed(() => {
    const rc = rateCardFromApi.value;
    if (rc?.finishing_rates?.length) {
      return rc.finishing_rates.map((f) => ({ id: f.id, name: f.name }));
    }
    return demoRateCard.finishing_rates.map((f) => ({ id: f.id, name: f.name }));
  });
  async function fetchTemplates() {
    try {
      const shopsRes = await publicApi(API.publicShops());
      const shops = shopsRes?.results ?? (Array.isArray(shopsRes) ? shopsRes : []);
      const first = shops[0];
      const firstSlug = first?.slug;
      if (firstSlug) {
        const res = await publicApi(
          API.shopRateCardForCalculator(firstSlug)
        );
        if (res?.templates?.length || res?.papers?.length) {
          rateCardFromApi.value = res;
          return;
        }
      }
    } catch {
    }
    rateCardFromApi.value = null;
  }
  async function computeQuote(productId, quantity, sheetSize, gsm) {
    const rc = rateCardFromApi.value;
    if (rc) {
      const tmpl2 = rc.templates.find((t) => t.id === productId);
      if (!tmpl2) return { printing: 0, material: 0, finishing: 0, total: 0 };
      return computeDemoQuote(
        { ...tmpl2, min_quantity: quantity },
        rc
      );
    }
    const tmpl = templates.find((t) => t.id === productId);
    if (!tmpl) return { printing: 0, material: 0, finishing: 0, total: 0 };
    return computeDemoQuote(
      { ...tmpl, min_quantity: quantity },
      demoRateCard
    );
  }
  return {
    demoTemplatesList,
    apiAvailable,
    finishingRatesForLabels,
    fetchTemplates,
    computeQuote
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      demoTemplatesList,
      computeQuote,
      finishingRatesForLabels
    } = useDemoCalculator();
    const formatDemoKES = (value) => {
      const rounded = Math.round(value);
      return `KES ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    };
    usePrintySeo({
      title: "Instant Printing Quotes",
      description: "Get instant printing quotes for business cards, flyers, posters, and more. Browse templates, compare prices, and request quotes from trusted print shops in Kenya."
    });
    const calculatorMounted = ref(false);
    const demoResult = ref({ printing: 0, material: 0, finishing: 0, total: 0 });
    ref([]);
    ref(true);
    ref([]);
    ref(true);
    const selectedDemoId = ref(1);
    const demoQty = ref(100);
    const selectedDemo = computed(() => {
      const list = demoTemplatesList.value;
      if (!list.length) return null;
      const tmpl = list.find((t) => t.id === selectedDemoId.value);
      return tmpl ? { ...tmpl, min_quantity: tmpl.min_quantity || 100 } : list[0];
    });
    watch(
      [selectedDemo, () => demoQty.value],
      async ([demo, qty]) => {
        const d = demo;
        const q = qty;
        if (!d) return;
        const result = await computeQuote(
          d.id,
          q,
          d.default_sheet_size || void 0,
          d.min_gsm ?? void 0
        );
        demoResult.value = result;
      },
      { immediate: true }
    );
    const demoSheetsNeeded = computed(() => {
      if (!selectedDemo.value || selectedDemo.value.pricing_mode !== "SHEET") return 0;
      const cps = Math.max(1, selectedDemo.value.copies_per_sheet);
      return Math.ceil(demoQty.value / cps);
    });
    const demoAreaSqm = computed(() => {
      if (!selectedDemo.value || selectedDemo.value.pricing_mode !== "LARGE_FORMAT") return 0;
      return selectedDemo.value.default_finished_width_mm / 1e3 * (selectedDemo.value.default_finished_height_mm / 1e3) * demoQty.value;
    });
    const demoFinishingLabels = computed(() => {
      if (!selectedDemo.value?.finishing_options) return [];
      return selectedDemo.value.finishing_options.map((opt) => finishingRatesForLabels.value.find((f) => f.id === opt.finishing_rate)?.name).filter(Boolean);
    });
    const formatDemoUnitPrice = computed(() => {
      if (!demoResult.value.total || !demoQty.value) return "—";
      const unitPrice = demoResult.value.total / demoQty.value;
      return unitPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_2;
      const _component_UIcon = _sfc_main$f;
      const _component_ClientOnly = __nuxt_component_3$1;
      const _component_UButton = _sfc_main$9;
      const _component_UBadge = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><section id="top" class="relative overflow-hidden bg-[#101828] py-20 sm:py-28 w-screen max-w-none left-1/2 -translate-x-1/2"><div class="absolute inset-0 opacity-20"><div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div><div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div><div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div></div><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"><div class="max-w-2xl"><h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"> Instant printing quotes </h1><p class="mt-6 text-lg text-gray-300 leading-relaxed"> Browse templates, get instant pricing, and request quotes from trusted print shops. Business cards, flyers, posters, and more. </p><div class="mt-8 flex flex-col sm:flex-row gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center justify-center rounded-xl bg-white/90 dark:bg-gray-100 px-6 py-3.5 text-sm font-bold text-[#101828] dark:text-gray-900 hover:bg-white dark:hover:bg-gray-200 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Get a quote `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-chevron-right",
              class: "ml-2 w-4 h-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Get a quote "),
              createVNode(_component_UIcon, {
                name: "i-lucide-chevron-right",
                class: "ml-2 w-4 h-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/#how-it-works",
        class: "inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` How it works `);
          } else {
            return [
              createTextVNode(" How it works ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mt-16 lg:mt-0 relative min-h-[320px]"><a href="#models" class="block rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl hover:bg-white/10 transition-colors"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-flamingo-300">Live Quote Preview</p><h3 class="mt-2 text-xl font-bold text-white">Instant pricing demo</h3><p class="mt-2 text-sm text-gray-300">Business cards, flyers, posters — calculated in seconds.</p></div><div class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-gray-200">Demo</div></div><div class="mt-6 grid grid-cols-2 gap-3"><div class="rounded-2xl bg-white/5 border border-white/10 p-4"><p class="text-xs text-gray-400">Product</p><p class="mt-1 text-sm font-semibold text-white">Business Cards</p></div><div class="rounded-2xl bg-white/5 border border-white/10 p-4"><p class="text-xs text-gray-400">Quantity</p><p class="mt-1 text-sm font-semibold text-white">500 pcs</p></div><div class="rounded-2xl bg-white/5 border border-white/10 p-4"><p class="text-xs text-gray-400">Paper</p><p class="mt-1 text-sm font-semibold text-white">300gsm Art Card</p></div><div class="rounded-2xl bg-white/5 border border-white/10 p-4"><p class="text-xs text-gray-400">Finishing</p><p class="mt-1 text-sm font-semibold text-white">Matte Lamination</p></div></div><div class="mt-6 rounded-2xl border border-white/10 bg-[#0b1220] p-4"><div class="flex justify-between text-sm"><span class="text-gray-400">Material</span><span class="text-gray-200">KES 1,200</span></div><div class="mt-2 flex justify-between text-sm"><span class="text-gray-400">Printing</span><span class="text-gray-200">KES 800</span></div><div class="mt-2 flex justify-between text-sm"><span class="text-gray-400">Finishing</span><span class="text-gray-200">KES 500</span></div><div class="mt-4 border-t border-white/10 pt-4 flex justify-between"><span class="text-sm font-semibold text-white">Estimated total</span><span class="text-2xl font-extrabold text-flamingo-400">KES 2,500</span></div></div><p class="mt-4 text-center text-sm text-flamingo-300 font-medium">Try the calculator below ↓</p></a></div></div></div></section><section id="how-it-works" class="scroll-mt-20">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-16 sm:py-24"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "py-16 sm:py-24" })
            ];
          }
        })
      }, _parent));
      _push(`</section>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-16 sm:py-24"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "py-16 sm:py-24" })
            ];
          }
        })
      }, _parent));
      _push(`<section id="models" class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#101828]"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="max-w-2xl mb-10"><div class="inline-flex items-center gap-2 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 mb-4">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-flask-conical",
        class: "h-3.5 w-3.5"
      }, null, _parent));
      _push(` Demo — No login required </div><h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"> Try the pricing calculator </h2><p class="mt-4 text-base text-gray-600 dark:text-gray-400"> Select a product, tweak options, and see how pricing is calculated in real time using demo data. </p></div><div class="flex flex-wrap gap-3 mb-8"><!--[-->`);
      ssrRenderList(unref(demoTemplatesList), (tmpl) => {
        _push(`<button class="${ssrRenderClass([unref(selectedDemoId) === tmpl.id ? "border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300 shadow-sm" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600", "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all"])}">${ssrInterpolate(tmpl.name)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(calculatorMounted) && unref(selectedDemo)) {
        _push(`<div class="grid gap-8 lg:grid-cols-2"><div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8 space-y-5"><h3 class="text-lg font-bold text-gray-900 dark:text-white">${ssrInterpolate(unref(selectedDemo).name)}</h3><p class="text-sm text-gray-500 dark:text-gray-400">${ssrInterpolate(unref(selectedDemo).description)}</p><div class="grid grid-cols-2 gap-4"><div><label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Size</label><p class="text-sm font-medium text-gray-800 dark:text-gray-200">${ssrInterpolate(unref(selectedDemo).default_finished_width_mm)}×${ssrInterpolate(unref(selectedDemo).default_finished_height_mm)}mm</p></div><div><label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sides</label><p class="text-sm font-medium text-gray-800 dark:text-gray-200">${ssrInterpolate(unref(selectedDemo).default_sides === "DUPLEX" ? "Double-sided" : "Single-sided")}</p></div></div><div><label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</label><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "xs",
          color: "neutral",
          icon: "i-lucide-minus",
          onClick: ($event) => demoQty.value = Math.max(unref(selectedDemo).min_quantity, unref(demoQty) - 50)
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(demoQty))} type="number"${ssrRenderAttr("min", unref(selectedDemo).min_quantity)} class="w-24 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">`);
        _push(ssrRenderComponent(_component_UButton, {
          variant: "soft",
          size: "xs",
          color: "neutral",
          icon: "i-lucide-plus",
          onClick: ($event) => demoQty.value += 50
        }, null, _parent));
        _push(`</div><p class="mt-1 text-xs text-gray-400">Min: ${ssrInterpolate(unref(selectedDemo).min_quantity)}</p></div>`);
        if (unref(selectedDemo).pricing_mode === "SHEET") {
          _push(`<div><label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Imposition</label><p class="text-sm text-gray-700 dark:text-gray-300">${ssrInterpolate(unref(selectedDemo).default_sheet_size || "SRA3")}: ${ssrInterpolate(unref(selectedDemo).copies_per_sheet ?? 1)}-up · ${ssrInterpolate(unref(demoSheetsNeeded))} sheets needed </p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(demoFinishingLabels).length) {
          _push(`<div><label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Finishing</label><div class="flex flex-wrap gap-1"><!--[-->`);
          ssrRenderList(unref(demoFinishingLabels), (f) => {
            _push(ssrRenderComponent(_component_UBadge, {
              key: f,
              variant: "soft",
              color: "neutral",
              size: "xs"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(f)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(f), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 space-y-5"><h3 class="text-lg font-bold text-gray-900 dark:text-white">Price Breakdown</h3><div class="space-y-3"><div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Material (paper/media)</span><span class="font-medium text-gray-800 dark:text-gray-200">${ssrInterpolate(formatDemoKES(unref(demoResult).material ?? 0))}</span></div><div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Printing</span><span class="font-medium text-gray-800 dark:text-gray-200">${ssrInterpolate(formatDemoKES(unref(demoResult).printing ?? 0))}</span></div>`);
        if ((unref(demoResult).finishing ?? 0) > 0) {
          _push(`<div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Finishing</span><span class="font-medium text-gray-800 dark:text-gray-200">${ssrInterpolate(formatDemoKES(unref(demoResult).finishing ?? 0))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between"><span class="font-bold text-gray-900 dark:text-white">Total</span><span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">${ssrInterpolate(formatDemoKES(unref(demoResult).total ?? 0))}</span></div><div class="flex justify-between text-xs text-gray-400"><span>Unit price</span><span>KES ${ssrInterpolate(unref(formatDemoUnitPrice))}</span></div></div><div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 mt-4"><p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">How it&#39;s calculated</p>`);
        if (unref(selectedDemo).pricing_mode === "SHEET") {
          _push(`<div class="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1"><p>sheets = ceil(${ssrInterpolate(unref(demoQty))} / ${ssrInterpolate(unref(selectedDemo).copies_per_sheet)}) = ${ssrInterpolate(unref(demoSheetsNeeded))}</p><p>material = ${ssrInterpolate(unref(demoSheetsNeeded))} sheets × paper_cost</p><p>printing = ${ssrInterpolate(unref(demoSheetsNeeded))} sheets × click_rate</p><p>total = material + printing + finishing</p></div>`);
        } else {
          _push(`<div class="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1"><p>area = ${ssrInterpolate((unref(selectedDemo).default_finished_width_mm / 1e3).toFixed(1))}m × ${ssrInterpolate((unref(selectedDemo).default_finished_height_mm / 1e3).toFixed(1))}m × ${ssrInterpolate(unref(demoQty))} = ${ssrInterpolate(unref(demoAreaSqm).toFixed(2))} sqm</p><p>material = ${ssrInterpolate(unref(demoAreaSqm).toFixed(2))} sqm × material_rate</p><p>total = material + printing + finishing</p></div>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="grid gap-8 lg:grid-cols-2"><div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8"><div class="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="mt-4 h-4 w-full rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="mt-2 h-4 w-[80%] rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="mt-6 space-y-3"><div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div></div></div><div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8"><div class="h-6 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div><div class="mt-6 space-y-3"><div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse"></div><div class="h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mt-4"></div></div></div></div>`);
      }
      _push(`</div></section><section id="cta" class="py-16 sm:py-24 bg-[#101828] text-white"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4"> Turn pricing from guesswork into a system. </h2><p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"> Configure your shop once and generate fast, accurate, and profitable quotes every time. </p><div class="flex flex-col sm:flex-row gap-4 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/signup",
        class: "btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-colors hover:shadow-[#e13515]/40"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Create your first shop `);
          } else {
            return [
              createTextVNode(" Create your first shop ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to Gallery `);
          } else {
            return [
              createTextVNode(" Back to Gallery ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#0f1729]"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="mb-12 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6"><div class="flex flex-wrap items-center gap-3"><span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Browse:</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Shops`);
          } else {
            return [
              createTextVNode("Shops")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products",
        class: "text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Products`);
          } else {
            return [
              createTextVNode("Products")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/locations",
        class: "text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Locations`);
          } else {
            return [
              createTextVNode("Locations")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Gallery`);
          } else {
            return [
              createTextVNode("Gallery")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><span class="hidden text-gray-400 sm:inline">|</span><div class="flex flex-wrap items-center gap-3"><span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular:</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products/business-cards",
        class: "text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Business cards`);
          } else {
            return [
              createTextVNode("Business cards")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products/flyers",
        class: "text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Flyers`);
          } else {
            return [
              createTextVNode("Flyers")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/products/posters",
        class: "text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Posters`);
          } else {
            return [
              createTextVNode("Posters")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="mb-16"><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl"> Print Shops </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/shops",
        class: "inline-flex items-center gap-1.5 text-sm font-semibold text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-700 dark:hover:text-flamingo-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View all "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(4, (i) => {
              _push2(`<div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 h-32"${_scopeId}></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                (openBlock(), createBlock(Fragment, null, renderList(4, (i) => {
                  return createVNode("div", {
                    key: i,
                    class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 h-32"
                  });
                }), 64))
              ])
            ];
          }
        })
      }, _parent));
      _push(`</div><div><div class="flex items-center justify-between mb-6"><h2 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl"> Product Gallery </h2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/gallery",
        class: "inline-flex items-center gap-1.5 text-sm font-semibold text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-700 dark:hover:text-flamingo-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View all `);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-lucide-arrow-right",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" View all "),
              createVNode(_component_UIcon, {
                name: "i-lucide-arrow-right",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(4, (i) => {
              _push2(`<div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden aspect-[4/3]"${_scopeId}></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" }, [
                (openBlock(), createBlock(Fragment, null, renderList(4, (i) => {
                  return createVNode("div", {
                    key: i,
                    class: "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden aspect-[4/3]"
                  });
                }), 64))
              ])
            ];
          }
        })
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CZ3nKSG_.mjs.map
