export interface PublicProductResponse {
  id?: number | string
  slug?: string
  name?: string
  status?: string | null
  is_public?: boolean
  can_calculate?: boolean
  price_hint?: Record<string, unknown> | null
  price_range_est?: Record<string, unknown> | null
}
