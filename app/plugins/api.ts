import { createApiClient } from '~/shared/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const api = createApiClient(config.public.apiBase as string)
  return {
    provide: {
      api,
    },
  }
})
