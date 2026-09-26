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
const API_NON_JSON_ERROR_MESSAGE = "Printy's server returned an unexpected response. Please try again."
const SESSION_EXPIRED_MESSAGE = 'Your session expired. Sign in again to continue.'

/**
 * Coalesces concurrent 401-triggered refreshes into a single attempt. The API
 * rotates refresh tokens (`ROTATE_REFRESH_TOKENS = True`), so two parallel
 * retries using the same refresh token race and the second one is rejected,
 * which would log a user out on an ordinary access-token expiry.
 */
export function createSingleFlight<T>(run: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | null = null
  return () => {
    if (!inFlight) {
      inFlight = run().finally(() => {
        inFlight = null
      })
    }
    return inFlight
  }
}

let refreshInFlight: Promise<unknown> | null = null

function runSingleFlightRefresh(refresh: () => Promise<unknown>): Promise<unknown> {
  if (!refreshInFlight) {
    refreshInFlight = refresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

function isFailedToFetchMessage(message: unknown) {
  return typeof message === 'string' && message.toLowerCase().includes('failed to fetch')
}

const FIELD_LABELS: Record<string, string> = {
  paper_id: 'Paper',
  requested_paper_category: 'Paper',
  requested_gsm: 'Paper',
  quantity: 'Quantity',
  selected_manager_id: 'Manager',
  manager_id: 'Manager',
  finished_size: 'Finished size',
  width_mm: 'Finished width',
  height_mm: 'Finished height',
  roll_width_mm: 'Roll width',
  material_type: 'Material',
  markup_pct: 'Markup %',
}

function humanizeFieldName(field: string) {
  const explicit = FIELD_LABELS[field]
  if (explicit) return explicit
  const words = field.replace(/_id$/, '').replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function humanizeFieldMessage(field: string, message: string) {
  const normalized = message.trim()
  if (/^this field is required\.?$/i.test(normalized)) {
    return `${humanizeFieldName(field)} is required.`
  }
  return `${humanizeFieldName(field)}: ${normalized}`
}

export function getApiErrorDetail(error: unknown) {
  const stringifyErrorValue = (value: unknown): string | null => {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
    if (Array.isArray(value)) {
      const parts = value
        .map(item => stringifyErrorValue(item))
        .filter((item): item is string => Boolean(item))
      return parts.length ? parts.join(' ') : null
    }
    if (value && typeof value === 'object') {
      const payload = value as Record<string, unknown>
      const detail = stringifyErrorValue(payload.detail)
      if (detail) return detail
      const fieldErrors = stringifyErrorValue(payload.field_errors)
      if (fieldErrors) return fieldErrors
      const message = stringifyErrorValue(payload.message)
      if (message) return message
      const fieldMessages = Object.entries(payload)
        .map(([key, nested]) => {
          const nestedMessage = stringifyErrorValue(nested)
          return nestedMessage ? humanizeFieldMessage(key, nestedMessage) : null
        })
        .filter((item): item is string => Boolean(item))
      return fieldMessages.length ? fieldMessages.join(' ') : null
    }
    return null
  }

  const extractFieldError = (payload: Record<string, unknown> | undefined) => {
    if (!payload) {
      return null
    }
    for (const value of Object.values(payload)) {
      const message = stringifyErrorValue(value)
      if (message) {
        return message
      }
    }
    return null
  }

  if (error instanceof FetchError) {
    const data = error.data as unknown
    const contentType = String(error.response?.headers?.get('content-type') || '').toLowerCase()
    if (typeof data === 'string') {
      if (contentType.includes('application/json')) {
        try {
          const parsed = JSON.parse(data) as unknown
          const parsedMessage = stringifyErrorValue(parsed)
          if (parsedMessage) {
            return parsedMessage
          }
        } catch {
          // Fall through to the safe non-JSON handling below.
        }
      }
      if (import.meta.dev && data.trim()) {
        console.error('Unexpected API error response:', data)
      }
      return isFailedToFetchMessage(error.message) ? API_UNREACHABLE_MESSAGE : API_NON_JSON_ERROR_MESSAGE
    }
    const payload = data && typeof data === 'object' ? data as Record<string, unknown> : undefined
    const payloadMessage = stringifyErrorValue(payload)
    if (payloadMessage) {
      return payloadMessage
    }
    const fieldError = extractFieldError(payload)
    if (fieldError) {
      return fieldError
    }
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE
    }
    return error.message
  }
  if (error && typeof error === 'object') {
    const errorData = (error as { data?: unknown }).data
    if (typeof errorData === 'string') {
      try {
        const parsed = JSON.parse(errorData) as unknown
        const parsedMessage = stringifyErrorValue(parsed)
        if (parsedMessage) {
          return parsedMessage
        }
      } catch {
        if (import.meta.dev && errorData.trim()) {
          console.error('Unexpected API error response:', errorData)
        }
        return API_NON_JSON_ERROR_MESSAGE
      }
    }
    const dataMessage = stringifyErrorValue(errorData)
    if (dataMessage) {
      return dataMessage
    }
    const statusMessage = (error as { statusMessage?: unknown }).statusMessage
    if (isFailedToFetchMessage(statusMessage)) {
      return API_UNREACHABLE_MESSAGE
    }
    if (typeof statusMessage === 'string' && statusMessage) {
      return statusMessage
    }
  }
  if (error instanceof Error) {
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE
    }
    return error.message
  }
  return null
}

export function getApiErrorMessage(error: unknown, fallback = 'Printy could not complete this request.') {
  return getApiErrorDetail(error) || fallback
}
type ApiErrorPayload = Record<string, unknown>

function parseApiPayload(value: unknown): ApiErrorPayload | null {
  if (!value) return null
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      return parsed && typeof parsed === 'object' ? parsed as ApiErrorPayload : null
    } catch {
      return null
    }
  }
  return typeof value === 'object' ? value as ApiErrorPayload : null
}

function firstString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) return firstString(value[0])
  return null
}

export function getApiErrorPayload(error: unknown): ApiErrorPayload | null {
  if (error instanceof FetchError) {
    return parseApiPayload(error.data)
  }
  if (error && typeof error === 'object') {
    const payload = error as { data?: unknown }
    return parseApiPayload(payload.data) || parseApiPayload(error)
  }
  return null
}

export function getApiErrorCode(error: unknown): string | null {
  const payload = getApiErrorPayload(error)
  const code = firstString(payload?.code)
  const fieldCode = firstString((payload?.field_errors as ApiErrorPayload | undefined)?.code)
  return code && code !== 'VALIDATION_ERROR' ? code : fieldCode || code
}

export function getApiErrorField(error: unknown, field: string): string | null {
  const payload = getApiErrorPayload(error)
  return firstString(payload?.[field]) || firstString((payload?.field_errors as ApiErrorPayload | undefined)?.[field])
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
    if (options.auth !== false && !token) {
      throw createError({
        statusCode: 401,
        statusMessage: SESSION_EXPIRED_MESSAGE,
      })
    }
    const activeRole = token && options.auth !== false && withContext
      ? await withContext(() => useAuthStore().activeRole)
      : null
    return await $fetch<T>(path, {
      baseURL: apiBase,
      method: options.method || 'GET',
      body: options.body as BodyInit | Record<string, any> | null | undefined,
      query: options.query,
      headers: {
        ...(options.headers || {}),
        ...(token && options.auth !== false ? { Authorization: `Bearer ${token}` } : {}),
        ...(activeRole ? { 'X-Printy-Active-Role': activeRole } : {}),
      },
    })
  } catch (error) {
    const statusCode = error instanceof FetchError
      ? error.response?.status || 500
      : typeof (error as { statusCode?: unknown })?.statusCode === 'number'
        ? Number((error as { statusCode: number }).statusCode)
        : 500

    if (statusCode === 401 && options.auth !== false && !options.skipAuthRefresh && !options._retried) {
      if (!withContext) {
        throw error
      }
const auth = await withContext(() => useAuthStore())

      try {
        await runSingleFlightRefresh(() => auth.refreshSession())
        const nextToken = await withContext(() => useCookie<string | null>('printy_access_token').value)
        return await apiRequest<T>(apiBase, path, {
          ...options,
          _retried: true,
          skipAuthRefresh: true,
        }, nextToken, withContext)
      } catch {
        const wasAuthenticated = Boolean(auth.user)
        auth.clearSession()
        if (import.meta.client && wasAuthenticated) {
          await withContext(() => navigateTo('/sign-in'))
        }
        throw createError({
          statusCode: 401,
          statusMessage: SESSION_EXPIRED_MESSAGE,
        })
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


