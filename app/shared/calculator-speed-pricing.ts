/**
 * Shared speed pricing presentation.
 *
 * The server remains the only pricing authority. A preview returns a market
 * range for the tier the request was priced for, every tier's multiplier, and
 * an authoritative `total` for every tier. When a server total exists it is
 * displayed verbatim, so a speed card can never drift from the quote. The
 * rebased market range is only a fallback for previews without totals.
 *
 * Labels and multipliers always come from the server: either the preview's
 * `speed_options`, or — before the first preview arrives — the calculator
 * config's `speed_tiers`. There is no local speed table to drift out of sync.
 */

import type { CalculatorSpeedTierConfig } from '~/shared/calculator-config'
import type { ServerCalculatorPreview, ServerSpeedOption } from '~/shared/types'
import { formatKSh } from '~/utils/money'

export interface SpeedPriceRange {
  min: number
  max: number
}

export interface SpeedPriceOption {
  key: string
  label: string
  multiplier: number
  turnaroundHours: number | null
  range: SpeedPriceRange | null
  text: string
}

interface RawSpeedOption {
  key: string
  label: string
  multiplier: number
  total: number | null
  turnaroundHours: number | null
}

function finiteNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const numeric = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function positiveMultiplier(value: string | number | null | undefined): number | null {
  const numeric = finiteNumber(value)
  return numeric !== null && numeric > 0 ? numeric : null
}

/** The numeric market range in a preview, regardless of which tier it priced. */
export function previewMarketRange(preview: ServerCalculatorPreview | null | undefined): SpeedPriceRange | null {
  const range = preview?.market_range
  if (!range) {
    return null
  }
  const min = finiteNumber(range.min)
  const max = finiteNumber(range.max)
  if (min === null && max === null) {
    return null
  }
  // A one-sided server range is still a single price, not a partial range.
  const low = min ?? max!
  const high = max ?? min!
  return high >= low ? { min: low, max: high } : { min: high, max: low }
}

function serverSpeedOptions(
  preview: ServerCalculatorPreview | null | undefined,
  fallbackTiers: CalculatorSpeedTierConfig[] = [],
): RawSpeedOption[] {
  // Once a preview exists, its list is authoritative. An empty list means the
  // server could not price any tier for this spec, so no speed cards are shown —
  // never a locally invented price.
  if (preview) {
    const options = preview.speed_options
    if (!Array.isArray(options) || options.length === 0) {
      return []
    }
    return options
      .filter((option): option is ServerSpeedOption => Boolean(option?.key && option?.label))
      .map((option) => ({
        key: option.key,
        label: option.label,
        multiplier: positiveMultiplier(option.multiplier) ?? 1,
        total: finiteNumber(option.total),
        turnaroundHours: finiteNumber(option.turnaround_hours),
      }))
  }
  return fallbackTiers
    .filter((option) => Boolean(option?.key && option?.label))
    .map((option) => ({
      key: option.key,
      label: option.label,
      multiplier: positiveMultiplier(option.multiplier) ?? 1,
      total: null,
      turnaroundHours: finiteNumber(option.turnaround_hours),
    }))
}

/**
 * The canonical standard range. `pricedSpeed` is the tier the server preview
 * was actually priced for, so a stale preview during a debounce still yields
 * the same base range and the cards never double-apply a multiplier.
 */
export function standardPriceRange(
  preview: ServerCalculatorPreview | null | undefined,
  pricedSpeed: string | null | undefined,
): SpeedPriceRange | null {
  const range = previewMarketRange(preview)
  if (!range) {
    return null
  }
  const options = serverSpeedOptions(preview)
  const priced = options.find((option) => option.key === pricedSpeed)
    ?? options.find((option) => option.key === 'standard')
  const divisor = priced?.multiplier ?? 1
  if (!Number.isFinite(divisor) || divisor <= 0) {
    return range
  }
  return {
    min: Math.round(range.min / divisor),
    max: Math.round(range.max / divisor),
  }
}

export function multiplySpeedRange(range: SpeedPriceRange, multiplier: number): SpeedPriceRange {
  const safe = Number.isFinite(multiplier) && multiplier > 0 ? multiplier : 1
  return {
    min: Math.round(range.min * safe),
    max: Math.round(range.max * safe),
  }
}

/** Same range-vs-single and currency formatting as the main summary card. */
export function formatSpeedRange(range: SpeedPriceRange | null | undefined): string {
  if (!range) {
    return ''
  }
  if (range.max > range.min) {
    return `${formatKSh(range.min)} – ${formatKSh(range.max)}`
  }
  return formatKSh(range.max)
}

export function speedPriceOptions(
  preview: ServerCalculatorPreview | null | undefined,
  pricedSpeed: string | null | undefined,
  fallbackTiers: CalculatorSpeedTierConfig[] = [],
): SpeedPriceOption[] {
  const base = standardPriceRange(preview, pricedSpeed)
  return serverSpeedOptions(preview, fallbackTiers).map((option) => {
    // The server's own per-tier total is authoritative: display it verbatim.
    // Only previews without totals fall back to the rebased market range.
    const range = option.total !== null
      ? { min: option.total, max: option.total }
      : base
        ? multiplySpeedRange(base, option.multiplier)
        : null
    return {
      key: option.key,
      label: option.label,
      multiplier: option.multiplier,
      turnaroundHours: option.turnaroundHours,
      range,
      text: formatSpeedRange(range),
    }
  })
}
