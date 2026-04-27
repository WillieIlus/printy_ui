// Purpose: Buyer and quote-draft-related shared typings.
export type PreviewSuggestion = {
  message?: string
}

export type BookletPricingBreakdown = {
  cover_paper?: string | number | null
  insert_paper?: string | number | null
  cover_printing?: string | number | null
  insert_printing?: string | number | null
  lamination?: string | number | null
  stitching?: string | number | null
  cutting?: string | number | null
  subtotal?: string | number | null
  total?: string | number | null
} & Record<string, unknown>

export type BookletQuotePayload = {
  shop?: number | null
  quantity: number
  total_pages?: number | null
  binding_type?: 'saddle_stitch' | 'perfect_bind' | 'wire_o'
  cover_paper?: number | null
  insert_paper?: number | null
  cover_sides?: 'SIMPLEX' | 'DUPLEX'
  insert_sides?: 'SIMPLEX' | 'DUPLEX'
  cover_color_mode?: 'BW' | 'COLOR'
  insert_color_mode?: 'BW' | 'COLOR'
  cover_lamination_mode?: 'none' | 'front' | 'both'
  cover_lamination_finishing_rate?: number | null
  binding_finishing_rate?: number | null
  finishings?: Array<{ finishing_rate_id?: number; finishing_rate?: number; selected_side?: 'front' | 'back' | 'both' }>
  width_mm?: number | null
  height_mm?: number | null
  size_mode?: 'standard' | 'custom'
  size_label?: string
  input_unit?: 'mm' | 'cm' | 'm' | 'in'
  width_input?: string | number | null
  height_input?: string | number | null
  turnaround_hours?: number | null
}

export type PreviewPriceResponse = {
  total?: number | string | null
  currency?: string | null
  can_calculate?: boolean
  suggestions?: PreviewSuggestion[]
  totals?: {
    grand_total?: number | string | null
  }
  product_type?: string | null
  price_mode?: 'exact' | 'estimate' | string | null
  finished_size?: string | null
  input_pages?: number | null
  normalized_pages?: number | null
  blank_pages_added?: number | null
  cover_pages?: number | null
  insert_pages?: number | null
  cover_sheets?: number | null
  insert_sheets?: number | null
  assumptions?: string[]
  warnings?: string[]
  missing_fields?: string[]
  message?: string | null
  breakdown?: BookletPricingBreakdown | Record<string, unknown> | null
} & Record<string, unknown>

export type QuoteDraft = {
  id: number
  draft_reference?: string | null
  title?: string | null
  status?: string | null
  raw_status?: string | null
  status_label?: string | null
  shop?: number | null
  shop_name?: string | null
  shop_slug?: string | null
  selected_product?: number | null
  calculator_inputs_snapshot?: Record<string, unknown> | null
  pricing_snapshot?: Record<string, unknown> | null
  custom_product_snapshot?: Record<string, unknown> | null
  request_details_snapshot?: Record<string, unknown> | null
  generated_request_ids?: number[]
  created_at?: string | null
  updated_at?: string | null
  items?: QuoteItem[]
} & Record<string, unknown>

export type QuoteDraftFile = {
  id: number
  company_name?: string
  status?: string | null
  raw_status?: string | null
  status_label?: string | null
  item_count?: number | null
} & Record<string, unknown>

export type QuoteItem = {
  id: number
  name?: string | null
  quantity?: number | null
} & Record<string, unknown>
