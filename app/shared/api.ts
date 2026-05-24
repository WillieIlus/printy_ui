import { $fetch, FetchError } from 'ofetch'
import { useAuthStore } from '~/stores/auth'
import type { ApiListResponse } from '~/shared/types'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, unknown>
  headers?: Record<string, string>
  auth?: boolean
  skipAuthRefresh?: boolean
  _retried?: boolean
}

export interface ApiClient {
  <T>(path: string, options?: ApiRequestOptions): Promise<T>
}

type ContextRunner = <T>(callback: () => T) => T | Promise<Awaited<T>>

const API_UNREACHABLE_MESSAGE = "We could not reach Printy's server. Please check that the API is running and try again."

function isFailedToFetchMessage(message: unknown) {
  return typeof message === 'string' && message.toLowerCase().includes('failed to fetch')
}

export function getApiErrorDetail(error: unknown) {
  const extractFieldError = (payload: Record<string, unknown> | undefined) => {
    if (!payload) {
      return null
    }
    for (const value of Object.values(payload)) {
      if (typeof value === 'string' && value) {
        return value
      }
      if (Array.isArray(value) && typeof value[0] === 'string' && value[0]) {
        return value[0]
      }
    }
    return null
  }

  if (error instanceof FetchError) {
    const data = error.data as Record<string, unknown> | undefined
    if (typeof data?.detail === 'string' && data.detail) {
      return data.detail
    }
    if (typeof data?.message === 'string' && data.message) {
      return data.message
    }
    const fieldError = extractFieldError(data)
    if (fieldError) {
      return fieldError
    }
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE
    }
    return error.message
  }
  if (error instanceof Error) {
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE
    }
    return error.message
  }
  if (error && typeof error === 'object' && 'statusMessage' in error) {
    const statusMessage = (error as { statusMessage?: unknown }).statusMessage
    if (isFailedToFetchMessage(statusMessage)) {
      return API_UNREACHABLE_MESSAGE
    }
    if (typeof statusMessage === 'string' && statusMessage) {
      return statusMessage
    }
  }
  return null
}

export function getApiErrorMessage(error: unknown, fallback = 'Printy could not complete this request.') {
  return getApiErrorDetail(error) || fallback
}

export function normalizeApiList<T>(payload: ApiListResponse<T> | T[] | null | undefined): T[] {
  if (Array.isArray(payload)) {
    return payload
  }
  if (Array.isArray(payload?.results)) {
    return payload.results
  }
  return []
}

async function apiRequest<T>(
  apiBase: string,
  path: string,
  options: ApiRequestOptions = {},
  token?: string | null,
  withContext?: ContextRunner,
) {
  try {
    return await $fetch<T>(path, {
      baseURL: apiBase,
      method: options.method || 'GET',
      body: options.body as BodyInit | Record<string, any> | null | undefined,
      query: options.query,
      headers: {
        ...(options.headers || {}),
        ...(token && options.auth !== false ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch (error) {
    const statusCode = error instanceof FetchError ? error.response?.status || 500 : 500

    if (statusCode === 401 && options.auth !== false && !options.skipAuthRefresh && !options._retried) {
      if (!withContext) {
        throw error
      }
      const auth = await withContext(() => useAuthStore())

      try {
        await auth.refreshSession()
        const nextToken = await withContext(() => useCookie<string | null>('printy_access_token').value)
        return await apiRequest<T>(apiBase, path, {
          ...options,
          _retried: true,
          skipAuthRefresh: true,
        }, nextToken, withContext)
      } catch {
        auth.clearSession()
        if (import.meta.client) {
          await withContext(() => navigateTo('/auth/login'))
        }
      }
    }

    throw createError({
      statusCode,
      statusMessage: getApiErrorMessage(error),
      data: error instanceof FetchError ? error.data : undefined,
    })
  }
}

export function createApiClient(apiBase: string): ApiClient {
  return async <T>(path: string, options: ApiRequestOptions = {}) => {
    const nuxtApp = useNuxtApp()
    const withContext: ContextRunner = (callback) => nuxtApp.runWithContext(callback)
    const token = await withContext(() => useCookie<string | null>('printy_access_token').value)
    return apiRequest<T>(apiBase, path, options, token, withContext)
  }
}

export function createPublicApiClient(apiBase: string): ApiClient {
  return async <T>(path: string, options: ApiRequestOptions = {}) => {
    const nuxtApp = useNuxtApp()
    return apiRequest<T>(apiBase, path, options, null, callback => nuxtApp.runWithContext(callback))
  }
}

export function createPublicApiNoAuthClient(apiBase: string): ApiClient {
  return async <T>(path: string, options: ApiRequestOptions = {}) => {
    const nuxtApp = useNuxtApp()
    return apiRequest<T>(apiBase, path, { ...options, auth: false }, null, callback => nuxtApp.runWithContext(callback))
  }
}

export function useApi() {
  const nuxtApp = useNuxtApp()
  return {
    api: <T>(path: string, options?: ApiRequestOptions) => nuxtApp.runWithContext(() => (nuxtApp.$api as ApiClient)<T>(path, options)),
    publicApi: <T>(path: string, options?: ApiRequestOptions) => nuxtApp.runWithContext(() => (nuxtApp.$publicApi as ApiClient)<T>(path, options)),
  }
}
