import { describe, it, expect } from 'vitest'

import { quoteNavTarget } from '~/shared/quote-target'

describe('quoteNavTarget', () => {
  it('routes an authenticated buyer to their quote tab', () => {
    expect(quoteNavTarget(true, 'buyer')).toBe('/app/buyer')
  })

  it('keeps other authenticated roles on the public calculator', () => {
    expect(quoteNavTarget(true, 'manager')).toBe('/')
    expect(quoteNavTarget(true, 'printer')).toBe('/')
    expect(quoteNavTarget(true, 'admin')).toBe('/')
  })

  it('keeps public (unauthenticated) users on the public calculator', () => {
    expect(quoteNavTarget(false, 'buyer')).toBe('/')
    expect(quoteNavTarget(false, 'manager')).toBe('/')
  })
})