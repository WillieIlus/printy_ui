import { useAuthStore } from '~/stores/auth'

/**
 * Runs on client after app mount.
 * If refreshToken exists, call refresh() then fetchMe() so the first API call
 * doesn't fail with 401 due to expired access token.
 */
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (authStore.refreshToken) {
    await authStore.refresh()
  }
  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchMe()
  }
})
