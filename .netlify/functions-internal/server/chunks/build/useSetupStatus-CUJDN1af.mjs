import { storeToRefs } from 'pinia';
import { u as useSetupStatusStore } from './setupStatus-pIJLkKpM.mjs';
import { u as useShopStore } from './shop-DfXxeXDQ.mjs';
import { H as useRouter, n as navigateTo } from './server.mjs';
import { computed } from 'vue';

function useSetupStatus() {
  const setupStore = useSetupStatusStore();
  const shopStore = useShopStore();
  const router = useRouter();
  const { status, loading, loaded, error } = storeToRefs(setupStore);
  const isSetupComplete = computed(() => status.value?.next_step === "complete");
  const nextRoute = computed(() => status.value?.next_url ?? "/dashboard");
  async function refresh(shopSlug) {
    const targetShop = shopSlug ?? shopStore.selectedShopSlug ?? null;
    return await setupStore.fetchStatus(targetShop);
  }
  async function refreshAndNavigate(options) {
    const targetShop = options?.shopSlug ?? shopStore.selectedShopSlug ?? null;
    const currentPath = router.currentRoute.value.path;
    const latest = await refresh(targetShop);
    const target = latest?.next_url || options?.fallbackUrl || "/dashboard";
    if (options?.onlyWhenNextUrlChanges && currentPath === target) return latest;
    if (currentPath !== target) {
      await navigateTo(target, { replace: options?.replace ?? true });
    }
    return latest;
  }
  return {
    status,
    loading,
    loaded,
    error,
    isSetupComplete,
    nextRoute,
    refresh,
    refreshAndNavigate
  };
}

export { useSetupStatus as u };
//# sourceMappingURL=useSetupStatus-CUJDN1af.mjs.map
