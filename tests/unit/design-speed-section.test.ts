import { describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { CalculatorConfig } from '~/shared/calculator-config'
import type { ServerCalculatorPreview } from '~/shared/types'
import { API } from '~/shared/api-paths'

const { api } = vi.hoisted(() => ({ api: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api }),
}))

import DesignSpeedSection from '~/components/design/marketing/SpeedSection.vue'

const config: CalculatorConfig = {
  products: [
    {
      key: 'business_card',
      label: 'Business Cards',
      required_fields: ['quantity'],
      optional_fields: [],
      defaults: {
        quantity: 100,
        finished_size: '90x55mm',
        print_sides: 'DUPLEX',
        color_mode: 'COLOR',
      },
      allowed_paper_categories: [],
      allowed_cover_categories: [],
      allow_custom_size: false,
      allow_custom_paper_request: false,
      sizes: [],
      fields: [],
    },
  ],
  paper_categories: [],
  finishings: [],
  sizes: {},
  print_sides: [],
  color_modes: [],
}

const pricedPreview: ServerCalculatorPreview = {
  can_calculate: true,
  product_type: 'business_card',
  price_mode: 'market',
  matches_count: 3,
  display_price_text: 'KSh 4,320',
  display_mode: 'range',
  confidence_label: 'configured',
  source_label: 'Estimated from market median',
  market_range: { min: 4320, max: 4320, median: 4320, currency: 'KES', label: 'KSh 4,320', confidence: 'configured' },
  speed_options: [
    { key: 'standard', label: 'Standard', multiplier: '1.00', total: '4320.00', turnaround_hours: null },
    { key: 'faster', label: 'Faster +50%', multiplier: '1.50', total: '6480.00', turnaround_hours: null },
    { key: 'fastest', label: 'Fastest +100%', multiplier: '2.00', total: '8640.00', turnaround_hours: null },
  ],
  missing_fields: [],
  summary: null,
  warnings: [],
  suggestions: [],
  exact_or_estimated: true,
}

describe('marketing speed section', () => {
  it('renders all three speed choices with the totals the server priced', async () => {
    api.mockImplementation((path: string) => {
      if (path === API.calculator.config) return Promise.resolve(config)
      if (path === API.calculator.publicPreview) return Promise.resolve(pricedPreview)
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountSuspended(DesignSpeedSection, { props: { ctaHref: '/quote' } })
    await flushPromises()
    const text = wrapper.text()

    expect(text).toContain('Standard')
    expect(text).toContain('Faster +50%')
    expect(text).toContain('Fastest +100%')
    expect(text).toContain('KSh 4,320')
    expect(text).toContain('KSh 6,480')
    expect(text).toContain('KSh 8,640')
    expect(text).toContain('Business Cards · 100 units')
  })

  it('falls back to the CTA only when live pricing is unavailable', async () => {
    api.mockRejectedValue(new Error('pricing offline'))

    const wrapper = await mountSuspended(DesignSpeedSection, { props: { ctaHref: '/quote' } })
    await flushPromises()

    expect(wrapper.text()).not.toContain('KSh')
    expect(wrapper.text()).toContain('Get my exact quote')
  })
})
