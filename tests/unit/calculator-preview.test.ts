import { describe, it, expect } from 'vitest'
import {
  buildIntakeQuery,
  buildPublicPreviewPayload,
  isSpec,
  makeDefaultSpec,
  normalizeSpec,
  specPublicPayload,
  type CalculatorSpec,
} from '~/shared/calculator-spec'
import { calculatorFixture } from './calculator-fixture'

const { config, product, spec } = calculatorFixture

describe('calculator spec payload helpers', () => {
  it('buildPublicPreviewPayload returns null without a product_type', () => {
    expect(buildPublicPreviewPayload(null)).toBeNull()
    expect(buildPublicPreviewPayload({ quantity: 10 } as unknown as CalculatorSpec)).toBeNull()
    expect(buildPublicPreviewPayload(undefined)).toBeNull()
  })

  it('makeDefaultSpec applies backend defaults with coerced types', () => {
    const next = makeDefaultSpec(product, config)
    expect(next.product_type).toBe('business_card')
    expect(next.quantity).toBe(100)
    expect(next.finished_size).toBe('business_card_90x54')
    expect(next.print_sides).toBe('DUPLEX')
    expect(next.color_mode).toBe('COLOR')
    expect(next.requested_gsm).toBe(350)
  })

  it('makeDefaultSpec keeps previous values within the same product only', () => {
    const kept = makeDefaultSpec(product, config, { ...spec, quantity: 5000 })
    expect(kept.quantity).toBe(5000)

    const reset = makeDefaultSpec(product, config, { product_type: 'flyer', quantity: 22 } as unknown as CalculatorSpec)
    expect(reset.product_type).toBe('business_card')
    expect(reset.quantity).toBe(100)
  })

  it('flattens the public preview payload with only real choices', () => {
    const payload = buildPublicPreviewPayload(spec)!
    expect(payload.product_type).toBe('business_card')
    expect(payload.quantity).toBe(100)
    expect(payload.print_sides).toBe('DUPLEX')
    expect(payload.color_mode).toBe('COLOR')
    expect(payload.lamination).toBe('matt_lamination')
    expect(payload.requested_gsm).toBe(350)
  })

  it('drops unset and empty values (and custom size sentinels) from the payload', () => {
    const emptied: CalculatorSpec = {
      ...spec,
      finished_size: 'custom',
      width_mm: undefined,
      height_mm: undefined,
      lamination: undefined,
      corner_rounding: undefined,
    }
    const payload = specPublicPayload(emptied)
    expect(payload.finished_size).toBeUndefined()
    expect(payload.lamination).toBeUndefined()
    expect(payload.width_mm).toBeUndefined()
    expect(payload.product_type).toBe('business_card')
    expect(payload.quantity).toBe(100)
  })

  it('emits width/height only when a custom size carries dimensions', () => {
    const custom = normalizeSpec({ ...spec, finished_size: 'custom', width_mm: 80, height_mm: 40 }, product, config)
    const payload = buildPublicPreviewPayload(custom)!
    expect(payload.finished_size).toBeUndefined()
    expect(payload.width_mm).toBe(80)
    expect(payload.height_mm).toBe(40)
  })

  it('isSpec only accepts records with a product_type and numeric quantity', () => {
    expect(isSpec(spec)).toBe(true)
    expect(isSpec({ quantity: 10 })).toBe(false)
    expect(isSpec({ product_type: 'business_card' })).toBe(false)
    expect(isSpec(null)).toBe(false)
  })

  it('buildIntakeQuery reads size and paper real values from the spec', () => {
    const query = buildIntakeQuery(spec, config)
    expect(query.product_type).toBe('business_card')
    expect(query.quantity).toBe(100)
    expect(String(query.size)).toContain('x')
    expect(query.paper_gsm).toBe(350)
  })

  it('buildIntakeQuery keeps the requested gsm for custom sizes', () => {
    const query = buildIntakeQuery(
      { ...spec, finished_size: 'custom', width_mm: 1000, height_mm: 2000 },
      config,
    )
    expect(query.size).toBe('1000x2000mm')
    expect(query.paper_gsm).toBe(350)
  })
})