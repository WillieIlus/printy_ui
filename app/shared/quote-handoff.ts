import {
  BROKERS, DELIVERY_OPTS, DESIGN_OPTS, MATERIALS, PAPERS, PRODUCTS, RUSH_OPTS,
  getProduct, type CalcInput, type QuoteResult,
} from '~/shared/workflow/pricing'
import type { BuyerQuoteItem, ClientQuoteSnapshot } from '~/shared/types'

/**
 * Builds the client-safe pricing snapshot that is sent to the backend with a
 * calculator draft. It contains only indicative, buyer-visible figures — no
 * routing or internal fields (the backend rejects those).
 */
export function buildClientSnapshot(input: CalcInput, quote: QuoteResult): ClientQuoteSnapshot {
  const size = getProduct(input.productId).sizes.find((s) => s.id === input.sizeId)
  const finishedW = input.customW || size?.w || 0
  const finishedH = input.customH || size?.h || 0
  const paperName =
    getProduct(input.productId).category === 'large_format'
      ? (MATERIALS.find((m) => m.id === input.paperId)?.name ?? input.paperId)
      : (PAPERS.find((p) => p.id === input.paperId)?.name ?? input.paperId)
  const brokerName = BROKERS.find((b) => b.id === input.brokerId)?.name ?? input.brokerId

  return {
    currency: 'KES',
    total: quote.total,
    subtotal: quote.subtotal,
    vat: quote.vat,
    unit_price: quote.unitPrice,
    turnaround_days: quote.turnaroundDays,
    ready_by: quote.readyBy,
    product_name: quote.product.name,
    finished_size: finishedW && finishedH ? `${finishedW}×${finishedH}mm` : '',
    quantity: input.quantity,
    paper_name: paperName,
    color_mode: input.colorMode,
    sides: input.sides,
    broker_name: brokerName,
    design_option: DESIGN_OPTS.find((d) => d.id === input.designId)?.label ?? '',
    delivery_option: DELIVERY_OPTS.find((d) => d.id === input.deliveryId)?.label ?? '',
    rush_option: RUSH_OPTS.find((r) => r.id === input.rushId)?.label ?? '',
  }
}

/** Human-readable title for a saved draft, e.g. "Business cards · 1,000 pcs". */
export function buildDraftTitle(input: CalcInput): string {
  const product = PRODUCTS.find((p) => p.id === input.productId)
  return `${product?.name ?? 'Print job'} · ${input.quantity.toLocaleString()} pcs`
}

export interface BuyerQuoteDisplay {
  kind: 'draft' | 'quote_request'
  id: number
  reference: string
  title: string
  statusLabel: string
  total: number | null
  created: string
  updated: string
  raw: BuyerQuoteItem
}

export function formatQuoteDate(iso: string | undefined | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function summarizeBuyerItem(item: BuyerQuoteItem): BuyerQuoteDisplay {
  if (item.item_type === 'quote_request') {
    const qr = item.quote_request
    const snapshot = (qr.request_snapshot ?? {}) as Record<string, unknown>
    const title =
      (snapshot.title as string | undefined)
      ?? snapshot.product_name as string | undefined
      ?? qr.source_draft_reference
      ?? 'Quote request'
    return {
      kind: 'quote_request',
      id: qr.id,
      reference: qr.request_reference,
      title,
      statusLabel: qr.status_label,
      total: qr.latest_response?.total ?? null,
      created: formatQuoteDate(qr.created_at),
      updated: formatQuoteDate(qr.updated_at),
      raw: item,
    }
  }

  const draft = item.draft
  const snapshot = (draft.pricing_snapshot ?? {}) as Partial<ClientQuoteSnapshot>
  const rawQty = draft.calculator_inputs_snapshot.quantity
  const quantity = typeof rawQty === 'number' ? rawQty : undefined
  const productName = snapshot.product_name ?? draft.title ?? 'Draft'
  return {
    kind: 'draft',
    id: draft.id,
    reference: draft.draft_reference,
    title: quantity && quantity > 0 ? `${productName} · ${quantity.toLocaleString()} pcs` : productName,
    statusLabel: draft.status_label,
    total: typeof snapshot.total === 'number' ? snapshot.total : null,
    created: formatQuoteDate(draft.created_at),
    updated: formatQuoteDate(draft.updated_at),
    raw: item,
  }
}