import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { getPostLoginRedirectPath } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    let u = authStore.user
    if (!u) {
      await authStore.fetchMe()
      u = authStore.user
    }
    const shopStore = useShopStore()
    if (u?.role === 'PRINTER') {
      await shopStore.fetchMyShops()
    }
    const path = getPostLoginRedirectPath(u ?? null, (shopStore.myShops?.length ?? 0) > 0)
    return navigateTo(path)
  }
})
