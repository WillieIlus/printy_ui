import { describe, it, expect } from 'vitest'
import {
  DESIGN_NAV_SECTIONS,
  designInstantQuoteHref,
  designMarketingNav,
  designMarketingRoleFromMeta,
  designMarketingRoleFromWorkspaceRole,
  designNavFor,
  designWorkspaceRoleFromUser,
} from '../../app/utils/design/nav'
import type { AuthUser } from '~/shared/types'

const clientUser: AuthUser = { id: 1, email: 'wanjiku@printy.ke', name: 'Wanjiku Njeri', role: 'client' }
const partnerUser: AuthUser = { id: 2, email: 'amara@printy.ke', name: 'Amara Wanjiru', role: 'manager' }
const printerUser: AuthUser = { id: 3, email: 'savanna@printy.ke', name: 'Savanna Print Co.', role: 'shop_owner' }
const adminUser: AuthUser = { id: 4, email: 'ops@printy.ke', name: 'Printy Ops', role: 'admin' }
const multiUser: AuthUser = {
  id: 5,
  email: 'multi@printy.ke',
  name: 'Multi',
  role: 'client',
  roles: ['client', 'partner'],
  can_access_partner_dashboard: true,
  active_role: 'partner',
}

describe('Design nav (Phase 3)', () => {
  it('exposes design nav data for every design workspace role', () => {
    expect(Object.keys(DESIGN_NAV_SECTIONS).sort()).toEqual(['client', 'partner', 'production', 'super_admin'])
  })

  it('resolves each design surface role to the matching design workspace role', () => {
    expect(designWorkspaceRoleFromUser(clientUser)).toBe('client')
    expect(designWorkspaceRoleFromUser(partnerUser)).toBe('partner')
    expect(designWorkspaceRoleFromUser(printerUser)).toBe('production')
    expect(designWorkspaceRoleFromUser(adminUser)).toBe('super_admin')
  })

  it('derives no workspace nav for a signed-out user', () => {
    expect(designNavFor(null)).toEqual([])
  })

  it('derives the buyer nav for the client design role, including the adopted instant-price route', () => {
    const sections = designNavFor(clientUser)
    const labels = sections.flatMap(section => section.items.map(item => item.label))
    expect(labels).toContain('Overview')
    expect(labels).toContain('Track a job')
    expect(sections.flatMap(section => section.items).some(item => item.href === '/quote')).toBe(true)
  })

  it('derives the manager nav for the partner design role', () => {
    const flat = designNavFor(partnerUser).flatMap(section => section.items)
    expect(flat.some(item => item.href === '/app/manager#jobs')).toBe(true)
    expect(flat.some(item => item.href === '/app/manager#clients')).toBe(true)
  })

  it('derives the printer nav for the production design role, including the real onboarding checklist', () => {
    const flat = designNavFor(printerUser).flatMap(section => section.items)
    expect(flat.some(item => item.href === '/app/printer')).toBe(true)
    expect(flat.some(item => item.href === '/app/printer/get-started')).toBe(true)
    expect(flat.some(item => item.href === '/app/printer#payouts')).toBe(true)
  })

  it('derives the admin oversight nav for the super_admin design role', () => {
    const flat = designNavFor(adminUser).flatMap(section => section.items)
    expect(flat.some(item => item.href === '/app/admin#ledger')).toBe(true)
    expect(flat.some(item => item.href === '/app/admin#escrow')).toBe(true)
  })

  it('derives nav for a multi-role user from the resolved design role', () => {
    const flat = designNavFor(multiUser).flatMap(section => section.items)
    expect(flat.some(item => item.href === '/app/manager#jobs')).toBe(true)
    expect(flat.some(item => item.href === '/app/manager#clients')).toBe(true)
  })

  it('honours an explicitly requested accessible design role', () => {
    expect(designWorkspaceRoleFromUser(multiUser, 'partner')).toBe('partner')
    expect(designNavFor(multiUser, 'partner').flatMap(section => section.items).some(item => item.href === '/app/manager#jobs')).toBe(true)
  })

  it('falls back to the user-derived design role when the requested design role is not accessible', () => {
    expect(designWorkspaceRoleFromUser(printerUser, 'client')).toBe('production')
    expect(designNavFor(printerUser, 'client').flatMap(section => section.items).some(item => item.href === '/app/printer')).toBe(true)
  })

  it('returns marketing nav items that are all existing printy routes', () => {
    const items = designMarketingNav()
    expect(items.map(item => item.href)).toEqual(['/how-it-works', '/for-managers', '/for-shops', '/track'])
  })

  it('maps the design instant-price CTA onto the adopted public quote page', () => {
    expect(designInstantQuoteHref(false, 'client')).toBe('/quote')
    expect(designInstantQuoteHref(true, 'client')).toBe('/quote')
    expect(designInstantQuoteHref(true, 'partner')).toBe('/quote')
  })

  it('maps design workspace roles onto design marketing roles', () => {
    expect(designMarketingRoleFromWorkspaceRole('super_admin')).toBe('client')
    expect(designMarketingRoleFromWorkspaceRole('client')).toBe('client')
  })

  it('uses the page role meta for the marketing colour scope, defaulting to buyer', () => {
    expect(designMarketingRoleFromMeta({ role: 'client' })).toBe('client')
    expect(designMarketingRoleFromMeta({ role: 'partner' })).toBe('partner')
    expect(designMarketingRoleFromMeta({ role: 'production' })).toBe('production')
    expect(designMarketingRoleFromMeta({ role: 'super_admin' })).toBe('client')
    expect(designMarketingRoleFromMeta(undefined)).toBe('client')
  })
})
