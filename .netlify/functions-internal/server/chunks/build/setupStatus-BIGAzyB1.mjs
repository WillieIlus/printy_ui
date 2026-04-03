import { m as useNuxtApp, A as API } from './server.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

function normalizeNextUrl(nextUrl) {
  if (!nextUrl) return "/dashboard";
  if (nextUrl.startsWith("/api/")) return nextUrl.replace(/^\/api/, "") || "/dashboard";
  return nextUrl;
}
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
      const response = await $api(
        shopSlug ? API.shopSetupStatus(shopSlug) : API.setupStatus()
      );
      status.value = {
        ...response,
        next_url: normalizeNextUrl(response.next_url)
      };
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

export { useSetupStatusStore as u };
//# sourceMappingURL=setupStatus-BIGAzyB1.mjs.map
