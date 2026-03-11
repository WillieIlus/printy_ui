/**
 * Prevents duplicate error logging. Vue/Pinia and ofetch can surface the same error
 * multiple times; this plugin deduplicates so each error is logged only once.
 */
import { safeLogError } from '~/utils/safeLog'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (err, _instance, info) => {
    safeLogError(err, `Vue:${info}`)
  }
})
