import { useSetupStatus } from '~/composables/useSetupStatus'

export type SetupChecklistKey = 'shop' | 'machines' | 'papers' | 'pricing' | 'finishing' | 'products'
export type SetupChecklistState = 'complete' | 'current' | 'blocked'

export interface SetupChecklistItem {
  key: SetupChecklistKey
  label: string
  to: string
  ctaTo: string
  ctaLabel: string
  helper: string
  done: boolean
  state: SetupChecklistState
}

export function useSetupChecklist() {
  const { status } = useSetupStatus()

  const items = computed<SetupChecklistItem[]>(() =>
    (status.value?.steps ?? []).map(step => ({
      key: step.key as SetupChecklistKey,
      label: step.label,
      to: step.cta_url,
      ctaTo: step.cta_url,
      ctaLabel: step.cta_label,
      helper: step.blocking_reason || (step.done ? 'Existing setup found.' : 'Next required step.'),
      done: step.done,
      state: step.done ? 'complete' : (step.accessible ? 'current' : 'blocked'),
    }))
  )

  const completedSteps = computed(() => items.value.filter((item) => item.done).length)
  const totalSteps = computed(() => items.value.length)
  const progressPercent = computed(() => Math.round((completedSteps.value / totalSteps.value) * 100))
  const summary = computed(() => `${completedSteps.value} of ${totalSteps.value} onboarding steps complete`)
  const nextRequiredItem = computed(() => items.value.find((item) => item.state === 'current') ?? null)

  return {
    items,
    completedSteps,
    totalSteps,
    progressPercent,
    summary,
    nextRequiredItem,
  }
}
