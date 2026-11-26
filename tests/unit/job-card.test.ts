import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import JobCard from '~/components/design/job/JobCard.vue'
import type { JobCardJob, JobCardThreadItem } from '~/shared/job-card'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

function thread(overrides: Partial<JobCardThreadItem> = {}): JobCardThreadItem {
  return {
    id: 'stage-1',
    type: 'stage',
    at: '2026-11-20T08:00:00Z',
    actor: { role: 'manager', name: 'Dana Manager' },
    title: 'Quote accepted',
    body: '',
    stage: 'quote_accepted',
    metadata: {},
    ...overrides,
  }
}

function job(overrides: Partial<JobCardJob> = {}): JobCardJob {
  return {
    id: 12,
    code: 'MJ-12',
    title: 'Business cards',
    stage: { key: 'production', label: 'Production' },
    owner: { role: 'buyer', label: 'Waiting on you' },
    next_action: { code: 'approve_artwork', label: 'Approve artwork', actor: 'buyer', params: { job_id: 12 } },
    due: { due_date: '2026-11-25T13:00:00Z' },
    thread: [
      thread(),
      thread({ id: 'stage-2', title: 'Artwork approval', stage: 'artwork_approval', actor: { role: 'buyer', name: 'Amina Buyer' } }),
    ],
    secondary_actions: [
      { code: 'message', label: 'Message' },
      { code: 'history', label: 'History' },
    ],
    manager: { id: 2, name: 'Dana Manager' },
    ...overrides,
  }
}

function mountCard(cardJob: JobCardJob, viewerRole: 'buyer' | 'manager' | 'printer' | 'admin' = 'buyer', extra: Record<string, unknown> = {}) {
  return mountSuspended(JobCard, {
    props: { jobs: [cardJob], viewerRole, ...extra },
  })
}

describe('JobCard', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue({
      applied: true,
      code: 'approve_artwork',
      card: { id: 'job-card-12', viewer: { role: 'buyer' }, jobs: [job({ next_action: { code: 'none', label: 'No action needed', actor: 'none' } })] },
    })
  })

  it('renders the card projection header, stage and owner', async () => {
    const wrapper = await mountCard(job())
    expect(wrapper.get('[data-test="job-card-code"]').text()).toBe('MJ-12')
    expect(wrapper.get('[data-test="job-card-title"]').text()).toBe('Business cards')
    expect(wrapper.get('[data-test="job-card-stage"]').text()).toContain('Production')
    expect(wrapper.get('[data-test="job-card-owner"]').text()).toContain('Next up: You')
  })

  it('renders the seven-stage workflow rail from the server projection', async () => {
    const keys = ['quote', 'artwork', 'payment', 'production', 'finishing', 'qc', 'delivery']
    const labels = ['Quote', 'Artwork', 'Payment', 'Production', 'Finishing', 'Quality check', 'Delivery']
    const wrapper = await mountCard(job({
      workflow: {
        stages: keys.map((key, index) => ({
          key,
          label: labels[index]!,
          index: index + 1,
          state: index < 5 ? 'done' : index === 5 ? 'current' : 'upcoming',
          is_current: index === 5,
          is_done: index < 5,
          is_action_needed: false,
        })),
        current: { key: 'qc', index: 6, label: 'Quality check', substate: 'Quality check', state: 'current' },
        completed: false,
        cancelled: false,
        disputed: false,
        owner: { role: 'printer', label: 'Waiting on the printer' },
        next_action: { code: 'none', label: 'Waiting on the printer', actor: 'printer' },
        is_action_needed: false,
        due_at: null,
        is_late: false,
      },
    }))

    const rail = wrapper.get('[data-test="job-card-workflow"]')
    expect(rail.text()).toContain('Quality check')
    expect(rail.text()).toContain('6 of 7')
    expect(wrapper.get('[data-test="job-card-stage"]').text()).toContain('Quality check')
  })

  it('renders exactly one primary action for the owner and calls the perform endpoint', async () => {
    const wrapper = await mountCard(job())
    expect(wrapper.findAll('[data-job-card-primary-action="true"]')).toHaveLength(1)
    expect(wrapper.find('[data-test="job-card-waiting"]').exists()).toBe(false)

    await wrapper.get('[data-job-card-primary-action="true"]').trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/12/actions/next/', {
      method: 'POST',
      body: { code: 'approve_artwork' },
    })
    expect(wrapper.emitted('updated')?.[0]?.[1]).toBe('approve_artwork')
    expect(wrapper.text()).toContain('Action recorded.')
  })

  it('shows a muted waiting line and no primary card for a non-owner', async () => {
    const wrapper = await mountCard(job({
      owner: { role: 'manager', label: 'Waiting on your manager' },
      next_action: { code: 'none', label: 'No action needed', actor: 'none' },
    }), 'buyer')

    expect(wrapper.find('[data-test="job-card-primary"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-job-card-primary-action="true"]')).toHaveLength(0)
    expect(wrapper.get('[data-test="job-card-waiting"]').text()).toContain('Waiting on your manager')
    expect(wrapper.get('[data-test="job-card-waiting"]').text()).toContain('This action belongs to the Manager.')
  })

  it('keeps the backend thread order and renders the five-stage vocabulary', async () => {
    const wrapper = await mountCard(job({
      thread: [
        thread({ id: 'one', title: 'First event', stage: 'quote_accepted' }),
        thread({ id: 'two', title: 'Second event', stage: 'artwork_approval' }),
        thread({ id: 'three', title: 'Third event', stage: 'production' }),
      ],
    }))

    const items = wrapper.findAll('[data-test="job-card-thread-item"]')
    expect(items.map(item => item.text())).toEqual([
      expect.stringContaining('First event'),
      expect.stringContaining('Second event'),
      expect.stringContaining('Third event'),
    ])
    expect(items[0]!.text()).toContain('Quote accepted')
    expect(items[1]!.text()).toContain('Artwork approval')
    expect(items[2]!.text()).toContain('Production')
  })

  it('renders only the parties the role projection contains', async () => {
    const buyer = await mountCard(job(), 'buyer')
    expect(buyer.text()).toContain('Manager: Dana Manager')
    expect(buyer.text()).not.toContain('North Press')
    expect(buyer.text()).not.toContain('Client secret')
    expect(buyer.text()).not.toContain('Internal status')

    const printer = await mountCard(job({
      manager: { id: 2, name: 'Dana Manager' },
      client: undefined,
      shop: undefined,
      internal_status_label: undefined,
    }), 'printer')
    expect(printer.text()).not.toContain('Client secret')
    expect(printer.text()).not.toContain('North Press')
    expect(printer.text()).not.toContain('Internal status')

    const manager = await mountCard(job({
      manager: undefined,
      client: { id: 4, name: 'Client secret' },
      shop: { id: 9, name: 'North Press' },
    }), 'manager')
    expect(manager.text()).toContain('Client: Client secret')
    expect(manager.text()).toContain('Printer: North Press')

    const admin = await mountCard(job({
      manager: undefined,
      client: { id: 4, name: 'Client secret' },
      shop: { id: 9, name: 'North Press' },
      internal_status_label: 'In production',
    }), 'admin')
    expect(admin.text()).toContain('Internal status: In production')
  })

  it('uses a link for workflow-only actions such as artwork upload', async () => {
    const wrapper = await mountCard(job({
      owner: { role: 'buyer', label: 'Waiting on you' },
      next_action: { code: 'upload_artwork', label: 'Upload your artwork', actor: 'buyer', params: { job_id: 12 } },
    }), 'buyer', { fallbackTarget: '#artwork' })

    expect(wrapper.findAll('[data-job-card-primary-action="true"]')).toHaveLength(1)
    const link = wrapper.get('[data-test="job-card-primary-link"]')
    expect(link.attributes('href')).toBe('#artwork')
  })

  it('gives the printer the QC action and never a manager confirm step', async () => {
    const wrapper = await mountCard(job({
      stage: { key: 'qc', label: 'Quality check' },
      owner: { role: 'printer', label: 'Waiting on you' },
      next_action: {
        code: 'pass_qc',
        label: 'QC passed',
        actor: 'printer',
        params: { printer_stage: 'quality_check', job_id: 12 },
      },
    }), 'printer')

    expect(wrapper.get('[data-test="job-card-primary-label"]').text()).toBe('QC passed')
    expect(wrapper.findAll('[data-job-card-primary-action="true"]')).toHaveLength(1)

    await wrapper.get('[data-job-card-primary-action="true"]').trigger('click')
    await flushPromises()
    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/12/actions/next/', {
      method: 'POST',
      body: { code: 'pass_qc' },
    })
  })

  it('shows only the muted waiting line for QC to the buyer and manager', async () => {
    const qcCard = job({
      stage: { key: 'qc', label: 'Quality check' },
      owner: { role: 'printer', label: 'Waiting on the printer' },
      next_action: { code: 'none', label: 'Waiting on the printer', actor: 'none' },
    })

    const buyer = await mountCard(qcCard, 'buyer')
    expect(buyer.find('[data-test="job-card-primary"]').exists()).toBe(false)
    expect(buyer.get('[data-test="job-card-waiting"]').text()).toContain('Waiting on your manager')

    const manager = await mountCard(qcCard, 'manager')
    expect(manager.find('[data-test="job-card-primary"]').exists()).toBe(false)
    expect(manager.get('[data-test="job-card-waiting"]').text()).toContain('Waiting on the printer')
    expect(manager.text()).not.toContain('QC passed')
  })

  it('never renders client identity or the total paid for the printer', async () => {
    const wrapper = await mountCard(job({
      manager: { id: 2, name: 'Dana Manager' },
      client: undefined,
      shop: undefined,
      internal_status_label: undefined,
    }), 'printer')

    expect(wrapper.text()).not.toContain('Client secret')
    expect(wrapper.text()).not.toContain('North Press')
    expect(wrapper.text()).not.toMatch(/KSh|KES|1,500|1500/)
  })

  it('confirms dispatch with the shop chosen inside the card', async () => {
    const wrapper = await mountCard(job({
      stage: { key: 'production', label: 'Production' },
      owner: { role: 'manager', label: 'Waiting on you' },
      next_action: {
        code: 'dispatch_job',
        label: 'Assign a printer',
        actor: 'manager',
        params: { job_id: 12 },
      },
      shop: undefined,
    }), 'manager', {
      shopOptions: [
        { id: 9, name: 'North Press', location: 'Nairobi' },
        { id: 10, name: 'Kifaru Printworks', location: 'Nairobi' },
      ],
    })

    const select = wrapper.get('[data-test="job-card-shop-select"]')
    expect((select.element as HTMLSelectElement).value).toBe('9')
    await select.setValue('10')
    await wrapper.get('[data-job-card-primary-action="true"]').trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/12/actions/next/', {
      method: 'POST',
      body: { code: 'dispatch_job', shop_id: 10 },
    })
  })

  it('does not let dispatch run without a printer choice', async () => {
    const wrapper = await mountCard(job({
      owner: { role: 'manager', label: 'Waiting on you' },
      next_action: { code: 'dispatch_job', label: 'Assign a printer', actor: 'manager' },
    }), 'manager')

    expect(wrapper.get('[data-test="job-card-shop-select"]').text()).toContain('No printer shops available')
    expect(wrapper.get('[data-job-card-primary-action="true"]').attributes('disabled')).toBeDefined()
  })

  it('adds a note to the job thread without impersonating a stage change', async () => {
    apiMock.mockResolvedValueOnce({})
    const wrapper = await mountCard(job())
    await wrapper.get('[data-test="job-card-note"]').setValue('Checking the proof now.')
    await wrapper.get('[data-test="job-card-note-form"]').trigger('submit')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/12/messages/', {
      method: 'POST',
      body: {
        body: 'Checking the proof now.',
        stage: 'production',
        audience: 'client',
      },
    })
    expect(wrapper.emitted('note-added')).toBeTruthy()
    expect(wrapper.text()).toContain('Note added to this job.')
  })

  it('keeps secondary actions in one More menu', async () => {
    const wrapper = await mountCard(job())
    const more = wrapper.get('[data-test="job-card-more"]')
    expect(more.text()).toContain('More')
    const buttons = wrapper.findAll('[data-test="job-card-secondary"]')
    expect(buttons.map(button => button.text())).toEqual(['Message', 'History'])
    await buttons[0]!.trigger('click')
    expect(wrapper.emitted('secondary')?.[0]).toEqual(['message'])
  })
})
