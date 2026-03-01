import type { SellerShop } from '~/services/seller'
import { listSellerShops } from '~/services/seller'

export const useSellerStore = defineStore('seller', () => {
  const shops = ref<SellerShop[]>([])
  const loading = ref(false)

  async function fetchShops() {
    loading.value = true
    try {
      shops.value = await listSellerShops()
    } catch {
      shops.value = []
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

  return { shops, loading, fetchShops, getShop, getShopBySlug }
})
