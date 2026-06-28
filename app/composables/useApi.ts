import type { ApiClient } from '~/shared/api'
import { resolveMediaUrl } from '~/shared/runtime-url'

export function useApi() {
  const { $api, $publicApi, $publicApiNoAuth } = useNuxtApp()

  return {
    api: $api as ApiClient,
    publicApi: $publicApi as ApiClient,
    publicApiNoAuth: $publicApiNoAuth as ApiClient,
    getMediaUrl(path: string | null) {
      return path ? resolveMediaUrl(path) : null
    },
  }
}
