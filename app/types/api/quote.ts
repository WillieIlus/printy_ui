export interface QuotePreviewSnapshot {
  can_calculate?: boolean
  missing_fields?: string[]
  warnings?: string[]
  assumptions?: string[]
  totals?: Record<string, unknown>
  breakdown?: Record<string, unknown>
}

export interface QuoteStatusResponse {
  id?: number
  status?: string | null
  latest_response?: Record<string, unknown> | null
}
