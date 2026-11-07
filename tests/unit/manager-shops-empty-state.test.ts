import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerClientsView from '~/components/workbench/views/ManagerClientsView.vue'
import { useManagerStore } from '~/stores/manager'
import type { PartnerProductionShopRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

const EMPTY_STATE_COPY =
  'No confirmed printers yet. Printers appear here once they finish setup.'

function makeShop(overrides: Partial<PartnerProductionShopRow> = {}): PartnerProductionShopRow {
  return {
    id: 21,
    name: 'Northpress',
    slug: 'northpress',
    city: 'Nairobi',
    service_area: 'Westlands',
    location: 'Westlands, Nairobi',
    can_receive_requests: true,
    can_price_requests: true,
    supports_custom_requests: true,
    supports_catalog_requests: false,
    pricing_source: 'shop_rate_card',
    ...overrides,
  }
}

async function flush() {
  for (let i = 0; i < 6; i += 1) await nextTick()
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerClientsView, { global: { plugins: [pinia] } })
  const store = useManagerStore(pinia)
  return { wrapper, store }
}

async function openShopsTab(wrapper: Awaited<ReturnType<typeof mountSuspended>>) {
  const tab = wrapper.findAll('button').find((button) => button.text().includes('Production shops'))
  expect(tab, 'shops tab button').toBeTruthy()
  await tab!.trigger('click')
  await flush()
}

describe('manager production-shops directory empty state', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('shows the calm confirmed-printer empty state when the directory is empty', async () => {
    apiMock.mockResolvedValue({ results: [] })

    const { wrapper } = await mountView()
    await flush()
    await openShopsTab(wrapper)

    expect(wrapper.text()).toContain(EMPTY_STATE_COPY)
    expect(wrapper.text()).toContain('active papers, machines and printing rates')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('does not show the empty state once a confirmed printer is listed', async () => {
    apiMock.mockImplementation(async (path: string) =>
      String(path).includes('production-shops') ? { results: [makeShop()] } : { results: [] },
    )

    const { wrapper, store } = await mountView()
    await flush()
    await openShopsTab(wrapper)

    expect(store.productionShops).toHaveLength(1)
    expect(wrapper.text()).toContain('Northpress')
    expect(wrapper.text()).not.toContain(EMPTY_STATE_COPY)
  })

  it('keeps the empty state while the first load is still running', async () => {
    apiMock.mockResolvedValue(new Promise(() => {}))

    const { wrapper, store } = await mountView()
    store.loading = true
    await flush()
    await openShopsTab(wrapper)

    expect(wrapper.text()).toContain('Loading production shops')
    expect(wrapper.text()).not.toContain(EMPTY_STATE_COPY)
  })
})
