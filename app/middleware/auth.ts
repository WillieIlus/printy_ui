import { useAuthStore } from '~/stores/auth'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
import { useShopStore } from '~/stores/shop'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const shopStore = useShopStore()
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!authStore.user) {
    await authStore.fetchMe()
  }

  if ((authStore.isShopOwner || authStore.isStaffRole) && !shopStore.myShopsLoaded) {
    await shopStore.fetchMyShops()
  }

  const redirectTarget = resolvePostLoginRedirectPath(
    authStore.user,
    (shopStore.myShops?.length ?? 0) > 0,
    null,
  )

  if (to.path.startsWith('/dashboard') && authStore.isClient) {
    return navigateTo(redirectTarget)
  }

  if (to.path.startsWith('/quote-draft') && (authStore.isShopOwner || authStore.isStaffRole)) {
    return navigateTo(redirectTarget)
  }
})
