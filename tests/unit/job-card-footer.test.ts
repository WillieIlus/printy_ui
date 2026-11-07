import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import JobCardFooter from '~/components/workbench/ui/JobCardFooter.vue'

const base = {
  jobCode: 'MJ-20261020-0022',
  holder: 'Print manager',
  nextAction: 'Awaiting dispatch',
  dueDate: '2026-11-15T09:00:00Z',
  slaMinutes: 180,
  isLate: false,
}

describe('JobCardFooter', () => {
  it('renders the job code in every role', async () => {
    for (const role of ['buyer', 'manager', 'printer'] as const) {
      const wrapper = await mountSuspended(JobCardFooter, { props: { ...base, role } })
      expect(wrapper.get('[data-test="job-card-footer"]').attributes('data-role')).toBe(role)
      expect(wrapper.get('[data-test="footer-code"]').text()).toContain('MJ-20261020-0022')
    }
  })

  it('shows holder, next action, due date and SLA for the buyer', async () => {
    const wrapper = await mountSuspended(JobCardFooter, { props: { ...base, role: 'buyer' } })
    expect(wrapper.get('[data-test="footer-holder"]').text()).toContain('With Print manager')
    expect(wrapper.get('[data-test="footer-next-action"]').text()).toContain('Awaiting dispatch')
    expect(wrapper.get('[data-test="footer-due"]').text()).toContain('Due')
    expect(wrapper.get('[data-test="footer-sla"]').text()).toContain('left')
    expect(wrapper.find('[data-test="footer-dispatch"]').exists()).toBe(false)
  })

  it('shows dispatch state for the manager but never price changes', async () => {
    const wrapper = await mountSuspended(JobCardFooter, {
      props: { ...base, role: 'manager', dispatchState: 'Ready to dispatch', priceUpdated: { oldTotal: 'KSh 1,000', newTotal: 'KSh 1,200' } },
    })
    expect(wrapper.get('[data-test="footer-dispatch"]').text()).toContain('Ready to dispatch')
    expect(wrapper.find('[data-test="footer-price-update"]').exists()).toBe(false)
  })

  it('shows the price-change state for the buyer only, exactly as supplied', async () => {
    const wrapper = await mountSuspended(JobCardFooter, {
      props: { ...base, role: 'buyer', priceUpdated: { oldTotal: 'KSh 1,000', newTotal: 'KSh 1,200' } },
    })
    const cell = wrapper.get('[data-test="footer-price-update"]')
    expect(cell.text()).toContain('KSh 1,000')
    expect(cell.text()).toContain('KSh 1,200')
    expect(wrapper.find('[data-test="footer-dispatch"]').exists()).toBe(false)
  })

  it('withholds client-facing identity and SLA fields from the printer', async () => {
    const wrapper = await mountSuspended(JobCardFooter, { props: { ...base, role: 'printer' } })
    expect(wrapper.find('[data-test="footer-holder"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-next-action"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-due"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-sla"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-price-update"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-dispatch"]').exists()).toBe(false)
    expect(wrapper.get('[data-test="footer-code"]').exists()).toBe(true)
  })

  it('marks an overdue job and never invents a remaining time', async () => {
    const overdue = await mountSuspended(JobCardFooter, {
      props: { ...base, role: 'buyer', slaMinutes: -30, isLate: true },
    })
    expect(overdue.get('[data-test="footer-sla"]').text()).toContain('Overdue')

    const unknown = await mountSuspended(JobCardFooter, {
      props: { ...base, role: 'buyer', slaMinutes: null },
    })
    expect(unknown.find('[data-test="footer-sla"]').exists()).toBe(false)
  })

  it('renders caller-supplied actions when provided', async () => {
    const wrapper = await mountSuspended(JobCardFooter, {
      props: { ...base, role: 'buyer' },
      slots: { actions: '<button data-test="cta">View order</button>' },
    })
    expect(wrapper.get('[data-test="cta"]').text()).toBe('View order')
  })

  it('omits empty cells instead of rendering blank labels', async () => {
    const wrapper = await mountSuspended(JobCardFooter, { props: { role: 'buyer' } })
    expect(wrapper.find('[data-test="footer-code"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-holder"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="footer-sla"]').exists()).toBe(false)
  })
})
