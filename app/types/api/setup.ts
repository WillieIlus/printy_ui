export interface SetupStepResponse {
  key: string
  label: string
  done: boolean
  accessible: boolean
  cta_label: string
  cta_url: string
  blocking_reason: string
}

export interface SetupStatusResponse {
  has_shop: boolean
  has_machines?: boolean
  has_papers?: boolean
  has_materials?: boolean
  materials_count?: number
  has_pricing: boolean
  has_pricing_rules?: boolean
  pricing_rules_count?: number
  has_finishing: boolean
  has_finishing_rates?: boolean
  finishing_rates_count?: number
  has_products?: boolean
  shop_profile_complete?: boolean
  turnaround_configured?: boolean
  shop_published?: boolean
  can_receive_requests?: boolean
  can_price_requests?: boolean
  rate_card_completeness?: number
  setup_percent?: number
  warnings?: string[]
  recommendations?: string[]
  blocking_reason?: string
  next_step: string
  next_url: string
  completed_steps: string[]
  pending_steps: string[]
  steps: SetupStepResponse[]
}
