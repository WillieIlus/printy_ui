import type { Shop, ShopCreateInput, OpeningHours, ShopMember, PaginatedResponse, SocialLink } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { extractApiFeedback } from '~/utils/api-feedback'
import { parseApiError } from '~/utils/api-error'
import { safeLogError } from '~/utils/safeLog'

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
  const createFieldErrors = ref<Record<string, string>>({})
  const updateFieldErrors = ref<Record<string, string>>({})
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  function normalizeOptionalText(value?: string | null) {
    const normalized = value?.trim()
    return normalized ? normalized : null
  }

  function normalizeOptionalNumber(value?: string | number | null) {
    if (value === '' || value == null) return null
    const normalized = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(normalized) ? normalized : null
  }

  function buildShopPayload(data: ShopCreateInput) {
    const payload: Record<string, string | number> = {
      name: data.name.trim(),
      business_email: data.business_email.trim(),
      address_line: data.address_line.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      country: normalizeOptionalText(data.country) ?? 'Kenya',
    }

    const optionalTextFields = {
      description: normalizeOptionalText(data.description),
      phone_number: normalizeOptionalText(data.phone_number),
      zip_code: normalizeOptionalText(data.zip_code),
      google_place_id: normalizeOptionalText(data.google_place_id),
      opening_time: normalizeOptionalText(data.opening_time),
      closing_time: normalizeOptionalText(data.closing_time),
    }

    for (const [key, value] of Object.entries(optionalTextFields)) {
      if (value !== null) {
        payload[key] = value
      }
    }

    const latitude = normalizeOptionalNumber(data.latitude)
    if (latitude !== null) payload.latitude = latitude

    const longitude = normalizeOptionalNumber(data.longitude)
    if (longitude !== null) payload.longitude = longitude

    if (typeof data.closing_soon_minutes === 'number') {
      payload.closing_soon_minutes = data.closing_soon_minutes
    }

    return payload
  }

  function buildShopPatchPayload(data: Partial<Shop>) {
    const payload: Record<string, string | number | null> = {}

    if (data.name !== undefined) payload.name = data.name.trim()
    if (data.description !== undefined) payload.description = normalizeOptionalText(data.description)
    if (data.business_email !== undefined) payload.business_email = normalizeOptionalText(data.business_email)
    if (data.phone_number !== undefined) payload.phone_number = normalizeOptionalText(data.phone_number)
    if (data.address_line !== undefined) payload.address_line = normalizeOptionalText(data.address_line)
    if (data.city !== undefined) payload.city = normalizeOptionalText(data.city)
    if (data.state !== undefined) payload.state = normalizeOptionalText(data.state)
    if (data.country !== undefined) payload.country = normalizeOptionalText(data.country)
    if (data.zip_code !== undefined) payload.zip_code = normalizeOptionalText(data.zip_code)
    if (data.latitude !== undefined) payload.latitude = normalizeOptionalNumber(data.latitude)
    if (data.longitude !== undefined) payload.longitude = normalizeOptionalNumber(data.longitude)
    if (data.opening_time !== undefined) payload.opening_time = normalizeOptionalText(data.opening_time)
    if (data.closing_time !== undefined) payload.closing_time = normalizeOptionalText(data.closing_time)
    if (data.closing_soon_minutes !== undefined) payload.closing_soon_minutes = data.closing_soon_minutes ?? null

    return payload
  }

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
      safeLogError(err, 'shop.fetchShops')
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
      const response = await $api<Shop[] | { results: Shop[] }>(API.shops())
      const list = Array.isArray(response) ? response : (response?.results ?? [])
      myShops.value = list
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch my shops')
      safeLogError(err, 'shop.fetchMyShops')
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
      safeLogError(err, 'shop.fetchShopBySlug')
    } finally {
      loading.value = false
    }
  }

  async function createShop(data: ShopCreateInput) {
    loading.value = true
    error.value = null
    createFieldErrors.value = {}
    try {
      const { $api } = useNuxtApp()
      const shop = await $api<Shop>(API.shops(), {
        method: 'POST',
        body: buildShopPayload(data),
      })
      if (!Array.isArray(myShops.value)) {
        myShops.value = []
      }
      myShops.value.push(shop)
      return { success: true, shop }
    } catch (err: unknown) {
      const feedback = extractApiFeedback(err, 'Failed to create shop')
      error.value = feedback.message
      createFieldErrors.value = feedback.fieldErrors
      safeLogError(err, 'shop.createShop')
      return { success: false, error: feedback.message, fieldErrors: feedback.fieldErrors }
    } finally {
      loading.value = false
    }
  }

  async function updateShop(slug: string, data: Partial<Shop>) {
    loading.value = true
    error.value = null
    updateFieldErrors.value = {}
    try {
      const { $api } = useNuxtApp()
      const shop = await $api<Shop>(API.shopDetail(slug), {
        method: 'PATCH',
        body: buildShopPatchPayload(data),
      })
      currentShop.value = shop
      if (Array.isArray(myShops.value)) {
        const idx = myShops.value.findIndex((s) => s.slug === slug)
        if (idx !== -1) myShops.value[idx] = shop
      }
      return { success: true, shop }
    } catch (err: unknown) {
      const feedback = extractApiFeedback(err, 'Failed to update shop')
      error.value = feedback.message
      updateFieldErrors.value = feedback.fieldErrors
      safeLogError(err, 'shop.updateShop')
      return { success: false, error: feedback.message, fieldErrors: feedback.fieldErrors }
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
      safeLogError(err, 'shop.transferOwnership')
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
      safeLogError(err, 'shop.fetchShopMembers')
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
      safeLogError(err, 'shop.removeShopMember')
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
      safeLogError(err, 'shop.fetchShopHoursList')
      throw err
    }
  }

  async function updateShopHoursBulk(slug: string, hours: Partial<OpeningHours>[]) {
    try {
      const { $api } = useNuxtApp()
      const updated = await $api<OpeningHours[]>(API.shopHoursBulk(slug), {
        method: 'POST',
        body: { hours },
      })
      shopHours.value = Array.isArray(updated) ? updated : shopHours.value
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to update hours')
      safeLogError(err, 'shop.updateShopHoursBulk')
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
      safeLogError(err, 'shop.fetchShopSocialLinksList')
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
      safeLogError(err, 'shop.addShopSocialLink')
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
      safeLogError(err, 'shop.deleteShopSocialLink')
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
      safeLogError(err, 'shop.fetchNearbyShops')
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
    createFieldErrors,
    updateFieldErrors,
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
