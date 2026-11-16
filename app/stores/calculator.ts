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
import { useAuthStore } from '~/stores/auth'
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
const PENDING_MANAGER_KEY = 'printy_pending_manager'
const PENDING_INTAKE_KEY = 'printy_pending_intake'

export type PreviewStatus = 'idle' | 'loading' | 'ready' | 'error'
export type ConfigStatus = 'idle' | 'loading' | 'ready' | 'error'

interface PendingDraft {
  id: number
  reference: string
}

export interface PendingManagerSelection {
  /** Public manager UUID — the only identifier a signed-out buyer sees. */
  publicId: string
  name: string
  /** Present only when an authenticated surface resolved a numeric id. */
  id?: number
}

export interface PendingIntake {
  draftId: number
  managerPublicId: string
  managerName: string
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
    /** The exact spec the current preview was priced for, so speed cards can
     *  rebase onto the standard tier even while a newer spec is debouncing. */
    previewSpec: null as CalculatorSpec | null,
    previewStatus: 'idle' as PreviewStatus,
    previewError: '' as string,
    /** A saved draft the buyer reopened from "My quotes"; the next request
     *  updates and sends that draft instead of creating a second one. */
    editingDraftId: null as number | null,
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
      this.previewSpec = null
      this.previewStatus = 'idle'
      this.previewError = ''
      this.editingDraftId = null
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
      this.previewSpec = null
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
        this.previewSpec = null
        this.previewStatus = 'idle'
        this.previewError = ''
        return null
      }
      this.previewStatus = 'loading'
      this.previewError = ''
      try {
        const { api } = useApi()
        // Authenticate when a session exists: the same endpoint projects
        // production/markup detail for managers and printers, while buyers and
        // guests still receive the unchanged public shape. A visitor with no
        // restored session (including a stale token cookie) must opt out of
        // auth instead of failing the client-side "session expired" guard.
        const signedIn = useAuthStore().isAuthenticated
        const preview = await api<ServerCalculatorPreview>(API.calculator.publicPreview, {
          method: 'POST',
          ...(signedIn ? {} : { auth: false }),
          body: payload,
        })
        this.preview = preview
        this.previewSpec = target ? { ...target } : null
        this.previewStatus = 'ready'
        return preview
      } catch (error) {
        this.preview = null
        this.previewSpec = null
        this.previewStatus = 'error'
        this.previewError = 'We could not reach the pricing network right now. Please try again.'
        throw error
      }
    },
    /**
     * Fetches a preview for an alternate quantity without touching the live
     * preview. Used only for display-only quantity-ladder unit prices.
     */
    async previewFor(spec: CalculatorSpec): Promise<ServerCalculatorPreview | null> {
      const payload = buildPublicPreviewPayload(spec)
      if (!payload) {
        return null
      }
      const { api } = useApi()
      const signedIn = useAuthStore().isAuthenticated
      return api<ServerCalculatorPreview>(API.calculator.publicPreview, {
        method: 'POST',
        ...(signedIn ? {} : { auth: false }),
        body: payload,
      })
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
     * Remembers which Print Manager a signed-out visitor picked, so the choice
     * survives login/sign-up and can be applied once the guest draft is claimed
     * (law 4.10). Every storage access is guarded — a locked-down browser must
     * never break the calculator.
     */
    pendingManagerSelection(): PendingManagerSelection | null {
      if (!import.meta.client) {
        return null
      }
      try {
        const raw = window.localStorage.getItem(PENDING_MANAGER_KEY)
        if (!raw) {
          return null
        }
        const parsed = JSON.parse(raw) as { publicId?: unknown; id?: unknown; name?: unknown }
        const publicId = typeof parsed.publicId === 'string' ? parsed.publicId : ''
        const numericId = typeof parsed.id === 'number' ? parsed.id : undefined
        if (!publicId && numericId === undefined) {
          return null
        }
        return {
          publicId,
          id: numericId,
          name: typeof parsed.name === 'string' ? parsed.name : '',
        }
      } catch {
        return null
      }
    },
    rememberManagerSelection(selection: PendingManagerSelection) {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.setItem(PENDING_MANAGER_KEY, JSON.stringify(selection))
      } catch {
        /* noop */
      }
    },
    forgetPendingManagerSelection() {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.removeItem(PENDING_MANAGER_KEY)
      } catch {
        /* noop */
      }
    },
    pendingIntake(): PendingIntake | null {
      if (!import.meta.client) {
        return null
      }
      try {
        const raw = window.localStorage.getItem(PENDING_INTAKE_KEY)
        if (!raw) {
          return null
        }
        const parsed = JSON.parse(raw) as {
          draftId?: unknown
          managerPublicId?: unknown
          managerName?: unknown
        }
        if (typeof parsed.draftId !== 'number') {
          return null
        }
        return {
          draftId: parsed.draftId,
          managerPublicId:
            typeof parsed.managerPublicId === 'string' ? parsed.managerPublicId : '',
          managerName: typeof parsed.managerName === 'string' ? parsed.managerName : '',
        }
      } catch {
        return null
      }
    },
    rememberPendingIntake(intake: PendingIntake) {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.setItem(PENDING_INTAKE_KEY, JSON.stringify(intake))
      } catch {
        /* noop */
      }
    },
    forgetPendingIntake() {
      if (!import.meta.client) {
        return
      }
      try {
        window.localStorage.removeItem(PENDING_INTAKE_KEY)
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
    /** Updates a draft the buyer reopened, so sending never leaves a twin behind. */
    async updateDraft(draftId: number | string, spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null): Promise<CalculatorDraft> {
      const { api } = useApi()
      const draft = await api<CalculatorDraft>(API.quoteDrafts.detail(draftId), {
        method: 'PATCH',
        body: draftBody(spec, preview, this.config, artwork),
      })
      this.rememberDraft(draft)
      return draft
    },
    /**
     * The buyer CTA: save the spec and immediately submit the quote request to
     * a manager. A manager the buyer picked before signing up is honoured; the
     * rest are routed through Printy's own manager instead of waiting forever
     * in an unsent draft.
     */
    async requestQuote(spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null) {
      const draft = this.editingDraftId
        ? await this.updateDraft(this.editingDraftId, spec, preview, artwork)
        : await this.createDraft(spec, preview, artwork)
      this.editingDraftId = draft.id
      const pickedManager = this.pendingManagerSelection()
      const hasPickedManager = Boolean(pickedManager && (pickedManager.publicId || pickedManager.id))
      const quoteRequests = await this.sendDraft(
        draft.id,
        hasPickedManager && pickedManager
          ? {
              selectedManagerId: pickedManager.id ?? null,
              selectedManagerPublicId: pickedManager.publicId || null,
              managerSelectionMode: 'client_selected' as const,
            }
          : undefined,
      )
      this.editingDraftId = null
      this.forgetPendingDraft()
      this.forgetPendingIntake()
      if (hasPickedManager) {
        this.forgetPendingManagerSelection()
      }
      return { draft, quoteRequests }
    },
    async createAndSendDraft(spec: CalculatorSpec, preview: ServerCalculatorPreview | null, artwork?: CalculatorArtworkRef | null) {
      const draft = await this.createDraft(spec, preview, artwork)
      const quoteRequests = await this.sendDraft(draft.id)
      return { draft, quoteRequests }
    },
    async sendDraft(
      draftId: number | string,
      options?: {
        selectedManagerId?: number | null
        selectedManagerPublicId?: string | null
        managerSelectionMode?: 'client_selected' | 'printy_auto'
      },
    ) {
      const { api } = useApi()
      const body: Record<string, unknown> = {}
      const publicId = options?.selectedManagerPublicId?.trim()
      const numericId = options?.selectedManagerId ?? null
      if (publicId) {
        body.selected_manager_public_id = publicId
        body.manager_selection_mode = 'client_selected'
      } else if (numericId) {
        body.selected_manager_id = numericId
        body.manager_selection_mode = 'client_selected'
      } else {
        // Never send `client_selected` without an actual manager id/public id:
        // the API rejects that with "manager_id is required for
        // client_selected mode". A stale or cleared selection must fall back
        // to Printy's own routing instead of trapping the buyer.
        body.manager_selection_mode = 'printy_auto'
      }
      return api<QuoteRequestSummary[]>(API.quoteDrafts.send(draftId), {
        method: 'POST',
        body,
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