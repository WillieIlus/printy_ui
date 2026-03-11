export interface Shop {
  id: number
  name: string
  slug: string
  location?: string
  description?: string
}

export interface FinishingOption {
  finishing_rate: number
  name: string
  is_default: boolean
}

export interface PriceHint {
  can_calculate: boolean
  price_display?: string
  total?: number
  per_unit?: number
}

export interface Product {
  id: number
  name: string
  category?: string
  primary_image?: string | null
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  final_size?: string
  imposition_summary?: string
  min_quantity?: number
  default_sides?: 'SIMPLEX' | 'DUPLEX'
  finishing_summary?: string[]
  finishing_options?: FinishingOption[]
  price_hint?: PriceHint
  price_range_est?: PriceHint
  shop?: Shop
}

export interface Paper {
  id: number
  shop: number
  sheet_size: string
  gsm: number
  paper_type: string
  selling_price: string
  buying_price: string
  is_active: boolean
}

export interface MaterialItem {
  id: number
  material_type?: string
  name?: string
  unit: string
  selling_price: string
  is_active: boolean
}

export interface FinishingRate {
  id: number
  name: string
  price: string
  charge_unit: 'PER_PIECE' | 'PER_SHEET' | 'PER_SQM' | 'FLAT'
  is_active: boolean
}

export interface QuoteItemFinishingPayload {
  finishing_rate: number
}

export interface TweakForm {
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper: number | null
  material: number | null
  finishings: QuoteItemFinishingPayload[]
  special_instructions: string
}

export interface QuoteItem {
  id: string
  product: Product
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper?: Paper | null
  material?: MaterialItem | null
  finishings: FinishingRate[]
  special_instructions?: string
}
