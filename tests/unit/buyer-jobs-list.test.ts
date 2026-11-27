import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerJobsListView from '~/components/workbench/views/BuyerJobsListView.vue'
import type { TrackedJob } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

function job(overrides: Partial<TrackedJob> = {}): TrackedJob {
  return {
    id: 41,
    job_code: 'MJ-41',
    title: 'Business cards',
    current_stage: 'Production',
    current_stage_key: 'production',
    stage_note: 'Printing',
    stage_number: 4,
    stage_count: 7,
    state: 'on_track',
    stages: [],
    finishing_steps: [],
    finishing_substeps: [],
    due_at: '2026-12-09T16:00:00Z',
    estimated_remaining_minutes: 180,
    is_late: false,
    overdue_minutes: 0,
    lateness_minutes: 0,
    last_updated_at: '2026-11-27T08:00:00Z',
    next_step: {
      current_stage: 'production',
      stage_label: 'Production',
      owner_role: 'manager',
      is_mine: false,
      next_action: { key: 'none', label: 'Waiting on the manager', target: null },
      due_at: null,
      waiting_since: null,
      overdue_level: 'none',
      headline: 'Waiting on the manager',
    },
    ...overrides,
  }
}

async function mountList(jobs: TrackedJob[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  apiMock.mockResolvedValue({ count: jobs.length, results: jobs })
  const wrapper = await mountSuspended(BuyerJobsListView, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

describe('BuyerJobsListView', () => {
  beforeEach(() => apiMock.mockReset())

  it('renders a simple job list with canonical detail links', async () => {
    const wrapper = await mountList([job()])

    expect(wrapper.text()).toContain('My jobs')
    expect(wrapper.find('[data-test="buyer-jobs-list"]').exists()).toBe(true)
    const row = wrapper.get('[data-test="buyer-job-row"]')
    expect(row.attributes('href')).toBe('/app/buyer/jobs/41')
    expect(row.text()).toContain('MJ-41')
    expect(row.text()).toContain('Business cards')
    expect(row.text()).toContain('Production')
  })

  it('keeps overview sections out of the jobs list', async () => {
    const wrapper = await mountList([job()])

    expect(wrapper.text()).not.toContain('Your jobs in progress')
    expect(wrapper.text()).not.toContain('Quotes waiting')
    expect(wrapper.text()).not.toContain('My managers')
    expect(wrapper.text()).not.toContain('Thread')
    expect(wrapper.find('[data-test="job-card"]').exists()).toBe(false)
  })

  it('shows an empty list when the buyer has no paid jobs', async () => {
    const wrapper = await mountList([])

    expect(wrapper.text()).toContain('No jobs here yet')
    expect(wrapper.find('[data-test="buyer-job-row"]').exists()).toBe(false)
  })
})
