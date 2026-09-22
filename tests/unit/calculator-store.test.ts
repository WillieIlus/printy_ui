import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import { calculatorFixture } from './calculator-fixture'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    publicApiNoAuth: vi.fn(),
    publicApi: vi.fn(),
    api: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

describe('calculator store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    window.localStorage.clear()
  })

  it('starts with a null spec', () => {
    const store = useCalculatorStore()
    expect(store.spec).toBeNull()
  })

  it('setProduct builds the spec from backend defaults', () => {
    const store = useCalculatorStore()
    store.config = calculatorFixture.config
    store.setProduct('business_card')
    expect(store.spec).toMatchObject({
      product_type: 'business_card',
      quantity: 100,
      print_sides: 'DUPLEX',
      color_mode: 'COLOR',
      requested_gsm: 350,
    })
    expect(localStorage.getItem('printy_calculator')).toBeTruthy()
  })

  it('setProduct keeps previous choices within the same product', () => {
    const store = useCalculatorStore()
    store.config = calculatorFixture.config
    store.setProduct('business_card', { ...calculatorFixture.spec, quantity: 5000 })
    expect(store.spec?.quantity).toBe(5000)
  })

  it('persist stores the spec in state and localStorage', () => {
    const store = useCalculatorStore()
    store.persist(calculatorFixture.spec)
    expect(store.spec).toStrictEqual(calculatorFixture.spec)
    expect(localStorage.getItem('printy_calculator')).toBe(JSON.stringify(calculatorFixture.spec))
  })

  it('restore reads a valid persisted spec', () => {
    localStorage.setItem('printy_calculator', JSON.stringify(calculatorFixture.spec))
    const store = useCalculatorStore()
    expect(store.restore()).toEqual(calculatorFixture.spec)
  })

  it('restore ignores malformed JSON', () => {
    localStorage.setItem('printy_calculator', '{not json')
    const store = useCalculatorStore()
    expect(store.restore()).toBeNull()
  })

  it('restore ignores invalid shapes (missing quantity)', () => {
    localStorage.setItem('printy_calculator', JSON.stringify({ product_type: 'business_card' }))
    const store = useCalculatorStore()
    expect(store.restore()).toBeNull()
  })

  it('clear removes state and storage', () => {
    const store = useCalculatorStore()
    store.persist(calculatorFixture.spec)
    store.clear()
    expect(store.spec).toBeNull()
    expect(localStorage.getItem('printy_calculator')).toBeNull()
  })

  it('persist overwrites an earlier spec', () => {
    const store = useCalculatorStore()
    store.persist(calculatorFixture.spec)
    store.persist({ ...calculatorFixture.spec, quantity: 2500 })
    expect(store.spec?.quantity).toBe(2500)
  })

  it('adoptSpec re-normalizes a server snapshot against the product', () => {
    const store = useCalculatorStore()
    store.config = calculatorFixture.config
    const restored = store.adoptSpec(
      { ...calculatorFixture.spec, quantity: '200', color_mode: 'BWF' } as unknown as CalculatorSpec,
      'business_card',
    )
    expect(restored.quantity).toBe(200)
    expect(restored.color_mode).toBe('BWF')
  })
})