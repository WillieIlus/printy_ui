/**
 * Product visual fallback identity — icon + gradient per product type.
 *
 * All public product card surfaces (gallery grid, shop gallery, homepage preview)
 * must use this function for their image fallback so the identity is consistent.
 * Never duplicate this logic inline — extend this function instead.
 */

export interface ProductVisualConfig {
  icon: string
  gradientClass: string
  iconColorClass: string
}

export interface ProductVisualInput {
  name: string
  slug?: string | null
  category?: string | null
  product_kind?: string | null
  pricing_mode?: string | null
}

export function productVisual(p: ProductVisualInput): ProductVisualConfig {
  const key = `${p.slug ?? ''} ${p.name} ${p.category ?? ''}`.toLowerCase()
  const isBooklet = p.product_kind === 'BOOKLET' || key.includes('booklet')
  const isLargeFormat = p.pricing_mode === 'LARGE_FORMAT'

  if (isBooklet || key.includes('brochure'))
    return {
      icon: 'i-lucide-book-open',
      gradientClass: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-950/60 dark:to-purple-900/40',
      iconColorClass: 'text-violet-500 dark:text-violet-400',
    }
  if (key.includes('business'))
    return {
      icon: 'i-lucide-credit-card',
      gradientClass: 'bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-950/60 dark:to-orange-900/40',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
    }
  if (key.includes('flyer') || key.includes('leaflet'))
    return {
      icon: 'i-lucide-file-text',
      gradientClass: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950/60 dark:to-sky-900/40',
      iconColorClass: 'text-sky-500 dark:text-sky-400',
    }
  if (key.includes('sticker') || key.includes('label'))
    return {
      icon: 'i-lucide-sticker',
      gradientClass: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950/60 dark:to-green-900/40',
      iconColorClass: 'text-emerald-500 dark:text-emerald-400',
    }
  if (isLargeFormat || key.includes('banner'))
    return {
      icon: 'i-lucide-panel-top',
      gradientClass: 'bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-950/60 dark:to-cyan-900/40',
      iconColorClass: 'text-teal-500 dark:text-teal-400',
    }
  if (key.includes('receipt'))
    return {
      icon: 'i-lucide-receipt',
      gradientClass: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800/60 dark:to-gray-800/40',
      iconColorClass: 'text-slate-500 dark:text-slate-400',
    }
  if (key.includes('poster'))
    return {
      icon: 'i-lucide-image',
      gradientClass: 'bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/60 dark:to-rose-900/40',
      iconColorClass: 'text-pink-500 dark:text-pink-400',
    }
  return {
    icon: 'i-lucide-package',
    gradientClass: 'bg-gradient-to-br from-flamingo-100 to-flamingo-200 dark:from-flamingo-950/60 dark:to-flamingo-900/40',
    iconColorClass: 'text-flamingo-500 dark:text-flamingo-400',
  }
}

/**
 * Resolve a product image path to a display URL.
 *
 * - null/empty → null (caller renders the fallback gradient, never a blank area)
 * - absolute URL (http/https) → pass through unchanged (CDN, external storage)
 * - relative path → resolved via getMediaUrl which prepends the configured media base
 *
 * All public product card surfaces must use this resolver — never inline a
 * startsWith('http') check separately. Image load failures are handled at the
 * render site via @error; this function only handles path normalization.
 */
export function resolveProductImageUrl(
  path: string | null | undefined,
  getMediaUrl: (p: string | null) => string | null,
): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return getMediaUrl(path)
}
