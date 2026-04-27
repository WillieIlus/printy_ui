import { API } from '~/shared/api-paths'
import type { QuoteDraft, QuoteDraftFile } from '~/shared/types/buyer'
import type { QuoteRequest } from '~/shared/types/quoteRequest'
import { getQuoteDraftFile, listQuoteDraftFiles } from '~/services/quoteDraft'
import { normalizeQuoteRequestStatus, normalizeQuoteResponseStatus } from '~/utils/quoteStatus'

export interface QuoteResponseRecord {
  id: number
  quote_reference?: string
  quote_request: number
  shop: number
  status: string
  raw_status?: string
  status_label?: string
  total?: string | null
  note?: string
  turnaround_days?: number | null
  response_snapshot?: Record<string, unknown> | null
  revised_pricing_snapshot?: Record<string, unknown> | null
  created_at?: string
  sent_at?: string | null
  whatsapp_available?: boolean
  whatsapp_url?: string | null
  whatsapp_label?: string | null
}

export interface ShopHomeSummary {
  shop: { id: number; name: string; slug: string }
  new_quote_requests?: number
  received_quote_requests: number
  pending_responses_count?: number
  responded_requests_count?: number
  accepted_quotes_count?: number
  average_response_hours?: number | null
  stale_requests_count?: number
  status_counts: Record<string, number>
  recent_requests: ShopHomeRequestSummary[]
  recent_responses?: QuoteResponseRecord[]
}

export interface ShopHomeRequestSummary {
  id: number
  request_reference?: string | null
  shop?: number | null
  status: string
  raw_status?: string | null
  status_label?: string | null
  customer_name?: string | null
  customer_email?: string | null
  customer_phone?: string | null
  source_draft_reference?: string | null
  request_snapshot?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  latest_response?: {
    id: number
    quote_reference?: string | null
    status: string
    raw_status?: string | null
    status_label?: string | null
    total?: string | null
    created_at?: string
    sent_at?: string | null
  } | null
}

export interface ClientQuoteRequestSummary extends QuoteRequest {
  response_status: string
  latest_response: QuoteResponseRecord | null
}

export const useQuoteInboxStore = defineStore('quoteInbox', () => {
  const dashboard = ref<ShopHomeSummary | null>(null)
  const drafts = ref<QuoteDraft[]>([])
  const activeCalculatorDraft = ref<QuoteDraft | null>(null)
  const draftFiles = ref<QuoteDraftFile[]>([])
  const activeDraftFile = ref<QuoteDraftFile | null>(null)
  const clientRequests = ref<ClientQuoteRequestSummary[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      dashboard.value = await $api<ShopHomeSummary>(API.dashboardShopHome())
      loaded.value = true
      return dashboard.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dashboard.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDrafts() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      drafts.value = await $api<QuoteDraft[]>(API.calculatorDrafts())
      return drafts.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load drafts.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDraft(id: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      activeCalculatorDraft.value = await $api<QuoteDraft>(API.calculatorDraftDetail(id))
      return activeCalculatorDraft.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load draft.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchClientRequests() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const requests = await $api<QuoteRequest[] | { results?: QuoteRequest[] }>(API.quoteRequests())
      const requestList = Array.isArray(requests) ? requests : (requests.results ?? [])

      const requestWithResponses = await Promise.all(requestList.map(async (request) => {
        const responses = await $api<QuoteResponseRecord[] | { results?: QuoteResponseRecord[] }>(API.quoteRequestResponses(request.id))
        const responseList = Array.isArray(responses) ? responses : (responses.results ?? [])
        const latestResponse = [...responseList].sort((left, right) =>
          new Date(right.created_at ?? right.sent_at ?? 0).getTime() - new Date(left.created_at ?? left.sent_at ?? 0).getTime()
        )[0] ?? null

        return {
          ...request,
          status: normalizeQuoteRequestStatus(String(request.status ?? 'pending')),
          latest_response: latestResponse,
          response_status: normalizeQuoteResponseStatus(latestResponse?.status ?? 'draft'),
        }
      }))

      clientRequests.value = requestWithResponses
      loaded.value = true
      return clientRequests.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load requests.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftFiles(scope: 'draft' | 'dashboard' = 'dashboard') {
    loading.value = true
    error.value = null
    try {
      draftFiles.value = await listQuoteDraftFiles(undefined, scope)
      if (!activeDraftFile.value || !draftFiles.value.some((file) => file.id === activeDraftFile.value?.id)) {
        activeDraftFile.value = draftFiles.value[0] ?? null
      }
      return draftFiles.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quote files.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDraftFile(fileId: number, scope: 'draft' | 'dashboard' = 'dashboard') {
    loading.value = true
    error.value = null
    try {
      activeDraftFile.value = await getQuoteDraftFile(fileId, undefined, scope)
      return activeDraftFile.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quote file.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const quoteBuilderItemCount = computed(() =>
    draftFiles.value.reduce((total, file) => total + (file.item_count || 0), 0)
  )

  async function saveDraft(payload: Record<string, unknown>) {
    const { $api } = useNuxtApp()
    const draft = await $api<QuoteDraft>(API.calculatorDrafts(), {
      method: 'POST',
      body: payload,
    })
    await Promise.all([
      fetchDrafts(),
      fetchDraftFiles('dashboard'),
    ])
    return draft
  }

  async function updateDraft(id: number, payload: Record<string, unknown>) {
    const { $api } = useNuxtApp()
    const draft = await $api<QuoteDraft>(API.calculatorDraftDetail(id), {
      method: 'PATCH',
      body: payload,
    })
    activeCalculatorDraft.value = draft
    await fetchDrafts()
    return draft
  }

  async function sendDraft(id: number, shops: number[], requestDetailsSnapshot?: Record<string, unknown>) {
    const { $api } = useNuxtApp()
    const responses = await $api<QuoteRequest[]>(API.calculatorDraftSend(id), {
      method: 'POST',
      body: {
        shops,
        request_details_snapshot: requestDetailsSnapshot ?? {},
      },
    })
    await Promise.all([
      fetchDrafts(),
      fetchDraftFiles('dashboard'),
      fetchClientRequests(),
    ])
    return responses
  }

  return {
    dashboard,
    drafts,
    activeCalculatorDraft,
    draftFiles,
    activeDraftFile,
    clientRequests,
    loading,
    loaded,
    error,
    quoteBuilderItemCount,
    fetchDashboard,
    fetchDrafts,
    fetchDraft,
    fetchDraftFiles,
    fetchDraftFile,
    fetchClientRequests,
    saveDraft,
    updateDraft,
    sendDraft,
  }
})
