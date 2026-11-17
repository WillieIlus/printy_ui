import { describe, it, expect } from 'vitest'
import { fromRateCard, toRateCardPayload, progressOf } from '~/utils/design/printer-setup'

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
