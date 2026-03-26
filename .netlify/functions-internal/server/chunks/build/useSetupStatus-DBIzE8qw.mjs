import { storeToRefs, defineStore } from 'pinia';
import { k as useNuxtApp, A as API } from './server.mjs';
import { computed, ref } from 'vue';
import { u as useShopStore } from './shop-COPLd96Y.mjs';

const useSetupStatusStore = defineStore("setupStatus", () => {
  const status = ref(null);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref(null);
  async function fetchStatus(shopSlug) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      status.value = await $api(
        shopSlug ? API.shopSetupStatus(shopSlug) : API.setupStatus()
      );
      loaded.value = true;
      return status.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load setup status.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  return {
    status,
    loading,
    loaded,
    error,
    fetchStatus
  };
});
function useSetupStatus() {
  const setupStore = useSetupStatusStore();
  const shopStore = useShopStore();
  const { status, loading, loaded, error } = storeToRefs(setupStore);
  const isSetupComplete = computed(() => status.value?.next_step === "complete");
  const nextRoute = computed(() => status.value?.next_url ?? "/dashboard");
  async function refresh(shopSlug) {
    const targetShop = shopSlug ?? shopStore.selectedShopSlug ?? null;
    return await setupStore.fetchStatus(targetShop);
  }
  return {
    status,
    loading,
    loaded,
    error,
    isSetupComplete,
    nextRoute,
    refresh
  };
}

export { useSetupStatus as u };
//# sourceMappingURL=useSetupStatus-DBIzE8qw.mjs.map
