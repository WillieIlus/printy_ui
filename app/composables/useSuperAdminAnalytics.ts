import type {
  AnalyticsErrorsResponse,
  AnalyticsFunnelParams,
  AnalyticsFunnelResponse,
  AnalyticsLocationBreakdownParams,
  AnalyticsLocationsResponse,
  AnalyticsSummary,
  AnalyticsTimeSeriesParams,
  AnalyticsTimeSeriesResponse,
  AnalyticsTopMetrics,
  AnalyticsTrackEventPayload,
} from '~/services/adminAnalytics'
import {
  fetchAnalyticsErrors,
  fetchAnalyticsFunnel,
  fetchAnalyticsLocations,
  fetchAnalyticsSummary,
  fetchAnalyticsTimeSeries,
  fetchAnalyticsTopMetrics,
  trackAnalyticsEvent,
} from '~/services/adminAnalytics'

type RequestKey =
  | 'summary'
  | 'timeSeries'
  | 'topMetrics'
  | 'funnel'
  | 'locationBreakdown'
  | 'errorAnalytics'
  | 'trackEvent'

type RequestState = Record<RequestKey, boolean>
type ErrorState = Record<RequestKey, string | null>

export function useSuperAdminAnalytics() {
  const { $api } = useNuxtApp()
  const apiClient = $api as <T>(url: string, options?: Record<string, unknown>) => Promise<T>

  const summary = ref<AnalyticsSummary | null>(null)
  const timeSeries = ref<AnalyticsTimeSeriesResponse | null>(null)
  const topMetrics = ref<AnalyticsTopMetrics | null>(null)
  const funnel = ref<AnalyticsFunnelResponse | null>(null)
  const locationBreakdown = ref<AnalyticsLocationsResponse | null>(null)
  const errorAnalytics = ref<AnalyticsErrorsResponse | null>(null)

  const loading = reactive<RequestState>({
    summary: false,
    timeSeries: false,
    topMetrics: false,
    funnel: false,
    locationBreakdown: false,
    errorAnalytics: false,
    trackEvent: false,
  })

  const errors = reactive<ErrorState>({
    summary: null,
    timeSeries: null,
    topMetrics: null,
    funnel: null,
    locationBreakdown: null,
    errorAnalytics: null,
    trackEvent: null,
  })

  const controllers = new Map<RequestKey, AbortController>()

  const isLoading = computed(() => Object.values(loading).some(Boolean))
  const firstError = computed(() => Object.values(errors).find(Boolean) ?? null)

  function abort(key: RequestKey) {
    const controller = controllers.get(key)
    if (controller) {
      controller.abort()
      controllers.delete(key)
    }
  }

  function abortAll() {
    for (const key of controllers.keys()) {
      abort(key)
    }
  }

  async function runRequest<T>(
    key: RequestKey,
    execute: (signal: AbortSignal) => Promise<T>,
    options?: { cancelPrevious?: boolean }
  ): Promise<T | null> {
    if (options?.cancelPrevious !== false) {
      abort(key)
    }

    const controller = new AbortController()
    controllers.set(key, controller)
    loading[key] = true
    errors[key] = null

    try {
      return await execute(controller.signal)
    } catch (err) {
      if (controller.signal.aborted) {
        return null
      }
      errors[key] = err instanceof Error ? err.message : 'Request failed.'
      return null
    } finally {
      if (controllers.get(key) === controller) {
        controllers.delete(key)
      }
      loading[key] = false
    }
  }

  async function getSummary(params?: Record<string, string | number>) {
    const data = await runRequest('summary', async signal => fetchAnalyticsSummary(params, apiClient, signal))
    if (data) {
      summary.value = data
    }
    return data
  }

  async function getTimeSeries(params?: AnalyticsTimeSeriesParams) {
    const data = await runRequest('timeSeries', async signal => fetchAnalyticsTimeSeries(params, apiClient, signal))
    if (data) {
      timeSeries.value = data
    }
    return data
  }

  async function getTopMetrics(params?: Record<string, string | number>) {
    const data = await runRequest('topMetrics', async signal => fetchAnalyticsTopMetrics(params, apiClient, signal))
    if (data) {
      topMetrics.value = data
    }
    return data
  }

  async function getFunnel(params?: AnalyticsFunnelParams) {
    const data = await runRequest('funnel', async signal => fetchAnalyticsFunnel(params, apiClient, signal))
    if (data) {
      funnel.value = data
    }
    return data
  }

  async function getLocationBreakdown(params?: AnalyticsLocationBreakdownParams) {
    const data = await runRequest('locationBreakdown', async signal => fetchAnalyticsLocations(params, apiClient, signal))
    if (data) {
      locationBreakdown.value = data
    }
    return data
  }

  async function getErrorAnalytics(params?: Record<string, string | number>) {
    const data = await runRequest('errorAnalytics', async signal => fetchAnalyticsErrors(params, apiClient, signal))
    if (data) {
      errorAnalytics.value = data
    }
    return data
  }

  async function trackEvent(payload: AnalyticsTrackEventPayload) {
    return await runRequest('trackEvent', async signal => trackAnalyticsEvent(payload, apiClient, signal))
  }

  onScopeDispose(() => {
    abortAll()
  })

  return {
    summary,
    timeSeries,
    topMetrics,
    funnel,
    locationBreakdown,
    errorAnalytics,
    loading,
    errors,
    isLoading,
    error: firstError,
    getSummary,
    getTimeSeries,
    getTopMetrics,
    getFunnel,
    getLocationBreakdown,
    getErrorAnalytics,
    trackEvent,
    abort,
    abortAll,
  }
}
