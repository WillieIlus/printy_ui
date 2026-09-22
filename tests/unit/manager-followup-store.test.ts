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
    quote_request_reference: 'QR-1',
    quote_reference: 'Q-2',
    tracking_reference: 'MJ-7',
    production_assignment_reference: null,
    title: 'A5 Flyers',
    status: 'in_production',
    payment_status: 'confirmed',
    assignment_status: 'unassigned',
    requested_deadline: null,
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
    client_name: 'Ava',
    assigned_shop_name: 'North Press',
    ...overrides,
  }
}

describe('manager jobs / clients / shops store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetches the partner job queue', async () => {
    apiMock.mockResolvedValue({ role: 'partner', results: [makeJob()] })
    const store = useManagerStore()

    const jobs = await store.fetchJobs()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/jobs/')
    expect(jobs).toHaveLength(1)
    expect(store.hasJobs).toBe(true)
  })

  it('unwraps a job detail and keeps its settlement split', async () => {
    apiMock.mockResolvedValue({
      role: 'partner',
      job: makeJob(),
      settlement: { client_total: '1800.00', partner_commission: '180.00' },
    })
    const store = useManagerStore()

    const job = await store.fetchJob(7)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/jobs/7/')
    expect(job?.id).toBe(7)
    expect(store.activeJobSettlement).toEqual({ client_total: '1800.00', partner_commission: '180.00' })
  })

  it('only lists payment-confirmed, undispatched jobs as dispatchable', async () => {
    apiMock.mockResolvedValue({
      results: [
        makeJob({ id: 1 }),
        makeJob({ id: 2, payment_confirmed: false, payment_status: 'awaiting_payment' }),
        makeJob({ id: 3, dispatched_at: '2026-09-17T08:00:00Z' }),
      ],
    })
    const store = useManagerStore()
    await store.fetchJobs()

    expect(store.dispatchableJobs.map((j) => j.id)).toEqual([1])
  })

  it('dispatches a job and marks the row as dispatched', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    apiMock.mockResolvedValue({
      job_id: 7,
      assignment_id: 11,
      dispatched: true,
      dispatched_at: '2026-09-18T06:00:00Z',
      assignment_status: 'assignment_pending',
      shop_name: 'North Press',
      artwork_verified: true,
    })
    const store = useManagerStore()
    await store.fetchJobs()

    const result = await store.dispatchJob(7)

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/partner/jobs/7/dispatch/', { method: 'POST' })
    expect(result?.dispatched).toBe(true)
    expect(store.jobs[0]!.dispatched_at).toBe('2026-09-18T06:00:00Z')
    expect(store.jobs[0]!.assignment_status).toBe('assignment_pending')
  })

  it('surfaces the backend reason when dispatch is blocked', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    apiMock.mockRejectedValue(createDispatchError('artwork_required', 'Artwork required before dispatch. Client has been notified.'))
    const store = useManagerStore()
    await store.fetchJobs()

    const result = await store.dispatchJob(7)

    expect(result).toBeNull()
    expect(store.error).toContain('Artwork required before dispatch')
  })

  it('searches and creates partner clients', async () => {
    apiMock.mockResolvedValueOnce({ role: 'partner', results: [{ client_id: 6, name: 'Ava', email: 'ava@studionorth.co.ke' }] })
    apiMock.mockResolvedValueOnce({ client_id: 9, name: 'New Client', phone: '0712345678', is_offline: true })
    const store = useManagerStore()

    await store.fetchClients('ava')
    await store.createClient({ name: 'New Client', phone: '0712345678' })

    expect(apiMock).toHaveBeenNthCalledWith(1, '/dashboard/partner/clients/', { query: { search: 'ava' } })
    expect(apiMock).toHaveBeenNthCalledWith(2, '/dashboard/partner/clients/', { method: 'POST', body: { name: 'New Client', phone: '0712345678' } })
    expect(store.clients).toHaveLength(2)
    expect(store.clients[0]!.is_offline).toBe(true)
  })

  it('loads eligible production shops', async () => {
    apiMock.mockResolvedValue({
      role: 'partner',
      results: [
        { id: 1, name: 'North Press', slug: 'north-press', city: 'Nairobi', service_area: 'Nairobi', can_receive_requests: true, can_price_requests: true, supports_custom_requests: true, supports_catalog_requests: false, pricing_source: 'shop_rate_card' },
      ],
    })
    const store = useManagerStore()

    const shops = await store.fetchProductionShops()

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/production-shops/')
    expect(shops).toHaveLength(1)
    expect(shops[0]!.supports_custom_requests).toBe(true)
  })
})

function createDispatchError(code: string, detail: string) {
  const error = new Error(detail)
  ;(error as unknown as { data: { error: string; detail: string } }).data = { error: code, detail }
  return error
}