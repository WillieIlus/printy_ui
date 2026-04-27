import { useSetupStatus } from '~/composables/useSetupStatus'
import { useSetupRedirectNotice } from '~/composables/useSetupRedirectNotice'

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = typeof to.params.slug === 'string' ? to.params.slug : null
  if (!slug) return navigateTo('/dashboard/shops/create')

  const { refresh } = useSetupStatus()
  const { pushNotice } = useSetupRedirectNotice()
  const status = await refresh(slug)
  if (!status) return

  const path = to.path
  const targetStep = path.includes('/products')
    ? 'products'
    : path.includes('/finishing')
      ? 'finishing'
      : path.includes('/pricing')
        ? 'pricing'
        : path.includes('/papers')
          ? 'papers'
          : path.includes('/machines')
            ? 'machines'
            : null

  if (!targetStep) return

  const requestedStep = status.steps?.find(step => step.key === targetStep) ?? null
  if (!requestedStep || requestedStep.accessible) return

  const nextAccessibleStep = status.steps?.find(step => !step.done && step.accessible) ?? null
  const targetUrl = nextAccessibleStep?.cta_url || status.next_url
  const message = {
    title: 'Complete setup first',
    description: requestedStep.blocking_reason || 'Finish the current required setup step first.',
  }
  pushNotice(message)

  return navigateTo(targetUrl)
})
