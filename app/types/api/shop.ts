export interface MatchedShopResult {
  id: number
  name: string
  slug: string
  currency?: string | null
  can_calculate?: boolean
  reason?: string
  missing_fields?: string[]
  total?: string | null
  similarity_score?: number
  confidence_score?: number
  exact_or_estimated?: boolean
  preview?: Record<string, unknown> | null
}
