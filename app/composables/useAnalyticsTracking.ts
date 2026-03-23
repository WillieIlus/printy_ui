import type { AnalyticsTrackEventPayload } from '~/services/adminAnalytics'
import { trackAnalyticsEvent } from '~/services/adminAnalytics'

type AnalyticsApiClient = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

type TrackOptions = {
  onceKey?: string
}

type FrontendErrorContext = {
  source?: string
  info?: string
  fatal?: boolean
  path?: string
}

const EXCLUDED_PAGE_PREFIXES = ['/admin', '/auth', '/dashboard']
const SENT_ONCE_KEYS = new Set<string>()
const ERROR_TTL_MS = 5000
const seenErrors = new Map<string, number>()
let lastTrackedPagePath: string | null = null

function normalizePath(path?: string | null) {
  if (!path) return '/'
  return path.split('#')[0]?.split('?')[0] || '/'
}

function shouldTrackPage(path: string) {
  return !EXCLUDED_PAGE_PREFIXES.some(prefix => path.startsWith(prefix))
}

function sanitizeString(value: string, maxLength = 240) {
  const normalized = value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
    .replace(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b/gi, 'Bearer [redacted]')
    .replace(/\beyJ[A-Za-z0-9._-]+\b/g, '[redacted-token]')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength)}...`
}

function sanitizeUnknown(value: unknown, depth = 0): unknown {
  if (value == null) return undefined
  if (typeof value === 'string') return sanitizeString(value)
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value)) {
    if (depth >= 2) return value.length
    const sanitized = value
      .slice(0, 10)
      .map(item => sanitizeUnknown(item, depth + 1))
      .filter(item => item !== undefined)
    return sanitized.length ? sanitized : undefined
  }
  if (typeof value === 'object') {
    if (depth >= 2) return undefined
    const blockedKeys = new Set([
      'authorization',
      'body',
      'cookie',
      'cookies',
      'headers',
      'password',
      'request',
      'response',
      'stack',
      'token',
    ])
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !blockedKeys.has(key.toLowerCase()))
      .slice(0, 20)
      .map(([key, item]) => [key, sanitizeUnknown(item, depth + 1)] as const)
      .filter(([, item]) => item !== undefined)

    if (!entries.length) return undefined
    return Object.fromEntries(entries)
  }
  return undefined
}

function sanitizeRecord(value?: Record<string, unknown>) {
  const sanitized = sanitizeUnknown(value)
  if (!sanitized || Array.isArray(sanitized) || typeof sanitized !== 'object') return undefined
  return sanitized as Record<string, unknown>
}

function pruneErrorFingerprints() {
  const now = Date.now()
  for (const [key, ts] of seenErrors.entries()) {
    if (now - ts > ERROR_TTL_MS) {
      seenErrors.delete(key)
    }
  }
}

export function useAnalyticsTracking() {
  const route = useRoute()
  const { $api } = useNuxtApp()
  const apiClient = $api as AnalyticsApiClient

  function currentPath() {
    return normalizePath(route.path)
  }

  async function trackEvent(payload: AnalyticsTrackEventPayload, options?: TrackOptions) {
    if (import.meta.server) return null
    if (options?.onceKey && SENT_ONCE_KEYS.has(options.onceKey)) {
      return null
    }

    const requestPayload: AnalyticsTrackEventPayload = {
      ...payload,
      path: normalizePath(payload.path ?? currentPath()),
      metadata: sanitizeRecord(payload.metadata),
      error: sanitizeRecord(payload.error),
    }

    try {
      const response = await trackAnalyticsEvent(requestPayload, apiClient)
      if (options?.onceKey) {
        SENT_ONCE_KEYS.add(options.onceKey)
      }
      return response
    } catch {
      return null
    }
  }

  function trackPageView(metadata?: Record<string, unknown>) {
    const path = currentPath()
    if (!shouldTrackPage(path)) return null
    if (lastTrackedPagePath === path) return null
    lastTrackedPagePath = path

    return trackEvent({
      event_type: 'page_view',
      path,
      metadata: {
        ...metadata,
        route_name: typeof route.name === 'string' ? route.name : undefined,
      },
    })
  }

  function trackSearch(query: string, metadata?: Record<string, unknown>, options?: TrackOptions) {
    const trimmed = query.trim()
    if (!trimmed) return null
    return trackEvent({
      event_type: 'search',
      path: currentPath(),
      metadata: {
        query: sanitizeString(trimmed, 120),
        ...metadata,
      },
    }, options)
  }

  function trackProductView(metadata?: Record<string, unknown>, options?: TrackOptions) {
    return trackEvent({
      event_type: 'product_view',
      path: currentPath(),
      metadata,
    }, options)
  }

  function trackShopView(metadata?: Record<string, unknown>, options?: TrackOptions) {
    return trackEvent({
      event_type: 'shop_view',
      path: currentPath(),
      metadata,
    }, options)
  }

  function trackQuoteStart(metadata?: Record<string, unknown>, options?: TrackOptions) {
    return trackEvent({
      event_type: 'quote_start',
      path: currentPath(),
      metadata,
    }, options)
  }

  function trackQuoteSubmit(metadata?: Record<string, unknown>, options?: TrackOptions) {
    return trackEvent({
      event_type: 'quote_submit',
      path: currentPath(),
      metadata,
    }, options)
  }

  function trackFrontendError(error: unknown, context?: FrontendErrorContext) {
    if (import.meta.server) return null

    const message = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unexpected frontend error'
    const path = normalizePath(context?.path ?? currentPath())
    const fingerprint = `${context?.source ?? 'frontend'}|${path}|${sanitizeString(message, 180)}`

    pruneErrorFingerprints()
    if (seenErrors.has(fingerprint)) {
      return null
    }
    seenErrors.set(fingerprint, Date.now())

    const maybeObject = error && typeof error === 'object' ? error as Record<string, unknown> : null
    const statusCode = typeof maybeObject?.statusCode === 'number'
      ? maybeObject.statusCode
      : typeof maybeObject?.status === 'number'
        ? maybeObject.status
        : undefined

    return trackEvent({
      event_type: 'frontend_error',
      path,
      status_code: statusCode,
      metadata: {
        source: context?.source ?? 'frontend',
        info: context?.info,
        fatal: context?.fatal ?? (typeof maybeObject?.fatal === 'boolean' ? maybeObject.fatal : false),
        error_name: error instanceof Error ? error.name : undefined,
      },
      error: {
        message: sanitizeString(message),
      },
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackProductView,
    trackShopView,
    trackQuoteStart,
    trackQuoteSubmit,
    trackFrontendError,
  }
}
