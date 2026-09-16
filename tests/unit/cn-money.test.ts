import { describe, it, expect } from 'vitest'

import { cn } from '~/utils/cn'
import { formatMoneyString, isPositiveMoneyString } from '~/utils/money'

describe('cn', () => {
  it('joins strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, null, undefined, 0, 'b')).toBe('a b')
  })

  it('flattens arrays', () => {
    expect(cn(['a', ['b', 'c']], 'd')).toBe('a b c d')
  })

  it('filters object keys by truthy values', () => {
    expect(cn({ on: true, off: false, alsoOn: 1 })).toBe('on alsoOn')
  })

  it('turns numbers into strings', () => {
    expect(cn(42)).toBe('42')
  })

  it('combines mixed values', () => {
    expect(cn('base', { active: true, hidden: false }, ['x', null, 'y'])).toBe('base active x y')
  })
})

describe('formatMoneyString', () => {
  it('formats a numeric string with KES', () => {
    expect(formatMoneyString('1000')).toBe('KES 1,000')
  })

  it('formats a number', () => {
    expect(formatMoneyString(2500.5)).toBe('KES 2,500.5')
  })

  it('falls back to a dash for empty values', () => {
    expect(formatMoneyString(null)).toBe('KES -')
    expect(formatMoneyString(undefined)).toBe('KES -')
    expect(formatMoneyString('')).toBe('KES -')
  })

  it('keeps the currency for non-numeric strings', () => {
    expect(formatMoneyString('Not a number')).toBe('KES Not a number')
  })

  it('uses the provided currency', () => {
    expect(formatMoneyString('500', 'USD')).toBe('USD 500')
  })
})

describe('isPositiveMoneyString', () => {
  it('is true for positive amounts', () => {
    expect(isPositiveMoneyString('100')).toBe(true)
    expect(isPositiveMoneyString(0.5)).toBe(true)
  })

  it('is false for zero, negative, and junk', () => {
    expect(isPositiveMoneyString('0')).toBe(false)
    expect(isPositiveMoneyString('-5')).toBe(false)
    expect(isPositiveMoneyString('abc')).toBe(false)
    expect(isPositiveMoneyString(null)).toBe(false)
  })
})