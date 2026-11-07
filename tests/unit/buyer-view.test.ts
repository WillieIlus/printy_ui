import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerView from '~/components/workbench/views/BuyerView.vue'
import { useWorkflowStore } from '~/stores/workflow'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

async function mountBuyer() {
  const pinia = createPinia()
  setActivePinia(pinia)
  apiMock.mockImplementation((url: string) => {
    if (String(url).includes('buyer-quotes')) return Promise.resolve([])
    return Promise.resolve({ results: [] })
  })
  const wrapper = await mountSuspended(BuyerView, {
    global: { plugins: [pinia], stubs: { CalculatorView: true } },
  })
  await flushPromises()
  return { wrapper, pinia }
}

describe('BuyerView — law 7.3 one page, one tab', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('renders a single "My orders" page with no tab switcher', async () => {
    const { wrapper } = await mountBuyer()

    expect(wrapper.text()).toContain('My orders')
    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(0)
  })

  it('offers "New quote" as an action that opens the instant quote flow', async () => {
    const { wrapper, pinia } = await mountBuyer()
    const workflow = useWorkflowStore(pinia)
    expect(workflow.buyerQuoteOpen).toBe(false)

    const newQuote = wrapper.findAll('button').find((b) => b.text().includes('New quote'))!
    await newQuote.trigger('click')
    await flushPromises()

    expect(workflow.buyerQuoteOpen).toBe(true)
    expect(wrapper.text()).toContain('Back to my orders')
    expect(wrapper.findComponent({ name: 'CalculatorView' }).exists()).toBe(true)
  })
})
