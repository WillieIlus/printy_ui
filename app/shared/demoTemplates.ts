/**
 * Demo template dataset for the Template Gallery.
 * Categories and templates for browsing (no backend).
 */

export interface DemoCategory {
  key: string
  label: string
  icon: string
}

export interface DemoTemplateProviderShop {
  name: string
  slug: string
}

export interface DemoTemplate {
  id: string
  category: string
  name: string
  description: string
  unit: 'A4' | 'A3' | 'SQM'
  /** For digital: sheet size used in rate card (A5|A4|A3|SRA3) */
  sheetSize: 'A5' | 'A4' | 'A3' | 'SRA3'
  /** For digital: pieces per sheet (e.g. 10 for business cards, 4 for A5 flyers) */
  piecesPerSheet: number
  defaultSides: 1 | 2
  defaultQty: number
  defaultMaterial: string
  defaultFinishings: string[]
  /** For SQM: default width in meters */
  defaultWidthM?: number
  /** For SQM: default height in meters */
  defaultHeightM?: number
  demoImage?: string
  badge?: string
  /** Shop that provides this template (for demo display) */
  created_by_shop?: DemoTemplateProviderShop
}

export const categories: DemoCategory[] = [
  { key: 'business_cards', label: 'Business Cards', icon: 'i-lucide-credit-card' },
  { key: 'flyers', label: 'Flyers', icon: 'i-lucide-file-text' },
  { key: 'billboards', label: 'Billboards', icon: 'i-lucide-megaphone' },
  { key: 'rollup_banners', label: 'Roll-up Banners', icon: 'i-lucide-panel-top' },
  { key: 'notebooks', label: 'Notebooks', icon: 'i-lucide-book-open' },
  { key: 'magazines', label: 'Magazines', icon: 'i-lucide-book-marked' },
]

export const templates: DemoTemplate[] = [
  {
    id: 'bc-1',
    category: 'business_cards',
    name: 'Standard Business Card',
    description: 'Classic 90×50mm cards, ideal for networking.',
    unit: 'A4',
    sheetSize: 'SRA3',
    piecesPerSheet: 10,
    defaultSides: 2,
    defaultQty: 500,
    defaultMaterial: 'Paper 300gsm',
    defaultFinishings: ['LAMINATION', 'ROUND_EDGES'],
    badge: 'Popular',
    created_by_shop: { name: 'PrintPro Nairobi', slug: 'printpro-nairobi' },
  },
  {
    id: 'bc-2',
    category: 'business_cards',
    name: 'Premium Business Card',
    description: 'Thick art card with rounded corners.',
    unit: 'A4',
    sheetSize: 'SRA3',
    piecesPerSheet: 10,
    defaultSides: 2,
    defaultQty: 250,
    defaultMaterial: 'Art 350gsm',
    defaultFinishings: ['LAMINATION'],
  },
  {
    id: 'flyer-1',
    category: 'flyers',
    name: 'A5 Flyer',
    description: 'Compact flyers for events and promotions.',
    unit: 'A4',
    sheetSize: 'SRA3',
    piecesPerSheet: 4,
    defaultSides: 2,
    defaultQty: 1000,
    defaultMaterial: 'Paper 300gsm',
    defaultFinishings: ['CUTTING'],
    badge: 'Popular',
  },
  {
    id: 'flyer-2',
    category: 'flyers',
    name: 'A4 Flyer',
    description: 'Larger format for detailed messaging.',
    unit: 'A3',
    sheetSize: 'SRA3',
    piecesPerSheet: 2,
    defaultSides: 2,
    defaultQty: 500,
    defaultMaterial: 'Paper 300gsm',
    defaultFinishings: [],
  },
  {
    id: 'billboard-1',
    category: 'billboards',
    name: '6×3m Billboard',
    description: 'Large format outdoor advertising.',
    unit: 'SQM',
    sheetSize: 'SRA3',
    piecesPerSheet: 1,
    defaultSides: 1,
    defaultQty: 1,
    defaultMaterial: 'Vinyl',
    defaultFinishings: ['EYELETS'],
    defaultWidthM: 6,
    defaultHeightM: 3,
  },
  {
    id: 'billboard-2',
    category: 'billboards',
    name: '4×2m Billboard',
    description: 'Medium format outdoor display.',
    unit: 'SQM',
    sheetSize: 'SRA3',
    piecesPerSheet: 1,
    defaultSides: 1,
    defaultQty: 1,
    defaultMaterial: 'Vinyl',
    defaultFinishings: [],
    defaultWidthM: 4,
    defaultHeightM: 2,
  },
  {
    id: 'rollup-1',
    category: 'rollup_banners',
    name: '85×200cm Roll-up',
    description: 'Standard exhibition roll-up banner.',
    unit: 'SQM',
    sheetSize: 'SRA3',
    piecesPerSheet: 1,
    defaultSides: 1,
    defaultQty: 1,
    defaultMaterial: 'Banner',
    defaultFinishings: [],
    defaultWidthM: 0.85,
    defaultHeightM: 2,
    badge: 'Popular',
  },
  {
    id: 'rollup-2',
    category: 'rollup_banners',
    name: '100×200cm Roll-up',
    description: 'Wide format roll-up for events.',
    unit: 'SQM',
    sheetSize: 'SRA3',
    piecesPerSheet: 1,
    defaultSides: 1,
    defaultQty: 1,
    defaultMaterial: 'Banner',
    defaultFinishings: [],
    defaultWidthM: 1,
    defaultHeightM: 2,
  },
  {
    id: 'notebook-1',
    category: 'notebooks',
    name: 'A5 Notebook',
    description: 'Custom branded notebooks, 50 sheets.',
    unit: 'A4',
    sheetSize: 'A4',
    piecesPerSheet: 1,
    defaultSides: 2,
    defaultQty: 100,
    defaultMaterial: 'Bond 80gsm',
    defaultFinishings: [],
  },
  {
    id: 'magazine-1',
    category: 'magazines',
    name: 'A4 Magazine',
    description: 'Glossy magazine, saddle-stitched.',
    unit: 'A3',
    sheetSize: 'SRA3',
    piecesPerSheet: 2,
    defaultSides: 2,
    defaultQty: 200,
    defaultMaterial: 'Paper 300gsm',
    defaultFinishings: ['LAMINATION'],
  },
]

/** Get category by key */
export function getCategoryByKey(key: string): DemoCategory | undefined {
  return categories.find((c) => c.key === key)
}

/** Get templates by category */
export function getTemplatesByCategory(categoryKey: string): DemoTemplate[] {
  if (categoryKey === 'all') return templates
  return templates.filter((t) => t.category === categoryKey)
}
