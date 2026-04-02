import { API } from '~/shared/api-paths'

export interface BackendSetupStatus {
  has_shop: boolean
  has_machines?: boolean
  has_papers?: boolean
  has_materials?: boolean
  has_pricing: boolean
  has_finishing: boolean
  has_products?: boolean
  blocking_reason?: string
  next_step: string
  next_url: string
  completed_steps: string[]
  pending_steps: string[]
}

function normalizeNextUrl(nextUrl?: string | null) {
  if (!nextUrl) return '/dashboard'
  if (nextUrl.startsWith('/api/')) return nextUrl.replace(/^\/api/, '') || '/dashboard'
  return nextUrl
}

export const useSetupStatusStore = defineStore('setupStatus', () => {
  const status = ref<BackendSetupStatus | null>(null)
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)

  async function fetchStatus(shopSlug?: string | null) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<BackendSetupStatus>(
        shopSlug ? API.shopSetupStatus(shopSlug) : API.setupStatus(),
      )
      status.value = {
        ...response,
        next_url: normalizeNextUrl(response.next_url),
      }
      loaded.value = true
      return status.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load setup status.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    status,
    loading,
    loaded,
    error,
    fetchStatus,
  }
})
