import type { QuoteRequest } from '~/shared/types/quoteRequest'

export interface QuoteRequestSendSummary {
  shopCount: number
  requestIds: number[]
}

export function buildQuoteRequestSendSummary(requests: QuoteRequest[]): QuoteRequestSendSummary {
  return {
    shopCount: requests.length,
    requestIds: requests.map(request => request.id),
  }
}

export function getQuoteRequestSendLabel(summary: QuoteRequestSendSummary | null, isSending = false) {
  if (isSending) return 'Sending request...'
  if (!summary) return ''
  return summary.shopCount === 1 ? 'Sent to 1 shop' : `Sent to ${summary.shopCount} shops`
}

export function getQuoteRequestSendFeedback(summary: QuoteRequestSendSummary | null) {
  if (!summary) return ''
  return summary.shopCount === 1
    ? 'Sent successfully. The selected shop now has this request in incoming requests, and you can track it in Requests & Quotes.'
    : `Sent successfully to ${summary.shopCount} shops. Each selected shop now has this request in incoming requests, and you can track replies in Requests & Quotes.`
}

export function getQuoteRequestSendToast(summary: QuoteRequestSendSummary | null) {
  if (!summary) {
    return {
      title: 'Request sent',
      description: 'You can track the outcome in Requests & Quotes.',
    }
  }

  return {
    title: summary.shopCount === 1 ? 'Request sent to 1 shop' : `Request sent to ${summary.shopCount} shops`,
    description: 'You can track the outcome in Requests & Quotes.',
  }
}
