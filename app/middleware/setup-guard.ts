import { useAuthStore } from '~/stores/auth'
import { useSetupStatus } from '~/composables/useSetupStatus'

/**
 * Middleware for /dashboard routes.
 * Fetches setup status and optionally redirects to the required setup step.
 * Does NOT block navigation if user is already on the correct step page.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }

  const { status, refresh, isSetupComplete, nextRoute, dismissed } = useSetupStatus()

  if (!status.value) {
    await refresh()
  }

  if (!status.value || isSetupComplete.value) return

  if (dismissed.value) return

  const target = nextRoute.value
  if (to.path === target || to.path.startsWith(target + '/')) return

  return navigateTo(target)
})
