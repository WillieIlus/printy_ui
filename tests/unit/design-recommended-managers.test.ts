import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DesignRecommendedManagers from '~/components/design/marketing/RecommendedManagers.vue'
import { API } from '~/shared/api-paths'
import type {
  PublicRecommendedManager,
  PublicRecommendedManagersResponse,
} from '~/shared/types'
import { useAuthStore } from '~/stores/auth'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: (path: string | null) => path ?? '',
  }),
}))

function manager(overrides: Partial<PublicRecommendedManager> = {}): PublicRecommendedManager {
  return {
    public_id: 'manager-1',
    display_name: 'Amara Wanjiru',
    photo_url: null,
    verified: true,
    availability: { status: 'available_now', label: 'Available now', active_jobs: 0 },
    ready_by: '2026-11-13T10:00:00+03:00',
    ready_label: 'Fri 13 Nov, 10:00',
    price: { total: '4320.00', per_piece: '43.20', currency: 'KES' },
    on_time_pct: null,
    completed_jobs: 0,
    recommended: false,
    ...overrides,
  }
}

function recommendation(): PublicRecommendedManagersResponse {
  return {
    tiers: {
      standard: {
        key: 'standard',
        label: 'Standard',
        not_offered: false,
        turnaround_hours: 80,
        managers: [
          manager({ public_id: 'big', display_name: 'Amara Wanjiru', recommended: true }),
          manager({ public_id: 'small', display_name: 'Brian Otieno', completed_jobs: 22, on_time_pct: 95.5 }),
        ],
      },
      faster: {
        key: 'faster',
        label: 'Faster +50%',
        not_offered: false,
        turnaround_hours: 40,
        managers: [
          manager({ public_id: 'fast', display_name: 'Cynthia Mwangi', recommended: true }),
        ],
      },
      fastest: {
        key: 'fastest',
        label: 'Fastest +100%',
        not_offered: false,
        turnaround_hours: 20,
        managers: [],
      },
    },
    meta: {
      product_type: 'business_card',
      quantity: 100,
      currency: 'KES',
      generated_at: '2026-11-12T10:00:00+03:00',
    },
  }
}

function mountManagers(speedId = 'standard', pinia = createPinia()) {
  setActivePinia(pinia)
  return mountSuspended(DesignRecommendedManagers, {
    global: { plugins: [pinia] },
    props: {
      speedId,
      speedLabel: 'Standard',
      totalLabel: 'KSh 4,320',
      perPieceLabel: 'KSh 43.20 / card',
      payload: { product_type: 'business_card', quantity: 100 },
      turnaroundHours: 80,
    },
  })
}

function buttonWithLabel(wrapper: Awaited<ReturnType<typeof mountManagers>>, text: string) {
  return wrapper.findAll('button').find(button => button.text().includes(text))
}

describe('recommended managers — live homepage section', () => {
  beforeEach(() => {
    apiMock.mockReset()
    setActivePinia(createPinia())
  })

  it('renders the managers and ready-by data returned by the server', async () => {
    apiMock.mockImplementation((path: string) => {
      if (path === API.managers.recommended) return Promise.resolve(recommendation())
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountManagers()
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Amara Wanjiru')
    expect(text).toContain('Brian Otieno')
    expect(text).toContain('Ready by Fri 13 Nov, 10:00')
    expect(text).toContain('AW')
    expect(text).toContain('BO')
    expect(text).toContain('96% on time')
    expect(text).toContain('22 jobs')
    expect(text).toContain('Live availability')
    expect(text).not.toContain('Sample managers')
    expect(apiMock).toHaveBeenCalledWith(
      API.managers.recommended,
      expect.objectContaining({
        method: 'POST',
        auth: false,
        body: expect.objectContaining({ turnaround_hours: 80 }),
      }),
    )
  })

  it('shows the tier the parent speed card selected without refetching', async () => {
    apiMock.mockImplementation((path: string) => {
      if (path === API.managers.recommended) return Promise.resolve(recommendation())
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountManagers('faster')
    await flushPromises()

    expect(wrapper.text()).toContain('Cynthia Mwangi')
    expect(wrapper.text()).not.toContain('Amara Wanjiru')
    expect(apiMock).toHaveBeenCalledTimes(1)
  })

  it('persists a buyer lock and unlock through the buyer endpoints', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    auth.user = {
      id: 7,
      email: 'buyer@test.ke',
      name: 'Buyer',
      role: 'client',
      can_access_client_dashboard: true,
    }

    apiMock.mockImplementation((path: string, options?: { method?: string }) => {
      if (path === API.managers.recommended) return Promise.resolve(recommendation())
      if (path === API.managers.locked) {
        return Promise.resolve({ results: [], count: 0, cap: 3 })
      }
      if (path === API.managers.lockedManager('big') && options?.method === 'PUT') {
        return Promise.resolve({
          locked: true,
          created: true,
          public_id: 'big',
          display_name: 'Amara Wanjiru',
          count: 1,
          cap: 3,
        })
      }
      if (path === API.managers.lockedManager('big') && options?.method === 'DELETE') {
        return Promise.resolve(undefined)
      }
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountManagers('standard', pinia)
    await flushPromises()

    await buttonWithLabel(wrapper, 'Lock Amara')!.trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith(
      API.managers.lockedManager('big'),
      expect.objectContaining({ method: 'PUT' }),
    )
    expect(wrapper.text()).toContain('Locked')
    expect(wrapper.text()).toContain('Your managers')
    expect(wrapper.text()).toContain('1 of 3 locked')

    await buttonWithLabel(wrapper, 'Unlock')!.trigger('click')
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith(
      API.managers.lockedManager('big'),
      expect.objectContaining({ method: 'DELETE' }),
    )
    expect(wrapper.text()).toContain('Lock Amara')
    expect(wrapper.text()).not.toContain('Your managers')
  })

  it('uses the authenticated is_locked flag when the shortlist read fails', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    auth.user = {
      id: 7,
      email: 'buyer@test.ke',
      name: 'Buyer',
      role: 'client',
      can_access_client_dashboard: true,
    }

    const locked = recommendation()
    locked.tiers.standard!.managers[0]!.is_locked = true

    apiMock.mockImplementation((path: string) => {
      if (path === API.managers.recommended) return Promise.resolve(locked)
      if (path === API.managers.locked) return Promise.reject(new Error('shortlist read failed'))
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountManagers('standard', pinia)
    await flushPromises()

    expect(wrapper.text()).toContain('Locked')
    expect(wrapper.text()).toContain('Your managers')
    expect(wrapper.text()).toContain('Unlock')
  })

  it('explains the lock cap instead of silently failing', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    auth.user = {
      id: 7,
      email: 'buyer@test.ke',
      name: 'Buyer',
      role: 'client',
      can_access_client_dashboard: true,
    }

    apiMock.mockImplementation((path: string, options?: { method?: string }) => {
      if (path === API.managers.recommended) return Promise.resolve(recommendation())
      if (path === API.managers.locked) {
        return Promise.resolve({
          results: [
            { public_id: 'one' },
            { public_id: 'two' },
            { public_id: 'three' },
          ],
          count: 3,
          cap: 3,
        })
      }
      if (path === API.managers.lockedManager('big') && options?.method === 'PUT') {
        return Promise.reject({ data: { code: 'lock_limit_reached', detail: 'Too many locks.' } })
      }
      return Promise.reject(new Error(`unexpected path ${path}`))
    })

    const wrapper = await mountManagers('standard', pinia)
    await flushPromises()

    await buttonWithLabel(wrapper, 'Lock Amara')!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('You can lock up to 3 managers. Unlock one first.')
    expect(wrapper.text()).toContain('Lock Amara')
  })
})
