import type { ClientJobRecord } from '~/shared/types'

/**
 * Law Part 5 (7.1-7.3) buyer-side rules, kept as pure functions so the UI can
 * only ever render what the backend returns and the rules stay unit-testable.
 *
 * - 7.2 Artwork is a workflow step: a job with no artwork cannot be paid.
 * - 7.1 Price truth: a buyer never pays a stale price. When a refetched job
 *   total differs from the one the buyer last saw, the pay button stays
 *   disabled until the buyer acknowledges the new total.
 */

export interface PriceUpdate {
  oldTotal: string
  newTotal: string
}

export interface PriceTrackerState {
  seen: Record<number, string>
  updates: Record<number, PriceUpdate>
}

export interface PayabilityInput {
  priceNeedsAck?: boolean
}

export function createPriceTrackerState(): PriceTrackerState {
  return { seen: {}, updates: {} }
}

/** The buyer-visible total, exactly as the backend returned it. */
export function jobTotalText(job: Pick<ClientJobRecord, 'pricing'>): string {
  const raw = job.pricing?.client_total
  if (raw === null || raw === undefined) {
    return ''
  }
  return String(raw)
}

export function jobTotalAmount(job: Pick<ClientJobRecord, 'pricing'>): number {
  const value = Number(jobTotalText(job))
  return Number.isFinite(value) ? value : 0
}

/**
 * Fold a fresh set of backend job rows into the price tracker.
 *
 * The first time a job is seen its total becomes the baseline. Any later
 * difference is stored as a pending update that the buyer must acknowledge.
 */
export function observeJobTotals(
  state: PriceTrackerState,
  jobs: Array<Pick<ClientJobRecord, 'id' | 'pricing'>>,
): PriceTrackerState {
  const seen = { ...state.seen }
  const updates = { ...state.updates }
  for (const job of jobs) {
    const total = jobTotalText(job)
    if (!total) {
      continue
    }
    const previous = seen[job.id]
    if (previous === undefined) {
      seen[job.id] = total
    } else if (previous !== total) {
      updates[job.id] = { oldTotal: previous, newTotal: total }
    }
  }
  return { seen, updates }
}

/** Accept the new total and clear the pending update. */
export function acknowledgeJobTotal(state: PriceTrackerState, jobId: number): PriceTrackerState {
  const update = state.updates[jobId]
  const seen = { ...state.seen }
  const updates = { ...state.updates }
  if (update) {
    seen[jobId] = update.newTotal
  }
  delete updates[jobId]
  return { seen, updates }
}

export function priceUpdateFor(
  state: PriceTrackerState,
  jobId: number,
): PriceUpdate | null {
  return state.updates[jobId] ?? null
}

export function priceNeedsAcknowledgement(
  state: PriceTrackerState,
  jobId: number,
): boolean {
  return Boolean(state.updates[jobId])
}

/** law 7.2 + 7.1: a job is payable only when it has artwork and a fresh price. */
export function canPayJob(job: ClientJobRecord, input: PayabilityInput = {}): boolean {
  if (job.payment_confirmed) {
    return false
  }
  if (jobTotalAmount(job) <= 0) {
    return false
  }
  if (job.artwork_missing) {
    return false
  }
  if (input.priceNeedsAck) {
    return false
  }
  return true
}

/** Why the pay button is disabled, rendered verbatim (prompt item 2/3). */
export function payBlockedReason(
  job: ClientJobRecord,
  input: PayabilityInput = {},
): string | null {
  if (job.payment_confirmed) {
    return null
  }
  if (job.artwork_missing) {
    return 'Upload your artwork to pay'
  }
  if (input.priceNeedsAck) {
    return 'Price updated — acknowledge the new total to pay'
  }
  return null
}
