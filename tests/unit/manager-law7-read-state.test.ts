import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useManagerStore } from '~/stores/manager'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Record<string, unknown> = {}) {
  return {
    id: 7,
    reference: 'MJ-7',
    job_reference: 'MJ-7',
    quote_request_id: 1,
    quote_id: 2,
    title: 'A5 Flyers',
    status: 'in_production',
    payment_status: 'confirmed',
    assignment_status: 'unassigned',
    updated_at: '2026-09-16T10:00:00Z',
    artwork_uploaded: true,
    artwork_required: false,
    artwork_missing: false,
    can_dispatch: true,
    artwork_status_label: 'Artwork uploaded',
    artwork_reminder_sent: false,
    artwork_confirmation: { state: 'approved' },
    payment_confirmed: true,
    pricing: null,
    unread: true,
    ...overrides,
  }
}

function makeQuote(overrides: Record<string, unknown> = {}) {
  return {
    id: 11,
    reference: 'QR-11',
    quote_request_reference: 'REQ-11',
    product: 'A5 Flyers',
    status: 'pending',
    raw_status: 'pending',
    status_label: 'Pending',
    unread: true,
    ...overrides,
  }
}

describe('manager store read state — law 7.11', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('clears the unread marker on a job row when its detail is opened', async () => {
    apiMock.mockResolvedValueOnce({ role: 'partner', results: [makeJob()] })
    const store = useManagerStore()
    await store.fetchJobs()
    expect(store.jobs[0]!.unread).toBe(true)

    apiMock.mockResolvedValueOnce({
      role: 'partner',
      job: makeJob({ unread: false, viewer_read_at: '2026-09-16T11:00:00Z' }),
      settlement: null,
      canonical: null,
    })
    await store.fetchJob(7)

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/partner/jobs/7/')
    expect(store.jobs[0]!.unread).toBe(false)
    expect(store.jobs[0]!.viewer_read_at).toBe('2026-09-16T11:00:00Z')
  })

  it('clears the unread marker on a quote row when its detail is opened', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeQuote()] })
    const store = useManagerStore()
    await store.fetchQuotes()
    expect(store.quotes[0]!.unread).toBe(true)

    apiMock.mockResolvedValueOnce({ quote: makeQuote({ unread: false, viewer_read_at: '2026-09-16T12:00:00Z' }) })
    await store.fetchQuote(11)

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/partner/quotes/11/')
    expect(store.quotes[0]!.unread).toBe(false)
    expect(store.quotes[0]!.viewer_read_at).toBe('2026-09-16T12:00:00Z')
  })

  it('does not clear the unread marker when the detail request fails', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    const store = useManagerStore()
    await store.fetchJobs()

    apiMock.mockRejectedValueOnce(new Error('offline'))
    await store.fetchJob(7)

    expect(store.jobs[0]!.unread).toBe(true)
  })

  it('never changes the server attention/muted flags when clearing unread', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob({ needs_attention: true, muted: false })] })
    const store = useManagerStore()
    await store.fetchJobs()

    apiMock.mockResolvedValueOnce({
      role: 'partner',
      job: makeJob({ unread: false, needs_attention: true, muted: false }),
      settlement: null,
      canonical: null,
    })
    await store.fetchJob(7)

    expect(store.jobs[0]!.needs_attention).toBe(true)
    expect(store.jobs[0]!.muted).toBe(false)
    expect(store.jobs[0]!.unread).toBe(false)
  })
})
