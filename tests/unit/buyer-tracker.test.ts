import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerJobsInProgress from '~/components/workbench/tracker/BuyerJobsInProgress.vue'
import type { TrackedJob } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Partial<TrackedJob> = {}): TrackedJob {
  return {
    id: 1,
    job_code: 'QR-2026-0042',
    title: 'Business cards',
    current_stage: 'Printing',
    current_stage_key: 'printing',
    stage_note: 'Printing',
    stage_number: 3,
    stage_count: 7,
    state: 'on_track',
    stages: [
      { key: 'payment_received', label: 'Payment received', status: 'done', started_at: null, completed_at: null },
      { key: 'artwork_check', label: 'Artwork check', status: 'done', started_at: null, completed_at: null },
      { key: 'printing', label: 'Printing', status: 'current', started_at: null, completed_at: null },
      { key: 'finishing', label: 'Finishing', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'quality_check', label: 'Quality check', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'out_for_delivery', label: 'Out for delivery', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'delivered', label: 'Delivered', status: 'upcoming', started_at: null, completed_at: null },
    ],
    finishing_steps: [{ key: 'lamination', name: 'Lamination', label: 'Lamination', status: 'upcoming', started_at: null, completed_at: null }],
    due_at: '2026-11-02T13:30:00Z',
    estimated_remaining_minutes: 180,
    is_late: false,
    overdue_minutes: 0,
    last_updated_at: new Date().toISOString(),
    ...overrides,
  }
}

async function mountStrip(jobs: TrackedJob[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  apiMock.mockResolvedValue({ count: jobs.length, results: jobs })
  const wrapper = await mountSuspended(BuyerJobsInProgress, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

/** The strip schedules its own 30s refresh; grab that exact callback. */
function captureRefresh(intervalSpy: ReturnType<typeof vi.spyOn>) {
  const call = intervalSpy.mock.calls.find((entry) => entry[1] === 30_000)
  expect(call).toBeTruthy()
  return call![0] as () => void
}

beforeEach(() => {
  apiMock.mockReset()
})

describe('Law 7.12 buyer tracker strip', () => {
  it('renders a paid job with its code, stepper and time left', async () => {
    const wrapper = await mountStrip([makeJob()])

    expect(wrapper.text()).toContain('Your jobs in progress')
    expect(wrapper.text()).toContain('QR-2026-0042')
    expect(wrapper.text()).toContain('Business cards')
    expect(wrapper.text()).toContain('Payment received')
    expect(wrapper.text()).toContain('Out for delivery')
    expect(wrapper.text()).toContain('~3h left')
    expect(wrapper.find('a[href="/track/QR-2026-0042"]').exists()).toBe(true)
  })

  it('hides the whole section when there are no paid jobs', async () => {
    const wrapper = await mountStrip([])

    expect(wrapper.find('section').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Your jobs in progress')
  })

  it('shows the running-late state instead of a countdown', async () => {
    const wrapper = await mountStrip([
      makeJob({ state: 'late', is_late: true, overdue_minutes: 95, estimated_remaining_minutes: 0 }),
    ])

    expect(wrapper.text()).toContain('Running late')
    expect(wrapper.text()).toContain('Running late by 1h 35m')
    expect(wrapper.text()).not.toContain('left')
  })

  it('shows Delivered, then removes the section when the server drops the job', async () => {
    const intervalSpy = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await mountStrip([
      makeJob({ state: 'delivered', current_stage_key: 'delivered', current_stage: 'Delivered', stage_note: 'Delivered', stage_number: 7 }),
    ])

    expect(wrapper.text()).toContain('Delivered')
    const refresh = captureRefresh(intervalSpy)

    apiMock.mockResolvedValue({ count: 0, results: [] })
    refresh()
    await flushPromises()

    expect(wrapper.find('section').exists()).toBe(false)
    intervalSpy.mockRestore()
  })

  it('refreshes every 30 seconds and animates a stage change', async () => {
    const intervalSpy = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await mountStrip([makeJob()])
    expect(wrapper.text()).toContain('Printing')
    const refresh = captureRefresh(intervalSpy)

    apiMock.mockResolvedValue({
      count: 1,
      results: [makeJob({
        current_stage_key: 'finishing',
        current_stage: 'Finishing',
        stage_note: 'Being laminated',
        stage_number: 4,
        stages: makeJob().stages.map((stage) => {
          if (stage.key === 'printing') return { ...stage, status: 'done' as const }
          if (stage.key === 'finishing') return { ...stage, status: 'current' as const }
          return stage
        }),
      })],
    })

    refresh()
    await flushPromises()

    expect(wrapper.text()).toContain('Being laminated')
    expect(wrapper.findAll('.tracket--changed').length).toBe(1)
    intervalSpy.mockRestore()
  })

  it('never renders shop, cost or margin fields even if the payload carried them', async () => {
    const leaked = {
      ...makeJob(),
      shop_name: 'North Press Secret Ltd',
      client_total: '9999.00',
      margin: '1200.00',
    } as unknown as TrackedJob
    const wrapper = await mountStrip([leaked])

    const html = wrapper.html()
    expect(html).not.toContain('North Press Secret Ltd')
    expect(html).not.toContain('9999')
    expect(html).not.toContain('1200')
  })

  it('keeps a compact stepper path for phones alongside the full stepper', async () => {
    const wrapper = await mountStrip([makeJob()])

    expect(wrapper.find('.ticket-stepper__compact').exists()).toBe(true)
    expect(wrapper.find('.ticket-stepper__steps').exists()).toBe(true)
    expect(wrapper.find('.ticket-stepper__compact-count').text()).toBe('3 of 7')
  })

  it('shows at most three jobs and a see-all link', async () => {
    const jobs = [1, 2, 3, 4].map((id) => makeJob({ id, job_code: `QR-2026-000${id}` }))
    const wrapper = await mountStrip(jobs)

    expect(wrapper.findAll('.tracket').length).toBe(3)
    expect(wrapper.text()).toContain('See all 4 jobs')
    expect(wrapper.find('a[href="/app/buyer#jobs"]').exists()).toBe(true)
  })
})
