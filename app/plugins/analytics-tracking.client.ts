import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'

export default defineNuxtPlugin((nuxtApp) => {
  const { trackPageView, trackFrontendError } = useAnalyticsTracking()

  nuxtApp.hook('page:finish', () => {
    void trackPageView()
  })

  nuxtApp.hook('app:error', (error) => {
    void trackFrontendError(error, { source: 'nuxt_app_error', fatal: true })
  })
})
