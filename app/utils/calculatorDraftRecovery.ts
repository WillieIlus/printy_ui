import type { QuoteDraft } from '~/shared/types/buyer'
import { humanFieldLabel } from '~/utils/fieldLabels'

type SnapshotRecord = Record<string, unknown>

function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export function getDraftSnapshot(draft: Pick<QuoteDraft, 'calculator_inputs_snapshot'> | { calculator_inputs_snapshot?: SnapshotRecord | null }): SnapshotRecord {
  return (draft.calculator_inputs_snapshot ?? {}) as SnapshotRecord
}

export function getDraftJobTypeLabel(draft: QuoteDraft | { calculator_inputs_snapshot?: SnapshotRecord | null }) {
  const snapshot = getDraftSnapshot(draft)
  const explicit = stringValue(snapshot.product_label) ?? stringValue(snapshot.product_name)
  if (explicit) return explicit
  const productType = stringValue(snapshot.product_type)
  return productType ? titleCase(productType) : 'Print job'
}

export function getDraftQuantityLabel(draft: QuoteDraft | { calculator_inputs_snapshot?: SnapshotRecord | null }) {
  const quantity = numberValue(getDraftSnapshot(draft).quantity)
  return quantity ? `${quantity.toLocaleString()} pcs` : 'Missing quantity'
}

export function getDraftSizeLabel(draft: QuoteDraft | { calculator_inputs_snapshot?: SnapshotRecord | null }) {
  const snapshot = getDraftSnapshot(draft)
  return (
    stringValue(snapshot.finished_size)
    ?? stringValue(snapshot.size_label)
    ?? stringValue(snapshot.custom_size_label)
    ?? 'Missing size'
  )
}

export function getDraftMissingFields(draft: QuoteDraft | { calculator_inputs_snapshot?: SnapshotRecord | null; pricing_snapshot?: SnapshotRecord | null }) {
  const pricingMissing = Array.isArray(draft.pricing_snapshot?.missing_fields)
    ? draft.pricing_snapshot?.missing_fields.filter((field): field is string => typeof field === 'string')
    : []

  if (pricingMissing.length) {
    return pricingMissing.map(field => humanFieldLabel(field, titleCase(field)))
  }

  const snapshot = getDraftSnapshot(draft)
  const missing: string[] = []

  if (!stringValue(snapshot.product_type)) missing.push('job type')
  if (!numberValue(snapshot.quantity)) missing.push('quantity')

  const productType = stringValue(snapshot.product_type)
  const hasBookletPages = Boolean(numberValue(snapshot.total_pages))
  const hasSize = Boolean(stringValue(snapshot.finished_size) || stringValue(snapshot.size_label))

  if (productType === 'booklet') {
    if (!hasBookletPages) missing.push('pages')
  } else if (!hasSize) {
    missing.push('size')
  }

  return missing
}
