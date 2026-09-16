import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterView from '~/components/workbench/views/PrinterView.vue'
import { useWorkflowStore } from '~/stores/workflow'
import type { Job } from '~/shared/workflow/printy'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: vi.fn(),
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { name: 'Jon Weber', email: 'jon@example.com' },
  }),
}))

function mkJob(overrides: Partial<Job> = {}): Job {
  const base: Job = {
    id: 'j1',
    code: 'PTY-1041',
    title: 'Aurora Heights - Launch Brochures',
    product: 'Tri-fold brochure',
    qty: 5000,
    value: 2340,
    buyerId: 'b-ava',
    buyerName: 'Ava Lindqvist',
    buyerCompany: 'Studio North',
    managerId: 'm-dale',
    printerId: 'p-north',
    specs: { material: '170gsm silk', colors: 'CMYK', finish: 'Tri-fold + lamination', size: 'A4 to DL' },
    status: 'on-track',
    custody: 'held',
    stage: 'printing',
    press: 'ready',
    progress: 0,
    owner: { name: 'Jon Weber - North Press', role: 'Printer', action: 'Plates mounted', waitingHrs: 3, slaHrs: 8 },
    eta: 'Fri 15 Nov',
    placedAt: 'Fri 08 Nov',
    history: [],
    feed: [],
  }
  return { ...base, ...overrides }
}

describe('PrinterView — single responsive layout', () => {
  it('renders as one responsive column with no phone-only chrome', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })

    const html = wrapper.html()
    expect(wrapper.attributes('class')).toContain('mx-auto')
    expect(wrapper.attributes('class')).toContain('max-w-[820px]')
    expect(html).not.toContain('phone-frame')
    expect(html).not.toContain('max-w-[430px]')
    expect(html).not.toContain('floor link live')
    expect(html).not.toContain('home-indicator')
    expect(html).not.toContain('11:47')
  })

  it('shows the running press job and its advance action', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useWorkflowStore(pinia)
    store.jobs = [mkJob()]
    await nextTick()
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })

    expect(wrapper.text()).toContain('Aurora Heights - Launch Brochures')
    expect(wrapper.text()).toContain('Up on your press')
    expect(wrapper.text()).toContain('Start printing')
  })

  it('keeps the rate card and floor stats available', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useWorkflowStore(pinia)
    store.jobs = [mkJob()]
    await nextTick()
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })

    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('My rate card')
    expect(wrapper.text()).toContain('Today on the floor')
    expect(wrapper.text()).toContain('jobs live')
  })

  it('falls back to the clear-floor state when nothing is on the presses', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })
    const store = useWorkflowStore(pinia)
    store.jobs = []
    await nextTick()

    expect(wrapper.text()).toContain('Floor is clear')
    expect(wrapper.text()).not.toContain('Start printing')
  })
})