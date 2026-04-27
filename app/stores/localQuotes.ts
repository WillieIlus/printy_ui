import { getBrowserStorage } from '~/utils/browser-storage'

// PERSIST: localStorage (quote drafts only — no tokens). See app/stores/README.md
const STORAGE_KEY = 'printy_local_quotes'
const storage = getBrowserStorage()

export interface LocalQuote {
  id: string
  shopSlug: string
  shopName: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  jobName?: string
  requestSnapshot: Record<string, unknown>
  backendPreview?: Record<string, unknown> | null
  backendQuoteId?: number | null
  status: 'draft' | 'sent'
  createdAt: string
  updatedAt: string
}

function loadFromStorage(): LocalQuote[] {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(quotes: LocalQuote[]) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  } catch {
    /* ignore */
  }
}

function generateId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useLocalQuotesStore = defineStore('localQuotes', () => {
  const quotes = ref<LocalQuote[]>(loadFromStorage())

  watch(
    quotes,
    (val) => saveToStorage(val),
    { deep: true }
  )

  function addQuote(payload: Omit<LocalQuote, 'id' | 'createdAt' | 'updatedAt'>): LocalQuote {
    const now = new Date().toISOString()
    const quote: LocalQuote = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    quotes.value = [quote, ...quotes.value]
    return quote
  }

  function updateQuote(id: string, payload: Partial<Omit<LocalQuote, 'id' | 'createdAt'>>): LocalQuote | null {
    const idx = quotes.value.findIndex((q) => q.id === id)
    if (idx === -1) return null
    const current = quotes.value[idx]
    if (!current) return null
    const updated: LocalQuote = {
      ...current,
      ...payload,
      id: current.id,
      shopSlug: current.shopSlug,
      shopName: current.shopName,
      requestSnapshot: current.requestSnapshot,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }
    quotes.value = [...quotes.value]
    quotes.value[idx] = updated
    return updated
  }

  function getById(id: string): LocalQuote | null {
    return quotes.value.find((q) => q.id === id) ?? null
  }

  function removeQuote(id: string): boolean {
    const idx = quotes.value.findIndex((q) => q.id === id)
    if (idx === -1) return false
    quotes.value = quotes.value.filter((q) => q.id !== id)
    return true
  }

  return {
    quotes,
    addQuote,
    updateQuote,
    getById,
    removeQuote,
  }
})
