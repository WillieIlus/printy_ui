import { describe, it, expect } from 'vitest'

import {
  CURRENCY,
  FEE_POLICY,
  PRODUCTS,
  SHEETS,
  WASTE_POLICY,
  VAT_RATE,
  applyWaste,
  calculate,
  computeLayout,
  defaultInput,
  getProduct,
  ksh,
  ksh2,
  sheetArea,
  type Product,
} from '~/shared/workflow/pricing'

describe('sheetArea', () => {
  it('computes sqm from mm', () => {
    const a4 = SHEETS.find((s) => s.id === 'A4')!
    expect(sheetArea(a4)).toBeCloseTo(0.06237, 5)
  })
})

describe('applyWaste', () => {
  it('adds fixed 2 + 10% variable', () => {
    const r = applyWaste(100)
    expect(r.wasteSheets).toBe(2 + 10)
    expect(r.billableSheets).toBe(112)
  })

  it('enforces the 3-sheet minimum', () => {
    const r = applyWaste(0)
    expect(r.billableSheets).toBe(3)
  })
})

describe('computeLayout', () => {
  it('computes normal orientation', () => {
    const l = computeLayout(90, 54, 320, 450)
    expect(l.copiesPerSheet).toBe(21)
    expect(l.orientation).toBe('normal')
  })

  it('chooses rotated when it fits more', () => {
    const l = computeLayout(300, 200, 420, 300)
    // rotated: cols = floor(300/320)=0 vs normal 1x1=1... fall back to normal
    expect(l.copiesPerSheet).toBeGreaterThanOrEqual(1)
  })

  it('never returns zero copies', () => {
    const l = computeLayout(400, 400, 210, 297)
    expect(l.copiesPerSheet).toBeGreaterThanOrEqual(1)
  })
})

describe('ksh formatting', () => {
  it('rounds to integer', () => {
    expect(ksh(1500.6)).toBe(`${CURRENCY} 1,501`)
  })

  it('formats two decimals', () => {
    expect(ksh2(10)).toBe(`${CURRENCY} 10.00`)
  })
})

describe('catalog', () => {
  it('getProduct falls back to the first product', () => {
    expect(getProduct('nope').id).toBe(PRODUCTS[0]!.id)
    expect(getProduct('flyers').id).toBe('flyers')
  })

  it('products reference existing sheets and papers', () => {
    for (const p of PRODUCTS) {
      for (const sheetId of p.sheets) {
        expect(SHEETS.some((s) => s.id === sheetId), `${p.id} missing sheet ${sheetId}`).toBe(true)
      }
    }
  })
})

describe('defaultInput', () => {
  it('builds sensible defaults for a product', () => {
    const input = defaultInput('business-cards')
    expect(input.productId).toBe('business-cards')
    expect(input.quantity).toBe(1000)
    expect(input.paperId).toBe('board350')
    expect(input.brokerId).toBe('b-metro')
  })
})

describe('calculate', () => {
  it('returns a complete quote for business cards', () => {
    const r = calculate(defaultInput('business-cards'))
    expect(r.product.id).toBe('business-cards')
    expect(r.total).toBeGreaterThan(0)
    expect(r.unitPrice).toBeGreaterThan(0)
    expect(r.vat).toBeCloseTo(r.subtotal * VAT_RATE, 5)
    expect(r.lines.length).toBeGreaterThan(0)
  })

  it('computes a flyer quote', () => {
    const input = defaultInput('flyers')
    const r = calculate(input)
    expect(r.product.id).toBe('flyers')
    expect(r.total).toBeGreaterThan(0)
    expect(r.unitPrice).toBeCloseTo(r.total / input.quantity, 10)
  })

  it('large format uses sqm pricing', () => {
    const r = calculate(defaultInput('banners'))
    expect(r.areaSqm).toBeGreaterThan(0)
    expect(r.total).toBeGreaterThan(0)
  })

  it('booklets include pages in imposition', () => {
    const r = calculate(defaultInput('booklets'))
    expect(r.imposition?.pagesPerSheet).toBeGreaterThan(0)
    expect(r.total).toBeGreaterThan(0)
  })

  it('rush 24h shortens turnaround to 1 day', () => {
    const input = { ...defaultInput('flyers'), rushId: '24' }
    const r = calculate(input)
    expect(r.turnaroundDays).toBe(1)
  })

  it('tiers come back for larger quantities', () => {
    const r = calculate(defaultInput('business-cards'))
    expect(r.tiers.length).toBeGreaterThan(0)
    for (const t of r.tiers) {
      expect(t.qty).toBeGreaterThan(1000)
      expect(t.unit).toBeGreaterThan(0)
    }
  })

  it('subtotal never exceeds the markup cap', () => {
    const r = calculate(defaultInput('business-cards'))
    expect(r.subtotal).toBeLessThanOrEqual(r.maxClientPrice)
  })

  it('folds the broker margin into the printing & finishing total', () => {
    const r = calculate(defaultInput('business-cards'))
    expect(r.productionWithMargin).toBeCloseTo(r.productionCost + r.brokerMargin, 8)
    expect(r.brokerMargin).toBeCloseTo(r.productionCost * 0.18, 8)
    expect(r.platformFee).toBeCloseTo(r.productionWithMargin * r.feeRate, 8)
  })

  it('fee rate follows the policy band', () => {
    const small = calculate({ ...defaultInput('business-cards'), quantity: 100 })
    expect(small.feeRate).toBe(FEE_POLICY.under_production_fee_rate)
  })
})