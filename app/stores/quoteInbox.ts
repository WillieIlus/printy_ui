import { API } from '~/shared/api-paths'
import type { QuoteDraft } from '~/shared/types/buyer'
import type { QuoteRequest } from '~/shared/types/quoteRequest'

export interface QuoteResponseRecord {
  id: number
  quote_reference?: string
  quote_request: number
  shop: number
  status: 'pending' | 'modified' | 'accepted' | 'rejected' | string
  total?: string | null
  note?: string
  turnaround_days?: number | null
  response_snapshot?: Record<string, unknown> | null
  revised_pricing_snapshot?: Record<string, unknown> | null
  created_at?: string
  sent_at?: string | null
}

export interface ShopHomeSummary {
  shop: { id: number; name: string; slug: string }
  received_quote_requests: number
  status_counts: Record<string, number>
  recent_requests: ShopHomeRequestSummary[]
  recent_responses: QuoteResponseRecord[]
}

export interface ShopHomeRequestSummary {
  id: number
  request_reference?: string | null
  status: string
  customer_name?: string | null
  customer_email?: string | null
  customer_phone?: string | null
  source_draft_reference?: string | null
  created_at?: string
  updated_at?: string
  latest_response?: {
    id: number
    quote_reference?: string | null
    status: 'pending' | 'modified' | 'accepted' | 'rejected' | string
    total?: string | null
    created_at?: string
    sent_at?: string | null
  } | null
}

export interface ClientQuoteRequestSummary extends QuoteRequest {
  response_status: 'pending' | 'modified' | 'accepted' | 'rejected'
  latest_response: QuoteResponseRecord | null
}

export const useQuoteInboxStore = defineStore('quoteInbox', () => {
  const dashboard = ref<ShopHomeSummary | null>(null)
  const drafts = ref<QuoteDraft[]>([])
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
          latest_response: latestResponse,
          response_status: (latestResponse?.status ?? 'pending') as ClientQuoteRequestSummary['response_status'],
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

  async function saveDraft(payload: Record<string, unknown>) {
    const { $api } = useNuxtApp()
    const draft = await $api<QuoteDraft>(API.calculatorDrafts(), {
      method: 'POST',
      body: payload,
    })
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
      fetchClientRequests(),
    ])
    return responses
  }

  return {
    dashboard,
    drafts,
    clientRequests,
    loading,
    loaded,
    error,
    fetchDashboard,
    fetchDrafts,
    fetchClientRequests,
    saveDraft,
    sendDraft,
  }
})
