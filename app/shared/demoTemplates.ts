/**
 * Demo templates (products) for the Template Gallery.
 *
 * Each template is a DemoProduct matching the backend ProductWriteSerializer,
 * plus gallery-specific fields (badge, demoImage, created_by_shop).
 *
 * Relationships:
 *   template.finishing_options[].finishing_rate  →  demoRateCard.finishing_rates[].id
 *   template.default_sheet_size                 →  demoRateCard.papers[].sheet_size
 */

import type {
  DemoProduct,
  DemoImposition,
  DemoCategory,
  DemoShop,
} from './demoTypes'

// ── Gallery-specific extension (beyond backend model) ───────────────

export interface DemoGalleryTemplate extends DemoProduct {
  badge?: string
  demoImage?: string
  created_by_shop?: { name: string; slug: string }
  /** Imposition: copies per sheet for sheet-mode products */
  copies_per_sheet: number
}

export { type DemoCategory }

// ── Categories ──────────────────────────────────────────────────────

export const categories: DemoCategory[] = [
  { key: 'business_cards', label: 'Business Cards', icon: 'i-lucide-credit-card' },
  { key: 'flyers',         label: 'Flyers',         icon: 'i-lucide-file-text' },
  { key: 'billboards',     label: 'Billboards',     icon: 'i-lucide-megaphone' },
  { key: 'rollup_banners', label: 'Roll-up Banners', icon: 'i-lucide-panel-top' },
  { key: 'notebooks',      label: 'Notebooks',      icon: 'i-lucide-book-open' },
  { key: 'magazines',      label: 'Magazines',      icon: 'i-lucide-book-marked' },
]

// ── Provider shop (for "Provided by …" display) ────────────────────

const printProShop: Pick<DemoShop, 'name' | 'slug'> = {
  name: 'PrintPro Nairobi',
  slug: 'printpro-nairobi',
}

// ── Templates ───────────────────────────────────────────────────────
// finishing_options.finishing_rate IDs reference demoRateCard.finishing_rates:
//   1 = Lamination, 2 = Round Edges, 3 = Cutting, 6 = Eyelets

export const templates: DemoGalleryTemplate[] = [
  // ── Business Cards ──
  {
    id: 1,
    name: 'Standard Business Card',
    description: 'Classic 90×50 mm cards, ideal for networking.',
    category: 'business_cards',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 90,
    default_finished_height_mm: 50,
    default_bleed_mm: 3,
    default_sides: 'DUPLEX',
    min_quantity: 100,
    default_sheet_size: 'SRA3',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 250,
    max_gsm: 350,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: '3500',
    highest_price: '6500',
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null },
      { finishing_rate: 2, is_default: false, price_adjustment: null },
    ],
    copies_per_sheet: 10,
    badge: 'Popular',
    created_by_shop: printProShop,
  },
  {
    id: 2,
    name: 'Premium Business Card',
    description: 'Thick art card with rounded corners.',
    category: 'business_cards',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 90,
    default_finished_height_mm: 50,
    default_bleed_mm: 3,
    default_sides: 'DUPLEX',
    min_quantity: 100,
    default_sheet_size: 'SRA3',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 300,
    max_gsm: 350,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: '5000',
    highest_price: '8000',
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null },
    ],
    copies_per_sheet: 10,
  },

  // ── Flyers ──
  {
    id: 3,
    name: 'A5 Flyer',
    description: 'Compact flyers for events and promotions.',
    category: 'flyers',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 148,
    default_finished_height_mm: 210,
    default_bleed_mm: 3,
    default_sides: 'DUPLEX',
    min_quantity: 100,
    default_sheet_size: 'SRA3',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 300,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: '8000',
    highest_price: '15000',
    finishing_options: [
      { finishing_rate: 3, is_default: false, price_adjustment: null },
    ],
    copies_per_sheet: 4,
    badge: 'Popular',
  },
  {
    id: 4,
    name: 'A4 Flyer',
    description: 'Larger format for detailed messaging.',
    category: 'flyers',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_bleed_mm: 3,
    default_sides: 'DUPLEX',
    min_quantity: 50,
    default_sheet_size: 'SRA3',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 300,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: '5000',
    highest_price: '12000',
    finishing_options: [],
    copies_per_sheet: 2,
  },

  // ── Billboards (large format) ──
  {
    id: 5,
    name: '6×3 m Billboard',
    description: 'Large format outdoor advertising.',
    category: 'billboards',
    pricing_mode: 'LARGE_FORMAT',
    default_finished_width_mm: 6000,
    default_finished_height_mm: 3000,
    default_bleed_mm: 0,
    default_sides: 'SIMPLEX',
    min_quantity: 1,
    default_sheet_size: '',
    min_width_mm: 1000,
    min_height_mm: 1000,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: '15300',
    highest_price: '15300',
    finishing_options: [
      { finishing_rate: 6, is_default: true, price_adjustment: null },
    ],
    copies_per_sheet: 1,
  },
  {
    id: 6,
    name: '4×2 m Billboard',
    description: 'Medium format outdoor display.',
    category: 'billboards',
    pricing_mode: 'LARGE_FORMAT',
    default_finished_width_mm: 4000,
    default_finished_height_mm: 2000,
    default_bleed_mm: 0,
    default_sides: 'SIMPLEX',
    min_quantity: 1,
    default_sheet_size: '',
    min_width_mm: 1000,
    min_height_mm: 1000,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: '6400',
    highest_price: '6400',
    finishing_options: [],
    copies_per_sheet: 1,
  },

  // ── Roll-up banners (large format) ──
  {
    id: 7,
    name: '85×200 cm Roll-up',
    description: 'Standard exhibition roll-up banner.',
    category: 'rollup_banners',
    pricing_mode: 'LARGE_FORMAT',
    default_finished_width_mm: 850,
    default_finished_height_mm: 2000,
    default_bleed_mm: 0,
    default_sides: 'SIMPLEX',
    min_quantity: 1,
    default_sheet_size: '',
    min_width_mm: 600,
    min_height_mm: 1500,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: '1292',
    highest_price: '1292',
    finishing_options: [],
    copies_per_sheet: 1,
    badge: 'Popular',
  },
  {
    id: 8,
    name: '100×200 cm Roll-up',
    description: 'Wide format roll-up for events.',
    category: 'rollup_banners',
    pricing_mode: 'LARGE_FORMAT',
    default_finished_width_mm: 1000,
    default_finished_height_mm: 2000,
    default_bleed_mm: 0,
    default_sides: 'SIMPLEX',
    min_quantity: 1,
    default_sheet_size: '',
    min_width_mm: 600,
    min_height_mm: 1500,
    min_gsm: null,
    max_gsm: null,
    allow_simplex: true,
    allow_duplex: false,
    is_active: true,
    lowest_price: '1520',
    highest_price: '1520',
    finishing_options: [],
    copies_per_sheet: 1,
  },

  // ── Notebooks (sheet mode) ──
  {
    id: 9,
    name: 'A5 Notebook',
    description: 'Custom branded notebooks, 50 sheets.',
    category: 'notebooks',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 148,
    default_finished_height_mm: 210,
    default_bleed_mm: 0,
    default_sides: 'DUPLEX',
    min_quantity: 50,
    default_sheet_size: 'A4',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 60,
    max_gsm: 100,
    allow_simplex: true,
    allow_duplex: true,
    is_active: true,
    lowest_price: '4000',
    highest_price: '8000',
    finishing_options: [],
    copies_per_sheet: 1,
  },

  // ── Magazines (sheet mode) ──
  {
    id: 10,
    name: 'A4 Magazine',
    description: 'Glossy magazine, saddle-stitched.',
    category: 'magazines',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_bleed_mm: 3,
    default_sides: 'DUPLEX',
    min_quantity: 50,
    default_sheet_size: 'SRA3',
    min_width_mm: null,
    min_height_mm: null,
    min_gsm: 130,
    max_gsm: 170,
    allow_simplex: false,
    allow_duplex: true,
    is_active: true,
    lowest_price: '16000',
    highest_price: '28000',
    finishing_options: [
      { finishing_rate: 1, is_default: true, price_adjustment: null },
    ],
    copies_per_sheet: 2,
  },
]

// ── Impositions (pre-computed for demo products) ────────────────────

export const impositions: DemoImposition[] = [
  { id: 1, product: 1, sheet_size: 'SRA3', copies_per_sheet: 10, is_default: true },
  { id: 2, product: 2, sheet_size: 'SRA3', copies_per_sheet: 10, is_default: true },
  { id: 3, product: 3, sheet_size: 'SRA3', copies_per_sheet: 4,  is_default: true },
  { id: 4, product: 4, sheet_size: 'SRA3', copies_per_sheet: 2,  is_default: true },
  { id: 5, product: 9, sheet_size: 'A4',   copies_per_sheet: 1,  is_default: true },
  { id: 6, product: 10, sheet_size: 'SRA3', copies_per_sheet: 2, is_default: true },
]

// ── Helper functions ────────────────────────────────────────────────

export function getCategoryByKey(key: string): DemoCategory | undefined {
  return categories.find((c) => c.key === key)
}

export function getTemplatesByCategory(categoryKey: string): DemoGalleryTemplate[] {
  if (categoryKey === 'all') return templates
  return templates.filter((t) => t.category === categoryKey)
}
