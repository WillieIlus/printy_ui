import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import { calculatorFixture } from './calculator-fixture'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

describe('calculator store — server preview & artwork', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
    window.localStorage.clear()
  })

  it('refreshPreview posts the backend spec and marks the estimate ready', async () => {
    const response = {
      can_calculate: true,
      display_price_text: 'KES 450',
      market_range: { min: 440, max: 484, median: 450, confidence: 'medium' },
      matches_count: 1,
    }
    apiMock.mockResolvedValue(response)
    const store = useCalculatorStore()

    const preview = await store.refreshPreview(calculatorFixture.spec)

    expect(apiMock).toHaveBeenCalledWith('/calculator/public-preview/', expect.objectContaining({ method: 'POST', auth: false }))
    const body = apiMock.mock.calls[0]![1]!.body as Record<string, unknown>
    expect(body.product_type).toBe('business_card')
    expect(body.print_sides).toBe('DUPLEX')
    expect(body.color_mode).toBe('COLOR')
    expect(preview?.display_price_text).toBe('KES 450')
    expect(store.previewStatus).toBe('ready')
    expect(store.canPrice).toBe(true)
    expect(store.previewMedian).toBe(450)
  })

  it('refreshPreview returns null without calling the API for an incomplete spec', async () => {
    const store = useCalculatorStore()
    const preview = await store.refreshPreview({ quantity: 10 } as unknown as CalculatorSpec)
    expect(preview).toBeNull()
    expect(store.previewStatus).toBe('idle')
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('uploadGuestArtwork posts multipart data and returns the token', async () => {
    apiMock.mockResolvedValue({
      artwork_token: 'abc',
      filename: 'card.pdf',
      size: 1024,
      expires_at: null,
      preview_url: null,
    })
    const store = useCalculatorStore()
    const file = new File(['pdf'], 'card.pdf', { type: 'application/pdf' })

    const upload = await store.uploadGuestArtwork(file)

    expect(apiMock).toHaveBeenCalledWith('/calculator/artwork-upload/', expect.objectContaining({ method: 'POST', auth: false }))
    const body = apiMock.mock.calls[0]![1]!.body as FormData
    expect(body.get('file')).toBe(file)
    expect(String(body.get('session_key'))).toMatch(/^gs_/)
    expect(upload.artwork_token).toBe('abc')
  })

  it('createDraft attaches the artwork token and filename to the payload', async () => {
    apiMock.mockResolvedValue({ id: 3, draft_reference: 'DR-3' })
    const store = useCalculatorStore()

    await store.createDraft(calculatorFixture.spec, null, { token: 'tok_1', filename: 'flyer.pdf' })

    const body = apiMock.mock.calls[0]![1]!.body as Record<string, unknown>
    expect(body.artwork_token).toBe('tok_1')
    expect(body.artwork_filename).toBe('flyer.pdf')
    expect(body.calculator_inputs_snapshot).toMatchObject({ product_type: 'business_card' })
  })
})