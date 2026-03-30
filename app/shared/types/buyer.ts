/**
 * Printy_API buyer flow types.
 * ShopPublic and Product from base.ts.
 */

/** Quote draft (cart-like, one per shop) */
export interface QuoteDraft {
  id: number
  draft_reference?: string
  title?: string
  shop?: number | null
  selected_product?: number | null
  status: 'draft' | 'sent' | 'archived' | 'submitted' | 'viewed' | 'quoted' | 'accepted' | 'closed' | 'cancelled'
  calculator_inputs_snapshot?: Record<string, unknown>
  pricing_snapshot?: Record<string, unknown> | null
  custom_product_snapshot?: Record<string, unknown> | null
  request_details_snapshot?: Record<string, unknown> | null
  generated_request_ids?: number[]
  request_reference?: string
  shop_name?: string
  shop_slug?: string
  shop_currency?: string
  quote_draft_file_id?: number | null
  items?: QuoteItem[]
  totals?: Record<string, string> | number
  created_at?: string
  updated_at?: string
}

/** Quote item — PRODUCT or CUSTOM */
export interface QuoteItem {
  id: number
  item_type: 'PRODUCT' | 'CUSTOM'
  created_at?: string
  product?: number
  product_name?: string
  product_slug?: string
  title?: string
  spec_text?: string
  quantity: number
  pricing_mode?: string
  chosen_width_mm?: number | null
  chosen_height_mm?: number | null
  paper?: number | null
  material?: number | null
  machine?: number | null
  sides?: string
  color_mode?: string
  special_instructions?: string
  finishings?: Array<{
    finishing_rate: number
    apply_to_sides?: 'SINGLE' | 'DOUBLE' | 'BOTH'
    selected_side?: 'front' | 'back' | 'both'
  }>
  finishing_rate_ids?: number[]
  has_artwork?: boolean
  unit_price?: string | null
  line_total?: string | null
}

/** Preview price response */
export interface PreviewPriceResponse {
  pricing_mode?: 'SHEET' | 'LARGE_FORMAT'
  quantity?: number
  copies_per_sheet?: number
  good_sheets?: number
  parent_sheets_required?: number | null
  parent_sheet_name?: string | null
  rotated?: boolean | null
  roll_width_mm?: number | null
  roll_length_mm?: number | null
  tiles_x?: number | null
  tiles_y?: number | null
  total_tiles?: number | null
  explanation_lines?: string[]
  sides?: string
  print_side_count?: number
  paper?: {
    id?: number
    label?: string
    sheet_size?: string
    cost_per_sheet?: string
    total?: string
  }
  printing?: {
    machine_id?: number | null
    machine_name?: string
    color_mode?: string
    resolved_rate_id?: number | null
    rate_per_sheet?: string
    total?: string
  }
  finishings?: Array<{
    name: string
    slug?: string
    billing_basis?: string
    side_mode?: string
    selected_side?: string
    side_count?: number
    good_sheets?: number
    units?: number | string
    units_count?: number | string
    rate?: string
    formula?: string
    calculation_basis?: string
    explanation?: string
    minimum_charge?: string
    total: string
  }>
  totals?: {
    subtotal?: string
    paper_cost?: string
    print_cost?: string
    finishing_total?: string
    vat?: string
    vat_amount?: string
    grand_total?: string
    unit_price?: string
  }
  vat?: {
    amount?: string
    rate?: string | number
    is_inclusive?: boolean
    mode?: 'inclusive' | 'exclusive'
    label?: string
  }
  currency?: string
  total?: string | number
  lines?: { label: string; amount: string }[]
  hasNegotiable?: boolean
  can_calculate?: boolean
  reason?: string
  suggestions?: { code?: string; message?: string }[]
}

export interface QuoteDraftShopGroup {
  draft_id: number
  quote_request_id?: number
  shop_id: number
  shop_name: string
  shop_slug: string
  shop_currency: string
  status: QuoteDraft['status']
  item_count: number
  items: QuoteItem[]
  subtotal: string
  total?: string
  can_recalculate?: boolean
  can_submit?: boolean
  latest_sent_quote?: {
    id: number
    status: string
    total?: string | null
    turnaround_days?: number | null
    note?: string | null
    sent_at?: string | null
    revision_number?: number
    whatsapp_message?: string | null
  } | null
  created_at?: string | null
  updated_at?: string | null
}

export interface QuoteDraftFile {
  id: number
  file_kind?: 'grouped_quote_file'
  customer?: {
    label?: string
    company_name?: string
    contact_name?: string
    contact_email?: string
    contact_phone?: string
  }
  customer_name?: string
  company_name: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  notes?: string
  status: 'open' | 'closed'
  shop_count: number
  draft_count: number
  quote_count?: number
  item_count: number
  total_value?: string
  has_draft?: boolean
  shop_groups: QuoteDraftShopGroup[]
  created_at?: string | null
  updated_at?: string | null
}
