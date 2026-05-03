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

  if (!authStore.isShopOwner) return

  const { status, refresh } = useSetupStatus()
  await refresh()

  if (!status.value) return

  const flow = {
    nextRequiredStep: status.value.next_step && status.value.next_step !== 'complete' ? status.value.next_step : null,
    nextRequiredRoute: status.value.next_url,
  }
  if (!flow.nextRequiredStep) return

  const target = flow.nextRequiredRoute
  if (to.path === target || to.path.startsWith(target + '/')) return

  return navigateTo(target)
})
