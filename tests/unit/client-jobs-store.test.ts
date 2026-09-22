import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClientJobsStore } from '~/stores/client-jobs'
import type { ClientJobRecord } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Partial<ClientJobRecord> = {}): ClientJobRecord {
  return {
    id: 3,
    reference: 'MJ-3',
    job_reference: 'MJ-3',
    quote_request_id: 1,
    quote_id: 2,
    title: 'A5 Flyers',
    status: 'in_production',
    payment_status: 'confirmed',
    assignment_status: 'accepted',
    requested_deadline: null,
    updated_at: '2026-09-16T10:00:00Z',
    artwork_uploaded: true,
    artwork_required: false,
    artwork_missing: false,
    can_dispatch: false,
    artwork_status_label: 'Artwork uploaded',
    artwork_reminder_sent: false,
    artwork_confirmation: {
      state: 'not_required',
      requested_at: null,
      requested_by: null,
      responded_at: null,
      responded_by: null,
      note: '',
    },
    payment_confirmed: true,
    pricing: { client_total: '1800.00' },
    ...overrides,
  }
}

describe('client jobs store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetchJobs unwraps the { results } envelope', async () => {
    apiMock.mockResolvedValue({ role: 'client', results: [makeJob()] })
    const store = useClientJobsStore()

    await store.fetchJobs()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/client/jobs/')
    expect(store.jobs).toHaveLength(1)
    expect(store.hasJobs).toBe(true)
  })

  it('fetchJob unwraps the { job } envelope into activeJob', async () => {
    apiMock.mockResolvedValue({ role: 'client', job: makeJob() })
    const store = useClientJobsStore()

    await store.fetchJob(3)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/client/jobs/3/')
    expect(store.activeJob?.id).toBe(3)
  })

  it('needsAction flags artwork confirmations and unpaid jobs', async () => {
    apiMock.mockResolvedValue({
      results: [
        makeJob({ id: 1, payment_confirmed: false, payment_status: 'awaiting_payment', pricing: { client_total: '500.00' } }),
        makeJob({ id: 2, artwork_confirmation: { state: 'requested', requested_at: null, requested_by: null, responded_at: null, responded_by: null, note: '' } }),
        makeJob({ id: 3 }),
      ],
    })
    const store = useClientJobsStore()
    await store.fetchJobs()

    expect(store.needsAction.map((job) => job.id).sort()).toEqual([1, 2])
  })

  it('uploadArtwork posts multipart to the managed job artwork endpoint', async () => {
    apiMock.mockResolvedValue({ id: 9, original_filename: 'art.pdf' })
    const store = useClientJobsStore()
    store.jobs = [makeJob({ artwork_missing: true, artwork_uploaded: false })]
    const file = new File(['pdf'], 'art.pdf', { type: 'application/pdf' })

    await store.uploadArtwork(3, file, 'cover art')

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/3/files/artwork/', expect.objectContaining({ method: 'POST' }))
    const body = apiMock.mock.calls[0]![1]!.body as FormData
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('file')).toBe(file)
    expect(body.get('note')).toBe('cover art')
    expect(store.jobs[0]!.artwork_uploaded).toBe(true)
    expect(store.jobs[0]!.artwork_missing).toBe(false)
  })

  it('actOnFile posts to the matching job-file action endpoint', async () => {
    apiMock.mockResolvedValue({ status: 'approved' })
    const store = useClientJobsStore()
    store.files = [{ id: 9, status: 'proof_uploaded' } as never]

    await store.actOnFile(9, 'approve', 'looks good')

    expect(apiMock).toHaveBeenCalledWith('/job-files/9/approve/', { method: 'POST', body: { note: 'looks good' } })
    expect(store.files[0]!.status).toBe('approved')
  })

  it('respondToArtworkConfirmation posts the action and updates state', async () => {
    apiMock.mockResolvedValue({
      artwork_confirmation: { state: 'approved', requested_at: null, requested_by: null, responded_at: 'now', responded_by: 6, note: '' },
    })
    const store = useClientJobsStore()
    store.jobs = [makeJob()]

    const ok = await store.respondToArtworkConfirmation(3, true, 'ok')

    expect(ok).toBe(true)
    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/3/artwork-confirmation/respond/', {
      method: 'POST',
      body: { action: 'approve', note: 'ok' },
    })
    expect(store.jobs[0]!.artwork_confirmation.state).toBe('approved')
  })

  it('fetchPaymentHistory loads client payments', async () => {
    apiMock.mockResolvedValue({ role: 'client', results: [{ id: 1, amount: '1800.00' }] })
    const store = useClientJobsStore()

    await store.fetchPaymentHistory()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/client/payments/')
    expect(store.paymentHistory).toHaveLength(1)
  })

  it('reorder posts to the reorder endpoint', async () => {
    apiMock.mockResolvedValue({ draft_id: 12, specs_copied_from: 3 })
    const store = useClientJobsStore()

    const result = await store.reorder(3)

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/3/reorder/', { method: 'POST' })
    expect(result?.draft_id).toBe(12)
  })

  it('records an error instead of throwing when loading fails', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useClientJobsStore()

    await store.fetchJobs()

    expect(store.error).toBe('down')
    expect(store.hasJobs).toBe(false)
    expect(store.loading).toBe(false)
  })
})
