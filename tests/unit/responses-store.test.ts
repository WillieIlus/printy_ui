import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClientResponsesStore } from '~/stores/responses'
import type { ClientQuoteResponse } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeResponse(overrides: Partial<ClientQuoteResponse> = {}): ClientQuoteResponse {
  return {
    id: 1,
    request_id: 42,
    price: '15000.00',
    currency: 'KES',
    turnaround_days: 3,
    turnaround_hours: null,
    status: 'sent',
    latest_message: 'Here is your quote.',
    unread_count: 1,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    ...overrides,
  }
}

describe('client responses store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetch loads a raw array', async () => {
    apiMock.mockResolvedValue([makeResponse(), makeResponse({ id: 2, status: 'accepted' })])
    const store = useClientResponsesStore()

    await store.fetch()

    expect(apiMock).toHaveBeenCalledWith('/client/responses/')
    expect(store.items).toHaveLength(2)
    expect(store.pending).toHaveLength(1)
  })

  it('fetch records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useClientResponsesStore()

    await store.fetch()

    expect(store.error).toContain("couldn't load")
    expect(store.items).toEqual([])
  })

  it('accept posts and flips status', async () => {
    apiMock.mockResolvedValue({ status: 'accepted' })
    const store = useClientResponsesStore()
    store.items = [makeResponse()]

    await store.accept(store.items[0]!)

    expect(apiMock).toHaveBeenCalledWith('/client/responses/1/accept/', { method: 'POST' })
    expect(store.items[0]!.status).toBe('accepted')
  })

  it('reject posts reason and flips status', async () => {
    apiMock.mockResolvedValue({ status: 'rejected' })
    const store = useClientResponsesStore()
    store.items = [makeResponse()]

    await store.reject(store.items[0]!, 'Too expensive')

    expect(apiMock).toHaveBeenCalledWith('/client/responses/1/reject/', {
      method: 'POST',
      body: { reason: 'Too expensive', message: '' },
    })
    expect(store.items[0]!.status).toBe('rejected')
  })

  it('reply posts the payload and updates the latest message', async () => {
    apiMock.mockResolvedValue({ id: 9 })
    const store = useClientResponsesStore()
    store.items = [makeResponse()]

    await store.reply(store.items[0]!, { message_type: 'client_counter_offer', message: 'Can you do 14000?' })

    expect(apiMock).toHaveBeenCalledWith('/client/responses/1/reply/', {
      method: 'POST',
      body: { message_type: 'client_counter_offer', message: 'Can you do 14000?' },
    })
    expect(store.items[0]!.latest_message).toBe('Can you do 14000?')
  })
})
