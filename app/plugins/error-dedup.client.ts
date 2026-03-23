/**
 * Prevents duplicate error logging. Vue/Pinia and ofetch can surface the same error
 * multiple times; this plugin deduplicates so each error is logged only once.
 */
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { safeLogError } from '~/utils/safeLog'

export default defineNuxtPlugin((nuxtApp) => {
  const { trackFrontendError } = useAnalyticsTracking()

  nuxtApp.vueApp.config.errorHandler = (err, _instance, info) => {
    safeLogError(err, `Vue:${info}`)
    void trackFrontendError(err, { source: 'vue_error_handler', info })
  }
})
