import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import RateCardView from '~/components/workbench/views/RateCardView.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

const PRODUCTS = [
  { key: 'business-cards', label: 'Business Cards', size: '90×55mm', min_qty: 100 },
  { key: 'flyers', label: 'Flyers', size: '148×210mm', min_qty: 100 },
  { key: 'stickers', label: 'Sticker Sheets', size: '90×55mm', min_qty: 100 },
]

function paperRow(overrides: Record<string, unknown> = {}) {
  return {
    key: '300gsm_matte_art_card',
    id: 'paper-300gsm-matte-art-card',
    label: 'Art Paper 300gsm',
    paper_name: 'Art Paper',
    gsm: 300,
    paper_type: 'Matte',
    category: 'Art Card',
    size: 'SRA3',
    paper_base_price: '25.00',
    single_print_base: '15.00',
    double_print_base: '30.00',
    heavy_paper_surcharge: '10.00',
    surcharge_threshold_gsm: 250,
    single_side_price: '50.00',
    double_side_price: '65.00',
    double_sided_enabled: true,
    supports_double_side: true,
    quantity_in_stock: 500,
    active: true,
    ...overrides,
  }
}

function finishingRow(overrides: Record<string, unknown> = {}) {
  return {
    key: 'cutting',
    id: 'finishing-cutting',
    label: 'Cutting Standard',
    name: 'Cutting Standard',
    pricing_mode: 'flat_per_job',
    unit: 'job',
    price: '50.00',
    minimum_charge: '50.00',
    active: true,
    ...overrides,
  }
}

function makePreview(
  rows: ReturnType<typeof paperRow>[],
  finishRows: ReturnType<typeof finishingRow>[],
  quantity = 100,
  productKey = 'business-cards',
  finishingKeys: string[] = ['cutting'],
) {
  const product = PRODUCTS.find((item) => item.key === productKey) ?? PRODUCTS[0]!
  const good = Math.ceil(quantity / 21)
  const billable = good + 2 + Math.ceil(good * 0.1)
  const finishings = finishRows
    .filter((row) => row.active)
    .map((row) => {
      const units = row.pricing_mode === 'per_sheet' ? good : row.pricing_mode === 'flat_per_job' ? 1 : quantity
      const raw = Number(row.price) * units
      const minimum = row.minimum_charge == null ? null : Number(row.minimum_charge)
      const final = minimum != null && raw < minimum ? minimum : raw
      return {
        key: row.key,
        label: row.label,
        selected: finishingKeys.includes(row.key),
        rate: String(row.price),
        quantity_basis: row.pricing_mode === 'per_sheet' ? 'sheet' : row.pricing_mode === 'flat_per_job' ? 'job' : 'piece',
        raw_total: raw.toFixed(2),
        minimum_applied: final !== raw,
        final_total: final.toFixed(2),
      }
    })
  const finishingTotal = finishings
    .filter((row) => row.selected)
    .reduce((total, row) => total + Number(row.final_total), 0)

  return {
    currency: 'KES',
    quantity,
    product,
    product_options: PRODUCTS,
    finishing_keys: finishingKeys,
    finishings,
    copies_per_sheet: 21,
    good_sheets: good,
    billable_sheets: billable,
    waste_sheets_added: billable - good,
    max_billable_sheets: billable,
    spoilage_capped: false,
    rows: rows.map((row) => {
      const paper = Number(row.paper_base_price) * billable
      const singlePrint = Number(row.single_print_base) * billable
      const doublePrint = row.double_sided_enabled ? Number(row.double_print_base) * billable : null
      const surcharge = Number(row.gsm) >= Number(row.surcharge_threshold_gsm)
        ? Number(row.heavy_paper_surcharge) * billable
        : 0
      const singleTotal = paper + singlePrint + surcharge + finishingTotal
      const doubleTotal = doublePrint == null ? null : paper + doublePrint + surcharge + finishingTotal
      return {
        key: row.key,
        label: row.label,
        gsm: row.gsm,
        size: row.size,
        active: row.active,
        surcharge_applies: surcharge > 0,
        single: {
          paper: paper.toFixed(2),
          printing: singlePrint.toFixed(2),
          surcharge: surcharge.toFixed(2),
          finishing: finishingTotal.toFixed(2),
          total: singleTotal.toFixed(2),
          unit: (singleTotal / quantity).toFixed(2),
          per_sheet: (Number(row.paper_base_price) + Number(row.single_print_base) + (surcharge ? Number(row.heavy_paper_surcharge) : 0)).toFixed(2),
          sheets: billable,
        },
        double: doubleTotal == null ? null : {
          paper: paper.toFixed(2),
          printing: doublePrint!.toFixed(2),
          surcharge: surcharge.toFixed(2),
          finishing: finishingTotal.toFixed(2),
          total: doubleTotal.toFixed(2),
          unit: (doubleTotal / quantity).toFixed(2),
          per_sheet: (Number(row.paper_base_price) + Number(row.double_print_base) + (surcharge ? Number(row.heavy_paper_surcharge) : 0)).toFixed(2),
          sheets: billable,
        },
      }
    }),
    warnings: [],
  }
}

function makeSetup(overrides: Record<string, unknown> = {}) {
  const rows = [
    paperRow(),
    paperRow({
      key: '350gsm_matte_art_card',
      id: 'paper-350gsm-matte-art-card',
      label: 'Art Paper 350gsm',
      gsm: 350,
      paper_base_price: '30.00',
      single_side_price: '55.00',
      double_side_price: '70.00',
    }),
    paperRow({
      key: 'tic_tac',
      id: 'paper-tic-tac',
      label: 'Tic Tac',
      paper_name: 'Tic Tac',
      gsm: 150,
      paper_type: 'Sticker',
      category: 'Tictac',
      paper_base_price: '25.00',
      single_side_price: '40.00',
      double_side_price: null,
      double_sided_enabled: false,
      supports_double_side: false,
    }),
  ]
  const finishRows = [
    finishingRow(),
    finishingRow({
      key: 'matte_lamination_double',
      id: 'finishing-matte-lamination-double',
      label: 'Matt Lamination Double',
      name: 'Matt Lamination Double',
      pricing_mode: 'per_sheet',
      unit: 'sheet',
      price: '45.00',
      minimum_charge: '50.00',
    }),
  ]
  return {
    paper_rows: rows,
    finishing_rows: finishRows,
    shop_details: { shop_name: 'North Press', whatsapp_number: '+254700000001', location_area: 'Nairobi' },
    summary: {
      pricing_items_added: 5,
      paper_rows_added: 3,
      finishing_rows_added: 2,
      products_unlocked: 1,
      unlocked_products: [],
      product_catalog: [],
      capability_preview: [],
      completion_feed: [],
      next_suggestions: [],
    },
    example_quote: {
      title: 'Example: 100 business cards',
      paper_label: 'Art Paper 300gsm',
      sheets_needed: 5,
      missing_fields: [],
      is_complete: false,
      is_active: true,
      status_text: 'Quote proof is ready.',
      line_items: [],
      production_cost: '450.00',
    },
    table_preview: makePreview(rows, finishRows),
    completed: false,
    version: 'v1',
    pricing_settings: {
      broker_margin_percent: '75.00',
      service_margin_percent: '0.00',
      broker_margin_locked: true,
      service_margin_locked: true,
    },
    market_guides: {},
    ...overrides,
  }
}

let currentSetup = makeSetup()
let failNextSave = false

beforeEach(() => {
  currentSetup = makeSetup()
  failNextSave = false
  apiMock.mockReset()
  apiMock.mockImplementation(async (path: string, options?: { method?: string, body?: any }) => {
    if (path === '/shops/rate-card/setup/' && !options) {
      return currentSetup
    }
    if (path === '/shops/rate-card/preview/') {
      return makePreview(
        options?.body?.paper_rows ?? currentSetup.paper_rows,
        options?.body?.finishing_rows ?? currentSetup.finishing_rows,
        options?.body?.quantity ?? 100,
        options?.body?.product_key ?? 'business-cards',
        options?.body?.finishing_keys ?? ['cutting'],
      )
    }
    if (path === '/shops/rate-card/setup/' && options?.method === 'PATCH') {
      if (failNextSave) {
        throw Object.assign(new Error('Save failed'), {
          data: { detail: 'The price table could not be saved.' },
        })
      }
      currentSetup = makeSetup({
        paper_rows: options.body.paper_rows,
        finishing_rows: options.body.finishing_rows,
        version: 'v2',
      })
      return currentSetup
    }
    if (path === '/shops/rate-card/onboarding-complete/') {
      return { completed: true, version: 'v3' }
    }
    throw new Error(`Unexpected API call: ${path}`)
  })
})

async function mountView() {
  const wrapper = await mountSuspended(RateCardView)
  await flushPromises()
  return wrapper
}

async function waitForPreview() {
  await new Promise((resolve) => setTimeout(resolve, 360))
  await flushPromises()
}

function saveButton(wrapper: Awaited<ReturnType<typeof mountView>>) {
  return wrapper.findAll('button').find((button) => button.text().includes('Save'))
}

describe('RateCardView — Excel-like production table', () => {
  it('renders editable paper inputs and backend-calculated simplex/duplex totals', async () => {
    const wrapper = await mountView()
    const text = wrapper.text()

    expect(text).toContain('Paper stock')
    expect(text).toContain('Print 1s')
    expect(text).toContain('Print 2s')
    expect(text).toContain('Qty total 1s')
    expect(text).toContain('Qty total 2s')
    expect(text).toContain('KSh 450.00')
    expect(text).toContain('KSh 570.00')
    expect(text).toContain('N/A')
    expect(wrapper.find('input[data-field="paper_base_price"]').exists()).toBe(true)
    expect(wrapper.find('select').element.value).toBe('business-cards')
  })

  it('recalculates dependent totals after a valid cell edit without saving', async () => {
    const wrapper = await mountView()
    const input = wrapper.find('input[data-field="paper_base_price"]')
    await input.setValue('30.00')
    await waitForPreview()

    expect(wrapper.text()).toContain('KSh 490.00')
    const previewCall = apiMock.mock.calls.filter(([path]) => path === '/shops/rate-card/preview/').at(-1)
    expect(previewCall?.[1].body.paper_rows[0].paper_base_price).toBe('30.00')
    expect(apiMock.mock.calls.some(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')).toBe(false)
  })

  it('saves multiple edited cells and shows success', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="paper_base_price"]').setValue('30.00')
    await waitForPreview()

    const finishingTab = wrapper.findAll('button').find((button) => button.text().includes('Finishing'))
    await finishingTab!.trigger('click')
    await flushPromises()
    await wrapper.find('input[data-field="price"]').setValue('60.00')
    await waitForPreview()

    await saveButton(wrapper)!.trigger('click')
    await flushPromises()

    const patchCall = apiMock.mock.calls.find(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')
    expect(patchCall).toBeTruthy()
    expect(patchCall![1].body.expected_version).toBe('v1')
    expect(patchCall![1].body.paper_rows[0].paper_base_price).toBe('30.00')
    expect(patchCall![1].body.finishing_rows[0].price).toBe('60.00')
    expect(wrapper.text()).toContain('Rate card saved')
  })

  it('discards draft edits back to the saved values', async () => {
    const wrapper = await mountView()
    const input = wrapper.find('input[data-field="paper_base_price"]')
    await input.setValue('30.00')
    await waitForPreview()
    expect(wrapper.text()).toContain('KSh 490.00')

    const discard = wrapper.findAll('button').find((button) => button.text() === 'Discard')
    await discard!.trigger('click')
    await flushPromises()
    await waitForPreview()

    expect((wrapper.find('input[data-field="paper_base_price"]').element as HTMLInputElement).value).toBe('25.00')
    expect(wrapper.text()).toContain('KSh 450.00')
  })

  it('shows a validation error and blocks saving negative prices', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="paper_base_price"]').setValue('30.00')
    await waitForPreview()
    await wrapper.find('input[data-field="paper_base_price"]').setValue('-5')
    await flushPromises()

    expect(wrapper.text()).toContain('Price cannot be negative.')
    expect(saveButton(wrapper)!.attributes('disabled')).toBeDefined()
    expect(apiMock.mock.calls.some(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')).toBe(false)
  })

  it('keeps unsaved work and shows an error when saving fails', async () => {
    failNextSave = true
    const wrapper = await mountView()
    await wrapper.find('input[data-field="paper_base_price"]').setValue('30.00')
    await waitForPreview()

    await saveButton(wrapper)!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('The price table could not be saved.')
    expect((wrapper.find('input[data-field="paper_base_price"]').element as HTMLInputElement).value).toBe('30.00')
    expect(wrapper.text()).toContain('KSh 490.00')
  })

  it('shows only printer-safe production values', async () => {
    const wrapper = await mountView()
    const text = wrapper.text()

    expect(text).toContain('Your production cost')
    expect(text).not.toContain('What a client would pay')
    expect(text).not.toContain('Gross margin')
    expect(text).not.toContain('Printy fee')
    expect(text).not.toContain('You receive')
  })

  it('renders the loading state while the rate card request is pending', async () => {
    let resolveSetup: ((value: unknown) => void) | null = null
    apiMock.mockImplementationOnce(() => new Promise((resolve) => {
      resolveSetup = resolve
    }))
    const wrapper = await mountSuspended(RateCardView)
    expect(wrapper.text()).toContain('Loading your rate card')

    resolveSetup?.(currentSetup)
    await flushPromises()
    expect(wrapper.text()).toContain('Paper stock')
  })

  it('shows a retryable error state', async () => {
    apiMock.mockRejectedValueOnce({ data: { detail: 'The rate card service is unavailable.' } })
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('The rate card service is unavailable.')
    const retry = wrapper.findAll('button').find((button) => button.text().includes('Try again'))
    expect(retry).toBeTruthy()
    await retry!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Paper stock')
  })

  it('renders an empty table state without crashing', async () => {
    currentSetup = makeSetup({
      paper_rows: [],
      finishing_rows: [],
      table_preview: makePreview([], [], 100, 'business-cards', []),
    })
    const wrapper = await mountView()
    expect(wrapper.text()).toContain('No paper stock yet.')
  })
})
