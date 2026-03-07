/**
 * JobShare API composable.
 * Backend: /api/job-requests/, /api/job-claims/
 */
import { API } from '~/shared/api-paths'
import type {
  JobClaim,
  JobRequest,
  JobRequestCreatePayload,
  JobWhatsappShareResponse,
  PublicJob,
} from '~/shared/types/job'
import type { PaginatedResponse } from '~/shared/types/api'

export interface JobRequestListParams {
  status?: string
  created_by?: number
}

export interface JobClaimCreatePayload {
  message?: string
  price_offered?: number | string | null
}

export function useJobRequests() {
  const { $api } = useNuxtApp()

  async function list(params?: JobRequestListParams): Promise<PaginatedResponse<JobRequest>> {
    return $api<PaginatedResponse<JobRequest>>(API.jobRequests(), { params })
  }

  async function get(id: number): Promise<JobRequest> {
    return $api<JobRequest>(API.jobRequestDetail(id))
  }

  async function create(payload: JobRequestCreatePayload): Promise<JobRequest> {
    return $api<JobRequest>(API.jobRequests(), { method: 'POST', body: payload })
  }

  async function whatsappShare(id: number): Promise<JobWhatsappShareResponse> {
    return $api<JobWhatsappShareResponse>(API.jobRequestWhatsappShare(id), {
      method: 'POST',
      body: {},
    })
  }

  async function createClaim(jobId: number, payload?: JobClaimCreatePayload): Promise<JobClaim> {
    return $api<JobClaim>(API.jobRequestClaims(jobId), {
      method: 'POST',
      body: payload ?? {},
    })
  }

  return { list, get, create, whatsappShare, createClaim }
}

export function useJobClaims() {
  const { $api } = useNuxtApp()

  async function list(params?: { claimed_by?: 'me'; status?: string }): Promise<PaginatedResponse<JobClaim>> {
    return $api<PaginatedResponse<JobClaim>>(API.jobClaims(), { params })
  }

  async function accept(claimId: number): Promise<JobClaim> {
    return $api<JobClaim>(API.jobClaimAccept(claimId), { method: 'POST', body: {} })
  }

  async function reject(claimId: number): Promise<JobClaim> {
    return $api<JobClaim>(API.jobClaimReject(claimId), { method: 'POST', body: {} })
  }

  return { list, accept, reject }
}

export function usePublicJob() {
  const { $api } = useNuxtApp()

  async function getByToken(token: string): Promise<PublicJob> {
    return $api<PublicJob>(API.publicJob(token))
  }

  return { getByToken }
}
