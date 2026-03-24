import { c as useAuthStore, k as useApi, A as API } from './server.mjs';
import { computed, ref } from 'vue';

const STEP_ROUTES = {
  shop: "/dashboard/shops/create",
  machines: "/dashboard/machines",
  papers: "/dashboard/papers",
  pricing: "/dashboard/pricing",
  products: "/dashboard/products",
  done: "/dashboard"
};
const _status = ref(null);
const _loading = ref(false);
const _dismissed = ref(false);
function useSetupStatus() {
  const authStore = useAuthStore();
  const isSetupComplete = computed(() => _status.value?.next_step === "done");
  const nextRoute = computed(() => STEP_ROUTES[_status.value?.next_step ?? "done"] ?? "/dashboard");
  async function refresh() {
    if (!authStore.isAuthenticated) return;
    _loading.value = true;
    try {
      const api = useApi();
      _status.value = await api(API.setupStatus());
    } catch {
      _status.value = null;
    } finally {
      _loading.value = false;
    }
  }
  function dismiss() {
    _dismissed.value = true;
  }
  function undismiss() {
    _dismissed.value = false;
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
    STEP_ROUTES
  };
}

export { useSetupStatus as u };
//# sourceMappingURL=useSetupStatus-ioR4SSE7.mjs.map
