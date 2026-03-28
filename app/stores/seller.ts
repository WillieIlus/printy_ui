import type { SellerShop } from '~/services/seller'
import { listSellerShops } from '~/services/seller'

export const useSellerStore = defineStore('seller', () => {
  const shops = ref<SellerShop[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function fetchShops() {
    loading.value = true
    try {
      shops.value = await listSellerShops()
      loaded.value = true
    } catch {
      shops.value = []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function getShop(id: number): SellerShop | undefined {
    return shops.value.find((s) => s.id === id)
  }

  function getShopBySlug(slug: string): SellerShop | undefined {
    return shops.value.find((s) => s.slug === slug)
  }

  return { shops, loading, loaded, fetchShops, getShop, getShopBySlug }
})
