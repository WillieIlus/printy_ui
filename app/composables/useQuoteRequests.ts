/**
 * Customer quote requests API.
 * List, get, submit, accept, cancel.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { getApiBase } from '~/shared/runtime-url'
import { useAuthStore } from '~/stores/auth'
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

export interface QuoteRequestBriefPayload extends Record<string, unknown> {
  summary?: string
  whatsapp?: {
    available?: boolean
    label?: string
    url?: string
    message?: string
  }
}

export interface QuoteRequestWhatsappHandoff {
  available?: boolean
  label?: string
  reason?: string
  url?: string
  phone?: string
  message?: string
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

  async function getBrief(id: number): Promise<QuoteRequestBriefPayload> {
    return api<QuoteRequestBriefPayload>(API.quoteRequestBrief(id))
  }

  async function getWhatsappHandoff(id: number): Promise<QuoteRequestWhatsappHandoff> {
    return api<QuoteRequestWhatsappHandoff>(API.quoteRequestWhatsappHandoff(id))
  }

  function getDownloadPdfUrl(id: number): string {
    const config = useRuntimeConfig()
    return `${getApiBase(config.public)}${API.quoteRequestDownloadPdf(id)}`
  }

  async function downloadPdf(id: number): Promise<void> {
    const authStore = useAuthStore()
    const response = await fetch(getDownloadPdfUrl(id), {
      headers: authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {},
    })
    if (!response.ok) {
      throw new Error('Could not download the request PDF.')
    }
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `quote-request-${id}.pdf`
    link.click()
    URL.revokeObjectURL(objectUrl)
  }

  return { list, get, submit, accept, reply, cancel, getBrief, getWhatsappHandoff, getDownloadPdfUrl, downloadPdf }
}
