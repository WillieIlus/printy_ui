const PENDING_CLIENT_QUOTE_KEY = 'printy.pending-client-quote'

export interface PendingClientQuotePayload {
  product_type: string
  quantity: number
  finished_size: string
  paper_stock: string
  print_sides: string
  color_mode: string
  requested_gsm: number | null
  lamination: string
  custom_brief: string
  artwork_name: string
  saved_at: string
  source: 'homepage' | 'dashboard'
}

function normalizePendingClientQuote(payload: Partial<PendingClientQuotePayload>): PendingClientQuotePayload {
  return {
    product_type: String(payload.product_type || '').trim(),
    quantity: Math.max(1, Number(payload.quantity || 0) || 1),
    finished_size: String(payload.finished_size || '').trim(),
    paper_stock: String(payload.paper_stock || '').trim(),
    print_sides: String(payload.print_sides || 'SIMPLEX').trim() || 'SIMPLEX',
    color_mode: String(payload.color_mode || 'FULL_COLOR').trim() || 'FULL_COLOR',
    requested_gsm: payload.requested_gsm === null || payload.requested_gsm === undefined
      ? null
      : Number(payload.requested_gsm) || null,
    lamination: String(payload.lamination || 'none').trim() || 'none',
    custom_brief: String(payload.custom_brief || '').trim(),
    artwork_name: String(payload.artwork_name || '').trim(),
    saved_at: typeof payload.saved_at === 'string' && payload.saved_at ? payload.saved_at : new Date().toISOString(),
    source: payload.source === 'dashboard' ? 'dashboard' : 'homepage',
  }
}

export function usePendingClientQuote() {
  const quote = useState<PendingClientQuotePayload | null>('pending-client-quote', () => null)

  function load() {
    if (!import.meta.client) {
      return quote.value
    }

    const raw = window.localStorage.getItem(PENDING_CLIENT_QUOTE_KEY)
    if (!raw) {
      quote.value = null
      return null
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PendingClientQuotePayload>
      quote.value = normalizePendingClientQuote(parsed)
      return quote.value
    } catch {
      window.localStorage.removeItem(PENDING_CLIENT_QUOTE_KEY)
      quote.value = null
      return null
    }
  }

  function save(payload: Partial<PendingClientQuotePayload>) {
    const next = normalizePendingClientQuote(payload)
    quote.value = next
    if (import.meta.client) {
      window.localStorage.setItem(PENDING_CLIENT_QUOTE_KEY, JSON.stringify(next))
    }
    return next
  }

  function clear() {
    quote.value = null
    if (import.meta.client) {
      window.localStorage.removeItem(PENDING_CLIENT_QUOTE_KEY)
    }
  }

  return {
    quote,
    hasPendingQuote: computed(() => Boolean(quote.value)),
    load,
    save,
    clear,
    clearPendingQuote: clear,
  }
}
