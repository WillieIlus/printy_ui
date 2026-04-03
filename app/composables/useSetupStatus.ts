import { storeToRefs } from 'pinia'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'
import { resolveSetupFlow } from '~/utils/setupFlow'

export function useSetupStatus() {
  const setupStore = useSetupStatusStore()
  const shopStore = useShopStore()
  const router = useRouter()
  const { status, loading, loaded, error } = storeToRefs(setupStore)

  const resolvedShopSlug = computed(() => shopStore.selectedShopSlug ?? null)
  const flow = computed(() => resolveSetupFlow(status.value, resolvedShopSlug.value))
  const isSetupComplete = computed(() => flow.value.nextRequiredStep === null)
  const nextRoute = computed(() => flow.value.nextRequiredRoute || status.value?.next_url || '/dashboard')

  async function refresh(shopSlug?: string | null) {
    const targetShop = shopSlug ?? shopStore.selectedShopSlug ?? null
    return await setupStore.fetchStatus(targetShop)
  }

  async function refreshAndNavigate(options?: {
    shopSlug?: string | null
    fallbackUrl?: string
    replace?: boolean
    onlyWhenNextUrlChanges?: boolean
  }) {
    const targetShop = options?.shopSlug ?? shopStore.selectedShopSlug ?? null
    const currentPath = router.currentRoute.value.path
    const latest = await refresh(targetShop)
    const target = latest?.next_url || options?.fallbackUrl || '/dashboard'
    if (!target) return latest
    if (options?.onlyWhenNextUrlChanges && currentPath === target) return latest
    if (currentPath !== target) {
      await navigateTo(target, { replace: options?.replace ?? true })
    }
    return latest
  }

  return {
    status,
    loading,
    loaded,
    error,
    flow,
    isSetupComplete,
    nextRoute,
    refresh,
    refreshAndNavigate,
  }
}
