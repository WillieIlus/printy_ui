import type { Product, PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { extractApiFeedback } from '~/utils/api-feedback'
import { parseApiError } from '~/utils/api-error'
import { safeLogError } from '~/utils/safeLog'
import { isProductPublic } from '~/utils/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const productsLoaded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const updateFieldErrors = ref<Record<string, string>>({})
  /** Keyed by `${productId}-${field}` to track per-toggle in-flight state. */
  const toggleLoading = ref<Record<string, boolean>>({})

  // ---------------------------------------------------------------------------
  // Fetch
  // ---------------------------------------------------------------------------
  async function fetchProducts(shopSlug: string) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const data = await $api<PaginatedResponse<Product> | Product[]>(API.shopProducts(shopSlug))
      products.value = Array.isArray(data) ? data : ((data as PaginatedResponse<Product>).results ?? [])
      productsLoaded.value = true
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch products')
      products.value = []
      productsLoaded.value = true
      safeLogError(err, 'product.fetchProducts')
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(shopSlug: string, id: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentProduct.value = await $api<Product>(API.shopProductDetail(shopSlug, id))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch product')
      safeLogError(err, 'product.fetchProduct')
    } finally {
      loading.value = false
    }
  }

  /**
   * Same as fetchProduct but semantically named for dashboard use-cases where
   * we explicitly want ALL products regardless of draft/published state.
   * The shop-owner endpoint (IsAuthenticated) already returns drafts — this is
   * just a clearly-labelled alias so call-sites communicate intent.
   */
  async function fetchByIdForDashboard(shopSlug: string, id: number) {
    loading.value = true
    error.value = null
    currentProduct.value = null
    try {
      const { $api } = useNuxtApp()
      currentProduct.value = await $api<Product>(API.shopProductDetail(shopSlug, id))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch product')
      safeLogError(err, 'product.fetchByIdForDashboard')
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Update
  // ---------------------------------------------------------------------------
  async function updateProduct(shopSlug: string, id: number, data: Partial<Product>) {
    loading.value = true
    error.value = null
    updateFieldErrors.value = {}
    try {
      const { $api } = useNuxtApp()
      const updated = await $api<Product>(API.shopProductDetail(shopSlug, id), {
        method: 'PATCH',
        body: data,
      })
      currentProduct.value = updated
      const idx = products.value.findIndex((p) => p.id === id)
      if (idx !== -1) products.value[idx] = updated
      return { success: true, product: updated }
    } catch (err: unknown) {
      const feedback = extractApiFeedback(err, 'Failed to update product')
      error.value = feedback.message
      updateFieldErrors.value = feedback.fieldErrors
      safeLogError(err, 'product.updateProduct')
      return { success: false, error: feedback.message, fieldErrors: feedback.fieldErrors }
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Toggle (optimistic PATCH for is_published / is_public)
  // ---------------------------------------------------------------------------
  async function toggleField(
    shopSlug: string,
    id: number,
    field: 'is_published' | 'is_public',
    value: boolean,
  ) {
    const key = `${id}-${field}`
    toggleLoading.value[key] = true

    // Build the patch body and the optimistic local state update
    const patch: Partial<Product> =
      field === 'is_published'
        ? { status: value ? 'PUBLISHED' : 'DRAFT' }
        : { is_public: value }

    // Optimistic update — capture old state for rollback
    const listIdx = products.value.findIndex((p) => p.id === id)
    const prevListProduct = listIdx !== -1 ? { ...products.value[listIdx] } : null
    const prevCurrentProduct = currentProduct.value?.id === id ? { ...currentProduct.value } : null

    function applyOptimistic() {
      if (listIdx !== -1) products.value[listIdx] = { ...products.value[listIdx], ...patch }
      if (currentProduct.value?.id === id) currentProduct.value = { ...currentProduct.value, ...patch }
    }

    function revert() {
      if (listIdx !== -1 && prevListProduct) products.value[listIdx] = prevListProduct
      if (currentProduct.value?.id === id && prevCurrentProduct) currentProduct.value = prevCurrentProduct
    }

    applyOptimistic()

    try {
      const { $api } = useNuxtApp()
      const updated = await $api<Product>(API.shopProductDetail(shopSlug, id), {
        method: 'PATCH',
        body: patch,
      })
      // Replace with server-confirmed state
      if (listIdx !== -1) products.value[listIdx] = updated
      if (currentProduct.value?.id === id) currentProduct.value = updated
      return { success: true }
    } catch (err: unknown) {
      revert()
      const message = parseApiError(err, 'Failed to update product')
      error.value = message
      safeLogError(err, 'product.toggleField')
      return { success: false, error: message }
    } finally {
      toggleLoading.value[key] = false
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function isToggleLoading(id: number, field: 'is_published' | 'is_public') {
    return toggleLoading.value[`${id}-${field}`] ?? false
  }

  /**
   * All products with no filter — use this on dashboard/owner pages so
   * drafts and unlisted products are always visible.
   */
  const allProducts = computed(() => products.value)

  /**
   * Products visible in public listings: published + is_public.
   * Uses the shared `isProductPublic` predicate so the rule lives in one place.
   */
  const publicProducts = computed(() => products.value.filter(isProductPublic))

  return {
    // State
    products,
    currentProduct,
    productsLoaded,
    loading,
    error,
    updateFieldErrors,
    toggleLoading,
    // Getters
    allProducts,
    publicProducts,
    // Actions
    fetchProducts,
    fetchProduct,
    fetchByIdForDashboard,
    updateProduct,
    toggleField,
    isToggleLoading,
  }
})
