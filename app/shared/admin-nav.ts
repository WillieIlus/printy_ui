import type { Custody, Job, StageKey } from '~/shared/workflow/printy'

export type AdminNavIcon =
  | 'gauge'
  | 'file-text'
  | 'rocket'
  | 'users'
  | 'factory'
  | 'wallet'
  | 'flag'
  | 'badge-check'
  | 'alert-octagon'
  | 'inbox'
  | 'lock'
  | 'database'

export interface AdminNavItem {
  key: string
  label: string
  to: string
  icon: AdminNavIcon
  blurb: string
}

export interface AdminNavGroup {
  key: string
  label: string
  items: AdminNavItem[]
}

export interface AdminCrumb {
  label: string
  /** null on the final crumb — it is the current page, so it is not a link. */
  to: string | null
}

export const ADMIN_ROOT = '/app/admin'

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    key: 'oversight',
    label: 'Oversight',
    items: [
      { key: 'overview', label: 'Overview', to: ADMIN_ROOT, icon: 'gauge', blurb: 'Pulse, platform totals and what is on fire right now.' },
      { key: 'quotes', label: 'Quotes', to: `${ADMIN_ROOT}/quotes`, icon: 'file-text', blurb: 'Awaiting quotes and quoted items, kept apart.' },
      { key: 'jobs', label: 'Jobs', to: `${ADMIN_ROOT}/jobs`, icon: 'rocket', blurb: 'Every job on the marketplace, grouped by risk.' },
    ],
  },
  {
    key: 'partners',
    label: 'Managers & shops',
    items: [
      { key: 'managers', label: 'Managers', to: `${ADMIN_ROOT}/managers`, icon: 'users', blurb: 'Desk load, on-time rate and who needs a hand.' },
      { key: 'printers', label: 'Printers', to: `${ADMIN_ROOT}/printers`, icon: 'factory', blurb: 'Shop roster, capabilities and verification gaps.' },
    ],
  },
  {
    key: 'money',
    label: 'Money & risk',
    items: [
      { key: 'custody', label: 'Custody', to: `${ADMIN_ROOT}/custody`, icon: 'wallet', blurb: 'Funds held in escrow, awaiting release and released.' },
      { key: 'disputes', label: 'Disputes', to: `${ADMIN_ROOT}/disputes`, icon: 'flag', blurb: 'Frozen money and the reprint decisions behind it.' },
    ],
  },
]

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((group) => group.items)

export const CUSTODY_META: Record<Custody, { label: string; color: string }> = {
  awaiting: { label: 'Awaiting payment', color: '#B45309' },
  held: { label: 'Held in escrow', color: '#F2622E' },
  released: { label: 'Released', color: '#0E7A45' },
}

/** Stages that sit before a priced offer exists for the client. */
export const PRE_QUOTE_STAGES: StageKey[] = ['quote', 'artwork']

/**
 * A job nobody has paid for yet and which has no priced offer behind it —
 * a manager still owes the client a number.
 */
export function isAwaitingQuote(job: Job): boolean {
  return job.custody === 'awaiting' && PRE_QUOTE_STAGES.includes(job.stage)
}

/** Everything that carries a quote: priced offers, paid work and delivered work. */
export function isQuotedItem(job: Job): boolean {
  return !isAwaitingQuote(job)
}

export function adminNavItemFor(path: string): AdminNavItem | null {
  return ADMIN_NAV_ITEMS.find((item) => item.to === normalizeAdminPath(path)) ?? null
}

export function normalizeAdminPath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

export function isAdminNavActive(path: string, to: string): boolean {
  return normalizeAdminPath(path) === normalizeAdminPath(to)
}

/**
 * Breadcrumb trail for any admin path. Every crumb but the last is a link;
 * an optional `focus` label (an open drill-down) becomes the leaf crumb.
 */
export function adminCrumbTrail(path: string, focus?: string | null): AdminCrumb[] {
  const clean = normalizeAdminPath(path)
  const crumbs: AdminCrumb[] = [{ label: 'Admin', to: ADMIN_ROOT }]

  const item = ADMIN_NAV_ITEMS.find((candidate) => candidate.to === clean)
  if (item) {
    crumbs.push({ label: item.label, to: item.to })
  }

  if (focus) {
    crumbs.push({ label: focus, to: clean })
  }

  const last = crumbs[crumbs.length - 1]
  if (last) {
    last.to = null
  }

  return crumbs
}