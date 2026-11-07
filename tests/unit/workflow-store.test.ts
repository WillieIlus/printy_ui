import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWorkflowStore } from '~/stores/workflow'
import type { Job } from '~/shared/workflow/printy'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    publicApiNoAuth: vi.fn(() => Promise.reject(new Error('offline'))),
    publicApi: vi.fn(),
    api: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function mk(overrides: Partial<Job> = {}): Job {
  const base: Job = {
    id: 'test-1',
    code: 'PTY-TEST-1',
    title: 'Test job',
    product: 'A5 flyer',
    qty: 1000,
    value: 500,
    buyerId: 'b-test',
    buyerName: 'Test Buyer',
    buyerCompany: 'Test Co',
    managerId: 'm-dale',
    printerId: null,
    specs: { material: '130gsm', colors: 'CMYK', finish: 'Trim', size: 'A5' },
    status: 'on-track',
    custody: 'awaiting',
    stage: 'quote',
    press: null,
    progress: null,
    owner: { name: 'Test', role: 'Buyer', action: 'Do a thing', waitingHrs: 0, slaHrs: 24 },
    eta: 'Tomorrow',
    placedAt: 'Today',
    history: [],
    feed: [],
  }
  return { ...base, ...overrides }
}

describe('workflow store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no jobs', () => {
    const store = useWorkflowStore()
    expect(store.jobs).toHaveLength(0)
    expect(store.selectedId).toBeNull()
    expect(store.role).toBe('buyer')
  })

  it('setRole updates role and clears selection', () => {
    const store = useWorkflowStore()
    store.selectedId = 'j1'
    store.setRole('manager')
    expect(store.role).toBe('manager')
    expect(store.selectedId).toBeNull()
  })

  it('pushToast adds and expires toasts', () => {
    vi.useFakeTimers()
    const store = useWorkflowStore()
    store.pushToast('hello')
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0]?.text).toBe('hello')
    vi.runAllTimers()
    expect(store.toasts).toHaveLength(0)
    vi.useRealTimers()
  })

  it('mutate applies a pure transition to one job', () => {
    const store = useWorkflowStore()
    store.jobs = [mk({ id: 'j2', stage: 'approval' })]
    store.mutate('j2', (job) => ({ ...job, stage: 'payment' as const }))
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('payment')
  })

  it('act open-job selects a job', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j1' })
    store.jobs = [j]
    store.act('open-job', j)
    expect(store.selectedId).toBe('j1')
  })

  it('act review-proof sets proofJob', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j1' })
    store.jobs = [j]
    store.act('review-proof', j)
    expect(store.proofJob?.id).toBe('j1')
  })

  it('act approve moves an approval job to payment', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j2', stage: 'approval', status: 'at-risk' })
    store.jobs = [j]
    store.act('approve', j)
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('payment')
  })

  it('act request-changes returns an approval job to artwork at-risk', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j2', stage: 'approval', status: 'at-risk' })
    store.jobs = [j]
    store.act('request-changes', j)
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('artwork')
    expect(store.jobs.find((j) => j.id === 'j2')?.status).toBe('at-risk')
  })

  it('act pay moves a payment-stage job to production', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j3', stage: 'payment' })
    store.jobs = [j]
    store.act('pay', j)
    expect(store.jobs.find((j) => j.id === 'j3')?.stage).toBe('production')
  })

  it('act assign assigns a printer to an unassigned production job', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j4', stage: 'production' })
    store.jobs = [j]
    store.act('assign', j, 'p-north')
    expect(store.jobs.find((j) => j.id === 'j4')?.printerId).toBe('p-north')
  })

  it('act press-advance advances the press', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j1', stage: 'printing', press: 'ready', printerId: 'p-north' })
    store.jobs = [j]
    store.act('press-advance', j)
    expect(store.jobs.find((j) => j.id === 'j1')?.press).toBe('active')
  })

  it('act confirm-delivery completes a delivery-stage job', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j5', stage: 'delivery', printerId: 'p-kobo', custody: 'held' })
    store.jobs = [j]
    store.act('confirm-delivery', j)
    expect(store.jobs.find((j) => j.id === 'j5')?.stage).toBe('completed')
  })

  it('act resolve-dispute resolves a disputed job', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j6', stage: 'finishing', status: 'disputed', custody: 'held', dispute: { reason: 'x', openedBy: 'y', at: 'Wed', amount: 100 } })
    store.jobs = [j]
    store.act('resolve-dispute', j)
    expect(store.jobs.find((j) => j.id === 'j6')?.status).toBe('on-track')
  })

  it('act nudge appends feed', () => {
    const store = useWorkflowStore()
    const j = mk({ id: 'j2', stage: 'approval', feed: [{ at: 'x', who: 'y', text: 'z', jobCode: 'PTY-TEST-1' }] })
    store.jobs = [j]
    const before = store.jobs[0]!.feed.length
    store.act('nudge', j)
    expect(store.jobs.find((j) => j.id === 'j2')?.feed.length).toBe(before + 1)
  })

  it('syncFromApi sets syncing flags', async () => {
    const store = useWorkflowStore()
    const promise = store.syncFromApi()
    expect(store.syncing).toBe(true)
    await promise
    expect(store.syncing).toBe(false)
  })
})