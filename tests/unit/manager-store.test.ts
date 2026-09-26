import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useManagerStore } from '~/stores/manager'
import type { ManagerQuoteRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeQuote(overrides: Partial<ManagerQuoteRow> = {}): ManagerQuoteRow {
  return {
    id: 11,
    reference: 'QR-11',
    quote_request_reference: 'REQ-11',
    quote_reference: null,
    product: 'A5 Flyers',
    status: 'pending',
    raw_status: 'pending',
    status_label: 'Pending',
    customer_name: 'Ava',
    shop_name: 'Northpress',
    assigned_manager_name: 'Dale',
    request_snapshot: {},
    latest_response: null,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    managed_job: null,
    ...overrides,
  }
}

describe('manager store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetchQuotes unwraps the { results } envelope', async () => {
    apiMock.mockResolvedValue({ role: 'partner', results: [makeQuote()] })
    const store = useManagerStore()

    await store.fetchQuotes()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/')
    expect(store.quotes).toHaveLength(1)
    expect(store.hasQuotes).toBe(true)
  })

  it('fetchQuote unwraps the { quote } envelope into activeQuote', async () => {
    apiMock.mockResolvedValue({ role: 'partner', quote: makeQuote() })
    const store = useManagerStore()

    await store.fetchQuote(11)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/11/')
    expect(store.activeQuote?.id).toBe(11)
  })

  it('fetchPrefill loads builder details', async () => {
    apiMock.mockResolvedValue({ quote_request_id: 11, quantity: 500, product_type: 'flyer' })
    const store = useManagerStore()

    await store.fetchPrefill(11)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/manager/quote-requests/11/prefill/')
    expect(store.prefill?.quantity).toBe(500)
  })

  it('fetchShopOptions posts specs and exposes eligible shops', async () => {
    apiMock.mockResolvedValue({
      results: [
        { shop_id: 1, shop_name: 'Northpress', price_status: 'priced', production_cost: '900.00' },
      ],
      pricing_snapshot: { selected_shops: [{ id: 1 }] },
    })
    const store = useManagerStore()

    await store.fetchShopOptions(11, { quantity: 500 })

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/11/shop-options/', {
      method: 'POST',
      body: { quantity: 500 },
    })
    expect(store.eligibleShops).toHaveLength(1)
    expect(store.shopOptions?.pricing_snapshot).toEqual({ selected_shops: [{ id: 1 }] })
  })

  it('previewPricing posts specs, shop and markup', async () => {
    apiMock.mockResolvedValue({ quote_request_id: 11, breakdown: { client_total: '1800.00' }, eligible_shops: [] })
    const store = useManagerStore()

    await store.previewPricing(11, { shop_id: 1, markup_pct: '75' })

    expect(apiMock).toHaveBeenCalledWith('/dashboard/manager/quote-requests/11/preview-pricing/', {
      method: 'POST',
      body: { shop_id: 1, markup_pct: '75' },
    })
    expect(store.pricingPreview?.breakdown?.client_total).toBe('1800.00')
  })

  it('prepare posts the pricing snapshot and markup percent', async () => {
    apiMock.mockResolvedValue({ quote_request_id: 11, quote: { id: 7 }, partner_preview: {} })
    const store = useManagerStore()

    await store.prepare(11, { shop: 1, pricing_snapshot: { selected_shops: [] }, markup_pct: 75 })

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/11/prepare/', {
      method: 'POST',
      body: { shop: 1, pricing_snapshot: { selected_shops: [] }, markup_pct: 75 },
    })
  })

  it('sendToClient posts and flips the row status to sent', async () => {
    apiMock.mockResolvedValue({ quote_request_id: 11, quote_id: 7, offline_client: false })
    const store = useManagerStore()
    store.quotes = [makeQuote()]

    const result = await store.sendToClient(11)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/11/send-to-client/', { method: 'POST', body: {} })
    expect(store.quotes[0]!.status).toBe('sent')
    expect(result?.quote_id).toBe(7)
  })

  it('records the underlying message when a fetch fails (no generic fallback)', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useManagerStore()

    await store.fetchQuotes()

    expect(store.error).toBe('down')
    expect(store.hasQuotes).toBe(false)
  })

  it('fetchShopOptions surfaces the server validation detail instead of the generic error', async () => {
    apiMock.mockRejectedValue({
      data: {
        code: 'VALIDATION_ERROR',
        message: '"single" is not a valid choice.',
        field_errors: {
          print_sides: ['"single" is not a valid choice.'],
          color_mode: ['"full_color" is not a valid choice.'],
        },
      },
    })
    const store = useManagerStore()

    const result = await store.fetchShopOptions(11, { print_sides: 'single', color_mode: 'full_color' })

    expect(result).toBeNull()
    expect(store.error).toContain('"single" is not a valid choice.')
    expect(store.error).toContain('Print sides')
    expect(store.error).toContain('Color mode')
    expect(store.error).not.toContain("We couldn't fetch production options.")
  })

  it('fetchShopOptions falls back to the friendly message when the server gives no detail', async () => {
    apiMock.mockRejectedValue({ data: {} })
    const store = useManagerStore()

    await store.fetchShopOptions(11, {})

    expect(store.error).toContain("We couldn't fetch production options.")
  })
})
