import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterView from '~/components/workbench/views/PrinterView.vue'
import { useWorkflowStore } from '~/stores/workflow'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: vi.fn(),
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

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
    const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })

    expect(wrapper.text()).toContain('Aurora Heights - Launch Brochures')
    expect(wrapper.text()).toContain('Up on your press')
    expect(wrapper.text()).toContain('Start printing')
  })

  it('keeps the rate card and floor stats available', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
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