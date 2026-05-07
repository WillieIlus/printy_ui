import { defineStore } from 'pinia'
import {
  fetchCalculatorConfig,
  fetchDashboardCalculatorPreview,
  normalizeCalculatorPreviewResponse,
  normalizeCalculatorConfigResponse,
} from '~/services/calculator'
import type {
  CalculatorChoiceOption,
  CalculatorConfigResponse,
  CalculatorFieldConfig,
  CalculatorPreviewResponse,
  CalculatorProductConfig,
} from '~/types/api/calculator'
import { parseApiError } from '~/utils/api-error'

type CalculatorFormState = Record<string, string | number | boolean | null>

function normalizeOptionValue(option: CalculatorChoiceOption): string {
  return String(option.value ?? option.key ?? '')
}

function buildDefaults(product: CalculatorProductConfig | null): CalculatorFormState {
  if (!product) return {}
  return { product_type: product.key, ...product.defaults }
}

export const useDashboardCalculatorStore = defineStore('dashboardCalculator', () => {
  const config = ref<CalculatorConfigResponse | null>(null)
  const configLoading = ref(false)
  const configError = ref<string | null>(null)

  const selectedProductType = ref<string>('business_card')
  const form = ref<CalculatorFormState>({})

  const preview = ref<CalculatorPreviewResponse | null>(null)
  const previewLoading = ref(false)
  const previewLoaded = ref(false)
  const previewError = ref<string | null>(null)
  const previewRequestId = ref(0)

  const products = computed(() => config.value?.products ?? [])
  const selectedProduct = computed<CalculatorProductConfig | null>(
    () => products.value.find(product => product.key === selectedProductType.value) ?? null,
  )
  const fields = computed<CalculatorFieldConfig[]>(() => selectedProduct.value?.fields ?? [])

  function selectProduct(productType: string, options?: { resetDefaults?: boolean }) {
    const resetDefaults = options?.resetDefaults ?? true
    selectedProductType.value = productType
    const product = products.value.find(item => item.key === productType) ?? null
    form.value = resetDefaults
      ? buildDefaults(product)
      : { ...form.value, product_type: productType }
    preview.value = null
    previewLoaded.value = false
    previewError.value = null
  }

  function setField(key: string, value: string | number | boolean | null) {
    form.value = {
      ...form.value,
      [key]: value,
      product_type: selectedProductType.value,
    }
    // Auto-fetch preview on field change if we have enough data
    if (form.value.quantity && form.value.paper_id) {
       void fetchPreview()
    }
  }

  async function loadConfig() {
    configLoading.value = true
    configError.value = null
    try {
      // We can use the global config for fields, but the preview will use shop-specific logic
      const loadedConfig = await fetchCalculatorConfig()
      config.value = normalizeCalculatorConfigResponse(loadedConfig)
      
      if (!selectedProduct.value && config.value.products.length > 0) {
        selectProduct(config.value.products[0]!.key)
      } else if (selectedProduct.value) {
        form.value = {
          ...buildDefaults(selectedProduct.value),
          ...form.value,
          product_type: selectedProductType.value,
        }
      }
      return config.value
    } catch (error) {
      configError.value = error instanceof Error ? error.message : 'Failed to load calculator config.'
      throw error
    } finally {
      configLoading.value = false
    }
  }

  async function fetchPreview() {
    const requestId = previewRequestId.value + 1
    previewRequestId.value = requestId
    previewLoading.value = true
    previewError.value = null
    try {
      const response = await fetchDashboardCalculatorPreview({
        ...form.value,
        product_type: selectedProductType.value,
      })
      if (previewRequestId.value !== requestId) return preview.value

      preview.value = normalizeCalculatorPreviewResponse(response)
      previewLoaded.value = true
      return preview.value
    } catch (error) {
      if (previewRequestId.value !== requestId) return preview.value

      preview.value = null
      previewLoaded.value = false
      previewError.value = parseApiError(
        error,
        'We couldn\'t calculate the preview. Please check your inputs.',
      )
      return null
    } finally {
      if (previewRequestId.value === requestId) {
        previewLoading.value = false
      }
    }
  }

  const productOptions = computed(() =>
    products.value.map(product => ({
      label: product.label,
      value: product.key,
    })),
  )

  function fieldOptions(field: CalculatorFieldConfig): Array<{ label: string, value: string }> {
    return (field.options ?? []).map(option => ({
      label: option.gsm != null && option.category_label
        ? `${option.category_label} ${option.gsm}gsm`
        : option.label,
      value: normalizeOptionValue(option),
    }))
  }

  return {
    config,
    configLoading,
    configError,
    selectedProductType,
    selectedProduct,
    productOptions,
    form,
    fields,
    preview,
    previewLoading,
    previewLoaded,
    previewError,
    loadConfig,
    selectProduct,
    setField,
    fetchPreview,
    fieldOptions,
  }
})
