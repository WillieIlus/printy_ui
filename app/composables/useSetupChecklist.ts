import { useSetupFlow } from '~/composables/useSetupFlow'

export type SetupChecklistKey = 'shop' | 'machines' | 'papers' | 'pricing' | 'finishing' | 'products'
export type SetupChecklistState = 'complete' | 'current' | 'blocked'

export interface SetupChecklistItem {
  key: SetupChecklistKey
  label: string
  description: string
  icon: string
  to: string
  ctaTo: string
  ctaLabel: string
  helper: string
  done: boolean
  state: SetupChecklistState
}

export function useSetupChecklist() {
  const flow = useSetupFlow()

  const items = computed<SetupChecklistItem[]>(() =>
    flow.value.steps.map(step => ({
      key: step.key,
      label: step.label,
      description: step.description,
      icon: step.icon,
      to: step.route,
      ctaTo: step.ctaTo,
      ctaLabel: step.ctaLabel,
      helper: step.helper,
      done: step.done,
      state: step.state,
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
