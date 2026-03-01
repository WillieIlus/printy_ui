import { listQuoteRequests } from '~/services/quoteDraft'

const RATABLE_STATUSES = ['SENT', 'ACCEPTED']

export function useRatableShops() {
  const ratableShopIds = ref<Set<number>>(new Set())
  const loaded = ref(false)

  async function load() {
    try {
      const quotes = await listQuoteRequests()
      ratableShopIds.value = new Set(
        quotes
          .filter((q) => RATABLE_STATUSES.includes(q.status))
          .map((q) => q.shop)
      )
    } catch {
      ratableShopIds.value = new Set()
    } finally {
      loaded.value = true
    }
  }

  function canRate(shopId: number): boolean {
    return ratableShopIds.value.has(shopId)
  }

  return { ratableShopIds, loaded, load, canRate }
}
