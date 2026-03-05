/**
 * Live quote preview — debounced calculator calls.
 * POST /api/calculator/quote-item/ (staff-only).
 */
import { useDebounceFn } from '@vueuse/core'
import { API } from '~/shared/api-paths'

export interface CalculatorInput {
  product_id: number
  quantity: number
  width_mm?: number | null
  height_mm?: number | null
  paper_id?: number | null
  grammage?: number | null
  paper_type?: string | null
  sheet_size?: string | null
  finishing_ids?: number[]
  machine_id?: number | null
  sides?: string
  color_mode?: string
}

export interface CalculatorResult {
  sheets_required: number
  imposition: { per_sheet: number; orientation: string; sheet_size_used: string }
  costs: {
    paper_cost: string
    print_cost: string
    finishing_cost: string
    overhead: string
    margin: string
    total_cost: string
    suggested_price: string
  }
  lead_time_estimate_hours: string
  can_calculate: boolean
  reason?: string
}

export function useCalculatorQuoteItem(options?: { debounceMs?: number }) {
  const { $api } = useNuxtApp()
  const debounceMs = options?.debounceMs ?? 450

  const result = ref<CalculatorResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(input: CalculatorInput): Promise<CalculatorResult | null> {
    if (!input.product_id || input.quantity <= 0) {
      result.value = null
      error.value = null
      return null
    }
    const payload: Record<string, unknown> = {
      product_id: input.product_id,
      quantity: input.quantity,
      sides: input.sides ?? 'SIMPLEX',
      color_mode: input.color_mode ?? 'COLOR',
      finishing_ids: input.finishing_ids ?? [],
    }
    if (input.width_mm != null) payload.width_mm = input.width_mm
    if (input.height_mm != null) payload.height_mm = input.height_mm
    if (input.paper_id != null) payload.paper_id = input.paper_id
    if (input.grammage != null) payload.grammage = input.grammage
    if (input.paper_type) payload.paper_type = input.paper_type
    if (input.sheet_size) payload.sheet_size = input.sheet_size
    if (input.machine_id != null) payload.machine_id = input.machine_id

    loading.value = true
    error.value = null
    try {
      const data = await $api<CalculatorResult>(API.calculatorQuoteItem(), {
        method: 'POST',
        body: payload,
      })
      result.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to calculate'
      result.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const debouncedFetch = useDebounceFn(fetch, debounceMs)

  function calculate(input: CalculatorInput) {
    debouncedFetch(input)
  }

  return {
    result,
    loading,
    error,
    calculate,
    fetch,
  }
}
