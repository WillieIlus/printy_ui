import { defineStore } from 'pinia'
import {
  STAGES,
  advancePress,
  approveArtwork,
  assignPrinter,
  confirmDelivery,
  money,
  nudge,
  payJob,
  pressLabel,
  prn,
  requestChanges,
  resolveDispute,
  type ActionId,
  type Job,
  type Role,
} from '~/shared/workflow/printy'
import { useApi } from '~/composables/useApi'

interface Toast {
  id: number
  text: string
  color: string
}

type WorkflowApiJob = Record<string, unknown>

function toJob(raw: WorkflowApiJob): Job {
  const job = { ...(raw as unknown as Job) }
  if (job.dispute == null) {
    delete job.dispute
  }
  if (!job.proofImg) {
    delete job.proofImg
  }
  job.press = (job.press as Job['press']) || null
  return job
}

function jobList(payload: unknown): Job[] {
  if (!Array.isArray(payload)) {
    return []
  }
  return (payload as WorkflowApiJob[]).map(toJob)
}

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    jobs: [] as Job[],
    role: 'buyer' as Role,
    selectedId: null as string | null,
    toasts: [] as Toast[],
    proofJob: null as Job | null,
    managerTab: 'list' as 'list' | 'board' | 'timeline',
    buyerTab: 'orders' as 'orders' | 'quote',
    pickFor: null as string | null,
    drill: null as { type: 'manager' | 'printer'; id: string } | null,
    toastSeq: 0,
    syncing: false,
  }),
  actions: {
    setRole(role: Role) {
      this.role = role
      this.selectedId = null
    },
    pushToast(text: string, color = 'var(--accent)') {
      const id = ++this.toastSeq
      this.toasts = [...this.toasts.slice(-2), { id, text, color }]
      window.setTimeout(() => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id)
      }, 3600)
    },
    mutate(id: string, fn: (job: Job) => Job) {
      this.jobs = this.jobs.map((j) => (j.id === id ? fn(j) : j))
    },
    async apiTransition(id: string, action: string, body?: Record<string, unknown>) {
      try {
        const { publicApiNoAuth } = useApi()
        const updated = await publicApiNoAuth<WorkflowApiJob>(`/workflow/jobs/${id}/${action}/`, {
          method: 'POST',
          body,
        })
        this.jobs = this.jobs.map((j) => (j.id === id ? toJob(updated) : j))
      } catch (error) {
        console.warn(`[workflow] ${action} not synced to API - keeping local state`, error)
      }
    },
    act(a: ActionId, job: Job, payload?: string) {
      if (a === 'open-job') {
        this.selectedId = job.id
        return
      }
      if (a === 'toast') {
        this.pushToast(payload ?? 'Done')
        return
      }
      if (a === 'review-proof') {
        this.proofJob = job
        return
      }

      if (a === 'approve') {
        this.mutate(job.id, approveArtwork)
        this.pushToast(`${job.code} - artwork approved. Ball moves to payment.`, '#2FBF71')
        this.apiTransition(job.id, 'approve')
      } else if (a === 'request-changes') {
        this.mutate(job.id, requestChanges)
        this.pushToast(`${job.code} - sent back to Studio for proof v3.`, '#F5A623')
        this.apiTransition(job.id, 'request-changes')
      } else if (a === 'pay') {
        this.mutate(job.id, payJob)
        this.pushToast(`${money(job.value)} secured in Printy Custody - job released to production.`, '#2FBF71')
        this.apiTransition(job.id, 'pay')
      } else if (a === 'confirm-delivery') {
        this.mutate(job.id, confirmDelivery)
        this.pushToast(`Delivery confirmed - ${money(job.value)} released to the printer.`, '#2FBF71')
        this.apiTransition(job.id, 'confirm-delivery')
      } else if (a === 'nudge') {
        const by = this.role === 'manager' ? 'You (manager)' : this.role === 'admin' ? 'Printy Admin' : 'You'
        this.mutate(job.id, (j) => nudge(j, by))
        this.pushToast(`Nudge sent to ${job.owner.name.split('-')[0]!.trim()}.`)
        this.apiTransition(job.id, 'nudge', { by })
      } else if (a === 'resolve-dispute') {
        this.mutate(job.id, resolveDispute)
        this.pushToast(`${job.code} - dispute resolved. Reprint approved, funds stay in custody.`, '#FB4D6D')
        this.apiTransition(job.id, 'resolve-dispute')
      } else if (a === 'assign' && payload) {
        const p = prn(payload)
        this.mutate(job.id, (j) => assignPrinter(j, payload))
        this.pushToast(`${job.code} - assigned to ${p?.name}. Ball passes to their floor.`)
        this.apiTransition(job.id, 'assign', { printer_id: payload })
      } else if (a === 'press-advance') {
        const next = advancePress(job)
        this.mutate(job.id, advancePress)
        const st = STAGES.find((s) => s.key === next.stage)
        this.pushToast(
          next.stage !== job.stage
            ? `${job.code} -> ${st?.label?.toUpperCase()}`
            : `${job.code} - ${pressLabel(next)?.toLowerCase() ?? 'updated'} on press.`,
        )
        this.apiTransition(job.id, 'press-advance')
      }
    },
    async syncFromApi() {
      this.syncing = true
      try {
        const { publicApiNoAuth } = useApi()
        const list = await publicApiNoAuth<unknown>('/workflow/jobs/', { method: 'GET' })
        this.jobs = jobList(list)
      } catch (error) {
        console.warn('[workflow] API unreachable - keeping local state', error)
      } finally {
        this.syncing = false
      }
    },
  },
})