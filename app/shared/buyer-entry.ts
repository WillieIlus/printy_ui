import type { DashboardRole } from '~/shared/types'
import { dashboardRouteForRole } from '~/shared/workspace'

/**
 * Law 9.1 — the marketing homepage and the instant-quote calculator behind it
 * are buyer entry points. A signed-in manager or printer must never see them;
 * they are redirected to their own dashboard. Buyers and signed-out visitors
 * are unaffected.
 *
 * Everything else (track job, email confirmation, terms/privacy, help and the
 * marketing/informational pages) stays open to every role, so only the public
 * buyer entry is treated as a guarded path here.
 */
export const BUYER_ENTRY_PATHS: readonly string[] = ['/']

/** Normalize a route path: drop query/hash and any trailing slash. */
export function normalizeRoutePath(path: string): string {
  const withoutQuery = (path.split(/[?#]/)[0] || '/').trim()
  const collapsed = withoutQuery.replace(/\/+$/, '')
  return collapsed === '' ? '/' : collapsed
}

/** True for the public buyer entry pages (homepage / instant quote). */
export function isBuyerEntryPath(path: string): boolean {
  return BUYER_ENTRY_PATHS.includes(normalizeRoutePath(path))
}

/**
 * Law 9.1 — roles that must be redirected away from a buyer entry page:
 * a signed-in manager (partner) or printer (production). Staff (super_admin)
 * and buyers are not redirected.
 */
export function isManagerOrPrinter(role: DashboardRole | null | undefined): boolean {
  return role === 'partner' || role === 'production'
}

export interface BuyerEntryGuardState {
  isAuthenticated: boolean
  dashboardRole: DashboardRole
  path: string
}

/**
 * Decision behind the `buyer-entry` middleware. Returns the dashboard URL a
 * signed-in manager/printer should be sent to, or `null` to let the navigation
 * continue. Pure so the guard behaviour is unit-testable.
 */
export function resolveBuyerEntryRedirect(state: BuyerEntryGuardState): string | null {
  if (!state.isAuthenticated) {
    return null
  }
  if (!isBuyerEntryPath(state.path)) {
    return null
  }
  if (!isManagerOrPrinter(state.dashboardRole)) {
    return null
  }
  return dashboardRouteForRole(state.dashboardRole)
}

export interface PostAuthRedirectState {
  redirect?: string | null
  dashboardRole: DashboardRole
}

/**
 * Law 9.1 — after login/sign-up/email confirmation, land on the dashboard for
 * the active role. A `?redirect=` target is honoured only when it is safe: a
 * manager/printer is never sent to a buyer entry page (e.g. the homepage),
 * and a non-path target falls back to the role dashboard.
 */
export function resolvePostAuthRedirect(state: PostAuthRedirectState): string {
  const home = dashboardRouteForRole(state.dashboardRole)
  const target = state.redirect
  if (!target || !target.startsWith('/')) {
    return home
  }
  if (isBuyerEntryPath(target) && isManagerOrPrinter(state.dashboardRole)) {
    return home
  }
  return target
}
