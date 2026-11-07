import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'
import type { JobAssignment } from '~/shared/types'

const QUEUE_KEY = 'printy.printer.queue.v1'
const UNDO_WINDOW_MS = 2 * 60 * 1000

interface QueuedAction {
  assignmentId: number
  expectedStage: string
  requestId: string
  label: string
  queuedAt: number
}

interface UndoToast {
  assignmentId: number
  code: string
  text: string
  expiresAt: number
}

interface OptimisticAction {
  stageLabel: string
  actionLabel: string
}

function requestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readQueue(): QueuedAction[] {
  if (!import.meta.client) return []
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Printer floor queue.
 *
 * One tap queues the action locally first, then sends it with the stage the
 * printer saw plus a request id. A retry reuses both, so the server can never
 * advance two stages (prompt 4 / prompt 5 item 5). The API owns the next
 * action label; this store never invents one.
 */
export const usePrinterJobsStore = defineStore('printerJobs', {
  state: () => ({
    items: [] as JobAssignment[],
    loading: false,
    loaded: false,
    error: '' as string,
    busyIds: [] as number[],
    queue: [] as QueuedAction[],
    optimistic: {} as Record<number, OptimisticAction>,
    toast: null as UndoToast | null,
    syncing: false,
    toastTimer: null as ReturnType<typeof setTimeout> | null,
  }),
  getters: {
    active: (state) => state.items.filter((item) => String(item.status) !== 'completed'),
    actionNeeded: (state) => state.items.filter((item) => item.printer_action?.kind && item.printer_action.kind !== 'none').length,
    isBusy: (state) => (id: number) => state.busyIds.includes(id),
    queuedFor: (state) => (id: number) => state.queue.find((item) => item.assignmentId === id) ?? null,
    pendingCount: (state) => state.queue.length,
    optimisticFor: (state) => (id: number) => state.optimistic[id] ?? null,
    /** Finished/muted last, then needs-attention, late, soonest due. */
    sorted: (state) => [...state.items].sort((a, b) => {
      const finishedA = a.muted || String(a.status) === 'completed' ? 1 : 0
      const finishedB = b.muted || String(b.status) === 'completed' ? 1 : 0
      if (finishedA !== finishedB) return finishedA - finishedB
      const attentionA = a.needs_attention ? 0 : 1
      const attentionB = b.needs_attention ? 0 : 1
      if (attentionA !== attentionB) return attentionA - attentionB
      const lateA = a.timing?.is_late ? 0 : 1
      const lateB = b.timing?.is_late ? 0 : 1
      if (lateA !== lateB) return lateA - lateB
      const dueA = new Date(a.timing?.due_date || a.due_at || '2999-01-01').getTime()
      const dueB = new Date(b.timing?.due_date || b.due_at || '2999-01-01').getTime()
      return dueA - dueB
    }),
  },
  actions: {
    hydrateQueue() {
      this.queue = readQueue()
    },
    persistQueue() {
      if (!import.meta.client) return
      try {
        window.localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue))
      } catch {
        /* storage is best-effort; the in-memory queue still retries */
      }
    },
    replace(updated: JobAssignment) {
      const index = this.items.findIndex((item) => item.id === updated.id)
      if (index >= 0) this.items[index] = updated
    },
    enqueue(action: QueuedAction) {
      this.queue = [...this.queue.filter((item) => item.assignmentId !== action.assignmentId), action]
      this.persistQueue()
    },
    dequeue(assignmentId: number) {
      this.queue = this.queue.filter((item) => item.assignmentId !== assignmentId)
      this.persistQueue()
    },
    async load(options: { silent?: boolean } = {}) {
      const { api } = useApi()
      if (!options.silent) {
        this.loading = true
        this.error = ''
      }
      try {
        const payload = await api<JobAssignment[] | { results: JobAssignment[] }>(API.assignments.list)
        this.items = normalizeApiList(payload) as JobAssignment[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your floor queue.")
      } finally {
        this.loading = false
        this.loaded = true
      }
    },
    async advance(assignment: JobAssignment) {
      const action = assignment.printer_action
      if (!action || action.kind === 'none' || this.busyIds.includes(assignment.id)) return
      const { api } = useApi()
      const queued: QueuedAction = {
        assignmentId: assignment.id,
        expectedStage: action.stage_key,
        requestId: requestId(),
        label: action.label,
        queuedAt: Date.now(),
      }
      this.busyIds = [...this.busyIds, assignment.id]
      this.optimistic = { ...this.optimistic, [assignment.id]: { stageLabel: action.stage_label, actionLabel: action.label } }
      this.error = ''
      this.enqueue(queued)
      try {
        const updated = await api<JobAssignment>(API.assignments.advance(assignment.id), {
          method: 'POST',
          body: { expected_stage: queued.expectedStage, request_id: queued.requestId },
        })
        this.replace(updated)
        this.dequeue(assignment.id)
        this.showUndoToast(updated, queued.label)
      } catch (error) {
        const status = Number((error as { statusCode?: number })?.statusCode ?? 0)
        if (status === 409) {
          this.dequeue(assignment.id)
          await this.load({ silent: true })
          this.error = 'That stage had already moved. The card now shows the next action.'
        } else if (!status || status >= 500 || !navigator.onLine) {
          // Keep the action queued with the same request id. The retry is a
          // no-op on the server if the first attempt actually landed.
          this.error = ''
        } else {
          this.dequeue(assignment.id)
          this.error = getApiErrorMessage(error, 'That update could not be applied.')
          await this.load({ silent: true })
        }
      } finally {
        this.busyIds = this.busyIds.filter((id) => id !== assignment.id)
        const next = { ...this.optimistic }
        delete next[assignment.id]
        this.optimistic = next
      }
    },
    async syncQueue() {
      if (this.syncing || !import.meta.client || !navigator.onLine) return
      const pending = [...this.queue]
      if (!pending.length) return
      const { api } = useApi()
      this.syncing = true
      try {
        for (const item of pending) {
          if (this.busyIds.includes(item.assignmentId)) continue
          try {
            const updated = await api<JobAssignment>(API.assignments.advance(item.assignmentId), {
              method: 'POST',
              body: { expected_stage: item.expectedStage, request_id: item.requestId },
            })
            this.replace(updated)
            this.dequeue(item.assignmentId)
            this.showUndoToast(updated, item.label)
          } catch (error) {
            const status = Number((error as { statusCode?: number })?.statusCode ?? 0)
            if (status === 409) {
              this.dequeue(item.assignmentId)
              await this.load({ silent: true })
            } else if (!status || status >= 500) {
              // Still offline or the server is unreachable: leave it queued.
              break
            } else {
              this.dequeue(item.assignmentId)
              this.error = getApiErrorMessage(error, 'A queued update could not be applied.')
              await this.load({ silent: true })
            }
          }
        }
      } finally {
        this.syncing = false
      }
    },
    async undo(assignment: JobAssignment) {
      const { api } = useApi()
      const queued = this.queuedFor(assignment.id)
      if (queued) {
        this.dequeue(assignment.id)
        this.toast = null
        return
      }
      try {
        const updated = await api<JobAssignment>(API.assignments.undo(assignment.id), { method: 'POST' })
        this.replace(updated)
        this.clearToast()
      } catch (error) {
        this.error = getApiErrorMessage(error, 'That update could not be undone.')
      }
    },
    async undoToast() {
      if (!this.toast) return
      const assignment = this.items.find((item) => item.id === this.toast?.assignmentId)
      if (assignment) {
        await this.undo(assignment)
      } else {
        this.clearToast()
      }
    },
    showUndoToast(assignment: JobAssignment, label: string) {
      this.clearToast()
      this.toast = {
        assignmentId: assignment.id,
        code: assignment.code || assignment.managed_reference,
        text: label,
        expiresAt: Date.now() + UNDO_WINDOW_MS,
      }
      this.toastTimer = setTimeout(() => {
        this.toast = null
        this.toastTimer = null
      }, UNDO_WINDOW_MS)
    },
    clearToast() {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer)
        this.toastTimer = null
      }
      this.toast = null
    },
  },
})
