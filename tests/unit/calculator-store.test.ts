import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCalculatorStore } from '~/stores/calculator'
import { defaultInput } from '~/shared/workflow/pricing'

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

  it('starts with null input', () => {
    const store = useCalculatorStore()
    expect(store.input).toBeNull()
  })

  it('persist stores the input in state and localStorage', () => {
    const store = useCalculatorStore()
    const input = defaultInput('flyers')
    store.persist(input)
    expect(store.input).toStrictEqual(input)
    expect(localStorage.getItem('printy_calculator')).toBe(JSON.stringify(input))
  })

  it('restore reads a valid persisted input', () => {
    const input = defaultInput('booklets')
    localStorage.setItem('printy_calculator', JSON.stringify(input))
    const store = useCalculatorStore()
    expect(store.restore()).toEqual(input)
  })

  it('restore ignores malformed JSON', () => {
    localStorage.setItem('printy_calculator', '{not json')
    const store = useCalculatorStore()
    expect(store.restore()).toBeNull()
  })

  it('restore ignores invalid shapes (missing fields)', () => {
    localStorage.setItem('printy_calculator', JSON.stringify({ productId: 'flyers' }))
    const store = useCalculatorStore()
    expect(store.restore()).toBeNull()
  })

  it('restore rejects invalid enum values', () => {
    const bad = { ...defaultInput('flyers'), colorMode: 'NEON' }
    localStorage.setItem('printy_calculator', JSON.stringify(bad))
    const store = useCalculatorStore()
    expect(store.restore()).toBeNull()
  })

  it('clear removes state and storage', () => {
    const store = useCalculatorStore()
    store.persist(defaultInput('flyers'))
    store.clear()
    expect(store.input).toBeNull()
    expect(localStorage.getItem('printy_calculator')).toBeNull()
  })

  it('persist overwrites an earlier spec', () => {
    const store = useCalculatorStore()
    store.persist(defaultInput('flyers'))
    const second = defaultInput('business-cards')
    store.persist(second)
    expect(store.input?.productId).toBe('business-cards')
  })
})