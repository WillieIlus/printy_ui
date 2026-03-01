/**
 * Base types for Printy_API. Used across the API layer and stores.
 */

/** Public shop listing (minimal) */
export interface ShopPublic {
  id: number
  name: string
  slug: string
}

/** Product image from catalog */
export interface ProductImage {
  id: number
  image: string | null
  is_primary: boolean
  display_order: number
}

/** Product from catalog */
export interface Product {
  id: number
  name: string
  description?: string
  category?: string
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  default_finished_width_mm?: number | null
  default_finished_height_mm?: number | null
  default_bleed_mm?: number
  default_sides?: 'SIMPLEX' | 'DUPLEX'
  is_active: boolean
  finishing_options?: { id: number; finishing_rate: number; is_default: boolean; price_adjustment?: string | null }[]
  /** All images for this product */
  images?: ProductImage[]
  /** Path to primary/first image for card display (use getMediaUrl) */
  primary_image?: string | null
  /** Price hint object with display strings */
  price_hint?: {
    can_calculate?: boolean
    price_display?: string
    pricing_mode_label?: string
    pricing_mode_explanation?: string
    min_price?: number | null
    max_price?: number | null
    reason?: string
    missing_fields?: string[]
    suggestions?: { code?: string; message?: string }[]
  } | null
  /** Shop info when product comes from all-products gallery */
  shop?: ShopPublic
  /** Price range estimate */
  price_range_est?: {
    can_calculate?: boolean
    price_display?: string
    pricing_mode_label?: string
    pricing_mode_explanation?: string
    lowest?: { total?: string } | null
    highest?: { total?: string } | null
    reason?: string
    missing_fields?: string[]
    suggestions?: { code?: string; message?: string }[]
  } | null
}

/** Quote draft / request (before pricing) */
export interface QuoteDraft {
  id: number
  shop: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  status: 'DRAFT' | 'SUBMITTED' | 'PRICED' | 'SENT' | 'ACCEPTED' | 'REJECTED'
  notes?: string
  total?: string | null
  items?: QuoteItemPrinty[]
}

/** Quote line item (Printy_API) */
export interface QuoteItemPrinty {
  id: number
  quote_request: number
  product: number
  quantity: number
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  paper?: number | null
  material?: number | null
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  sides?: string
  color_mode?: string
  machine?: number | null
  special_instructions?: string
  unit_price?: string | null
  line_total?: string | null
}

/** Finishing rate (lamination, binding, etc.) */
export interface FinishingRate {
  id: number
  name: string
  charge_unit: 'PER_PIECE' | 'PER_SIDE' | 'PER_SQM' | 'FLAT'
  price: string
  setup_fee?: string | null
  min_qty?: number | null
  is_active: boolean
}

/** Paper stock */
export interface Paper {
  id: number
  shop: number
  sheet_size: string
  gsm: number
  paper_type: string
  width_mm?: number | null
  height_mm?: number | null
  buying_price: string
  selling_price: string
  quantity_in_stock?: number | null
  reorder_level?: number | null
  is_active: boolean
}

/** Material (large format: vinyl, banner, etc.) */
export interface Material {
  id: number
  shop: number
  name: string
  unit: string
  buying_price: string
  selling_price: string
  is_active: boolean
}

/** Service rate (design, delivery, rush, setup) - optional */
export interface ServiceRate {
  id: number
  shop: number
  code: string
  name: string
  pricing_type: 'FIXED' | 'TIERED_DISTANCE'
  price?: string | null
  is_optional: boolean
  is_negotiable: boolean
  is_active: boolean
}
