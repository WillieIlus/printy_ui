import { describe, it, expect } from 'vitest'
import { resolveMediaUrl, normalizeServerRoot, getApiBase, getMediaBase } from './runtime-url'

describe('normalizeServerRoot', () => {
  it('returns clean origin for a plain API base URL', () => {
    expect(normalizeServerRoot('https://api.printy.ke', false)).toBe('https://api.printy.ke')
  })

  it('strips trailing slash', () => {
    expect(normalizeServerRoot('https://api.printy.ke/', false)).toBe('https://api.printy.ke')
  })

  it('strips /api suffix', () => {
    expect(normalizeServerRoot('https://api.printy.ke/api', false)).toBe('https://api.printy.ke')
  })

  it('strips /api/ suffix', () => {
    expect(normalizeServerRoot('https://api.printy.ke/api/', false)).toBe('https://api.printy.ke')
  })

  it('falls back to default when given null', () => {
    expect(normalizeServerRoot(null, false)).toBe('https://api.printy.ke')
  })

  it('falls back to default when given undefined', () => {
    expect(normalizeServerRoot(undefined, false)).toBe('https://api.printy.ke')
  })

  it('reads apiBaseUrl from flat object shape', () => {
    expect(normalizeServerRoot({ apiBaseUrl: 'https://local.test' }, false)).toBe('https://local.test')
  })

  it('reads apiBaseUrl from nested public shape', () => {
    expect(normalizeServerRoot({ public: { apiBaseUrl: 'https://local.test' } }, false)).toBe('https://local.test')
  })
})

describe('getApiBase', () => {
  it('appends /api to the server root', () => {
    expect(getApiBase('https://api.printy.ke')).toBe('https://api.printy.ke/api')
  })
})

describe('getMediaBase', () => {
  it('appends /media to the server root', () => {
    expect(getMediaBase('https://api.printy.ke')).toBe('https://api.printy.ke/media')
  })
})

describe('resolveMediaUrl', () => {
  it('returns empty string for null path', () => {
    expect(resolveMediaUrl(null, 'https://api.printy.ke')).toBe('')
  })

  it('returns empty string for undefined path', () => {
    expect(resolveMediaUrl(undefined, 'https://api.printy.ke')).toBe('')
  })

  it('returns empty string for empty string path', () => {
    expect(resolveMediaUrl('', 'https://api.printy.ke')).toBe('')
  })

  it('passes absolute https URLs through unchanged', () => {
    const url = 'https://cdn.example.com/products/card.jpg'
    expect(resolveMediaUrl(url, 'https://api.printy.ke')).toBe(url)
  })

  it('passes protocol-relative URLs through unchanged', () => {
    const url = '//cdn.example.com/products/card.jpg'
    expect(resolveMediaUrl(url, 'https://api.printy.ke')).toBe(url)
  })

  it('passes data URIs through unchanged', () => {
    const dataUri = 'data:image/png;base64,abc123'
    expect(resolveMediaUrl(dataUri, 'https://api.printy.ke')).toBe(dataUri)
  })

  it('passes blob URLs through unchanged', () => {
    const blobUrl = 'blob:https://app.printy.ke/some-id'
    expect(resolveMediaUrl(blobUrl, 'https://api.printy.ke')).toBe(blobUrl)
  })

  it('prepends media base to a bare relative path', () => {
    expect(resolveMediaUrl('products/card.jpg', 'https://api.printy.ke'))
      .toBe('https://api.printy.ke/media/products/card.jpg')
  })

  it('strips leading slash from relative path', () => {
    expect(resolveMediaUrl('/products/card.jpg', 'https://api.printy.ke'))
      .toBe('https://api.printy.ke/media/products/card.jpg')
  })

  it('strips redundant media/ prefix from path already containing it', () => {
    expect(resolveMediaUrl('media/products/card.jpg', 'https://api.printy.ke'))
      .toBe('https://api.printy.ke/media/products/card.jpg')
  })

  it('strips redundant /media/ prefix from path already containing it', () => {
    expect(resolveMediaUrl('/media/products/card.jpg', 'https://api.printy.ke'))
      .toBe('https://api.printy.ke/media/products/card.jpg')
  })
})
