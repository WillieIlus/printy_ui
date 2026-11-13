import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerJobTimeline from '~/components/workbench/tracker/BuyerJobTimeline.vue'
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
    id: 42,
    job_code: 'QR-2026-0042',
    title: 'Business cards',
    current_stage: 'Printing',
    current_stage_key: 'printing',
    stage_note: 'Printing',
    stage_number: 3,
    stage_count: 7,
    state: 'on_track',
    stages: [
      { key: 'payment_received', label: 'Payment received', status: 'done', started_at: '2026-11-10T08:00:00Z', completed_at: '2026-11-10T08:30:00Z' },
      { key: 'artwork_check', label: 'Artwork check', status: 'done', started_at: '2026-11-10T08:30:00Z', completed_at: '2026-11-10T10:00:00Z' },
      { key: 'printing', label: 'Printing', status: 'current', started_at: '2026-11-10T10:00:00Z', completed_at: null },
      { key: 'finishing', label: 'Finishing', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'quality_check', label: 'Quality check', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'out_for_delivery', label: 'Out for delivery', status: 'upcoming', started_at: null, completed_at: null },
      { key: 'delivered', label: 'Delivered', status: 'upcoming', started_at: null, completed_at: null },
    ],
    finishing_steps: [],
    due_at: '2026-11-13T13:30:00Z',
    estimated_remaining_minutes: 180,
    is_late: false,
    overdue_minutes: 0,
    last_updated_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeDetail(overrides: Record<string, unknown> = {}) {
  return {
    role: 'client',
    job: makeJob(),
    timeline: {
      due_date: '2026-11-13T13:30:00Z',
      current_stage: 'production',
      is_late: false,
      lateness_minutes: 0,
      time_remaining_minutes: 180,
      total_allowed_minutes: 2880,
      total_taken_minutes: 360,
      stages: [
        {
          key: 'payment_received',
          label: 'Payment received',
          started_at: '2026-11-10T08:00:00Z',
          due_at: '2026-11-10T12:00:00Z',
          completed_at: '2026-11-10T08:30:00Z',
          time_taken_minutes: 30,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'completed',
        },
        {
          key: 'printing',
          label: 'Printing',
          started_at: '2026-11-10T10:00:00Z',
          due_at: '2026-11-12T10:00:00Z',
          completed_at: null,
          time_taken_minutes: 360,
          time_remaining_minutes: 180,
          is_overdue: false,
          state: 'current',
        },
        {
          key: 'delivery',
          label: 'Delivery',
          started_at: null,
          due_at: '2026-11-13T13:30:00Z',
          completed_at: null,
          time_taken_minutes: 0,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'pending',
        },
      ],
    },
    tracking_reference: 'QR-2026-0042',
    tracking_url: 'https://printy.example/track/QR-2026-0042',
    ...overrides,
  }
}

async function mountTimeline(jobId = 42) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(BuyerJobTimeline, {
    props: { jobId },
    global: { plugins: [pinia] },
  })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  apiMock.mockReset()
})

describe('BuyerJobTimeline', () => {
  it('auto-loads the exact job by id and renders its full timeline with no code form', async () => {
    apiMock.mockResolvedValue(makeDetail())
    const wrapper = await mountTimeline(42)

    expect(apiMock).toHaveBeenCalledWith('/dashboard/client/tracked-jobs/42/')
    expect(wrapper.text()).toContain('QR-2026-0042')
    expect(wrapper.text()).toContain('Business cards')
    expect(wrapper.text()).toContain('Full stage log')
    expect(wrapper.text()).toContain('Payment received')
    expect(wrapper.text()).toContain('Printing')
    expect(wrapper.text()).toContain('Delivery')
    expect(wrapper.text()).toContain('In progress')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('a[href="/app/buyer#jobs"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/track/QR-2026-0042"]').exists()).toBe(true)
  })

  it('loads a different job when the route id changes', async () => {
    apiMock.mockResolvedValueOnce(makeDetail())
    const wrapper = await mountTimeline(42)
    apiMock.mockResolvedValueOnce(makeDetail({
      job: makeJob({ id: 7, job_code: 'QR-2026-0007', title: 'Flyers' }),
      tracking_reference: 'QR-2026-0007',
      tracking_url: 'https://printy.example/track/QR-2026-0007',
    }))

    await wrapper.setProps({ jobId: 7 })
    await flushPromises()

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/client/tracked-jobs/7/')
    expect(wrapper.text()).toContain('Flyers')
    expect(wrapper.find('a[href="/track/QR-2026-0007"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/track/QR-2026-0042"]').exists()).toBe(false)
  })

  it('shows a clear fallback instead of a code form when the job is not available', async () => {
    apiMock.mockRejectedValue({ statusCode: 404 })
    const wrapper = await mountTimeline(42)

    expect(wrapper.text()).toContain('not available in your workspace')
    expect(wrapper.find('a[href="/track"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/app/buyer#jobs"]').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('still shows the timeline and a manual-code fallback when no public code exists', async () => {
    apiMock.mockResolvedValue(makeDetail({ tracking_reference: '', tracking_url: '' }))
    const wrapper = await mountTimeline(42)

    expect(wrapper.text()).toContain('Business cards')
    expect(wrapper.text()).toContain('Full stage log')
    expect(wrapper.text()).toContain('No public tracking code yet')
    expect(wrapper.find('a[href="/track"]').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('never renders shop, manager, cost or internal next-action fields', async () => {
    apiMock.mockResolvedValue(makeDetail({
      job: {
        ...makeJob(),
        shop_name: 'North Press Secret Ltd',
        manager_email: 'manager-secret@example.com',
        client_total: '9999.00',
        margin: '1200.00',
      },
      timeline: {
        ...makeDetail().timeline,
        stages: [
          {
            ...makeDetail().timeline.stages[1],
            owner: 'manager',
            next_action: 'Call the buyer and discount the job',
          },
        ],
      },
    }))
    const wrapper = await mountTimeline(42)
    const html = wrapper.html()

    expect(html).not.toContain('North Press Secret Ltd')
    expect(html).not.toContain('manager-secret@example.com')
    expect(html).not.toContain('9999')
    expect(html).not.toContain('1200')
    expect(html).not.toContain('discount the job')
  })

  it('retries the same job id without asking for a code', async () => {
    apiMock.mockRejectedValueOnce({ statusCode: 500 })
    const wrapper = await mountTimeline(42)
    expect(wrapper.text()).toContain('Try again')

    apiMock.mockResolvedValueOnce(makeDetail())
    const retry = wrapper.findAll('button').find(button => button.text().includes('Try again'))
    expect(retry).toBeTruthy()
    await retry!.trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/client/tracked-jobs/42/')
    expect(wrapper.text()).toContain('Business cards')
  })
})
