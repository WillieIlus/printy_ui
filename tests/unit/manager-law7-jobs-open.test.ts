import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerJobsView from '~/components/workbench/views/ManagerJobsView.vue'
import { useManagerStore } from '~/stores/manager'
import type { ManagerJobRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Partial<ManagerJobRow> = {}): ManagerJobRow {
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
    artwork_status_label: 'Artwork approved',
    artwork_reminder_sent: false,
    artwork_confirmation: { state: 'approved' },
    payment_confirmed: true,
    pricing: null,
    client_name: 'Ava',
    assigned_shop_name: 'North Press',
    timing: {
      due_date: '2026-09-20T10:00:00Z',
      current_stage: 'production',
      stage_label: 'Production',
      stage_owner: 'manager',
      next_action: 'Assign a production printer',
      stage_sla_hours: 24,
      time_remaining_minutes: 120,
      is_late: false,
      lateness_minutes: 0,
      revision_count: 0,
      stage_timestamps: null,
      due_date_updated: false,
      due_date_updated_old: null,
      due_date_updated_new: null,
      due_date_acknowledged_at: null,
    },
    ...overrides,
  }
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerJobsView, { global: { plugins: [pinia] } })
  const store = useManagerStore(pinia)
  return { wrapper, store }
}

describe('ManagerJobsView list-to-detail contract', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue({ results: [makeJob()] })
  })

  it('renders jobs as a list and links each row to its canonical detail', async () => {
    const { wrapper } = await mountView()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const rows = wrapper.findAll('[data-test="manager-job-row"]')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.attributes('href')).toBe('/app/manager/jobs/7')
    expect(wrapper.find('#manager-job-7').exists()).toBe(true)
    expect(wrapper.text()).toContain('MJ-7')
    expect(wrapper.text()).toContain('A5 Flyers')
    expect(wrapper.text()).toContain('Assign a production printer')
  })

  it('does not fetch or render the full job detail inside the list', async () => {
    const { wrapper } = await mountView()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(apiMock).not.toHaveBeenCalledWith('/dashboard/partner/jobs/7/')
    expect(wrapper.find('[data-test="job-card"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="job-card-primary"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="job-card-thread"]').exists()).toBe(false)
    expect(wrapper.find('[data-job-card-primary-action="true"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Settlement split')
    expect(wrapper.text()).not.toContain('Adjust this job')
  })

  it('keeps server attention and payout-hold state on the row', async () => {
    apiMock.mockResolvedValue({
      results: [makeJob({ unread: true, needs_attention: true, payout_hold: true })],
    })
    const { wrapper } = await mountView()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.find('[data-test="manager-payout-hold"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Unread"]').exists()).toBe(true)
  })

  it('shows the empty state when no jobs exist', async () => {
    apiMock.mockResolvedValue({ results: [] })
    const { wrapper } = await mountView()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('No jobs in progress')
    expect(wrapper.find('[data-test="manager-job-row"]').exists()).toBe(false)
  })
})
