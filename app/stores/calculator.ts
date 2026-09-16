import { defineStore } from 'pinia'
import type { CalcInput, QuoteResult } from '~/shared/workflow/pricing'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { buildClientSnapshot, buildDraftTitle } from '~/shared/quote-handoff'
import type { BuyerQuoteItem, CalculatorDraft, QuoteRequestSummary } from '~/shared/types'

const STORAGE_KEY = 'printy_calculator'
const SESSION_KEY = 'printy_guest_session'
const PENDING_DRAFT_KEY = 'printy_pending_draft'

interface PendingDraft {
  id: number
  reference: string
}

function isValidInput(x: unknown): x is CalcInput {
  if (!x || typeof x !== 'object') {
    return false
  }
  const r = x as Record<string, unknown>
  return (
    typeof r.productId === 'string'
    && typeof r.sizeId === 'string'
    && typeof r.quantity === 'number'
    && typeof r.paperId === 'string'
    && (r.colorMode === 'COLOR' || r.colorMode === 'BW')
    && (r.sides === 'SIMPLEX' || r.sides === 'DUPLEX')
    && Array.isArray(r.finishingIds)
    && typeof r.designId === 'string'
    && typeof r.rushId === 'string'
    && typeof r.deliveryId === 'string'
    && typeof r.brokerId === 'string'
  )
}

/**
 * Persists the quote calculator inputs so a visitor's spec survives the
 * public -> sign-up -> buyer-workspace journey (localStorage, SSR-safe).
 */
export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    input: null as CalcInput | null,
  }),
  actions: {
    restore(): CalcInput | null {
      if (!import.meta.client) {
        return this.input
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as unknown
          if (isValidInput(parsed)) {
            this.input = parsed
          }
        }
      } catch {
        /* ignore malformed storage */
      }
      return this.input
    },
    persist(input: CalcInput) {
      this.input = input
      if (import.meta.client) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
        } catch {
          /* storage unavailable - degrade gracefully */
        }
      }
    },
    setInput(input: CalcInput) {
      this.persist(input)
    },
    clear() {
      this.input = null
      if (import.meta.client) {
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* noop */
        }
      }
    },
    guestSessionKey(): string {
      if (!import.meta.client) {
        return ''
      }
      try {
        const existing = window.localStorage.getItem(SESSION_KEY)
        if (existing) {
          return existing
        }
        const created = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? `gs_${crypto.randomUUID()}`
          : `gs_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
        window.localStorage.setItem(SESSION_KEY, created)
        return created
      } catch {
        return `gs_${Date.now().toString(36)}`
      }
    },
    pendingDraft(): PendingDraft | null {
      if (!import.meta.client) {
        return null
      }
      try {
        const raw = window.localStorage.getItem(PENDING_DRAFT_KEY)
        if (!raw) {
          return null
        }
        const parsed = JSON.parse(raw) as { id?: unknown; reference?: unknown }
        return typeof parsed.id === 'number' && typeof parsed.reference === 'string'
          ? { id: parsed.id, reference: parsed.reference }
          : null
      } catch {
        return null
      }
    },
    rememberDraft(draft: CalculatorDraft) {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.setItem(PENDING_DRAFT_KEY, JSON.stringify({ id: draft.id, reference: draft.draft_reference }))
      } catch {
        /* noop */
      }
    },
    forgetPendingDraft() {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.removeItem(PENDING_DRAFT_KEY)
      } catch {
        /* noop */
      }
    },
    /**
     * Saves the visitor's spec as a server-side guest draft so it survives
     * the public calculator → sign-up journey and can be claimed on register.
     */
    async saveGuestDraft(input: CalcInput, quote: QuoteResult) {
      const { api } = useApi()
      const draft = await api<CalculatorDraft>(API.quoteDrafts.guest, {
        method: 'POST',
        auth: false,
        body: {
          session_key: this.guestSessionKey(),
          title: buildDraftTitle(input),
          calculator_inputs_snapshot: input,
          pricing_snapshot: buildClientSnapshot(input, quote),
        },
      })
      this.rememberDraft(draft)
      return draft
    },
    /**
     * Creates (or claims this browser's guest draft by session key) a server
     * draft for the authenticated buyer, then submits it as a quote request.
     */
    async createAndSendDraft(input: CalcInput, quote: QuoteResult) {
      const { api } = useApi()
      const draft = await api<CalculatorDraft>(API.quoteDrafts.list, {
        method: 'POST',
        body: {
          session_key: this.guestSessionKey(),
          title: buildDraftTitle(input),
          calculator_inputs_snapshot: input,
          pricing_snapshot: buildClientSnapshot(input, quote),
        },
      })
      const quoteRequests = await api<QuoteRequestSummary[]>(API.quoteDrafts.send(draft.id), {
        method: 'POST',
        body: {},
      })
      return { draft, quoteRequests }
    },
    async fetchBuyerQuotes() {
      const { api } = useApi()
      return api<BuyerQuoteItem[]>(API.quoteDrafts.buyerQuotes, {
        method: 'GET',
      })
    },
  },
})