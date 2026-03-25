import type { QuoteDraft } from '~/shared/types/buyer'
import { useStorage } from '@vueuse/core'
import { useApi } from '~/composables/useApi'
import type { AddProductItemPayload, AddCustomItemPayload } from '~/services/quoteDraft'
import { getActiveDraft, addItem, updateItem, removeItem, previewPrice, requestQuote } from '~/services/quoteDraft'
import { safeLogError } from '~/utils/safeLog'

export const useQuoteDraftStore = defineStore('quoteDraft', () => {
  const api = useApi()
  const activeDraft = ref<QuoteDraft | null>(null)
  const currentShopSlug = ref<string | null>(null)
  const currentFileId = useStorage<number | null>('quote-draft-current-file-id', null, localStorage)
  const isLoading = ref(false)

  function setShop(slug: string | null) {
    currentShopSlug.value = slug
  }

  function selectFile(fileId: number | null) {
    currentFileId.value = fileId
  }

  function clearSelectedFile() {
    currentFileId.value = null
  }

  function setFile(fileId: number | null) {
    selectFile(fileId)
  }

  async function loadActiveDraft() {
    const slug = currentShopSlug.value
    if (!slug) return null
    isLoading.value = true
    try {
      activeDraft.value = await getActiveDraft(slug, currentFileId.value, api)
      return activeDraft.value
    } finally {
      isLoading.value = false
    }
  }

  async function loadDraftForContext(shopSlug: string, fileId?: number | null) {
    setShop(shopSlug)
    if (fileId !== undefined) {
      selectFile(fileId)
    }
    return await loadActiveDraft()
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
    const item = await addItem(draft.id, payload, api)
    await refreshDraft()
    return item
  }

  async function addTweakedProductToQuote(shopSlug: string, payload: AddProductItemPayload) {
    const draft = await ensureDraftForShop(shopSlug)
    if (!draft) return null
    const { tweakAndAdd } = await import('~/services/quoteDraft')
    const item = await tweakAndAdd(draft.id, payload, api)
    await refreshDraft()
    return item
  }

  async function addCustomToQuote(payload: AddCustomItemPayload) {
    const slug = currentShopSlug.value
    if (!slug) return null
    const draft = await ensureDraftForShop(slug)
    if (!draft) return null
    const item = await addItem(draft.id, payload, api)
    await refreshDraft()
    return item
  }

  async function refreshDraft() {
    const draft = activeDraft.value
    if (!draft) return
    try {
      const slug = currentShopSlug.value
      if (slug) {
        activeDraft.value = await getActiveDraft(slug, currentFileId.value, api)
      }
    } catch (err) {
      safeLogError(err, 'quoteDraft.refresh')
    }
  }

  async function updateItemQty(itemId: number, qty: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return
    if (qty < 1) return
    await updateItem(draft.id, itemId, { quantity: qty } as Partial<AddProductItemPayload>, api)
    await refreshDraft()
  }

  async function removeItemFromDraft(itemId: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return
    await removeItem(draft.id, itemId, api)
    await refreshDraft()
  }

  async function submitDraft() {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'draft') return null
    const updated = await requestQuote(draft.id, api)
    activeDraft.value = updated
    return updated
  }

  function clearDraft() {
    activeDraft.value = null
    currentShopSlug.value = null
    clearSelectedFile()
  }

  async function addToQuote(productId: number, shopSlug: string, pricingMode: 'SHEET' | 'LARGE_FORMAT' = 'SHEET') {
    return addProductToQuote(productId, shopSlug, pricingMode)
  }

  return {
    activeDraft,
    currentShopSlug,
    currentFileId,
    isLoading,
    setShop,
    selectFile,
    clearSelectedFile,
    setFile,
    loadActiveDraft,
    loadDraftForContext,
    ensureDraftForShop,
    addToQuote,
    addProductToQuote,
    addTweakedProductToQuote,
    addCustomToQuote,
    updateItemQty,
    removeItemFromDraft,
    previewPrice: (draftId: number) => previewPrice(draftId, api),
    submitDraft,
    refreshDraft,
    clearDraft,
  }
})
