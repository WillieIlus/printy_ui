export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.client) {
    return
  }
  const access = useCookie<string | null>('printy_access_token')
  const refresh = useCookie<string | null>('printy_refresh_token')
  if (!access.value && !refresh.value) {
    return
  }
  const auth = useAuthStore()
  await auth.initialize(true)
})
