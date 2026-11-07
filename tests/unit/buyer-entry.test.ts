import { describe, it, expect } from 'vitest'
import {
  BUYER_ENTRY_PATHS,
  isBuyerEntryPath,
  isManagerOrPrinter,
  normalizeRoutePath,
  resolveBuyerEntryRedirect,
  resolvePostAuthRedirect,
} from '~/shared/buyer-entry'

describe('normalizeRoutePath / isBuyerEntryPath', () => {
  it('treats the homepage as the buyer entry regardless of query/hash/slash noise', () => {
    expect(normalizeRoutePath('/')).toBe('/')
    expect(normalizeRoutePath('/?ref=x')).toBe('/')
    expect(normalizeRoutePath('/#top')).toBe('/')
    expect(normalizeRoutePath('///')).toBe('/')
    expect(isBuyerEntryPath('/')).toBe(true)
    expect(isBuyerEntryPath('/?mode=quote')).toBe(true)
  })

  it('leaves every other page alone (track, email confirmation, legal, app)', () => {
    for (const p of [
      '/track',
      '/auth/confirm-email',
      '/legal',
      '/how-it-works',
      '/about',
      '/contact',
      '/app/buyer',
      '/app/manager',
      '/app/printer',
    ]) {
      expect(isBuyerEntryPath(p), p).toBe(false)
    }
  })

  it('only lists the public buyer entry', () => {
    expect([...BUYER_ENTRY_PATHS]).toEqual(['/'])
  })
})

describe('resolveBuyerEntryRedirect (law 9.1 guard)', () => {
  it('redirects a signed-in manager from the homepage to their dashboard', () => {
    expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'partner', path: '/' }))
      .toBe('/app/manager')
  })

  it('redirects a signed-in printer from the homepage to their dashboard', () => {
    expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'production', path: '/' }))
      .toBe('/app/printer')
  })

  it('leaves buyers on the homepage (unaffected)', () => {
    expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'client', path: '/' }))
      .toBeNull()
  })

  it('leaves signed-out visitors on the homepage (unaffected)', () => {
    expect(resolveBuyerEntryRedirect({ isAuthenticated: false, dashboardRole: 'client', path: '/' }))
      .toBeNull()
    expect(resolveBuyerEntryRedirect({ isAuthenticated: false, dashboardRole: 'partner', path: '/' }))
      .toBeNull()
  })

  it('never redirects manager/printer away from pages open to all roles', () => {
    for (const p of ['/track', '/auth/confirm-email', '/legal']) {
      expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'partner', path: p })).toBeNull()
      expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'production', path: p })).toBeNull()
    }
  })

  it('scopes the guard to manager/printer (staff are not redirected)', () => {
    expect(isManagerOrPrinter('super_admin')).toBe(false)
    expect(isManagerOrPrinter('client')).toBe(false)
    expect(isManagerOrPrinter('partner')).toBe(true)
    expect(isManagerOrPrinter('production')).toBe(true)
    expect(resolveBuyerEntryRedirect({ isAuthenticated: true, dashboardRole: 'super_admin', path: '/' }))
      .toBeNull()
  })
})

describe('resolvePostAuthRedirect (law 9.1 post-login routing)', () => {
  it('defaults to the role dashboard when no target is given', () => {
    expect(resolvePostAuthRedirect({ redirect: null, dashboardRole: 'partner' })).toBe('/app/manager')
    expect(resolvePostAuthRedirect({ redirect: undefined, dashboardRole: 'client' })).toBe('/app/buyer')
    expect(resolvePostAuthRedirect({ redirect: '', dashboardRole: 'production' })).toBe('/app/printer')
    expect(resolvePostAuthRedirect({ redirect: null, dashboardRole: 'super_admin' })).toBe('/app/admin')
  })

  it('rejects non-path (external) targets', () => {
    expect(resolvePostAuthRedirect({ redirect: 'https://evil.example', dashboardRole: 'client' }))
      .toBe('/app/buyer')
  })

  it('honours a safe deep-link target', () => {
    expect(resolvePostAuthRedirect({ redirect: '/app/manager/quotes', dashboardRole: 'partner' }))
      .toBe('/app/manager/quotes')
  })

  it('keeps a manager/printer off the buyer homepage', () => {
    expect(resolvePostAuthRedirect({ redirect: '/', dashboardRole: 'partner' })).toBe('/app/manager')
    expect(resolvePostAuthRedirect({ redirect: '/?ref=x', dashboardRole: 'production' })).toBe('/app/printer')
  })

  it('lets a buyer honour the homepage target', () => {
    expect(resolvePostAuthRedirect({ redirect: '/', dashboardRole: 'client' })).toBe('/')
  })
})
