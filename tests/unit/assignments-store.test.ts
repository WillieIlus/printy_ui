import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAssignmentsStore } from '~/stores/assignments'
import type { JobAssignment } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeAssignment(overrides: Partial<JobAssignment> = {}): JobAssignment {
  return {
    id: 1,
    assignment_reference: 'PA-0001',
    managed_job: 77,
    managed_reference: 'MJ-2026-0001',
    job_reference: 'MJ-2026-0001',
    quote_request_reference: 'QR-42',
    quote_reference: 'Q-7',
    assigned_shop: 3,
    shop_name: 'North Press',
    status: 'accepted',
    urgency_type: 'standard',
    urgency_label: 'Standard',
    operational_priority_level: 0,
    managed_job_status: 'accepted',
    managed_job_payment_status: 'confirmed',
    production_stage: 'accepted',
    production_stage_label: 'Accepted',
    production_timeline_steps: [],
    current_step: 'accepted',
    next_allowed_actions: ['mark_printing'],
    payment_confirmed: true,
    payout_amount: '9000.00',
    payout_status_label: 'Pending completion',
    artwork_available: true,
    proof_status: '',
    production_order: null,
    due_at: null,
    requested_deadline: null,
    accepted_at: '2026-09-16T10:00:00Z',
    rejected_at: null,
    assignment_notes: '',
    ...overrides,
  }
}

describe('assignments store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetch loads a raw array and derives active jobs', async () => {
    apiMock.mockResolvedValue([makeAssignment(), makeAssignment({ id: 2, status: 'completed' })])
    const store = useAssignmentsStore()

    await store.fetch()

    expect(apiMock).toHaveBeenCalledWith('/shop/assignments/')
    expect(store.items).toHaveLength(2)
    expect(store.active).toHaveLength(1)
  })

  it('fetch records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useAssignmentsStore()

    await store.fetch()

    expect(store.error).toContain("couldn't load")
    expect(store.hasAssignments).toBe(false)
  })

  it('perform maps mark_printing to the in-production endpoint and replaces the row', async () => {
    const updated = makeAssignment({ status: 'in_production', production_stage: 'printing' })
    apiMock.mockResolvedValue(updated)
    const store = useAssignmentsStore()
    store.items = [makeAssignment()]

    await store.perform(store.items[0]!, 'mark_printing')

    expect(apiMock).toHaveBeenCalledWith('/job-assignments/1/mark-in-production/', { method: 'POST', body: undefined })
    expect(store.items[0]!.status).toBe('in_production')
  })

  it('perform sends a note body for reject', async () => {
    apiMock.mockResolvedValue(makeAssignment({ status: 'rejected' }))
    const store = useAssignmentsStore()
    store.items = [makeAssignment()]

    await store.perform(store.items[0]!, 'reject', 'Press is down')

    expect(apiMock).toHaveBeenCalledWith('/job-assignments/1/reject/', {
      method: 'POST',
      body: { note: 'Press is down' },
    })
  })

  it('reportIssue posts to the report-issue endpoint', async () => {
    apiMock.mockResolvedValue(makeAssignment())
    const store = useAssignmentsStore()
    store.items = [makeAssignment()]

    await store.reportIssue(store.items[0]!, 'Colour mismatch')

    expect(apiMock).toHaveBeenCalledWith('/job-assignments/1/report-issue/', {
      method: 'POST',
      body: { note: 'Colour mismatch' },
    })
  })

  it('uploadProof posts multipart form data then refetches', async () => {
    apiMock.mockResolvedValue([])
    const store = useAssignmentsStore()
    store.items = [makeAssignment()]
    const file = new File(['proof'], 'proof.pdf', { type: 'application/pdf' })

    await store.uploadProof(store.items[0]!, file)

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/77/files/proofs/', expect.objectContaining({ method: 'POST' }))
    const call = apiMock.mock.calls.find((c) => String(c[0]).includes('/files/proofs/'))
    expect(call?.[1]?.body).toBeInstanceOf(FormData)
    expect(apiMock).toHaveBeenCalledWith('/shop/assignments/')
  })
})
