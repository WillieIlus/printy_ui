import { computed, toValue } from 'vue';
import { u as useSetupStatus, r as resolveSetupFlow } from './useSetupStatus-BlqBMF6r.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { f as useRoute } from './server.mjs';

function useSetupFlow(shopSlug) {
  const shopStore = useShopStore();
  const route = useRoute();
  const { status } = useSetupStatus();
  const resolvedSlug = computed(() => {
    const explicitSlug = toValue(shopSlug);
    if (typeof explicitSlug === "string" && explicitSlug) return explicitSlug;
    const routeSlug = route.params.slug;
    if (typeof routeSlug === "string" && routeSlug) return routeSlug;
    return shopStore.selectedShopSlug ?? null;
  });
  return computed(() => resolveSetupFlow(status.value, resolvedSlug.value));
}

export { useSetupFlow as u };
//# sourceMappingURL=useSetupFlow-BWiVCewA.mjs.map
