import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface FavoriteShop {
  id: number
  name: string
  slug: string
}

export async function getFavorites(): Promise<FavoriteShop[]> {
  const api = useApi()
  const data = await api<FavoriteShop[] | { results: FavoriteShop[] }>(API.meFavorites())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: FavoriteShop[] }).results)) {
    return (data as { results: FavoriteShop[] }).results
  }
  return []
}

export async function addFavorite(shopId: number): Promise<void> {
  const api = useApi()
  await api(API.shopFavorite(shopId), { method: 'POST' })
}

export async function removeFavorite(shopId: number): Promise<void> {
  const api = useApi()
  await api(API.shopFavorite(shopId), { method: 'DELETE' })
}
