import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { resolveGuestRedirect } from '~/shared/guest-redirect'
import type { AuthUser } from '~/shared/types'

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: vi.fn(),
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 1,
    email: 'ava@printy.ke',
    name: 'Ava Lindqvist',
    role: 'client',
    ...overrides,
  }
}

describe('guest redirect decision', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('authenticated users are redirected to their role dashboard', () => {
    expect(resolveGuestRedirect({ isAuthenticated: true, homeRoute: '/app/buyer' })).toBe('/app/buyer')
    expect(resolveGuestRedirect({ isAuthenticated: true, homeRoute: '/app/manager' })).toBe('/app/manager')
    expect(resolveGuestRedirect({ isAuthenticated: true, homeRoute: '/app/printer' })).toBe('/app/printer')
    expect(resolveGuestRedirect({ isAuthenticated: true, homeRoute: '/app/admin' })).toBe('/app/admin')
  })

  it('unauthenticated users are unaffected (no redirect)', () => {
    expect(resolveGuestRedirect({ isAuthenticated: false, homeRoute: '/app/buyer' })).toBeNull()
  })
})

describe('guest redirect wiring via the auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function redirectFor(user: AuthUser | null): string | null {
    const store = useAuthStore()
    store.user = user
    return resolveGuestRedirect({ isAuthenticated: store.isAuthenticated, homeRoute: store.homeRoute })
  }

  it('buyer is redirected to /app/buyer', () => {
    expect(redirectFor(makeUser({ role: 'client' }))).toBe('/app/buyer')
  })

  it('manager is redirected to /app/manager', () => {
    expect(redirectFor(makeUser({ role: 'partner', can_access_partner_dashboard: true }))).toBe('/app/manager')
  })

  it('printer is redirected to /app/printer', () => {
    expect(redirectFor(makeUser({ role: 'production', can_access_production_dashboard: true }))).toBe('/app/printer')
  })

  it('admin is redirected to /app/admin', () => {
    expect(redirectFor(makeUser({ role: 'staff', can_access_admin_dashboard: true }))).toBe('/app/admin')
  })

  it('authenticated user with no dashboard role yet resolves to a real dashboard', () => {
    expect(redirectFor(makeUser({ role: 'customer' }))).toBe('/app/buyer')
  })

  it('unauthenticated (no user) means no redirect', () => {
    expect(redirectFor(null)).toBeNull()
  })
})