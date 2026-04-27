import type { Product } from '~/shared/types'

/** Normalizes the optional product category into a display label. */
export function productCategoryName(p: Product): string {
  const category = p.category
  if (typeof category === 'string') return category.trim()
  if (category && typeof category === 'object' && 'name' in category) {
    const name = (category as { name?: unknown }).name
    return typeof name === 'string' ? name.trim() : ''
  }
  return ''
}

export type ProductCardStatus = 'live' | 'draft' | 'unlisted' | 'unavailable'

/**
 * Derives the visual status label for a product card.
 * live       – published + public
 * unlisted   – published but is_public === false
 * draft      – status is DRAFT (or undefined/null)
 * unavailable – status is UNAVAILABLE
 */
export function productCardStatus(p: Product): ProductCardStatus {
  if (p.status === 'UNAVAILABLE') return 'unavailable'
  if (p.status !== 'PUBLISHED') return 'draft'
  if (p.is_public === false) return 'unlisted'
  return 'live'
}
