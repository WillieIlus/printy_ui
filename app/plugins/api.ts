import { createApiClient, createPublicApiClient, createPublicApiNoAuthClient } from '~/shared/api'
import { getSafeApiBase } from '~/shared/runtime-url'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiBase = getSafeApiBase(config.public)

  return {
    provide: {
      api: createApiClient(apiBase),
      publicApi: createPublicApiClient(apiBase),
      publicApiNoAuth: createPublicApiNoAuthClient(apiBase),
    },
  }
})
