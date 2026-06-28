export type DashboardRole = 'super_admin' | 'client' | 'partner' | 'production'

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
  roles?: string[]
  primary_role?: DashboardRole
  dashboard_role?: DashboardRole
  home_route?: string
  can_access_admin_dashboard?: boolean
  can_access_client_dashboard?: boolean
  can_access_partner_dashboard?: boolean
  can_access_production_dashboard?: boolean
  capabilities?: Record<string, unknown>
  is_email_verified?: boolean
  partner_profile_enabled?: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  role: 'client' | 'partner' | 'production'
  partner_profile_enabled?: boolean
  session_key?: string
  guest_draft_id?: number | null
}

export interface RegisterResponse {
  detail: string
  email: string
  verification_required: boolean
  resend_available: boolean
  claimed_guest_draft_id?: number | null
}

export interface ResetPasswordPayload {
  key: string
  password: string
}

export interface ApiListResponse<T> {
  results?: T[]
  count?: number
  next?: string | null
  previous?: string | null
}

export interface PrintyNotification {
  id: number | string
  message: string
  notification_type?: string | null
  object_type?: string | null
  object_id?: number | string | null
  read_at?: string | null
  created_at?: string | null
}

export interface AdminMetricComparisonValue {
  label: string
  current_value: number | string | null
  previous_value: number | string | null
  absolute_change: number | string | null
  percent_change: number | string | null
  trend: 'up' | 'down' | 'flat'
  helper_text: string
  unavailable_reason?: string
}

export interface AdminMetricComparison {
  label: string
  comparisons: Record<string, AdminMetricComparisonValue>
  unavailable_reason?: string
}

export interface AdminKpiCard {
  key: string
  label: string
  value: number | string | null
  comparison_key: string
  metric_key: string
  helper_text: string
}

export interface AdminPaymentSummary {
  total_payments_initiated: number
  payments_confirmed: number
  payments_pending_callback: number
  payments_failed: number
  payments_cancelled_or_timeout: number
  mpesa_amount_collected: number | string | null
  sample_payments_collected: number | string | null
  full_job_payments_collected: number | string | null
  pending_production_payouts: number
  pending_broker_margin_payouts: number
  failed_callback_count: number
  [key: string]: unknown
}

export interface AdminJobSummary {
  total_jobs: number
  jobs_pending: number
  jobs_in_production: number
  jobs_completed: number
  jobs_cancelled: number
  jobs_ready_for_pickup_or_delivery: number
  overdue_jobs: number
  [key: string]: unknown
}

export interface AdminQuoteSummary {
  total_quote_requests: number
  pending_quote_requests: number
  accepted_quote_requests: number
  rejected_or_lost: number
  converted_to_jobs: number
  [key: string]: unknown
}

export interface AdminDashboardResponse {
  role: 'super_admin'
  generated_at: string
  timezone: string
  home_route: string
  kpis: AdminKpiCard[]
  metrics: Record<string, AdminMetricComparison>
  summaries: {
    users: Record<string, unknown>
    quotes: AdminQuoteSummary
    jobs: AdminJobSummary
    payments: AdminPaymentSummary
    revenue: Record<string, unknown>
    funnel: Array<Record<string, unknown>>
    production: Record<string, unknown>
    partners: Record<string, unknown>
    clients: Record<string, unknown>
    activity: Record<string, unknown>
  }
  payments_monitor: {
    statuses: Record<string, unknown>
    latest_transactions: Array<Record<string, unknown>>
  }
  tables: Record<string, Array<Record<string, unknown>>>
}

export interface DashboardCollectionResponse<T = Record<string, unknown>> {
  role: DashboardRole
  results: T[]
}

export interface DashboardDetailResponse<T = Record<string, unknown>> {
  role: DashboardRole
  quote?: T
  job?: T
  settlement?: Record<string, unknown> | null
}
