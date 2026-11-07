import { describe, it, expect } from 'vitest'
import {
  acknowledgeJobTotal,
  canPayJob,
  createPriceTrackerState,
  jobTotalAmount,
  jobTotalText,
  observeJobTotals,
  payBlockedReason,
  priceNeedsAcknowledgement,
  priceUpdateFor,
} from '~/shared/buyer-law7'
import type { ClientJobRecord } from '~/shared/types'

function job(overrides: Partial<ClientJobRecord> = {}): ClientJobRecord {
  return {
    id: 5,
    reference: 'JOB-1',
    job_reference: 'JOB-1',
    quote_request_id: null,
    quote_id: null,
    title: 'Business cards',
    status: 'awaiting_payment',
    payment_status: 'pending',
    assignment_status: 'unassigned',
    requested_deadline: null,
    updated_at: '2026-01-01T00:00:00Z',
    artwork_uploaded: true,
    artwork_required: false,
    artwork_missing: false,
    can_dispatch: false,
    artwork_status_label: 'Received',
    artwork_reminder_sent: false,
    artwork_confirmation: {
      state: 'approved',
      requested_at: null,
      requested_by: null,
      responded_at: null,
      responded_by: null,
      note: '',
    },
    payment_confirmed: false,
    pricing: { client_total: '1500.00' },
    ...overrides,
  }
}

describe('buyer law 7 - totals come from the backend payload', () => {
  it('reads the client total as text and number', () => {
    expect(jobTotalText(job())).toBe('1500.00')
    expect(jobTotalAmount(job())).toBe(1500)
  })

  it('treats a missing total as empty/zero', () => {
    expect(jobTotalText(job({ pricing: {} }))).toBe('')
    expect(jobTotalAmount(job({ pricing: { client_total: null } }))).toBe(0)
  })
})

describe('law 7.1 price truth - stale price must be acknowledged', () => {
  it('sets a baseline on first sight with no update', () => {
    const state = observeJobTotals(createPriceTrackerState(), [job()])
    expect(state.seen[5]).toBe('1500.00')
    expect(priceNeedsAcknowledgement(state, 5)).toBe(false)
    expect(priceUpdateFor(state, 5)).toBeNull()
  })

  it('does not flag a price that did not change', () => {
    let state = observeJobTotals(createPriceTrackerState(), [job()])
    state = observeJobTotals(state, [job()])
    expect(priceNeedsAcknowledgement(state, 5)).toBe(false)
  })

  it('flags old and new totals when the refetched price changes', () => {
    let state = observeJobTotals(createPriceTrackerState(), [job({ pricing: { client_total: '1500.00' } })])
    state = observeJobTotals(state, [job({ pricing: { client_total: '1800.00' } })])
    expect(priceNeedsAcknowledgement(state, 5)).toBe(true)
    expect(priceUpdateFor(state, 5)).toEqual({ oldTotal: '1500.00', newTotal: '1800.00' })
  })

  it('clears the update and moves the baseline on acknowledgement', () => {
    let state = observeJobTotals(createPriceTrackerState(), [job({ pricing: { client_total: '1500.00' } })])
    state = observeJobTotals(state, [job({ pricing: { client_total: '1800.00' } })])
    state = acknowledgeJobTotal(state, 5)
    expect(priceNeedsAcknowledgement(state, 5)).toBe(false)
    expect(state.seen[5]).toBe('1800.00')
  })

  it('never lets a stale price be paid while acknowledgement is pending', () => {
    const path = '/shared/buyer-law7'
    const stale = observeJobTotals(
      observeJobTotals(createPriceTrackerState(), [job({ pricing: { client_total: '1500.00' } })]),
      [job({ pricing: { client_total: '1800.00' } })],
    )
    expect(canPayJob(job({ pricing: { client_total: '1800.00' } }), { priceNeedsAck: priceNeedsAcknowledgement(stale, 5) })).toBe(false)
    expect(payBlockedReason(job({ pricing: { client_total: '1800.00' } }), { priceNeedsAck: priceNeedsAcknowledgement(stale, 5) }))
      .toContain('Price updated')
    expect(path).toBe('/shared/buyer-law7')
  })
})

describe('law 7.2 artwork is a workflow step', () => {
  it('blocks payment when the job has no artwork and says why', () => {
    const blocked = job({ artwork_missing: true, artwork_uploaded: false })
    expect(canPayJob(blocked)).toBe(false)
    expect(payBlockedReason(blocked)).toBe('Upload your artwork to pay')
  })

  it('allows payment once artwork exists', () => {
    const ready = job({ artwork_missing: false, artwork_uploaded: true })
    expect(canPayJob(ready)).toBe(true)
    expect(payBlockedReason(ready)).toBeNull()
  })

  it('never marks an already-paid job payable', () => {
    const paid = job({ payment_confirmed: true })
    expect(canPayJob(paid)).toBe(false)
  })

  it('does not offer payment for a job with no priced total', () => {
    expect(canPayJob(job({ pricing: {} }))).toBe(false)
  })
})
