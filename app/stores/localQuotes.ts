import type { QuoteSnapshot } from '~/utils/quoteMessage'

// PERSIST: localStorage (quote drafts only — no tokens). See app/stores/README.md
const STORAGE_KEY = 'printy_local_quotes'

export interface LocalQuote {
  id: string
  shopSlug: string
  shopName: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  jobName?: string
  snapshot: QuoteSnapshot
  costBreakdown?: { label: string; amount: string; configured: boolean }[]
  suggestedPrice: string
  overridePrice?: string | null
  profit?: string
  marginPercent?: number
  status: 'draft' | 'sent' | 'accepted'
  createdAt: string
  updatedAt: string
}

function loadFromStorage(): LocalQuote[] {
  if (import.meta.server || typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(quotes: LocalQuote[]) {
  if (import.meta.server || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
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
    const updated = {
      ...quotes.value[idx],
      ...payload,
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
