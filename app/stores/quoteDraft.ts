import type { QuoteDraft, QuoteItem } from '~/shared/types'
import type { AddProductItemPayload, AddCustomItemPayload } from '~/services/quoteDraft'
import { getActiveDraft, getQuoteRequest, addItem, updateItem, removeItem, previewPrice, requestQuote } from '~/services/quoteDraft'

export const useQuoteDraftStore = defineStore('quoteDraft', () => {
  const activeDraft = ref<QuoteDraft | null>(null)
  const currentShopSlug = ref<string | null>(null)
  const isLoading = ref(false)

  function setShop(slug: string | null) {
    currentShopSlug.value = slug
  }

  async function loadActiveDraft() {
    const slug = currentShopSlug.value
    if (!slug) return null
    isLoading.value = true
    try {
      activeDraft.value = await getActiveDraft(slug)
      return activeDraft.value
    } finally {
      isLoading.value = false
    }
  }

  async function addProductToQuote(productId: number, shopSlug: string, pricingMode: 'SHEET' | 'LARGE_FORMAT' = 'SHEET') {
    setShop(shopSlug)
    let draft = activeDraft.value
    if (!draft || currentShopSlug.value !== shopSlug) {
      draft = await loadActiveDraft()
    }
    if (!draft) return null
    const payload: AddProductItemPayload = {
      item_type: 'PRODUCT',
      product: productId,
      quantity: 1,
      pricing_mode: pricingMode,
    }
    const item = await addItem(draft.id, payload)
    await refreshDraft()
    return item
  }

  async function addCustomToQuote(payload: AddCustomItemPayload) {
    const slug = currentShopSlug.value
    if (!slug) return null
    let draft = activeDraft.value
    if (!draft || currentShopSlug.value !== slug) {
      draft = await loadActiveDraft()
    }
    if (!draft) return null
    const item = await addItem(draft.id, payload)
    await refreshDraft()
    return item
  }

  async function refreshDraft() {
    const draft = activeDraft.value
    if (!draft) return
    try {
      const slug = currentShopSlug.value
      if (slug) {
        activeDraft.value = await getActiveDraft(slug)
      }
    } catch (err) {
      console.error('Failed to refresh draft:', err)
    }
  }

  async function updateItemQty(itemId: number, qty: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return
    if (qty < 1) return
    await updateItem(draft.id, itemId, { quantity: qty } as Partial<AddProductItemPayload>)
    await refreshDraft()
  }

  async function removeItemFromDraft(itemId: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return
    await removeItem(draft.id, itemId)
    await refreshDraft()
  }

  async function submitDraft() {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return null
    const updated = await requestQuote(draft.id)
    activeDraft.value = updated
    return updated
  }

  function clearDraft() {
    activeDraft.value = null
    currentShopSlug.value = null
  }

  async function addToQuote(productId: number, shopSlug: string, pricingMode: 'SHEET' | 'LARGE_FORMAT' = 'SHEET') {
    return addProductToQuote(productId, shopSlug, pricingMode)
  }

  return {
    activeDraft,
    currentShopSlug,
    isLoading,
    setShop,
    loadActiveDraft,
    addToQuote,
    addProductToQuote,
    addCustomToQuote,
    updateItemQty,
    removeItemFromDraft,
    previewPrice,
    submitDraft,
    refreshDraft,
    clearDraft,
  }
})
