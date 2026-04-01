/**
 * Customer quote requests API.
 * List, get, submit, accept, cancel.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import type { QuoteRequest, QuoteRequestListResponse } from '~/shared/types/quoteRequest'

export type QuoteRequestStatus =
  | 'draft'
  | 'submitted'
  | 'awaiting_shop_action'
  | 'awaiting_client_reply'
  | 'viewed'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'closed'
  | 'cancelled'

export interface QuoteRequestReplyPayload {
  body: string
}

export function useQuoteRequests() {
  const api = useApi()

  async function list(): Promise<QuoteRequest[]> {
    const data = await api<QuoteRequestListResponse>(API.quoteRequests())
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function get(id: number): Promise<QuoteRequest> {
    return api<QuoteRequest>(API.quoteRequestDetail(id))
  }

  async function submit(id: number): Promise<QuoteRequest> {
    return api<QuoteRequest>(API.quoteRequestSubmit(id), { method: 'POST', body: {} })
  }

  async function accept(id: number, sentQuoteId: number): Promise<QuoteRequest> {
    return api<QuoteRequest>(API.quoteRequestAccept(id), {
      method: 'POST',
      body: { sent_quote_id: sentQuoteId },
    })
  }

  async function reply(id: number, payload: QuoteRequestReplyPayload): Promise<QuoteRequest> {
    return api<QuoteRequest>(API.quoteRequestReply(id), {
      method: 'POST',
      body: payload,
    })
  }

  async function cancel(id: number): Promise<QuoteRequest> {
    return api<QuoteRequest>(API.quoteRequestCancel(id), { method: 'POST', body: {} })
  }

  return { list, get, submit, accept, reply, cancel }
}
