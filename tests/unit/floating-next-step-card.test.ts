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
  next_action: { key: 'upload_artwork', label: 'Upload your artwork', target: '/app/buyer/jobs/2' },
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
    apiMock.mockResolvedValue({})
  })

  it('renders the dark floating card for the owner', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    expect(wrapper.find('[data-test="floating-next-step"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Next step')
    expect(wrapper.text()).toContain('Upload your artwork')
    expect(wrapper.text()).toContain('Waiting on you')
    expect(wrapper.find('a').attributes('href')).toBe('/app/buyer/jobs/2')
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

  it('limits stage options to the role and current job state', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    await wrapper.get('button').trigger('click')
    const options = wrapper.findAll('option').map((option) => option.text())
    expect(options).toContain('Quote accepted')
    expect(options).toContain('Artwork approval')
    expect(options).not.toContain('Production')
  })

  it('gives the printer only printer-owned stages around the current stage', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: {
        item: { ...item, owner_role: 'printer', is_mine: true, next_action: { key: 'start_printing', label: 'Start printing', target: '/app/printer?assignment=2' } },
        jobId: 2,
        role: 'printer',
        currentStage: 'production',
      },
    })
    await wrapper.get('button').trigger('click')
    const options = wrapper.findAll('option').map((option) => option.text())
    expect(options).toContain('Production')
    expect(options).not.toContain('Quote accepted')
    expect(options).not.toContain('Artwork approval')
  })

  it('gives the manager its reachable stages', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: {
        item: { ...item, owner_role: 'manager', is_mine: true, next_action: { key: 'dispatch_job', label: 'Assign a production printer', target: '/app/manager/jobs?job=2' } },
        jobId: 2,
        role: 'manager',
        currentStage: 'artwork_approval',
      },
    })
    await wrapper.get('button').trigger('click')
    const options = wrapper.findAll('option').map((option) => option.text())
    expect(options).toContain('Artwork approval')
    expect(options).toContain('Production')
    expect(options).not.toContain('Delivery')
  })

  it('validates an empty status update', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    await wrapper.get('button').trigger('click')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Add a note, an expected date, or a delay reason')
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('submits the stage message and refreshes the parent', async () => {
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue('Artwork is on the way.')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/2/messages/', {
      method: 'POST',
      body: {
        body: 'Artwork is on the way.',
        stage: 'artwork_approval',
        audience: 'client',
      },
    })
    expect(wrapper.text()).toContain('Status note added to this stage.')
    expect(wrapper.emitted('updated')).toBeTruthy()
  })

  it('shows the API error when submit fails', async () => {
    apiMock.mockRejectedValueOnce({ data: { detail: 'Stage update failed' } })
    const wrapper = await mountSuspended(FloatingNextStepCard, {
      props: { item, jobId: 2, role: 'buyer', currentStage: 'artwork_approval' },
    })
    await wrapper.get('button').trigger('click')
    await wrapper.get('textarea').setValue('Try this')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(wrapper.text()).toContain('Stage update failed')
  })
})
