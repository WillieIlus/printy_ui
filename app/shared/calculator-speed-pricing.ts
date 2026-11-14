/**
 * Shared speed pricing presentation.
 *
 * The server remains the only pricing authority. A preview returns a market
 * range for the tier the request was priced for, plus every tier's multiplier.
 * The main summary shows that server range; this module rebases it onto the
 * standard tier by removing the priced tier's multiplier, then applies each
 * tier's multiplier to BOTH endpoints. That keeps every speed card on exactly
 * the same base range as the summary while never inventing a second formula.
 *
 * New tiers only need to appear in the server's `speed_options` (or in
 * `BUYER_SPEED_OPTIONS` before the first preview); no per-tier UI math changes.
 */

import { BUYER_SPEED_OPTIONS } from '~/constants/design/buyer-speed'
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

function serverSpeedOptions(preview: ServerCalculatorPreview | null | undefined): RawSpeedOption[] {
  const options = preview?.speed_options
  if (!Array.isArray(options) || options.length === 0) {
    return BUYER_SPEED_OPTIONS.map((option) => ({
      key: option.id,
      label: option.label,
      multiplier: option.multiplier,
      turnaroundHours: null,
    }))
  }
  return options
    .filter((option): option is ServerSpeedOption => Boolean(option?.key && option?.label))
    .map((option) => ({
      key: option.key,
      label: option.label,
      multiplier: positiveMultiplier(option.multiplier) ?? 1,
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
): SpeedPriceOption[] {
  const base = standardPriceRange(preview, pricedSpeed)
  return serverSpeedOptions(preview).map((option) => {
    const range = base ? multiplySpeedRange(base, option.multiplier) : null
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
