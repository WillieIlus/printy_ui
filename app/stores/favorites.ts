import type { FavoriteShop } from '~/services/favorites'
import { getFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from '~/services/favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteShop[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  const favoriteIds = computed(() => new Set(favorites.value.map((f) => f.id)))

  function isFavorite(shopId: number): boolean {
    return favoriteIds.value.has(shopId)
  }

  async function loadFavorites() {
    loading.value = true
    try {
      favorites.value = await getFavorites()
      loaded.value = true
    } catch {
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  async function toggleFavorite(shopId: number, shopName: string, shopSlug: string): Promise<boolean> {
    const wasFavorite = isFavorite(shopId)
    try {
      if (wasFavorite) {
        await removeFavoriteApi(shopId)
        favorites.value = favorites.value.filter((f) => f.id !== shopId)
        return false
      } else {
        await addFavoriteApi(shopId)
        favorites.value = [...favorites.value, { id: shopId, name: shopName, slug: shopSlug }]
        return true
      }
    } catch {
      throw new Error('Failed to update favorite')
    }
  }

  return {
    favorites,
    loading,
    loaded,
    favoriteIds,
    isFavorite,
    loadFavorites,
    toggleFavorite,
  }
})
