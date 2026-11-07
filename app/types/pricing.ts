export type MoneyString = string

export interface PricingPreviewRequest {
  production_cost: MoneyString
  manager_markup: MoneyString
}

export interface InternalQuoteFinancials {
  currency: 'KES' | string
  production_cost: MoneyString
  manager_markup: MoneyString
  production_fee_component: MoneyString
  markup_fee_component: MoneyString
  printy_fee: MoneyString
  shop_payout: MoneyString
  manager_payout: MoneyString
  client_total: MoneyString
  pricing_tier: string
  policy_version: string
}

export interface ClientQuoteFinancials {
  currency: 'KES' | string
  client_total: MoneyString
}

export interface PricingApiError {
  field?: string
  code?: string
  message: string
}

export interface PricingValidationErrorMap {
  production_cost?: string
  manager_markup?: string
}