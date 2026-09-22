import {
  configProductLabel,
  type CalculatorConfig,
} from '~/shared/calculator-config'
import { specPaperLabel, type CalculatorSpec } from '~/shared/calculator-spec'
import type { BuyerQuoteItem, ClientQuoteSnapshot, ServerCalculatorPreview } from '~/shared/types'

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Builds the client-safe pricing snapshot sent to the backend with a calculator
 * draft. It is derived exclusively from the server-verified preview (the median
 * of matched production options) and the spec — there is no local pricing math.
 * When the backend has not produced a price, the numeric fields are null so no
 * buyer-visible figure is ever fabricated.
 */
export function buildClientSnapshot(
  spec: CalculatorSpec,
  preview: ServerCalculatorPreview | null,
  config: CalculatorConfig | null,
): ClientQuoteSnapshot {
  const median = preview ? toNumber(preview.market_range?.median) : null
  const range = preview?.market_range
  const min = preview ? toNumber(range?.min) : null
  const max = preview ? toNumber(range?.max) : null
  const quantity = spec.quantity && spec.quantity > 0 ? spec.quantity : 1

  const finishedSize = spec.finished_size === 'custom'
    ? (spec.width_mm && spec.height_mm ? `${spec.width_mm}x${spec.height_mm}mm` : 'custom')
    : (spec.finished_size ?? '')

  return {
    currency: preview?.currency ?? range?.currency ?? 'KES',
    total: median,
    subtotal: median,
    vat: null,
    unit_price: median ? Math.round((median / quantity) * 100) / 100 : null,
    turnaround_days: null,
    ready_by: '',
    product_name: configProductLabel(config, spec.product_type),
    finished_size: finishedSize,
    quantity,
    paper_name: specPaperLabel(spec, config),
    color_mode: spec.color_mode ?? '',
    sides: spec.print_sides ?? '',
    broker_name: '',
    design_option: '',
    delivery_option: '',
    rush_option: '',
  }
}

/** Human-readable title for a saved draft, e.g. "Business cards · 100 pcs". */
export function buildDraftTitle(spec: CalculatorSpec, config: CalculatorConfig | null): string {
  const product = configProductLabel(config, spec.product_type)
  const quantity = typeof spec.quantity === 'number' && spec.quantity > 0 ? spec.quantity : 0
  return quantity > 0 ? `${product} · ${quantity.toLocaleString()} pcs` : product
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
  const rawQty = (draft.calculator_inputs_snapshot ?? {}).quantity
  const quantity = typeof rawQty === 'number' ? rawQty : snapshot.quantity
  const productName = snapshot.product_name ?? draft.title ?? 'Draft'
  return {
    kind: 'draft',
    id: draft.id,
    reference: draft.draft_reference,
    title: quantity && quantity > 0 ? `${productName} · ${quantity.toLocaleString()} pcs` : productName,
    statusLabel: draft.status_label,
    total: snapshot.total ?? null,
    created: formatQuoteDate(draft.created_at),
    updated: formatQuoteDate(draft.updated_at),
    raw: item,
  }
}