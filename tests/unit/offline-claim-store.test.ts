import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOfflineClaimStore } from '~/stores/offline-claim'
import type { OfflineQuoteClaimResult } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

describe('offline claim store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('claims a quote and stores the result', async () => {
    const result: OfflineQuoteClaimResult = { quote_request_id: 42, quote_id: 7, claimed: true }
    apiMock.mockResolvedValue(result)
    const store = useOfflineClaimStore()

    await store.claim('tok_123')

    expect(apiMock).toHaveBeenCalledWith('/quotes/offline-claim/', {
      method: 'POST',
      body: { claim_token: 'tok_123' },
    })
    expect(store.claimed).toBe(true)
    expect(store.result?.quote_id).toBe(7)
    expect(store.claiming).toBe(false)
  })

  it('rethrows a failed claim and clears the claiming flag', async () => {
    apiMock.mockRejectedValue(new Error('not found'))
    const store = useOfflineClaimStore()

    await expect(store.claim('bad')).rejects.toThrow()
    expect(store.claimed).toBe(false)
    expect(store.claiming).toBe(false)
  })

  it('reset clears the result', async () => {
    apiMock.mockResolvedValue({ quote_request_id: 1, quote_id: null, claimed: true })
    const store = useOfflineClaimStore()
    await store.claim('tok')
    store.reset()
    expect(store.result).toBeNull()
    expect(store.claimed).toBe(false)
  })
})
