// Purpose: Shared domain typings restored after accidental deletion.
export type GenericRecord = Record<string, unknown>

export type PaginatedResponse<T = GenericRecord> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type AuthTokens = {
  access: string
  refresh: string
}

export type AuthUser = {
  id?: number | string
  email?: string
  name?: string
  role?: string
} & GenericRecord

export type SignupCredentials = {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: string
}

export type PriceSuggestion = {
  message?: string
} & GenericRecord

export type PricePoint = {
  total?: string | number | null
} & GenericRecord

export type ProductPriceSource = {
  can_calculate?: boolean
  currency?: string | null
  price_display?: string | null
  quantity_used?: number | null
  total_low?: number | null
  total_high?: number | null
  per_unit_low?: number | null
  per_unit_high?: number | null
  unit_label?: string | null
  min_price?: number | null
  max_price?: number | null
  lowest?: PricePoint | null
  highest?: PricePoint | null
  reason?: string | null
  missing_fields?: string[]
  suggestions?: PriceSuggestion[]
} & GenericRecord

export type ShopPublic = {
  id?: number | string
  name?: string
  slug?: string
  currency?: string | null
  description?: string | null
  logo?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  location_label?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  google_place_id?: string | null
  opening_hours?: OpeningHours[]
  social_links?: SocialLink[]
  status?: string | null
  can_receive_requests?: boolean
  can_price_requests?: boolean
  supports_custom_requests?: boolean
  supports_catalog_requests?: boolean
  pricing_ready?: boolean
  public_match_ready?: boolean
  rate_card_completeness?: number | null
  setup_percent?: number | null
  turnaround_configured?: boolean
  turnaround_label?: string | null
  products_count?: number | null
  materials_count?: number | null
  pricing_rules_count?: number | null
  finishing_rates_count?: number | null
  capability_tags?: string[]
  material_tags?: string[]
  finishing_tags?: string[]
  opening_time?: string | null
  closing_time?: string | null
  closing_soon_minutes?: number | null
  timezone?: string | null
  same_day_cutoff_time?: string | null
  schedule_summary?: string | null
} & GenericRecord

export type Product = {
  id?: number | string
  slug?: string
  name?: string
  title?: string
  description?: string | null
  is_public?: boolean
  public?: boolean
  min_quantity?: number | null
  default_sides?: 'SIMPLEX' | 'DUPLEX' | string
  price_range_est?: ProductPriceSource | null
  price_hint?: ProductPriceSource | null
  shop?: ShopPublic | null
  category?: string | { name?: string; title?: string; slug?: string } | null
  category_name?: string | null
} & GenericRecord

export type SocialLink = {
  id?: number
  platform?: string | null
  label?: string | null
  url?: string | null
} & GenericRecord

export type OpeningHours = {
  id?: number
  day?: string
  opening_time?: string | null
  closing_time?: string | null
  is_closed?: boolean
} & GenericRecord

export type ShopMember = {
  id?: number
  name?: string | null
  email?: string | null
  role?: string | null
} & GenericRecord

export type Shop = ShopPublic & {
  description?: string | null
  business_email?: string | null
  phone_number?: string | null
  address_line?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  zip_code?: string | null
  google_place_id?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  opening_time?: string | null
  closing_time?: string | null
  closing_soon_minutes?: number | null
  social_links?: SocialLink[]
  owner?: number | string | { id?: number | string } | null
} & GenericRecord

export type ShopCreateInput = {
  name: string
  business_email: string
  address_line: string
  city: string
  state: string
  country?: string | null
  description?: string | null
  phone_number?: string | null
  zip_code?: string | null
  google_place_id?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  opening_time?: string | null
  closing_time?: string | null
  closing_soon_minutes?: number | null
}

export type User = {
  id?: number
  name?: string | null
  email?: string | null
  phone_number?: string | null
} & GenericRecord

export type UserUpdatePayload = {
  name?: string | null
  email?: string | null
  phone_number?: string | null
} & GenericRecord

export type Claim = {
  id?: number
  status?: string | null
} & GenericRecord

export type QuoteItem = {
  id?: number
  name?: string | null
  quantity?: number | null
} & GenericRecord

export type Quote = {
  id?: number
  status?: string | null
  items?: QuoteItem[]
} & GenericRecord

export type Profile = {
  id?: number
  bio?: string | null
  avatar?: string | null
  social_links?: SocialLink[]
} & GenericRecord

export type StaffQuote = {
  id?: number
  status?: string | null
} & GenericRecord

export type StaffQuoteItem = {
  id?: number
  name?: string | null
} & GenericRecord

export type StaffPricingSnapshot = GenericRecord

export type FinishingCategory = string

export type PrintingPrice = {
  id?: number
  machine?: number | null
  sheet_size?: string
  color_mode?: string
  selling_price_per_side?: string | null
  selling_price_duplex_per_sheet?: string | null
  duplex_surcharge?: string | null
  duplex_surcharge_enabled?: boolean
  duplex_surcharge_min_gsm?: number | null
  buying_price_per_side?: string | null
  needs_review?: boolean
  is_active?: boolean
  is_default?: boolean
}

export type PaperPrice = {
  id?: number
  sheet_size?: string
  gsm?: number | null
  paper_type?: string | null
  width_mm?: number | null
  height_mm?: number | null
  buying_price?: string | null
  selling_price?: string | null
  quantity_in_stock?: number | null
  reorder_level?: number | null
  needs_review?: boolean
  is_active?: boolean
}

export type MaterialPrice = {
  id?: number
  material_type?: string | null
  unit?: string | null
  buying_price?: string | null
  selling_price?: string | null
  print_price_per_sqm?: string | null
  material_name?: string | null
  needs_review?: boolean
  is_active?: boolean
}

export type FinishingService = {
  id?: number
  name?: string
  category?: string
  charge_unit?: string
  billing_basis?: string
  side_mode?: string
  price?: string | null
  double_side_price?: string | null
  setup_fee?: string | null
  min_qty?: number | null
  minimum_charge?: string | null
  display_unit_label?: string | null
  help_text?: string | null
  needs_review?: boolean
  is_active?: boolean
}

export type VolumeDiscount = {
  id?: number
  min_quantity?: number | null
  max_quantity?: number | null
  percentage?: string | null
  is_active?: boolean
}

export type PrintingPriceForm = Partial<PrintingPrice>
export type PaperPriceForm = Partial<PaperPrice>
export type MaterialPriceForm = Partial<MaterialPrice>
export type FinishingServiceForm = Partial<FinishingService>
export type VolumeDiscountForm = Partial<VolumeDiscount>

export type DefaultPrintingPriceTemplate = Partial<PrintingPrice>
export type DefaultPaperPriceTemplate = Partial<PaperPrice>
export type DefaultMaterialPriceTemplate = Partial<MaterialPrice>
export type DefaultFinishingServiceTemplate = Partial<FinishingService>

export type RateCard = {
  papers?: PaperPrice[]
  materials?: MaterialPrice[]
  finishing_services?: FinishingService[]
  printing_prices?: PrintingPrice[]
  volume_discounts?: VolumeDiscount[]
} & GenericRecord

export type PriceCalculationInput = GenericRecord
export type BookletQuotePayload = GenericRecord
export type PriceCalculationResult = {
  subtotal?: string | number | null
  tax?: string | number | null
  total?: string | number | null
} & GenericRecord
