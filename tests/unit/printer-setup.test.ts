import { describe, it, expect } from 'vitest'
import {
  firstMissingSetupStep,
  fromRateCard,
  setupMissingCodes,
  setupStepDone,
  toRateCardPayload,
  progressOf,
} from '~/utils/design/printer-setup'

const payload = {
  paper_rows: [
    {
      key: 'art-350', paper_name: 'Art Paper', gsm: 350, size: 'SRA3', paper_type: 'Matte',
      paper_base_price: '5.00', active: true, supports_double_side: true,
    },
  ],
  finishing_rows: [
    { key: 'cut', label: 'Cutting', unit: 'sheet', pricing_mode: 'per_sheet', price: '2.00', minimum_charge: '10.00', active: true },
  ],
  shop_details: { shop_name: 'Mwangaza Press', standard_turnaround_hours: 48 },
  master_settings: { single_print: '16.00', double_print: '25.00', surcharge: '10.00', surcharge_threshold_gsm: 250 },
  setup_status: { is_confirmed: false },
  version: '3',
}

describe('printer setup mapping', () => {
  it('maps the Django rate-card payload into the guided setup shape', () => {
    const bundle = fromRateCard(payload)
    expect(bundle.setup.shopName).toBe('Mwangaza Press')
    expect(bundle.setup.numbers.oneSidePrice).toBe(16)
    expect(bundle.setup.numbers.twoSideMode).toBe('price')
    expect(bundle.setup.papers[0].derived.total1s).toBe(31)
    expect(bundle.setup.papers[0].derived.total2s).toBe(40)
    expect(bundle.setup.services[0].exampleAmountLabel).toBe('KES 200')
    expect(bundle.progress.percent).toBeGreaterThan(0)
  })

  it('writes guided edits back to the rate-card payload shape', () => {
    const bundle = fromRateCard(payload)
    bundle.setup.papers[0].paperCost = 7
    bundle.setup.services[0].rate = 3
    const out = toRateCardPayload(bundle) as any
    expect(out.paper_rows[0].paper_base_price).toBe('7.00')
    expect(out.finishing_rows[0].price).toBe('3.00')
    expect(out.master_settings.single_print).toBe('16.00')
    expect(out.expected_version).toBe('3')
  })

  it('reports missing requirements until confirmed', () => {
    const bundle = fromRateCard({ ...payload, setup_status: { is_confirmed: true } })
    const progress = progressOf(bundle.setup)
    expect(progress.confirmed).toBe(true)
    expect(progress.percent).toBe(100)
  })
})

describe('progressive setup order', () => {
  const bundle = fromRateCard(payload)

  function status(missing: string[], overrides: Record<string, unknown> = {}) {
    return {
      has_shop: true,
      has_machines: !missing.includes('machine'),
      turnaround_configured: !missing.includes('standard_turnaround'),
      has_pricing: !missing.includes('paper') && !missing.includes('printing_rate'),
      shop_profile_complete: true,
      missing_steps: missing.map(code => ({ code, title: code, hint: code })),
      steps: ['machine', 'paper', 'printing_rate', 'standard_turnaround', 'confirm'].map(code => ({
        code,
        done: !missing.includes(code),
      })),
      ...overrides,
    }
  }

  it('starts at shop, then machine, then turnaround, then first prices', () => {
    expect(firstMissingSetupStep(status([], { shop_profile_complete: false }), bundle)).toBe(1)
    expect(firstMissingSetupStep(status(['machine']), bundle)).toBe(2)
    expect(firstMissingSetupStep(status(['standard_turnaround']), bundle)).toBe(3)
    expect(firstMissingSetupStep(status(['paper', 'printing_rate']), bundle)).toBe(4)
    expect(firstMissingSetupStep(status([]), bundle)).toBe(5)
  })

  it('marks each step done from the backend missing list', () => {
    const missingMachine = status(['machine'])
    expect(setupStepDone(missingMachine, 'shop', bundle)).toBe(true)
    expect(setupStepDone(missingMachine, 'machine', bundle)).toBe(false)
    expect(setupStepDone(missingMachine, 'turnaround', bundle)).toBe(true)

    const missingTurnaround = status(['standard_turnaround'])
    expect(setupStepDone(missingTurnaround, 'turnaround', bundle)).toBe(false)

    const missingPrices = status(['paper', 'printing_rate'])
    expect(setupStepDone(missingPrices, 'prices', bundle)).toBe(false)

    const confirmed = status([], { setup_status: { is_confirmed: true } })
    expect(setupStepDone(confirmed, 'confirm', bundle)).toBe(true)
  })

  it('reads the backend missing-step codes in their given order', () => {
    expect(setupMissingCodes(status(['machine', 'standard_turnaround']))).toEqual(['machine', 'standard_turnaround'])
  })
})
