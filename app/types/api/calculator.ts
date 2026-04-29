export interface CalculatorChoiceOption {
  value?: string
  key?: string
  label: string
  display_name?: string
  category?: string
  category_label?: string
  gsm?: number
  width_mm?: number
  height_mm?: number
}

export interface CalculatorFieldConfig {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean'
  required: boolean
  help_text?: string
  options?: CalculatorChoiceOption[]
}

export interface SizeOption {
  id: string
  label: string
  description: string
  recommended: boolean
  width_mm: number
  height_mm: number
}

export interface PaperTierOption {
  id: string
  label: string
  description: string
  gsm: number
  recommended: boolean
}

export interface CalculatorProductConfig {
  key: string
  label: string
  required_fields: string[]
  optional_fields: string[]
  defaults: Record<string, string | number | boolean | null>
  allowed_paper_categories?: string[]
  allowed_cover_categories?: string[]
  allowed_insert_categories?: string[]
  allowed_finishings: string[]
  allowed_print_sides: string[]
  sizes: CalculatorChoiceOption[]
  fields: CalculatorFieldConfig[]
  paper_options?: PaperTierOption[]
  cover_paper_options?: PaperTierOption[]
  insert_paper_options?: PaperTierOption[]
  size_options?: SizeOption[]
  allow_custom_size?: boolean
}

export interface CalculatorConfigResponse {
  products: CalculatorProductConfig[]
  paper_categories: CalculatorChoiceOption[]
  paper_stocks: CalculatorChoiceOption[]
  finishings: CalculatorChoiceOption[]
  sizes: Record<string, CalculatorChoiceOption[]>
  print_sides: CalculatorChoiceOption[]
  color_modes: CalculatorChoiceOption[]
  preview_endpoint: string
}

export interface CalculatorPreviewMatch {
  id: number
  name: string
  slug: string
  can_calculate: boolean
  currency?: string | null
  reason?: string
  total?: string | null
  preview?: Record<string, unknown> | null
  selection?: Record<string, unknown> | null
  similarity_score?: number
  confidence_score?: number
  turnaround_label?: string
  human_ready_text?: string
}

export interface ProductionPreview {
  pieces_per_sheet: number | null
  sheets_required: number | null
  parent_sheet: string | null
  imposition_label: string | null
  size_label: string | null
  quantity: number | null
  cutting_required: boolean | null
  selected_finishings: string[]
  suggested_finishings: string[]
  warnings: string[]
  booklet_input_pages?: number | null
  booklet_normalized_pages?: number | null
  booklet_blank_pages_added?: number | null
  booklet_cover_pages?: number | null
  booklet_insert_pages?: number | null
  booklet_cover_sheets?: number | null
  booklet_insert_sheets?: number | null
  booklet_binding_label?: string | null
  booklet_cover_paper_label?: string | null
  booklet_insert_paper_label?: string | null
}

export interface PricingBreakdownLine {
  label: string
  amount: string | null
  formula: string | null
}

export interface PricingBreakdown {
  currency: string
  paper_price: number | null
  print_price_front: number | null
  print_price_back: number | null
  total_per_sheet: number | null
  estimated_total: number | null
  price_range: unknown | null
  formula: string | null
  lines: PricingBreakdownLine[]
}

export interface CalculatorPreviewResponse {
  can_calculate?: boolean
  product_type?: string | null
  price_mode?: 'exact' | 'estimate' | null
  total?: string | null
  breakdown?: Record<string, unknown> | null
  missing_fields?: string[]
  warnings?: string[]
  assumptions?: string[]
  message?: string
  matches?: CalculatorPreviewMatch[]
  matches_count?: number
  min_price?: string | null
  max_price?: string | null
  currency?: string | null
  summary?: string
  production_preview?: ProductionPreview | null
  pricing_breakdown?: PricingBreakdown | null
}
