import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { CalculatorConfig, CalculatorProductConfig } from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import type { ServerCalculatorPreview, ServerRoleEconomics } from '~/shared/types'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'
import DesignCalculatorRoleBreakdown from '~/components/design/calculator/DesignCalculatorRoleBreakdown.vue'

const product: CalculatorProductConfig = {
  key: 'business_card',
  label: 'Business cards',
  required_fields: ['quantity', 'finished_size', 'print_sides', 'color_mode'],
  optional_fields: [],
  defaults: { quantity: 100 },
  allowed_paper_categories: ['matt'],
  allowed_cover_categories: [],
  allow_custom_size: true,
  allow_custom_paper_request: true,
  sizes: [{ value: '85x55mm', label: '85 × 55 mm', width_mm: 85, height_mm: 55 }],
  fields: [
    { key: 'quantity', label: 'Quantity', type: 'number', required: true },
    {
      key: 'requested_paper_category',
      label: 'Requested paper',
      type: 'select',
      required: false,
      options: [{ value: 'matt', label: 'matt' }],
    },
    { key: 'requested_gsm', label: 'Requested GSM', type: 'number', required: false },
    {
      key: 'lamination',
      label: 'Lamination',
      type: 'select',
      required: false,
      options: [
        { value: 'none', label: 'none' },
        { value: 'matt-lamination', label: 'matt-lamination' },
      ],
    },
    { key: 'corner_rounding', label: 'Corner rounding', type: 'boolean', required: false },
    {
      key: 'print_sides',
      label: 'Print sides',
      type: 'select',
      required: true,
      options: [
        { value: 'SIMPLEX', label: 'Single sided' },
        { value: 'DUPLEX', label: 'Double sided' },
      ],
    },
    {
      key: 'color_mode',
      label: 'Colour',
      type: 'select',
      required: true,
      options: [{ value: 'COLOR', label: 'Full colour' }],
    },
  ],
}

const config: CalculatorConfig = {
  products: [product],
  paper_categories: [],
  finishings: [],
  sizes: {},
  print_sides: [
    { value: 'SIMPLEX', label: 'Single sided' },
    { value: 'DUPLEX', label: 'Double sided' },
  ],
  color_modes: [{ value: 'COLOR', label: 'Full colour' }],
}

const spec: CalculatorSpec = {
  product_type: 'business_card',
  quantity: 100,
  finished_size: '85x55mm',
  color_mode: 'COLOR',
  print_sides: 'DUPLEX',
  requested_paper_category: 'matt',
  requested_gsm: 250,
  lamination: 'none',
  corner_rounding: false,
}

const buyerPreview: ServerCalculatorPreview = {
  can_calculate: true,
  product_type: 'business_card',
  price_mode: 'market',
  matches_count: 2,
  display_price_text: 'KSh 4,500',
  display_mode: 'range',
  confidence_label: 'High',
  source_label: 'network',
  market_range: {
    min: 4000,
    max: 5000,
    median: 4500,
    currency: 'KES',
    label: 'Network range',
    confidence: 'high',
  },
  speed_options: [
    { key: 'standard', label: 'Standard', multiplier: '1.00', total: '4500.00', turnaround_hours: null },
    { key: 'faster', label: 'Faster +50%', multiplier: '1.50', total: '6750.00', turnaround_hours: null },
    { key: 'fastest', label: 'Fastest +100%', multiplier: '2.00', total: '9000.00', turnaround_hours: null },
  ],
  missing_fields: [],
  summary: null,
  warnings: [],
  suggestions: [],
  exact_or_estimated: false,
}

const MANAGER_ECONOMICS: ServerRoleEconomics = {
  role: 'manager',
  currency: 'KES',
  markup_percent: '75.00',
  lines: [
    {
      label: 'SRA3 300gsm Matt, both sides, 8 sheets',
      spec: 'both sides, 8 sheets',
      quantity: 8,
      unit: 'sheet',
      rate: '10.94',
      total: '87.50',
      production_rate: '6.25',
      production_total: '50.00',
      markup_amount: '37.50',
    },
    {
      label: 'Matt lamination',
      spec: '',
      quantity: 100,
      unit: 'piece',
      rate: '0.18',
      total: '17.50',
      production_rate: '0.10',
      production_total: '10.00',
      markup_amount: '7.50',
    },
  ],
  production_total: '60.00',
  markup_total: '45.00',
  manager_total: '105.00',
  printy_fee: '15.00',
  client_total_inclusive: '120.00',
}

const PRINTER_ECONOMICS: ServerRoleEconomics = {
  role: 'printer',
  currency: 'KES',
  lines: [
    {
      label: 'SRA3 300gsm Matt, both sides, 8 sheets',
      spec: 'both sides, 8 sheets',
      quantity: 8,
      unit: 'sheet',
      rate: '6.25',
      total: '50.00',
    },
    {
      label: 'Matt lamination',
      spec: '',
      quantity: 100,
      unit: 'piece',
      rate: '0.10',
      total: '10.00',
    },
  ],
  production_total: '60.00',
  printer_payout: '54.00',
}

function managerPreview(): ServerCalculatorPreview {
  return { ...buyerPreview, role_economics: MANAGER_ECONOMICS }
}

function printerPreview(): ServerCalculatorPreview {
  // Mirrors the server projection: no buyer range and no buyer speed prices.
  return {
    ...buyerPreview,
    market_range: null,
    speed_options: [],
    role_economics: PRINTER_ECONOMICS,
  }
}

async function mountMinimal(preview: ServerCalculatorPreview, extraProps: Record<string, unknown> = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(DesignCalculatorMinimal, {
    props: {
      authed: true,
      configOverride: config,
      specOverride: spec,
      previewOverride: preview,
      previewStatusOverride: 'ready',
      configStatusOverride: 'ready',
      ...extraProps,
    },
    global: { plugins: [pinia] },
  })
  await flushPromises()
  return wrapper
}

describe('manager calculator economics', () => {
  it('renders the printer cost, markup and client-inclusive total', async () => {
    const wrapper = await mountMinimal(managerPreview(), { showProductionDetails: true })
    const breakdown = wrapper.find('[data-calculator-role-breakdown]')
    expect(breakdown.exists()).toBe(true)

    const text = breakdown.text()
    expect(text).toContain('Your cost and markup')
    expect(text).toContain('+75% markup')
    expect(text).toContain('KSh 87.50')
    expect(text).toContain('KSh 17.50')
    expect(text).toContain('cost KSh 50.00')
    expect(text).toContain('+ KSh 37.50 markup')
    expect(text).toContain('KSh 45.00')
    expect(text).toContain('KSh 105.00')
    expect(text).toContain('KSh 120.00')

    // The manager keeps the buyer range on the panel and gains production
    // detail (GSM chips, configured-price count) from the same server preview.
    expect(wrapper.text()).toContain('KSh 4,000 – KSh 5,000')
    expect(wrapper.text()).toContain('2 configured prices')
    expect(wrapper.text()).toContain('250gsm')
  })

  it('does not show a buyer a role breakdown', async () => {
    const wrapper = await mountMinimal(buyerPreview)
    expect(wrapper.find('[data-calculator-role-breakdown]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('markup')
    expect(wrapper.text()).not.toContain('configured price')
  })
})

describe('printer calculator economics', () => {
  it('prices from production cost and shows raw lines plus payout', async () => {
    const wrapper = await mountMinimal(printerPreview(), { showProductionDetails: true })
    const text = wrapper.text()

    expect(text).toContain('KSh 60')
    expect(text).toContain('about KSh 0.60 per card')

    const breakdown = wrapper.find('[data-calculator-role-breakdown]')
    expect(breakdown.exists()).toBe(true)
    const breakdownText = breakdown.text()
    expect(breakdownText).toContain('Production cost')
    expect(breakdownText).toContain('KSh 50.00')
    expect(breakdownText).toContain('KSh 10.00')
    expect(breakdownText).toContain('Your payout')
    expect(breakdownText).toContain('KSh 54.00')

    // A printer never sees the buyer's range, speed cards or markup.
    expect(text).not.toContain('KSh 4,000')
    expect(text).not.toContain('Faster +50%')
    expect(breakdownText).not.toContain('markup')
    expect(breakdownText).not.toContain('Printy fee')
    expect(breakdownText).not.toContain('Client pays')
  })
})

describe('role breakdown component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('reconciles each manager line to production plus markup', async () => {
    const wrapper = await mountSuspended(DesignCalculatorRoleBreakdown, {
      props: { economics: MANAGER_ECONOMICS },
    })
    const rows = wrapper.findAll('li')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toContain('KSh 87.50')
    expect(rows[0]!.text()).toContain('cost KSh 50.00')
    expect(rows[1]!.text()).toContain('KSh 17.50')
    expect(rows[1]!.text()).toContain('cost KSh 10.00')
  })

  it('shows a printer raw production rates without any markup', async () => {
    const wrapper = await mountSuspended(DesignCalculatorRoleBreakdown, {
      props: { economics: PRINTER_ECONOMICS },
    })
    const text = wrapper.text()
    expect(text).toContain('@ KSh 6.25')
    expect(text).toContain('@ KSh 0.10')
    expect(text).toContain('KSh 60.00')
    expect(text).toContain('KSh 54.00')
    expect(text).not.toContain('markup')
  })
})
