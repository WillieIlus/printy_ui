import { API } from '~/shared/api-paths'
import type { QuoteDraft } from '~/shared/types/buyer'

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
  recent_requests: QuoteDraft[]
  recent_responses: QuoteResponseRecord[]
}

export const useQuoteInboxStore = defineStore('quoteInbox', () => {
  const dashboard = ref<ShopHomeSummary | null>(null)
  const drafts = ref<QuoteDraft[]>([])
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
    const responses = await $api<QuoteDraft[]>(API.calculatorDraftSend(id), {
      method: 'POST',
      body: {
        shops,
        request_details_snapshot: requestDetailsSnapshot ?? {},
      },
    })
    await fetchDrafts()
    return responses
  }

  return {
    dashboard,
    drafts,
    loading,
    loaded,
    error,
    fetchDashboard,
    fetchDrafts,
    saveDraft,
    sendDraft,
  }
})
