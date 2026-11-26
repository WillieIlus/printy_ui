/**
 * One user-facing vocabulary for jobs, quotes, roles and the five stages.
 *
 * Law 27: Quote, Job, Manager, Printer, Stage. No request/offer/partner/shop
 * synonyms in default copy.
 * Law 25: users only see the five canonical stages.
 *
 * This module is the only place these labels are written. Components import
 * the labels/helpers instead of carrying their own copies.
 */

export const STAGE_KEYS = [
  'quote_accepted',
  'artwork_approval',
  'production',
  'qc',
  'delivery',
] as const

export type CanonicalStageKey = (typeof STAGE_KEYS)[number]

export const STAGE_LABELS: Record<CanonicalStageKey, string> = {
  quote_accepted: 'Quote accepted',
  artwork_approval: 'Artwork approval',
  production: 'Production',
  qc: 'Quality check',
  delivery: 'Delivery',
}

export const STAGE_OPTIONS: ReadonlyArray<{ key: CanonicalStageKey; label: string }> =
  STAGE_KEYS.map(key => ({ key, label: STAGE_LABELS[key] }))

const STAGE_ALIASES: Record<string, CanonicalStageKey> = {
  quote_accepted: 'quote_accepted',
  quote: 'quote_accepted',
  payment_received: 'quote_accepted',
  artwork_approval: 'artwork_approval',
  artwork_check: 'artwork_approval',
  artwork: 'artwork_approval',
  production: 'production',
  printing: 'production',
  finishing: 'production',
  in_production: 'production',
  qc: 'qc',
  quality_check: 'qc',
  delivery: 'delivery',
  out_for_delivery: 'delivery',
  delivered: 'delivery',
  completed: 'delivery',
}

export function normalizeStageKey(value?: string | null): CanonicalStageKey | null {
  const key = String(value ?? '').trim().toLowerCase()
  return STAGE_ALIASES[key] ?? null
}

export function stageLabel(value?: string | null): string {
  const key = normalizeStageKey(value)
  return key ? STAGE_LABELS[key] : STAGE_LABELS.quote_accepted
}

export type CanonicalRole = 'buyer' | 'manager' | 'printer' | 'admin' | 'system' | 'none'

/** The four roles that can view a job card. */
export type ViewerRole = 'buyer' | 'manager' | 'printer' | 'admin'

export const ROLE_LABELS: Record<CanonicalRole, string> = {
  buyer: 'Buyer',
  manager: 'Manager',
  printer: 'Printer',
  admin: 'Admin',
  system: 'Printy',
  none: 'No one',
}

const ROLE_ALIASES: Record<string, CanonicalRole> = {
  buyer: 'buyer',
  client: 'buyer',
  customer: 'buyer',
  manager: 'manager',
  partner: 'manager',
  broker: 'manager',
  print_manager: 'manager',
  printer: 'printer',
  production: 'printer',
  shop: 'printer',
  shop_owner: 'printer',
  production_shop: 'printer',
  admin: 'admin',
  super_admin: 'admin',
  superuser: 'admin',
  staff: 'admin',
  system: 'system',
  printy: 'system',
  none: 'none',
}

export function normalizeRole(value?: string | null): CanonicalRole {
  const key = String(value ?? '').trim().toLowerCase()
  return ROLE_ALIASES[key] ?? (key ? 'system' : 'none')
}

export function roleLabel(value?: string | null): string {
  return ROLE_LABELS[normalizeRole(value)]
}

export const OBJECT_LABELS = {
  quote: 'Quote',
  job: 'Job',
  manager: 'Manager',
  printer: 'Printer',
  stage: 'Stage',
  buyer: 'Buyer',
  admin: 'Admin',
} as const

export const ACTIVE_ROLE_LABELS = {
  client: 'Buyer',
  partner: 'Manager',
  production: 'Printer',
  super_admin: 'Admin',
} as const

export const ACTIVE_WORKSPACE_LABELS = {
  client: 'Buyer workspace',
  partner: 'Manager workspace',
  production: 'Printer workspace',
  super_admin: 'Admin oversight',
} as const

export function activeRoleLabel(value?: string | null): string {
  const key = String(value ?? '').trim().toLowerCase()
  return ACTIVE_ROLE_LABELS[key as keyof typeof ACTIVE_ROLE_LABELS] ?? roleLabel(key)
}

export function activeWorkspaceLabel(value?: string | null): string {
  const key = String(value ?? '').trim().toLowerCase()
  return ACTIVE_WORKSPACE_LABELS[key as keyof typeof ACTIVE_WORKSPACE_LABELS] ?? 'Workspace'
}

/**
 * A phrase that fits after "Waiting on ...". Buyer-facing copy never names the
 * printer (law 31): the buyer's contract is with the manager.
 */
export function ownerPhrase(owner?: string | null, viewer?: string | null): string {
  const ownerRole = normalizeRole(owner)
  const viewerRole = normalizeRole(viewer)
  if (ownerRole === 'none') return 'no one'
  if (ownerRole === 'system' || ownerRole === 'admin') return 'Printy'
  if (ownerRole === viewerRole) return 'you'
  if (ownerRole === 'buyer') return 'the buyer'
  if (ownerRole === 'manager') return viewerRole === 'buyer' ? 'your manager' : 'the manager'
  if (ownerRole === 'printer') return viewerRole === 'buyer' ? 'your manager' : 'the printer'
  return roleLabel(ownerRole)
}

export function waitingOnLabel(owner?: string | null, viewer?: string | null): string {
  if (normalizeRole(owner) === 'none') return 'No action needed'
  if (normalizeRole(owner) === normalizeRole(viewer)) return 'Waiting on you'
  return `Waiting on ${ownerPhrase(owner, viewer)}`
}

export function ownerExplanation(owner?: string | null, viewer?: string | null): string {
  const ownerRole = normalizeRole(owner)
  const viewerRole = normalizeRole(viewer)
  if (ownerRole === 'none') return 'This job is complete.'
  if (ownerRole === viewerRole) return 'This action belongs to you.'
  if (viewerRole === 'buyer' && ownerRole === 'printer') {
    return 'Your manager runs production; the print shop is never shown to you.'
  }
  return `This action belongs to the ${roleLabel(ownerRole)}.`
}

/**
 * Short owner label for a summary row, projected for the viewer. This keeps the
 * buyer -> manager privacy rule in one place.
 */
export function viewerOwnerLabel(owner?: string | null, viewer?: string | null): string {
  const raw = String(owner ?? '').trim().toLowerCase()
  if (raw === 'courier') return 'Courier'
  const ownerRole = normalizeRole(owner)
  const viewerRole = normalizeRole(viewer)
  if (ownerRole === 'none') return ''
  if (ownerRole === viewerRole) return 'You'
  if (viewerRole === 'buyer') {
    if (ownerRole === 'manager' || ownerRole === 'printer') return 'Your manager'
    if (ownerRole === 'admin' || ownerRole === 'system') return 'Printy'
  }
  if (viewerRole === 'printer' && ownerRole === 'buyer') return 'Client'
  if (viewerRole === 'manager' && ownerRole === 'buyer') return 'Client'
  return roleLabel(ownerRole)
}

export const ACTIVE_ROLE_EXPLANATION =
  'See what needs your attention and what happens next.'
