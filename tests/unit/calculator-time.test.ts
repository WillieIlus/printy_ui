import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CalculatorSpeedOptions from '~/components/design/calculator/CalculatorSpeedOptions.vue'
import CalculatorPricePanel from '~/components/design/calculator/CalculatorPricePanel.vue'
import type { SpeedPriceOption } from '~/shared/calculator-speed-pricing'

const options: SpeedPriceOption[] = [
  {
    key: 'standard',
    label: 'Standard',
    multiplier: 1,
    turnaroundHours: 48,
    range: { min: 4000, max: 5000 },
    text: 'KES 4,000 – KES 5,000',
  },
  {
    key: 'faster',
    label: 'Faster +50%',
    multiplier: 1.5,
    turnaroundHours: 24,
    range: { min: 6000, max: 7500 },
    text: 'KES 6,000 – KES 7,500',
  },
]

describe('calculator turnaround time', () => {
  it('shows the ready time on each visible speed card', async () => {
    const wrapper = await mountSuspended(CalculatorSpeedOptions, {
      props: { options, selected: 'standard' },
    })
    const labels = wrapper.findAll('[data-test="calculator-speed-turnaround"]')
    expect(labels).toHaveLength(2)
    expect(labels[0]?.text()).toContain('Ready in about 48h')
    expect(labels[1]?.text()).toContain('Ready in about 24h')
  })

  it('shows a turnaround fallback when no exact ready date is available', async () => {
    const wrapper = await mountSuspended(CalculatorPricePanel, {
      props: {
        priceText: 'KES 4,000 – KES 5,000',
        turnaroundText: 'Turnaround: confirmed with your quote',
      },
    })
    expect(wrapper.find('[data-test="calculator-turnaround"]').text()).toContain('confirmed with your quote')
  })

  it('wires the turnaround label into the shared price panel', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'app/components/design/calculator/DesignCalculatorMinimal.vue'),
      'utf8',
    )
    expect(source).toContain(':turnaround-text="earliestDelivery ? \'\' : turnaroundLabel"')
    expect(source).toContain('Turnaround: about')
    expect(source).toContain('Turnaround: confirmed with your quote')
  })
})
