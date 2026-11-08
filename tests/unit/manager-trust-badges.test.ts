import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerTrustBadges from '~/components/workbench/ManagerTrustBadges.vue'
import LockedManagerCards from '~/components/workbench/calculator/LockedManagerCards.vue'
import ManagerSelectPanel from '~/components/workbench/ManagerSelectPanel.vue'
import { useIntakeStore } from '~/stores/intake'
import type { RecommendedPrintManager } from '~/shared/types'

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

describe('ManagerTrustBadges', () => {
  it('draws "Your managers" and "Verified" as two different badges', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(ManagerTrustBadges, {
      props: { yourManager: true, verified: true },
      global: { plugins: [pinia] },
    })

    const yourManager = wrapper.find('[data-test="your-manager-badge"]')
    const verified = wrapper.find('[data-test="verified-badge"]')
    expect(yourManager.text()).toBe('Your managers')
    expect(verified.text()).toBe('Verified')
    // Visually distinct: filled mint vs outlined brand.
    expect(yourManager.classes()).toContain('bg-mint')
    expect(verified.classes()).toContain('border')
    expect(verified.classes()).toContain('border-brand')
    expect(yourManager.classes()).not.toContain('border-brand')
  })

  it('renders nothing it was not given', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(ManagerTrustBadges, { global: { plugins: [pinia] } })
    expect(wrapper.text()).toBe('')
  })
})

describe('client manager lists pin the client\u2019s own managers', () => {
  beforeEach(() => {
    apiMock.mockReset()
    publicApiMock.mockReset()
  })

  it('keeps the server order and badges the pinned managers (authed list)', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const intake = useIntakeStore(pinia)
    // The server already ordered them: the client's own manager first.
    intake.managers = [
      manager({ id: 9, display_name: 'Flo Yours', is_client_manager: true, is_verified: true }),
      manager({ id: 2, display_name: 'Sam New', is_client_manager: false, is_verified: false }),
      manager({ id: 3, display_name: 'Nia Verified', is_client_manager: false, is_verified: true, badge: 'experienced' }),
    ]
    intake.publicManagers = []
    intake.loading = false

    const wrapper = await mountSuspended(LockedManagerCards, {
      props: { query: { product_type: 'business_card', quantity: 500 }, authed: true },
      global: { plugins: [pinia] },
    })
    await flushPromises()

    const names = wrapper.findAll('.font-disp').map((node) => node.text())
    expect(names[0]).toContain('Flo Yours')
    expect(wrapper.findAll('[data-test="your-manager-badge"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="verified-badge"]')).toHaveLength(2)
    // No money in a client-facing manager card.
    const text = wrapper.text().toLowerCase()
    for (const forbidden of ['fee', 'margin', 'payout', 'kes ']) {
      expect(text, `client card must not show ${forbidden}`).not.toContain(forbidden)
    }
  })

  it('badges the pinned manager in the post-draft picker too', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const intake = useIntakeStore(pinia)
    intake.managers = [
      manager({ id: 9, display_name: 'Flo Yours', is_client_manager: true, is_verified: true }),
      manager({ id: 2, display_name: 'Sam New' }),
    ]
    intake.loading = false

    const wrapper = await mountSuspended(ManagerSelectPanel, {
      props: { draftId: 5, query: { product_type: 'business_card', quantity: 500 } },
      global: { plugins: [pinia] },
    })
    await flushPromises()

    expect(wrapper.findAll('[data-test="your-manager-badge"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test="verified-badge"]')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Most recommended')
  })
})
