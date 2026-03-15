import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface FavoriteShop {
  id: number
  name: string
  slug: string
}

interface FavoriteShopApiResponse {
  id: number
  shop: { id: number; name: string; slug: string }
  created_at: string
}

export async function getFavorites(): Promise<FavoriteShop[]> {
  const api = useApi()
  const data = await api<FavoriteShopApiResponse[]>(API.meFavorites())
  if (!Array.isArray(data)) return []
  return data.map((f) => ({ id: f.shop.id, name: f.shop.name, slug: f.shop.slug }))
}

export async function addFavorite(shopId: number): Promise<void> {
  const api = useApi()
  await api(API.meFavorites(), { method: 'POST', body: { shop: shopId } })
}

export async function removeFavorite(shopId: number): Promise<void> {
  const api = useApi()
  await api(API.meFavoriteDetail(shopId), { method: 'DELETE' })
}
