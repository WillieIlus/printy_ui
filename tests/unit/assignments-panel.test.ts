import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AssignmentsPanel from '~/components/workbench/AssignmentsPanel.vue'
import { useAssignmentsStore } from '~/stores/assignments'
import type { JobAssignment, JobStageTimeline } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

const timeline: JobStageTimeline = {
  due_date: '2026-02-01T10:00:00Z',
  current_stage: 'printing',
  is_late: true,
  lateness_minutes: 90,
  time_remaining_minutes: -90,
  total_allowed_minutes: 480,
  total_taken_minutes: 570,
  stages: [
    {
      key: 'accepted', label: 'Accepted', owner: 'printer', next_action: null, sla_hours: '4',
      started_at: '2026-01-30T08:00:00Z', due_at: '2026-02-01T08:00:00Z', completed_at: '2026-02-01T08:00:00Z',
      time_taken_minutes: 60, time_remaining_minutes: null, is_overdue: false, state: 'completed',
    },
    {
      key: 'printing', label: 'Printing', owner: 'printer', next_action: 'finish the run', sla_hours: '8',
      started_at: '2026-02-01T08:00:00Z', due_at: '2026-02-01T18:00:00Z', completed_at: null,
      time_taken_minutes: 90, time_remaining_minutes: -90, is_overdue: true, state: 'overdue',
    },
  ],
}

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
    status: 'in_production',
    urgency_type: 'standard',
    urgency_label: 'Standard',
    operational_priority_level: 0,
    managed_job_status: 'assigned',
    managed_job_payment_status: 'confirmed',
    production_stage: 'printing',
    production_stage_label: 'Printing',
    production_timeline_steps: [{ key: 'dispatch_received', label: 'Dispatch received', state: 'completed' }],
    current_step: 'printing',
    next_allowed_actions: [],
    payment_confirmed: true,
    payout_amount: '900.00',
    payout_status_label: 'ready',
    artwork_available: true,
    proof_status: '',
    production_order: null,
    due_at: null,
    requested_deadline: null,
    accepted_at: null,
    rejected_at: null,
    assignment_notes: '',
    canonical: null,
    timing: null,
    timeline: null,
    ...overrides,
  }
}

async function flush() {
  for (let i = 0; i < 5; i += 1) await nextTick()
}

describe('AssignmentsPanel - printer groups + full stage timeline', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue([])
  })

  it('law 7.5 - renders the backend sections with headings and counts', async () => {
    apiMock.mockResolvedValue([
      makeAssignment({ id: 1, section: 'in_progress', section_label: 'In progress', needs_attention: true }),
      makeAssignment({ id: 2, section: 'finished', section_label: 'Finished', muted: true }),
    ])
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(AssignmentsPanel, { global: { plugins: [pinia] } })
    await flush()

    const text = wrapper.text()
    expect(text).toContain('In progress')
    expect(text).toContain('Finished')
    expect(wrapper.find('.opacity-60').exists()).toBe(true)
    expect(wrapper.find('.ring-2').exists()).toBe(true)
  })

  it('law 7.6 - shows the full stage timeline with owner, SLA and overdue', async () => {
    apiMock.mockResolvedValue([
      makeAssignment({ id: 1, section: 'in_progress', section_label: 'In progress', timeline }),
    ])
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(AssignmentsPanel, { global: { plugins: [pinia] } })
    await flush()

    const text = wrapper.text()
    expect(text).toContain('Stage timeline')
    expect(text).toContain('Printing')
    expect(text).toContain('Printer')
    expect(text).toContain('overdue')
    expect(text).toContain('9h 30m taken of 8h 0m allowed — running late')
  })
})
