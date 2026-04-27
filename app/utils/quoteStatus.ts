export type NormalizedQuoteDraftStatus = 'draft' | 'ready_to_send' | 'sent' | 'abandoned'
export type NormalizedQuoteRequestStatus = 'pending' | 'sent' | 'viewed' | 'needs_confirmation' | 'responded' | 'accepted' | 'rejected' | 'expired' | 'cancelled'
export type NormalizedQuoteResponseStatus = 'draft' | 'sent' | 'modified' | 'accepted' | 'rejected' | 'expired'

export function normalizeQuoteRequestStatus(status?: string | null): NormalizedQuoteRequestStatus {
  switch (status) {
    case 'sent':
    case 'viewed':
    case 'needs_confirmation':
    case 'responded':
    case 'accepted':
    case 'rejected':
    case 'expired':
    case 'cancelled':
    case 'pending':
      return status
    case 'submitted':
      return 'sent'
    case 'awaiting_client_reply':
      return 'needs_confirmation'
    case 'quoted':
      return 'responded'
    case 'closed':
      return 'accepted'
    default:
      return 'pending'
  }
}

export function normalizeQuoteResponseStatus(status?: string | null): NormalizedQuoteResponseStatus {
  switch (status) {
    case 'sent':
    case 'modified':
    case 'accepted':
    case 'rejected':
    case 'expired':
    case 'draft':
      return status
    case 'pending':
      return 'draft'
    case 'revised':
      return 'modified'
    case 'declined':
      return 'rejected'
    default:
      return 'draft'
  }
}

export function quoteRequestStatusLabel(status?: string | null): string {
  return {
    pending: 'Pending',
    sent: 'Sent',
    viewed: 'Viewed',
    needs_confirmation: 'Needs confirmation',
    responded: 'Responded',
    accepted: 'Accepted',
    rejected: 'Rejected',
    expired: 'Expired',
    cancelled: 'Cancelled',
  }[normalizeQuoteRequestStatus(status)] ?? 'Pending'
}

export function quoteResponseStatusLabel(status?: string | null): string {
  return {
    draft: 'Draft',
    sent: 'Sent',
    modified: 'Modified',
    accepted: 'Accepted',
    rejected: 'Rejected',
    expired: 'Expired',
  }[normalizeQuoteResponseStatus(status)] ?? 'Draft'
}
