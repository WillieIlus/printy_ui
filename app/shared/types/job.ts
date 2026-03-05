/** JobRequest from JobShare API */
export type JobRequestStatus = 'OPEN' | 'CLAIMED' | 'CLOSED'
export type JobClaimStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface JobClaim {
  id: number
  job_request: number
  job_request_title?: string
  claimed_by: number
  claimed_by_email?: string
  price_offered: string | null
  message: string
  status: JobClaimStatus
  created_at: string
}

export interface JobRequest {
  id: number
  title: string
  specs: Record<string, unknown>
  location: string
  deadline: string | null
  status: JobRequestStatus
  created_by: number
  created_by_email?: string
  created_at: string
  updated_at?: string
  claims_count?: number
  claims?: JobClaim[]
}

export interface JobRequestCreatePayload {
  title: string
  specs?: Record<string, unknown>
  location?: string
  deadline?: string | null
}

export interface JobWhatsappShareResponse {
  message: string
  public_view_url: string
}

/** Public job view (minimal, no auth) */
export interface PublicJob {
  id: number
  title: string
  specs: Record<string, unknown>
  location: string
  deadline: string | null
  status: string
  claim_cta?: string
  requires_login?: boolean
}
