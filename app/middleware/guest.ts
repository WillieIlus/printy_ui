export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized && import.meta.client) {
    await auth.initialize()
  }
  if (auth.isAuthenticated) {
    const next = typeof to.query.next === 'string'
      ? to.query.next
      : typeof to.query.redirect === 'string'
        ? to.query.redirect
        : auth.homeRoute
    return navigateTo(next)
  }
})
