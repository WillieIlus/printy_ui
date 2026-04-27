import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface ShopPaper {
  id: number
  name: string
  display_name: string
  category: string
  paper_type: string
  sheet_size: string
  gsm: number
  buying_price: string
  selling_price: string
  is_cover_stock: boolean
  is_insert_stock: boolean
  is_sticker_stock: boolean
  is_specialty: boolean
  is_active: boolean
  is_default: boolean
  width_mm: number | null
  height_mm: number | null
  quantity_in_stock: number | null
}

export interface ShopPaperPayload {
  display_name?: string
  category: string
  gsm: number
  sheet_size: string
  buying_price: string | number
  selling_price: string | number
  is_cover_stock?: boolean
  is_insert_stock?: boolean
  is_sticker_stock?: boolean
  is_specialty?: boolean
  is_active?: boolean
}

export function useShopPapers(shopSlug: MaybeRefOrGetter<string | null>) {
  const api = useApi()
  const getSlug = () => toValue(shopSlug)

  async function list(): Promise<ShopPaper[]> {
    const slug = getSlug()
    if (!slug) return []
    const data = await api<ShopPaper[] | { results: ShopPaper[] }>(API.shopPapers(slug))
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function create(payload: ShopPaperPayload): Promise<ShopPaper> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<ShopPaper>(API.shopPapers(slug), { method: 'POST', body: payload })
  }

  async function update(id: number, payload: Partial<ShopPaperPayload>): Promise<ShopPaper> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<ShopPaper>(API.shopPaperDetail(slug, id), { method: 'PATCH', body: payload })
  }

  async function remove(id: number): Promise<void> {
    const slug = getSlug()
    if (!slug) throw new Error('No shop selected')
    return api<void>(API.shopPaperDetail(slug, id), { method: 'DELETE' })
  }

  return { list, create, update, remove }
}
