/**
 * Calculator presentation mode.
 *
 * One calculator, two presentations. A buyer-facing visitor (signed out, or a
 * signed-in user whose ACTIVE role is client) gets the single-card MINIMAL
 * layout; a manager, printer or admin gets the DETAILED multi-card layout built
 * from the same store and the same preview endpoint. This module decides only
 * the presentation — never pricing and never what data may be seen, which the
 * Django visibility rules own.
 *
 * Roles are normalised with the existing workspace helpers so nobody has to
 * remember the raw aliases (`broker`, `shop_owner`, `staff`, ...).
 */

import { normalizeDashboardRole, resolveAccessibleRoles } from '~/shared/workspace'
import type { DashboardRole } from '~/shared/types'

export type DesignCalculatorMode = 'minimal' | 'detailed'

export interface DesignCalculatorModeInput {
  /** True when a real session exists (the auth store's `isAuthenticated`). */
  isAuthenticated: boolean
  /** The role the user is currently acting as (`printy_active_role` cookie). */
  activeRole?: string | null
  /** Every role the user really holds; used only when no active role is set. */
  accessibleRoles?: Array<string | null | undefined> | null
}

/** Roles that see printer-sourced, multi-card detail. Everyone else is a buyer. */
const DETAILED_ROLES: ReadonlySet<DashboardRole> = new Set<DashboardRole>([
  'partner',
  'production',
  'super_admin',
])

function resolveActiveRole(input: DesignCalculatorModeInput): DashboardRole | null {
  const active = normalizeDashboardRole(input.activeRole ?? null)
  if (active) {
    return active
  }
  // No active role yet: a single-role account is unambiguous. A multi-role
  // account without a chosen role falls back to the safe buyer view rather
  // than guessing which desk it meant.
  const accessible = new Set<DashboardRole>()
  for (const role of input.accessibleRoles ?? []) {
    const normalized = normalizeDashboardRole(role ?? null)
    if (normalized) {
      accessible.add(normalized)
    }
  }
  if (accessible.size === 1) {
    return [...accessible][0] ?? null
  }
  return null
}

/**
 * The mode for this viewer. Unknown, missing or buyer roles are minimal; only a
 * known manager/printer/admin role unlocks the detailed layout.
 */
export function designCalculatorMode(input: DesignCalculatorModeInput): DesignCalculatorMode {
  if (!input.isAuthenticated) {
    return 'minimal'
  }
  const role = resolveActiveRole(input)
  if (!role) {
    return 'minimal'
  }
  return DETAILED_ROLES.has(role) ? 'detailed' : 'minimal'
}

/** Roles the auth store reports for a user, normalised and de-duplicated. */
export function designCalculatorAccessibleRoles(user: unknown): DashboardRole[] {
  return resolveAccessibleRoles(user as never)
}
