import { describe, it, expect } from 'vitest'
import {
  formatSpeedRange,
  multiplySpeedRange,
  previewMarketRange,
  speedPriceOptions,
  standardPriceRange,
} from '~/shared/calculator-speed-pricing'
import { BUYER_SPEED_OPTIONS } from '~/constants/design/buyer-speed'
import type { ServerCalculatorPreview, ServerSpeedOption } from '~/shared/types'

const SPEED_OPTIONS: ServerSpeedOption[] = [
  { key: 'standard', label: 'Standard', multiplier: '1.00', total: '4500.00', turnaround_hours: 48 },
  { key: 'faster', label: 'Faster +50%', multiplier: '1.50', total: '6750.00', turnaround_hours: 24 },
  { key: 'fastest', label: 'Fastest +100%', multiplier: '2.00', total: '9000.00', turnaround_hours: 12 },
]

function makePreview(overrides: Partial<ServerCalculatorPreview> = {}): ServerCalculatorPreview {
  return {
    can_calculate: true,
    product_type: 'business_card',
    price_mode: 'market',
    matches_count: 1,
    display_price_text: 'KSh 4,000 – KSh 5,000',
    display_mode: 'range',
    confidence_label: 'high',
    source_label: 'Estimated market range',
    market_range: {
      min: '4000.00',
      max: '5000.00',
      median: '4500.00',
      currency: 'KES',
      label: 'KSh 4,000 – KSh 5,000',
      confidence: 'high',
    },
    speed_options: SPEED_OPTIONS,
    missing_fields: [],
    summary: null,
    warnings: [],
    suggestions: [],
    exact_or_estimated: true,
    ...overrides,
  }
}

describe('calculator speed pricing', () => {
  it('reads numeric ranges from server strings and preserves single values', () => {
    expect(previewMarketRange(makePreview())).toEqual({ min: 4000, max: 5000 })
    expect(previewMarketRange(makePreview({
      market_range: {
        min: '5000.00', max: '5000.00', median: '5000.00', currency: 'KES', label: '', confidence: 'high',
      },
    }))).toEqual({ min: 5000, max: 5000 })
  })

  it('treats a one-sided or reversed server range as a single, ordered value', () => {
    const base = makePreview().market_range!
    expect(previewMarketRange(makePreview({ market_range: { ...base, min: null, max: '5000.00' } })))
      .toEqual({ min: 5000, max: 5000 })
    expect(previewMarketRange(makePreview({ market_range: { ...base, min: '6000.00', max: '4000.00' } })))
      .toEqual({ min: 4000, max: 6000 })
  })

  it('rebases the visible range by the multiplier of the tier that was priced', () => {
    // Faster was priced, so the server range is already ×1.5. Dividing it out
    // recovers the standard range the summary is built from.
    const fasterPreview = makePreview({
      market_range: {
        min: '6000.00', max: '7500.00', median: '6750.00', currency: 'KES', label: '', confidence: 'high',
      },
    })
    expect(standardPriceRange(fasterPreview, 'faster')).toEqual({ min: 4000, max: 5000 })
    expect(speedPriceOptions(fasterPreview, 'faster').map((option) => option.text)).toEqual([
      'KSh 4,000 – KSh 5,000',
      'KSh 6,000 – KSh 7,500',
      'KSh 8,000 – KSh 10,000',
    ])
  })

  it('falls back to the standard tier when the priced tier is unknown', () => {
    expect(standardPriceRange(makePreview(), 'missing-tier')).toEqual({ min: 4000, max: 5000 })
  })

  it('multiplies both endpoints and keeps single values single', () => {
    expect(multiplySpeedRange({ min: 4000, max: 5000 }, 1.5)).toEqual({ min: 6000, max: 7500 })
    expect(multiplySpeedRange({ min: 5000, max: 5000 }, 2)).toEqual({ min: 10000, max: 10000 })
    expect(formatSpeedRange({ min: 5000, max: 5000 })).toBe('KSh 5,000')
    expect(formatSpeedRange({ min: 4000, max: 5000 })).toBe('KSh 4,000 – KSh 5,000')
  })

  it('prices a future server tier without any per-tier UI math', () => {
    const futureOptions: ServerSpeedOption[] = [
      ...SPEED_OPTIONS,
      { key: 'sprint', label: 'Sprint +200%', multiplier: '3.00', total: '13500.00', turnaround_hours: 6 },
    ]
    const options = speedPriceOptions(makePreview({ speed_options: futureOptions }), 'standard')
    expect(options).toHaveLength(4)
    expect(options[3]).toMatchObject({
      key: 'sprint',
      label: 'Sprint +200%',
      multiplier: 3,
      turnaroundHours: 6,
      text: 'KSh 12,000 – KSh 15,000',
    })
  })

  it('keeps the buyer speed labels available before the first preview', () => {
    const options = speedPriceOptions(null, 'standard')
    expect(options.map((option) => option.key)).toEqual(BUYER_SPEED_OPTIONS.map((option) => option.id))
    expect(options.every((option) => option.text === '')).toBe(true)
  })
})
