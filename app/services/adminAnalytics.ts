import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface AnalyticsCountByLabel {
  label: string
  count: number
}

export type AnalyticsRange = 'today' | '7d' | '30d' | '90d'
export type AnalyticsInterval = 'hour' | 'day' | 'week'

export interface AnalyticsNamedMetric extends AnalyticsCountByLabel {
  slug?: string
  path?: string
}

export interface AnalyticsSummary {
  total_visits_today: number
  total_visits_this_week: number
  total_visits_this_month: number
  unique_visitors_today: number
  quote_requests_today: number
  quote_requests_this_week: number
  quote_conversion_rate_today: number
  recent_errors_count: number
  top_cities: AnalyticsCountByLabel[]
  top_paths: AnalyticsCountByLabel[]
  top_searches: AnalyticsCountByLabel[]
}

export interface AnalyticsTimeSeriesPoint {
  bucket: string
  visits: number
  unique_visitors: number
  quote_starts: number
  quote_submits: number
  errors: number
}

export interface AnalyticsTimeSeriesResponse {
  range: AnalyticsRange
  interval: AnalyticsInterval
  timezone: string
  series: AnalyticsTimeSeriesPoint[]
}

export interface AnalyticsTimeSeriesParams {
  range?: AnalyticsRange
  interval?: AnalyticsInterval
}

export interface AnalyticsTopMetrics {
  top_viewed_products: AnalyticsNamedMetric[]
  top_viewed_shops: AnalyticsNamedMetric[]
  top_searched_keywords: AnalyticsCountByLabel[]
  top_landing_pages: AnalyticsCountByLabel[]
}

export interface AnalyticsFunnelStage {
  key: 'page_views' | 'product_views' | 'shop_views' | 'quote_starts' | 'quote_submits'
  label: string
  count: number
  conversion_from_previous: number | null
}

export interface AnalyticsFunnelResponse {
  range: AnalyticsRange
  start: string
  end: string
  page_views: number
  product_views: number
  shop_views: number
  quote_starts: number
  quote_submits: number
  product_view_rate: number
  shop_view_rate: number
  quote_start_rate: number
  quote_submit_rate: number
  overall_conversion_rate: number
  stages: AnalyticsFunnelStage[]
}

export interface AnalyticsLocationIPItem {
  ip_address: string | null
  count: number
  country: string
  city: string
  region: string
  last_seen_at: string | null
}

export interface AnalyticsPaginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface AnalyticsLocationsResponse {
  countries: AnalyticsCountByLabel[]
  cities: AnalyticsCountByLabel[]
  ip_addresses: AnalyticsPaginated<AnalyticsLocationIPItem>
}

export interface AnalyticsLocationBreakdownParams {
  page?: number
  page_size?: number
}

export interface AnalyticsErrorItem {
  id: number
  event_type: string
  path: string
  status_code: number | null
  message: string
  created_at: string
}

export interface AnalyticsErrorsResponse {
  latest_errors: AnalyticsPaginated<AnalyticsErrorItem>
  counts_by_path: AnalyticsCountByLabel[]
  counts_by_status_code: AnalyticsCountByLabel[]
  counts_by_event_type: AnalyticsCountByLabel[]
}

export interface AnalyticsTrackEventPayload {
  event_type: 'page_view' | 'search' | 'product_view' | 'shop_view' | 'quote_start' | 'quote_submit' | 'login' | 'signup' | 'api_error' | 'frontend_error'
  path?: string
  metadata?: Record<string, unknown>
  status_code?: number
  error?: Record<string, unknown>
}

export interface AnalyticsFunnelParams {
  range?: AnalyticsRange
}

type AnalyticsApiClient = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

function resolveApiClient(client?: AnalyticsApiClient): AnalyticsApiClient {
  return client ?? useApi()
}

export async function fetchAnalyticsSummary(
  params?: Record<string, string | number>,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsSummary> {
  const api = resolveApiClient(client)
  return await api<AnalyticsSummary>(API.adminAnalyticsSummary(), { params, signal })
}

export async function fetchAnalyticsTimeSeries(
  params?: AnalyticsTimeSeriesParams,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsTimeSeriesResponse> {
  const api = resolveApiClient(client)
  return await api<AnalyticsTimeSeriesResponse>(API.adminAnalyticsTimeSeries(), { params, signal })
}

export async function fetchAnalyticsTopMetrics(
  params?: Record<string, string | number>,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsTopMetrics> {
  const api = resolveApiClient(client)
  return await api<AnalyticsTopMetrics>(API.adminAnalyticsTopMetrics(), { params, signal })
}

export async function fetchAnalyticsFunnel(
  params?: AnalyticsFunnelParams,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsFunnelResponse> {
  const api = resolveApiClient(client)
  return await api<AnalyticsFunnelResponse>(API.adminAnalyticsFunnel(), { params, signal })
}

export async function fetchAnalyticsLocations(
  params?: AnalyticsLocationBreakdownParams,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsLocationsResponse> {
  const api = resolveApiClient(client)
  return await api<AnalyticsLocationsResponse>(API.adminAnalyticsLocations(), { params, signal })
}

export async function fetchAnalyticsErrors(
  params?: Record<string, string | number>,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<AnalyticsErrorsResponse> {
  const api = resolveApiClient(client)
  return await api<AnalyticsErrorsResponse>(API.adminAnalyticsErrors(), { params, signal })
}

export async function trackAnalyticsEvent(
  payload: AnalyticsTrackEventPayload,
  client?: AnalyticsApiClient,
  signal?: AbortSignal
): Promise<{ ok: boolean }> {
  const api = resolveApiClient(client)
  return await api<{ ok: boolean }>(API.analyticsEvents(), {
    method: 'POST',
    body: payload,
    signal,
  })
}
