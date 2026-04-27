import { storeToRefs } from 'pinia'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

export function useSetupStatus() {
  const setupStore = useSetupStatusStore()
  const shopStore = useShopStore()
  const router = useRouter()
  const { status, loading, loaded, error } = storeToRefs(setupStore)

  const resolvedShopSlug = computed(() => shopStore.selectedShopSlug ?? null)
  const flow = computed(() => ({
    steps: status.value?.steps ?? [],
    nextRequiredStep: status.value?.next_step && status.value.next_step !== 'complete' ? status.value.next_step : null,
    nextRequiredRoute: status.value?.next_url || (resolvedShopSlug.value ? `/dashboard/shops/${resolvedShopSlug.value}` : '/dashboard'),
    progressPercent: typeof status.value?.setup_percent === 'number'
      ? status.value.setup_percent
      : status.value?.steps?.length
      ? Math.round(((status.value.steps.filter(step => step.done).length) / status.value.steps.length) * 100)
      : 0,
  }))
  const isSetupComplete = computed(() => flow.value.nextRequiredStep === null)
  const nextRoute = computed(() => status.value?.next_url || flow.value.nextRequiredRoute || '/dashboard')

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
