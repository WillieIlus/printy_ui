import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWorkflowStore } from '~/stores/workflow'
import { INITIAL_JOBS } from '~/shared/workflow/printy'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    publicApiNoAuth: vi.fn(() => Promise.reject(new Error('offline'))),
    publicApi: vi.fn(),
    api: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

describe('workflow store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('seeds with the initial demo jobs', () => {
    const store = useWorkflowStore()
    expect(store.jobs).toHaveLength(INITIAL_JOBS.length)
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
    const j2 = store.jobs.find((j) => j.id === 'j2')!
    expect(j2.stage).toBe('approval')
    store.mutate('j2', (job) => ({ ...job, stage: 'payment' as const }))
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('payment')
  })

  it('act open-job selects a job', () => {
    const store = useWorkflowStore()
    const j1 = store.jobs.find((j) => j.id === 'j1')!
    store.act('open-job', j1)
    expect(store.selectedId).toBe('j1')
  })

  it('act review-proof sets proofJob', () => {
    const store = useWorkflowStore()
    const j1 = store.jobs.find((j) => j.id === 'j1')!
    store.act('review-proof', j1)
    expect(store.proofJob?.id).toBe('j1')
  })

  it('act approve moves j2 to payment', () => {
    const store = useWorkflowStore()
    const j2 = store.jobs.find((j) => j.id === 'j2')!
    store.act('approve', j2)
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('payment')
  })

  it('act request-changes returns j2 to artwork at-risk', () => {
    const store = useWorkflowStore()
    const j2 = store.jobs.find((j) => j.id === 'j2')!
    store.act('request-changes', j2)
    expect(store.jobs.find((j) => j.id === 'j2')?.stage).toBe('artwork')
    expect(store.jobs.find((j) => j.id === 'j2')?.status).toBe('at-risk')
  })

  it('act pay moves a payment-stage job to production', () => {
    const store = useWorkflowStore()
    const j3 = store.jobs.find((j) => j.id === 'j3')!
    store.act('pay', j3)
    expect(store.jobs.find((j) => j.id === 'j3')?.stage).toBe('production')
  })

  it('act assign assigns a printer to an unassigned production job', () => {
    const store = useWorkflowStore()
    const j4 = store.jobs.find((j) => j.id === 'j4')!
    store.act('assign', j4, 'p-north')
    expect(store.jobs.find((j) => j.id === 'j4')?.printerId).toBe('p-north')
  })

  it('act press-advance advances the press', () => {
    const store = useWorkflowStore()
    const j1 = store.jobs.find((j) => j.id === 'j1')!
    expect(j1.press).toBe('ready')
    store.act('press-advance', j1)
    expect(store.jobs.find((j) => j.id === 'j1')?.press).toBe('active')
  })

  it('act confirm-delivery completes a delivery-stage job', () => {
    const store = useWorkflowStore()
    const j5 = store.jobs.find((j) => j.id === 'j5')!
    store.act('confirm-delivery', j5)
    expect(store.jobs.find((j) => j.id === 'j5')?.stage).toBe('completed')
  })

  it('act resolve-dispute resolves a disputed job', () => {
    const store = useWorkflowStore()
    const j6 = store.jobs.find((j) => j.id === 'j6')!
    store.act('resolve-dispute', j6)
    expect(store.jobs.find((j) => j.id === 'j6')?.status).toBe('on-track')
  })

  it('act nudge appends feed', () => {
    const store = useWorkflowStore()
    const j2 = store.jobs.find((j) => j.id === 'j2')!
    const before = j2.feed.length
    store.act('nudge', j2)
    expect(store.jobs.find((j) => j.id === 'j2')?.feed.length).toBe(before + 1)
  })

  it('resetDemo restores the initial jobs', () => {
    const store = useWorkflowStore()
    store.jobs = []
    store.selectedId = 'j1'
    store.resetDemo()
    expect(store.jobs).toHaveLength(INITIAL_JOBS.length)
    expect(store.selectedId).toBeNull()
  })

  it('syncFromApi sets syncing flags', async () => {
    const store = useWorkflowStore()
    const promise = store.syncFromApi()
    expect(store.syncing).toBe(true)
    await promise
    expect(store.syncing).toBe(false)
  })
})