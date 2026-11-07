import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminStore } from '~/stores/admin'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

const COUNTS = {
  users: 12,
  shops: 4,
  calculator_drafts: 30,
  quote_requests: 8,
  quotes: 5,
  managed_jobs: 3,
  job_assignments: 6,
  job_files: 9,
  payments: 2,
  notifications: 40,
}

describe('admin store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetchHome loads platform counts and analytics', async () => {
    apiMock.mockResolvedValue({ counts: COUNTS, analytics: { status: 'postponed', detail: 'later' } })
    const store = useAdminStore()

    await store.fetchHome()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/admin/')
    expect(store.counts.shops).toBe(4)
    expect(store.counts.users).toBe(12)
    expect(store.hasCounts).toBe(true)
    expect(store.analytics?.status).toBe('postponed')
  })

  it('merges partial counts over safe defaults', async () => {
    apiMock.mockResolvedValue({ counts: { users: 1 } })
    const store = useAdminStore()

    await store.fetchHome()

    expect(store.counts.users).toBe(1)
    expect(store.counts.shops).toBe(0)
    expect(store.counts.notifications).toBe(0)
  })

  it('records an error instead of throwing when loading fails', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useAdminStore()

    await store.fetchHome()

    expect(store.error).toContain("couldn't load")
    expect(store.hasCounts).toBe(false)
    expect(store.loading).toBe(false)
  })
})
