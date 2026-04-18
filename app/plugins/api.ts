import { createApiClient, createPublicApiClient, createPublicApiNoAuthClient } from '~/shared/api'
import { getApiBase } from '~/shared/runtime-url'

const API_BASE_ERROR = 'NUXT_PUBLIC_API_BASE_URL is missing or invalid. Set it in .env (e.g. NUXT_PUBLIC_API_BASE_URL=http://localhost:8000) or in your deployment environment.'

function ensureValidApiBase(apiBase: unknown): string {
  const url = typeof apiBase === 'string' ? apiBase : ''
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    throw new Error(API_BASE_ERROR)
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
