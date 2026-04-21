import { createApiClient, createPublicApiClient, createPublicApiNoAuthClient } from '~/shared/api'
import { DEFAULT_API_BASE_URL, getApiBase } from '~/shared/runtime-url'

const API_BASE_ERROR = 'NUXT_PUBLIC_API_BASE_URL is missing or invalid. Set it in .env (e.g. NUXT_PUBLIC_API_BASE_URL=https://api.printy.ke) or in your deployment environment.'
const LOCAL_API_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

function ensureValidApiBase(apiBase: unknown): string {
  const url = typeof apiBase === 'string' ? apiBase : ''
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    throw new Error(API_BASE_ERROR)
  }

  if (!import.meta.dev) {
    try {
      const parsed = new URL(url)
      if (LOCAL_API_HOSTS.has(parsed.hostname.toLowerCase())) {
        const fallback = getApiBase(DEFAULT_API_BASE_URL)
        console.warn(`[printy] Ignoring localhost API base "${url}" outside development. Falling back to "${fallback}".`)
        return fallback
      }
    } catch {
      throw new Error(API_BASE_ERROR)
    }
  }

  return url
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = ensureValidApiBase(getApiBase(config.public))
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
