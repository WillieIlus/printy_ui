import { defineStore } from 'pinia'
import type { QuoteItem, Product, Paper, MaterialItem, FinishingRate } from '~/shared/types'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    items: [] as QuoteItem[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    totalQuantity: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
  },

  actions: {
    addItem(payload: {
      product: Product
      quantity: number
      sides: 'SIMPLEX' | 'DUPLEX'
      color_mode: 'BW' | 'COLOR'
      paper?: Paper | null
      material?: MaterialItem | null
      finishings: FinishingRate[]
      special_instructions?: string
    }) {
      const id = `qi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      this.items.push({ ...payload, id })
    },

    removeItem(id: string) {
      this.items = this.items.filter(i => i.id !== id)
    },

    clearQuote() {
      this.items = []
    },
  },
})
