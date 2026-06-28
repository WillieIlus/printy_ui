import { useDashboardApi } from '~/services/dashboard'
import { API } from '~/shared/api-paths'
import {
  fetchManagedJobFiles,
  fetchManagedJobSettlement,
  fetchShopAssignments,
  updateAssignmentAction,
  uploadManagedJobArtwork,
  uploadManagedJobProof,
} from '~/services/jobs'

export type ProductionAssignmentAction =
  | 'accept'
  | 'reject'
  | 'in-production'
  | 'finishing'
  | 'ready'
  | 'completed'
  | 'issue'

export async function getAssignments() {
  return fetchShopAssignments()
}

export async function getAssignmentDetail(id: number | string) {
  const assignmentId = String(id)
  const { fetchDashboardDetail } = useDashboardApi()
  const assignments = await fetchShopAssignments()
  const assignment = assignments.find(item => String(item.id) === assignmentId) || null
  if (!assignment) {
    return {
      assignment: null,
      job: null,
      settlement: null,
      files: [],
    }
  }

  const managedJobId = assignment.managed_job
  const [jobPayload, settlement, files] = await Promise.all([
    fetchDashboardDetail('production', 'jobs', managedJobId),
    fetchManagedJobSettlement(managedJobId),
    fetchManagedJobFiles(managedJobId),
  ])

  return {
    assignment,
    job: jobPayload?.job || null,
    settlement,
    files,
  }
}

export async function acceptAssignment(id: number | string) {
  return updateAssignmentAction(id, 'accept')
}

export async function rejectAssignment(id: number | string, reason = '') {
  return updateAssignmentAction(id, 'reject', reason)
}

export async function markInProduction(id: number | string) {
  return updateAssignmentAction(id, 'in-production')
}

export async function markFinishing(id: number | string) {
  return updateAssignmentAction(id, 'finishing')
}

export async function markReady(id: number | string) {
  return updateAssignmentAction(id, 'ready')
}

export async function markCompleted(id: number | string) {
  return updateAssignmentAction(id, 'completed')
}

export async function reportIssue(id: number | string, description: string) {
  return updateAssignmentAction(id, 'issue', description)
}

export async function uploadProof(managedJobId: number | string, file: File, note = '') {
  return uploadManagedJobProof(managedJobId, file, note)
}

export async function uploadArtwork(managedJobId: number | string, file: File, note = '') {
  return uploadManagedJobArtwork(managedJobId, file, note)
}

export async function getJobFiles(managedJobId: number | string) {
  return fetchManagedJobFiles(managedJobId)
}

export async function fetchPrintshopJobBreakdown(managedJobId: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.printshopJobBreakdown(managedJobId))
}
