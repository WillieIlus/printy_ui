import { describe, it, expect } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'
import { calculatorFixture } from './calculator-fixture'
import type { ServerCalculatorPreview } from '~/shared/types'

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

describe('calculator default surface', () => {
  it('shows Product, Quantity, Get Manager and a live price before More options', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(DesignCalculatorMinimal, {
      props: {
        authed: false,
        configOverride: calculatorFixture.config,
        specOverride: calculatorFixture.spec,
        previewOverride: preview,
        previewStatusOverride: 'ready',
        configStatusOverride: 'ready',
        defaultCollapsed: true,
      },
      global: { plugins: [pinia] },
    })
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Product')
    expect(text).toContain('Business cards')
    expect(text).toContain('Quantity')
    expect(text).toContain('Get Manager')
    expect(text).toContain('KSh 4,000')
    expect(text).toContain('More options')

    // Everything else is behind the explicit More options control.
    for (const label of ['Size', 'Quality', 'Colour', 'Sides', 'Speed']) {
      expect(text, `${label} should start collapsed`).not.toContain(label)
    }

    await wrapper.get('[data-test="calculator-more-options"]').trigger('click')
    await flushPromises()
    const expanded = wrapper.text()
    for (const label of ['Size', 'Colour', 'Sides', 'Speed']) {
      expect(expanded, `${label} should appear under More options`).toContain(label)
    }
  })
})
