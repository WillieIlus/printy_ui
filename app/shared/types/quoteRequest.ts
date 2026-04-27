// Purpose: Quote request shared typings.
export type QuoteRequest = {
  id: number
  status?: string | null
  raw_status?: string | null
  status_label?: string | null
  title?: string | null
} & Record<string, unknown>

export type QuoteRequestListResponse = {
  results?: QuoteRequest[]
  count?: number
} & Record<string, unknown>
