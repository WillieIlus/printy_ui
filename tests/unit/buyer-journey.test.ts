import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  buildJourneyStages,
  completedJourneyStages,
  firstOpenStage,
  type JourneySignals,
} from '~/shared/journey'
import { useBuyerJourney } from '~/composables/useBuyerJourney'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useClientJobsStore } from '~/stores/client-jobs'
import { useIntakeStore } from '~/stores/intake'
import { useMpesaStore } from '~/stores/mpesa'
import type { AuthUser, ClientJobRecord, ServerCalculatorPreview } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function signals(overrides: Partial<JourneySignals> = {}): JourneySignals {
  return {
    signedIn: true,
    stages: {
      details: { complete: false },
      quote: { complete: false },
      payment: { complete: false },
      production: { complete: false },
    },
    ...overrides,
  }
}

function states(stages: ReturnType<typeof buildJourneyStages>) {
  return stages.map((s) => s.state)
}

function user(): AuthUser {
  return { id: 1, email: 'buyer@example.com', name: 'Amina', role: 'client' }
}

function job(overrides: Partial<ClientJobRecord> = {}): ClientJobRecord {
  return {
    id: 5,
    reference: 'JOB-1',
    job_reference: 'JOB-1',
    quote_request_id: null,
    quote_id: null,
    title: 'Business cards',
    status: 'draft',
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
    pricing: { client_total: '24000', printy_fee: '0' },
    ...overrides,
  }
}

function priceable(): ServerCalculatorPreview {
  return {
    can_calculate: true,
    product_type: 'business_card',
    price_mode: 'median',
    matches_count: 4,
    display_price_text: 'KES 24,000',
    display_mode: 'median',
    confidence_label: 'High',
    source_label: 'live',
    market_range: { min: 20000, median: 24000, max: 28000, currency: 'KES', label: 'Market range', confidence: 'high' },
    missing_fields: [],
    summary: 'Four shops can run this job.',
    warnings: [],
    suggestions: [],
    exact_or_estimated: true,
  }
}

describe('journey stage builder', () => {
  it('always returns the four gated stages in order', () => {
    const stages = buildJourneyStages(signals())
    expect(stages.map((s) => s.key)).toEqual(['details', 'quote', 'payment', 'production'])
    expect(stages.map((s) => s.n)).toEqual([1, 2, 3, 4])
  })

  it('locks every step after the first open one', () => {
    expect(states(buildJourneyStages(signals()))).toEqual(['available', 'locked', 'locked', 'locked'])
  })

  it('unlocks the next step only when the previous one is complete', () => {
    const stages = buildJourneyStages(
      signals({ stages: { details: { complete: true }, quote: { complete: false }, payment: { complete: false }, production: { complete: false } } }),
    )
    expect(states(stages)).toEqual(['completed', 'available', 'locked', 'locked'])
  })

  it('never reports a later step as complete before the earlier ones are done', () => {
    const stages = buildJourneyStages(
      signals({
        stages: {
          details: { complete: false },
          quote: { complete: false },
          payment: { complete: true },
          production: { complete: true },
        },
      }),
    )
    expect(states(stages)).toEqual(['available', 'locked', 'locked', 'locked'])
    expect(completedJourneyStages(stages)).toBe(0)
  })

  it('locks every step except the first for signed-out visitors', () => {
    const stages = buildJourneyStages(
      signals({ signedIn: false, stages: { details: { complete: true }, quote: { complete: true }, payment: { complete: false }, production: { complete: false } } }),
    )
    expect(states(stages)).toEqual(['completed', 'locked', 'locked', 'locked'])
    expect(stages[1].detail).toContain('free account')
  })

  it('marks a loading step active and a failed step failed without unlocking', () => {
    const loading = buildJourneyStages(
      signals({ stages: { details: { complete: false, loading: true }, quote: { complete: false }, payment: { complete: false }, production: { complete: false } } }),
    )
    expect(states(loading)).toEqual(['active', 'locked', 'locked', 'locked'])

    const failed = buildJourneyStages(
      signals({ stages: { details: { complete: false, error: 'Pricing network down' }, quote: { complete: false }, payment: { complete: false }, production: { complete: false } } }),
    )
    expect(states(failed)).toEqual(['failed', 'locked', 'locked', 'locked'])
    expect(failed[0].detail).toBe('Pricing network down')
  })

  it('points at the first actionable step', () => {
    const stages = buildJourneyStages(
      signals({ stages: { details: { complete: true }, quote: { complete: false }, payment: { complete: false }, production: { complete: false } } }),
    )
    expect(firstOpenStage(stages)?.key).toBe('quote')
  })
})

describe('buyer journey from real store state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('keeps an anonymous visitor on the first step', () => {
    const { stages, openStage } = useBuyerJourney()
    expect(states(stages.value)).toEqual(['available', 'locked', 'locked', 'locked'])
    expect(openStage.value?.key).toBe('details')
  })

  it('completes details from the backend preview alone', () => {
    useCalculatorStore().preview = priceable()
    const { stages } = useBuyerJourney()
    expect(stages.value[0].state).toBe('completed')
    expect(stages.value[1].state).toBe('locked')
  })

  it('derives payment and production from the real job record', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'in_production', payment_status: 'confirmed', payment_confirmed: true })]
    const { stages, completedCount, progress } = useBuyerJourney()
    expect(states(stages.value)).toEqual(['completed', 'completed', 'completed', 'completed'])
    expect(completedCount.value).toBe(4)
    expect(progress.value).toBe(100)
  })

  it('treats a quoted job as quote complete but keeps payment open', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'quoted' })]
    const { stages, openStage } = useBuyerJourney()
    expect(states(stages.value)).toEqual(['completed', 'completed', 'available', 'locked'])
    expect(openStage.value?.key).toBe('payment')
  })

  it('marks a disputed job as a failed production step', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'disputed', payment_status: 'confirmed', payment_confirmed: true, quote_request_id: 12 })]
    const { stages } = useBuyerJourney()
    expect(stages.value[3].state).toBe('failed')
    expect(stages.value[3].detail).toContain('dispute')
  })

  it('keeps a job cancelled before any quote request at the first step', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'cancelled' })]
    const { stages } = useBuyerJourney()
    expect(stages.value[0].state).toBe('completed')
    expect(stages.value[1].state).toBe('available')
  })

  it('completes the quote step from a confirmed intake submission', () => {
    useAuthStore().user = user()
    useCalculatorStore().preview = priceable()
    useIntakeStore().lastSubmission = { intake_id: 9, manager_name: 'Metro Print Desk', expected_response_by: null }
    const { stages } = useBuyerJourney()
    expect(stages.value[0].state).toBe('completed')
    expect(stages.value[1].state).toBe('completed')
    expect(stages.value[1].detail).toContain('Metro Print Desk')
  })

  it('never advances the rail on an M-Pesa checkout that is still pending', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'quoted' })]
    useMpesaStore().phase = 'pending'
    const { stages } = useBuyerJourney()
    expect(stages.value[2].state).toBe('active')
    expect(stages.value[3].state).toBe('locked')
  })

  it('surfaces a real M-Pesa failure on the payment step', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [job({ status: 'awaiting_payment' })]
    const mpesa = useMpesaStore()
    mpesa.phase = 'failed'
    mpesa.errorMessage = 'The payment was declined.'
    const { stages } = useBuyerJourney()
    expect(stages.value[2].state).toBe('failed')
    expect(stages.value[2].detail).toBe('The payment was declined.')
  })

  it('reads the furthest job when a buyer has more than one', () => {
    useAuthStore().user = user()
    useClientJobsStore().jobs = [
      job({ id: 1, status: 'quoted' }),
      job({ id: 2, status: 'awaiting_payment' }),
    ]
    const { stages } = useBuyerJourney()
    expect(stages.value[2].state).toBe('available')
  })

  it('does not call the API for an anonymous visitor', async () => {
    const { refresh } = useBuyerJourney()
    await refresh()
    expect(apiMock).not.toHaveBeenCalled()
  })

  it('loads the buyer jobs for a signed-in visitor', async () => {
    apiMock.mockResolvedValue({ results: [job({ status: 'delivered' })] })
    useAuthStore().user = user()
    const { refresh, stages } = useBuyerJourney()
    await refresh()
    expect(apiMock).toHaveBeenCalledWith('/dashboard/client/jobs/')
    expect(stages.value[3].state).toBe('completed')
  })
})
