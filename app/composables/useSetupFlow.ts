import { toValue, type MaybeRefOrGetter } from 'vue'
import { resolveSetupFlow } from '~/utils/setupFlow'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useShopStore } from '~/stores/shop'

export function useSetupFlow(shopSlug?: MaybeRefOrGetter<string | null | undefined>) {
  const shopStore = useShopStore()
  const route = useRoute()
  const { status } = useSetupStatus()

  const resolvedSlug = computed(() => {
    const explicitSlug = toValue(shopSlug)
    if (typeof explicitSlug === 'string' && explicitSlug) return explicitSlug
    const routeSlug = route.params.slug
    if (typeof routeSlug === 'string' && routeSlug) return routeSlug
    return shopStore.selectedShopSlug ?? null
  })

  return computed(() => resolveSetupFlow(status.value, resolvedSlug.value))
}
