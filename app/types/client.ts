import type { DashboardCollectionResponse } from '~/shared/types'

export interface ClientDashboardHomeStats {
  open_jobs: number
  awaiting_payment: number
  in_production: number
}

export interface ClientDashboardHomeJob {
  id: number
  reference: string
  title: string
  status: string
  payment_status: string
  assigned_shop_name: string
  client_total: string | null
}

export interface ClientDashboardHomePayment {
  id: number
  managed_job_id: number
  reference: string
  amount: string | null
  payment_status: string
  method: string
  channel: string
  checkout_request_id: string | null
}

export interface ClientDashboardHomeResponse {
  role: 'client'
  stats: ClientDashboardHomeStats
  recent_jobs: ClientDashboardHomeJob[]
  payments: ClientDashboardHomePayment[]
  actions: {
    primary: string
    secondary: string
  }
}

export interface ClientQuoteLatestResponse {
  id: number
  quote_reference: string
  status: string
  raw_status?: string
  status_label: string
  total: string | number | null
  turnaround_days: number | null
  turnaround_hours: number | null
  estimated_ready_at: string | null
  human_ready_text: string
  turnaround_label: string
  created_at: string
  sent_at: string | null
  response_snapshot?: Record<string, unknown>
}

export interface ClientQuoteManagedJobSummary {
  id: number
  tracking_token: string | null
  public_token: string | null
}

export interface ClientQuoteRow {
  id: number
  reference: string
  status: string
  status_label: string
  customer_name: string
  shop_name: string
  assigned_manager: Record<string, unknown> | null
  assigned_manager_name: string
  request_snapshot: Record<string, unknown>
  latest_response: ClientQuoteLatestResponse | null
  managed_job: ClientQuoteManagedJobSummary | null
  created_at: string
  updated_at: string
}

export type ClientQuotesResponse = DashboardCollectionResponse<ClientQuoteRow>

export interface ClientJobPricing {
  production_cost: string | null
  shop_payout: string | null
  paper_price: string | null
  finishing_price: string | null
  client_total: string | null
  broker_payout: string | null
  printy_fee: string | null
}

export interface ClientJobRow {
  id: number
  reference: string
  title: string
  status: string
  payment_status: string
  assignment_status: string
  requested_deadline: string | null
  updated_at: string
  payment_confirmed: boolean
  pricing: ClientJobPricing
  tracking_token: string | null
  public_token: string | null
  [artworkState: string]: unknown
}

export type ClientJobsResponse = DashboardCollectionResponse<ClientJobRow>

export interface ClientPaymentRow {
  id: number
  reference: string
  amount: string | null
  payment_status: string
  channel: string
  created_at: string
}

export type ClientPaymentsResponse = DashboardCollectionResponse<ClientPaymentRow>

export interface ClientInboxAttachmentSummary {
  id: number
  name: string
}

export interface ClientInboxMessage {
  id: number
  subject: string
  body: string
  snippet: string
  message_type: string
  direction: string
  quote_request_id: number
  quote_response_id: number | null
  shop_name: string
  client_name: string
  read_at: string | null
  created_at: string
  sent_at: string | null
  email_status: string
  has_attachment: boolean
  attachments_summary: ClientInboxAttachmentSummary[]
  action_url: string
}
