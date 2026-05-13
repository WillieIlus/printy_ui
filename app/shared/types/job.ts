// Purpose: Job request shared typings.
export type JobRequest = {
  id?: number
  status?: string | null
  title?: string | null
} & Record<string, unknown>

export type JobClaim = {
  id?: number
  status?: string | null
} & Record<string, unknown>

export type JobRequestCreatePayload = {
  title?: string
  description?: string
} & Record<string, unknown>

export type JobWhatsappShareResponse = {
  message?: string
  whatsapp_url?: string
} & Record<string, unknown>

export type PublicJob = {
  token?: string
  title?: string | null
  status?: string | null
} & Record<string, unknown>

export type ManagedJobStatus =
  | 'draft'
  | 'quoted'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'assigned'
  | 'in_production'
  | 'finishing'
  | 'ready'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'cancelled'

export type ManagedJob = {
  id?: number
  managed_reference?: string | null
  title?: string | null
  status?: ManagedJobStatus | string | null
  payment_status?: string | null
  assignment_status?: string | null
  exception_status?: string | null
  fulfillment_mode?: string | null
  topology_type?: string | null
  urgency_type?: string | null
  operational_priority_level?: number | null
} & Record<string, unknown>
