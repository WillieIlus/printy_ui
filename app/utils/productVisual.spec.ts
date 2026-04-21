import { describe, it, expect } from 'vitest'
import { productVisual, resolveProductImageUrl } from './productVisual'

describe('productVisual', () => {
  it('returns booklet icon for BOOKLET product_kind', () => {
    const v = productVisual({ name: 'Church Programme', product_kind: 'BOOKLET' })
    expect(v.icon).toBe('i-lucide-book-open')
  })

  it('returns booklet icon when name contains "brochure"', () => {
    const v = productVisual({ name: 'Tri-fold Brochure' })
    expect(v.icon).toBe('i-lucide-book-open')
  })

  it('returns credit-card icon for business cards', () => {
    const v = productVisual({ name: 'Business Card', slug: 'business-card' })
    expect(v.icon).toBe('i-lucide-credit-card')
  })

  it('returns file-text icon for flyers', () => {
    const v = productVisual({ name: 'A5 Flyer' })
    expect(v.icon).toBe('i-lucide-file-text')
  })

  it('returns file-text icon for leaflets', () => {
    const v = productVisual({ name: 'Leaflet Pack' })
    expect(v.icon).toBe('i-lucide-file-text')
  })

  it('returns sticker icon for stickers', () => {
    const v = productVisual({ name: 'Die-cut Sticker' })
    expect(v.icon).toBe('i-lucide-sticker')
  })

  it('returns sticker icon for labels', () => {
    const v = productVisual({ name: 'Product Label' })
    expect(v.icon).toBe('i-lucide-sticker')
  })

  it('returns banner icon for LARGE_FORMAT pricing_mode', () => {
    const v = productVisual({ name: 'Roll-up Stand', pricing_mode: 'LARGE_FORMAT' })
    expect(v.icon).toBe('i-lucide-panel-top')
  })

  it('returns banner icon when name contains "banner"', () => {
    const v = productVisual({ name: 'Vinyl Banner' })
    expect(v.icon).toBe('i-lucide-panel-top')
  })

  it('returns receipt icon for receipts', () => {
    const v = productVisual({ name: 'Carbon Receipt Book' })
    expect(v.icon).toBe('i-lucide-receipt')
  })

  it('returns image icon for posters', () => {
    const v = productVisual({ name: 'A3 Poster' })
    expect(v.icon).toBe('i-lucide-image')
  })

  it('returns default package icon for unrecognised products', () => {
    const v = productVisual({ name: 'Custom Print Job' })
    expect(v.icon).toBe('i-lucide-package')
  })

  it('matches on category field too', () => {
    const v = productVisual({ name: 'Matte Card', category: 'Business Cards' })
    expect(v.icon).toBe('i-lucide-credit-card')
  })

  it('BOOKLET kind wins over business keyword', () => {
    const v = productVisual({ name: 'Business Booklet', product_kind: 'BOOKLET' })
    expect(v.icon).toBe('i-lucide-book-open')
  })
})

describe('resolveProductImageUrl', () => {
  const mockGetMediaUrl = (p: string | null) => (p ? `/media/${p}` : null)

  it('returns null for null path', () => {
    expect(resolveProductImageUrl(null, mockGetMediaUrl)).toBeNull()
  })

  it('returns null for undefined path', () => {
    expect(resolveProductImageUrl(undefined, mockGetMediaUrl)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(resolveProductImageUrl('', mockGetMediaUrl)).toBeNull()
  })

  it('passes absolute http URLs through unchanged', () => {
    const url = 'http://cdn.example.com/products/card.jpg'
    expect(resolveProductImageUrl(url, mockGetMediaUrl)).toBe(url)
  })

  it('passes absolute https URLs through unchanged', () => {
    const url = 'https://cdn.example.com/products/card.jpg'
    expect(resolveProductImageUrl(url, mockGetMediaUrl)).toBe(url)
  })

  it('delegates relative paths to getMediaUrl', () => {
    expect(resolveProductImageUrl('products/card.jpg', mockGetMediaUrl)).toBe('/media/products/card.jpg')
  })

  it('returns null when getMediaUrl returns null for relative path', () => {
    const alwaysNull = (_: string | null) => null
    expect(resolveProductImageUrl('products/card.jpg', alwaysNull)).toBeNull()
  })
})
