import { useSetupStatus } from '~/composables/useSetupStatus'

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = typeof to.params.slug === 'string' ? to.params.slug : null
  if (!slug) return navigateTo('/dashboard/shops/create')

  const { refresh } = useSetupStatus()
  const status = await refresh(slug)
  if (!status) return

  const path = to.path

  if (path.includes('/pricing')) {
    if (!status.has_machines) return navigateTo(`/dashboard/shops/${slug}/machines`)
    if (!status.has_papers) return navigateTo(`/dashboard/shops/${slug}/papers`)
  }

  if (path.includes('/finishing') || path.includes('/products')) {
    if (!status.has_machines) return navigateTo(`/dashboard/shops/${slug}/machines`)
    if (!status.has_papers) return navigateTo(`/dashboard/shops/${slug}/papers`)
    if (!status.has_pricing) return navigateTo(`/dashboard/shops/${slug}/pricing`)
  }
})
