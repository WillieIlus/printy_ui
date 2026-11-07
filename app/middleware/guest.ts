import { resolveGuestRedirect } from '~/shared/guest-redirect'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  await auth.initialize(true)
  const redirect = resolveGuestRedirect({ isAuthenticated: auth.isAuthenticated, homeRoute: auth.homeRoute })
  if (redirect) {
    return navigateTo(redirect)
  }
})
