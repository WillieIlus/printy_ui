import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { CalculatorConfig, CalculatorProductConfig } from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import type { ServerCalculatorPreview } from '~/shared/types'
import {
  CALCULATOR_TIER_MAP,
  applyCalculatorTier,
  calculatorTierChoices,
  selectedCalculatorTier,
} from '~/constants/design/calculator-tiers'
import { BUYER_SPEED_OPTIONS } from '~/constants/design/buyer-speed'
import { useCalculatorStore } from '~/stores/calculator'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'

/**
 * A realistic config using the ids the live API serves
 * (printy_api services/pricing/calculator_config.py), so a tier mapping that
 * invented an option would fail here.
 */
function fields(product: string): CalculatorProductConfig['fields'] {
  const quantity = { key: 'quantity', label: 'Quantity', type: 'number' as const, required: true }
  const gsm = { key: 'requested_gsm', label: 'Requested GSM', type: 'number' as const, required: false }

  if (product === 'business_card') {
    return [
      quantity,
      {
        key: 'requested_paper_category',
        label: 'Requested paper',
        type: 'select',
        required: false,
        options: ['artcard', 'matt', 'gloss', 'ivory'].map((value) => ({ value, label: value })),
      },
      gsm,
      {
        key: 'lamination',
        label: 'Lamination',
        type: 'select',
        required: false,
        options: ['none', 'gloss-lamination', 'matt-lamination'].map((value) => ({ value, label: value })),
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
    ]
  }

  if (product === 'flyer') {
    return [
      quantity,
      {
        key: 'requested_paper_category',
        label: 'Requested paper',
        type: 'select',
        required: false,
        options: ['matt', 'gloss', 'bond', 'ivory'].map((value) => ({ value, label: value })),
      },
      gsm,
      {
        key: 'folding',
        label: 'Folding',
        type: 'select',
        required: false,
        options: ['none', 'half-fold', 'tri-fold'].map((value) => ({ value, label: value })),
      },
      {
        key: 'lamination',
        label: 'Lamination',
        type: 'select',
        required: false,
        options: ['none', 'gloss-lamination', 'matt-lamination'].map((value) => ({ value, label: value })),
      },
    ]
  }

  if (product === 'booklet') {
    return [
      quantity,
      {
        key: 'requested_cover_paper_category',
        label: 'Requested cover paper',
        type: 'select',
        required: false,
        options: ['artcard', 'matt', 'ivory'].map((value) => ({ value, label: value })),
      },
      { key: 'requested_cover_gsm', label: 'Requested cover GSM', type: 'number', required: false },
      {
        key: 'cover_lamination',
        label: 'Cover lamination',
        type: 'select',
        required: false,
        options: ['none', 'front', 'both'].map((value) => ({ value, label: value })),
      },
      {
        key: 'binding_type',
        label: 'Binding',
        type: 'select',
        required: false,
        options: ['saddle_stitch', 'perfect_bind', 'wire_o'].map((value) => ({ value, label: value })),
      },
    ]
  }

  return [
    quantity,
    {
      key: 'requested_paper_category',
      label: 'Requested paper',
      type: 'select',
      required: false,
      options: [{ value: 'tictac', label: 'tictac' }],
    },
    {
      key: 'lamination',
      label: 'Lamination',
      type: 'select',
      required: false,
      options: [{ value: 'none', label: 'none' }],
    },
  ]
}

function product(key: string, overrides: Partial<CalculatorProductConfig> = {}): CalculatorProductConfig {
  const categories: Record<string, string[]> = {
    business_card: ['artcard', 'matt', 'gloss', 'ivory'],
    flyer: ['matt', 'gloss', 'bond', 'ivory'],
    booklet: ['artcard', 'matt', 'ivory'],
    label_sticker: ['tictac', 'special'],
  }
  return {
    key,
    label: key,
    required_fields: ['quantity'],
    optional_fields: [],
    defaults: { quantity: 100 },
    allowed_paper_categories: categories[key] ?? [],
    allowed_cover_categories: categories[key] ?? [],
    allow_custom_size: false,
    allow_custom_paper_request: true,
    sizes: [{ value: '85x55mm', label: '85 × 55 mm', width_mm: 85, height_mm: 55 }],
    fields: fields(key),
    ...overrides,
  }
}

const config: CalculatorConfig = {
  products: [
    product('business_card'),
    product('flyer'),
    product('booklet'),
    product('label_sticker'),
  ],
  paper_categories: [],
  finishings: [],
  sizes: {},
  print_sides: [
    { value: 'SIMPLEX', label: 'Single sided' },
    { value: 'DUPLEX', label: 'Double sided' },
  ],
  color_modes: [{ value: 'COLOR', label: 'Full colour' }],
}

function byKey(key: string): CalculatorProductConfig {
  return config.products.find((candidate) => candidate.key === key)!
}

const businessCardSpec: CalculatorSpec = {
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

const ManagersStub = defineComponent({
  name: 'DesignRecommendedManagers',
  props: {
    speedId: { type: String, default: '' },
    speedLabel: { type: String, default: '' },
    totalLabel: { type: String, default: '' },
    perPieceLabel: { type: String, default: '' },
    payload: { type: Object, default: null },
    turnaroundHours: { type: Number, default: null },
  },
  template: '<div data-stub="recommended-managers" />',
})

const preview: ServerCalculatorPreview = {
  can_calculate: true,
  product_type: 'business_card',
  price_mode: 'market',
  matches_count: 2,
  display_price_text: 'KSh 4,500',
  display_mode: 'range',
  confidence_label: 'High',
  source_label: 'network',
  market_range: { min: 4000, max: 5000, median: 4500, currency: 'KES', label: 'Network range', confidence: 'high' },
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

describe('calculator quality tiers', () => {
  it('offers Standard, Premium and Executive for business cards', () => {
    const choices = calculatorTierChoices(byKey('business_card'), config)
    expect(choices.map((choice) => choice.id)).toEqual(['standard', 'premium', 'executive'])
    expect(choices.map((choice) => choice.label)).toEqual(['Standard', 'Premium', 'Executive'])
  })

  it('offers the design buyer speed ramp (Standard / Faster +50% / Fastest +100%)', () => {
    expect(BUYER_SPEED_OPTIONS.map((option) => option.id)).toEqual(['standard', 'faster', 'fastest'])
    expect(BUYER_SPEED_OPTIONS.map((option) => option.label)).toEqual(['Standard', 'Faster +50%', 'Fastest +100%'])
    expect(BUYER_SPEED_OPTIONS.map((option) => option.multiplier)).toEqual([1, 1.5, 2])
  })

  it('maps every tier onto option ids the product actually offers', () => {
    for (const key of ['business_card', 'flyer', 'booklet']) {
      const current = byKey(key)
      for (const choice of calculatorTierChoices(current, config)) {
        for (const [fieldKey, value] of Object.entries(choice.patch)) {
          const field = current.fields.find((candidate) => candidate.key === fieldKey)
          expect(field, `${key}.${fieldKey}`).toBeTruthy()
          if (typeof value === 'boolean') {
            expect(field!.type).toBe('boolean')
          } else if (field!.type === 'select') {
            const offered = (field!.options ?? []).map((option) => String(option.value))
            expect(offered, `${key}.${fieldKey}=${value}`).toContain(String(value))
          }
        }
      }
    }
  })

  it('uses plain-language hints with no stock, gsm or finishing words', () => {
    const choices = calculatorTierChoices(byKey('business_card'), config)
    for (const choice of choices) {
      expect(choice.hint).not.toMatch(/artcard|matt|ivory|gloss|lamination|gsm|saddle|bind/i)
    }
  })

  it('maps flyers and booklet covers onto their real fields', () => {
    const flyer = calculatorTierChoices(byKey('flyer'), config)
    expect(flyer).toHaveLength(3)
    expect(flyer[2]?.patch).toMatchObject({ requested_paper_category: 'gloss', folding: 'tri-fold' })

    const booklet = calculatorTierChoices(byKey('booklet'), config)
    expect(booklet).toHaveLength(3)
    expect(booklet[0]?.patch).toMatchObject({
      requested_cover_paper_category: 'artcard',
      binding_type: 'saddle_stitch',
      cover_lamination: 'none',
    })
    expect(booklet[2]?.patch).toMatchObject({ binding_type: 'perfect_bind', cover_lamination: 'both' })
  })

  it('shows no tier for a product without a mapping', () => {
    expect(calculatorTierChoices(byKey('label_sticker'), config)).toEqual([])
    expect(CALCULATOR_TIER_MAP.label_sticker).toBeUndefined()
    expect(calculatorTierChoices(null, config)).toEqual([])
  })

  it('hides a tier when its finishing is missing from the product', () => {
    const noLamination = product('business_card', {
      fields: fields('business_card').filter((field) => field.key !== 'lamination'),
    })
    expect(calculatorTierChoices(noLamination, config)).toEqual([])

    const noRounding = product('business_card', {
      fields: fields('business_card').filter((field) => field.key !== 'corner_rounding'),
    })
    expect(calculatorTierChoices(noRounding, config).map((choice) => choice.id)).toEqual([
      'standard',
      'premium',
    ])
  })

  it('hides tiers whose stock the product no longer allows', () => {
    const noGloss = product('flyer', {
      allowed_paper_categories: ['matt', 'bond', 'ivory'],
      fields: fields('flyer').map((field) =>
        field.key === 'requested_paper_category'
          ? { ...field, options: (field.options ?? []).filter((option) => option.value !== 'gloss') }
          : field,
      ),
    })
    expect(calculatorTierChoices(noGloss, config).map((choice) => choice.id)).toEqual([
      'standard',
    ])
  })

  it('recognises the tier a spec already matches and ignores a foreign stock', () => {
    const choices = calculatorTierChoices(byKey('business_card'), config)
    expect(selectedCalculatorTier(choices, businessCardSpec)?.id).toBe('standard')
    expect(
      selectedCalculatorTier(choices, { ...businessCardSpec, requested_paper_category: 'gloss' }),
    ).toBeNull()
    expect(selectedCalculatorTier(choices, null)).toBeNull()
  })

  it('applies a tier without mutating the current spec', () => {
    const choices = calculatorTierChoices(byKey('business_card'), config)
    const premium = choices.find((choice) => choice.id === 'premium')!
    const next = applyCalculatorTier(businessCardSpec, premium)
    expect(next).toMatchObject({
      requested_paper_category: 'matt',
      requested_gsm: 300,
      lamination: 'matt-lamination',
      corner_rounding: false,
    })
    expect(businessCardSpec.requested_paper_category).toBe('matt')
  })
})

describe('minimal layout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  async function mountMinimal(
    extraProps: Record<string, unknown> = {},
    stubs: Record<string, unknown> = {},
  ) {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(DesignCalculatorMinimal, {
      props: {
        authed: true,
        configOverride: config,
        specOverride: businessCardSpec,
        previewOverride: preview,
        previewStatusOverride: 'ready',
        configStatusOverride: 'ready',
        ...extraProps,
      },
      global: { plugins: [pinia], stubs },
    })
    await flushPromises()
    return { wrapper, pinia }
  }

  it('renders the shared buyer workflow cards without technical vocabulary', async () => {
    const { wrapper } = await mountMinimal()
    const text = wrapper.text()

    for (const label of ['Product', 'Quantity', 'Size', 'Quality', 'Colour', 'Sides', 'Speed']) {
      expect(text, label).toContain(label)
    }
    expect(text).toContain('Standard')
    expect(text).toContain('Premium')
    expect(text).toContain('Executive')
    expect(text).toContain('Everyday quality')
    expect(text).toContain('KSh 4,000 – KSh 5,000')
    expect(text).toContain('Faster +50%')
    expect(text).toContain('Fastest +100%')

    for (const forbidden of [
      'artcard',
      'Art card',
      'matt',
      'Matt lamination',
      'matt-lamination',
      'ivory',
      'Ivory',
      'gloss',
      'GSM',
      'gsm',
      '250',
      '300',
      '350',
      'lamination',
      'corner rounding',
      'saddle',
      'perfect bind',
      'sheets',
      'Imposition',
      'imposition',
      'Verified Print Partner',
      'breakdown',
      'fee',
    ]) {
      expect(text, `minimal card must not show "${forbidden}"`).not.toContain(forbidden)
    }

    expect(wrapper.findAll('[data-design-calculator-minimal]')).toHaveLength(1)
    expect(wrapper.find('[data-design-calculator-detailed]').exists()).toBe(false)
    expect(wrapper.find('[data-design-calculator-options]').exists()).toBe(false)
  })

  it('shows the summary range, rebased by each server speed multiplier', async () => {
    const { wrapper } = await mountMinimal()
    const text = wrapper.text()

    // The summary is KSh 4,000 – KSh 5,000 and every speed card keeps that
    // same base range, scaled by the server's own tier multiplier.
    expect(text).toContain('KSh 4,000 – KSh 5,000')
    expect(text).toContain('KSh 6,000 – KSh 7,500')
    expect(text).toContain('KSh 8,000 – KSh 10,000')
  })

  it('writes the real stock and finishing into the shared calculator store', async () => {
    const { wrapper, pinia } = await mountMinimal()
    const store = useCalculatorStore(pinia)

    const premiumButton = wrapper.findAll('button').find((button) => button.text() === 'Premium')
    expect(premiumButton).toBeTruthy()
    await premiumButton!.trigger('click')
    await flushPromises()

    expect(store.spec).toMatchObject({
      requested_paper_category: 'matt',
      requested_gsm: 300,
      lamination: 'matt-lamination',
      corner_rounding: false,
    })
  })

  it('lets every viewer choose a custom width and length', async () => {
    const { wrapper, pinia } = await mountMinimal({ specOverride: null })
    const store = useCalculatorStore(pinia)
    store.setSpec({ ...businessCardSpec })
    await flushPromises()

    const customButton = wrapper.findAll('button').find((button) => button.text() === 'Custom')
    expect(customButton).toBeTruthy()
    await customButton!.trigger('click')
    await flushPromises()

    expect(store.spec).toMatchObject({
      finished_size: 'custom',
      width_mm: 85,
      height_mm: 55,
    })

    const width = wrapper.find('input[aria-label="Custom width in millimetres"]')
    const length = wrapper.find('input[aria-label="Custom length in millimetres"]')
    expect(width.exists()).toBe(true)
    expect(length.exists()).toBe(true)

    await width.setValue('90')
    await length.setValue('60')
    await flushPromises()

    expect(store.spec).toMatchObject({
      finished_size: 'custom',
      width_mm: 90,
      height_mm: 60,
    })
  })

  it('shows production GSM, finishing and configured-price detail to managers', async () => {
    const { wrapper } = await mountMinimal({ showProductionDetails: true })
    const text = wrapper.text()

    expect(text).toContain('250gsm')
    expect(text).toContain('300gsm')
    expect(text).toContain('350gsm')
    expect(text).toContain('Stock: matt · 250gsm')
    expect(text).toContain('2 configured prices')
    expect(text).toContain('Finishing')
    expect(text).toContain('Lamination')
    expect(text).toContain('Corner rounding')
    expect(text).toContain('gloss-lamination')
    expect(text).toContain('matt-lamination')
  })

  it('reveals managers from Get my exact quote instead of leaving the page', async () => {
    const { wrapper } = await mountMinimal(
      { authed: false },
      { DesignRecommendedManagers: ManagersStub },
    )

    expect(wrapper.find('[data-stub="recommended-managers"]').exists()).toBe(false)

    const cta = wrapper.findAll('button').find((button) =>
      button.text().includes('Get my exact quote'),
    )
    expect(cta).toBeTruthy()
    await cta!.trigger('click')
    await flushPromises()

    const managers = wrapper.findComponent({ name: 'DesignRecommendedManagers' })
    expect(managers.exists()).toBe(true)
    expect(managers.props('speedId')).toBe('standard')
    expect(managers.props('payload')).toMatchObject({
      product_type: 'business_card',
      quantity: 100,
      requested_paper_category: 'matt',
      requested_gsm: 250,
    })
  })

  it('shows no QUALITY row when the product has no available tier', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const stickerSpec: CalculatorSpec = {
      product_type: 'label_sticker',
      quantity: 100,
      color_mode: 'COLOR',
      requested_paper_category: 'tictac',
    }
    const wrapper = await mountSuspended(DesignCalculatorMinimal, {
      props: {
        authed: true,
        configOverride: config,
        specOverride: stickerSpec,
        previewOverride: null,
        previewStatusOverride: 'idle',
        configStatusOverride: 'ready',
      },
      global: { plugins: [pinia] },
    })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Quality')
    expect(wrapper.text()).not.toContain('Executive')
  })
})
