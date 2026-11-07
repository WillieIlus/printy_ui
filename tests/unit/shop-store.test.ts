import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShopStore } from '~/stores/shop'
import type { ShopPaperRecord, ShopRecord } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeShop(overrides: Partial<ShopRecord> = {}): ShopRecord {
  return { id: 1, name: 'Northpress', slug: 'northpress', ...overrides } as ShopRecord
}

function makePaper(overrides: Partial<ShopPaperRecord> = {}): ShopPaperRecord {
  return {
    id: 5,
    name: 'Artcard 300',
    display_name: 'Artcard 300gsm',
    sheet_size: 'A4',
    gsm: 300,
    buying_price: '10.00',
    selling_price: '20.00',
    quantity_in_stock: 500,
    is_active: true,
    ...overrides,
  } as ShopPaperRecord
}

describe('shop store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetchShops normalizes the list and selects the first shop', async () => {
    apiMock.mockResolvedValue([makeShop(), makeShop({ id: 2, slug: 'second', name: 'Second' })])
    const store = useShopStore()

    await store.fetchShops()

    expect(apiMock).toHaveBeenCalledWith('/shops/')
    expect(store.shops).toHaveLength(2)
    expect(store.activeSlug).toBe('northpress')
    expect(store.identifier).toBe(1)
    expect(store.hasShop).toBe(true)
  })

  it('fetchPapers targets the active shop id and tolerates a paginated payload', async () => {
    apiMock.mockResolvedValueOnce([makeShop()]).mockResolvedValueOnce({ results: [makePaper()] })
    const store = useShopStore()

    await store.fetchShops()
    await store.fetchPapers()

    expect(apiMock).toHaveBeenLastCalledWith('/shops/1/papers/')
    expect(store.papers).toHaveLength(1)
  })

  it('updatePaper patches the nested paper endpoint and replaces it in state', async () => {
    apiMock.mockResolvedValueOnce([makeShop()]).mockResolvedValueOnce(makePaper({ selling_price: '25.00' }))
    const store = useShopStore()
    await store.fetchShops()
    store.papers = [makePaper()]

    await store.updatePaper(5, { selling_price: '25.00' } as ShopPaperRecord)

    expect(apiMock).toHaveBeenLastCalledWith('/shops/1/papers/5/', {
      method: 'PATCH',
      body: { selling_price: '25.00' },
    })
    expect(store.papers[0]!.selling_price).toBe('25.00')
  })

  it('adjustPaper posts an adjustment and stores the updated stock', async () => {
    apiMock.mockResolvedValueOnce([makeShop()]).mockResolvedValueOnce(makePaper({ quantity_in_stock: 600 }))
    const store = useShopStore()
    await store.fetchShops()
    store.papers = [makePaper()]

    await store.adjustPaper(5, 100)

    expect(apiMock).toHaveBeenLastCalledWith('/shops/1/papers/5/adjust/', {
      method: 'POST',
      body: { adjustment: 100 },
    })
    expect(store.papers[0]!.quantity_in_stock).toBe(600)
  })

  it('createMachine POSTs to the machines collection and pushes the result', async () => {
    apiMock.mockResolvedValueOnce([makeShop()]).mockResolvedValueOnce({ id: 9, name: 'Press', machine_type: 'digital' })
    const store = useShopStore()
    await store.fetchShops()

    await store.createMachine({ name: 'Press', machine_type: 'digital' } as never)

    expect(apiMock).toHaveBeenLastCalledWith('/shops/1/machines/', {
      method: 'POST',
      body: { name: 'Press', machine_type: 'digital' },
    })
    expect(store.machines).toHaveLength(1)
  })

  it('updateShop patches by slug rather than id', async () => {
    apiMock.mockResolvedValueOnce([makeShop()]).mockResolvedValueOnce(makeShop({ city: 'Mombasa' }))
    const store = useShopStore()
    await store.fetchShops()

    await store.updateShop({ city: 'Mombasa' })

    expect(apiMock).toHaveBeenLastCalledWith('/shops/northpress/', { method: 'PATCH', body: { city: 'Mombasa' } })
    expect(store.active?.city).toBe('Mombasa')
  })

  it('records an error instead of throwing when loading shops fails', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useShopStore()

    await store.fetchShops()

    expect(store.error).toBe('down')
    expect(store.hasShop).toBe(false)
  })
})
