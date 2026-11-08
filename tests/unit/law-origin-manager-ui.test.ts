import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerTrustBadges from '~/components/workbench/ManagerTrustBadges.vue'
import LockedManagerCards from '~/components/workbench/calculator/LockedManagerCards.vue'
import ManagerMarginPanel from '~/components/workbench/views/ManagerMarginPanel.vue'
import ClientMyManagersPanel from '~/components/workbench/ClientMyManagersPanel.vue'
import VerifiedManagersStrip from '~/components/design/marketing/VerifiedManagersStrip.vue'
import { useIntakeStore } from '~/stores/intake'
import { useAuthStore } from '~/stores/auth'
import { VERIFIED_MANAGERS_CHOICE_KEY, clearVerifiedManagersChoice } from '~/shared/verified-managers'
import type { ManagerPricingBreakdown, RecommendedPrintManager } from '~/shared/types'

const { apiMock, publicApiMock } = vi.hoisted(() => ({ apiMock: vi.fn(), publicApiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: publicApiMock,
    publicApiNoAuth: publicApiMock,
    getMediaUrl: vi.fn(),
  }),
}))

function manager(overrides: Partial<RecommendedPrintManager> = {}): RecommendedPrintManager {
  return {
    id: 1,
    display_name: 'Olive Origin',
    brand_name: 'Olive Origin',
    specializations: ['Booklets'],
    avg_response_hours: 2,
    completed_jobs: 12,
    satisfaction_rating: 4.8,
    distance_km: 3,
    is_previous_manager: false,
    badge: null,
    recommendation_reason: 'Completes booklet jobs near you.',
    ...overrides,
  }
}

function breakdown(overrides: Partial<ManagerPricingBreakdown> = {}): ManagerPricingBreakdown {
  return {
    printer_total: '900.00',
    markup_pct: '12.50',
    markup_amount: '112.50',
    printy_fee: '0.00',
    manager_total_to_client: '1037.50',
    per_piece: '2.08',
    ...overrides,
  }
}

beforeEach(() => {
  apiMock.mockReset()
  publicApiMock.mockReset()
  clearVerifiedManagersChoice(null)
})

// 16. "Your managers" is only for the client's own managers, and it is not
// the Verified badge.
describe('the Your managers badge', () => {
  it('does not appear when only Verified applies, and vice versa', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const verifiedOnly = await mountSuspended(ManagerTrustBadges, {
      props: { verified: true },
      global: { plugins: [pinia] },
    })
    expect(verifiedOnly.find('[data-test="your-manager-badge"]').exists()).toBe(false)
    expect(verifiedOnly.find('[data-test="verified-badge"]').exists()).toBe(true)

    const ownOnly = await mountSuspended(ManagerTrustBadges, {
      props: { yourManager: true },
      global: { plugins: [pinia] },
    })
    expect(ownOnly.find('[data-test="verified-badge"]').exists()).toBe(false)
    const badge = ownOnly.find('[data-test="your-manager-badge"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Your managers')
    // A different badge, not a re-skinned Verified one.
    expect(badge.text()).not.toBe('Verified')
    expect(badge.classes()).not.toContain('border-brand')
  })

  it('marks only the client\\u2019s own managers in a manager list', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const intake = useIntakeStore(pinia)
    intake.managers = [
      manager({ id: 9, display_name: 'Flo Yours', is_client_manager: true, is_verified: false }),
      manager({ id: 2, display_name: 'Sam New', is_client_manager: false, is_verified: false }),
      manager({ id: 3, display_name: 'Nia Verified', is_client_manager: false, is_verified: true }),
    ]
    intake.publicManagers = []
    intake.loading = false

    const wrapper = await mountSuspended(LockedManagerCards, {
      props: { query: { product_type: 'business_card', quantity: 500 }, authed: true },
      global: { plugins: [pinia] },
    })
    await flushPromises()

    expect(wrapper.findAll('[data-test="your-manager-badge"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="verified-badge"]')).toHaveLength(1)
    const text = wrapper.text()
    expect(text).toContain('Flo Yours')
    expect(text).toContain('Nia Verified')
  })
})

// 17. "0% Printy fee" is the manager's own view of the waiver.
describe('the 0% Printy fee label', () => {
  async function mountMarginPanel(options: { role?: string; fee_waived?: boolean } = {}) {
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).activeRole = (options.role ?? 'partner') as never
    const wrapper = await mountSuspended(ManagerMarginPanel, {
      props: { breakdown: breakdown({ fee_waived: options.fee_waived } as Partial<ManagerPricingBreakdown>) },
      global: { plugins: [pinia] },
    })
    await wrapper.vm.$nextTick()
    return wrapper
  }

  it('shows the label to the manager when the server waived the fee', async () => {
    const wrapper = await mountMarginPanel({ fee_waived: true })
    const label = wrapper.find('[data-test="margin-fee-waived"]')
    expect(label.exists()).toBe(true)
    expect(label.text().toLowerCase()).toContain('0% printy fee')
  })

  it('does not show the label to the manager when the fee applies', async () => {
    const wrapper = await mountMarginPanel({ fee_waived: false })
    expect(wrapper.find('[data-test="margin-fee-waived"]').exists()).toBe(false)
    expect(wrapper.text().toLowerCase()).not.toContain('0% printy fee')
  })

  it('never shows the label on a client surface, even with the flag in the payload', async () => {
    apiMock.mockResolvedValueOnce({
      results: [
        {
          id: 4,
          first_name: 'Olive',
          name: 'Olive Origin',
          photo: 'https://cdn.example/olive.jpg',
          speciality: 'Booklets',
          verified: true,
          sources: ['origin', 'paid_job'],
          paid_jobs: 2,
          last_paid_job_at: '2026-10-01T10:00:00Z',
          fee_waived: true,
        },
      ],
      count: 1,
    })
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).activeRole = 'client' as never
    const wrapper = await mountSuspended(ClientMyManagersPanel, { global: { plugins: [pinia] } })
    await flushPromises()

    expect(wrapper.find('[data-test="client-managers-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="margin-fee-waived"]').exists()).toBe(false)
    expect(wrapper.text().toLowerCase()).not.toContain('0% printy fee')
    expect(wrapper.text().toLowerCase()).not.toContain('printy fee')

    // The manager-only panel is also hidden when mounted for a client.
    const clientPanel = await mountMarginPanel({ role: 'client', fee_waived: true })
    expect(clientPanel.find('[data-test="margin-fee-waived"]').exists()).toBe(false)
    expect(clientPanel.text().toLowerCase()).not.toContain('0% printy fee')
  })
})

// 18. The homepage strip hides itself when empty and remembers a signed-out
// visitor's choice behind its one call to action.
describe('the homepage Verified managers strip', () => {
  async function mountStrip() {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(VerifiedManagersStrip, { global: { plugins: [pinia] } })
    await flushPromises()
    return wrapper
  }

  it('renders nothing at all when there are no featured managers', async () => {
    publicApiMock.mockResolvedValueOnce({ results: [], count: 0 })
    const wrapper = await mountStrip()
    expect(wrapper.find('#verified-managers').exists()).toBe(false)
    expect(wrapper.find('[data-test="verified-managers-cta"]').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('saves the verified-managers choice when a signed-out visitor requests a quote', async () => {
    window.localStorage.removeItem(VERIFIED_MANAGERS_CHOICE_KEY)
    publicApiMock.mockResolvedValueOnce({
      results: [
        { first_name: 'Olive', photo: 'https://cdn.example/olive.jpg', speciality: 'Booklets', verified: true },
        { first_name: 'Wes', photo: 'https://cdn.example/wes.jpg', speciality: 'Flyers', verified: true },
        { first_name: 'Flo', photo: 'https://cdn.example/flo.jpg', speciality: 'Posters', verified: true },
      ],
      count: 3,
    })
    const wrapper = await mountStrip()
    expect(window.localStorage.getItem(VERIFIED_MANAGERS_CHOICE_KEY)).toBeNull()

    await wrapper.get('[data-test="verified-managers-cta"]').trigger('click')
    await flushPromises()

    const saved = window.localStorage.getItem(VERIFIED_MANAGERS_CHOICE_KEY)
    expect(saved).toBeTruthy()
    expect(typeof JSON.parse(saved as string).at).toBe('string')
  })
})
