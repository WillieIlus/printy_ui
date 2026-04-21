const NETWORK_ERROR_PATTERNS = [
  'fetch failed',
  'failed to fetch',
  '<no response>',
  'networkerror',
  'network error',
  'network request failed',
  'connection refused',
  'load failed',
  'timed out',
  'timeout',
  'socket hang up',
  'econnrefused',
  'econnreset',
  'enotfound',
  'failed to load',
]

const TRANSPORT_NOISE_PATTERNS = [
  '[get]',
  '[post]',
  '[put]',
  '[patch]',
  '[delete]',
]

interface ParseApiErrorOptions {
  networkMessage?: string
  serverMessage?: string
}

function isTechnicalTransportMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase()
  return TRANSPORT_NOISE_PATTERNS.some(pattern => normalized.includes(pattern))
    || NETWORK_ERROR_PATTERNS.some(pattern => normalized.includes(pattern))
    || /https?:\/\/\S+/i.test(message)
    || normalized.includes('[object object]')
}

function sanitizeMessage(
  message: string,
  fallback: string,
  status?: number,
  options: ParseApiErrorOptions = {},
): string {
  const trimmed = message.trim()
  if (!trimmed || trimmed === '[object Object]') {
    return fallback
  }

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed) || /<!doctype html/i.test(trimmed)
  if (looksLikeHtml) {
    if (status === 404) return 'The requested resource was not found.'
    if (status && status >= 500) return options.serverMessage ?? 'Server error. Please try again later.'
    return fallback
  }

  if (isTechnicalTransportMessage(trimmed)) {
    if (!status) {
      return options.networkMessage ?? 'We could not connect to the server. Please check your connection and try again.'
    }
    if (status >= 500) {
      return options.serverMessage ?? 'Server error. Please try again later.'
    }
    return fallback
  }

  return trimmed
}

/**
 * Extract user-friendly error message from API responses (Django REST, ofetch, etc.).
 * Handles: { detail: string }, { field: ["msg"] }, plain string, and standard Error.
 * ofetch errors may have: data, response._data, statusCode.
 */
export function parseApiError(err: unknown, fallback: string, options: ParseApiErrorOptions = {}): string {

  if (err && typeof err === 'object') {
    const e = err as {
      data?: unknown
      response?: { _data?: unknown }
      statusCode?: number
      status?: number
    }
    // ofetch: err.data or err.response._data
    const responseData = e.data ?? e.response?._data
    const status = e.statusCode ?? e.status

    if (typeof responseData === 'object' && responseData !== null) {
      const obj = responseData as Record<string, unknown>
      if (typeof obj.message === 'string') return sanitizeMessage(obj.message, fallback, status, options)
      if (typeof obj.detail === 'string') return sanitizeMessage(obj.detail, fallback, status, options)
      if (Array.isArray(obj.detail)) return (obj.detail as string[]).join('; ')
      const fieldErrors = Object.entries(obj)
        .filter(([, v]) => Array.isArray(v) || typeof v === 'string')
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
        .join('; ')
      if (fieldErrors) return sanitizeMessage(fieldErrors, fallback, status, options)
    }

    if (typeof responseData === 'string') return sanitizeMessage(responseData, fallback, status, options)

    // Fallback for known HTTP status when no body
    if (status === 403) return 'You do not have permission to perform this action.'
    if (status === 404) return 'The requested resource was not found.'
    if (status && status >= 500) return options.serverMessage ?? 'Server error. Please try again later.'
  }

  if (err instanceof Error) return sanitizeMessage(err.message, fallback, undefined, options)

  return fallback
}
