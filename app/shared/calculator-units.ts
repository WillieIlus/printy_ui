const UNIT_WORDS: Record<string, string> = {
  business_card: 'card',
  flyer: 'flyer',
  booklet: 'brochure',
  label_sticker: 'sticker',
  letterhead: 'sheet',
  large_format: 'print',
}

export interface PerUnitRange {
  min: number
  max: number
}

export function calculatorUnitWord(productType: string | null | undefined): string {
  return UNIT_WORDS[String(productType ?? '')] ?? 'unit'
}

export function pluraliseUnit(unit: string, quantity: number): string {
  return Math.abs(quantity) === 1 ? unit : `${unit}s`
}

export function formatPerUnitValue(value: number): string {
  return value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function calculatorPerUnitRange(
  min: number | null | undefined,
  max: number | null | undefined,
  quantity: number,
): PerUnitRange | null {
  if (!Number.isFinite(quantity) || quantity <= 1) {
    return null
  }
  const lo = typeof min === 'number' && Number.isFinite(min) ? min / quantity : null
  const hi = typeof max === 'number' && Number.isFinite(max) ? max / quantity : null
  const lowest = lo ?? hi
  if (lowest === null || lowest < 1) {
    return null
  }
  return { min: lo ?? hi!, max: hi ?? lo! }
}

export function formatPerUnitRange(range: PerUnitRange, unit: string, compact = false): string {
  const lo = formatPerUnitValue(range.min)
  const hi = formatPerUnitValue(range.max)
  if (compact) {
    return range.max > range.min ? `KSh ${lo} – ${hi} / ${unit}` : `KSh ${lo} / ${unit}`
  }
  return range.max > range.min ? `KSh ${lo} – KSh ${hi} per ${unit}` : `KSh ${lo} per ${unit}`
}

export function formatTotalQuantityLabel(quantity: number, unit: string): string {
  const safe = Number.isFinite(quantity) ? Math.max(0, Math.round(quantity)) : 0
  return `Total for ${safe.toLocaleString('en-KE')} ${pluraliseUnit(unit, safe)}`
}
