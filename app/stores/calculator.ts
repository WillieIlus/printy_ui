import { fetchCalculatorConfig, fetchCalculatorPreview, normalizeCalculatorPreviewResponse } from '~/services/calculator'
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

export const useCalculatorStore = defineStore('calculator', () => {
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

  const selectedShopIds = ref<number[]>([])

  const products = computed(() => config.value?.products ?? [])
  const selectedProduct = computed<CalculatorProductConfig | null>(
    () => products.value.find(product => product.key === selectedProductType.value) ?? null,
  )
  const fields = computed<CalculatorFieldConfig[]>(() => selectedProduct.value?.fields ?? [])

  function toggleShop(shopId: number) {
    const idx = selectedShopIds.value.indexOf(shopId)
    if (idx === -1) {
      selectedShopIds.value.push(shopId)
    } else {
      selectedShopIds.value.splice(idx, 1)
    }
  }

  function isShopSelected(shopId: number) {
    return selectedShopIds.value.includes(shopId)
  }

  function selectProduct(productType: string) {
    selectedProductType.value = productType
    const product = products.value.find(item => item.key === productType) ?? null
    form.value = buildDefaults(product)
    preview.value = null
    previewLoaded.value = false
    previewError.value = null
    selectedShopIds.value = []
  }

  function setField(key: string, value: string | number | boolean | null) {
    form.value = {
      ...form.value,
      [key]: value,
      product_type: selectedProductType.value,
    }
    preview.value = null
    previewLoaded.value = false
    previewError.value = null
    selectedShopIds.value = []
  }

  async function loadConfig() {
    configLoading.value = true
    configError.value = null
    try {
      const loadedConfig = await fetchCalculatorConfig()
      config.value = loadedConfig
      if (!selectedProduct.value && loadedConfig.products.length > 0) {
        selectProduct(loadedConfig.products[0]!.key)
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
    previewLoaded.value = false
    previewError.value = null
    try {
      const response = await fetchCalculatorPreview({
        ...form.value,
        product_type: selectedProductType.value,
      })
      if (previewRequestId.value !== requestId) return preview.value

      preview.value = normalizeCalculatorPreviewResponse(response)
      previewLoaded.value = true
      selectedShopIds.value = []
      return preview.value
    } catch (error) {
      if (previewRequestId.value !== requestId) return preview.value

      preview.value = null
      previewLoaded.value = false
      previewError.value = parseApiError(
        error,
        'We couldn\'t check live shop matches. Try again.',
        {
          networkMessage: 'We couldn\'t check live shop matches. Try again.',
          serverMessage: 'We couldn\'t check live shop matches. Try again.',
        },
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
    selectedShopIds,
    loadConfig,
    selectProduct,
    setField,
    fetchPreview,
    fieldOptions,
    toggleShop,
    isShopSelected,
  }
})
