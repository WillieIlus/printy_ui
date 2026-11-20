/** Shared action allowlist and caller for the one perform-next-action endpoint. */
import type { ApiClient } from '~/shared/api'
import { API } from '~/shared/api-paths'
import type { JobCardPerformResponse } from '~/shared/job-card'

/**
 * Codes the card endpoint can perform without extra UI state.
 *
 * The backend deliberately refuses upload_artwork (it needs a file body) and
 * the quote workflow codes (accept_quote / prepare_quote / review_artwork), so
 * those surfaces keep their existing link instead of pretending to be a card
 * action. dispatch/reassign need a shop choice and are handled by the existing
 * manager picker, so they are not one-tap card actions.
 */
export const PERFORMABLE_ACTION_CODES = new Set([
  'accept_job',
  'start_printing',
  'advance_production',
  'pass_qc',
  'confirm_delivery',
  'coordinate_delivery',
  'mark_dispatched',
  'approve_artwork',
])

/** Dispatch/reassign are performable once the card also has a shop choice. */
export const DISPATCH_ACTION_CODES = new Set(['dispatch_job', 'reassign_job'])

export function isDispatchAction(code?: string | null): boolean {
  return Boolean(code && DISPATCH_ACTION_CODES.has(code))
}

export function isPerformableAction(code?: string | null): boolean {
  return Boolean(code && (PERFORMABLE_ACTION_CODES.has(code) || DISPATCH_ACTION_CODES.has(code)))
}

export function performJobAction(
  api: ApiClient,
  jobId: number | string,
  code: string,
  extra: Record<string, unknown> = {},
): Promise<JobCardPerformResponse> {
  return api<JobCardPerformResponse>(API.managedJobs.nextAction(jobId), {
    method: 'POST',
    body: { code, ...extra },
  })
}
