import { createApiClient, createPublicApiClient, createPublicApiNoAuthClient } from '~/shared/api'
import { DEFAULT_API_BASE, getApiBase } from '~/shared/runtime-url'

const LOCAL_API_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

function ensureValidApiBase(apiBase: string) {
  if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
    if (!import.meta.dev) {
      throw new Error('[printy] NUXT_PUBLIC_API_BASE_URL must be an absolute URL in production.')
    }

    return DEFAULT_API_BASE
  }

  if (!import.meta.dev) {
    try {
      const parsed = new URL(apiBase)
      if (LOCAL_API_HOSTS.has(parsed.hostname.toLowerCase())) {
        throw new Error('[printy] NUXT_PUBLIC_API_BASE_URL cannot point to localhost in production.')
      }
    } catch {
      throw new Error('[printy] NUXT_PUBLIC_API_BASE_URL is invalid in production.')
    }
  }

  return apiBase
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = ensureValidApiBase(getApiBase(config.public))

  return {
    provide: {
      api: createApiClient(apiBase),
      publicApi: createPublicApiClient(apiBase),
      publicApiNoAuth: createPublicApiNoAuthClient(apiBase),
    },
  }
})
