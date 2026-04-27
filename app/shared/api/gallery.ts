// Purpose: Minimal public gallery API helper restored for product browsing.
import type { Product } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { usePublicApiNoAuth } from '~/shared/api'

export async function getAllProducts(): Promise<Product[]> {
  const publicApi = usePublicApiNoAuth()
  const data = await publicApi<Product[] | { results?: Product[] }>(API.shopProducts())

  if (Array.isArray(data)) return data
  return Array.isArray(data?.results) ? data.results : []
}
