import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import JobStageMessages from '~/components/design/tracker/JobStageMessages.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

const bundle = {
  job_id: 2,
  job_reference: 'MJ-2',
  current_stage: 'artwork_approval',
  viewer_role: 'manager',
  audiences: [
    { key: 'client', label: 'Client', unread_count: 1, can_reply: true },
    { key: 'printer', label: 'Printer', unread_count: 0, can_reply: true },
  ],
  stages: [
    {
      key: 'quote_accepted', label: 'Quote accepted', owner: 'buyer', unread_count: 1,
      messages: [{
        id: 1, body: 'Can you discount 2,000 copies?', stage: 'quote_accepted', sender_role: 'client',
        sender_name: 'Wanjiku Buyer', is_mine: false, audience: 'client', created_at: '2026-11-18T09:00:00Z',
        read_at: null, attachments: [],
      }],
    },
    {
      key: 'production', label: 'Production', owner: 'printer', unread_count: 0,
      messages: [{
        id: 2, body: 'Please print 1,200 not 1,000.', stage: 'production', sender_role: 'manager',
        sender_name: 'You', is_mine: true, audience: 'printer', created_at: '2026-11-18T10:00:00Z',
        read_at: null, attachments: [],
      }],
    },
  ],
  total_unread: 1,
  latest: {
    id: 2, body: 'Please print 1,200 not 1,000.', stage: 'production', sender_role: 'manager',
    sender_name: 'You', is_mine: true, audience: 'printer', created_at: '2026-11-18T10:00:00Z',
    read_at: null, attachments: [],
  },
  files: [],
  can_reply: true,
}

describe('JobStageMessages', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue(bundle)
  })

  it('renders the latest message and unread count, then expands the stage history', async () => {
    const wrapper = await mountSuspended(JobStageMessages, { props: { jobId: 2 } })
    await flushPromises()
    expect(wrapper.text()).toContain('Stage messages')
    expect(wrapper.text()).toContain('1 new')
    expect(wrapper.text()).toContain('You: Please print 1,200 not 1,000.')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Client')
    expect(wrapper.text()).toContain('Printer')
    expect(wrapper.text()).toContain('Quote accepted')
    expect(wrapper.text()).toContain('Production')
  })

  it('posts a reply on the selected job stage', async () => {
    const wrapper = await mountSuspended(JobStageMessages, { props: { jobId: 2 } })
    await flushPromises()
    await wrapper.get('button').trigger('click')
    await flushPromises()
    const textarea = wrapper.get('textarea')
    await textarea.setValue('Confirmed from my side.')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(apiMock).toHaveBeenCalledWith(
      '/managed-jobs/2/messages/',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({ body: 'Confirmed from my side.', stage: 'production' }),
      }),
    )
  })
})
