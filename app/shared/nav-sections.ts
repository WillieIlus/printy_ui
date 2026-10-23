import type { Component } from 'vue'
import {
  Coins, Gauge, Handshake, LayoutDashboard, Mail, Rocket, Settings, Store, Users,
} from 'lucide-vue-next'
import type { ProtoRole } from '~/shared/workspace'

export interface SideNavItem {
  key: string
  label: string
  to: string
  icon: Component
  badge?: number | null
}

/** Counts of needs-action items per role, sourced from the manager store/server. */
export const SIDE_NAV_BADGES: Record<ProtoRole, { [key: string]: number }> = {
  buyer: { messages: 0, orders: 0 },
  manager: { quotes: 0, jobs: 0 },
  printer: { jobs: 0, rate_card: 0, shop: 0 },
  admin: {},
}

/** Reactive badge getters – computed from the store in the layout. */
export function needsActionBadge(role: ProtoRole, itemKey: string): number {
  const badges = SIDE_NAV_BADGES[role]
  return badges && badges[itemKey] !== undefined ? badges[itemKey] : 0
}

/** Convenience: show orange pill only when count > 0. */
export function hasNavBadge(role: ProtoRole, itemKey: string): boolean {
  return needsActionBadge(role, itemKey) > 0
}

/** One role-aware side nav for every dashboard — no page invents its own. */
export const SIDE_NAV_ITEMS: Record<ProtoRole, SideNavItem[]> = {
  buyer: [
    { key: 'orders', label: 'My orders', to: '/app/buyer', icon: LayoutDashboard },
    { key: 'messages', label: 'Messages', to: '/app/messages', icon: Mail },
    { key: 'settings', label: 'Settings', to: '/app/settings', icon: Settings },
  ],
  manager: [
    { key: 'control-room', label: 'Control room', to: '/app/manager', icon: LayoutDashboard },
    { key: 'quotes', label: 'Quotes', to: '/app/manager/quotes', icon: Handshake },
    { key: 'jobs', label: 'Jobs', to: '/app/manager/jobs', icon: Rocket },
    { key: 'clients', label: 'Clients & shops', to: '/app/manager/clients', icon: Users },
    { key: 'rates', label: 'Pricing guidance', to: '/app/manager/rates', icon: Gauge },
    { key: 'messages', label: 'Messages', to: '/app/messages', icon: Mail },
  ],
  printer: [
    { key: 'press-floor', label: 'Press floor', to: '/app/printer', icon: LayoutDashboard },
    { key: 'rate-card', label: 'Rate card', to: '/app/printer/rates', icon: Coins },
    { key: 'shop', label: 'Shop setup', to: '/app/printer/shop', icon: Store },
    { key: 'messages', label: 'Messages', to: '/app/messages', icon: Mail },
  ],
  // The admin dashboard owns its own shell and sections nav.
  admin: [],
}

export const SIDE_NAV_ROOT_PATHS = ['/app/buyer', '/app/manager', '/app/printer']

export function sideNavForRole(role: ProtoRole): SideNavItem[] {
  return SIDE_NAV_ITEMS[role] ?? []
}

/**
 * Exact match for a dashboard root, prefix match for everything below it, so
 * `/app/manager/quotes` never leaves both "Control room" and "Quotes" lit.
 */
export function isSideNavActive(path: string, to: string): boolean {
  if (SIDE_NAV_ROOT_PATHS.includes(to)) return path === to
  return path === to || path.startsWith(`${to}/`)
}

/**
 * Get the badge count for a nav item by key for the given role.
 * Reactive: callers should compute this from the store; this just provides
 * the mapping from item key to badge value.*/

export function getNavBadge(role: ProtoRole, itemKey: string): number
{
  const badges = SIDE_NAV_BADGES[role]
  return badges && badges[itemKey] ? badges[itemKey] : 0
}
