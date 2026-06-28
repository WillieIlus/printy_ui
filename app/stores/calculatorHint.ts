import { defineStore } from 'pinia'

export interface CalculatorHint {
  productType: string | null
  quantity: number | null
  turnaround: 'standard' | 'express' | 'same_day' | null
  estimatedUnitPrice: number | null
  estimatedTotal: number | null
  currency: string
}

const EMPTY_HINT: CalculatorHint = {
  productType: null,
  quantity: null,
  turnaround: null,
  estimatedUnitPrice: null,
  estimatedTotal: null,
  currency: 'KES',
}

export const useCalculatorHintStore = defineStore('calculatorHint', {
  state: (): CalculatorHint => ({ ...EMPTY_HINT }),

  actions: {
    setHint(hint: Partial<CalculatorHint>) {
      Object.assign(this, hint)
    },

    clearHint() {
      Object.assign(this, EMPTY_HINT)
    },
  },
})
