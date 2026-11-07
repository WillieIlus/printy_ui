import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterView from '~/components/workbench/views/PrinterView.vue'
import type { JobAssignment } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

let authUser: Record<string, unknown> = { name: 'Jon Weber', email: 'jon@example.com' }
vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({ isAuthenticated: true, user: authUser }),
}))

function makeAssignment(overrides: Partial<JobAssignment> = {}): JobAssignment {
  return {
    id: 1,
    assignment_reference: 'PA-0001',
    managed_job: 77,
    managed_reference: 'MGR-0042',
    code: 'QR-2026-0042',
    job_reference: 'MJ-2026-0001',
    quote_request_reference: 'QR-42',
    quote_reference: 'Q-7',
    assigned_shop: 3,
    shop_name: 'Kito Press',
    status: 'in_production',
    section: 'in_progress',
    section_label: 'Work in progress',
    needs_attention: true,
    muted: false,
    urgency_type: 'standard',
    urgency_label: 'Standard',
    operational_priority_level: 1,
    managed_job_status: 'in_production',
    managed_job_payment_status: 'confirmed',
    production_stage: 'printing',
    production_stage_label: 'Printing',
    production_timeline_steps: [],
    current_step: 'printing',
    next_allowed_actions: [],
    payment_confirmed: true,
    payout_amount: '2562.00',
    payout_status_label: 'Pending completion',
    artwork_available: true,
    proof_status: '',
    production_order: null,
    due_at: '2026-11-02T13:30:00Z',
    requested_deadline: null,
    accepted_at: '2026-07-01T08:00:00Z',
    rejected_at: null,
    assignment_notes: '',
    canonical: {
      quantity: 1000,
      spec_summary: { product_type: 'Business cards', paper: '350gsm matt lamination' },
      press_sheet: 'SRA3',
      layout: { cols: 4, rows: 6, orientation: 'normal' },
      ups: 24,
      good_sheets: 40,
      sheets_billed: 42,
      spoilage: { variable_waste_rate: 5, waste_sheets_added: 2 },
      method: { machine_name: 'Konica Minolta C8000', pricing_mode: 'digital' },
      printer_payout: '2562.00',
      ready_date: '2026-11-03T17:00:00+03:00',
    },
    timing: {
      due_date: '2026-11-02T13:30:00Z',
      current_stage: 'production',
      stage_label: 'Production',
      stage_owner: 'printer',
      next_action: 'start printing',
      stage_sla_hours: 8,
      time_remaining_minutes: 240,
      is_late: false,
      lateness_minutes: null,
      revision_count: 0,
      stage_timestamps: null,
      due_date_updated: false,
      due_date_updated_old: null,
      due_date_updated_new: null,
      due_date_acknowledged_at: '2026-06-30T10:00:00Z',
    },
    printer_action: {
      stage_key: 'printing',
      stage_label: 'Printing',
      action: 'started',
      label: 'Start printing',
      kind: 'advance',
    },
    printer_workflow: {
      current_stage: 'printing',
      current_stage_label: 'Printing',
      current_note: 'Printing',
      paid: true,
      finished: false,
      time_taken_minutes: 42,
      stages: [
        {
          key: 'artwork_check', label: 'Artwork check', kind: 'single', state: 'done',
          started_at: null, completed_at: null, time_taken_minutes: 12, budget_minutes: 60,
          is_overdue: false, start_action: '', done_action: 'Artwork checked',
        },
        {
          key: 'printing', label: 'Printing', kind: 'start_done', state: 'in_progress',
          started_at: null, completed_at: null, time_taken_minutes: 30, budget_minutes: 180,
          is_overdue: false, start_action: 'Start printing', done_action: 'Printing done',
        },
      ],
    },
    ...overrides,
  }
}

function advanceResponse(base: JobAssignment, label: string, stageKey: string): JobAssignment {
  return {
    ...base,
    printer_action: { ...base.printer_action!, stage_key: stageKey, label },
    printer_workflow: base.printer_workflow ? { ...base.printer_workflow, current_stage: stageKey, current_stage_label: label } : null,
  }
}

let advanceResult: (base: JobAssignment) => JobAssignment | Promise<never>

function mockApi(assignments: JobAssignment[] = []) {
  apiMock.mockImplementation((url: string) => {
    if (url === '/shop/assignments/') return Promise.resolve(assignments)
    if (url === '/shops/rate-card/setup/') {
      return Promise.resolve({ setup_status: { is_confirmed: false, completed_steps: 3, total_steps: 4 } })
    }
    if (url === '/shops/') return Promise.resolve([])
    if (url.endsWith('/advance/')) {
      const id = Number(url.split('/')[3])
      const base = assignments.find((item) => item.id === id) ?? makeAssignment()
      return Promise.resolve(advanceResult(base))
    }
    if (url.endsWith('/undo/')) {
      const id = Number(url.split('/')[3])
      const base = assignments.find((item) => item.id === id) ?? makeAssignment()
      return Promise.resolve({
        ...base,
        printer_action: { ...base.printer_action!, label: 'Start printing' },
      })
    }
    return Promise.resolve([])
  })
}

async function mountView(assignments: JobAssignment[] = []) {
  const pinia = createPinia()
  setActivePinia(pinia)
  mockApi(assignments)
  const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })
  await flushPromises()
  await nextTick()
  return wrapper
}

beforeEach(() => {
  apiMock.mockReset()
  authUser = { name: 'Jon Weber', email: 'jon@example.com' }
  advanceResult = (base) => advanceResponse(base, 'Printing done', 'printing')
  Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Printer dashboard — prompt 5', () => {
  it('renders the next action label from the API, in large type with timing', async () => {
    const wrapper = await mountView([makeAssignment()])
    const text = wrapper.text()

    expect(text).toContain('QR-2026-0042')
    expect(text).toContain('1,000 business cards')
    expect(text).toContain('Printing')
    expect(text).toContain('Start printing')
    expect(text).toContain('Printing 30 min')
    expect(text).toContain('Total 42 min')
    expect(text.toLowerCase()).toContain('due')
  })

  it('advances with one tap, sending the expected stage and a request id', async () => {
    const base = makeAssignment()
    const wrapper = await mountView([base])

    await wrapper.get('.job-action').trigger('click')
    await flushPromises()
    await nextTick()

    const advanceCall = apiMock.mock.calls.find(([url]) => String(url).endsWith('/advance/'))
    expect(advanceCall).toBeTruthy()
    expect(advanceCall![1]).toMatchObject({
      method: 'POST',
      body: expect.objectContaining({ expected_stage: 'printing', request_id: expect.any(String) }),
    })
    expect(wrapper.text()).toContain('Printing done')
  })

  it('does not advance twice on a fast double tap', async () => {
    let release: ((value: JobAssignment) => void) | null = null
    advanceResult = (base) => new Promise<JobAssignment>((resolve) => {
      release = (value) => resolve(value)
    }).then(() => advanceResponse(base, 'Printing done', 'printing'))
    const wrapper = await mountView([makeAssignment()])

    await wrapper.get('.job-action').trigger('click')
    await wrapper.get('.job-action').trigger('click')
    await nextTick()

    const advanceCalls = apiMock.mock.calls.filter(([url]) => String(url).endsWith('/advance/'))
    expect(advanceCalls.length).toBe(1)
    release?.(makeAssignment())
    await flushPromises()
  })

  it('shows "Done. Undo" for two minutes and reverts through the undo endpoint', async () => {
    const wrapper = await mountView([makeAssignment()])

    await wrapper.get('.job-action').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Done.')
    expect(wrapper.text()).toContain('Undo')

    await wrapper.get('.undo-toast__button').trigger('click')
    await flushPromises()

    const undoCall = apiMock.mock.calls.find(([url]) => String(url).endsWith('/undo/'))
    expect(undoCall).toBeTruthy()
    expect(wrapper.text()).toContain('Start printing')
    expect(wrapper.find('.undo-toast').exists()).toBe(false)
  })

  it('queues an offline tap, shows "Not sent yet" and syncs it once when back online', async () => {
    const base = makeAssignment()
    advanceResult = (assignment) => {
      if (!navigator.onLine) return Promise.reject(Object.assign(new Error('offline'), { statusCode: 0 }))
      return advanceResponse(assignment, 'Printing done', 'printing')
    }
    const wrapper = await mountView([base])
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })

    await wrapper.get('.job-action').trigger('click')
    await flushPromises()
    await nextTick()

    expect(wrapper.text()).toContain('Not sent yet')
    expect(wrapper.text()).toContain('waiting to send')

    const callsBefore = apiMock.mock.calls.filter(([url]) => String(url).endsWith('/advance/')).length
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true })
    window.dispatchEvent(new Event('online'))
    await flushPromises()
    await nextTick()

    const callsAfter = apiMock.mock.calls.filter(([url]) => String(url).endsWith('/advance/')).length
    expect(callsAfter).toBe(callsBefore + 1)
    expect(wrapper.text()).not.toContain('Not sent yet')
  })

  it('puts late jobs first inside a group and finished jobs last', async () => {
    const onTime = makeAssignment({ id: 1, code: 'QR-ON-TIME', timing: { ...makeAssignment().timing!, due_date: '2026-11-05T13:30:00Z' } })
    const late = makeAssignment({ id: 2, code: 'QR-LATE', timing: { ...makeAssignment().timing!, due_date: '2026-11-01T13:30:00Z', is_late: true, lateness_minutes: 90 } })
    const finished = makeAssignment({
      id: 3,
      code: 'QR-DONE',
      status: 'completed',
      section: 'completed',
      section_label: 'Completed and paid',
      muted: true,
      needs_attention: false,
      printer_action: { stage_key: '', stage_label: '', action: 'none', label: 'All steps complete', kind: 'none' },
    })
    const wrapper = await mountView([onTime, finished, late])

    const codes = wrapper.findAll('.jobcard__code').map((node) => node.text())
    expect(codes[0]).toBe('QR-LATE')
    expect(codes[1]).toBe('QR-ON-TIME')
    expect(codes[codes.length - 1]).toBe('QR-DONE')
  })

  it('never renders buyer identity or buyer money', async () => {
    const leaked = {
      ...makeAssignment(),
      client_name: 'Asha Buyer',
      client_email: 'asha@printy.test',
      client_total: '9999.00',
      manager_margin: '7777.00',
    } as unknown as JobAssignment
    const wrapper = await mountView([leaked])
    const html = wrapper.html()

    expect(html).not.toContain('Asha Buyer')
    expect(html).not.toContain('asha@printy.test')
    expect(html).not.toContain('9999')
    expect(html).not.toContain('7777')
  })

  it('keeps the action at least 56px tall and full width on phones', async () => {
    const source = readFileSync(
      path.resolve(process.cwd(), 'app/components/workbench/views/JobCard.vue'),
      'utf8',
    )
    expect(source).toContain('min-height: 56px')
    expect(source).toContain('width: 100%')
    expect(source).toContain('@media (min-width: 640px)')

    const wrapper = await mountView([makeAssignment()])
    expect(wrapper.get('.job-action').exists()).toBe(true)
  })

  it('keeps the shop name, rate-card status and clear-floor state', async () => {
    const wrapper = await mountView([])

    expect(wrapper.text()).toContain('Floor is clear')
    expect(wrapper.text()).toContain('Jon Press')
    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('My rate card')
    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('3 of 4 steps done')
  })

  it('shows the persisted shop name from the current user', async () => {
    authUser = { name: 'Jon Weber', email: 'jon@example.com', shop_name: 'North Press Co.' }
    const wrapper = await mountView([])

    expect(wrapper.text()).toContain('North Press Co.')
  })
})
