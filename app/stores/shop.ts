import type { Shop, ShopCreateInput, OpeningHours, ShopMember, PaginatedResponse, SocialLink } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export const useShopStore = defineStore('shop', () => {
  const shops = ref<Shop[]>([])
  const myShops = ref<Shop[]>([])
  const currentShop = ref<Shop | null>(null)
  const nearbyShops = ref<Shop[]>([])
  const shopMembers = ref<ShopMember[]>([])
  const shopHours = ref<OpeningHours[]>([])
  const shopSocialLinks = ref<SocialLink[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  // ---------------------------------------------------------------------------
  // Shops – CRUD
  // ---------------------------------------------------------------------------
  async function fetchShops(params?: Record<string, string | number>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<PaginatedResponse<Shop>>(API.shops(), { params })
      shops.value = response?.results ?? []
      pagination.value = {
        count: response?.count ?? 0,
        next: response?.next ?? null,
        previous: response?.previous ?? null,
      }
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch shops')
      console.error('fetchShops error:', err)
      shops.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchMyShops() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<{ owned: Shop[]; member_of: Shop[] }>(API.shopsMyShops())
      myShops.value = [...(response.owned ?? []), ...(response.member_of ?? [])]
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch my shops')
      console.error('fetchMyShops error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchShopBySlug(slug: string) {
    loading.value = true
    error.value = null
    // Only clear when fetching a different shop. Clearing while same shop is displayed causes
    // Vue unmount errors when navigating between shop sub-pages (e.g. index -> request-quote).
    const isSameShop = currentShop.value?.slug === slug
    if (!isSameShop) {
      currentShop.value = null
    }
    try {
      const { $api } = useNuxtApp()
      const data = await $api<Shop>(API.shopDetail(slug))
      currentShop.value = data
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch shop')
      console.error('fetchShopBySlug error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createShop(data: ShopCreateInput) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const shop = await $api<Shop>(API.shops(), {
        method: 'POST',
        body: data,
      })
      if (!Array.isArray(myShops.value)) {
        myShops.value = []
      }
      myShops.value.push(shop)
      return { success: true, shop }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to create shop')
      error.value = message
      console.error('createShop error:', err)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function updateShop(slug: string, data: Partial<Shop>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const shop = await $api<Shop>(API.shopDetail(slug), {
        method: 'PATCH',
        body: data,
      })
      currentShop.value = shop
      if (Array.isArray(myShops.value)) {
        const idx = myShops.value.findIndex((s) => s.slug === slug)
        if (idx !== -1) myShops.value[idx] = shop
      }
      return { success: true, shop }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to update shop')
      error.value = message
      console.error('updateShop error:', err)
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Ownership transfer
  // ---------------------------------------------------------------------------
  async function transferOwnership(slug: string, newOwnerId: number) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.shopTransferOwnership(slug), {
        method: 'POST',
        body: { new_owner_id: newOwnerId },
      })
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to transfer ownership')
      console.error('transferOwnership error:', err)
      return { success: false, error: message }
    }
  }

  // ---------------------------------------------------------------------------
  // Members
  // ---------------------------------------------------------------------------
  async function fetchShopMembers(slug: string) {
    try {
      const { $api } = useNuxtApp()
      shopMembers.value = await $api<ShopMember[]>(API.shopMembers(slug))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch members')
      console.error('fetchShopMembers error:', err)
      throw err
    }
  }

  async function removeShopMember(slug: string, pk: number) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.shopMemberDetail(slug, pk), { method: 'DELETE' })
      shopMembers.value = shopMembers.value.filter((m) => m.id !== pk)
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to remove member')
      console.error('removeShopMember error:', err)
      return { success: false, error: message }
    }
  }

  // ---------------------------------------------------------------------------
  // Hours
  // ---------------------------------------------------------------------------
  async function fetchShopHoursList(slug: string) {
    try {
      const { $api } = useNuxtApp()
      shopHours.value = await $api<OpeningHours[]>(API.shopHours(slug))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch hours')
      console.error('fetchShopHoursList error:', err)
      throw err
    }
  }

  async function updateShopHoursBulk(slug: string, hours: Partial<OpeningHours>[]) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.shopHoursBulk(slug), {
        method: 'POST',
        body: { hours },
      })
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to update hours')
      console.error('updateShopHoursBulk error:', err)
      return { success: false, error: message }
    }
  }

  // ---------------------------------------------------------------------------
  // Social links
  // ---------------------------------------------------------------------------
  async function fetchShopSocialLinksList(slug: string) {
    try {
      const { $api } = useNuxtApp()
      shopSocialLinks.value = await $api<SocialLink[]>(API.shopSocialLinks(slug))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch social links')
      console.error('fetchShopSocialLinksList error:', err)
      throw err
    }
  }

  async function addShopSocialLink(slug: string, link: Omit<SocialLink, 'id'>) {
    try {
      const { $api } = useNuxtApp()
      const newLink = await $api<SocialLink>(API.shopSocialLinks(slug), {
        method: 'POST',
        body: link,
      })
      shopSocialLinks.value.push(newLink)
      return { success: true, link: newLink }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to add link')
      console.error('addShopSocialLink error:', err)
      return { success: false, error: message }
    }
  }

  async function deleteShopSocialLink(slug: string, pk: number) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.shopSocialLinkDetail(slug, pk), { method: 'DELETE' })
      shopSocialLinks.value = shopSocialLinks.value.filter((l) => l.id !== pk)
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to delete link')
      console.error('deleteShopSocialLink error:', err)
      return { success: false, error: message }
    }
  }

  // ---------------------------------------------------------------------------
  // Nearby
  // ---------------------------------------------------------------------------
  async function fetchNearbyShops(params: { lat: number; lng: number; radius?: number }) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      nearbyShops.value = await $api<Shop[]>(API.shopsNearby(), { params })
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch nearby shops')
      console.error('fetchNearbyShops error:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    shops,
    myShops,
    currentShop,
    nearbyShops,
    shopMembers,
    shopHours,
    shopSocialLinks,
    loading,
    error,
    pagination,

    // Actions
    fetchShops,
    fetchMyShops,
    fetchShopBySlug,
    createShop,
    updateShop,
    transferOwnership,
    fetchShopMembers,
    removeShopMember,
    fetchShopHoursList,
    updateShopHoursBulk,
    fetchShopSocialLinksList,
    addShopSocialLink,
    deleteShopSocialLink,
    fetchNearbyShops,
  }
})