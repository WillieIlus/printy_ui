import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface RatingSummary {
  average: number
  count: number
}

export interface RatePayload {
  stars: number
  comment?: string
}

/** Public endpoint – no auth required */
export async function getRatingSummary(slug: string): Promise<RatingSummary | null> {
  const api = useApi()
  try {
    return await api<RatingSummary>(API.publicShopRatingSummary(slug))
  } catch {
    return null
  }
}

/** Requires auth. Only allowed if buyer has a quote with status SENT or ACCEPTED for this shop. */
export async function rateShop(shopId: number, payload: RatePayload): Promise<void> {
  const api = useApi()
  await api(API.shopRate(shopId), {
    method: 'POST',
    body: payload,
  })
}
