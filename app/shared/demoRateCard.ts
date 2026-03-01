/**
 * Demo rate card for the Template Gallery.
 * Used for mock pricing calculations (no backend).
 */

export type DemoUnit = 'A4' | 'A3' | 'SQM'

export interface DemoPrintingRate {
  sheet_size: 'A5' | 'A4' | 'A3' | 'SRA3'
  price_per_side: number
  price_double_sided: number // per sheet (duplex), not 2x per side
}

export interface DemoPaperRate {
  key: string
  label: string
  sheet_size: 'A5' | 'A4' | 'A3' | 'SRA3'
  gsm: number
  paper_type: string
  price_per_sheet: number
}

export interface DemoFinishingRate {
  id: string
  name: string
  category: string
  price: number
  charge_by: 'PER_SHEET' | 'PER_PIECE' | 'PER_JOB'
  is_default?: boolean
}

export interface DemoSqmMaterialRate {
  key: string
  label: string
  price_per_sqm: number
}

export interface DemoRateCard {
  printing: DemoPrintingRate[]
  paper: DemoPaperRate[]
  finishing: DemoFinishingRate[]
  sqm_printing_per_m2: number
  sqm_materials: DemoSqmMaterialRate[]
}

/** Default demo rate card for gallery pricing */
export const demoRateCard: DemoRateCard = {
  printing: [
    { sheet_size: 'A5', price_per_side: 12, price_double_sided: 20 },
    { sheet_size: 'A4', price_per_side: 18, price_double_sided: 32 },
    { sheet_size: 'A3', price_per_side: 35, price_double_sided: 60 },
    { sheet_size: 'SRA3', price_per_side: 45, price_double_sided: 75 },
  ],
  paper: [
    { key: 'bond80', sheet_size: 'A4', gsm: 80, paper_type: 'Bond', label: 'Bond 80gsm', price_per_sheet: 3.5 },
    { key: 'gloss150', sheet_size: 'A4', gsm: 150, paper_type: 'Gloss', label: 'Paper 300gsm', price_per_sheet: 8 },
    { key: 'art350', sheet_size: 'A4', gsm: 350, paper_type: 'Art', label: 'Art 350gsm', price_per_sheet: 12 },
    { key: 'gloss150_a3', sheet_size: 'A3', gsm: 150, paper_type: 'Gloss', label: 'Paper 300gsm', price_per_sheet: 16 },
    { key: 'gloss150_sra3', sheet_size: 'SRA3', gsm: 150, paper_type: 'Gloss', label: 'Paper 300gsm', price_per_sheet: 20 },
    { key: 'art350_sra3', sheet_size: 'SRA3', gsm: 350, paper_type: 'Art', label: 'Art 350gsm', price_per_sheet: 28 },
  ],
  finishing: [
    { id: 'LAMINATION', name: 'Lamination', category: 'LAMINATION', price: 25, charge_by: 'PER_SHEET' },
    { id: 'ROUND_EDGES', name: 'Round Edges', category: 'CUTTING', price: 15, charge_by: 'PER_JOB' },
    { id: 'CUTTING', name: 'Cutting', category: 'CUTTING', price: 1, charge_by: 'PER_PIECE' },
    { id: 'EYELETS', name: 'Eyelets', category: 'OTHER', price: 20, charge_by: 'PER_PIECE' },
  ],
  sqm_printing_per_m2: 350,
  sqm_materials: [
    { key: 'Vinyl', label: 'Vinyl', price_per_sqm: 450 },
    { key: 'Banner', label: 'Banner', price_per_sqm: 380 },
    { key: 'Reflective', label: 'Reflective', price_per_sqm: 520 },
  ],
}
