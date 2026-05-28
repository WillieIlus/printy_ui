import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import type { AuthTokens, AuthUser, LoginPayload, RegisterPayload, RegisterResponse, ResetPasswordPayload } from '~/shared/types'
import { dashboardRouteForRole, resolveAccessibleRoles, resolveDashboardRole } from '~/shared/workspace'

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

function cookieOptions(rememberMe: boolean) {
  return {
    sameSite: 'lax' as const,
    maxAge: rememberMe ? THIRTY_DAYS_IN_SECONDS : undefined,
  }
}

function rememberMeEnabled() {
  return useCookie<string | null>('printy_remember_me').value === '1'
}

function persistTokens(tokens: AuthTokens | null, rememberMe?: boolean) {
  const enabled = rememberMe ?? rememberMeEnabled()
  const access = useCookie<string | null>('printy_access_token', cookieOptions(enabled))
  const refresh = useCookie<string | null>('printy_refresh_token', cookieOptions(enabled))
  const remember = useCookie<string | null>('printy_remember_me', cookieOptions(enabled))
  access.value = tokens?.access ?? null
  refresh.value = tokens?.refresh ?? null
  remember.value = tokens ? (enabled ? '1' : '0') : null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isInitialized: (state) => state.initialized,
    dashboardRole: (state) => resolveDashboardRole(state.user),
    accessibleRoles: (state) => resolveAccessibleRoles(state.user),
    capabilities: (state) => state.user?.capabilities ?? {},
    canManageClients: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === 'boolean' && state.user.can_access_admin_dashboard) {
        return true
      }
      if (typeof state.user?.can_access_partner_dashboard === 'boolean') {
        return state.user.can_access_partner_dashboard
      }
      const capability = state.user?.capabilities?.can_manage_clients
      if (typeof capability === 'boolean') {
        return capability
      }
      return resolveAccessibleRoles(state.user).includes('partner')
    },
    canReceiveAssignments: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === 'boolean' && state.user.can_access_admin_dashboard) {
        return true
      }
      if (typeof state.user?.can_access_production_dashboard === 'boolean') {
        return state.user.can_access_production_dashboard
      }
      const capability = state.user?.capabilities?.can_receive_assignments
      if (typeof capability === 'boolean') {
        return capability
      }
      return resolveAccessibleRoles(state.user).includes('production')
    },
    canAccessAdminDashboard: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === 'boolean') {
        return state.user.can_access_admin_dashboard
      }
      return resolveAccessibleRoles(state.user).includes('super_admin')
    },
    canAccessClientDashboard: (state) => {
      if (typeof state.user?.can_access_client_dashboard === 'boolean') {
        return state.user.can_access_client_dashboard
      }
      return resolveAccessibleRoles(state.user).includes('client')
    },
    canAccessPartnerDashboard: (state) => {
      if (typeof state.user?.can_access_partner_dashboard === 'boolean') {
        return state.user.can_access_partner_dashboard
          || state.user.capabilities?.can_manage_clients === true
          || state.user.capabilities?.can_source_jobs === true
      }
      return resolveAccessibleRoles(state.user).includes('partner')
    },
    canAccessProductionDashboard: (state) => {
      if (typeof state.user?.can_access_production_dashboard === 'boolean') {
        return state.user.can_access_production_dashboard
      }
      return resolveAccessibleRoles(state.user).includes('production')
    },
    isShop: (state) => {
      return resolveAccessibleRoles(state.user).includes('production')
    },
    isPartnerProfile: (state) => {
      return resolveAccessibleRoles(state.user).includes('partner')
    },
    homeRoute: (state) => {
      if (state.user?.home_route) {
        return state.user.home_route
      }
      return dashboardRouteForRole(resolveDashboardRole(state.user))
    },
  },
  actions: {
    clearSession() {
      persistTokens(null)
      this.user = null
      this.initialized = true
    },
    async hydrateSession() {
      const access = useCookie<string | null>('printy_access_token')
      const refresh = useCookie<string | null>('printy_refresh_token')

      if (access.value) {
        try {
          return await this.fetchMe()
        } catch {
          if (!refresh.value) {
            this.clearSession()
            return null
          }
        }
      }

      if (refresh.value) {
        try {
          await this.refreshSession()
          return await this.fetchMe()
        } catch {
          this.clearSession()
          return null
        }
      }

      this.user = null
      return null
    },
    async initialize(force = false) {
      if (this.initialized && !force) {
        return
      }

      try {
        await this.hydrateSession()
      } finally {
        this.initialized = true
      }
    },
    async register(payload: RegisterPayload) {
      const { publicApi } = useApi()
      const endpoint = payload.role === 'partner'
        ? API.auth.registerPartner
        : payload.role === 'production'
          ? API.auth.registerProduction
          : API.auth.registerClient
      return publicApi<RegisterResponse>(endpoint, {
        method: 'POST',
        body: payload,
        auth: false,
      })
    },
    async login(payload: LoginPayload, options: { rememberMe?: boolean } = {}) {
      const { publicApi } = useApi()
      const result = await publicApi<AuthTokens & { user?: AuthUser }>(API.auth.login, {
        method: 'POST',
        body: payload,
        auth: false,
      })
      persistTokens(result, Boolean(options.rememberMe))
      this.user = result.user ?? await publicApi<AuthUser>(API.auth.me, {
        headers: {
          Authorization: `Bearer ${result.access}`,
        },
      })
      this.initialized = true
      return result
    },
    async refreshSession() {
      const refresh = useCookie<string | null>('printy_refresh_token')
      if (!refresh.value) {
        throw new Error('No refresh token found.')
      }
      const { publicApi } = useApi()
      const result = await publicApi<AuthTokens>(API.auth.refresh, {
        method: 'POST',
        body: { refresh: refresh.value },
        auth: false,
      })
      persistTokens({ access: result.access, refresh: result.refresh || refresh.value }, rememberMeEnabled())
      return result
    },
    async fetchMe() {
      const { api } = useApi()
      const user = await api<AuthUser>(API.auth.me)
      this.user = user
      return user
    },
    async confirmEmail(key: string) {
      const { publicApi } = useApi()
      return publicApi<{ detail: string; email?: string; verified?: boolean }>(API.auth.confirmEmail, {
        method: 'POST',
        body: { key },
        auth: false,
      })
    },
    async resendConfirmation(email: string) {
      const { publicApi } = useApi()
      return publicApi<{ detail: string; sent: boolean }>(API.auth.resendConfirmation, {
        method: 'POST',
        body: { email },
        auth: false,
      })
    },
    async forgotPassword(email: string) {
      const { publicApi } = useApi()
      return publicApi<{ detail: string }>(API.auth.forgotPassword, {
        method: 'POST',
        body: { email },
        auth: false,
      })
    },
    async resetPassword(payload: ResetPasswordPayload) {
      const { publicApi } = useApi()
      return publicApi<{ detail: string }>(API.auth.resetConfirm, {
        method: 'POST',
        body: payload,
        auth: false,
      })
    },
    logout() {
      this.clearSession()
      return navigateTo('/auth/login')
    },
  },
})
