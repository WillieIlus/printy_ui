/**
 * Base types for Printy_API. Used across the API layer and stores.
 */

/** Opening hours per weekday (1=Mon..7=Sun) */
export interface OpeningHoursPublic {
  id: number
  weekday: number
  weekday_display?: string
  from_hour: string | null
  to_hour: string | null
  is_closed: boolean
}

/** Shop status from API */
export type ShopStatus = 'opening' | 'closing_soon' | 'closed'

/** Public shop listing (minimal) */
export interface ShopPublic {
  id: number
  name: string
  slug: string
  description?: string
  currency?: string | null
  logo?: string | null
  city?: string
  state?: string
  latitude?: number | null
  longitude?: number | null
  google_place_id?: string | null
  social_links?: Array<{ platform?: string | null; label?: string | null; url: string }>
  opening_hours?: OpeningHoursPublic[]
  status?: ShopStatus
  opening_time?: string
  closing_time?: string
  closing_soon_minutes?: number
  timezone?: string
  same_day_cutoff_time?: string | null
  schedule_summary?: string
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
  slug?: string
  name: string
  description?: string
  category?: string
  product_kind?: 'FLAT' | 'BOOKLET'
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  default_binding_type?: 'SADDLE_STITCH' | 'PERFECT_BIND' | 'WIRE_O' | '' | null
  booklet_min_pages?: number | null
  booklet_max_pages?: number | null
  booklet_page_multiple?: number | null
  saddle_stitch_recommended_max_pages?: number | null
  perfect_bind_recommended_min_pages?: number | null
  creep_warning_start_pages?: number | null
  default_finished_width_mm?: number | null
  default_finished_height_mm?: number | null
  default_sheet_size?: string | null
  default_bleed_mm?: number
  default_sides?: 'SIMPLEX' | 'DUPLEX'
  turnaround_days?: number | null
  turnaround_hours?: number | null
  standard_turnaround_hours?: number | null
  rush_turnaround_hours?: number | null
  rush_available?: boolean
  buffer_hours?: number
  queue_hours?: number
  estimated_working_hours?: number | null
  estimated_ready_at?: string | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  turnaround_text?: string | null
  min_quantity?: number
  min_width_mm?: number | null
  min_height_mm?: number | null
  max_width_mm?: number | null
  max_height_mm?: number | null
  min_gsm?: number | null
  max_gsm?: number | null
  allowed_sheet_sizes?: string[] | null
  allow_simplex?: boolean
  allow_duplex?: boolean
  is_active: boolean
  finishing_options?: { id: number; finishing_rate: number; finishing_rate_name?: string; charge_unit?: string; price?: string; is_default: boolean; price_adjustment?: string | null }[]
  images?: ProductImage[]
  primary_image?: string | null
  price_hint?: {
    can_calculate?: boolean
    price_display?: string
    pricing_mode_label?: string
    pricing_mode_explanation?: string
    min_price?: number | null
    max_price?: number | null
    quantity_used?: number
    currency?: string | null
    total_low?: number | null
    total_high?: number | null
    per_unit_low?: number | null
    per_unit_high?: number | null
    unit_label?: string
    reason?: string
    missing_fields?: string[]
    suggestions?: { code?: string; message?: string }[]
  } | null
  shop?: ShopPublic
  /** True when the authenticated user owns the product's shop (for edit link) */
  is_owner?: boolean
  price_range_est?: {
    can_calculate?: boolean
    price_display?: string
    pricing_mode_label?: string
    pricing_mode_explanation?: string
    quantity_used?: number
    currency?: string | null
    total_low?: number | null
    total_high?: number | null
    per_unit_low?: number | null
    per_unit_high?: number | null
    unit_label?: string
    lowest?: { total?: string } | null
    highest?: { total?: string } | null
    reason?: string
    missing_fields?: string[]
    suggestions?: { code?: string; message?: string }[]
  } | null
  /** Computed gallery fields */
  imposition_summary?: string | null
  default_size_label?: string | null
  printing_total?: number | null
  finishing_summary?: string[]
  final_size?: string | null
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
  charge_unit: 'PER_PIECE' | 'PER_SIDE' | 'PER_SHEET' | 'PER_SIDE_PER_SHEET' | 'PER_SQM' | 'FLAT'
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
