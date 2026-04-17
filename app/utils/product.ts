import type { Product } from '~/shared/types'

/** True when a product should be visible in public listings. */
export function isProductPublic(p: Product): boolean {
  return p.status === 'PUBLISHED' && p.is_public !== false
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
