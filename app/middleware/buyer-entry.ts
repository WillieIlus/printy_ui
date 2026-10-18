import { resolveBuyerEntryRedirect } from '~/shared/buyer-entry'

/**
 * Law 9.1 — route guard for buyer entry pages (the homepage / instant quote).
 * A signed-in manager or printer is redirected to their own dashboard; buyers
 * and signed-out visitors pass through untouched.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  await auth.initialize(true)

  const redirect = resolveBuyerEntryRedirect({
    isAuthenticated: auth.isAuthenticated,
    dashboardRole: auth.dashboardRole,
    path: to.path,
  })
  if (redirect) {
    return navigateTo(redirect, { redirectCode: 302 })
  }
})
