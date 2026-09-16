export type PartnerQuoteBucketKey = 'draft' | 'waiting-client' | 'dispatch' | 'production' | 'closed' | 'other'

export interface PartnerQuoteBucketDefinition {
  key: PartnerQuoteBucketKey
  title: string
  subtitle: string
  emptyText: string
}

export const partnerQuoteBucketDefinitions: PartnerQuoteBucketDefinition[] = [
  {
    key: 'draft',
    title: 'Drafts and new requests',
    subtitle: 'Prepare pricing and send the client-facing quote.',
    emptyText: 'No quote drafts or new requests need pricing.',
  },
  {
    key: 'waiting-client',
    title: 'Waiting on client',
    subtitle: 'Quotes already sent; follow up or review the client response.',
    emptyText: 'No sent quotes are waiting on the client.',
  },
  {
    key: 'dispatch',
    title: 'Approved or paid',
    subtitle: 'Accepted or paid work that may need dispatch.',
    emptyText: 'No approved or paid quotes need dispatch.',
  },
  {
    key: 'production',
    title: 'In production or complete',
    subtitle: 'Work already dispatched or closed.',
    emptyText: 'No dispatched or completed quotes in this view.',
  },
  {
    key: 'closed',
    title: 'Closed requests',
    subtitle: 'Cancelled, rejected, or expired requests kept visible for audit.',
    emptyText: 'No closed requests.',
  },
  {
    key: 'other',
    title: 'Other quotes',
    subtitle: 'Quotes that do not match the primary workflow states.',
    emptyText: 'No other quotes.',
  },
]

function normalize(value: unknown) {
  return String(value || '').toLowerCase()
}

export function hasPartnerQuoteResponse(row: Record<string, any> | null | undefined) {
  return Boolean(row?.latest_response?.id)
}

function firstPricingValue(...values: Array<unknown>) {
  return values.find(value => {
    if (value === null || value === undefined || value === '') return false
    const amount = Number(value)
    return Number.isFinite(amount) && amount > 0
  }) as number | string | null | undefined
}

export function partnerQuoteQueuePricing(row: Record<string, any>) {
  const responsePricing = row.latest_response?.response_snapshot?.customer_pricing || {}
  const managedJobPricing = row.managed_job?.pricing || {}
  return {
    clientTotal: firstPricingValue(
      row.client_total,
      row.managed_job?.client_total,
      managedJobPricing.client_total,
      responsePricing.client_total,
      responsePricing.final_client_price,
      responsePricing.estimated_total,
      row.latest_response?.total,
    ),
    managerMargin: firstPricingValue(
      row.manager_payout,
      row.broker_payout,
      row.manager_margin,
      row.gross_margin,
      managedJobPricing.broker_payout,
      responsePricing.manager_payout,
      responsePricing.broker_payout,
      responsePricing.broker_margin_amount,
      responsePricing.gross_margin,
    ),
  }
}
export function derivePartnerQuoteStatus(detail: Record<string, any> | null | undefined, listRow: Record<string, any>) {
  const job = detail?.managed_job || listRow?.managed_job || null
  const paymentStatus = normalize(job?.payment_status)
  const assignmentStatus = normalize(job?.assignment_status)
  const jobStatus = normalize(job?.status)
  if (['completed', 'delivered'].includes(jobStatus)) return 'complete'
  if (jobStatus === 'ready') return 'ready'
  if (jobStatus === 'finishing') return 'finishing'
  if (['in_production', 'printing'].includes(jobStatus)) return 'in_production'
  if (job?.dispatched_at || ['assignment_pending', 'assigned', 'accepted'].includes(assignmentStatus)) return 'dispatched'
  if (['confirmed', 'release_ready', 'paid'].includes(paymentStatus)) return 'paid'
  if (job?.id) return 'accepted'
  if (!hasPartnerQuoteResponse(detail || listRow)) {
    const rawStatus = normalize(listRow.raw_status)
    const status = normalize(listRow.status)
    if (['cancelled', 'rejected', 'expired'].includes(rawStatus) || ['cancelled', 'rejected', 'expired'].includes(status)) {
      return rawStatus || status
    }
    return rawStatus === 'draft' || status === 'draft' ? 'draft' : 'new'
  }
  return normalize(listRow.status || listRow.raw_status || 'draft')
}

export function partnerQuoteBucketKey(row: Record<string, any>): PartnerQuoteBucketKey {
  const status = normalize(row.status)
  const rawStatus = normalize(row.raw_status)
  const responseStatus = normalize(row.latest_response?.status)
  const closedStatuses = ['cancelled', 'rejected', 'expired']

  if (closedStatuses.includes(status) || closedStatuses.includes(rawStatus)) return 'closed'
  if (['dispatched', 'in_production', 'printing', 'finishing', 'ready', 'complete', 'completed', 'delivered'].includes(status)) return 'production'
  if (['accepted', 'paid', 'closed'].includes(status) || rawStatus === 'closed') return 'dispatch'
  if (
    ['sent', 'responded', 'quoted', 'needs_confirmation', 'awaiting_client_reply'].includes(status)
    || ['quoted', 'awaiting_client_reply'].includes(rawStatus)
    || ['sent', 'modified', 'accepted'].includes(responseStatus)
  ) {
    return 'waiting-client'
  }
  if (['new', 'draft', 'submitted', 'pending', 'viewed', 'awaiting_response'].includes(status) || ['draft', 'submitted', 'viewed', 'awaiting_shop_action'].includes(rawStatus)) {
    return 'draft'
  }
  return 'other'
}
