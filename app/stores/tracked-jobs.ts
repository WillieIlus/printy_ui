import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'
import type { TrackedJob } from '~/shared/types'

/**
 * Law 7.12 — the buyer's live tracker.
 *
 * Only paid, owned jobs come back from the API; the store never filters or
 * derives stage state, time left or ordering on its own. It exists so the top
 * strip and the track page share one fetch and one shape.
 */
export const useTrackedJobsStore = defineStore('trackedJobs', {
  state: () => ({
    items: [] as TrackedJob[],
    loading: false,
    loaded: false,
    error: '' as string,
  }),
  getters: {
    count: (state) => state.items.length,
    hasJobs: (state) => state.items.length > 0,
    lateFirst: (state) => [...state.items].sort((a, b) => {
      if (a.is_late !== b.is_late) return a.is_late ? -1 : 1
      const aDue = a.due_at ? new Date(a.due_at).getTime() : Number.MAX_SAFE_INTEGER
      const bDue = b.due_at ? new Date(b.due_at).getTime() : Number.MAX_SAFE_INTEGER
      return aDue - bDue
    }),
  },
  actions: {
    async fetch(options: { silent?: boolean } = {}) {
      const { api } = useApi()
      if (!options.silent) {
        this.loading = true
        this.error = ''
      }
      try {
        const payload = await api<{ results?: TrackedJob[]; count?: number } | TrackedJob[]>(API.client.trackedJobs)
        this.items = normalizeApiList(payload) as TrackedJob[]
        this.error = ''
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't refresh your jobs in progress.")
      } finally {
        this.loading = false
        this.loaded = true
      }
    },
  },
})
