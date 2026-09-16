export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  await auth.initialize(true)

  if (!auth.isAuthenticated) {
    return navigateTo(`/sign-in?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  auth.syncRouteRole(to.path)
})