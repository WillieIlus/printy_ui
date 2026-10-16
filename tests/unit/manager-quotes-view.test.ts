import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerQuotesView from '~/components/workbench/views/ManagerQuotesView.vue'
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

const shop = {
  shop_id: 1,
  id: 1,
  name: 'Northpress',
  location: 'Nairobi',
  eligible: true,
  production_cost: '900.00',
  printer_quoted_price: '900.00',
  printer_quoted_price_per_piece: '1.80',
  ineligible_reason: '',
}

async function flush() {
  for (let i = 0; i < 5; i += 1) await nextTick()
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerQuotesView, { global: { plugins: [pinia] } })
  const store = useManagerStore(pinia)
  return { wrapper, store }
}

describe('ManagerQuotesView — persistent default markup', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('seeds the Markup % field from the saved default (fraction stored, percent shown)', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.5000' })
    const { wrapper } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    const input = wrapper.find('input[type="number"]')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).value).toBe('50')
  })

  it('keeps the platform default of 75 when the manager has not set one', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    expect((wrapper.find('input[type="number"]').element as HTMLInputElement).value).toBe('75')
  })

  it('persists the markup used when preparing a quote as the new default', async () => {    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.1000' })
    const { wrapper, store } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    const input = wrapper.find('input[type="number"]')
    expect((input.element as HTMLInputElement).value).toBe('10')

    await input.setValue('25')

    apiMock.mockResolvedValueOnce({
      results: [shop],
      pricing_snapshot: { selected_shops: [{ shop_id: 1 }] },
      matched_count: 1,
    })
    const findBtn = wrapper.findAll('button').find((b) => b.text().includes('Find printer shops'))!
    await findBtn.trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({
      quote_request_id: 11,
      selected_shop_id: 1,
      breakdown: {
        production_cost: '900.00',
        markup_pct: '25',
        markup_amount: '225.00',
        broker_client_price: '1125.00',
        platform_fee: '0.00',
        client_total: '1125.00',
      },
      eligible_shops: [],
      missing_fields: [],
    })
    const calcBtn = wrapper.findAll('button').find((b) => b.text().includes('Calculate'))!
    await calcBtn.trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quote: { id: 7 }, partner_preview: {} })
    apiMock.mockResolvedValueOnce({ default_markup_rate: '0.2500' })
    const prepareBtn = wrapper.findAll('button').find((b) => b.text().includes('Prepare quote'))!
    await prepareBtn.trigger('click')
    await flush()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/quotes/11/prepare/', {
      method: 'POST',
      body: { shop: 1, pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, markup_pct: 25 },
    })
    const patchCalls = apiMock.mock.calls.filter(
      ([path, opts]) =>
        path === '/dashboard/partner/profile/' &&
        (opts as { method?: string } | undefined)?.method === 'PATCH',
    )
    expect(patchCalls).toHaveLength(1)
    expect(patchCalls[0]?.[1]).toMatchObject({
      method: 'PATCH',
      body: { default_markup_rate: '0.2500' },
    })
    expect(store.defaultMarkupRate).toBe(0.25)
  })

  it('law 7.4 — the calculator shows the printer cost only, never the stacked client total', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({
      results: [shop],
      pricing_snapshot: { selected_shops: [{ shop_id: 1 }] },
      matched_count: 1,
    })
    await wrapper.findAll('button').find((b) => b.text().includes('Find printer shops'))!.trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({
      quote_request_id: 11,
      selected_shop_id: 1,
      breakdown: {
        production_cost: '900.00',
        markup_pct: '75',
        markup_amount: '675.00',
        broker_client_price: '1575.00',
        platform_fee: '0.00',
        client_total: '1575.00',
      },
      eligible_shops: [],
      missing_fields: [],
    })
    await wrapper.findAll('button').find((b) => b.text().includes('Calculate'))!.trigger('click')
    await flush()

    const text = wrapper.text()
    expect(text).toContain("Printer's quote")
    expect(text).toContain('900.00')
    expect(text).not.toContain('Client total')
    expect(text).not.toContain('Platform fee')
    expect(text).not.toContain('Your markup')
    expect(text).not.toContain('Client price')
  })

  it("law 7.10a — the calculator shows the printer's own quote (total and per piece), never the payout or buyer price", async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({
      results: [shop],
      pricing_snapshot: { selected_shops: [{ shop_id: 1 }] },
      matched_count: 1,
    })
    await wrapper.findAll('button').find((b) => b.text().includes('Find printer shops'))!.trigger('click')
    await flush()

    apiMock.mockResolvedValueOnce({
      quote_request_id: 11,
      selected_shop_id: 1,
      breakdown: {
        production_cost: '900.00',
        markup_pct: '75',
        markup_amount: '675.00',
        broker_client_price: '1575.00',
        platform_fee: '0.00',
        client_total: '1575.00',
      },
      eligible_shops: [shop],
      missing_fields: [],
    })
    await wrapper.findAll('button').find((b) => b.text().includes('Calculate'))!.trigger('click')
    await flush()

    const text = wrapper.text()
    expect(text).toContain("Printer's quote")
    expect(text).toContain('900.00')
    expect(text).toContain('1.80')
    expect(text).not.toContain('Payout')
    expect(text).not.toContain('1575.00')
    expect(text).not.toContain('Client total')
  })

  it('law 7.5 — renders the workload grouped by the backend section, not by status maths', async () => {
    apiMock
      .mockResolvedValueOnce([
        makeQuote({ id: 1, section: 'unresponded', section_label: 'Unresponded / sent', needs_attention: true }),
        makeQuote({ id: 2, section: 'replied', section_label: 'Replied' }),
        makeQuote({ id: 3, section: 'done', section_label: 'Done', muted: true }),
      ])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()

    const text = wrapper.text()
    expect(text).toContain('Unresponded / sent')
    expect(text).toContain('Replied')
    expect(text).toContain('Done')
  })
})