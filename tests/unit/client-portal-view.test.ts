import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClientPortalView from '~/components/workbench/views/ClientPortalView.vue'

const { apiHolder } = vi.hoisted(() => ({ apiHolder: { publicApi: vi.fn() } }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: vi.fn(),
    publicApi: apiHolder.publicApi,
    publicApiNoAuth: apiHolder.publicApi,
    getMediaUrl: vi.fn(),
  }),
}))

const TOKEN = 'tok-123'
const LINK = `/client-portal/links/${TOKEN}/`

function payload(overrides: Record<string, unknown> = {}) {
  return {
    code: 'PTY-1041',
    quote_reference: 'QR-20260101-0001',
    status: 'quoted',
    status_label: 'Quoted',
    delivery_preference: 'pickup',
    otp_verified: false,
    is_job: false,
    payment_status: null,
    due_date: null,
    timeline: [],
    ...overrides,
  }
}

function setupApi(
  overrides: { link?: Record<string, unknown>; paymentStatus?: string; paymentState?: string } = {},
) {
  const publicApi = vi.fn(async (path: string) => {
    if (path === LINK) return payload(overrides.link)
    if (path === `${LINK}otp/request/`) return { detail: 'We sent a code.', code: '123456' }
    if (path === `${LINK}otp/verify/`) return { detail: 'Phone verified.', otp_token: 'tok-verified' }
    if (path === `${LINK}artwork/`) return { detail: 'Artwork received.' }
    if (path === `${LINK}acknowledge/`) return { detail: 'Recorded.' }
    if (path === `${LINK}payment/`) {
      return {
        detail: 'Payment initiated.',
        payment_id: 9,
        status: overrides.paymentStatus ?? 'pending',
        state: overrides.paymentState ?? 'awaiting_confirmation',
        amount: '1500.00',
      }
    }
    return {}
  })
  apiHolder.publicApi = publicApi
  return publicApi
}

async function flush() {
  for (let i = 0; i < 8; i += 1) await nextTick()
}

async function mount() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mountSuspended(ClientPortalView, { props: { token: TOKEN }, global: { plugins: [pinia] } })
}

async function verifyOtpOf(wrapper: Awaited<ReturnType<typeof mount>>) {
  await wrapper.get('[data-test="otp-code"]').setValue('123456')
  await wrapper.get('[data-test="otp-verify"]').trigger('click')
  await flush()
}

describe('ClientPortalView — law 10.4/10.6/10.7 public client link', () => {
  beforeEach(() => {
    apiHolder.publicApi = vi.fn()
  })

  it('needs no account or email: it just loads and shows the quote summary', async () => {
    const publicApi = setupApi()
    const wrapper = await mount()
    await flush()

    expect(publicApi).toHaveBeenCalledWith(LINK, { auth: false })
    expect(wrapper.get('[data-test="quote-status"]').text()).toBe('Quoted')
    expect(wrapper.get('[data-test="quote-summary"]').text()).toContain('QR-20260101-0001')
    expect(wrapper.find('[data-test="otp-panel"]').exists()).toBe(false)
  })

  it('shows an invalid state for an expired or replaced link', async () => {
    apiHolder.publicApi = vi.fn(async () => {
      throw { statusCode: 404, data: { detail: 'This link is invalid, expired or has been replaced.' } }
    })
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="client-link-invalid"]').text()).toContain('no longer valid')
    expect(wrapper.find('[data-test="quote-summary"]').exists()).toBe(false)
  })

  it('prompts for an OTP before an action, then performs it once verified (law 10.4)', async () => {
    const publicApi = setupApi()
    const wrapper = await mount()
    await flush()

    expect(wrapper.find('[data-test="otp-panel"]').exists()).toBe(false)
    await wrapper.get('[data-test="artwork-submit"]').trigger('click')
    await flush()

    expect(publicApi).toHaveBeenCalledWith(`${LINK}otp/request/`, { auth: false, method: 'POST', body: {} })
    expect(wrapper.get('[data-test="otp-panel"]').exists()).toBe(true)

    await verifyOtpOf(wrapper)

    const artworkCall = publicApi.mock.calls.find(([path]) => path === `${LINK}artwork/`)
    expect(artworkCall).toBeTruthy()
    expect(artworkCall?.[1]).toMatchObject({ method: 'POST', auth: false, headers: { 'X-Printy-Otp': 'tok-verified' } })
    expect(wrapper.get('[data-test="artwork-step"]').text()).toContain('added')
  })

  it('shows "Awaiting confirmation" after the STK push, never "Paid" (law 10.7)', async () => {
    const publicApi = setupApi({ paymentStatus: 'pending' })
    const wrapper = await mount()
    await flush()

    // verify once on the first gated action
    await wrapper.get('[data-test="price-ack"]').trigger('click')
    await flush()
    await verifyOtpOf(wrapper)

    // the remaining reasons
    await wrapper.get('[data-test="date-ack"]').trigger('click')
    await flush()
    await wrapper.get('[data-test="artwork-submit"]').trigger('click')
    await flush()

    const payButton = wrapper.get('[data-test="pay-button"]')
    expect(payButton.attributes('disabled')).toBeUndefined()
    await payButton.trigger('click')
    await flush()

    const status = wrapper.get('[data-test="payment-status"]').text()
    expect(status).toContain('Awaiting confirmation')
    expect(status).not.toContain('Paid')
    expect(publicApi.mock.calls.some(([path]) => path === `${LINK}payment/`)).toBe(true)
  })

  it('shows "Paid" only when the backend reports a confirmed payment', async () => {
    setupApi({ link: { payment_status: 'paid' } })
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="payment-status"]').text()).toContain('Paid')
  })

  it('renders the canonical payment_state, never easing "awaiting_confirmation" into "Paid" (law 10.7)', async () => {
    setupApi({ link: { payment_state: 'awaiting_confirmation', payment_state_label: 'Awaiting confirmation' } })
    const wrapper = await mount()
    await flush()

    const status = wrapper.get('[data-test="payment-status"]').text()
    expect(status).toContain('Awaiting confirmation')
    expect(status).not.toContain('Paid')
  })

  it('renders the canonical "paid" state as Paid', async () => {
    setupApi({ link: { payment_state: 'paid', payment_state_label: 'Paid' } })
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="payment-status"]').text()).toContain('Paid')
  })

  it('renders a failed canonical state as a failed payment, never "Paid"', async () => {
    setupApi({ link: { payment_state: 'failed', payment_state_label: 'Payment failed' } })
    const wrapper = await mount()
    await flush()

    const status = wrapper.get('[data-test="payment-status"]').text()
    expect(status).toContain('Payment failed')
    expect(status).not.toContain('Paid')
  })

  it('renders a timed_out canonical state without claiming payment', async () => {
    setupApi({ link: { payment_state: 'timed_out', payment_state_label: 'Payment timed out' } })
    const wrapper = await mount()
    await flush()

    const status = wrapper.get('[data-test="payment-status"]').text()
    expect(status).toContain('Payment timed out')
    expect(status).not.toContain('Paid')
  })

  it('shows no payment banner when nothing has been attempted (not_started)', async () => {
    setupApi({ link: { payment_state: 'not_started' } })
    const wrapper = await mount()
    await flush()

    expect(wrapper.find('[data-test="payment-status"]').exists()).toBe(false)
  })

  it('uses the STK response state: a pending push stays "Awaiting confirmation"', async () => {
    const publicApi = setupApi({ paymentState: 'awaiting_confirmation' })
    const wrapper = await mount()
    await flush()

    await wrapper.get('[data-test="price-ack"]').trigger('click')
    await flush()
    await verifyOtpOf(wrapper)
    await wrapper.get('[data-test="date-ack"]').trigger('click')
    await flush()
    await wrapper.get('[data-test="artwork-submit"]').trigger('click')
    await flush()
    await wrapper.get('[data-test="pay-button"]').trigger('click')
    await flush()

    const status = wrapper.get('[data-test="payment-status"]').text()
    expect(status).toContain('Awaiting confirmation')
    expect(status).not.toContain('Paid')
    expect(publicApi.mock.calls.some(([path]) => path === `${LINK}payment/`)).toBe(true)
  })

  it('keeps the pay button disabled and lists the reasons until the prerequisites are met', async () => {
    setupApi()
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="pay-button"]').attributes('disabled')).toBeDefined()
    const reasons = wrapper.get('[data-test="pay-section"]').text()
    expect(reasons).toContain('artwork')
    expect(reasons).toContain('updated price')
  })
})
