/**
 * Hero calculator location metadata — deterministic mock data.
 * Replace with API fetch when backend locations/shops endpoints are wired.
 */

export interface HeroLocationMeta {
  slug: string
  label: string
  shops: number
  deliveryMode: string
  serviceNote?: string
}

/** Deterministic location metadata. Swap for API when ready. */
export const HERO_LOCATION_METADATA: Record<string, HeroLocationMeta> = {
  cbd: {
    slug: 'cbd',
    label: 'Nairobi CBD',
    shops: 48,
    deliveryMode: 'pickup same day available',
    serviceNote: 'Most shops offer same-day pickup in CBD',
  },
  westlands: {
    slug: 'westlands',
    label: 'Westlands',
    shops: 21,
    deliveryMode: 'pickup or delivery',
  },
  kilimani: {
    slug: 'kilimani',
    label: 'Kilimani',
    shops: 14,
    deliveryMode: 'delivery available',
  },
  'industrial-area': {
    slug: 'industrial-area',
    label: 'Industrial Area',
    shops: 9,
    deliveryMode: 'pickup preferred',
    serviceNote: 'Industrial area shops often have lower minimums',
  },
  nairobi: {
    slug: 'nairobi',
    label: 'Thika Road / Nairobi North',
    shops: 12,
    deliveryMode: 'pickup or delivery',
  },
  mombasa: {
    slug: 'mombasa',
    label: 'Mombasa',
    shops: 16,
    deliveryMode: 'pickup or delivery',
    serviceNote: '1–2 day turnaround for Mombasa orders',
  },
  kisumu: {
    slug: 'kisumu',
    label: 'Kisumu',
    shops: 8,
    deliveryMode: 'pickup or delivery',
    serviceNote: '2–3 day turnaround for Kisumu orders',
  },
}

/** Ordered slugs for dropdown. */
export const HERO_LOCATION_ORDER = ['cbd', 'westlands', 'kilimani', 'industrial-area', 'nairobi', 'mombasa', 'kisumu'] as const

export function getHeroLocationOptions(): { slug: string; label: string }[] {
  return HERO_LOCATION_ORDER.map((slug) => {
    const meta = HERO_LOCATION_METADATA[slug]
    return meta ? { slug: meta.slug, label: meta.label } : { slug, label: slug }
  }).filter((o) => HERO_LOCATION_METADATA[o.slug])
}

export function getHeroLocationMeta(slug: string): HeroLocationMeta | null {
  return HERO_LOCATION_METADATA[slug] ?? null
}
