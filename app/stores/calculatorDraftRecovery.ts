import type { QuoteDraft } from '~/shared/types/buyer'
import type { CalculatorPreviewResponse } from '~/types/api/calculator'
import { useAuthStore } from '~/stores/auth'
import type { useCalculatorStore } from '~/stores/calculator'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { getDraftSnapshot } from '~/utils/calculatorDraftRecovery'
import { getBrowserStorage } from '~/utils/browser-storage'

type CalculatorFormState = Record<string, string | number | boolean | null>
type DraftOrigin = 'guest' | 'server'

export type GuestCalculatorDraft = {
  title: string
  calculator_inputs_snapshot: Record<string, unknown>
  pricing_snapshot?: Record<string, unknown> | null
  custom_product_snapshot?: Record<string, unknown> | null
  request_details_snapshot?: Record<string, unknown> | null
  selected_product?: number | null
  updated_at: string
}

function buildTitle(form: Record<string, unknown>) {
  const productType = typeof form.product_type === 'string' ? form.product_type.replace(/_/g, ' ') : 'Print job'
  const quantity = typeof form.quantity === 'number' ? `${form.quantity.toLocaleString()} pcs` : null
  return quantity ? `${productType} - ${quantity}` : productType
}

export const useCalculatorDraftRecoveryStore = defineStore('calculatorDraftRecovery', () => {
  const activeServerDraftId = ref<number | null>(null)
  const guestDraft = ref<GuestCalculatorDraft | null>(null)
  const requestNotes = ref('')
  const selectedFileName = ref<string | null>(null)
  const artworkRefs = ref<Array<Record<string, unknown>>>([])
  const syncState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const lastError = ref<string | null>(null)
  const lastSavedAt = ref<string | null>(null)
  const resumePromptVisible = ref(false)

  function updateNotes(value: string) {
    requestNotes.value = value
  }

  function updateSelectedFileName(value: string | null) {
    selectedFileName.value = value
  }

  function setArtworkRefs(value: Array<Record<string, unknown>> = []) {
    artworkRefs.value = value
  }

  function buildCustomProductSnapshot() {
    return {
      custom_notes: requestNotes.value || null,
      artwork_refs: artworkRefs.value,
      artwork_file_name: selectedFileName.value,
    }
  }

  function buildRequestDetailsSnapshot() {
    return {
      notes: requestNotes.value || '',
      artwork_file_name: selectedFileName.value,
    }
  }

  function buildPayload(form: CalculatorFormState, preview: Record<string, unknown> | null, selectedProductId?: number | null) {
    return {
      title: buildTitle(form),
      selected_product: selectedProductId ?? null,
      calculator_inputs_snapshot: { ...form },
      pricing_snapshot: preview ?? null,
      custom_product_snapshot: buildCustomProductSnapshot(),
      request_details_snapshot: buildRequestDetailsSnapshot(),
    }
  }

  function hydrateFromDraft(draft: QuoteDraft, calculatorStore: ReturnType<typeof useCalculatorStore>) {
    const snapshot = getDraftSnapshot(draft)
    const productType = typeof snapshot.product_type === 'string' ? snapshot.product_type : null
    if (productType) {
      calculatorStore.selectProduct(productType)
    }
    calculatorStore.form = { ...(snapshot as CalculatorFormState) }
    if (productType) {
      calculatorStore.selectedProductType = productType
    }
    calculatorStore.preview = (draft.pricing_snapshot as CalculatorPreviewResponse | null) ?? null
    calculatorStore.previewLoaded = Boolean(draft.pricing_snapshot)
    calculatorStore.previewError = null
    requestNotes.value = typeof draft.custom_product_snapshot?.custom_notes === 'string'
      ? draft.custom_product_snapshot.custom_notes
      : typeof draft.request_details_snapshot?.notes === 'string'
        ? draft.request_details_snapshot.notes
        : ''
    selectedFileName.value = typeof draft.custom_product_snapshot?.artwork_file_name === 'string'
      ? draft.custom_product_snapshot.artwork_file_name
      : null
    artworkRefs.value = Array.isArray(draft.custom_product_snapshot?.artwork_refs)
      ? draft.custom_product_snapshot.artwork_refs.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      : []
    activeServerDraftId.value = draft.id
    lastSavedAt.value = draft.updated_at ?? null
    syncState.value = 'saved'
    resumePromptVisible.value = false
  }

  function resumeGuestDraft(calculatorStore: ReturnType<typeof useCalculatorStore>) {
    if (!guestDraft.value) return
    const draft = guestDraft.value
    const productType = String(draft.calculator_inputs_snapshot.product_type ?? calculatorStore.selectedProductType)
    calculatorStore.selectProduct(productType)
    calculatorStore.form = { ...(draft.calculator_inputs_snapshot as CalculatorFormState) }
    calculatorStore.selectedProductType = productType
    calculatorStore.preview = (draft.pricing_snapshot as CalculatorPreviewResponse | null) ?? null
    calculatorStore.previewLoaded = Boolean(draft.pricing_snapshot)
    requestNotes.value = typeof draft.custom_product_snapshot?.custom_notes === 'string' ? String(draft.custom_product_snapshot.custom_notes) : ''
    selectedFileName.value = typeof draft.custom_product_snapshot?.artwork_file_name === 'string' ? String(draft.custom_product_snapshot.artwork_file_name) : null
    artworkRefs.value = Array.isArray(draft.custom_product_snapshot?.artwork_refs)
      ? draft.custom_product_snapshot.artwork_refs.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      : []
    syncState.value = 'saved'
    lastSavedAt.value = draft.updated_at
    resumePromptVisible.value = false
  }

  async function maybeResumeFromRoute(calculatorStore: ReturnType<typeof useCalculatorStore>) {
    const route = useRoute()
    const router = useRouter()
    const rawResumeDraft = route.query.resumeDraft
    if (!rawResumeDraft) return

    if (rawResumeDraft === 'guest' && guestDraft.value) {
      resumeGuestDraft(calculatorStore)
    }

    if (rawResumeDraft !== 'guest') {
      const draftId = Number(rawResumeDraft)
      if (Number.isFinite(draftId) && draftId > 0) {
        const quoteInboxStore = useQuoteInboxStore()
        const draft = await quoteInboxStore.fetchDraft(draftId)
        hydrateFromDraft(draft, calculatorStore)
      }
    }

    const nextQuery = { ...route.query }
    delete nextQuery.resumeDraft
    await router.replace({ query: nextQuery })
  }

  async function autosave(options: {
    origin?: DraftOrigin
    form: CalculatorFormState
    preview: Record<string, unknown> | null
    isAuthenticated: boolean
    isClient: boolean
    selectedProductId?: number | null
  }) {
    const hasProductType = typeof options.form.product_type === 'string' && options.form.product_type.length > 0
    if (!hasProductType) return

    const payload = buildPayload(options.form, options.preview, options.selectedProductId)

    if (!options.isAuthenticated || !options.isClient) {
      guestDraft.value = {
        ...payload,
        updated_at: new Date().toISOString(),
      }
      lastSavedAt.value = guestDraft.value.updated_at
      syncState.value = 'saved'
      return
    }

    const quoteInboxStore = useQuoteInboxStore()
    syncState.value = 'saving'
    lastError.value = null

    try {
      const draft = activeServerDraftId.value
        ? await quoteInboxStore.updateDraft(activeServerDraftId.value, payload)
        : await quoteInboxStore.saveDraft(payload)
      activeServerDraftId.value = draft.id
      lastSavedAt.value = draft.updated_at ?? new Date().toISOString()
      syncState.value = 'saved'
    } catch (error) {
      syncState.value = 'error'
      lastError.value = error instanceof Error ? error.message : 'Failed to save draft.'
      throw error
    }
  }

  async function attachGuestDraftToAccount() {
    if (!guestDraft.value) return null
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.isClient) return null

    const quoteInboxStore = useQuoteInboxStore()
    const payload = {
      title: guestDraft.value.title,
      selected_product: guestDraft.value.selected_product ?? null,
      calculator_inputs_snapshot: guestDraft.value.calculator_inputs_snapshot,
      pricing_snapshot: guestDraft.value.pricing_snapshot ?? null,
      custom_product_snapshot: guestDraft.value.custom_product_snapshot ?? null,
      request_details_snapshot: guestDraft.value.request_details_snapshot ?? null,
    }

    const draft = activeServerDraftId.value
      ? await quoteInboxStore.updateDraft(activeServerDraftId.value, payload)
      : await quoteInboxStore.saveDraft(payload)

    activeServerDraftId.value = draft.id
    guestDraft.value = null
    lastSavedAt.value = draft.updated_at ?? new Date().toISOString()
    syncState.value = 'saved'
    resumePromptVisible.value = false
    return draft
  }

  function handleAuthenticatedUser() {
    if (guestDraft.value) {
      resumePromptVisible.value = true
    }
  }

  function dismissResumePrompt() {
    resumePromptVisible.value = false
  }

  function markSubmitted() {
    activeServerDraftId.value = null
    guestDraft.value = null
    syncState.value = 'idle'
    lastSavedAt.value = null
    resumePromptVisible.value = false
  }

  return {
    activeServerDraftId,
    guestDraft,
    requestNotes,
    selectedFileName,
    artworkRefs,
    syncState,
    lastError,
    lastSavedAt,
    resumePromptVisible,
    updateNotes,
    updateSelectedFileName,
    setArtworkRefs,
    maybeResumeFromRoute,
    autosave,
    attachGuestDraftToAccount,
    handleAuthenticatedUser,
    dismissResumePrompt,
    hydrateFromDraft,
    resumeGuestDraft,
    markSubmitted,
  }
}, {
  persist: {
    key: 'calculator-draft-recovery',
    storage: getBrowserStorage(),
    pick: ['activeServerDraftId', 'guestDraft', 'requestNotes', 'selectedFileName', 'artworkRefs', 'lastSavedAt'],
  },
})
