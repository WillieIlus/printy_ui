// Purpose: Billing shared typings used by the billing store and composable.
export type PlanCode = 'FREE' | 'BIASHARA' | 'BIASHARA_PLUS' | 'BIASHARA_MAX'
export type BillingInterval = 'monthly' | 'annual'

export type Plan = {
  id?: number
  code: PlanCode
  name: string
  sort_order: number
  price_monthly: string
  price_annual: string
  shops_limit?: number
  machines_limit?: number | null
  products_limit?: number | null
  quotes_per_month_limit?: number | null
  users_limit?: number
} & Record<string, unknown>

export type PaymentTransaction = {
  id?: number
  status?: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'timed_out' | string
  amount?: string | number | null
  created_at?: string | null
} & Record<string, unknown>

export type Usage = {
  shops?: number
  machines?: number
  active_products?: number
  quotes_this_month?: number
  team_members?: number
} & Record<string, unknown>

export type Subscription = {
  id?: number
  status?: 'active' | 'trialing' | 'grace_period' | 'suspended' | 'past_due' | 'cancelled' | 'expired' | string
  plan: Plan
  over_limit?: boolean
  renews_at?: string | null
  auto_renew_enabled?: boolean
  shops?: Array<{ id?: number; name?: string; slug?: string }>
} & Record<string, unknown>

export type SubscribePayload = {
  plan_code?: PlanCode
  interval?: BillingInterval
  phone_number?: string
} & Record<string, unknown>

export type UpgradePayload = SubscribePayload
export type DowngradePayload = {
  plan_code?: PlanCode
  interval?: BillingInterval
} & Record<string, unknown>
export type RenewalPayload = {
  phone_number?: string
} & Record<string, unknown>

export type SubscribeResponse = {
  transaction: PaymentTransaction | null
  subscription?: Subscription | null
} & Record<string, unknown>

export type UpgradePrompt = {
  resource: 'shop' | 'machine' | 'product' | 'quote' | 'user'
  current: number
  limit: number
  planName: string
  message: string
  suggestedPlan: PlanCode | null
}
