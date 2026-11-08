import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerSendClientSection from '~/components/workbench/views/ManagerSendClientSection.vue'
import ManagerQuotesView from '~/components/workbench/views/ManagerQuotesView.vue'
import { useAuthStore } from '~/stores/auth'
import type { ManagerQuoteRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeQuote(overrides: Partial<ManagerQuoteRow> = {}): ManagerQuoteRow {
  return {
    id: 11,
    reference: 'QR-11',
    quote_request_reference: 'REQ-11',
    quote_reference: null,
    product: 'A5 Flyers',
    status: 'pending',
    raw_status: 'pending',
    status_label: 'Pending',
    customer_name: 'Ava',
    shop_name: 'Northpress',
    assigned_manager_name: 'Dale',
    request_snapshot: {},
    latest_response: null,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    managed_job: null,
    ...overrides,
  }
}

async function flush() {
  for (let i = 0; i < 5; i += 1) await nextTick()
}

async function mountSection(props: Record<string, unknown> = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerSendClientSection, {
    props: { name: '', phone: '', email: '', ...props },
    global: { plugins: [pinia] },
  })
  await flush()
  return wrapper
}

async function typePhone(wrapper: Awaited<ReturnType<typeof mountSection>>, value: string) {
  const input = wrapper.find('[data-test="send-client-phone"]')
  await input.setValue(value)
  await vi.advanceTimersByTimeAsync(500)
  await flush()
}

describe('ManagerSendClientSection — the client section on the send step', () => {
  beforeEach(() => {
    apiMock.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('asks for a name, a phone/WhatsApp number and an optional email', async () => {
    const wrapper = await mountSection()
    expect(wrapper.find('[data-test="send-client-name"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="send-client-phone"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="send-client-email"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Email (optional)')
    expect(wrapper.text()).toContain('Phone / WhatsApp')
  })

  it('labels an existing Printy client and offers no claim', async () => {
    apiMock.mockResolvedValueOnce({ phone: '254711122233', status: 'existing_client', is_client: true })
    const wrapper = await mountSection()
    await typePhone(wrapper, '0711122233')

    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/clients/lookup/', {
      query: { phone: '0711122233' },
    })
    expect(wrapper.find('[data-test="existing-client-badge"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Existing Printy client')
    expect(wrapper.find('[data-test="existing-client-note"]').text()).toContain(
      'linked to their existing account',
    )
    expect(wrapper.text().toLowerCase()).not.toContain('claim link')
  })

  it('flags a partner number instead of treating it as a client', async () => {
    apiMock.mockResolvedValueOnce({ phone: '254733112233', status: 'not_a_client', is_client: false })
    const wrapper = await mountSection()
    await typePhone(wrapper, '0733112233')

    expect(wrapper.find('[data-test="existing-client-badge"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="partner-phone-note"]').text()).toContain('partner account')
  })

  it('explains that a new number creates the client record', async () => {
    apiMock.mockResolvedValueOnce({ phone: '254799998888', status: 'new_client', is_client: false })
    const wrapper = await mountSection()
    await typePhone(wrapper, '0799998888')

    expect(wrapper.find('[data-test="new-client-note"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="new-client-note"]').text()).toContain('claim link')
  })

  it('does not ask the server for a number that is still being typed', async () => {
    const wrapper = await mountSection()
    await typePhone(wrapper, '0711')
    expect(apiMock).not.toHaveBeenCalled()
  })
})

describe('ManagerQuotesView — the client section belongs to the send step', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  async function mountView(row: ManagerQuoteRow) {
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).activeRole = 'partner'
    const wrapper = await mountSuspended(ManagerQuotesView, { global: { plugins: [pinia] } })
    await flush()
    return wrapper
  }

  it('shows the client section only while the request has no client', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote()])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const wrapper = await mountView(makeQuote())

    apiMock.mockResolvedValueOnce(makeQuote())
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    expect(wrapper.find('[data-test="send-client-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="linked-client-note"]').exists()).toBe(false)
  })

  it('replaces it with the linked client once one is attached', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote({ on_behalf_of_user_id: 7 })])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const wrapper = await mountView(makeQuote({ on_behalf_of_user_id: 7 }))

    apiMock.mockResolvedValueOnce(makeQuote({ on_behalf_of_user_id: 7 }))
    apiMock.mockResolvedValueOnce({ quote_request_id: 11, quantity: 500, size: { label: 'A5', width_mm: 148, height_mm: 210 } })
    await wrapper.find('aside button').trigger('click')
    await flush()

    expect(wrapper.find('[data-test="send-client-section"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="linked-client-note"]').text()).toContain('already linked')
  })

  it('shows the 0% fee badge the server decided for an own-client quote', async () => {
    apiMock
      .mockResolvedValueOnce([makeQuote({ fee_waived: true })])
      .mockResolvedValueOnce({ default_markup_rate: '0.7500' })
    const wrapper = await mountView(makeQuote({ fee_waived: true }))
    await flush()

    expect(wrapper.find('[data-test="quote-row-fee-waived"]').text()).toContain(
      '0% Printy fee: your own client',
    )
  })
})
