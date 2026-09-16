import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMpesaStore, MPESA_POLL_INTERVAL_MS, MPESA_MAX_CONSECUTIVE_POLL_ERRORS } from '~/stores/mpesa'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function payment(status: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 9,
    status,
    is_terminal: status !== 'initiated' && status !== 'pending',
    is_paid: status === 'paid',
    mpesa_receipt_number: '',
    result_desc: '',
    ...overrides,
  }
}

function pendingStore() {
  const store = useMpesaStore()
  store.paymentId = 9
  store.phase = 'pending'
  return store
}

describe('mpesa checkout store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
    vi.useRealTimers()
  })

  it('starts at rest (phone entry)', () => {
    const store = useMpesaStore()
    expect(store.phase).toBeNull()
    expect(store.paymentId).toBeNull()
    expect(store.receipt).toBe('')
    expect(store.seconds).toBe(0)
    expect(store.errorMessage).toBe('')
    expect(store.polling).toBe(false)
  })

  it('initiate posts to the real stk-push endpoint and waits for the callback', async () => {
    apiMock.mockResolvedValueOnce(payment('pending'))
    const store = useMpesaStore()

    await store.initiate('254712345678', 1250)

    expect(apiMock).toHaveBeenCalledWith('/payments/mpesa/stk-push/', {
      method: 'POST',
      body: { phone_number: '254712345678', amount: 1250 },
    })
    expect(store.paymentId).toBe(9)
    expect(store.phase).toBe('pending')
    expect(store.errorMessage).toBe('')
  })

  it('initiate does not pass a managed_job_id for demo jobs', async () => {
    apiMock.mockResolvedValueOnce(payment('pending'))
    const store = useMpesaStore()

    await store.initiate('254712345678', 1250)

    const [, options] = apiMock.mock.calls[0] as [string, { body: Record<string, unknown> }]
    expect(options.body).not.toHaveProperty('managed_job_id')
  })

  it('initiate that cannot reach M-Pesa surfaces an error distinct from a declined payment', async () => {
    apiMock.mockRejectedValue(new Error('network down'))
    const store = useMpesaStore()

    await store.initiate('254712345678', 1250)

    expect(store.phase).toBe('error')
    expect(store.errorMessage).toContain("couldn't reach M-Pesa")
    expect(store.paymentId).toBeNull()
  })

  it('an already-confirmed initiate response renders as paid with a receipt', async () => {
    apiMock.mockResolvedValueOnce(payment('paid', { mpesa_receipt_number: 'SJG7K3M9Y2', is_paid: true }))
    const store = useMpesaStore()

    await store.initiate('254712345678', 1250)

    expect(store.phase).toBe('paid')
    expect(store.receipt).toBe('SJG7K3M9Y2')
    expect(store.polling).toBe(false)
  })

  it.each([
    ['paid', 'SJG7K3M9Y2'],
    ['failed', ''],
    ['cancelled', ''],
    ['needs_review', ''],
  ])('poll maps backend status %s to the right checkout state', async (status, receipt) => {
    apiMock.mockResolvedValueOnce(
      payment(status as string, receipt ? { mpesa_receipt_number: receipt, is_paid: status === 'paid' } : {}),
    )
    const store = pendingStore()

    await store.poll()

    expect(store.phase).toBe(status)
    expect(apiMock).toHaveBeenCalledWith('/payments/mpesa/9/', {})
    if (receipt) {
      expect(store.receipt).toBe(receipt)
    }
  })

  it('poll keeps waiting while the backend still says pending/initiated', async () => {
    apiMock.mockResolvedValueOnce(payment('pending'))
    const store = pendingStore()

    await store.poll()

    expect(store.phase).toBe('pending')
    expect(store.consecutivePollErrors).toBe(0)
  })

  it('a single lost poll does not fail the payment', async () => {
    apiMock.mockRejectedValue(new Error('transient'))
    const store = pendingStore()

    await store.poll()

    expect(store.phase).toBe('pending')
    expect(store.consecutivePollErrors).toBe(1)
  })

  it('repeated lost polls give up and surface an error', async () => {
    apiMock.mockRejectedValue(new Error('offline'))
    const store = pendingStore()

    for (let i = 0; i < MPESA_MAX_CONSECUTIVE_POLL_ERRORS; i += 1) {
      await store.poll()
    }

    expect(store.phase).toBe('error')
    expect(store.polling).toBe(false)
    expect(store.consecutivePollErrors).toBe(MPESA_MAX_CONSECUTIVE_POLL_ERRORS)
  })

  it('reset returns the checkout to the phone-entry screen', async () => {
    apiMock.mockResolvedValueOnce(
      payment('paid', { mpesa_receipt_number: 'SJG7K3M9Y2', is_paid: true }),
    )
    const store = useMpesaStore()
    await store.initiate('254712345678', 1250)
    store.seconds = 42

    store.reset()

    expect(store.phase).toBeNull()
    expect(store.paymentId).toBeNull()
    expect(store.receipt).toBe('')
    expect(store.seconds).toBe(0)
    expect(store.errorMessage).toBe('')
  })

  it('the waiting ticker counts elapsed seconds', async () => {
    vi.useFakeTimers()
    const store = useMpesaStore()

    store.startTicker()
    await vi.advanceTimersByTimeAsync(3000)

    expect(store.seconds).toBe(3)
    store.stopTicker()
    vi.useRealTimers()
  })

  it('polling flips to paid live when the real callback lands', async () => {
    vi.useFakeTimers()
    apiMock.mockResolvedValueOnce(payment('pending'))
    const store = useMpesaStore()
    await store.initiate('254712345678', 1250)

    store.startPolling()
    apiMock.mockResolvedValueOnce(payment('paid', { mpesa_receipt_number: 'SJG7K3M9Y2', is_paid: true }))
    await vi.advanceTimersByTimeAsync(MPESA_POLL_INTERVAL_MS)

    expect(store.phase).toBe('paid')
    expect(store.receipt).toBe('SJG7K3M9Y2')
    expect(store.polling).toBe(false)
    vi.useRealTimers()
  })
})