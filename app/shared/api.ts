// Purpose: Minimal shared API helpers restored for surviving stores, services, and plugins.
import { useAuthStore } from '~/stores/auth'

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ApiOptions = {
  method?: ApiMethod
  body?: unknown
  params?: Record<string, string | number | boolean | null | undefined>
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

type ApiClient = <T>(path: string, options?: ApiOptions) => Promise<T>

function withQuery(path: string, params?: ApiOptions['params']) {
  if (!params) return path
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    search.set(key, String(value))
  }

  const query = search.toString()
  if (!query) return path
  return `${path}${path.includes('?') ? '&' : '?'}${query}`
}

function createClient(apiBase: string, includeAuth: boolean): ApiClient {
  return async <T>(path: string, options: ApiOptions = {}) => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers ?? {}),
    }

    if (includeAuth && import.meta.client) {
      const authStore = useAuthStore()
      if (authStore.accessToken) {
        headers.Authorization = `Bearer ${authStore.accessToken}`
      }
    }

    return await $fetch(withQuery(`${apiBase}${path}`, options.params), {
      method: options.method ?? 'GET',
      body: options.body instanceof FormData ? options.body : options.body ?? undefined,
      headers,
      timeout: options.timeout,
      signal: options.signal,
    }) as T
  }
}

export function createApiClient(apiBase: string): ApiClient {
  return createClient(apiBase, true)
}

export function createPublicApiClient(apiBase: string): ApiClient {
  return createClient(apiBase, true)
}

export function createPublicApiNoAuthClient(apiBase: string): ApiClient {
  return createClient(apiBase, false)
}

export function useApi(): ApiClient {
  return useNuxtApp().$api as ApiClient
}

export function usePublicApi(): ApiClient {
  return useNuxtApp().$publicApi as ApiClient
}

export function usePublicApiNoAuth(): ApiClient {
  return useNuxtApp().$publicApiNoAuth as ApiClient
}
