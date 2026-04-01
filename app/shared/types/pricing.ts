/**
 * Pricing types for the simplified pricing models.
 */

// Sheet sizes
export type SheetSize = 'A5' | 'A4' | 'A3' | 'SRA3' | 'A2' | 'A1' | 'A0' | 'CUSTOM'

// Pricing units (sheet-based vs area-based)
export type PricingUnit = 'A4' | 'A3' | 'SRA3' | 'SQM'

// Material types for large format (banner, vinyl, reflective)
export type MaterialType = 'BANNER' | 'VINYL' | 'REFLECTIVE' | 'CANVAS' | 'MESH'

// Color modes
export type ColorMode = 'BW' | 'COLOR'

// Paper types
export type PaperType = 'COATED' | 'UNCOATED' | 'RECYCLED' | 'GLOSS' | 'MATTE' | 'OTHER'

// Finishing categories
export type FinishingCategory = 'LAMINATION' | 'BINDING' | 'CUTTING' | 'FOLDING' | 'OTHER'

// Backend-supported finishing choices
export type ChargeUnit = 'PER_PIECE' | 'PER_SIDE' | 'PER_SHEET' | 'PER_SIDE_PER_SHEET' | 'PER_SQM' | 'FLAT'
export type FinishingBillingBasis = 'per_sheet' | 'per_piece' | 'flat_per_job' | 'flat_per_group' | 'flat_per_line'
export type FinishingSideMode = 'ignore_sides' | 'per_selected_side'

/**
 * Printing price - cost per printed side
 * selling_price_duplex_per_sheet: price for duplex (both sides) per sheet; null if not set
 */
export interface PrintingPrice {
  id: number
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  selling_price_duplex_per_sheet?: string
  buying_price_per_side: string | null
  profit_per_side: string
  is_active: boolean
  is_default_seeded?: boolean
  needs_review?: boolean
}

/** DTO for printing price create/update */
export interface PrintingPriceDTO {
  id?: number
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  selling_price_duplex_per_sheet?: string | null
}

/** DTO for material price create/update */
export interface MaterialPriceDTO {
  id?: number
  material_type: MaterialType
  unit: 'SQM'
  selling_price: string
  buying_price?: string | null
  is_active?: boolean
}

/**
 * Paper price - cost per sheet by GSM
 */
export interface PaperPrice {
  id: number
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string
  selling_price: string
  profit: string
  margin_percent: string
  is_active: boolean
  is_default_seeded?: boolean
  needs_review?: boolean
}

/**
 * Material price - cost per SQM for large format (banner, vinyl, etc.)
 */
export interface MaterialPrice {
  id: number
  material_type: MaterialType
  unit: 'SQM' | PricingUnit
  selling_price: string
  buying_price?: string | null
  is_active: boolean
  material_name?: string
  profit?: string
  is_default_seeded?: boolean
  needs_review?: boolean
}

/**
 * Finishing service - lamination, binding, etc.
 */
export interface FinishingService {
  id: number
  name: string
  category: FinishingCategory
  charge_unit: ChargeUnit
  billing_basis: FinishingBillingBasis
  side_mode: FinishingSideMode
  price: string
  double_side_price?: string | null
  setup_fee?: string | null
  minimum_charge?: string | null
  min_qty?: number | null
  display_unit_label?: string
  help_text?: string
  is_active: boolean
  is_default_seeded?: boolean
  needs_review?: boolean
}

// Default templates (read-only reference data)
export interface DefaultPrintingPriceTemplate {
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  selling_price_duplex_per_sheet?: string
  buying_price_per_side?: string
}

export interface DefaultPaperPriceTemplate {
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string
  selling_price: string
}

export interface DefaultMaterialPriceTemplate {
  material_name: string
  unit: string
  buying_price: string
  selling_price: string
}

export interface DefaultFinishingServiceTemplate {
  name: string
  category: FinishingCategory
  charge_unit: ChargeUnit
  buying_price?: string
  selling_price: string
}

/**
 * Volume discount
 */
export interface VolumeDiscount {
  id: number
  name: string
  min_quantity: number
  discount_percent: string
  is_active: boolean
}

/**
 * Public rate card - what customers see
 */
export interface RateCard {
  printing: PublicPrintingRate[]
  paper: PublicPaperRate[]
  finishing: PublicFinishingRate[]
  /** True when viewer is the shop owner (sees raw paper + printing breakdown) */
  is_owner?: boolean
}

export interface PublicPrintingRate {
  sheet_size: string
  color_mode: string
  price_per_side: string
  price_double_sided: string
}

export interface PublicPaperRate {
  gsm: number
  paper_type: string
  sheet_size?: string
  /** Per-sheet single-side price (paper + printing) */
  single_price: string
  /** Per-sheet double-side price (paper + printing) */
  double_price: string
  /** Raw paper price (owner only) */
  price_per_sheet?: string
  /** Printing single-side rate (owner only) */
  printing_single?: string
  /** Printing double-side rate (owner only) */
  printing_double?: string
}

export interface PublicFinishingRate {
  id: number
  name: string
  category: string
  price: string
  charge_unit: string
  display_unit_label?: string
  is_default: boolean
}

/**
 * Price calculation input - supports sheet mode and large format (SQM) mode
 */
export type PriceCalculationInput =
  | PriceCalculationInputSheet
  | PriceCalculationInputLargeFormat

/** Sheet-based print job */
export interface PriceCalculationInputSheet {
  unit?: 'A4' | 'A3' | 'SRA3'
  sheet_size: SheetSize
  gsm: number
  quantity: number
  sides?: 1 | 2
  paper_type?: PaperType
  finishing_ids?: number[]
}

/** Large format job (banner/vinyl/reflective per SQM) */
export interface PriceCalculationInputLargeFormat {
  unit: 'SQM'
  material_type: MaterialType
  area_sqm: number
  quantity?: number
  finishing_ids?: number[]
}

/**
 * Price calculation result
 */
export interface PriceCalculationResult {
  currency?: string | null
  quantity: number
  sides: number
  printing_price_per_side: string
  paper_price_per_sheet: string
  total_printing: string
  total_paper: string
  total_finishing: string
  finishing_breakdown: FinishingBreakdown[]
  grand_total: string
  price_per_sheet: string
}

export interface FinishingBreakdown {
  name: string
  price: string
  charge_unit: string
  total: string
}

/**
 * Form data for creating/editing pricing items
 */
export interface PrintingPriceForm {
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  selling_price_duplex_per_sheet?: string | null
  buying_price_per_side?: string
}

export interface PaperPriceForm {
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string
  selling_price: string
}

export interface FinishingServiceForm {
  name: string
  category: FinishingCategory
  charge_unit: ChargeUnit
  billing_basis: FinishingBillingBasis
  side_mode: FinishingSideMode
  price: string
  double_side_price?: string | null
  setup_fee?: string | null
  minimum_charge?: string | null
  min_qty?: number | null
  help_text?: string
}

export interface VolumeDiscountForm {
  name: string
  min_quantity: number
  discount_percent: string
}

export interface MaterialPriceForm {
  material_type: MaterialType
  unit: PricingUnit
  selling_price: string
  buying_price?: string | null
  is_active?: boolean
}
