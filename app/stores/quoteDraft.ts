import type { QuoteDraft } from '~/shared/types/buyer'
import type { AddProductItemPayload, AddCustomItemPayload } from '~/services/quoteDraft'
import { getActiveDraft, getQuoteRequest, addItem, updateItem, removeItem, previewPrice, requestQuote } from '~/services/quoteDraft'
import { safeLogError } from '~/utils/safeLog'

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

  async function ensureDraftForShop(shopSlug: string) {
    const existingDraft = activeDraft.value
    const existingShopSlug = existingDraft?.shop_slug ?? currentShopSlug.value

    if (!existingDraft || existingShopSlug !== shopSlug) {
      setShop(shopSlug)
      return await loadActiveDraft()
    }

    currentShopSlug.value = existingShopSlug
    return existingDraft
  }

  async function addProductToQuote(productId: number, shopSlug: string, pricingMode: 'SHEET' | 'LARGE_FORMAT' = 'SHEET') {
    const draft = await ensureDraftForShop(shopSlug)
    if (!draft) return null
    const payload: AddProductItemPayload = {
      item_type: 'PRODUCT',
      product: productId,
      quantity: 100,
      pricing_mode: pricingMode,
    }
    const item = await addItem(draft.id, payload)
    await refreshDraft()
    return item
  }

  async function addTweakedProductToQuote(shopSlug: string, payload: AddProductItemPayload) {
    const draft = await ensureDraftForShop(shopSlug)
    if (!draft) return null
    const { tweakAndAdd } = await import('~/services/quoteDraft')
    const item = await tweakAndAdd(draft.id, payload)
    await refreshDraft()
    return item
  }

  async function addCustomToQuote(payload: AddCustomItemPayload) {
    const slug = currentShopSlug.value
    if (!slug) return null
    const draft = await ensureDraftForShop(slug)
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
      safeLogError(err, 'quoteDraft.refresh')
    }
  }

  async function updateItemQty(itemId: number, qty: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return
    if (qty < 1) return
    await updateItem(draft.id, itemId, { quantity: qty } as Partial<AddProductItemPayload>)
    await refreshDraft()
  }

  async function removeItemFromDraft(itemId: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return
    await removeItem(draft.id, itemId)
    await refreshDraft()
  }

  async function submitDraft() {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return null
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
    ensureDraftForShop,
    addToQuote,
    addProductToQuote,
    addTweakedProductToQuote,
    addCustomToQuote,
    updateItemQty,
    removeItemFromDraft,
    previewPrice,
    submitDraft,
    refreshDraft,
    clearDraft,
  }
})
