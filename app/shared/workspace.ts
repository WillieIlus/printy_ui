import type { AuthUser, DashboardRole } from '~/shared/types'

export const DASHBOARD_HOME_ROUTES: Record<DashboardRole, string> = {
  super_admin: '/app/admin',
  client: '/app/buyer',
  partner: '/app/manager',
  production: '/app/printer',
}

export type ProtoRole = 'buyer' | 'manager' | 'printer' | 'admin'

export const PROTO_ROLES: ProtoRole[] = ['buyer', 'manager', 'printer', 'admin']

export function protoRoleFor(role: DashboardRole | null | undefined): ProtoRole {
  switch (role) {
    case 'super_admin':
      return 'admin'
    case 'client':
      return 'buyer'
    case 'partner':
      return 'manager'
    case 'production':
      return 'printer'
    default:
      return 'buyer'
  }
}

export function protoHomeRoute(role: ProtoRole): string {
  return DASHBOARD_HOME_ROUTES[
    role === 'admin' ? 'super_admin'
      : role === 'buyer' ? 'client'
        : role === 'manager' ? 'partner'
          : 'production'
  ]
}

export function dashboardForProto(role: ProtoRole): DashboardRole {
  switch (role) {
    case 'admin':
      return 'super_admin'
    case 'buyer':
      return 'client'
    case 'manager':
      return 'partner'
    case 'printer':
      return 'production'
  }
}

const DASHBOARD_ROLE_PRIORITY: DashboardRole[] = ['super_admin', 'partner', 'production', 'client']

export function normalizeDashboardRole(value?: string | null): DashboardRole | null {
  if (!value) {
    return null
  }
  if (value === 'super_admin' || value === 'admin' || value === 'superuser' || value === 'staff') {
    return 'super_admin'
  }
  if (value === 'client' || value === 'customer' || value === 'buyer') {
    return 'client'
  }
  if (value === 'partner' || value === 'broker' || value === 'manager' || value === 'print_manager') {
    return 'partner'
  }
  if (value === 'production' || value === 'shop_owner' || value === 'printer' || value === 'production_shop') {
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
    const normalized = normalizeDashboardRole(value)
    if (normalized) {
      roles.add(normalized)
    }
  }

  if (user.can_access_admin_dashboard) roles.add('super_admin')
  if (user.can_access_client_dashboard) roles.add('client')
  if (user.can_access_partner_dashboard) roles.add('partner')
  if (user.can_access_production_dashboard) roles.add('production')

  const explicitPrimary = normalizeDashboardRole(user.primary_role || user.dashboard_role || user.role)
  if (explicitPrimary) {
    roles.add(explicitPrimary)
  }

  return DASHBOARD_ROLE_PRIORITY.filter(role => roles.has(role))
}

export function isRoleAccessible(user: AuthUser | null | undefined, role: DashboardRole | null | undefined) {
  return Boolean(role && resolveAccessibleRoles(user).includes(role))
}

export function resolveDashboardRole(user: AuthUser | null | undefined, requestedRole?: DashboardRole | null): DashboardRole {
  if (!user) {
    return requestedRole || 'client'
  }

  if (isRoleAccessible(user, requestedRole)) {
    return requestedRole as DashboardRole
  }

  const explicitActive = normalizeDashboardRole(user.active_role || user.active_dashboard_role || user.dashboard_role)
  if (isRoleAccessible(user, explicitActive)) {
    return explicitActive as DashboardRole
  }

  const explicitPrimary = normalizeDashboardRole(user.primary_role || user.role)
  if (explicitPrimary) {
    return explicitPrimary
  }

  const accessibleRoles = resolveAccessibleRoles(user)
  if (accessibleRoles.length > 0) {
    return accessibleRoles[0] || 'client'
  }

  return 'client'
}

export function dashboardRoleFromPath(path: string): DashboardRole | null {
  if (path.startsWith('/app/admin')) return 'super_admin'
  if (path.startsWith('/app/printer')) return 'production'
  if (path.startsWith('/app/manager')) return 'partner'
  if (path.startsWith('/app/buyer')) return 'client'
  return null
}

export function dashboardRouteForRole(role: DashboardRole) {
  return DASHBOARD_HOME_ROUTES[role]
}

