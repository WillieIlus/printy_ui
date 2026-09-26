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
  active_role?: DashboardRole
  active_dashboard_role?: DashboardRole
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
  id: number
  notification_type: string
  notification_type_display: string
  message: string
  object_type: string | null
  object_id: number | null
  actor: number | null
  actor_email?: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  target_url: string | null
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

/* ── calculator quote drafts & buyer quotes feed ── */

export interface ClientQuoteSnapshot {
  currency: string
  total: number | null
  subtotal: number | null
  vat: number | null
  unit_price: number | null
  turnaround_days: number | null
  ready_by: string
  product_name: string
  finished_size: string
  quantity: number
  paper_name: string
  color_mode: string
  sides: string
  broker_name: string
  design_option: string
  delivery_option: string
  rush_option: string
}

export interface CalculatorDraft {
  id: number
  draft_reference: string
  title: string
  status: string
  raw_status: string
  status_label: string
  calculator_context?: string
  intent?: string
  shop_name?: string | null
  selected_product?: number | null
  source_job_id?: number | null
  direct_intake_shop_id?: number | null
  intake_mode?: string
  calculator_inputs_snapshot: Record<string, unknown>
  pricing_snapshot?: Partial<ClientQuoteSnapshot> | Record<string, unknown> | null
  custom_product_snapshot?: Record<string, unknown> | null
  request_details_snapshot?: Record<string, unknown> | null
  artwork_token?: string
  artwork_filename?: string
  generated_request_ids?: number[]
  created_at: string
  updated_at: string
}

export interface QuoteManagerPayload {
  id: number
  display_name: string
  short_title: string
  is_printy_fallback?: boolean
  support_email?: string
}

export interface QuoteLatestResponse {
  id: number
  quote_reference: string
  status: string
  raw_status?: string
  status_label: string
  total: number | null
  turnaround_days?: number | null
  turnaround_hours?: number | null
  estimated_ready_at?: string | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  created_at: string
  sent_at?: string | null
}

export interface QuoteRequestSummary {
  id: number
  request_reference: string
  shop?: number | null
  created_by?: number | null
  assigned_manager?: QuoteManagerPayload | null
  manager_selection_mode?: string
  status: string
  raw_status: string
  status_label: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  source_draft?: number | null
  source_draft_reference?: string | null
  request_snapshot?: Record<string, unknown> | null
  latest_response?: QuoteLatestResponse | null
  responses_count?: number
  attachments?: unknown[]
  created_at: string
  updated_at: string
}

export type BuyerQuoteItem =
  | { item_type: 'draft'; draft: CalculatorDraft }
  | { item_type: 'quote_request'; quote_request: QuoteRequestSummary }

/* ── quote inbox messages (client + shop) ── */

export interface InboxAttachmentSummary {
  id: number
  name: string
}

export interface InboxMessage {
  id: number
  subject: string
  body: string
  snippet: string
  message_type: string
  direction: string
  quote_request_id: number | null
  quote_response_id: number | null
  shop_name: string
  client_name: string
  read_at: string | null
  created_at: string
  sent_at: string | null
  email_status: string
  has_attachment: boolean
  attachments_summary: InboxAttachmentSummary[]
  action_url: string | null
}

/* ── client quote responses ── */

export interface ClientQuoteResponse {
  id: number
  request_id: number
  price: string | null
  currency: string
  turnaround_days: number | null
  turnaround_hours: number | null
  status: string
  latest_message: string
  unread_count: number
  created_at: string
  updated_at: string
}

export type ClientReplyType =
  | 'client_question'
  | 'client_counter_offer'
  | 'client_change_request'
  | 'client_file_update'

export interface ClientReplyPayload {
  message_type: ClientReplyType
  subject?: string
  message: string
  proposed_price?: number | null
}

/* ── production shop assignments ── */

export interface AssignmentTimelineStep {
  key: string
  label: string
  state: 'completed' | 'current' | 'pending' | string
  completed_at?: string | null
}

export type AssignmentAction =
  | 'accept'
  | 'reject'
  | 'mark_printing'
  | 'mark_finishing'
  | 'mark_ready'
  | 'mark_completed'
  | 'mark_delivered'
  | 'upload_proof'

export interface JobAssignment {
  id: number
  assignment_reference: string
  managed_job: number
  managed_reference: string
  job_reference: string
  quote_request_reference: string
  quote_reference: string
  assigned_shop: number | null
  shop_name: string | null
  status: string
  urgency_type: string
  urgency_label: string
  operational_priority_level: number
  managed_job_status: string
  managed_job_payment_status: string
  production_stage: string
  production_stage_label: string
  production_timeline_steps: AssignmentTimelineStep[]
  current_step: string
  next_allowed_actions: AssignmentAction[]
  payment_confirmed: boolean
  payout_amount: string | null
  payout_status_label: string
  artwork_available: boolean
  proof_status: string
  production_order: number | null
  due_at: string | null
  requested_deadline: string | null
  accepted_at: string | null
  rejected_at: string | null
  assignment_notes: string
}

/* ── user profile (settings) ── */

export interface UserProfileRecord {
  id: number
  user: number
  bio: string
  avatar: string | null
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  created_at: string
  updated_at: string
}

export type UserProfilePatch = Partial<
  Pick<UserProfileRecord, 'bio' | 'phone' | 'address' | 'city' | 'state' | 'country' | 'postal_code'>
>

/* ── server-side calculator preview ── */

export interface ServerMarketRange {
  min: number | string | null
  max: number | string | null
  median: number | string | null
  currency: string
  label: string
  confidence: string
  display_mode?: string | null
  source_label?: string | null
}

export interface ServerImpositionLayout {
  cols: number | null
  rows: number | null
  orientation: 'normal' | 'rotated' | null
}

export interface ServerPressSheet {
  label: string | null
  width_mm: number | null
  height_mm: number | null
}

export interface ServerProductionPreview {
  pieces_per_sheet: number | null
  sheets_required: number | null
  parent_sheet: string | null
  good_sheets: number | null
  waste_sheets_added: number | null
  fixed_waste_sheets: number | null
  variable_waste_sheets: number | null
  variable_waste_rate: string | number | null
  billable_sheets: number | null
  layout: ServerImpositionLayout | null
  bleed_mm: number | null
  press_sheet: ServerPressSheet | null
  imposition_label: string | null
  size_label: string | null
  quantity: number | null
  cutting_required: boolean | null
  selected_finishings: string[]
  suggested_finishings: string[]
  warnings: string[]
}

export interface ServerCalculatorPreview {
  can_calculate: boolean
  product_type: string | null
  price_mode: string | null
  matches_count: number
  display_price_text: string | null
  display_mode: string | null
  confidence_label: string | null
  source_label: string | null
  market_range?: ServerMarketRange | null
  currency?: string
  missing_fields: string[]
  summary: string | null
  warnings: string[]
  suggestions: string[]
  exact_or_estimated: boolean
  production_preview?: ServerProductionPreview | null
}

/* ── guest artwork upload ── */

export interface GuestArtworkUpload {
  artwork_token: string
  filename: string
  size: number
  expires_at: string | null
  preview_url: string | null
}

/* ── print manager intake ── */

export interface RecommendedPrintManager {
  id: number
  display_name: string
  brand_name: string
  specializations: string[]
  avg_response_hours: number | null
  completed_jobs: number
  satisfaction_rating: number | null
  distance_km: number | null
  is_previous_manager: boolean
  badge: string | null
  recommendation_reason: string
}

export interface RecommendedManagerResponse {
  product_type: string | null
  summary: string
  results: RecommendedPrintManager[]
  message?: string
}

export interface IntakeSubmitPayload {
  draft_id?: number
  selected_manager_id?: number | null
  manager_selection_mode: 'client_selected' | 'printy_auto'
  artwork_token?: string
  artwork_filename?: string
}

export interface IntakeSubmitResult {
  intake_id: number
  manager_name: string
  expected_response_by: string | null
}

/* ── offline quote claim ── */

export interface OfflineQuoteClaimResult {
  quote_request_id: number
  quote_id: number | null
  claimed: boolean
}

/* ── shop setup: papers, finishings, machines ── */

export interface ShopRecord {
  id: number
  name: string
  slug: string
  description: string
  service_area: string
  turnaround_statement: string
  opening_hours_text: string
  public_whatsapp_number: string
  phone_number: string
  city: string
  is_public: boolean
}

export interface ShopPaperRecord {
  id: number
  name: string
  display_name: string
  available_for_quoting: boolean
  sheet_size: string
  gsm: number | null
  category: string
  paper_type: string
  use_for_flat_jobs: boolean
  use_for_booklet_covers: boolean
  use_for_booklet_inserts: boolean
  use_for_stickers_labels: boolean
  is_cover_stock: boolean
  is_insert_stock: boolean
  is_sticker_stock: boolean
  is_specialty: boolean
  width_mm: number | null
  height_mm: number | null
  buying_price: string
  selling_price: string
  quantity_in_stock: number
  reorder_level: number
  is_active: boolean
  is_default: boolean
  [key: string]: any
}

export interface ShopFinishingRateRecord {
  id: number
  name: string
  slug: string
  charge_unit: string
  billing_basis: string
  side_mode: string
  price: string
  base_price: string
  client_price: string
  double_side_price: string | null
  setup_fee: string
  min_qty: number
  minimum_charge: string
  applies_to_product_types: string[]
  display_unit_label: string
  help_text: string
  is_active: boolean
  [key: string]: any
}

export interface ShopMachineRecord {
  id: number
  name: string
  machine_type: string
  max_width_mm: number | null
  max_height_mm: number | null
  min_gsm: number | null
  max_gsm: number | null
  is_active: boolean
  [key: string]: any
}

export type ShopPaperPatch = Partial<
  Pick<
    ShopPaperRecord,
    | 'name'
    | 'sheet_size'
    | 'gsm'
    | 'category'
    | 'paper_type'
    | 'buying_price'
    | 'selling_price'
    | 'quantity_in_stock'
    | 'reorder_level'
    | 'is_active'
    | 'is_cover_stock'
    | 'is_insert_stock'
    | 'is_sticker_stock'
    | 'is_specialty'
  >
>

export type ShopFinishingRatePatch = Partial<
  Pick<
    ShopFinishingRateRecord,
    | 'name'
    | 'charge_unit'
    | 'billing_basis'
    | 'side_mode'
    | 'price'
    | 'double_side_price'
    | 'setup_fee'
    | 'min_qty'
    | 'minimum_charge'
    | 'applies_to_product_types'
    | 'is_active'
  >
>

export type ShopMachinePatch = Partial<Omit<ShopMachineRecord, 'id'>>

export type ShopPatch = Partial<Omit<ShopRecord, 'id' | 'slug'>>

/* ── manager quote-prep workspace ── */

export interface ManagerQuoteFinancials {
  client_total?: string | null
  production_cost?: string | null
  gross_margin?: string | null
  margin_percent?: string | null
  shop_payout?: string | null
  broker_payout?: string | null
  printy_fee?: string | null
}

export interface ManagerQuoteRow {
  id: number
  reference: string
  quote_request_reference: string
  quote_reference: string | null
  product: string
  status: string
  raw_status: string
  status_label: string
  customer_name: string
  shop_name: string
  assigned_manager_name: string
  request_snapshot: Record<string, unknown>
  latest_response: Record<string, unknown> | null
  created_at: string
  updated_at: string
  managed_job: Record<string, unknown> | null
  client_name?: string
  client_email?: string
  client_phone?: string | null
  client_total?: string | null
  production_cost?: string | null
  gross_margin?: string | null
  margin_percent?: string | null
}

export interface ManagerQuotePrefill {
  quote_request_id: number
  product_type: string
  product_variant: string
  quantity: number
  size: { width_mm?: number | null; height_mm?: number | null; label?: string | null } | Record<string, unknown>
  paper: { gsm: number | null; type: string; tier: string }
  print: { sides: string; color_mode: string }
  finishing: Array<{ type: string; slug: string; sides: string }>
  turnaround: string
  client_notes: string
  uploaded_artwork_url: string
  builder_payload: Record<string, unknown>
}

export interface ManagerPricingShop {
  id: number | null
  shop_id: number | null
  name: string
  location: string
  eligible: boolean
  production_cost: string | null
  ineligible_reason: string
  production_cost_breakdown?: Record<string, unknown>
  missing_requirements?: string[]
  explanation?: string
  reason?: string
  capability_notes?: string[]
  shop_contact?: string
  shop_contact_label?: string
  price_status?: string
  [key: string]: unknown
}

export interface ManagerPricingBreakdown {
  production_cost?: string
  markup_pct?: string
  markup_amount?: string
  broker_client_price?: string
  platform_fee?: string
  client_total?: string
  [key: string]: unknown
}

export interface ManagerQuotePricingPreview {
  quote_request_id: number
  selected_shop_id: number | null
  breakdown: ManagerPricingBreakdown | null
  eligible_shops: ManagerPricingShop[]
  missing_fields: string[]
}

export interface ManagerPrepareResult {
  quote_request_id: number
  quote: Record<string, unknown>
  partner_preview: Record<string, unknown>
}

export interface ManagerSendToClientResult {
  quote_request_id: number
  quote_id: number
  pricing: Record<string, unknown>
  offline_client: boolean
  claim_token: string | null
  payment: Record<string, unknown> | null
}

export interface ManagerMarketRate {
  key?: string
  product_type?: string
  product_label?: string
  paper_name?: string
  gsm?: string | number | null
  sample_quantity?: number
  sample_job_label?: string
  pieces_per_sheet?: number
  sheets_needed?: number
  shops_count?: number
  data_quality?: string
  confidence_label?: string
  double_sided_enabled?: boolean
  market_single?: ManagerMarketSide | null
  market_double?: ManagerMarketSide | null
  market_median_production_cost?: string | null
  market_low_high_band?: { low?: string | null; high?: string | null }
  suggested_markup_percent?: string | null
  explanation?: string
  [key: string]: unknown
}

export interface ManagerMarketSide {
  median_per_unit?: string | null
  mean_per_unit?: string | null
  min_per_unit?: string | null
  max_per_unit?: string | null
  median_total_100?: string | null
  mean_total_100?: string | null
  min_total_100?: string | null
  max_total_100?: string | null
  [key: string]: unknown
}

export interface PartnerProfileRecord {
  id?: number
  default_markup_rate?: string | number | null
  display_name?: string
  brand_name?: string
  [key: string]: unknown
}

/* ── manager production follow-up (partner jobs / clients / shops) ── */

export interface ManagerJobArtworkConfirmation {
  state?: string
  requested_at?: string | null
  requested_by?: number | string | null
  responded_at?: string | null
  responded_by?: number | string | null
  note?: string
  [key: string]: unknown
}

export interface ManagerJobRow {
  id: number
  reference: string
  job_reference: string
  quote_request_id: number | null
  quote_id: number | null
  quote_request_reference: string | null
  quote_reference: string | null
  tracking_reference: string
  production_assignment_reference: string | null
  title: string
  status: string
  payment_status: string
  assignment_status: string
  requested_deadline: string | null
  updated_at: string
  artwork_uploaded: boolean
  artwork_required: boolean
  artwork_missing: boolean
  can_dispatch: boolean
  artwork_status_label: string
  artwork_reminder_sent: boolean
  artwork_confirmation: ManagerJobArtworkConfirmation
  payment_confirmed: boolean
  pricing: Record<string, unknown> | null
  client_name?: string
  assigned_shop_name?: string
  dispatched_at?: string | null
  [key: string]: unknown
}

export interface ManagerJobDetailPayload {
  role: string
  job: ManagerJobRow
  settlement: Record<string, unknown> | null
}

export interface ManagerDispatchResult {
  job_id: number
  assignment_id: number | null
  dispatched: boolean
  dispatched_at: string | null
  assignment_status: string
  shop_name: string
  artwork_verified: boolean
  [key: string]: unknown
}

export interface PartnerClientRow {
  client_id?: number | null
  name: string
  phone?: string
  email?: string
  company?: string
  is_offline?: boolean
  [key: string]: unknown
}

export interface PartnerProductionShopRow {
  id: number
  name: string
  slug: string
  city?: string
  service_area?: string
  location?: string
  can_receive_requests?: boolean
  can_price_requests?: boolean
  supports_custom_requests?: boolean
  supports_catalog_requests?: boolean
  pricing_source?: string
  [key: string]: unknown
}

/* ── admin dashboard ── */

export interface AdminDashboardCounts {
  users: number
  shops: number
  calculator_drafts: number
  quote_requests: number
  quotes: number
  managed_jobs: number
  job_assignments: number
  job_files: number
  payments: number
  notifications: number
}

export interface AdminDashboardPayload {
  counts: AdminDashboardCounts
  analytics: { status: string; detail: string }
}

/* ── public job tracking ── */

export interface TrackedJobRecord {
  tracking_reference: string
  job_status: string
  estimated_ready: string | null
  next_action: string
}

/* ── client job lifecycle ── */

export interface ClientArtworkConfirmation {
  state: 'not_required' | 'requested' | 'approved' | 'rejected' | string
  requested_at: string | null
  requested_by: number | null
  responded_at: string | null
  responded_by: number | null
  note: string
}

export interface ClientJobPricing {
  client_total?: string | null
  printy_fee?: string | null
  [key: string]: unknown
}

export interface ClientJobRecord {
  id: number
  reference: string
  job_reference: string
  quote_request_id: number | null
  quote_id: number | null
  quote_request_reference?: string
  quote_reference?: string
  title: string
  status: string
  payment_status: string
  assignment_status: string
  requested_deadline: string | null
  updated_at: string
  production_assignment_reference?: string
  tracking_reference?: string
  tracking_token?: string | null
  artwork_uploaded: boolean
  artwork_required: boolean
  artwork_missing: boolean
  can_dispatch: boolean
  artwork_status_label: string
  artwork_reminder_sent: boolean
  artwork_confirmation: ClientArtworkConfirmation
  payment_confirmed: boolean
  pricing: ClientJobPricing
  [key: string]: unknown
}

export interface ClientJobFileRecord {
  id: number
  managed_job: number
  assignment: number | null
  file_type: string
  visibility: string
  status: string
  version: number
  original_filename: string
  notes: string
  created_at: string
  download_url: string
  [key: string]: unknown
}

export interface ClientJobEventRecord {
  id: number
  event_type: string
  summary: string
  metadata: Record<string, unknown>
  actor_name: string
  created_at: string
}

export interface ClientPaymentRecord {
  id: number
  reference: string
  job_reference: string
  payment_reference: string
  amount: string | null
  payment_status: string
  channel: string
  created_at: string
  [key: string]: unknown
}
