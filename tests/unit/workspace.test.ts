import { describe, it, expect } from 'vitest'

import {
  DASHBOARD_HOME_ROUTES,
  PROTO_ROLES,
  dashboardForProto,
  dashboardRoleFromPath,
  dashboardRouteForRole,
  isRoleAccessible,
  normalizeDashboardRole,
  protoHomeRoute,
  protoRoleFor,
  resolveAccessibleRoles,
  resolveDashboardRole,
  type DashboardRole,
} from '~/shared/workspace'
import type { AuthUser } from '~/shared/types'

const adminUser: AuthUser = {
  id: 1,
  email: 'a@test.com',
  name: 'Admin',
  role: 'staff',
  can_access_admin_dashboard: true,
}

const multiUser: AuthUser = {
  id: 2,
  email: 'multi@test.com',
  name: 'Multi',
  role: 'client',
  roles: ['client', 'partner'],
  can_access_partner_dashboard: true,
}

const noRoleUser: AuthUser = {
  id: 3,
  email: 'plain@test.com',
  name: 'Plain',
  role: 'customer',
}

describe('normalizeDashboardRole', () => {
  it('maps aliases to canonical roles', () => {
    expect(normalizeDashboardRole('admin')).toBe('super_admin')
    expect(normalizeDashboardRole('superuser')).toBe('super_admin')
    expect(normalizeDashboardRole('staff')).toBe('super_admin')
    expect(normalizeDashboardRole('customer')).toBe('client')
    expect(normalizeDashboardRole('buyer')).toBe('client')
    expect(normalizeDashboardRole('broker')).toBe('partner')
    expect(normalizeDashboardRole('manager')).toBe('partner')
    expect(normalizeDashboardRole('printer')).toBe('production')
    expect(normalizeDashboardRole('shop_owner')).toBe('production')
  })

  it('returns null for unknown input', () => {
    expect(normalizeDashboardRole('alien')).toBeNull()
    expect(normalizeDashboardRole('')).toBeNull()
    expect(normalizeDashboardRole(null)).toBeNull()
  })
})

describe('resolveAccessibleRoles', () => {
  it('returns empty for no user', () => {
    expect(resolveAccessibleRoles(null)).toEqual([])
  })

  it('derives roles from flags', () => {
    expect(resolveAccessibleRoles(adminUser)).toEqual(['super_admin'])
  })

  it('merges and de-duplicates roles', () => {
    expect(resolveAccessibleRoles(multiUser)).toEqual(['partner', 'client'])
  })

  it('maps role aliases', () => {
    expect(resolveAccessibleRoles(noRoleUser)).toEqual(['client'])
  })
})

describe('isRoleAccessible', () => {
  it('checks a single role', () => {
    expect(isRoleAccessible(adminUser, 'super_admin')).toBe(true)
    expect(isRoleAccessible(adminUser, 'client')).toBe(false)
  })

  it('rejects undefined role', () => {
    expect(isRoleAccessible(adminUser, undefined)).toBe(false)
  })
})

describe('resolveDashboardRole', () => {
  it('falls back to client for no user', () => {
    expect(resolveDashboardRole(null)).toBe('client')
    expect(resolveDashboardRole(null, 'production')).toBe('production')
  })

  it('honors an accessible requested role', () => {
    expect(resolveDashboardRole(multiUser, 'partner')).toBe('partner')
  })

  it('falls back to the explicit primary role when requested role is inaccessible', () => {
    // multiUser.role === 'client', which is treated as the explicit primary.
    expect(resolveDashboardRole(multiUser, 'super_admin')).toBe('client')
  })

  it('uses the first accessible role when no explicit primary exists', () => {
    const noPrimary = {
      ...multiUser,
      role: undefined,
      roles: ['partner', 'client'],
    } as AuthUser
    expect(resolveDashboardRole(noPrimary)).toBe('partner')
  })

  it('uses explicit primary role', () => {
    const u = { ...multiUser, primary_role: 'production' as const }
    expect(resolveDashboardRole(u)).toBe('production')
  })
})

describe('proto mapping', () => {
  it('maps dashboard roles to proto roles', () => {
    expect(protoRoleFor('super_admin')).toBe('admin')
    expect(protoRoleFor('client')).toBe('buyer')
    expect(protoRoleFor('partner')).toBe('manager')
    expect(protoRoleFor('production')).toBe('printer')
    expect(protoRoleFor(null)).toBe('buyer')
  })

  it('maps back via dashboardForProto', () => {
    expect(dashboardForProto('admin')).toBe('super_admin')
    expect(dashboardForProto('buyer')).toBe('client')
    expect(dashboardForProto('manager')).toBe('partner')
    expect(dashboardForProto('printer')).toBe('production')
  })

  it('computes home routes', () => {
    expect(protoHomeRoute('admin')).toBe('/app/admin')
    expect(protoHomeRoute('buyer')).toBe('/app/buyer')
    expect(protoHomeRoute('manager')).toBe('/app/manager')
    expect(protoHomeRoute('printer')).toBe('/app/printer')
  })
})

describe('dashboard routes', () => {
  it('routes every role', () => {
    for (const role of Object.keys(DASHBOARD_HOME_ROUTES) as DashboardRole[]) {
      expect(dashboardRouteForRole(role)).toBe(DASHBOARD_HOME_ROUTES[role])
    }
  })

  it('maps paths to roles', () => {
    expect(dashboardRoleFromPath('/app/admin')).toBe('super_admin')
    expect(dashboardRoleFromPath('/app/buyer')).toBe('client')
    expect(dashboardRoleFromPath('/app/manager')).toBe('partner')
    expect(dashboardRoleFromPath('/app/printer')).toBe('production')
    expect(dashboardRoleFromPath('/app/nope')).toBeNull()
    expect(dashboardRoleFromPath('/auth/login')).toBeNull()
  })
})

describe('PROTO_ROLES', () => {
  it('has exactly four roles', () => {
    expect(PROTO_ROLES).toEqual(['buyer', 'manager', 'printer', 'admin'])
  })
})