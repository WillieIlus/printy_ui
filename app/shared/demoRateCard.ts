/**
 * Demo rate card — realistic pricing data aligned with backend models.
 *
 * Field names and types match the Django serializers:
 *   PrintingRate  → { id, sheet_size, color_mode, single_price, double_price, is_active }
 *   Paper         → { id, sheet_size, gsm, paper_type, selling_price, … }
 *   FinishingRate → { id, name, charge_unit, price, setup_fee, min_qty, is_active }
 *   Material      → { id, material_type, unit, selling_price, … }
 */

import type {
  DemoShop,
  DemoMachine,
  DemoPrintingRate,
  DemoPaper,
  DemoFinishingRate,
  DemoMaterial,
  DemoRateCard,
  DemoUnit,
  DemoMaterialKey,
  DemoFinishingKey,
  DemoFormState,
  DemoPreset,
} from './demoTypes'

export type {
  DemoUnit,
  DemoMaterialKey as DemoMaterial,
  DemoFinishingKey as DemoFinishing,
  DemoFormState,
  DemoPreset,
}

// ── Shop ────────────────────────────────────────────────────────────────

const shop: DemoShop = {
  id: 1,
  name: 'PrintPro Nairobi',
  slug: 'printpro-nairobi',
  currency: 'KES',
  is_active: true,
}

// ── Machines ────────────────────────────────────────────────────────────

const machines: DemoMachine[] = [
  { id: 1, name: 'Konica Minolta C308', machine_type: 'DIGITAL', max_width_mm: 320, max_height_mm: 450, min_gsm: 60, max_gsm: 350, is_active: true },
  { id: 2, name: 'Roland TrueVIS VG3-640', machine_type: 'LARGE_FORMAT', max_width_mm: 1625, max_height_mm: 99999, min_gsm: null, max_gsm: null, is_active: true },
]

// ── Printing rates (per sheet — BW and COLOR for each size) ─────────

const printingRatesArr: DemoPrintingRate[] = [
  { id: 1, sheet_size: 'A4', color_mode: 'BW',    single_price: '5',  double_price: '10', duplex_surcharge: '3', duplex_surcharge_enabled: true, duplex_surcharge_min_gsm: 80, is_active: true },
  { id: 2, sheet_size: 'A4', color_mode: 'COLOR', single_price: '10',  double_price: '20', duplex_surcharge: '5', duplex_surcharge_enabled: true, duplex_surcharge_min_gsm: 130, is_active: true },
  { id: 3, sheet_size: 'A3', color_mode: 'BW',    single_price: '8',  double_price: '16', duplex_surcharge: '4', duplex_surcharge_enabled: true, duplex_surcharge_min_gsm: 130, is_active: true },
  { id: 4, sheet_size: 'A3', color_mode: 'COLOR', single_price: '15',  double_price: '30', duplex_surcharge: '8', duplex_surcharge_enabled: true, duplex_surcharge_min_gsm: 150, is_active: true },
]

// ── Papers (selling_price per sheet at various GSMs) ────────────────

const papersArr: DemoPaper[] = [
  { id: 1, sheet_size: 'A4', gsm: 130, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '5',  selling_price: '10',   quantity_in_stock: 3000, reorder_level: 300, is_active: true },
  { id: 2, sheet_size: 'A4', gsm: 150, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '7',  selling_price: '12',   quantity_in_stock: 2000, reorder_level: 200, is_active: true },
  { id: 3, sheet_size: 'A4', gsm: 170, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '8',  selling_price: '13',   quantity_in_stock: 1000, reorder_level: 100, is_active: true },
  { id: 4, sheet_size: 'A4', gsm: 200, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '9',  selling_price: '14',   quantity_in_stock: 1000, reorder_level: 100, is_active: true },
  { id: 5, sheet_size: 'A4', gsm: 250, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '10', selling_price: '15',   quantity_in_stock: 1000, reorder_level: 100, is_active: true },
  { id: 6, sheet_size: 'A4', gsm: 300, paper_type: 'UNCOATED', width_mm: null, height_mm: null, buying_price: '15', selling_price: '20',   quantity_in_stock: 800,  reorder_level: 100, is_active: true },
  { id: 7, sheet_size: 'A4', gsm: 350, paper_type: 'MATTE', width_mm: null, height_mm: null, buying_price: '35', selling_price: '40',   quantity_in_stock: 800,  reorder_level: 100, is_active: true },
]

// ── Finishing rates ─────────────────────────────────────────────────

const finishingRatesArr: DemoFinishingRate[] = [
  { id: 1, name: 'Lamination',   charge_unit: 'PER_SIDE_PER_SHEET', price: '12.50', setup_fee: null, min_qty: null, is_active: true },
  { id: 2, name: 'Round Edges',  charge_unit: 'FLAT',      price: '15',  setup_fee: null, min_qty: null, is_active: true },
  { id: 3, name: 'Cutting',      charge_unit: 'PER_PIECE', price: '1',   setup_fee: null, min_qty: null, is_active: true },
  { id: 4, name: 'Binding',      charge_unit: 'FLAT',      price: '120', setup_fee: null, min_qty: 10,   is_active: true },
  { id: 5, name: 'Folding',      charge_unit: 'PER_SHEET', price: '2',   setup_fee: null, min_qty: null, is_active: true },
  { id: 6, name: 'Eyelets',      charge_unit: 'PER_PIECE', price: '20',  setup_fee: null, min_qty: null, is_active: true },
]

// ── Materials (large format) ────────────────────────────────────────

const materialsArr: DemoMaterial[] = [
  { id: 1, material_type: 'Vinyl',      unit: 'SQM', buying_price: '300', selling_price: '450', is_active: true },
  { id: 2, material_type: 'Banner',     unit: 'SQM', buying_price: '250', selling_price: '380', is_active: true },
  { id: 3, material_type: 'Reflective', unit: 'SQM', buying_price: '380', selling_price: '520', is_active: true },
]

// ── Assembled rate card ─────────────────────────────────────────────

export const demoRateCard: DemoRateCard = {
  shop,
  machines,
  printing_rates: printingRatesArr,
  papers: papersArr,
  finishing_rates: finishingRatesArr,
  materials: materialsArr,
}

// ── Flat lookup maps for LandingQuoteSimulator ──────────────────────
// These provide O(1) access by unit / material key / finishing name.

export const printingRates: Record<DemoUnit, { oneSided: number; duplex: number }> = {
  A4:  { oneSided: 10, duplex: 25 },
  A3:  { oneSided: 15, duplex: 38 },
  SQM: { oneSided: 350, duplex: 350 },
}

export const materialRates: Record<DemoUnit, Record<string, number>> = {
  A4: { '130gsm': 10, '150gsm': 12, '170gsm': 13, '200gsm': 14, '250gsm': 15, '300gsm': 20, '350gsm': 40 },
  A3: { '130gsm': 12, '150gsm': 16, '300gsm': 20 },
  SQM: { Banner: 380, Vinyl: 450, Reflective: 520 },
}

export const finishingRates: Record<string, { price: number; chargeBy: 'per_sheet' | 'flat' }> = {
  Lamination:    { price: 25, chargeBy: 'per_sheet' },
  'Round edges': { price: 15, chargeBy: 'flat' },
  Binding:       { price: 120, chargeBy: 'flat' },
  Folding:       { price: 2, chargeBy: 'per_sheet' },
}

// ── Template presets for LandingTemplateGallery ─────────────────────

export const templatePresets: DemoPreset[] = [
  { id: 'business-cards', name: 'Business Cards', unit: 'A4', sides: 2, quantity: 500,  material: '300gsm',  finishing: ['Lamination'] },
  { id: 'a5-flyers',      name: 'A5 Flyers',      unit: 'A4', sides: 2, quantity: 1000, material: '150gsm',  finishing: [] },
  { id: 'posters',        name: 'A3 Posters',     unit: 'A3', sides: 1, quantity: 50,   material: '150gsm',  finishing: ['Lamination'] },
  { id: 'stickers',       name: 'Stickers',       unit: 'A4', sides: 1, quantity: 200,  material: '130gsm',  finishing: [] },
  { id: 'banners',        name: 'Vinyl Banner',   unit: 'SQM', sides: 1, quantity: 1,   material: 'Vinyl',   finishing: [], widthM: 3, heightM: 1 },
  { id: 'invitations',    name: 'Invitations',    unit: 'A4', sides: 2, quantity: 100,  material: '300gsm',  finishing: ['Lamination', 'Round edges'] },
]
