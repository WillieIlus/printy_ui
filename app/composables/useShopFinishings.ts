import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface ShopFinishingCategory {
  id: number
  name: string
  slug: string
  description?: string
}

export interface ShopFinishingRate {
  id: number
  name: string
  slug: string
  category: number | null
  category_detail?: ShopFinishingCategory | null
  charge_unit: string
  billing_basis: string
  side_mode: string
  price: string
  double_side_price?: string | null
  setup_fee?: string | null
  min_qty?: number | null
  minimum_charge?: string | null
  applies_to_product_types?: string[] | null
  display_unit_label?: string
  help_text?: string
  is_active: boolean
}

export interface ShopFinishingRatePayload {
  name?: string
  slug?: string
  category?: number | null
  charge_unit?: string
  billing_basis?: string
  side_mode?: string
  price?: string | number
  double_side_price?: string | number | null
  setup_fee?: string | number | null
  min_qty?: number | null
  minimum_charge?: string | number | null
  applies_to_product_types?: string[] | null
  display_unit_label?: string
  help_text?: string
  is_active?: boolean
}

export function useShopFinishings(shopSlug: MaybeRefOrGetter<string | null>) {
  const api = useApi()
  const getSlug = () => toValue(shopSlug)

  async function list(): Promise<ShopFinishingRate[]> {
    const slug = getSlug()
    if (!slug) return []
    const data = await api<ShopFinishingRate[] | { results: ShopFinishingRate[] }>(API.shopFinishingRates(slug))
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function listCategories(): Promise<ShopFinishingCategory[]> {
    const data = await api<ShopFinishingCategory[] | { results: ShopFinishingCategory[] }>(API.finishingCategories())
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function create(payload: ShopFinishingRatePayload): Promise<ShopFinishingRate> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<ShopFinishingRate>(API.shopFinishingRates(slug), { method: 'POST', body: payload })
  }

  async function update(id: number, payload: ShopFinishingRatePayload): Promise<ShopFinishingRate> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<ShopFinishingRate>(API.shopFinishingRateDetail(slug, id), { method: 'PATCH', body: payload })
  }

  async function remove(id: number): Promise<void> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<void>(API.shopFinishingRateDetail(slug, id), { method: 'DELETE' })
  }

  return { list, listCategories, create, update, remove }
}
