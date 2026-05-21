import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'

export type TrackedJob = Record<string, any> & {
  track_type: 'managed_job' | 'legacy_job'
}

export async function fetchManagedPublicJob(token: string) {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.jobs.publicManagedTrack(token), { auth: false })
}

export async function fetchPublicJob(token: string) {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.jobs.publicTrack(token), { auth: false })
}

export async function fetchTrackedJob(token: string): Promise<TrackedJob> {
  try {
    const managed = await fetchManagedPublicJob(token)
    return { ...managed, track_type: 'managed_job' }
  } catch (error: any) {
    const status = error?.statusCode || error?.status || error?.response?.status
    if (status !== 404) {
      throw error
    }
  }
  return { ...(await fetchPublicJob(token)), track_type: 'legacy_job' }
}

export async function fetchManagedJobs() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.jobs.managedJobs))
}

export async function fetchShopAssignments() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.jobs.shopAssignments))
}

export async function fetchManagedJobFiles(id: number | string) {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.jobs.managedJobFiles(id)))
}

export async function fetchManagedJobEvents(id: number | string) {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.jobs.managedJobEvents(id)))
}

export async function fetchManagedJobPayments(id: number | string) {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.jobs.managedJobPayments(id)))
}

export async function fetchManagedJobSettlement(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.jobs.managedJobSettlement(id))
}

export async function initiateManagedJobPayment(id: number | string, phone_number: string, amount?: number | null) {
  const { api } = useApi()
  return api<Record<string, any>>(API.jobs.managedJobStkPush(id), {
    method: 'POST',
    body: { phone_number, amount },
  })
}

export async function queryManagedJobPayment(id: number | string, checkout_request_id: string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.jobs.managedJobPaymentQuery(id), {
    method: 'POST',
    body: { checkout_request_id },
  })
}

export async function dispatchManagedJob(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerJobDispatch(id), { method: 'POST' })
}

export async function uploadManagedJobProof(id: number | string, file: File, note = '') {
  const token = useCookie<string | null>('printy_access_token')
  const config = useRuntimeConfig()
  const baseURL = String(config.public.apiBase || 'http://127.0.0.1:8000/api')
  const formData = new FormData()
  formData.append('file', file)
  formData.append('note', note)
  return $fetch<Record<string, any>>(API.jobs.managedJobProofUpload(id), {
    baseURL,
    method: 'POST',
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : undefined,
    body: formData,
  })
}

export async function updateAssignmentAction(id: number | string, action: 'accept' | 'reject' | 'in-production' | 'ready' | 'completed' | 'issue', note = '') {
  const { api } = useApi()
  const endpoint = action === 'accept'
    ? API.jobs.assignmentAccept(id)
    : action === 'reject'
      ? API.jobs.assignmentReject(id)
      : action === 'in-production'
        ? API.jobs.assignmentInProduction(id)
        : action === 'ready'
          ? API.jobs.assignmentReady(id)
          : action === 'completed'
            ? API.jobs.assignmentCompleted(id)
            : API.jobs.assignmentReportIssue(id)
  return api<Record<string, any>>(endpoint, {
    method: 'POST',
    body: { note },
  })
}

export async function updateJobFileAction(id: number | string, action: 'approve' | 'reject' | 'revision', note = '') {
  const { api } = useApi()
  const endpoint = action === 'approve'
    ? API.jobs.jobFileApprove(id)
    : action === 'reject'
      ? API.jobs.jobFileReject(id)
      : API.jobs.jobFileRequestRevision(id)
  return api<Record<string, any>>(endpoint, {
    method: 'POST',
    body: { note },
  })
}
