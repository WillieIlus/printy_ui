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

// The canonical sheet projection the backend attaches to every priced
// shop-options row (built by the single production-preview extractor). This is
// what the imposition diagram is rendered from.
const productionPreview = {
  pieces_per_sheet: 4,
  sheets_required: 125,
  parent_sheet: 'A3',
  good_sheets: 125,
  waste_sheets_added: 3,
  fixed_waste_sheets: 2,
  variable_waste_sheets: 1,
  variable_waste_rate: 0.01,
  billable_sheets: 128,
  production_sheets: 128,
  max_billable_sheets: null,
  maximum_spoilage_rate: null,
  maximum_spoilage_sheets: null,
  spoilage_capped: false,
  layout: { cols: 2, rows: 2, orientation: 'normal' },
  bleed_mm: 3,
  press_sheet: { label: 'A3', width_mm: 420, height_mm: 297 },
  imposition_label: '4 up on A3',
  size_label: 'A5',
  quantity: 500,
  cutting_required: false,
  selected_finishings: [],
  suggested_finishings: [],
  warnings: [],
  finished_piece: { width_mm: 148, height_mm: 210 },
  margins_mm: { horizontal: 6, vertical: 9 },
}

// The RAW engine result also travels as preview_snapshot: totals, breakdown,
// copies_per_sheet -- with NO layout/press_sheet/pieces_per_sheet keys. The
// view must never feed it to the diagram; doing so would render no sheet.
const previewSnapshot = {
  pricing_mode: 'SHEET',
  quantity: 500,
  currency: 'KES',
  totals: { subtotal: '900.00' },
  copies_per_sheet: 4,
  good_sheets: 125,
  billable_sheets: 128,
  parent_sheet_name: 'A3',
  rotated: false,
  breakdown: {
    paper: { label: 'A3 Silk 300gsm', sheet_size: 'A3', width_mm: 420, height_mm: 297 },
    imposition: { copies_per_sheet: 4, cols: 2, rows: 2, fits: true, explanation: '4 up' },
    printing: {},
    finishings: [],
  },
}

const costLines = [
  { component: 'paper', label: 'Silk 300gsm', spec: 'A3 sheet', quantity: 500, unit: 'sheet', unit_price_kes: '1.00', total_kes: '500.00', currency: 'KES' },
  { component: 'printing', label: 'Printing', spec: 'full_color double_sided', quantity: 500, unit: 'sheet', unit_price_kes: '0.80', total_kes: '400.00', currency: 'KES' },
]

const shopOption = {
  shop_id: 1,
  id: 1,
  name: 'Northpress',
  location: 'Nairobi',
  eligible: true,
  production_cost: '900.00',
  printer_quoted_price: '900.00',
  printer_quoted_price_per_piece: '1.80',
  ineligible_reason: '',
  currency: 'KES',
  cost_lines: costLines,
  preview_snapshot: previewSnapshot,
  production_preview: productionPreview,
}

// The pricing preview (Calculate) omits production_preview, preview_snapshot
// and cost_lines; the frontend must recover them from the shop search by shop
// id.
const pricedShop = {
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
  for (let i = 0; i < 6; i += 1) await nextTick()
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerQuotesView, { global: { plugins: [pinia] } })
  const store = useManagerStore(pinia)
  return { wrapper, store }
}

type MountedWrapper = Awaited<ReturnType<typeof mountView>>['wrapper']

async function openRequest(wrapper: MountedWrapper, prefill: Record<string, unknown> = {}) {
  apiMock.mockResolvedValueOnce(makeQuote())
  apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 }, paper: {}, print: {}, finishing: [], ...prefill })
  await wrapper.find('aside button').trigger('click')
  await flush()
}

async function findShops(wrapper: MountedWrapper, response: unknown) {
  apiMock.mockResolvedValueOnce(response)
  await wrapper.findAll('button').find((b) => b.text().includes('Find printer shops'))!.trigger('click')
  await flush()
}

describe("ManagerQuotesView production options — law 7.4a", () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('renders the shop name, then the itemised lines, then the printer quote, then the imposition', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper)
    await findShops(wrapper, { results: [shopOption], pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, matched_count: 1 })

    const text = wrapper.text()
    expect(text).toContain('Northpress')
    expect(text).toContain('Silk 300gsm')
    expect(text).toContain('KES 500.00')
    expect(text).toContain('Printing')
    expect(text).toContain('KES 400.00')
    expect(text).toContain("Printer's quote")
    expect(text).toContain('KES 900.00')
    expect(text).toContain('KES 1.80/pc')    // The imposed sheet component is actually mounted with the engine preview.
    expect(text).toContain('This is the actual imposition your price is built from.')

    // The required order: shop name, then the lines, then the quote, then the imposition.
    const html = wrapper.html()
    const nameAt = html.indexOf('Northpress')
    const lineAt = html.indexOf('Silk 300gsm')
    const quoteAt = html.indexOf("Printer's quote")
    const sheetAt = html.indexOf('This is the actual imposition')
    expect(nameAt).toBeGreaterThanOrEqual(0)
    expect(nameAt).toBeLessThan(lineAt)
    expect(lineAt).toBeLessThan(quoteAt)
    expect(quoteAt).toBeLessThan(sheetAt)

    // The imposed sheet is rendered from the canonical production_preview even
    // though the raw engine dict (preview_snapshot) rides along. If the view
    // ever fed preview_snapshot to the diagram there would be no grid, no
    // margins and no caption below the quote.
    expect(text).toContain('2 × 2')
    expect(text).toContain('Margins')
    expect(text).toContain('6mm left/right · 9mm top/bottom')
    expect(html).toContain('stroke-dasharray="2 2"') // the margin band drawn on the sheet
    expect(text).toContain('KES 900.00') // sanity: still priced, not swapped for raw snapshot data
  })

  it('recovers the lines and the imposition after Calculate, when the pricing preview omits them', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper)
    await findShops(wrapper, { results: [shopOption], pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, matched_count: 1 })

    apiMock.mockResolvedValueOnce({
      quote_request_id: 11,
      selected_shop_id: 1,
      breakdown: { production_cost: '900.00', markup_pct: '75', markup_amount: '675.00', broker_client_price: '1575.00', platform_fee: '0.00', client_total: '1575.00' },
      eligible_shops: [pricedShop],
      missing_fields: [],
    })
    await wrapper.findAll('button').find((b) => b.text().includes('Calculate'))!.trigger('click')
    await flush()

    const text = wrapper.text()
    expect(text).toContain('Silk 300gsm')
    expect(text).toContain('KES 500.00')
    expect(text).toContain('This is the actual imposition your price is built from.')
  })

  it('re-renders the imposition from the new response when the specs change and the manager searches again', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper)
    await findShops(wrapper, { results: [shopOption], pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, matched_count: 1 })

    // First specs: A5 flyer -> 2 x 2 with 6/9mm margins.
    expect(wrapper.text()).toContain('2 × 2')
    expect(wrapper.text()).toContain('6mm left/right · 9mm top/bottom')

    // The manager changes the specs (product/size/paper) and searches again;
    // the response now carries a business-card 5 x 5 projection.
    const businessCardOption = {
      ...shopOption,
      production_preview: {
        ...productionPreview,
        pieces_per_sheet: 25,
        layout: { cols: 5, rows: 5, orientation: 'normal' },
        imposition_label: '25 copy/copies per sheet using normal layout; 25 good sheet(s) needed.',
        size_label: 'Business card',
        finished_piece: { width_mm: 85, height_mm: 55 },
        margins_mm: { horizontal: 10, vertical: 11.5 },
      },
    }
    await findShops(wrapper, { results: [businessCardOption], pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, matched_count: 1 })

    const text = wrapper.text()
    expect(text).toContain('5 × 5')
    expect(text).toContain('25 up')
    expect(text).toContain('10mm left/right · 11.5mm top/bottom')
    expect(text).not.toContain('6mm left/right · 9mm top/bottom')
    expect(text).not.toContain('2 × 2')
    // 25 individual piece rectangles drawn on the sheet (rx="1.5" is the
    // piece marker; legend swatches and the margin band use other corners).
    expect(wrapper.html().match(/rx="1\.5"/g)?.length).toBe(25)
  })

  it('does not invent a quote when the backend sends none', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper)
    await findShops(wrapper, { results: [{ ...pricedShop, eligible: false, ineligible_reason: 'no rate card' }], matched_count: 0 })
    // Ineligible shops carry no fabricated lines or quote.
    expect(wrapper.text()).not.toContain('This is the actual imposition')
  })
})

describe('ManagerQuotesView — item 6 readable labels and prepare hint', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('shows readable labels instead of raw engine values', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper, {
      paper: { gsm: 300, type: 'silk' },
      print: { sides: 'double_sided', color_mode: 'full_color' },
      finishing: [{ type: 'lamination', slug: 'lamination', sides: 'both' }],
    })

    const text = wrapper.text()
    expect(text).toContain('Full colour')
    expect(text).toContain('Double-sided')
    expect(text).toContain('Lamination')
    expect(text).not.toContain('full_color')
    expect(text).not.toContain('double_sided')
  })

  it('shows a short hint under the disabled Prepare quote button', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const { wrapper } = await mountView()
    await flush()
    await openRequest(wrapper)

    // Nothing searched yet: the hint says what to do first.
    expect(wrapper.text()).toContain('Find printer shops, then pick a printer option.')

    await findShops(wrapper, { results: [shopOption], pricing_snapshot: { selected_shops: [{ shop_id: 1 }] }, matched_count: 1 })
    // Option picked but not priced yet.
    expect(wrapper.text()).toContain('Press Calculate to price this printer option.')
  })
})
