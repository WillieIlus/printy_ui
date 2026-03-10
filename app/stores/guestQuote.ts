/**
 * Guest quote store — localStorage-backed cart for unauthenticated users.
 * When user submits, they sign up/sign in and we create the quote via API.
 */
import type { AddProductItemPayload } from '~/services/quoteDraft'

export interface GuestQuoteItem {
  id: string
  item_type: 'PRODUCT'
  product: number
  product_name: string
  quantity: number
  pricing_mode?: string
  paper?: number | null
  material?: number | null
  machine?: number | null
  sides?: string
  color_mode?: string
  special_instructions?: string
  finishings?: { finishing_rate: number }[]
}

export interface GuestQuote {
  shopSlug: string
  shopName: string
  items: GuestQuoteItem[]
}

const STORAGE_KEY = 'printy-guest-quote'

function loadFromStorage(): GuestQuote | null {
  if (import.meta.server) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GuestQuote
    if (!parsed?.shopSlug || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

function saveToStorage(quote: GuestQuote | null) {
  if (import.meta.server) return
  try {
    if (quote && quote.items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

function generateId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useGuestQuoteStore = defineStore('guestQuote', () => {
  const quote = ref<GuestQuote | null>(loadFromStorage())

  watch(quote, (q) => saveToStorage(q), { deep: true })

  const hasItems = computed(() => (quote.value?.items?.length ?? 0) > 0)
  const itemCount = computed(() => quote.value?.items?.length ?? 0)

  function setQuote(shopSlug: string, shopName: string) {
    const existing = quote.value
    if (existing && existing.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] }
    } else if (!existing) {
      quote.value = { shopSlug, shopName, items: [] }
    } else {
      quote.value = { ...existing, shopName }
    }
  }

  function addItem(shopSlug: string, shopName: string, productName: string, payload: Omit<AddProductItemPayload, 'item_type'>) {
    if (!quote.value || quote.value.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] }
    }

    const item: GuestQuoteItem = {
      id: generateId(),
      item_type: 'PRODUCT',
      product: payload.product,
      product_name: productName,
      quantity: payload.quantity ?? 100,
      pricing_mode: payload.pricing_mode,
      paper: payload.paper ?? null,
      material: payload.material ?? null,
      machine: payload.machine ?? null,
      sides: payload.sides,
      color_mode: payload.color_mode,
      special_instructions: payload.special_instructions,
      finishings: payload.finishings,
    }
    quote.value.items.push(item)
  }

  function updateItemQty(itemId: string, qty: number) {
    const item = quote.value?.items.find((i) => i.id === itemId)
    if (!item) return
    item.quantity = Math.max(100, qty)
  }

  function removeItem(itemId: string) {
    if (!quote.value) return
    quote.value.items = quote.value.items.filter((i) => i.id !== itemId)
    if (quote.value.items.length === 0) {
      quote.value = null
    }
  }

  function clear() {
    quote.value = null
    saveToStorage(null)
  }

  /** Convert guest items to API payload for tweak-and-add */
  function getAddPayloads(): Omit<AddProductItemPayload, 'item_type'>[] {
    return (quote.value?.items ?? []).map((i) => ({
      product: i.product,
      quantity: i.quantity,
      pricing_mode: (i.pricing_mode as 'SHEET' | 'LARGE_FORMAT') ?? 'SHEET',
      paper: i.paper ?? undefined,
      material: i.material ?? undefined,
      machine: i.machine ?? undefined,
      sides: (i.sides as 'SIMPLEX' | 'DUPLEX') ?? 'SIMPLEX',
      color_mode: (i.color_mode as 'BW' | 'COLOR') ?? 'COLOR',
      special_instructions: i.special_instructions ?? undefined,
      finishings: i.finishings ?? undefined,
    }))
  }

  return {
    quote,
    hasItems,
    itemCount,
    setQuote,
    addItem,
    updateItemQty,
    removeItem,
    clear,
    getAddPayloads,
  }
})
