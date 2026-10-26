import { describe, it, expect } from 'vitest'
import {
  calculatorPerUnitRange,
  calculatorUnitWord,
  formatPerUnitRange,
  formatTotalQuantityLabel,
} from '~/shared/calculator-units'

describe('calculator unit pricing display', () => {
  it('maps the public products to their own unit words', () => {
    expect(calculatorUnitWord('business_card')).toBe('card')
    expect(calculatorUnitWord('flyer')).toBe('flyer')
    expect(calculatorUnitWord('booklet')).toBe('brochure')
    expect(calculatorUnitWord('unknown')).toBe('unit')
  })

  it('turns the total range into a 2-decimal per-unit range', () => {
    const range = calculatorPerUnitRange(403, 434, 125)
    expect(range).not.toBeNull()
    expect(formatPerUnitRange(range!, 'card')).toBe('KSh 3.22 – KSh 3.47 per card')
  })

  it('does not show a per-unit headline for one item or sub-KSh-1 units', () => {
    expect(calculatorPerUnitRange(403, 434, 1)).toBeNull()
    expect(calculatorPerUnitRange(40, 60, 125)).toBeNull()
  })

  it('labels the total with the quantity and the correct plural unit', () => {
    expect(formatTotalQuantityLabel(125, 'card')).toBe('Total for 125 cards')
    expect(formatTotalQuantityLabel(1250, 'flyer')).toBe('Total for 1,250 flyers')
    expect(formatTotalQuantityLabel(1, 'brochure')).toBe('Total for 1 brochure')
  })

  it('formats a compact per-unit range for quantity chips', () => {
    const range = calculatorPerUnitRange(403, 434, 125)
    expect(formatPerUnitRange(range!, 'card', true)).toBe('KSh 3.22 – 3.47 / card')
  })
})
