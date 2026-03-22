/**
 * Check if a shop slug is available without intentionally generating 404 console noise.
 * We compare against the public shop list instead of probing a slug detail endpoint.
 */
import { listShops } from '~/services/public'

export function useSlugAvailability() {
  const checking = ref(false)
  const lastSlug = ref<string | null>(null)
  const lastResult = ref<boolean | null>(null)
  const knownSlugs = ref<Set<string> | null>(null)

  async function ensureKnownSlugs() {
    if (knownSlugs.value) return knownSlugs.value
    const shops = await listShops()
    knownSlugs.value = new Set(shops.map(shop => shop.slug.trim().toLowerCase()))
    return knownSlugs.value
  }

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
      const slugs = await ensureKnownSlugs()
      const available = !slugs.has(trimmed)
      lastResult.value = available
      return available
    } catch {
      lastResult.value = null
      return false
    } finally {
      checking.value = false
    }
  }

  function reset() {
    lastSlug.value = null
    lastResult.value = null
    knownSlugs.value = null
  }

  return {
    checkAvailability,
    checking,
    lastResult,
    reset,
  }
}
