import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    let u = authStore.user
    if (!u) {
      await authStore.fetchMe()
      u = authStore.user
    }
    const shopStore = useShopStore()
    if (authStore.normalizedRole === 'shop_owner' || authStore.normalizedRole === 'staff') {
      await shopStore.fetchMyShops()
    }
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : null
    const path = resolvePostLoginRedirectPath(u ?? null, (shopStore.myShops?.length ?? 0) > 0, redirect)
    return navigateTo(path)
  }
})
