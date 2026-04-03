export type SizeMode = 'standard' | 'custom'
export type SizeInputUnit = 'mm' | 'cm' | 'in'

export interface SizePreset {
  label: string
  widthMm: number
  heightMm: number
}

export const sizePresets: SizePreset[] = [
  { label: 'Business Card', widthMm: 85, heightMm: 55 },
  { label: 'A6', widthMm: 105, heightMm: 148 },
  { label: 'A5', widthMm: 148, heightMm: 210 },
  { label: 'A4', widthMm: 210, heightMm: 297 },
  { label: 'A3', widthMm: 297, heightMm: 420 },
  { label: 'Letter', widthMm: 216, heightMm: 279 },
  { label: 'Legal', widthMm: 216, heightMm: 356 },
]

const unitFactors: Record<SizeInputUnit, number> = {
  mm: 1,
  cm: 10,
  in: 25.4,
}

function roundCanonicalMm(value: number) {
  return Math.max(1, Math.round(value))
}

function trimTrailingZeros(value: string) {
  return value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

export function getSizePreset(label: string | null | undefined) {
  if (!label) return null
  return sizePresets.find((preset) => preset.label.toLowerCase() === String(label).trim().toLowerCase()) ?? null
}

export function inferSizePresetLabel(widthMm: number | null | undefined, heightMm: number | null | undefined) {
  const width = typeof widthMm === 'number' ? roundCanonicalMm(widthMm) : null
  const height = typeof heightMm === 'number' ? roundCanonicalMm(heightMm) : null
  if (!width || !height) return null
  return sizePresets.find((preset) => preset.widthMm === width && preset.heightMm === height)?.label ?? null
}

export function convertInputToMm(value: string | number | null | undefined, unit: SizeInputUnit) {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value))
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return roundCanonicalMm(parsed * unitFactors[unit])
}

export function convertMmToDisplay(mm: number | null | undefined, unit: SizeInputUnit) {
  if (typeof mm !== 'number' || !Number.isFinite(mm) || mm <= 0) return ''
  const decimals = unit === 'mm' ? 0 : 3
  return trimTrailingZeros((mm / unitFactors[unit]).toFixed(decimals))
}

export function formatMmSize(widthMm: number | null | undefined, heightMm: number | null | undefined) {
  if (!widthMm || !heightMm) return ''
  return `${roundCanonicalMm(widthMm)} x ${roundCanonicalMm(heightMm)} mm`
}

export function formatSizeSummary(
  widthMm: number | null | undefined,
  heightMm: number | null | undefined,
  sizeLabel?: string | null,
) {
  const metric = formatMmSize(widthMm, heightMm)
  if (!metric) return ''
  return sizeLabel ? `${sizeLabel} · ${metric}` : metric
}
