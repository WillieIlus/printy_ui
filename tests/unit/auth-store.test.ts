import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '~/stores/auth'
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

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.cookie.split(';').forEach((c) => {
      const eq = c.indexOf('=')
      const name = eq > -1 ? c.slice(0, eq).trim() : c.trim()
      if (name.startsWith('printy_')) {
        document.cookie = `${name}=; Max-Age=0; Path=/`
      }
    })
  })

  it('starts unauthenticated', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.initialized).toBe(false)
  })

  it('isAuthenticated reflects the user', () => {
    const store = useAuthStore()
    store.user = makeUser()
    expect(store.isAuthenticated).toBe(true)
    store.user = null
    expect(store.isAuthenticated).toBe(false)
  })

  it('clearSession wipes user, role and cookies, and marks initialized', () => {
    const store = useAuthStore()
    store.user = makeUser()
    store.activeRole = 'client'
    store.clearSession()
    expect(store.user).toBeNull()
    expect(store.activeRole).toBeNull()
    expect(store.initialized).toBe(true)
  })

  it('setActiveRole rejects roles the user cannot access', () => {
    const store = useAuthStore()
    store.user = makeUser({ role: 'client' })
    expect(store.setActiveRole('super_admin')).toBe(false)
    expect(store.activeRole).toBeNull()
  })

  it('setActiveRole accepts an accessible role', () => {
    const store = useAuthStore()
    store.user = makeUser({ role: 'staff', can_access_admin_dashboard: true })
    expect(store.setActiveRole('super_admin')).toBe(true)
    expect(store.activeRole).toBe('super_admin')
  })

  it('setActiveRole(null) clears the role', () => {
    const store = useAuthStore()
    store.activeRole = 'client'
    store.setActiveRole(null)
    expect(store.activeRole).toBeNull()
  })

  it('capabilities getter returns stored capabilities', () => {
    const store = useAuthStore()
    store.user = makeUser({ capabilities: { can_source_jobs: true } })
    expect(store.capabilities).toEqual({ can_source_jobs: true })
  })

  it('canAccessAdminDashboard falls back to roles', () => {
    const store = useAuthStore()
    store.user = makeUser({ role: 'staff' })
    expect(store.canAccessAdminDashboard).toBe(true)
  })

  it('homeRoute maps to the buyer dashboard by default', () => {
    const store = useAuthStore()
    expect(store.homeRoute).toBe('/app/buyer')
  })

  it('updateProfile merges into the user object', async () => {
    const store = useAuthStore()
    store.user = makeUser()
    await store.updateProfile({ name: 'Renamed' })
    expect(store.user?.name).toBe('Renamed')
  })

  it('hydrateActiveRole pulls role from cookies', () => {
    document.cookie = 'printy_active_role=partner; Path=/; Max-Age=3600'
    const store = useAuthStore()
    store.hydrateActiveRole()
    expect(store.activeRole).toBe('partner')
  })

  it('syncActiveRoleFromUser picks an accessible stored role', () => {
    const store = useAuthStore()
    store.activeRole = 'partner'
    store.syncActiveRoleFromUser(makeUser({ roles: ['client', 'partner'], can_access_partner_dashboard: true }))
    expect(store.activeRole).toBe('partner')
  })

  it('syncRouteRole sets role from a dashboard path', () => {
    const store = useAuthStore()
    store.user = makeUser({ role: 'staff', can_access_admin_dashboard: true })
    store.syncRouteRole('/app/admin')
    expect(store.activeRole).toBe('super_admin')
  })

  it('clearSession preserves initialized flag for later refresh', () => {
    const store = useAuthStore()
    store.initialized = false
    store.clearSession()
    expect(store.initialized).toBe(true)
  })
})