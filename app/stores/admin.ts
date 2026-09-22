import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type { AdminDashboardCounts, AdminDashboardPayload } from '~/shared/types'

const EMPTY_COUNTS: AdminDashboardCounts = {
  users: 0,
  shops: 0,
  calculator_drafts: 0,
  quote_requests: 0,
  quotes: 0,
  managed_jobs: 0,
  job_assignments: 0,
  job_files: 0,
  payments: 0,
  notifications: 0,
}

/**
 * Platform-wide admin dashboard counts (real backend totals).
 */
export const useAdminStore = defineStore('admin', {
  state: () => ({
    counts: { ...EMPTY_COUNTS } as AdminDashboardCounts,
    analytics: null as AdminDashboardPayload['analytics'] | null,
    loading: false,
    error: '' as string,
  }),
  getters: {
    hasCounts: (state) => Object.values(state.counts).some((value) => value > 0),
  },
  actions: {
    async fetchHome() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<AdminDashboardPayload>(API.admin.home)
        this.counts = { ...EMPTY_COUNTS, ...(payload?.counts ?? {}) }
        this.analytics = payload?.analytics ?? null
      } catch {
        this.error = "We couldn't load platform totals."
      } finally {
        this.loading = false
      }
    },
  },
})
