import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterView from '~/components/workbench/views/PrinterView.vue'
import { useShopStore } from '~/stores/shop'
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
  useAuthStore: () => ({
    isAuthenticated: true,
    user: authUser,
  }),
}))

function makeAssignment(overrides: Partial<JobAssignment> = {}): JobAssignment {
  return {
    id: 1,
    assignment_reference: 'PA-0001',
    managed_job: 77,
    managed_reference: 'MGR-0042',
    code: 'SJ-881',
    job_reference: 'MJ-2026-0001',
    quote_request_reference: 'QR-42',
    quote_reference: 'Q-7',
    assigned_shop: 3,
    shop_name: 'North Press',
    status: 'accepted',
    urgency_type: 'standard',
    urgency_label: 'Standard',
    operational_priority_level: 0,
    managed_job_status: 'accepted',
    managed_job_payment_status: 'confirmed',
    production_stage: 'prepress',
    production_stage_label: 'Prepress',
    production_timeline_steps: [
      { key: 'dispatch_received', label: 'Dispatch received', state: 'completed' },
      { key: 'prepress', label: 'Prepress', state: 'current' },
    ],
    current_step: 'prepress',
    next_allowed_actions: ['mark_printing'],
    payment_confirmed: true,
    payout_amount: '2562.00',
    payout_status_label: 'Pending completion',
    artwork_available: true,
    proof_status: '',
    production_order: null,
    due_at: null,
    requested_deadline: null,
    accepted_at: '2026-07-01T08:00:00Z',
    rejected_at: null,
    assignment_notes: '',
    canonical: {
      quantity: 1000,
      spec_summary: { product_type: 'Business Cards', paper: '350gsm matt lam' },
      press_sheet: 'SRA3',
      layout: { cols: 4, rows: 6, orientation: 'normal' },
      ups: 24,
      good_sheets: 40,
      sheets_billed: 42,
      spoilage: { variable_waste_rate: 5, waste_sheets_added: 2 },
      method: { machine_name: 'Konica Minolta C8000', pricing_mode: 'digital' },
      printer_payout: '2562.00',
      ready_date: '2026-07-03T17:00:00+03:00',
    },
    timing: {
      due_date: '2026-07-03T17:00:00+03:00',
      current_stage: 'prepress',
      stage_label: 'Prepress',
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
    timeline: {
      due_date: '2026-07-03T17:00:00+03:00',
      current_stage: 'prepress',
      is_late: false,
      lateness_minutes: 0,
      time_remaining_minutes: 240,
      total_allowed_minutes: 480,
      total_taken_minutes: 60,
      stages: [
        {
          key: 'accepted', label: 'Accepted', owner: 'printer', next_action: null, sla_hours: '4',
          started_at: '2026-07-01T08:00:00Z', due_at: '2026-07-01T12:00:00Z', completed_at: '2026-07-01T09:00:00Z',
          time_taken_minutes: 60, time_remaining_minutes: null, is_overdue: false, state: 'completed',
        },
        {
          key: 'prepress', label: 'Prepress', owner: 'printer', next_action: 'start printing', sla_hours: '8',
          started_at: '2026-07-01T09:00:00Z', due_at: '2026-07-01T17:00:00Z', completed_at: null,
          time_taken_minutes: null, time_remaining_minutes: 240, is_overdue: false, state: 'current',
        },
      ],
    },
    ...overrides,
  }
}

function mockApi(assignments: JobAssignment[] = []) {
  apiMock.mockImplementation((path: string) => {
    if (path === '/shop/assignments/') return Promise.resolve(assignments)
    if (path === '/shops/rate-card/setup/') {
      return Promise.resolve({ setup_status: { is_confirmed: false, completed_steps: 3, total_steps: 4 } })
    }
    return Promise.resolve([])
  })
}

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 0))
  for (let i = 0; i < 3; i += 1) await nextTick()
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })
  await flush()
  return wrapper
}

beforeEach(() => {
  apiMock.mockReset()
  authUser = { name: 'Jon Weber', email: 'jon@example.com' }
})

describe('PrinterView — production floor dashboard', () => {
  it('renders a responsive dashboard without phone-only chrome', async () => {
    mockApi()
    const wrapper = await mountView()

    const html = wrapper.html()
    expect(wrapper.attributes('class')).toContain('mx-auto')
    expect(wrapper.attributes('class')).toContain('max-w-[1200px]')
    expect(html).not.toContain('phone-frame')
    expect(html).not.toContain('max-w-[430px]')
    expect(html).not.toContain('home-indicator')
  })

  it('shows the printer allowlist and hides buyer/manager money fields', async () => {
    mockApi()
    const wrapper = await mountView()
    const text = wrapper.text()

    expect(text).toContain('You see (printer allowlist)')
    expect(text).toContain('your payout')
    expect(text).toContain('Never visible to you')
    expect(text).toContain('manager margin')
    expect(text).toContain('fee tier')
  })

  it('renders assigned jobs with sheet math and payout', async () => {
    mockApi([makeAssignment()])
    const wrapper = await mountView()
    const text = wrapper.text()

    expect(text).toContain('Assigned jobs')
    expect(text).toContain('SJ-881')
    expect(text).toContain('Business Cards')
    expect(text).toContain('SRA3')
    expect(text).toContain('24 ups per sheet')
    expect(text).toContain('42 billed')
    expect(text).toContain('40 good')
    expect(text).toContain('KSh 2,562.00')
  })

  it('opens the job detail and exposes the next floor action', async () => {
    mockApi([makeAssignment()])
    const wrapper = await mountView()

    await wrapper.get('button[aria-label="Open SJ-881"]').trigger('click')
    await flush()

    expect(document.body.textContent).toContain('Stage timeline')
    expect(document.body.textContent).toContain('Start printing')
    wrapper.unmount()
  })

  it('shows the rate card status and live job count', async () => {
    mockApi([makeAssignment()])
    const wrapper = await mountView()

    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('My rate card')
    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('3 of 4 steps done')
    expect(wrapper.text()).toContain('1 jobs live')
  })

  it('falls back to the clear-floor state when nothing is on the presses', async () => {
    mockApi([])
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Floor is clear')
    expect(wrapper.text()).not.toContain('Start printing')
  })

  it('shows the persisted company name from the current user', async () => {
    mockApi()
    authUser = { name: 'Jon Weber', email: 'jon@example.com', shop_name: 'North Press Co.' }
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('North Press Co.')
  })

  it('shows the canonical shop name from the shop record', async () => {
    mockApi()
    const pinia = createPinia()
    setActivePinia(pinia)
    useShopStore(pinia).shops = [{ id: 1, slug: 'north-press', name: 'Record Shop Ltd.' } as any]
    useShopStore(pinia).activeSlug = 'north-press'
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })
    await flush()

    expect(wrapper.text()).toContain('Record Shop Ltd.')
  })

  it('falls back to a synthesized name when no company name exists yet', async () => {
    mockApi()
    const wrapper = await mountView()

    expect(wrapper.text()).toContain('Jon Press')
  })
})
