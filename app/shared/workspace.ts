import type { AuthUser } from '~/shared/types'

import type { DashboardRole } from '~/shared/types'

export const DASHBOARD_HOME_ROUTES: Record<DashboardRole, string> = {
  super_admin: '/dashboard/admin',
  client: '/dashboard/client',
  partner: '/dashboard/partner',
  production: '/dashboard/production',
}

function normalizeRole(value?: string | null): DashboardRole | null {
  if (!value) {
    return null
  }
  if (value === 'super_admin' || value === 'admin' || value === 'superuser' || value === 'staff') {
    return 'super_admin'
  }
  if (value === 'client' || value === 'customer') {
    return 'client'
  }
  if (value === 'partner' || value === 'broker') {
    return 'partner'
  }
  if (value === 'production' || value === 'shop_owner' || value === 'printer' || value === 'staff') {
    return 'production'
  }
  return null
}

export function resolveAccessibleRoles(user: AuthUser | null | undefined): DashboardRole[] {
  if (!user) {
    return []
  }

  const roles = new Set<DashboardRole>()
  for (const value of user.roles ?? []) {
    const normalized = normalizeRole(value)
    if (normalized) {
      roles.add(normalized)
    }
  }

  if (user.can_access_admin_dashboard) roles.add('super_admin')
  if (user.can_access_client_dashboard) roles.add('client')
  if (user.can_access_partner_dashboard) roles.add('partner')
  if (user.can_access_production_dashboard) roles.add('production')

  const explicitPrimary = normalizeRole(user.primary_role || user.dashboard_role || user.role)
  if (explicitPrimary) {
    roles.add(explicitPrimary)
  }

  return ['super_admin', 'production', 'partner', 'client'].filter(role => roles.has(role as DashboardRole)) as DashboardRole[]
}

export function resolveDashboardRole(user: AuthUser | null | undefined): DashboardRole {
  if (!user) {
    return 'client'
  }

  const explicitRole = normalizeRole(user.primary_role || user.dashboard_role)
  if (explicitRole) {
    return explicitRole
  }

  const accessibleRoles = resolveAccessibleRoles(user)
  if (accessibleRoles.length > 0) {
    return accessibleRoles[0] || 'client'
  }

  return normalizeRole(user.role) || 'client'
}

export function dashboardRouteForRole(role: DashboardRole) {
  return DASHBOARD_HOME_ROUTES[role]
}
