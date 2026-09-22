import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'
import type {
  ClientJobEventRecord,
  ClientJobFileRecord,
  ClientJobRecord,
  ClientPaymentRecord,
} from '~/shared/types'

/**
 * Client-side managed job lifecycle: the buyer's real orders, job files
 * (proofs + artwork) with approve/reject/revision actions, artwork
 * confirmation, reorders and payment history.
 */
export const useClientJobsStore = defineStore('clientJobs', {
  state: () => ({
    jobs: [] as ClientJobRecord[],
    activeJob: null as ClientJobRecord | null,
    files: [] as ClientJobFileRecord[],
    events: [] as ClientJobEventRecord[],
    payments: [] as ClientPaymentRecord[],
    paymentHistory: [] as ClientPaymentRecord[],
    loading: false,
    detailLoading: false,
    actingId: null as number | null,
    error: '' as string,
  }),
  getters: {
    hasJobs: (state) => state.jobs.length > 0,
    needsAction: (state) =>
      state.jobs.filter((job) =>
        job.artwork_confirmation?.state === 'requested'
        || (!job.payment_confirmed && ['awaiting_payment', 'payment_pending'].includes(String(job.payment_status))),
      ),
  },
  actions: {
    async fetchJobs() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<{ results?: ClientJobRecord[] } | ClientJobRecord[]>(API.client.jobs)
        this.jobs = normalizeApiList(payload) as ClientJobRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your orders.")
      } finally {
        this.loading = false
      }
    },
    async fetchJob(id: number) {
      const { api } = useApi()
      this.detailLoading = true
      this.error = ''
      try {
        const payload = await api<{ job?: ClientJobRecord } | ClientJobRecord>(API.client.job(id))
        const job = (payload && !Array.isArray(payload) && 'job' in payload ? payload.job : payload) as ClientJobRecord
        this.activeJob = job ?? null
        return this.activeJob
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load that order.")
        return null
      } finally {
        this.detailLoading = false
      }
    },
    async fetchFiles(jobId: number) {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<ClientJobFileRecord[] | { results: ClientJobFileRecord[] }>(API.managedJobs.files(jobId))
        this.files = normalizeApiList(payload) as ClientJobFileRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load this job's files.")
      }
    },
    async fetchEvents(jobId: number) {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<ClientJobEventRecord[] | { results: ClientJobEventRecord[] }>(API.managedJobs.events(jobId))
        this.events = normalizeApiList(payload) as ClientJobEventRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load this job's timeline.")
      }
    },
    async fetchPayments(jobId: number) {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<ClientPaymentRecord[] | { results: ClientPaymentRecord[] }>(API.managedJobs.payments(jobId))
        this.payments = normalizeApiList(payload) as ClientPaymentRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load this job's payments.")
      }
    },
    async fetchPaymentHistory() {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<{ results?: ClientPaymentRecord[] } | ClientPaymentRecord[]>(API.client.payments)
        this.paymentHistory = normalizeApiList(payload) as ClientPaymentRecord[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your payments.")
      }
    },
    async uploadArtwork(jobId: number, file: File, note = '') {
      const { api } = useApi()
      this.actingId = jobId
      this.error = ''
      try {
        const form = new FormData()
        form.append('file', file)
        if (note) form.append('note', note)
        const created = await api<ClientJobFileRecord>(API.managedJobs.artwork(jobId), { method: 'POST', body: form })
        this.files.push(created)
        const job = this.jobs.find((item) => item.id === jobId)
        if (job) {
          job.artwork_uploaded = true
          job.artwork_missing = false
        }
        return created
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't upload that artwork.")
        return null
      } finally {
        this.actingId = null
      }
    },
    async actOnFile(fileId: number, action: 'approve' | 'reject' | 'revision', note = '') {
      const { api } = useApi()
      this.actingId = fileId
      this.error = ''
      try {
        const endpoint = action === 'approve'
          ? API.jobFiles.approve(fileId)
          : action === 'reject'
            ? API.jobFiles.reject(fileId)
            : API.jobFiles.requestRevision(fileId)
        await api(endpoint, { method: 'POST', body: { note } })
        const file = this.files.find((item) => item.id === fileId)
        if (file) file.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'revision_requested'
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't update that file.")
      } finally {
        this.actingId = null
      }
    },
    async respondToArtworkConfirmation(jobId: number, approved: boolean, note = '') {
      const { api } = useApi()
      this.actingId = jobId
      this.error = ''
      try {
        const payload = await api<{ artwork_confirmation: ClientJobRecord['artwork_confirmation'] }>(
          API.managedJobs.artworkConfirmationRespond(jobId),
          { method: 'POST', body: { action: approved ? 'approve' : 'reject', note } },
        )
        const job = this.jobs.find((item) => item.id === jobId)
        if (job && payload?.artwork_confirmation) job.artwork_confirmation = payload.artwork_confirmation
        if (this.activeJob?.id === jobId && payload?.artwork_confirmation) {
          this.activeJob.artwork_confirmation = payload.artwork_confirmation
        }
        return true
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't record your artwork decision.")
        return false
      } finally {
        this.actingId = null
      }
    },
    async reorder(jobId: number) {
      const { api } = useApi()
      this.actingId = jobId
      this.error = ''
      try {
        return await api<{ draft_id: number; specs_copied_from: number }>(API.managedJobs.reorder(jobId), { method: 'POST' })
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't start a reorder.")
        return null
      } finally {
        this.actingId = null
      }
    },
  },
})
