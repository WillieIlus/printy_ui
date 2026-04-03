import { useSetupStatus } from '~/composables/useSetupStatus'
import { useSetupRedirectNotice } from '~/composables/useSetupRedirectNotice'
import { firstMissingDependency, getSetupReadiness, getSetupRedirectMessage } from '~/utils/setupFlow'

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = typeof to.params.slug === 'string' ? to.params.slug : null
  if (!slug) return navigateTo('/dashboard/shops/create')

  const { refresh } = useSetupStatus()
  const { pushNotice } = useSetupRedirectNotice()
  const status = await refresh(slug)
  if (!status) return

  const path = to.path
  const readiness = getSetupReadiness(status)
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

  const missingDependency = firstMissingDependency(targetStep, readiness)
  if (!missingDependency) return

  const message = getSetupRedirectMessage(targetStep, missingDependency)
  pushNotice(message)

  return navigateTo(`/dashboard/shops/${slug}${missingDependency === 'shop' ? '' : `/${missingDependency}`}`)
})
