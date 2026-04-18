import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  if (import.meta.client && !authStore.initialized) {
    return
  }

  if (authStore.isAuthenticated) {
    let u = authStore.user
    if (!u) {
      await authStore.fetchMe()
      u = authStore.user
    }
    if (!authStore.isAuthenticated || !u) return

    const shopStore = useShopStore()
    if ((authStore.normalizedRole === 'shop_owner' || authStore.normalizedRole === 'staff') && !shopStore.myShopsLoaded) {
      await shopStore.fetchMyShops()
    }
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : null
    const path = resolvePostLoginRedirectPath(u ?? null, (shopStore.myShops?.length ?? 0) > 0, redirect)
    if (path === to.fullPath) return
    return navigateTo(path)
  }
})
