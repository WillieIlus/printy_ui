/**
 * Demo types that mirror backend serializer shapes.
 *
 * Every interface here maps 1:1 to the corresponding Django serializer
 * field list so demo data stays in sync with the real API.
 *
 * Backend choices are replicated as union types.
 */

// ── Backend choices ─────────────────────────────────────────────────────

export type SheetSize = 'A4' | 'A3' | 'SRA3' | 'A2' | 'A1' | 'A0' | 'CUSTOM'
export type ColorMode = 'BW' | 'COLOR'
export type PricingMode = 'SHEET' | 'LARGE_FORMAT'
export type Sides = 'SIMPLEX' | 'DUPLEX'
export type ChargeUnit = 'PER_PIECE' | 'PER_SIDE' | 'PER_SHEET' | 'PER_SQM' | 'FLAT'
export type MachineType = 'OFFSET' | 'DIGITAL' | 'LARGE_FORMAT'
export type PaperType = 'COATED' | 'UNCOATED' | 'RECYCLED' | 'GLOSS' | 'MATTE' | 'OTHER'

// ── Serializer-aligned models ───────────────────────────────────────────

/** Matches ShopSerializer (id, name, slug, currency, is_active) */
export interface DemoShop {
  id: number
  name: string
  slug: string
  currency: string
  is_active: boolean
}

/** Matches MachineSerializer */
export interface DemoMachine {
  id: number
  name: string
  machine_type: MachineType
  max_width_mm: number
  max_height_mm: number
  min_gsm: number | null
  max_gsm: number | null
  is_active: boolean
}

/** Matches PrintingRate serializer (from seller API) */
export interface DemoPrintingRate {
  id: number
  sheet_size: SheetSize
  color_mode: ColorMode
  single_price: string
  double_price: string
  is_active: boolean
}

/** Matches PaperSerializer */
export interface DemoPaper {
  id: number
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  width_mm: number | null
  height_mm: number | null
  buying_price: string
  selling_price: string
  quantity_in_stock: number | null
  reorder_level: number | null
  is_active: boolean
}

/** Matches FinishingRateSerializer */
export interface DemoFinishingRate {
  id: number
  name: string
  charge_unit: ChargeUnit
  price: string
  setup_fee: string | null
  min_qty: number | null
  is_active: boolean
}

/** Matches MaterialSerializer */
export interface DemoMaterial {
  id: number
  material_type: string
  unit: string
  buying_price: string
  selling_price: string
  is_active: boolean
}

/** Matches ProductFinishingOptionWriteSerializer */
export interface DemoProductFinishingOption {
  finishing_rate: number
  is_default: boolean
  price_adjustment: string | null
}

/** Matches ProductWriteSerializer / ProductListSerializer */
export interface DemoProduct {
  id: number
  name: string
  description: string
  category: string
  pricing_mode: PricingMode
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_bleed_mm: number
  default_sides: Sides
  min_quantity: number
  default_sheet_size: string
  min_width_mm: number | null
  min_height_mm: number | null
  min_gsm: number | null
  max_gsm: number | null
  allow_simplex: boolean
  allow_duplex: boolean
  is_active: boolean
  lowest_price: string | null
  highest_price: string | null
  finishing_options: DemoProductFinishingOption[]
}

/** Matches Imposition model */
export interface DemoImposition {
  id: number
  product: number
  sheet_size: SheetSize
  copies_per_sheet: number
  is_default: boolean
}

// ── Aggregated rate card (frontend concept, backed by real models) ──────

export interface DemoRateCard {
  shop: DemoShop
  machines: DemoMachine[]
  printing_rates: DemoPrintingRate[]
  papers: DemoPaper[]
  finishing_rates: DemoFinishingRate[]
  materials: DemoMaterial[]
}

/** API rate-card response (minimal fields for local computation) */
export interface DemoRateCardApiPaper {
  id: number
  sheet_size: string
  gsm: number
  paper_type: string
  selling_price: string
  is_active: boolean
}

export interface DemoRateCardApiPrintingRate {
  id: number
  sheet_size: string
  color_mode: string
  single_price: string
  double_price: string
  is_active: boolean
}

export interface DemoRateCardApiFinishingRate {
  id: number
  name: string
  charge_unit: string
  price: string
  setup_fee: string | null
  min_qty: number | null
  is_active: boolean
}

export interface DemoRateCardApiMaterial {
  id: number
  material_type: string
  unit: string
  selling_price: string
  is_active: boolean
}

export interface DemoRateCardApiTemplate {
  id: number
  name: string
  description: string
  category: string
  pricing_mode: string
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_sides: string
  min_quantity: number
  default_sheet_size: string
  copies_per_sheet: number
  min_gsm: number | null
  max_gsm: number | null
  finishing_options: Array<{
    finishing_rate: number
    is_default: boolean
    price_adjustment: string | null
  }>
  badge: string | null
}

export interface DemoRateCardApiResponse {
  templates: DemoRateCardApiTemplate[]
  papers: DemoRateCardApiPaper[]
  printing_rates: DemoRateCardApiPrintingRate[]
  finishing_rates: DemoRateCardApiFinishingRate[]
  materials: DemoRateCardApiMaterial[]
  version?: string
}

// ── Frontend-only types for the quote simulator & gallery ───────────────

export type DemoUnit = 'A4' | 'A3' | 'SQM'
export type DemoMaterialKey = string
export type DemoFinishingKey = string

/** Form state used by LandingQuoteSimulator */
export interface DemoFormState {
  unit: DemoUnit
  sides: 1 | 2
  quantity: number
  material: DemoMaterialKey
  finishing: DemoFinishingKey[]
  widthM: number
  heightM: number
  imposition: number
  profitMargin: number
}

/** Template preset shown on the landing page */
export interface DemoPreset {
  id: string
  name: string
  unit: DemoUnit
  sides: 1 | 2
  quantity: number
  material: DemoMaterialKey
  finishing: DemoFinishingKey[]
  widthM?: number
  heightM?: number
}

/** Category for template gallery browsing */
export interface DemoCategory {
  key: string
  label: string
  icon: string
}

/** Quote result from demo computation */
export interface DemoQuoteResult {
  printing: number
  material: number
  finishing: number
  total: number
}
