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

const DEFAULT_MASTER = {
  single_print: '15.00',
  double_print: null as string | null,
  surcharge: '10.00',
  surcharge_threshold_gsm: 250,
  gloss_first_side: '5.00',
  matt_first_side: '15.00',
  lamination_second_multiplier: '2.00',
}

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
    override_single_print: null,
    override_double_print: null,
    override_surcharge: null,
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
    override_rate: null,
    override_minimum: null,
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
  masterSettings: Partial<typeof DEFAULT_MASTER> = {},
) {
  const master = { ...DEFAULT_MASTER, ...masterSettings }
  const product = PRODUCTS.find((item) => item.key === productKey) ?? PRODUCTS[0]!
  const good = Math.ceil(quantity / 21)
  const billable = good + 2 + Math.ceil(good * 0.1)
  const finishings = finishRows
    .filter((row) => row.active)
    .map((row) => {
      const units = row.pricing_mode === 'per_sheet' ? billable : row.pricing_mode === 'flat_per_job' ? 1 : quantity
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

  return {
    currency: 'KES',
    quantity,
    master_settings: master,
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
      const doubleBase = master.double_print ?? (Number(master.single_print) * 2).toFixed(2)
      const printOne = row.override_single_print ?? master.single_print
      const printBoth = row.override_double_print ?? doubleBase
      const surchargeRate = row.override_surcharge ?? master.surcharge
      const surchargeApplies = Number(row.gsm) >= Number(master.surcharge_threshold_gsm)
      const surcharge = surchargeApplies ? Number(surchargeRate) : 0
      const available = Boolean(row.double_sided_enabled && row.supports_double_side)
      return {
        key: row.key,
        label: row.label,
        gsm: row.gsm,
        size: row.size,
        active: row.active,
        surcharge_applies: surchargeApplies,
        paper_cost: row.paper_base_price,
        printing_alone_one_side: printOne,
        printing_alone_both_sides: available ? printBoth : null,
        surcharge_rate: surchargeRate,
        total_one_side: (Number(row.paper_base_price) + Number(printOne) + surcharge).toFixed(2),
        total_both_sides: available
          ? (Number(row.paper_base_price) + Number(printBoth) + surcharge).toFixed(2)
          : null,
        double_sided_available: available,
        override_single_print: row.override_single_print ?? null,
        override_double_print: row.override_double_print ?? null,
        override_surcharge: row.override_surcharge ?? null,
      }
    }),
    warnings: [],
  }
}

function makeSetup(overrides: Record<string, unknown> = {}) {
  const master = { ...DEFAULT_MASTER }
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
    table_preview: makePreview(rows, finishRows, 100, 'business-cards', ['cutting'], master),
    completed: false,
    is_confirmed: false,
    master_settings: master,
    version: '1',
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

type SetupPayload = ReturnType<typeof makeSetup>

let currentSetup: SetupPayload = makeSetup()
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
        options?.body?.master_settings ?? {},
      )
    }
    if (path === '/shops/rate-card/setup/' && options?.method === 'PATCH') {
      if (failNextSave) {
        throw Object.assign(new Error('Save failed'), {
          data: { detail: 'The price table could not be saved.' },
        })
      }
      const body = options.body
      currentSetup = makeSetup({
        paper_rows: body.paper_rows,
        finishing_rows: body.finishing_rows,
        shop_details: body.shop_details ?? currentSetup.shop_details,
        master_settings: { ...DEFAULT_MASTER, ...body.master_settings },
        table_preview: makePreview(
          body.paper_rows,
          body.finishing_rows,
          100,
          'business-cards',
          ['cutting'],
          body.master_settings ?? {},
        ),
        completed: true,
        is_confirmed: true,
        version: '2',
      })
      return currentSetup
    }
    if (path === '/shops/rate-card/onboarding-complete/') {
      return { completed: true, version: '2' }
    }
    throw new Error(`Unexpected API call: ${path}`)
  })
})

async function mountView() {
  const wrapper = await mountSuspended(RateCardView, { attachTo: document.body })
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

function rowPanel(wrapper: Awaited<ReturnType<typeof mountView>>, rowId: string) {
  return wrapper.find(`[data-row-id="${rowId}"]`)
}

describe('RateCardView — one-screen rate card (law 11)', () => {
  it('renders master panel, flat paper table and finishing table on one screen without tabs', async () => {
    const wrapper = await mountView()
    const text = wrapper.text()

    expect(text).toContain('Master prices')
    expect(text).toContain('Paper & printing')
    expect(text).toContain('Finishing')
    expect(text).toContain('Print alone 1s')
    expect(text).toContain('Print alone 2s')
    expect(text).toContain('Total 1s')
    expect(text).toContain('Total 2s')
    expect(text).toContain('Overrides (blank = master)')
    expect(text).toContain('KSh 50.00')
    expect(text).toContain('KSh 65.00')
    expect(text).toContain('KSh 55.00')
    expect(text).toContain('KSh 70.00')
    expect(text).toContain('KSh 40.00')
    expect(text).toContain('N/A')
    expect(wrapper.find('input[data-field="master_single_print"]').exists()).toBe(true)
    expect(wrapper.find('input[data-row="300gsm_matte_art_card"][data-field="paper_base_price"]').exists()).toBe(true)
    expect(wrapper.find('input[data-row="cutting"][data-field="price"]').exists()).toBe(true)
    expect(wrapper.find('select').element.value).toBe('business-cards')
    expect(text).toContain('Draft')
    expect(text).toContain('Unconfirmed: you will not appear in find-printer until the first save.')
  })

  it('autofocuses the main print price input after load', async () => {
    const wrapper = await mountView()
    const masterInput = wrapper.find('input[data-field="master_single_print"]')
    expect(masterInput.attributes('autofocus')).toBeDefined()
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-field')).toBe('master_single_print')
  })

  it('Enter moves focus from the main price to the next master field', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').trigger('keydown.enter')
    expect((document.activeElement as HTMLElement | null)?.getAttribute('data-field')).toBe('master_double_print')
  })

  it('recalculates the table from the debounced preview when the main price changes', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()

    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 53.00')
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 71.00')
    const previewCall = apiMock.mock.calls.filter(([path]) => path === '/shops/rate-card/preview/').at(-1)
    expect(previewCall?.[1].body.master_settings.single_print).toBe('18.00')
    expect(apiMock.mock.calls.some(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')).toBe(false)
    expect(wrapper.text()).toContain('unsaved edits')
  })

  it('marks an overridden paper row, recalculates it only, and Reset restores the master', async () => {
    const wrapper = await mountView()
    const overrideInput = wrapper.find('input[data-row="300gsm_matte_art_card"][data-field="override_single_print"]')
    await overrideInput.setValue('20')
    await waitForPreview()

    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 55.00')
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('override')
    expect(rowPanel(wrapper, '350gsm_matte_art_card').text()).toContain('KSh 55.00')
    expect(rowPanel(wrapper, '350gsm_matte_art_card').text()).not.toContain('override')

    const resetRow = wrapper.find('button[data-reset-row="300gsm_matte_art_card"]')
    expect(resetRow.exists()).toBe(true)
    await resetRow.trigger('click')
    await waitForPreview()

    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 50.00')
    expect(wrapper.find('button[data-reset-row="300gsm_matte_art_card"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Reset all overrides')
  })

  it('Reset all clears every paper override at once', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-row="300gsm_matte_art_card"][data-field="override_single_print"]').setValue('20')
    await waitForPreview()
    await wrapper.find('input[data-row="tic_tac"][data-field="override_surcharge"]').setValue('3')
    await waitForPreview()
    expect(wrapper.text()).toContain('Reset all overrides')

    const resetAll = wrapper.findAll('button').find((button) => button.text().includes('Reset all overrides'))
    await resetAll!.trigger('click')
    await waitForPreview()

    expect(wrapper.text()).not.toContain('Reset all overrides')
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 50.00')
    expect(rowPanel(wrapper, 'tic_tac').text()).toContain('KSh 40.00')
  })

  it('marks a changed finishing row and its Rst button restores the saved rate', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-row="cutting"][data-field="price"]').setValue('60.00')
    await waitForPreview()

    const cuttingRow = wrapper.find('button[data-reset-finish="cutting"]')
    expect(cuttingRow.exists()).toBe(true)
    await cuttingRow.trigger('click')
    await flushPromises()

    expect(wrapper.find('button[data-reset-finish="cutting"]').exists()).toBe(false)
    expect((wrapper.find('input[data-row="cutting"][data-field="price"]').element as HTMLInputElement).value).toBe('50.00')
  })

  it('changing the main price and saving takes one field and one click', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()

    await saveButton(wrapper)!.trigger('click')
    await flushPromises()

    const patchCalls = apiMock.mock.calls.filter(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')
    expect(patchCalls).toHaveLength(1)
    expect(patchCalls[0]![1].body.master_settings.single_print).toBe('18.00')
    expect(patchCalls[0]![1].body.expected_version).toBe('1')
    expect(patchCalls[0]![1].body.paper_rows[0].paper_base_price).toBe('25.00')
    expect(wrapper.text()).toContain('Rate card saved')
    expect(wrapper.text()).toContain('Live')
  })

  it('saves multiple edited cells across master, paper and finishing in one PATCH', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()
    await wrapper.find('input[data-row="300gsm_matte_art_card"][data-field="paper_base_price"]').setValue('30.00')
    await waitForPreview()
    await wrapper.find('input[data-row="cutting"][data-field="price"]').setValue('60.00')
    await waitForPreview()

    await saveButton(wrapper)!.trigger('click')
    await flushPromises()

    const patchCall = apiMock.mock.calls.find(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')
    expect(patchCall).toBeTruthy()
    expect(patchCall![1].body.master_settings.single_print).toBe('18.00')
    expect(patchCall![1].body.paper_rows[0].paper_base_price).toBe('30.00')
    expect(patchCall![1].body.finishing_rows[0].price).toBe('60.00')
    expect(wrapper.text()).toContain('Rate card saved')
  })

  it('recalculates dependent totals after a valid paper cost edit without saving', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-row="300gsm_matte_art_card"][data-field="paper_base_price"]').setValue('30.00')
    await waitForPreview()

    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 55.00')
    const previewCall = apiMock.mock.calls.filter(([path]) => path === '/shops/rate-card/preview/').at(-1)
    expect(previewCall?.[1].body.paper_rows[0].paper_base_price).toBe('30.00')
    expect(apiMock.mock.calls.some(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')).toBe(false)
  })

  it('discards draft edits back to the saved values, including the master panel', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 53.00')

    const discard = wrapper.findAll('button').find((button) => button.text() === 'Discard')
    await discard!.trigger('click')
    await flushPromises()
    await waitForPreview()

    expect((wrapper.find('input[data-field="master_single_print"]').element as HTMLInputElement).value).toBe('15.00')
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 50.00')
  })

  it('shows a validation error and blocks saving negative prices', async () => {
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()
    await wrapper.find('input[data-field="master_single_print"]').setValue('-5')
    await flushPromises()

    expect(wrapper.text()).toContain('Price cannot be negative.')
    expect(saveButton(wrapper)!.attributes('disabled')).toBeDefined()
    expect(apiMock.mock.calls.some(([path, options]) => path === '/shops/rate-card/setup/' && options?.method === 'PATCH')).toBe(false)
  })

  it('keeps unsaved work and shows an error when saving fails', async () => {
    failNextSave = true
    const wrapper = await mountView()
    await wrapper.find('input[data-field="master_single_print"]').setValue('18')
    await waitForPreview()

    await saveButton(wrapper)!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('The price table could not be saved.')
    expect((wrapper.find('input[data-field="master_single_print"]').element as HTMLInputElement).value).toBe('18.00')
    expect(rowPanel(wrapper, '300gsm_matte_art_card').text()).toContain('KSh 53.00')
  })

  it('shows only printer-safe production values', async () => {
    const wrapper = await mountView()
    const text = wrapper.text()

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
    expect(wrapper.text()).toContain('Master prices')
  })

  it('shows a retryable error state', async () => {
    apiMock.mockRejectedValueOnce({ data: { detail: 'The rate card service is unavailable.' } })
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('The rate card service is unavailable.')
    const retry = wrapper.findAll('button').find((button) => button.text().includes('Try again'))
    expect(retry).toBeTruthy()
    await retry!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Master prices')
  })

  it('renders an empty table state without crashing', async () => {
    currentSetup = makeSetup({
      paper_rows: [],
      finishing_rows: [],
      table_preview: makePreview([], [], 100, 'business-cards', []),
    })
    const wrapper = await mountView()
    expect(wrapper.text()).toContain('No paper stock yet.')
    expect(wrapper.text()).toContain('No finishing services yet.')
  })
})
