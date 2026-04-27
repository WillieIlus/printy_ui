import { API } from '~/shared/api-paths'
import { useApi, usePublicApiNoAuth } from '~/shared/api'

export interface RatingSummary {
  average: number
  count: number
}

export interface RatePayload {
  stars: number
  comment?: string
}

type ApiClient = ReturnType<typeof useApi>
type PublicApiClient = ReturnType<typeof usePublicApiNoAuth>

/** Public endpoint – no auth required */
export async function getRatingSummary(
  slug: string,
  publicApi: PublicApiClient = usePublicApiNoAuth()
): Promise<RatingSummary | null> {
  try {
    return await publicApi<RatingSummary>(API.publicShopRatingSummary(slug))
  } catch {
    return null
  }
}

/** Requires auth. Only allowed if buyer has a quote with status SENT or ACCEPTED for this shop. */
export async function rateShop(
  shopId: number,
  payload: RatePayload,
  api: ApiClient = useApi()
): Promise<void> {
  await api(API.shopRate(shopId), {
    method: 'POST',
    body: payload,
  })
}
