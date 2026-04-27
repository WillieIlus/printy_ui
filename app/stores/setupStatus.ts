import { API } from '~/shared/api-paths'

export interface BackendSetupStatus {
  has_shop: boolean
  has_machines?: boolean
  has_papers?: boolean
  has_materials?: boolean
  materials_count?: number
  has_pricing: boolean
  has_pricing_rules?: boolean
  pricing_rules_count?: number
  has_finishing: boolean
  has_finishing_rates?: boolean
  finishing_rates_count?: number
  has_products?: boolean
  shop_profile_complete?: boolean
  turnaround_configured?: boolean
  shop_published?: boolean
  can_receive_requests?: boolean
  can_price_requests?: boolean
  rate_card_completeness?: number
  setup_percent?: number
  warnings?: string[]
  recommendations?: string[]
  blocking_reason?: string
  next_step: string
  next_url: string
  completed_steps: string[]
  pending_steps: string[]
  steps?: BackendSetupStep[]
}

export interface BackendSetupStep {
  key: string
  label: string
  done: boolean
  accessible: boolean
  cta_label: string
  cta_url: string
  blocking_reason: string
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
        warnings: response.warnings ?? [],
        recommendations: response.recommendations ?? [],
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
