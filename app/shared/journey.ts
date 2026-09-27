export type JourneyStageKey = 'details' | 'quote' | 'payment' | 'production'
export type JourneyStageState = 'locked' | 'available' | 'active' | 'completed' | 'failed'

export interface JourneyStageSignal {
  complete: boolean
  loading?: boolean
  error?: string | null
  detail?: string | null
}

export interface JourneySignals {
  signedIn: boolean
  stages: Record<JourneyStageKey, JourneyStageSignal>
}

export interface JourneyStage {
  key: JourneyStageKey
  n: number
  label: string
  hint: string
  detail: string
  state: JourneyStageState
}

export const JOURNEY_STAGE_ORDER: JourneyStageKey[] = ['details', 'quote', 'payment', 'production']

export const JOURNEY_STAGE_COPY: Record<JourneyStageKey, { label: string; hint: string }> = {
  details: {
    label: 'Job details',
    hint: 'Pick product, quantity, paper and finishing so the backend can price it.',
  },
  quote: {
    label: 'Quote & manager',
    hint: 'A verified print manager prices the job and confirms capacity.',
  },
  payment: {
    label: 'Payment',
    hint: 'Pay by M-Pesa once the quote is ready.',
  },
  production: {
    label: 'Production & delivery',
    hint: 'Follow printing, finishing and delivery to your door.',
  },
}

/**
 * Pure, deterministic builder for the four gated homepage stages.
 *
 * A stage can only reach `completed` when the backend has confirmed it, and a
 * stage can only be reached at all when every earlier stage is completed. No
 * step ever advances optimistically and nothing here mutates any state.
 */
export function buildJourneyStages(signals: JourneySignals): JourneyStage[] {
  const stages: JourneyStage[] = []
  let reachable = true

  JOURNEY_STAGE_ORDER.forEach((key, index) => {
    const signal = signals.stages[key] ?? { complete: false }
    const copy = JOURNEY_STAGE_COPY[key]
    const base = { key, n: index + 1, label: copy.label, hint: copy.hint }
    const needsAccount = key !== 'details' && !signals.signedIn

    if (!reachable || needsAccount) {
      stages.push({
        ...base,
        detail: needsAccount ? 'Create a free account to unlock this step.' : '',
        state: 'locked',
      })
      return
    }

    if (signal.complete) {
      stages.push({ ...base, detail: signal.detail || '', state: 'completed' })
      return
    }

    const state: JourneyStageState = signal.error
      ? 'failed'
      : signal.loading
        ? 'active'
        : 'available'
    stages.push({ ...base, detail: signal.error || signal.detail || '', state })
    reachable = false
  })

  return stages
}

export function firstOpenStage(stages: JourneyStage[]): JourneyStage | null {
  return stages.find((s) => s.state === 'active' || s.state === 'failed' || s.state === 'available') ?? null
}

export function completedJourneyStages(stages: JourneyStage[]): number {
  return stages.filter((s) => s.state === 'completed').length
}
