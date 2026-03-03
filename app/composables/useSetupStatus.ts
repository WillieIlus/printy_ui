import { useApi } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { useAuthStore } from '~/stores/auth'

export interface SetupStatus {
  has_shop: boolean
  has_papers: boolean
  has_machines: boolean
  has_pricing: boolean
  has_finishing: boolean
  has_published_products: boolean
  pricing_ready: boolean
  next_step: 'shop' | 'papers' | 'machines' | 'pricing' | 'products' | 'done'
  blocking_reason: string
}

const STEP_ROUTES: Record<string, string> = {
  shop: '/dashboard/shops/create',
  machines: '/dashboard/machines',
  papers: '/dashboard/papers',
  pricing: '/dashboard/pricing',
  products: '/dashboard/products',
  done: '/dashboard',
}

const _status = ref<SetupStatus | null>(null)
const _loading = ref(false)
const _dismissed = ref(false)

export function useSetupStatus() {
  const authStore = useAuthStore()

  if (import.meta.client) {
    _dismissed.value = localStorage.getItem('setup-dismissed') === '1'
  }

  const isSetupComplete = computed(() => _status.value?.next_step === 'done')
  const nextRoute = computed(() => STEP_ROUTES[_status.value?.next_step ?? 'done'] ?? '/dashboard')

  async function refresh() {
    if (!authStore.isAuthenticated) return
    _loading.value = true
    try {
      const api = useApi()
      _status.value = await api<SetupStatus>(API.setupStatus())
    } catch {
      _status.value = null
    } finally {
      _loading.value = false
    }
  }

  function dismiss() {
    _dismissed.value = true
    if (import.meta.client) {
      localStorage.setItem('setup-dismissed', '1')
    }
  }

  function undismiss() {
    _dismissed.value = false
    if (import.meta.client) {
      localStorage.removeItem('setup-dismissed')
    }
  }

  return {
    status: _status,
    loading: _loading,
    dismissed: _dismissed,
    isSetupComplete,
    nextRoute,
    refresh,
    dismiss,
    undismiss,
    STEP_ROUTES,
  }
}
