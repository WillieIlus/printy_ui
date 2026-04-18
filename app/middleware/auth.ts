import { useAuthStore } from '~/stores/auth'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
import { useShopStore } from '~/stores/shop'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const shopStore = useShopStore()

  if (import.meta.client && !authStore.initialized) {
    await authStore.initialize()
  }

  if (!authStore.isAuthenticated) {
    const isClientPath = to.path.startsWith('/quote-draft') || to.path.startsWith('/quotes') || to.path.startsWith('/inbox') || to.path.startsWith('/account')
    const isShopPath = to.path.startsWith('/dashboard')

    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath,
        ...(isClientPath ? { role: 'client' } : {}),
        ...(isShopPath ? { role: 'shop_owner' } : {}),
      },
    })
  }

  if (!authStore.user) {
    await authStore.fetchMe()
  }

  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath,
      },
    })
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

  if (
    (to.path.startsWith('/quote-draft')
      || to.path.startsWith('/quotes')
      || to.path.startsWith('/account')
      || to.path.startsWith('/inbox'))
    && (authStore.isShopOwner || authStore.isStaffRole)
  ) {
    return navigateTo(redirectTarget)
  }
})
