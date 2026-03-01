export function useApi() {
  const config = useRuntimeConfig()

  async function get<T>(url: string, params?: Record<string, string | number>): Promise<T> {
    const { $api } = useNuxtApp()
    // Nuxt $api route typing causes excessive stack depth
    return ($api as (u: string, o?: object) => Promise<T>)(url, { params })
  }

  async function post<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    // Nuxt $api route typing causes excessive stack depth
    return ($api as (u: string, o?: object) => Promise<T>)(url, { method: 'POST', body })
  }

  async function put<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    return ($api as (u: string, o?: object) => Promise<T>)(url, { method: 'PUT', body })
  }

  async function patch<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    return ($api as (u: string, o?: object) => Promise<T>)(url, { method: 'PATCH', body })
  }

  async function del<T>(url: string): Promise<T> {
    const { $api } = useNuxtApp()
    return ($api as (u: string, o?: object) => Promise<T>)(url, { method: 'DELETE' })
  }

  function getMediaUrl(path: string | null): string | null {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${config.public.mediaBase as string}/${path}`
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    getMediaUrl,
  }
}
