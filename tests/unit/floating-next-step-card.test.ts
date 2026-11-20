import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FloatingNextStepCard from '~/components/design/tracker/FloatingNextStepCard.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

const item = {
  job_code: 'MJ-2',
  owner_role: 'buyer',
  is_mine: true,
  next_action: { key: 'upload_artwork', label: 'Upload your artwork', target: '/app/buyer/jobs/2#artwork' },
  due_at: '2026-12-01T13:00:00Z',
  waiting_since: '2026-11-18T09:00:00Z',
  overdue_level: 'none',
  headline: 'Upload your artwork',
  explanation: 'Attach your print-ready file.',
  reassurance: 'Your money stays in escrow.',
  waiting_label: 'Waiting on you',
  phase: 'quote',
  completed: false,
}

describe('FloatingNextStepCard', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue({ applied: true, code: 'start_printing', card: { jobs: [] } })
  })

  it('renders the dark floating card for the owner and links workflow-only actions', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    expect(wrapper.find('[data-test="floating-next-step"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Next step')
    expect(wrapper.text()).toContain('Upload your artwork')
    expect(wrapper.text()).toContain('Waiting on you')
    expect(wrapper.find('a').attributes('href')).toBe('/app/buyer/jobs/2#artwork')
    expect(wrapper.html()).toContain('bg-ink')
  })

  it('shows a muted waiting line for a non-owner and no black card', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item: { ...item, is_mine: false, owner_role: 'manager' }, jobId: 2, role: 'buyer' },
    })
    expect(wrapper.find('[data-test="floating-next-step"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="waiting-next-step"]').text()).toContain('Waiting on your manager')
  })

  it('renders nothing for a completed job', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item: { ...item, completed: true }, jobId: 2, role: 'buyer' },
    })
    expect(wrapper.find('[data-test="floating-next-step"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="waiting-next-step"]').exists()).toBe(false)
  })

  it('removes the old stub status form', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    expect(wrapper.text()).not.toContain('Update job status')
    expect(wrapper.text()).not.toContain('Save status update')
    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('performs the one next action for a performable code', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: {
        item: {
          ...item,
          owner_role: 'printer',
          is_mine: true,
          next_action: { key: 'start_printing', label: 'Start printing', target: '/app/printer?assignment=2' },
        },
        jobId: 2,
        role: 'printer',
        currentStage: 'production',
      },
    })

    await wrapper.get('[data-test="floating-next-step-action"]').trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/2/actions/next/', {
      method: 'POST',
      body: { code: 'start_printing' },
    })
    expect(wrapper.emitted('updated')).toBeTruthy()
    expect(wrapper.text()).toContain('Action recorded.')
  })

  it('shows the API error when the action fails', async () => {
    apiMock.mockRejectedValueOnce({ data: { detail: 'That action is not the current next action.' } })
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: {
        item: {
          ...item,
          owner_role: 'printer',
          is_mine: true,
          next_action: { key: 'start_printing', label: 'Start printing', target: '/app/printer?assignment=2' },
        },
        jobId: 2,
        role: 'printer',
      },
    })

    await wrapper.get('[data-test="floating-next-step-action"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('That action is not the current next action.')
    expect(wrapper.emitted('updated')).toBeFalsy()
  })
})
