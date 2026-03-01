import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export type SheetSize = 'A5' | 'A4' | 'A3' | 'SRA3' | 'SRA4'
export type PaperType = 'GLOSS' | 'MATTE' | 'BOND' | 'ART'

/** Unified Paper (replaces PaperStock + PaperPrice) */
export interface Paper {
  id: number
  sheet_size: SheetSize
  sheet_size_display?: string
  gsm: number
  paper_type: PaperType
  paper_type_display?: string
  width_mm: number | null
  height_mm: number | null
  buying_price: string
  selling_price: string
  quantity_in_stock: number | null
  reorder_level: number | null
  is_active: boolean
  display_name?: string
  needs_reorder?: boolean
  created_at?: string
  updated_at?: string
}

export interface PaperCreateInput {
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string | number
  selling_price: string | number
  quantity_in_stock?: number | null
  reorder_level?: number | null
  is_active?: boolean
}

export const usePaperStockStore = defineStore('paperStock', {
  state: () => ({
    items: [] as Paper[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    lowStockItems: (state) =>
      state.items.filter(
        (p) =>
          p.needs_reorder ??
          (p.quantity_in_stock != null && p.reorder_level != null && p.quantity_in_stock <= p.reorder_level)
      ),
    activeItems: (state) => state.items.filter((p) => p.is_active !== false),
  },

  actions: {
    async fetchPaperStock(shopSlug: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const response = await $api<Paper[] | { results: Paper[] }>(API.shopPaper(shopSlug))
        this.items = Array.isArray(response) ? response : (response?.results ?? [])
        return this.items
      } catch (err) {
        this.error = parseApiError(err, 'Failed to fetch paper')
        this.items = []
        throw err
      } finally {
        this.loading = false
      }
    },

    async createPaperStock(shopSlug: string, data: PaperCreateInput) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const payload = {
          sheet_size: data.sheet_size,
          gsm: Number(data.gsm),
          paper_type: data.paper_type,
          buying_price: String(data.buying_price),
          selling_price: String(data.selling_price),
          quantity_in_stock: data.quantity_in_stock ?? null,
          reorder_level: data.reorder_level ?? null,
          is_active: data.is_active ?? true,
        }
        const item = await $api<Paper>(API.shopPaper(shopSlug), {
          method: 'POST',
          body: payload,
        })
        this.items.push(item)
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to create paper')
        this.error = message
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    async updatePaperStock(shopSlug: string, id: number, data: Partial<PaperCreateInput>) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const payload: Record<string, unknown> = { ...data }
        if (data.gsm != null) payload.gsm = Number(data.gsm)
        if (data.buying_price != null) payload.buying_price = String(data.buying_price)
        if (data.selling_price != null) payload.selling_price = String(data.selling_price)
        const item = await $api<Paper>(API.shopPaperDetail(shopSlug, id), {
          method: 'PATCH',
          body: payload,
        })
        const idx = this.items.findIndex((p) => p.id === id)
        if (idx >= 0) this.items[idx] = item
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to update paper')
        this.error = message
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    async deletePaperStock(shopSlug: string, id: number) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api(API.shopPaperDetail(shopSlug, id), { method: 'DELETE' })
        this.items = this.items.filter((p) => p.id !== id)
        return { success: true }
      } catch (err) {
        this.error = parseApiError(err, 'Failed to delete')
        throw err
      } finally {
        this.loading = false
      }
    },

    async adjustStock(shopSlug: string, id: number, adjustment: number) {
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const item = await $api<Paper>(API.shopPaperAdjust(shopSlug, id), {
          method: 'POST',
          body: { adjustment },
        })
        const idx = this.items.findIndex((p) => p.id === id)
        if (idx >= 0) this.items[idx] = item
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to adjust stock')
        this.error = message
        throw new Error(message)
      }
    },

    clear() {
      this.items = []
      this.error = null
    },
  },
})
