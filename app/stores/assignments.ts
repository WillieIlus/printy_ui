import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'
import type { AssignmentAction, JobAssignment } from '~/shared/types'

const ACTION_ENDPOINTS: Record<Exclude<AssignmentAction, 'upload_proof'>, (id: number | string) => string> = {
  accept: API.assignments.accept,
  reject: API.assignments.reject,
  mark_printing: API.assignments.markInProduction,
  mark_finishing: API.assignments.markFinishing,
  mark_ready: API.assignments.markReady,
  mark_completed: API.assignments.markCompleted,
}

const NOTE_ACTIONS: AssignmentAction[] = ['reject']

export const ASSIGNMENT_ACTION_LABELS: Record<AssignmentAction, string> = {
  accept: 'Accept job',
  reject: 'Decline',
  mark_printing: 'Start printing',
  mark_finishing: 'Send to finishing',
  mark_ready: 'Mark ready',
  mark_completed: 'Mark completed',
  upload_proof: 'Upload proof',
}

/**
 * Production-floor job assignments for a shop owner.
 *
 * The backend is the authority on which transitions are legal — `next_allowed_actions`
 * drives the buttons so the UI can never request an invalid transition.
 */
export const useAssignmentsStore = defineStore('assignments', {
  state: () => ({
    items: [] as JobAssignment[],
    loading: false,
    actingId: null as number | null,
    error: '' as string,
  }),
  getters: {
    active: (state) => state.items.filter((item) => item.status !== 'completed'),
    hasAssignments: (state) => state.items.length > 0,
  },
  actions: {
    async fetch() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<JobAssignment[] | { results: JobAssignment[] }>(API.assignments.list)
        this.items = normalizeApiList(payload) as JobAssignment[]
      } catch {
        this.error = "We couldn't load your job queue."
      } finally {
        this.loading = false
      }
    },
    async reportIssue(assignment: JobAssignment, note: string) {
      const { api } = useApi()
      this.actingId = assignment.id
      try {
        const updated = await api<JobAssignment>(API.assignments.reportIssue(assignment.id), {
          method: 'POST',
          body: { note },
        })
        this.replace(updated)
      } finally {
        this.actingId = null
      }
    },
    async perform(assignment: JobAssignment, action: Exclude<AssignmentAction, 'upload_proof'>, note = '') {
      const { api } = useApi()
      this.actingId = assignment.id
      try {
        const body = NOTE_ACTIONS.includes(action) ? { note } : undefined
        const updated = await api<JobAssignment>(ACTION_ENDPOINTS[action](assignment.id), { method: 'POST', body })
        this.replace(updated)
      } finally {
        this.actingId = null
      }
    },
    async uploadProof(assignment: JobAssignment, file: File) {
      const { api } = useApi()
      this.actingId = assignment.id
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('file_type', 'proof')
        await api(API.managedJobs.proofs(assignment.managed_job), { method: 'POST', body: form })
        await this.fetch()
      } finally {
        this.actingId = null
      }
    },
    replace(updated: JobAssignment) {
      const idx = this.items.findIndex((item) => item.id === updated.id)
      if (idx >= 0) {
        this.items[idx] = updated
      }
    },
  },
})
