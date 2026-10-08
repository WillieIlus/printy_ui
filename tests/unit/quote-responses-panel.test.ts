import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import QuoteResponsesPanel from '~/components/workbench/QuoteResponsesPanel.vue'
import { useClientResponsesStore } from '~/stores/responses'
import type { ClientQuoteResponse } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeResponse(overrides: Partial<ClientQuoteResponse> = {}): ClientQuoteResponse {
  return {
    id: 1,
    request_id: 42,
    price: '592.00',
    currency: 'KES',
    turnaround_days: 3,
    turnaround_hours: null,
    status: 'accepted',
    latest_message: 'You accepted this quote in Printy.',
    unread_count: 2,
    payment: null,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    ...overrides,
  }
}

async function mountPanel(items: ClientQuoteResponse[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useClientResponsesStore(pinia)
  store.items = items
  apiMock.mockResolvedValue(items)
  const wrapper = await mountSuspended(QuoteResponsesPanel, { global: { plugins: [pinia] } })
  return { pinia, wrapper, store }
}

async function expand(wrapper: Awaited<ReturnType<typeof mountPanel>>['wrapper']) {
  const card = wrapper.findAll('article')[0]!
  await card.find('button[aria-expanded="false"]').trigger('click')
}

describe('QuoteResponsesPanel — expandable offer cards with payment retry', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('keeps offer details collapsed and expands them on click of the card header', async () => {
    const { wrapper } = await mountPanel([makeResponse()])

    expect(wrapper.findAll('button[aria-expanded="false"]')).toHaveLength(1)
    expect(wrapper.find('article .p-4').exists()).toBe(false)

    await expand(wrapper)

    expect(wrapper.findAll('button[aria-expanded="true"]')).toHaveLength(1)
    const details = wrapper.find('article .p-4')
    expect(details.exists()).toBe(true)
    expect(details.text()).toContain('You accepted this quote in Printy.')
  })

  it('offers a Pay now button for an accepted offer that never started a payment', async () => {
    const { wrapper } = await mountPanel([makeResponse()])
    await expand(wrapper)

    const button = wrapper.findAll('article button')[1]!
    expect(button.text()).toContain('Pay now')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows an enabled Prompt M-Pesa again button when the payment failed first time', async () => {
    const { wrapper } = await mountPanel([
      makeResponse({ payment: { id: 5, status: 'failed', payer_phone: '+254700000000' } }),
    ])
    await expand(wrapper)

    const details = wrapper.find('article .p-4')
    expect(details.text()).toContain('Payment failed')

    const button = wrapper.findAll('article button')[1]!
    expect(button.text()).toContain('Prompt M-Pesa again')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('greys out the payment button when M-Pesa already went through', async () => {
    const { wrapper } = await mountPanel([
      makeResponse({ payment: { id: 6, status: 'paid', payer_phone: '254712345678' } }),
    ])
    await expand(wrapper)

    const button = wrapper.findAll('article button')[1]!
    expect(button.text()).toContain('Paid')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('exposes the last M-Pesa phone so a retry does not ask for it again', async () => {
    const { wrapper } = await mountPanel([
      makeResponse({ payment: { id: 5, status: 'cancelled', payer_phone: '+254700000000' } }),
    ])
    await expand(wrapper)

    expect(wrapper.find('article .p-4').text()).toContain('Payment cancelled')
    const button = wrapper.findAll('article button')[1]!
    expect(button.attributes('disabled')).toBeUndefined()
  })
})