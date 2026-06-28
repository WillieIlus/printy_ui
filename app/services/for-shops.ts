import { API } from '~/shared/api-paths'

export function useForShopsApi() {
  const { publicApi } = useApi()
  return {
    fetchForShopsConfig: () => publicApi<Record<string, any>>(API.forShops.publicConfig, { auth: false }),
    previewForShops: (payload: Record<string, any>) => publicApi<Record<string, any>>(API.forShops.publicPreview, {
      method: 'POST',
      body: payload,
      auth: false,
    }),
  }
}
