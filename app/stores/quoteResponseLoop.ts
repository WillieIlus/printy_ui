import { API } from '~/shared/api-paths'
import { normalizeApiError } from '~/utils/normalizeApiError'

export type QuoteConversationMessage = {
  id: number
  request_id: number
  response_id: number
  sender_name?: string
  sender_role: string
  recipient_user_id?: number | null
  recipient_shop_id?: number | null
  message_type: string
  subject?: string
  message: string
  proposed_price?: string | number | null
  proposed_turnaround?: string | null
  proposed_quantity?: number | null
  proposed_material?: string | null
  proposed_gsm?: string | null
  proposed_size?: string | null
  proposed_finishing?: unknown
  is_read?: boolean
  read_at?: string | null
  created_at: string
  updated_at?: string
}

export type QuoteResponseRecord = {
  id: number
  request_id?: number
  quote_request?: number
  shop?: number | null
  shop_name?: string
  shop_slug?: string
  shop_currency?: string
  status?: string | null
  raw_status?: string | null
  status_label?: string | null
  total?: string | number | null
  note?: string | null
  turnaround_days?: number | null
  turnaround_hours?: number | null
  estimated_ready_at?: string | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  response_snapshot?: Record<string, unknown> | null
  revised_pricing_snapshot?: Record<string, unknown> | null
  accepted_at?: string | null
  rejected_at?: string | null
  rejection_reason?: string | null
  rejection_message?: string | null
  latest_message?: string | null
  unread_count?: number
  created_at?: string
  updated_at?: string
  sent_at?: string | null
  conversation?: QuoteConversationMessage[]
}

export type QuoteRequestDetailRecord = Record<string, unknown> & {
  id: number
  status?: string | null
  responses?: QuoteResponseRecord[]
  sibling_responses?: QuoteResponseRecord[]
}

export type ShopRequestDetailRecord = Record<string, unknown> & {
  id: number
  response?: QuoteResponseRecord | null
  conversation?: QuoteConversationMessage[]
}

export type RejectQuotePayload = {
  reason: string
  message?: string
}

export type ClientReplyPayload = {
  message_type: string
  subject?: string
  message: string
  proposed_price?: number | string | null
  proposed_turnaround?: string
  proposed_quantity?: number | null
  proposed_material?: string
  proposed_gsm?: string
  proposed_size?: string
  proposed_finishing?: unknown
}

export type ShopReplyPayload = {
  subject?: string
  message: string
  proposed_price?: number | string | null
  proposed_turnaround?: string
  proposed_quantity?: number | null
  proposed_material?: string
  proposed_gsm?: string
  proposed_size?: string
  proposed_finishing?: unknown
}

export const useQuoteResponseLoopStore = defineStore('quoteResponseLoop', () => {
  const requestDetail = ref<QuoteRequestDetailRecord | null>(null)
  const shopRequestDetail = ref<ShopRequestDetailRecord | null>(null)
  const responses = ref<QuoteResponseRecord[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)

  async function fetchClientRequestDetail(id: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      requestDetail.value = await $api<QuoteRequestDetailRecord>(API.clientRequestDetail(id))
      return requestDetail.value
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not load request.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchClientResponses() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      responses.value = await $api<QuoteResponseRecord[]>(API.clientResponses())
      return responses.value
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not load responses.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchShopRequestDetail(id: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      shopRequestDetail.value = await $api<ShopRequestDetailRecord>(API.shopRequestDetail(id))
      return shopRequestDetail.value
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not load shop request.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function acceptQuoteResponse(responseId: number) {
    submitting.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      return await $api<Record<string, unknown>>(API.clientResponseAccept(responseId), {
        method: 'POST',
        body: {},
      })
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not accept quote.')
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function rejectQuoteResponse(responseId: number, payload: RejectQuotePayload) {
    submitting.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      return await $api<Record<string, unknown>>(API.clientResponseReject(responseId), {
        method: 'POST',
        body: payload,
      })
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not reject quote.')
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function replyToQuoteResponse(responseId: number, payload: ClientReplyPayload) {
    submitting.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      return await $api<QuoteConversationMessage>(API.clientResponseReply(responseId), {
        method: 'POST',
        body: payload,
      })
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not send reply.')
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function replyFromShop(responseId: number, payload: ShopReplyPayload) {
    submitting.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      return await $api<QuoteConversationMessage>(API.shopResponseReply(responseId), {
        method: 'POST',
        body: payload,
      })
    } catch (err) {
      error.value = normalizeApiError(err, 'Could not send shop reply.')
      throw err
    } finally {
      submitting.value = false
    }
  }

  function clear() {
    requestDetail.value = null
    shopRequestDetail.value = null
    responses.value = []
    error.value = null
  }

  return {
    requestDetail,
    shopRequestDetail,
    responses,
    loading,
    submitting,
    error,
    fetchClientRequestDetail,
    fetchClientResponses,
    fetchShopRequestDetail,
    acceptQuoteResponse,
    rejectQuoteResponse,
    replyToQuoteResponse,
    replyFromShop,
    clear,
  }
})
