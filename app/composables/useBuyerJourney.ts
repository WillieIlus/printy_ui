import { computed, ref } from 'vue'
import type { BuyerQuoteItem, ClientJobRecord, QuoteRequestSummary } from '~/shared/types'
import {
  buildJourneyStages,
  completedJourneyStages,
  firstOpenStage,
  JOURNEY_STAGE_ORDER,
  type JourneySignals,
} from '~/shared/journey'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useClientJobsStore } from '~/stores/client-jobs'
import { useIntakeStore } from '~/stores/intake'
import { useMpesaStore } from '~/stores/mpesa'

const JOB_PROGRESS = [
  'draft',
  'quoted',
  'awaiting_payment',
  'payment_confirmed',
  'assigned',
  'in_production',
  'finishing',
  'ready',
  'delivered',
  'completed',
] as const

const QUOTE_REACHED = new Set([
  'quoted',
  'awaiting_payment',
  'payment_confirmed',
  'assigned',
  'in_production',
  'finishing',
  'ready',
  'delivered',
  'completed',
])
const PAID_REACHED = new Set([
  'payment_confirmed',
  'assigned',
  'in_production',
  'finishing',
  'ready',
  'delivered',
  'completed',
])
const PAID_PAYMENT_STATUS = new Set(['confirmed', 'release_ready', 'released'])
const IN_PRODUCTION = new Set(['in_production', 'finishing', 'ready', 'delivered', 'completed'])
const STOPPED = new Set(['disputed', 'cancelled'])
const STOPPED_COPY: Record<string, string> = {
  disputed: 'This job is under dispute. Printy support is on it.',
  cancelled: 'This job was cancelled.',
}
const PAYMENT_FAILURES = new Set(['failed', 'cancelled', 'error'])

function rank(status: string): number {
  const index = JOB_PROGRESS.indexOf(status as (typeof JOB_PROGRESS)[number])
  return index < 0 ? 0 : index
}

function sentence(status: string): string {
  const text = status.replace(/[_-]+/g, ' ').trim()
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

/**
 * Derives the buyer's four gated homepage stages from backend-confirmed state
 * only. Nothing here writes state: the calculator preview, the intake command,
 * the M-Pesa checkout and the buyer's job records are the single sources of
 * truth, and a stage is only ever `completed` when the backend says so.
 */
export function useBuyerJourney() {
  const auth = useAuthStore()
  const calculator = useCalculatorStore()
  const clientJobs = useClientJobsStore()
  const intake = useIntakeStore()
  const mpesa = useMpesaStore()

  const signedIn = computed(() => auth.isAuthenticated)
  const buyerQuotes = ref<BuyerQuoteItem[]>([])

  /**
   * The intake command only creates a backend quote request, so the buyer's job
   * list stays empty until a manager converts it. These persisted quote
   * requests are what proves the request survived a page load.
   */
  const quoteRequests = computed<QuoteRequestSummary[]>(() => {
    const items = buyerQuotes.value.filter(
      (item): item is { item_type: 'quote_request'; quote_request: QuoteRequestSummary } => item.item_type === 'quote_request',
    )
    return items.map((item) => item.quote_request).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
  })
  const latestRequest = computed<QuoteRequestSummary | null>(() => quoteRequests.value[0] ?? null)

  const furthestJob = computed<ClientJobRecord | null>(() => {
    let best: ClientJobRecord | null = null
    for (const job of clientJobs.jobs) {
      if (!best || rank(String(job.status)) > rank(String(best.status))) {
        best = job
      }
    }
    return best
  })

  const signals = computed<JourneySignals>(() => {
    const job = furthestJob.value
    const status = job ? String(job.status) : ''
    const paymentStatus = job ? String(job.payment_status) : ''
    const reference = job ? String(job.job_reference || job.reference || '') : ''
    const hasJob = Boolean(job)
    const previewReady = calculator.canPrice
    const submission = intake.lastSubmission
    const quoteOnRecord = Boolean(job?.quote_request_id ?? job?.quote_id)
    const request = latestRequest.value
    const quoteComplete = Boolean(submission)
      || Boolean(request)
      || (hasJob && (QUOTE_REACHED.has(status) || (STOPPED.has(status) && quoteOnRecord)))

    return {
      signedIn: signedIn.value,
      stages: {
        details: {
          complete: previewReady || hasJob,
          loading: calculator.previewStatus === 'loading',
          error: calculator.previewStatus === 'error' ? calculator.previewError : null,
          detail: hasJob
            ? `Job ${reference} on record`
            : previewReady
              ? 'Backend estimate ready'
              : null,
        },
        quote: {
          complete: quoteComplete,
          loading: intake.loading || intake.submitting,
          error: intake.error || null,
          detail: submission
            ? `Sent to ${submission.manager_name}`
            : request
              ? `Request ${request.request_reference} · ${request.status_label}`
              : hasJob && sentence(status)
                ? `Manager status: ${sentence(status)}`
                : null,
        },
        payment: {
          complete: Boolean(
            hasJob && (job?.payment_confirmed || PAID_REACHED.has(status) || PAID_PAYMENT_STATUS.has(paymentStatus)),
          ),
          loading: mpesa.phase === 'initiated' || mpesa.phase === 'pending' || mpesa.polling,
          error: mpesa.phase && PAYMENT_FAILURES.has(mpesa.phase) ? mpesa.errorMessage || 'The payment did not go through.' : null,
          detail: mpesa.phase === 'paid' && mpesa.receipt ? `M-Pesa receipt ${mpesa.receipt}` : null,
        },
        production: {
          complete: hasJob && IN_PRODUCTION.has(status),
          loading: false,
          error: hasJob && STOPPED.has(status) ? STOPPED_COPY[status] || null : null,
          detail: hasJob ? `Job ${reference} · ${sentence(status)}` : null,
        },
      },
    }
  })

  const stages = computed(() => buildJourneyStages(signals.value))
  const openStage = computed(() => firstOpenStage(stages.value))
  const completedCount = computed(() => completedJourneyStages(stages.value))
  const progress = computed(() => Math.round((completedCount.value / JOURNEY_STAGE_ORDER.length) * 100))
  const jobsError = computed(() => clientJobs.error)

  async function refresh() {
    if (!signedIn.value || clientJobs.loading) {
      return
    }
    await Promise.all([
      calculator.fetchBuyerQuotes()
        .then((items) => { buyerQuotes.value = Array.isArray(items) ? items : [] })
        .catch(() => { buyerQuotes.value = [] }),
      clientJobs.fetchJobs(),
    ])
  }

  return {
    signedIn,
    stages,
    openStage,
    completedCount,
    progress,
    jobsError,
    refresh,
  }
}
