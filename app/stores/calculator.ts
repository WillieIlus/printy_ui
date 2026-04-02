import { API } from '~/shared/api-paths'
import type { PreviewPriceResponse } from '~/shared/types/buyer'

export interface CalculatorSelectionOption {
  label: string
  value: string | number
}

export interface CalculatorContext {
  shopId: number | null
  shopSlug: string | null
  productId: number | null
  quantity: number
  widthMm?: number | null
  heightMm?: number | null
  turnaroundDays?: number | null
  paperId: number | null
  machineId: number | null
  colorMode: 'BW' | 'COLOR'
  sides: 'SIMPLEX' | 'DUPLEX'
  applyDuplexSurcharge?: boolean | null
  finishings: Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>
}

export const useCalculatorStore = defineStore('calculator', () => {
  const context = ref<CalculatorContext>({
    shopId: null,
    shopSlug: null,
    productId: null,
    quantity: 100,
    widthMm: null,
    heightMm: null,
    turnaroundDays: null,
    paperId: null,
    machineId: null,
    colorMode: 'COLOR',
    sides: 'SIMPLEX',
    applyDuplexSurcharge: null,
    finishings: [],
  })
  const preview = ref<PreviewPriceResponse | null>(null)
  const previewLoading = ref(false)
  const previewLoaded = ref(false)
  const previewError = ref<string | null>(null)

  function setContext(partial: Partial<CalculatorContext>) {
    context.value = { ...context.value, ...partial }
  }

  function resetPreview() {
    preview.value = null
    previewLoaded.value = false
    previewError.value = null
  }

  async function fetchPreview() {
    previewLoading.value = true
    previewError.value = null
    try {
      const { $api } = useNuxtApp()
      preview.value = await $api<PreviewPriceResponse>(API.calculatorPreview(), {
        method: 'POST',
        body: {
          shop: context.value.shopId,
          product: context.value.productId,
          quantity: context.value.quantity,
          width_mm: context.value.widthMm,
          height_mm: context.value.heightMm,
          turnaround_days: context.value.turnaroundDays,
          paper: context.value.paperId,
          machine: context.value.machineId,
          color_mode: context.value.colorMode,
          sides: context.value.sides,
          apply_duplex_surcharge: context.value.applyDuplexSurcharge,
          finishings: context.value.finishings,
        },
      })
      previewLoaded.value = true
      return preview.value
    } catch (err) {
      previewError.value = err instanceof Error ? err.message : 'Preview failed.'
      throw err
    } finally {
      previewLoading.value = false
    }
  }

  return {
    context,
    preview,
    previewLoading,
    previewLoaded,
    previewError,
    setContext,
    resetPreview,
    fetchPreview,
  }
})
