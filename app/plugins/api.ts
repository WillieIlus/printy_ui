import { createApiClient, createPublicApiClient, createPublicApiNoAuthClient } from '~/shared/api'
import { DEFAULT_API_BASE, getApiBase } from '~/shared/runtime-url'

const API_BASE_ERROR = 'NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_API_BASE_URL is missing or invalid. Set it in .env (e.g. NUXT_PUBLIC_API_BASE=https://api.printy.ke/api) or in your deployment environment.'
const LOCAL_API_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

function ensureValidApiBase(apiBase: unknown): string {
  const url = typeof apiBase === 'string' ? apiBase : ''
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    console.warn(`[printy] ${API_BASE_ERROR}`)
    return DEFAULT_API_BASE
  }

  if (!import.meta.dev) {
    try {
      const parsed = new URL(url)
      if (LOCAL_API_HOSTS.has(parsed.hostname.toLowerCase())) {
        // Warn but do not throw — throwing here crashes SSR/prerender with a 500.
        // API calls will fail gracefully; components must handle their own errors.
        console.warn(`[printy] API base "${url}" points to localhost outside development. Set NUXT_PUBLIC_API_BASE or NUXT_PUBLIC_API_BASE_URL to your production API URL.`)
      }
    } catch {
      console.warn(`[printy] ${API_BASE_ERROR}`)
    }
  }

  return url
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = ensureValidApiBase(getApiBase(config.public ?? DEFAULT_API_BASE))
  const api = createApiClient(apiBase)
  const publicApi = createPublicApiClient(apiBase)
  const publicApiNoAuth = createPublicApiNoAuthClient(apiBase)
  return {
    provide: {
      api,
      publicApi,
      publicApiNoAuth,
    },
  }
})
