import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NextActionCard from '~/components/design/tracker/NextActionCard.vue'
import JobWorkflowPanel from '~/components/design/tracker/JobWorkflowPanel.vue'

const baseItem = {
  job_code: 'MJ-1',
  owner_role: 'buyer',
  is_mine: true,
  next_action: { key: 'upload_artwork', label: 'Upload your artwork', target: '/app/buyer/jobs/1' },
  due_at: '2026-11-30T10:00:00Z',
  waiting_since: '2026-11-18T09:00:00Z',
  overdue_level: 'none',
  headline: 'Upload your artwork',
  explanation: 'Attach your print-ready file.',
  reassurance: 'Your money stays in escrow.',
  waiting_label: 'Waiting on you',
  phase: 'quote',
  completed: false,
}

describe('NextActionCard', () => {
  it('renders the resolver copy and a real link when the viewer owns the action', async () => {
    const wrapper = await mountSuspended(NextActionCard, { props: { items: [baseItem] } })
    expect(wrapper.text()).toContain('Your turn')
    expect(wrapper.text()).toContain('Upload your artwork')
    expect(wrapper.find('[data-test="next-step-card"]').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/app/buyer/jobs/1')
  })

  it('is informational in read-only mode', async () => {
    const wrapper = await mountSuspended(NextActionCard, {
      props: { items: [{ ...baseItem, is_mine: false, next_action: null }], readOnly: true },
    })
    expect(wrapper.text()).toContain('Next step')
    expect(wrapper.text()).toContain('Waiting on you')
  })

  it('opens the multi-job sheet when more than one job is waiting', async () => {
    const second = { ...baseItem, job_code: 'MJ-2', next_action: { key: 'confirm_delivery', label: 'Confirm delivery', target: '/app/buyer/jobs/2' } }
    const wrapper = await mountSuspended(NextActionCard, { props: { items: [baseItem, second] } })
    expect(wrapper.text()).toContain('+1 more')
    const moreButton = wrapper.findAll('button').find((button) => button.text().includes('more'))
    expect(moreButton).toBeTruthy()
    await moreButton!.trigger('click')
    expect(wrapper.text()).toContain('Waiting on you · 2')
    expect(wrapper.text()).toContain('MJ-2')
  })
})

describe('JobWorkflowPanel', () => {
  it('renders both phases, the badge and the progress bar', async () => {
    const wrapper = await mountSuspended(JobWorkflowPanel, {
      props: {
        data: {
          code: 'MJ-1',
          title: '100 Business cards',
          subline: 'Placed today · Nairobi',
          sample: false,
          badge: { label: 'On track', tone: 'ontrack' },
          phases: [
            { name: 'Phase 1 · Quote', rows: [{ label: 'Quote accepted', state: 'done', right: 'done' }] },
            { name: 'Phase 2 · Production', rows: [{ label: 'Printing', state: 'current', right: 'in progress' }] },
          ],
          footer: { stageLabel: 'Printing', stageCount: 2, stageIndex: 1, leftLabel: '~2h left', dueLabel: 'Mon 30 Nov' },
          progress: 0.5,
        },
      },
    })
    expect(wrapper.text()).toContain('Phase 1 · Quote')
    expect(wrapper.text()).toContain('Phase 2 · Production')
    expect(wrapper.text()).toContain('On track')
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
  })
})
