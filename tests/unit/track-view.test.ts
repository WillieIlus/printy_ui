import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TrackView from '~/components/workbench/views/TrackView.vue'
import { useAuthStore } from '~/stores/auth'
import { API } from '~/shared/api-paths'
import type { AuthUser } from '~/shared/types'

const { apiMock, publicApiMock } = vi.hoisted(() => ({ apiMock: vi.fn(), publicApiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: publicApiMock,
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function trackResult() {
  return {
    tracking_reference: 'PTY-1041',
    job_status: 'In production',
    estimated_ready: '2026-10-22T15:00:00Z',
    next_action: 'Printer is on the press floor.',
    timeline: null,
  }
}

function detailedTrackResult() {
  return {
    ...trackResult(),
    code: 'PTY-1041',
    current_stage: 'production',
    stage_label: 'Production',
    stage_owner: 'printer',
    due_date: '2026-10-24T15:00:00Z',
    is_late: false,
    timeline: {
      due_date: '2026-10-24T15:00:00Z',
      current_stage: 'production',
      is_late: false,
      lateness_minutes: 0,
      time_remaining_minutes: 1200,
      total_allowed_minutes: 4800,
      total_taken_minutes: 1200,
      stages: [
        {
          key: 'quote_accepted',
          label: 'Quote accepted',
          owner: 'buyer',
          next_action: 'Accept the quote and pay into escrow',
          sla_hours: '4',
          started_at: '2026-10-20T08:00:00Z',
          due_at: '2026-10-20T12:00:00Z',
          completed_at: '2026-10-20T09:00:00Z',
          time_taken_minutes: 60,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'completed',
        },
        {
          key: 'production',
          label: 'Production',
          owner: 'printer',
          next_action: 'Print the job',
          sla_hours: '40',
          started_at: '2026-10-20T09:00:00Z',
          due_at: '2026-10-24T15:00:00Z',
          completed_at: null,
          time_taken_minutes: 1200,
          time_remaining_minutes: 1200,
          is_overdue: false,
          state: 'current',
        },
        {
          key: 'qc',
          label: 'Quality check',
          owner: 'manager',
          next_action: 'Check quality before handoff',
          sla_hours: '8',
          started_at: '2026-10-24T15:00:00Z',
          due_at: '2026-10-24T23:00:00Z',
          completed_at: null,
          time_taken_minutes: 0,
          time_remaining_minutes: 480,
          is_overdue: false,
          state: 'pending',
        },
      ],
    },
  }
}

function user(): AuthUser {
  return { id: 1, email: 'buyer@example.com', name: 'Amina', role: 'client' }
}

async function mountTrack(authed: boolean) {
  const pinia = createPinia()
  setActivePinia(pinia)
  if (authed) useAuthStore(pinia).user = user()
  const wrapper = await mountSuspended(TrackView, {
    props: { token: 'PTY-1041' },
    global: { plugins: [pinia] },
  })
  for (let i = 0; i < 5; i += 1) await wrapper.vm.$nextTick()
  return wrapper
}

describe('TrackView', () => {
  beforeEach(() => {
    apiMock.mockReset()
    publicApiMock.mockReset()
  })

  it('tracks through the authorised client when signed in, so the owner is recognised without a challenge', async () => {
    apiMock.mockResolvedValueOnce(trackResult())
    const wrapper = await mountTrack(true)

    expect(apiMock).toHaveBeenCalledTimes(1)
    expect(apiMock.mock.calls[0]![0]).toBe(API.jobs.publicManagedTrack('pty-1041'))
    expect(apiMock.mock.calls[0]![1]).toMatchObject({ auth: true })
    expect(publicApiMock).not.toHaveBeenCalled()

    expect(wrapper.text()).toContain('PTY-1041')
    expect(wrapper.text()).toContain('In production')
    expect(wrapper.find('input[type="email"]').exists()).toBe(false)
  })

  it('renders the real stage pipeline and event log without exposing private pricing', async () => {
    apiMock.mockResolvedValueOnce(detailedTrackResult())
    const wrapper = await mountTrack(true)

    expect(wrapper.text()).toContain('Who has the ball')
    expect(wrapper.text()).toContain('Production')
    expect(wrapper.text()).toContain('Printshop')
    expect(wrapper.text()).toContain('Quote accepted - completed')
    expect(wrapper.text()).toContain('Production - in progress')
    expect(wrapper.text()).toContain('Job event log')
    expect(wrapper.text()).toContain('Time since update')
    expect(wrapper.text()).toContain('Time elapsed')
    expect(wrapper.text()).toContain('Time expected')
    expect(wrapper.text()).toContain('20h 0m')
    expect(wrapper.text()).toContain('Expected in 20h 0m')
    expect(wrapper.text()).toContain('Due date:')
    expect(wrapper.text()).not.toContain('KES')
    expect(wrapper.text()).not.toContain('Price locked')
  })

  it('keeps the public unauthenticated lookup for a signed-out visitor', async () => {
    publicApiMock.mockResolvedValueOnce(trackResult())
    const wrapper = await mountTrack(false)

    expect(publicApiMock).toHaveBeenCalledTimes(1)
    expect(publicApiMock.mock.calls[0]![0]).toBe(API.jobs.publicManagedTrack('pty-1041'))
    expect(publicApiMock.mock.calls[0]![1]).toMatchObject({ auth: false })
    expect(apiMock).not.toHaveBeenCalled()

    expect(wrapper.text()).toContain('PTY-1041')
  })

  it('still asks the signed-out visitor for the email or phone when the server wants it', async () => {
    publicApiMock.mockRejectedValueOnce({ statusCode: 400, message: 'Enter the email address or phone number on the job' })
    const wrapper = await mountTrack(false)

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="tel"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('We need a bit more to find that job')
  })

  it('shows the not-found state for an unknown code', async () => {
    publicApiMock.mockResolvedValueOnce({ detail: 'Not found.' })
    const wrapper = await mountTrack(false)

    expect(wrapper.text()).toContain('No job found')
    expect(wrapper.text()).toContain('PTY-1041')
  })
})
