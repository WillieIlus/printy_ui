import type { Shop } from '~/shared/types'

type GenericRecord = Record<string, unknown>

export type QuoteDocumentLineItem = {
  description: string
  quantity: string
  unitPrice: string
  amount: string
  numericAmount: number
  isDiscount: boolean
}

export type QuoteDocumentModel = {
  quoteNumber: string
  quoteDate: string
  quoteStatus: string
  currency: string
  shopName: string
  shopLogo: string
  shopContact: string[]
  clientName: string
  clientContact: string[]
  jobDescription: string
  artworkSummary: string
  notes: string
  turnaround: string
  validity: string
  lineItems: QuoteDocumentLineItem[]
  subtotal: string
  discounts: string
  total: string
  footerNote: string
  productionPreview: Array<{ label: string, value: string }>
}

function asRecord(value: unknown): GenericRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as GenericRecord : {}
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function text(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value.trim() || fallback
  if (typeof value === 'number') return String(value)
  return fallback
}

function numeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function money(value: unknown, currency: string): string {
  const amount = numeric(value)
  if (amount == null) return '—'
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function dateLabel(value: unknown): string {
  const raw = text(value)
  if (!raw) return 'Not dated'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function lineDescription(entry: GenericRecord): string {
  return text(entry.description) || text(entry.label) || text(entry.name) || text(entry.title) || 'Quote line'
}

function lineQuantity(entry: GenericRecord): string {
  return text(entry.quantity) || text(entry.qty) || text(entry.count) || '—'
}

function lineUnitPrice(entry: GenericRecord, currency: string): string {
  const raw = entry.unit_price ?? entry.unitPrice ?? entry.rate ?? entry.price
  return money(raw, currency)
}

function lineAmount(entry: GenericRecord, currency: string): { label: string, amount: number } {
  const raw = entry.line_total ?? entry.amount ?? entry.total ?? entry.cost
  const parsed = numeric(raw) ?? 0
  return { label: money(parsed, currency), amount: parsed }
}

function buildLineItems(responseSnapshot: GenericRecord, responseRecord: GenericRecord, currency: string): QuoteDocumentLineItem[] {
  const rawLines = asList(responseSnapshot.pricing_preview_lines ?? responseSnapshot.lines)
  const lines = rawLines
    .map((entry) => asRecord(entry))
    .filter((entry) => Object.keys(entry).length)
    .map((entry) => {
      const description = lineDescription(entry)
      const { label, amount } = lineAmount(entry, currency)
      return {
        description,
        quantity: lineQuantity(entry),
        unitPrice: lineUnitPrice(entry, currency),
        amount: label,
        numericAmount: amount,
        isDiscount: /discount/i.test(description) || amount < 0,
      }
    })

  if (lines.length) return lines

  const total = numeric(responseRecord.total)
  return [{
    description: text(responseSnapshot.summary) || 'Quoted total',
    quantity: '1',
    unitPrice: money(total, currency),
    amount: money(total, currency),
    numericAmount: total ?? 0,
    isDiscount: false,
  }]
}

function buildProductionPreview(responseSnapshot: GenericRecord, requestRecord: GenericRecord): Array<{ label: string, value: string }> {
  const preview = asRecord(responseSnapshot.production_preview)
  const requestSnapshot = asRecord(requestRecord.request_snapshot)
  const calcInputs = asRecord(requestSnapshot.calculator_inputs)
  const fields = [
    { label: 'Pages', value: text(preview.normalized_pages) || text(calcInputs.total_pages) || '—' },
    { label: 'Size', value: text(preview.finished_size_label) || text(calcInputs.finished_size) || text(calcInputs.size_label) || '—' },
    { label: 'Sheets required', value: text(preview.sheets_required) || '—' },
    { label: 'Pieces per sheet', value: text(preview.pieces_per_sheet) || '—' },
    { label: 'Finishing', value: text(responseSnapshot.finishing_line) || text(calcInputs.lamination) || '—' },
  ]
  return fields
}

function jobDescription(requestRecord: GenericRecord, responseSnapshot: GenericRecord): string {
  const requestSnapshot = asRecord(requestRecord.request_snapshot)
  const calcInputs = asRecord(requestSnapshot.calculator_inputs)
  return (
    text(responseSnapshot.job_type)
    || text(calcInputs.product_type)?.replace(/_/g, ' ')
    || text(requestRecord.title)
    || 'Print quote'
  )
}

export function buildQuoteDocument(
  requestRecord: GenericRecord,
  responseRecord: GenericRecord,
  viewer: 'client' | 'shop',
  shopProfile?: Shop | null,
): QuoteDocumentModel {
  const responseSnapshot = asRecord(responseRecord.response_snapshot)
  const currency = text(responseSnapshot.currency) || text(shopProfile?.currency) || 'KES'
  const lineItems = buildLineItems(responseSnapshot, responseRecord, currency)
  const positiveLines = lineItems.filter(item => !item.isDiscount)
  const discountLines = lineItems.filter(item => item.isDiscount)
  const subtotalAmount = positiveLines.reduce((sum, item) => sum + item.numericAmount, 0)
  const discountAmount = discountLines.reduce((sum, item) => sum + item.numericAmount, 0)
  const totalAmount = numeric(responseRecord.total) ?? (subtotalAmount + discountAmount)
  const shopName = text(responseSnapshot.shop_name) || text(requestRecord.shop_name) || text(shopProfile?.name) || 'Print shop'
  const shopContact = [
    text(shopProfile?.public_email),
    text(shopProfile?.public_whatsapp_number),
    text(shopProfile?.phone_number),
  ].filter(Boolean)
  const clientContact = viewer === 'shop'
    ? [text(requestRecord.customer_email), text(requestRecord.customer_phone)].filter(Boolean)
    : [text(requestRecord.customer_email), text(requestRecord.customer_phone)].filter(Boolean)

  return {
    quoteNumber: text(responseRecord.quote_reference) || `Quote #${text(responseRecord.id)}`,
    quoteDate: dateLabel(responseRecord.sent_at ?? responseRecord.created_at),
    quoteStatus: text(responseRecord.status_label) || text(responseRecord.status) || 'Pending',
    currency,
    shopName,
    shopLogo: text(shopProfile?.logo),
    shopContact,
    clientName: text(requestRecord.customer_name) || 'Client',
    clientContact,
    jobDescription: jobDescription(requestRecord, responseSnapshot),
    artworkSummary: text(responseSnapshot.artwork_line) || text(requestRecord.artwork_summary) || 'Artwork references available in the request.',
    notes: text(responseRecord.note) || text(responseSnapshot.shop_note) || text(requestRecord.notes) || 'No extra notes',
    turnaround: text(responseSnapshot.turnaround_label) || text(responseRecord.turnaround_label) || (numeric(responseRecord.turnaround_days) != null ? `${responseRecord.turnaround_days} day turnaround` : 'To be confirmed'),
    validity: text(responseSnapshot.valid_until) || text(responseSnapshot.expiry) || 'Not specified',
    lineItems,
    subtotal: money(subtotalAmount, currency),
    discounts: discountLines.length ? money(discountAmount, currency) : '—',
    total: money(totalAmount, currency),
    footerNote: 'Generated by Printy',
    productionPreview: buildProductionPreview(responseSnapshot, requestRecord),
  }
}
