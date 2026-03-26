import { storeToRefs } from 'pinia'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

export function useSetupStatus() {
  const setupStore = useSetupStatusStore()
  const shopStore = useShopStore()
  const { status, loading, loaded, error } = storeToRefs(setupStore)

  const isSetupComplete = computed(() => status.value?.next_step === 'complete')
  const nextRoute = computed(() => status.value?.next_url ?? '/dashboard')

  async function refresh(shopSlug?: string | null) {
    const targetShop = shopSlug ?? shopStore.selectedShopSlug ?? null
    return await setupStore.fetchStatus(targetShop)
  }

  return {
    status,
    loading,
    loaded,
    error,
    isSetupComplete,
    nextRoute,
    refresh,
  }
}
