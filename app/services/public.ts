import type { ShopPublic, Product } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { usePublicApi } from '~/shared/api'

export interface CatalogResponse {
  shop: ShopPublic
  products: Product[]
}

type PublicApiClient = ReturnType<typeof usePublicApi>

export async function listShops(publicApi: PublicApiClient = usePublicApi()): Promise<ShopPublic[]> {
  const data = await publicApi<ShopPublic[] | { results: ShopPublic[] }>(API.publicShops())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: ShopPublic[] }).results)) {
    return (data as { results: ShopPublic[] }).results
  }
  return []
}

export async function getCatalog(
  shopSlug: string,
  publicApi: PublicApiClient = usePublicApi()
): Promise<CatalogResponse | null> {
  try {
    return await publicApi<CatalogResponse>(API.publicShopCatalog(shopSlug))
  } catch {
    return null
  }
}
