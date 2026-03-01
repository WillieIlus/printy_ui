/**
 * API layer for Printy_API. All requests should go through useApi() or $api.
 * - baseURL from runtimeConfig.public.apiBase
 * - Authorization: Bearer <accessToken> when authenticated
 * - 401: attempt refresh once, then logout
 */
import { useAuthStore } from '~/stores/auth'

export function createApiClient(baseURL: string) {
  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const authStore = useAuthStore()
      const token = authStore.accessToken
      if (token) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token}`)
        options.headers = headers
      }
    },
    async onResponseError({ response, request }) {
      const status = response?.status
      const url = typeof request === 'string' ? request : (request as Request)?.url ?? ''
      if (status === 401) {
        if (url.includes('auth/token') || url.includes('token/refresh')) return
        const authStore = useAuthStore()
        const refreshed = await authStore.refresh()
        if (!refreshed) authStore.logout()
      }
    },
  })
}

/**
 * Returns the configured $fetch client. All API requests should use this.
 * Provided by the api plugin as $api.
 */
export function useApi() {
  return useNuxtApp().$api
}
