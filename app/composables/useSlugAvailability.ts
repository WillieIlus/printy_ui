/**
 * Check if a shop slug is available (no existing shop with that slug).
 * Uses GET public/shops/{slug}/ — 404 means available, 200 means taken.
 */
import { API } from '~/shared/api-paths'

export function useSlugAvailability() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string
  const checking = ref(false)
  const lastSlug = ref<string | null>(null)
  const lastResult = ref<boolean | null>(null)

  async function checkAvailability(slug: string): Promise<boolean> {
    const trimmed = slug.trim().toLowerCase()
    if (!trimmed) {
      lastResult.value = null
      return false
    }

    if (lastSlug.value === trimmed && lastResult.value !== null) {
      return lastResult.value
    }

    checking.value = true
    lastSlug.value = trimmed
    try {
      await $fetch(`${apiBase}/${API.publicShopBySlug(trimmed)}`, {
        method: 'GET',
        retry: 0,
      })
      lastResult.value = false
      return false
    } catch (err: unknown) {
      const status = (err as { statusCode?: number; status?: number })?.statusCode ?? (err as { status?: number })?.status
      if (status === 404) {
        lastResult.value = true
        return true
      }
      lastResult.value = null
      return false
    } finally {
      checking.value = false
    }
  }

  function reset() {
    lastSlug.value = null
    lastResult.value = null
  }

  return {
    checkAvailability,
    checking,
    lastResult,
    reset,
  }
}
