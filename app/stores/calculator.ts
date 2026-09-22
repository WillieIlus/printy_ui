import { defineStore } from 'pinia'
import {
  buildClientSnapshot,
  buildDraftTitle,
} from '~/shared/quote-handoff'
import {
  isSpec,
  makeDefaultSpec,
  normalizeSpec,
  type CalculatorSpec,
} from '~/shared/calculator-spec'
import { buildPublicPreviewPayload } from '~/shared/calculator-spec'
import type { CalculatorConfig } from '~/shared/calculator-config'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type {
  BuyerQuoteItem,
  CalculatorDraft,
  GuestArtworkUpload,
  QuoteRequestSummary,
  ServerCalculatorPreview,
} from '~/shared/types'

const STORAGE_KEY = 'printy_calculator'
const SESSION_KEY = 'printy_guest_session'
const PENDING_DRAFT_KEY = 'printy_pending_draft'

export type PreviewStatus = 'idle' | 'loading' | 'ready' | 'error'
export type ConfigStatus = 'idle' | 'loading' | 'ready' | 'error'

interface PendingDraft {
  id: number
  reference: string
}

export interface CalculatorArtworkRef {
  token: string
  filename: string
}

export interface PreviewState {
  preview: ServerCalculatorPreview | null
  previewStatus: PreviewStatus
  previewError: string
}

function draftBody(
  spec: CalculatorSpec,
  preview: ServerCalculatorPreview | null,
  config: CalculatorConfig | null,
  artwork?: CalculatorArtworkRef | null,
) {
  return {
    title: buildDraftTitle(spec, config),
    calculator_inputs_snapshot: spec,
    pricing_snapshot: buildClientSnapshot(spec, preview, config),
    ...(artwork?.token
      ? { artwork_token: artwork.token, artwork_filename: artwork.filename }
      : {}),
  }
}

/**
 * Public buy-side calculator store.
 *
 * Source of truth is the backend: products/sizes/papers/finishings come from
 * `GET /calculator/config/` and the price comes exclusively from
 * `POST /calculator/public-preview/` (median of matched production options).
 * No local pricing engine is consulted.
 */
export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    spec: null as CalculatorSpec | null,
    config: null as CalculatorConfig | null,
    configStatus: 'idle' as ConfigStatus,
    configError: '' as string,
    preview: null as ServerCalculatorPreview | null,
    previewStatus: 'idle' as PreviewStatus,
    previewError: '' as string,
  }),
  getters: {
    canPrice: (state): boolean => Boolean(state.preview?.can_calculate && state.preview.display_price_text),
    previewMedian: (state): number | null => {
      const median = state.preview?.market_range?.median
      if (median === null || median === undefined || median === '') {
        return null
      }
      const n = typeof median === 'number' ? median : Number(median)
      return Number.isFinite(n) ? n : null
    },
  },
  actions: {
    restore(): CalculatorSpec | null {
      if (!import.meta.client) {
        return this.spec
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as unknown
          if (isSpec(parsed)) {
            this.spec = parsed
          }
        }
      } catch {
        /* ignore malformed storage */
      }
      return this.spec
    },
    persist(spec: CalculatorSpec) {
      this.spec = spec
      if (import.meta.client) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(spec))
        } catch {
          /* storage unavailable — degrade gracefully */
        }
      }
    },
    setSpec(spec: CalculatorSpec) {
      this.persist(spec)
    },
    clear() {
      this.spec = null
      this.preview = null
      this.previewStatus = 'idle'
      this.previewError = ''
      if (import.meta.client) {
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* noop */
        }
      }
    },
    /**
     * Loads the calculator configuration (products, sizes, papers, finishings,
     * defaults) from the backend. The config is the single source of truth.
     */
    async loadConfig(force = false): Promise<void> {
      if (this.config && !force) {
        this.configStatus = 'ready'
        return
      }
      if (this.configStatus === 'loading') {
        return
      }
      this.configStatus = 'loading'
      this.configError = ''
      try {
        const { api } = useApi()
        const config = await api<CalculatorConfig>(API.calculator.config, { auth: false })
        this.config = config
        this.configStatus = 'ready'
      } catch (error) {
        this.configStatus = 'error'
        this.configError = 'We could not load the calculator configuration right now.'
        throw error
      }
    },
    /** Starts a fresh spec for a product using the backend's default values. */
    setProduct(productKey: string, previous?: CalculatorSpec | null): void {
      if (!this.config) {
        return
      }
      const product = this.config.products.find((p) => p.key === productKey) ?? null
      const next = makeDefaultSpec(product, this.config, previous)
      this.persist(next)
      this.preview = null
      this.previewStatus = 'idle'
      this.previewError = ''
    },
    /** Re-normalizes a restored/server snapshot against a product + config. */
    adoptSpec(raw: unknown, productKey: string, fallback?: CalculatorSpec | null): CalculatorSpec {
      const product = this.config ? this.config.products.find((p) => p.key === productKey) ?? null : null
      const next = normalizeSpec(raw, product, this.config, fallback)
      this.persist(next)
      return next
    },
    /**
     * Refreshes the server-verified estimate for the current spec. This is the
     * only price source — the median of matched production options.
     */
    async refreshPreview(spec?: CalculatorSpec): Promise<ServerCalculatorPreview | null> {
      const target = spec ?? this.spec
      const payload = buildPublicPreviewPayload(target)
      if (!payload) {
        this.preview = null
        this.previewStatus = 'idle'
        this.previewError = ''
        return null
      }
      this.previewStatus = 'loading'
      this.previewError = ''
      try {
        const { api } = useApi()
        const preview = await api<ServerCalculatorPreview>(API.calculator.publicPreview, {
          method: 'POST',
          auth: false,
          body: payload,
        })
        this.preview = preview
        this.previewStatus = 'ready'
        return preview
      } catch (error) {
        this.preview = null
        this.previewStatus = 'error'
        this.previewError = 'We could not reach the pricing network right now. Please try again.'
        throw error
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
     * Saves the visitor's spec as a server-side guest draft so it survives the
     * public calculator → sign-up journey and can be claimed on register.
     */
    async saveGuestDraft(spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null): Promise<CalculatorDraft> {
      const { api } = useApi()
      const draft = await api<CalculatorDraft>(API.quoteDrafts.guest, {
        method: 'POST',
        auth: false,
        body: {
          session_key: this.guestSessionKey(),
          ...draftBody(spec, preview, this.config, artwork),
        },
      })
      this.rememberDraft(draft)
      return draft
    },
    /**
     * Creates (or claims this browser's guest draft by session key) a server
     * draft for the authenticated buyer without sending it to shops yet, so the
     * buyer can choose a Print Manager through the intake flow.
     */
    async createDraft(spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null): Promise<CalculatorDraft> {
      const { api } = useApi()
      const draft = await api<CalculatorDraft>(API.quoteDrafts.list, {
        method: 'POST',
        body: {
          session_key: this.guestSessionKey(),
          ...draftBody(spec, preview, this.config, artwork),
        },
      })
      this.rememberDraft(draft)
      return draft
    },
    async createAndSendDraft(spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null) {
      const draft = await this.createDraft(spec, preview, artwork)
      const quoteRequests = await this.sendDraft(draft.id)
      return { draft, quoteRequests }
    },
    async sendDraft(draftId: number | string) {
      const { api } = useApi()
      return api<QuoteRequestSummary[]>(API.quoteDrafts.send(draftId), {
        method: 'POST',
        body: {},
      })
    },
    async fetchBuyerQuotes() {
      const { api } = useApi()
      return api<BuyerQuoteItem[]>(API.quoteDrafts.buyerQuotes, {
        method: 'GET',
      })
    },
    /**
     * Uploads artwork for a guest spec. The returned token is attached to the
     * draft/quote request so the print manager receives the production file.
     */
    async uploadGuestArtwork(file: File): Promise<GuestArtworkUpload> {
      const { api } = useApi()
      const form = new FormData()
      form.append('file', file)
      form.append('session_key', this.guestSessionKey())
      return api<GuestArtworkUpload>(API.calculator.artworkUpload, {
        method: 'POST',
        auth: false,
        body: form,
      })
    },
    async fetchGuestArtwork(token: string): Promise<GuestArtworkUpload> {
      const { api } = useApi()
      return api<GuestArtworkUpload>(API.calculator.artworkDetail(token), { auth: false })
    },
  },
})