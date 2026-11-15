import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerView from '~/components/workbench/views/BuyerView.vue'
import { useWorkflowStore } from '~/stores/workflow'
import { useCalculatorStore } from '~/stores/calculator'

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
    global: { plugins: [pinia], stubs: { DesignCalculator: true } },
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
    expect(wrapper.findComponent({ name: 'DesignCalculator' }).exists()).toBe(true)
  })

  it('turns a sent quote into a visible submitted request instead of a draft loop', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    let submitted = false
    const submittedItem = {
      item_type: 'quote_request',
      quote_request: {
        id: 9,
        request_reference: 'QR-9',
        status: 'submitted',
        status_label: 'Submitted',
        holder: 'Kaskazini Solutions',
        request_snapshot: { title: 'Business cards · 250 pcs' },
        created_at: '2026-11-15T08:00:00Z',
        updated_at: '2026-11-15T08:00:00Z',
      },
      section: 'unresponded',
      section_label: 'Unresponded / sent',
      needs_attention: false,
      muted: false,
    }
    apiMock.mockImplementation((url: string) => {
      if (String(url).includes('buyer-quotes')) {
        return Promise.resolve(submitted ? [submittedItem] : [])
      }
      return Promise.resolve({ results: [] })
    })
    const wrapper = await mountSuspended(BuyerView, {
      global: { plugins: [pinia], stubs: { DesignCalculator: true } },
    })
    await flushPromises()

    const workflow = useWorkflowStore(pinia)
    workflow.buyerQuoteOpen = true
    await flushPromises()

    submitted = true
    const calculator = wrapper.findComponent({ name: 'DesignCalculator' })
    calculator.vm.$emit('quote-created', 'QR-9', 5200)
    await flushPromises()

    expect(workflow.buyerQuoteOpen).toBe(false)
    expect(wrapper.find('[data-test="buyer-quote-sent"]').text()).toContain('QR-9')
    const rows = wrapper.findAll('[data-test="buyer-request-row"]')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toContain('Submitted')
    expect(rows[0]!.text()).toContain('Kaskazini Solutions')
  })

  it('reopening a draft sends that draft rather than creating a second one', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    apiMock.mockImplementation((url: string) => {
      if (String(url).includes('buyer-quotes')) {
        return Promise.resolve([{
          item_type: 'draft',
          draft: {
            id: 12,
            draft_reference: 'DR-12',
            title: 'Flyers · 100 pcs',
            status_label: 'Draft',
            status: 'draft',
            calculator_inputs_snapshot: { product_type: 'flyer', quantity: 100 },
            pricing_snapshot: { product_name: 'Flyers', quantity: 100, total: 1200 },
            created_at: '2026-11-15T08:00:00Z',
            updated_at: '2026-11-15T08:00:00Z',
          },
          section: 'unresponded',
          section_label: 'Unresponded / sent',
          needs_attention: true,
          muted: false,
        }])
      }
      return Promise.resolve({ results: [] })
    })
    const wrapper = await mountSuspended(BuyerView, {
      global: { plugins: [pinia], stubs: { DesignCalculator: true } },
    })
    await flushPromises()

    const continueButton = wrapper.findAll('button').find(button => button.text().includes('Send request'))!
    expect(continueButton).toBeTruthy()
    await continueButton.trigger('click')
    await flushPromises()

    expect(useCalculatorStore(pinia).editingDraftId).toBe(12)
    expect(useWorkflowStore(pinia).buyerQuoteOpen).toBe(true)
  })
})
