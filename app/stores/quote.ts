import type { Quote, QuoteItem, ProductTemplate, PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'

export const useQuoteStore = defineStore('quote', () => {
  const quotes = ref<Quote[]>([])
  const myQuotes = ref<Quote[]>([])
  const currentQuote = ref<Quote | null>(null)
  const productTemplates = ref<ProductTemplate[]>([])
  const quoteItems = ref<QuoteItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  async function fetchShopQuotes(shopSlug: string, params?: Record<string, string | number>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<PaginatedResponse<Quote>>(API.shopQuotes(shopSlug), { params })
      quotes.value = response.results
      pagination.value = { count: response.count, next: response.next, previous: response.previous }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quotes'
    } finally {
      loading.value = false
    }
  }

  async function fetchMyQuotes() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      myQuotes.value = await $api<Quote[]>(API.myQuotes())
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch my quotes'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuote(shopSlug: string, pk: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentQuote.value = await $api<Quote>(API.shopQuoteDetail(shopSlug, pk))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quote'
    } finally {
      loading.value = false
    }
  }

  async function createQuote(shopSlug: string, data: Partial<Quote>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const quote = await $api<Quote>(API.shopQuotes(shopSlug), { method: 'POST', body: data })
      quotes.value.push(quote)
      return { success: true, quote }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create quote'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function updateQuoteStatus(shopSlug: string, pk: number, status: Quote['status']) {
    try {
      const { $api } = useNuxtApp()
      const quote = await $api<Quote>(API.shopQuoteUpdateStatus(shopSlug, pk), {
        method: 'POST',
        body: { status },
      })
      currentQuote.value = quote
      return { success: true, quote }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' }
    }
  }

  async function calculateQuote(shopSlug: string, pk: number) {
    try {
      const { $api } = useNuxtApp()
      return await $api<{ subtotal: string; tax: string; total: string }>(
        API.shopQuoteCalculate(shopSlug, pk)
      )
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to calculate'
      throw err
    }
  }

  async function duplicateQuote(shopSlug: string, pk: number) {
    try {
      const { $api } = useNuxtApp()
      const quote = await $api<Quote>(API.shopQuoteDuplicate(shopSlug, pk), { method: 'POST' })
      quotes.value.push(quote)
      return { success: true, quote }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to duplicate' }
    }
  }

  async function fetchQuoteItems(shopSlug: string, quoteId: number) {
    try {
      const { $api } = useNuxtApp()
      quoteItems.value = await $api<QuoteItem[]>(API.shopQuoteItems(shopSlug, quoteId))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch quote items'
      throw err
    }
  }

  async function addQuoteItem(shopSlug: string, quoteId: number, item: Partial<QuoteItem>) {
    try {
      const { $api } = useNuxtApp()
      const newItem = await $api<QuoteItem>(API.shopQuoteItems(shopSlug, quoteId), {
        method: 'POST',
        body: item,
      })
      quoteItems.value.push(newItem)
      if (currentQuote.value?.items) currentQuote.value.items.push(newItem)
      return { success: true, item: newItem }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add item' }
    }
  }

  async function updateQuoteItem(
    shopSlug: string,
    quoteId: number,
    pk: number,
    data: Partial<QuoteItem>
  ) {
    try {
      const { $api } = useNuxtApp()
      const item = await $api<QuoteItem>(API.shopQuoteItemDetail(shopSlug, quoteId, pk), {
        method: 'PATCH',
        body: data,
      })
      const idx = quoteItems.value.findIndex((i) => i.id === pk)
      if (idx !== -1) quoteItems.value[idx] = item
      if (currentQuote.value?.items) {
        const i = currentQuote.value.items.findIndex((x) => x.id === pk)
        if (i !== -1) currentQuote.value.items[i] = item
      }
      return { success: true, item }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update item' }
    }
  }

  async function deleteQuoteItem(shopSlug: string, quoteId: number, pk: number) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.shopQuoteItemDetail(shopSlug, quoteId, pk), { method: 'DELETE' })
      quoteItems.value = quoteItems.value.filter((i) => i.id !== pk)
      if (currentQuote.value?.items) currentQuote.value.items = currentQuote.value.items.filter((i) => i.id !== pk)
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete item' }
    }
  }

  async function requestQuote(shopSlug: string, data: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const quote = await $api<Quote>(API.requestQuote(shopSlug), { method: 'POST', body: data })
      return { success: true, quote }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to request quote'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProductTemplates(shopSlug: string) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      productTemplates.value = await $api<ProductTemplate[]>(API.productTemplates(shopSlug))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product templates'
    } finally {
      loading.value = false
    }
  }

  async function createProductTemplate(shopSlug: string, data: Partial<ProductTemplate>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const product = await $api<ProductTemplate>(API.productTemplates(shopSlug), {
        method: 'POST',
        body: data,
      })
      productTemplates.value.push(product)
      return { success: true, product }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product template'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  return {
    quotes,
    myQuotes,
    currentQuote,
    productTemplates,
    quoteItems,
    loading,
    error,
    pagination,
    fetchShopQuotes,
    fetchMyQuotes,
    fetchQuote,
    createQuote,
    updateQuoteStatus,
    calculateQuote,
    duplicateQuote,
    fetchQuoteItems,
    addQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
    requestQuote,
    fetchProductTemplates,
    createProductTemplate,
  }
})
