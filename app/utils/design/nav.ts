import { resolveDashboardRole } from '~/shared/workspace'
import type { AuthUser, DashboardRole } from '~/shared/types'

/**
 * Design workspace / marketing role names ported from the design source
 * (design source shared/workspace.ts + shared/nav-sections.ts).
 *
 * The canonical design roles are the same strings Printy uses for its
 * dashboard roles (`client` | `partner` | `production` | `super_admin`); the
 * design names and Printy aliases converge after Printy's own
 * normalization (`normalizeDashboardRole`), which the resolution below reuses.
 */
export type DesignWorkspaceRole = 'client' | 'partner' | 'production' | 'super_admin'
export type DesignMarketingRole = 'client' | 'partner' | 'production'

export type DesignNavIcon =
  | 'dashboard'
  | 'sparkle'
  | 'jobs'
  | 'quotes'
  | 'clients'
  | 'rates'
  | 'messages'
  | 'bell'
  | 'settings'
  | 'track'
  | 'quote'
  | 'shield'
  | 'ledger'
  | 'escrow'
  | 'shops'
  | 'shop'
  | 'payouts'

export type DesignNavChipKey = 'onboarding'

export type DesignNavItem = {
  label: string
  href: string
  icon?: DesignNavIcon
  /** dynamic chip resolved by the shell from live data in later phases */
  chipKey?: DesignNavChipKey
  /** design nav item with no Printy route yet -> omitted from derived nav */
  omit?: boolean
  omitReason?: string
}

export type DesignNavSection = { label: string; items: DesignNavItem[] }

/** Design side navigation per workspace role (design source nav-sections). */
export const DESIGN_NAV_SECTIONS: Record<DesignWorkspaceRole, DesignNavSection[]> = {
  client: [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', href: '/app/buyer', icon: 'dashboard' },
        { label: 'My jobs', href: '/app/buyer#jobs', icon: 'jobs' },
        { label: 'Messages', href: '/app/messages', icon: 'messages' },
        { label: 'Notifications', href: '/notifications', icon: 'bell' },
      ],
    },
    {
      label: 'Print',
      items: [
        { label: 'Get an instant price', href: '/quote', icon: 'quote' },
        { label: 'Track a job', href: '/track', icon: 'track' },
      ],
    },
  ],
  partner: [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', href: '/app/manager', icon: 'dashboard' },
        { label: 'Quote requests', href: '/app/manager#quotes', icon: 'quotes' },
        { label: 'Jobs', href: '/app/manager#jobs', icon: 'jobs' },
        { label: 'Clients', href: '/app/manager#clients', icon: 'clients' },
        { label: 'Rate bands', href: '/app/manager#rates', icon: 'rates' },
      ],
    },
    {
      label: 'Comms',
      items: [
        { label: 'Messages', href: '/app/messages', icon: 'messages' },
        { label: 'Notifications', href: '/notifications', icon: 'bell' },
      ],
    },
  ],
  production: [
    {
      label: 'Workspace',
      items: [
        {
          label: 'Get started',
          href: '/app/printer/get-started',
          icon: 'sparkle',
          chipKey: 'onboarding',
        },
        { label: 'Overview', href: '/app/printer', icon: 'dashboard' },
        { label: 'Production requests', href: '/app/printer#requests', icon: 'quotes' },
        { label: 'Job queue', href: '/app/printer#jobs', icon: 'jobs' },
        { label: 'Rate card', href: '/app/printer#rates', icon: 'rates' },
        { label: 'Shop profile', href: '/app/printer#shop', icon: 'shop' },
        { label: 'Payouts', href: '/app/printer#payouts', icon: 'payouts' },
      ],
    },
    {
      label: 'Comms',
      items: [
        { label: 'Messages', href: '/app/messages', icon: 'messages' },
        { label: 'Notifications', href: '/notifications', icon: 'bell' },
      ],
    },
  ],
  super_admin: [
    {
      label: 'Oversight',
      items: [
        { label: 'Overview', href: '/app/admin', icon: 'dashboard' },
        { label: 'All jobs', href: '/app/admin#jobs', icon: 'jobs' },
        { label: 'Margin ledger', href: '/app/admin#ledger', icon: 'ledger' },
        { label: 'Escrow', href: '/app/admin#escrow', icon: 'escrow' },
        { label: 'Shops & managers', href: '/app/admin#network', icon: 'shield' },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Notifications', href: '/notifications', icon: 'bell' },
        { label: 'Settings', href: '/app/admin#settings', icon: 'settings' },
      ],
    },
  ],
}

/** Design marketing (public) navigation items — design PUBLIC_ROUTES minus home. */
export const DESIGN_MARKETING_NAV: DesignNavItem[] = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'For managers', href: '/for-managers' },
  { label: 'For print shops', href: '/for-shops' },
  { label: 'Track a job', href: '/track' },
]

const DESIGN_MARKETING_ROLES: DesignMarketingRole[] = ['client', 'partner', 'production']

/** Design marketing nav for the public header — every item is a printy route. */
export function designMarketingNav(): DesignNavItem[] {
  return DESIGN_MARKETING_NAV.filter(item => !item.omit)
}

/**
 * Design workspace nav for a signed-in user, derived from the design nav data
 * and filtered to design items that already have a Printy route. Signed-out
 * users resolve to no workspace nav (middleware owns the sign-in redirect).
 */
export function designNavFor(user: AuthUser | null | undefined): DesignNavSection[] {
  if (!user) {
    return []
  }
  const designRole = designWorkspaceRoleFromUser(user)
  if (!designRole) {
    return []
  }
  const source = DESIGN_NAV_SECTIONS[designRole]
  const sections = source
    .map(section => ({ ...section, items: section.items.filter(item => !item.omit) }))
    .filter(section => section.items.length > 0)
  return sections
}

/** Design workspace role for a user, reusing Printy's role resolution. */
export function designWorkspaceRoleFromUser(user: AuthUser | null | undefined): DesignWorkspaceRole | null {
  const dashboardRole: DashboardRole = resolveDashboardRole(user)
  switch (dashboardRole) {
    case 'client':
      return 'client'
    case 'partner':
      return 'partner'
    case 'production':
      return 'production'
    case 'super_admin':
      return 'super_admin'
  }
}

/** Design marketing role for a design workspace role (super_admin is workspace-only). */
export function designMarketingRoleFromWorkspaceRole(
  role: DesignWorkspaceRole | null | undefined,
): DesignMarketingRole {
  return role && DESIGN_MARKETING_ROLES.includes(role as DesignMarketingRole)
    ? (role as DesignMarketingRole)
    : 'client'
}

/**
 * Design instant-price CTA target: the public design quote page at `/quote`.
 * It is available signed out and signed in, and the calculator store handles
 * the guest session exactly as it does on the landing page.
 */
export function designInstantQuoteHref(
  _authed: boolean,
  _designRole: DesignWorkspaceRole | null | undefined,
): string {
  return '/quote'
}

/** Design marketing header / nav copy (design source SiteHeader copy). */
export const DESIGN_NAV_CTA = {
  signIn: 'Sign in',
  instantPrice: 'Instant price',
} as const

/** Design marketing footer copy (design source SiteFooter copy). */
export const DESIGN_FOOTER = {
  terms: 'Terms',
  privacy: 'Privacy',
  help: 'Help',
  copyright: '© 2026 Printy Ltd · Nairobi',
} as const
