/** Stage 1C Quote envelope used by the buyer quote screens. */
export interface QuoteCardParty {
  role: string
  name: string
}

export interface QuoteCardPrice {
  amount: string | null
  currency: string
  label: string
}

export interface QuoteCardNextAction {
  code: string
  label: string
  actor: string
  params?: Record<string, unknown>
}

export interface QuoteCardItem {
  id: string
  legacy_type: string
  legacy_id: number
  code: string
  spec: { summary: string; product?: string; quantity?: number | null }
  price: QuoteCardPrice | null
  from: QuoteCardParty
  to: QuoteCardParty
  status: string
  status_key: string
  next_action: QuoteCardNextAction
}

export interface QuoteCardEnvelope {
  id: string
  viewer: { role: string }
  quotes: QuoteCardItem[]
}
