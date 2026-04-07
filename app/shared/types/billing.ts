export type PlanCode = 'FREE' | 'BIASHARA' | 'BIASHARA_PLUS' | 'BIASHARA_MAX'
export type BillingInterval = 'monthly' | 'annual'
export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'grace_period'
  | 'suspended'
  | 'cancelled'
  | 'expired'
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'timed_out'
export type AnalyticsLevel = 'basic' | 'standard' | 'advanced'

export interface Plan {
  id: number
  code: PlanCode
  name: string
  price_monthly: string
  price_annual: string
  currency: string
  shops_limit: number
  machines_limit: number | null
  products_limit: number | null
  quotes_per_month_limit: number | null
  users_limit: number
  all_papers_enabled: boolean
  branded_quotes_enabled: boolean
  customer_history_enabled: boolean
  analytics_level: AnalyticsLevel
  priority_support: boolean
  sort_order: number
  public_tagline: string
  best_for: string
  benefits: string[]
}

export interface SubscriptionShop {
  id: number
  shop: number
  shop_name: string
  shop_slug: string
  is_primary: boolean
  added_at: string
}

export interface Subscription {
  id: number
  plan: Plan
  billing_interval: BillingInterval
  status: SubscriptionStatus
  starts_at: string | null
  ends_at: string | null
  renews_at: string | null
  auto_renew_enabled: boolean
  grace_period_ends_at: string | null
  over_limit: boolean
  payment_phone_e164: string
  is_active_now: boolean
  remaining_days: number
  shops: SubscriptionShop[]
  cancellation_requested_at: string | null
  cancelled_at: string | null
  suspended_at: string | null
  last_renewal_attempt_at: string | null
  next_renewal_attempt_at: string | null
  mpesa_reference_last: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Usage {
  shops: number
  machines: number
  active_products: number
  team_members: number
  quotes_this_month: number
  shops_limit: number | null
  machines_limit: number | null
  products_limit: number | null
  quotes_per_month_limit: number | null
  users_limit: number | null
}

export interface PaymentTransaction {
  id: number
  transaction_type: string
  provider: string
  provider_method: string
  plan: number | null
  plan_name: string
  amount: string
  currency: string
  status: PaymentStatus
  phone_number: string
  mpesa_receipt_number: string
  checkout_request_id: string
  result_code: string
  result_desc: string
  initiated_at: string | null
  callback_received_at: string | null
  completed_at: string | null
  idempotency_key: string
  created_at: string
}

export interface SubscribePayload {
  plan_code: PlanCode
  billing_interval: BillingInterval
  phone_number: string
  selected_shop_ids: number[]
}

export interface UpgradePayload {
  target_plan_code: PlanCode
  billing_interval: BillingInterval
  phone_number?: string
  selected_shop_ids?: number[]
}

export interface DowngradePayload {
  target_plan_code: PlanCode
}

export interface RenewalPayload {
  phone_number?: string
}

export interface SubscribeResponse {
  message: string
  transaction: PaymentTransaction
}

export interface EntitlementResult {
  allowed: boolean
  reason_code: string
  message: string
  current: number | null
  limit: number | null
}

/** Upgrade suggestion shown when a user hits a plan limit. */
export interface UpgradePrompt {
  resource: 'shop' | 'machine' | 'product' | 'quote' | 'user'
  current: number
  limit: number
  planName: string
  message: string
  suggestedPlan: PlanCode | null
}
