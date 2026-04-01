/**
 * Shop incoming requests API.
 * List, get, send-quote, mark-viewed, decline.
 */
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import type { IncomingRequestDetail, IncomingRequestList } from '~/shared/types/incomingRequest'

/**
 * Sent quotes API — list, get, revise.
 * Shop's quotes sent to customers in response to incoming requests.
 */
import type { SentQuoteDetail, SentQuoteList } from '~/shared/types/sentQuote'

export interface SendQuotePayload {
  total?: number | string | null
  note?: string
  turnaround_days?: number | null
}

export interface RequestMessagePayload {
  body: string
}

export interface RejectRequestPayload {
  reason: string
}

export interface ReviseQuotePayload {
  total?: number | string | null
  note?: string
  turnaround_days?: number | null
}

export function useIncomingRequests(shopSlug: MaybeRefOrGetter<string>) {
  const api = useApi()
  const getSlug = () => (typeof shopSlug === 'function' ? shopSlug() : toValue(shopSlug))

  async function list(): Promise<IncomingRequestList[]> {
    const slug = getSlug()
    const data = await api<IncomingRequestList[] | { results: IncomingRequestList[] }>(
      API.incomingRequests(slug)
    )
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function get(requestId: number): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestDetail(getSlug(), requestId))
  }

  async function sendQuote(requestId: number, payload: SendQuotePayload): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestSendQuote(getSlug(), requestId), {
      method: 'POST',
      body: payload,
    })
  }

  async function acceptRequest(requestId: number): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestAccept(getSlug(), requestId), {
      method: 'POST',
      body: {},
    })
  }

  async function askQuestion(requestId: number, payload: RequestMessagePayload): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestAskQuestion(getSlug(), requestId), {
      method: 'POST',
      body: payload,
    })
  }

  async function rejectRequest(requestId: number, payload: RejectRequestPayload): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestReject(getSlug(), requestId), {
      method: 'POST',
      body: payload,
    })
  }

  async function markViewed(requestId: number): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestMarkViewed(getSlug(), requestId), {
      method: 'POST',
      body: {},
    })
  }

  async function decline(requestId: number, payload: RejectRequestPayload = { reason: '' }): Promise<IncomingRequestDetail> {
    return api<IncomingRequestDetail>(API.incomingRequestDecline(getSlug(), requestId), {
      method: 'POST',
      body: payload,
    })
  }

  return { list, get, sendQuote, acceptRequest, askQuestion, rejectRequest, markViewed, decline }
}

export function useSentQuotes() {
  const api = useApi()

  async function list(): Promise<SentQuoteList[]> {
    const data = await api<SentQuoteList[] | { results: SentQuoteList[] }>(API.sentQuotes())
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function get(id: number): Promise<SentQuoteDetail> {
    return api<SentQuoteDetail>(API.sentQuoteDetail(id))
  }

  async function revise(sentQuoteId: number, payload: ReviseQuotePayload): Promise<SentQuoteDetail> {
    return api<SentQuoteDetail>(API.sentQuoteDetail(sentQuoteId), {
      method: 'PATCH',
      body: payload,
    })
  }

  return { list, get, revise }
}
