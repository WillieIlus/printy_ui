import { describe, it, expect } from 'vitest'
import { resolveLegacyRoute } from '~/shared/legacy-redirect'

describe('legacy dashboard deep links', () => {
  it('maps the client quote deep link to the buyer quotes tab', () => {
    expect(resolveLegacyRoute('/dashboard/client/requests/2/quote/1')).toBe('/app/buyer?tab=quote')
  })

  it('maps a legacy client request link to the buyer quotes tab', () => {
    expect(resolveLegacyRoute('/dashboard/client/requests/2')).toBe('/app/buyer?tab=quote')
  })

  it('maps a legacy client quote link to the buyer quotes tab', () => {
    expect(resolveLegacyRoute('/dashboard/client/quotes/2')).toBe('/app/buyer?tab=quote')
  })

  it('maps a legacy client job link to the buyer workspace', () => {
    expect(resolveLegacyRoute('/dashboard/client/jobs/9')).toBe('/app/buyer')
  })

  it('maps the bare client dashboard to the buyer workspace', () => {
    expect(resolveLegacyRoute('/dashboard/client')).toBe('/app/buyer')
  })

  it('maps a legacy partner dashboard to the manager workspace', () => {
    expect(resolveLegacyRoute('/dashboard/partner/quotes/2')).toBe('/app/manager')
  })

  it('maps a legacy production/shop dashboard to the printer workspace', () => {
    expect(resolveLegacyRoute('/dashboard/production/jobs/3')).toBe('/app/printer')
    expect(resolveLegacyRoute('/dashboard/shop/requests/2/quote/1')).toBe('/app/printer')
  })

  it('maps a legacy admin dashboard to the admin workspace', () => {
    expect(resolveLegacyRoute('/dashboard/admin')).toBe('/app/admin')
  })

  it('falls back to the home page for unknown dashboard paths', () => {
    expect(resolveLegacyRoute('/dashboard/something/else')).toBe('/')
  })
})

describe('legacy track links', () => {
  it('rewrites old track-job share links to the current track route', () => {
    expect(resolveLegacyRoute('/track-job/abc123')).toBe('/track/abc123')
  })
})

describe('already-routed paths pass through', () => {
  it('returns null for app routes', () => {
    expect(resolveLegacyRoute('/app/buyer?tab=quote')).toBeNull()
  })

  it('returns null for unrelated public paths', () => {
    expect(resolveLegacyRoute('/quotes')).toBeNull()
    expect(resolveLegacyRoute('/')).toBeNull()
    expect(resolveLegacyRoute('')).toBeNull()
  })
})