export interface Crumb {
  label: string
  to?: string
}

export const BREADCRUMB_LEAF_KEY = 'breadcrumb:leaf'

/**
 * Reads the trail a page declared with `definePageMeta({ breadcrumb: ... })`.
 *
 * A page may declare a single label (`breadcrumb: 'Quotes'`) or a trail of
 * `{ label, to }` entries when it sits deeper than the dashboard root.
 */
export function readBreadcrumbTrail(meta: Record<string, unknown> | undefined): Crumb[] {
  const raw = meta?.breadcrumb
  if (typeof raw === 'string') {
    const label = raw.trim()
    return label ? [{ label }] : []
  }
  if (!Array.isArray(raw)) return []

  const trail: Crumb[] = []
  for (const entry of raw) {
    if (typeof entry === 'string') {
      const label = entry.trim()
      if (label) trail.push({ label })
      continue
    }
    if (!entry || typeof entry !== 'object') continue
    const record = entry as Record<string, unknown>
    const label = typeof record.label === 'string' ? record.label.trim() : ''
    if (!label) continue
    const to = typeof record.to === 'string' && record.to.trim() ? record.to.trim() : undefined
    trail.push(to ? { label, to } : { label })
  }
  return trail
}

/**
 * One breadcrumb trail for every dashboard page: the role's dashboard root,
 * whatever the route meta declares, then the leaf the page is showing (for
 * example a job code such as MJ-20261020-0022).
 */
export function buildBreadcrumbs(options: {
  home: string
  homeLabel?: string
  path: string
  meta?: Record<string, unknown>
  leaf?: string | null
}): Crumb[] {
  const homeLabel = options.homeLabel?.trim() || 'Dashboard'
  const leaf = (options.leaf ?? '').trim()
  const crumbs: Crumb[] = []

  if (options.path !== options.home || leaf) {
    crumbs.push({ label: homeLabel, to: options.home })
  }
  crumbs.push(...readBreadcrumbTrail(options.meta))
  if (leaf) crumbs.push({ label: leaf })

  if (crumbs.length === 0) crumbs.push({ label: homeLabel })
  return crumbs
}
