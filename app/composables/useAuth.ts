import type { SignupCredentials } from '~/shared/types'
import { ROUTES, normalizeAuthRedirect } from '~/shared/routes'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

type AppRole = 'client' | 'shop_owner' | 'staff' | 'broker' | null

function normalizeRole(role?: string | null): AppRole {
  if (role === 'PRINTER') return 'shop_owner'
  if (role === 'CUSTOMER') return 'client'
  if (role === 'client' || role === 'shop_owner' || role === 'staff' || role === 'broker') return role
  return null
}

function isPartnerUser(user: { role?: string; partner_profile_enabled?: boolean; capabilities?: Record<string, boolean> } | null): boolean {
  if (!user) return false
  if (normalizeRole(user.role) === 'broker') return true
  if (user.partner_profile_enabled === true) return true
  return user.capabilities?.can_manage_clients === true || user.capabilities?.can_source_jobs === true
}

/** Redirect path based on backend user role and shop ownership */
export function getPostLoginRedirectPath(
  user: { role?: string; partner_profile_enabled?: boolean; capabilities?: Record<string, boolean> } | null,
  hasShops: boolean,
): string {
  const role = normalizeRole(user?.role)
  if (!role) return ROUTES.home
  if (isPartnerUser(user) && role !== 'shop_owner' && role !== 'staff') {
    return ROUTES.partnerWorkspace
  }
  if (role === 'shop_owner') {
    return hasShops ? ROUTES.shopWorkspace : ROUTES.shopSetup
  }
  if (role === 'staff') {
    return '/dashboard'
  }
  return ROUTES.clientWorkspace
}

function isRoleAllowedPath(
  path: string,
  role: AppRole,
  hasShops: boolean,
  user: { role?: string; partner_profile_enabled?: boolean; capabilities?: Record<string, boolean> } | null,
): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('/auth')) return false
  if (role === 'client') {
    if (isPartnerUser(user)) return !path.startsWith('/dashboard/shop')
    return !path.startsWith('/dashboard/partner') && !path.startsWith('/dashboard/shop')
  }
  if (role === 'broker') {
    return !path.startsWith('/dashboard/shop')
  }
  if (role === 'staff') {
    if (path.startsWith('/quote-draft') || path.startsWith('/quotes') || path.startsWith('/account') || path.startsWith('/inbox')) return false
    return true
  }
  if (role === 'shop_owner') {
    if (path === '/for-shops') return true
    if (!hasShops) return false
    return !(path.startsWith('/quote-draft') || path.startsWith('/quotes') || path.startsWith('/account') || path.startsWith('/inbox'))
  }
  return true
}

export function resolvePostLoginRedirectPath(
  user: { role?: string; partner_profile_enabled?: boolean; capabilities?: Record<string, boolean> } | null,
  hasShops: boolean,
  requestedRedirect?: string | null,
): string {
  const role = normalizeRole(user?.role)
  const defaultPath = getPostLoginRedirectPath(user, hasShops)
  if (!requestedRedirect || !role) return defaultPath
  return isRoleAllowedPath(requestedRedirect, role, hasShops, user) ? requestedRedirect : defaultPath
}

export function useAuth() {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const shopStore = useShopStore()
  const router = useRouter()
  const route = useRoute()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)

  async function login(email: string, password: string, rememberMe = false) {
    const result = await authStore.login(email, password, rememberMe)
    if (result.success) {
      const u = authStore.user
      const pendingTasks: Promise<unknown>[] = [
        profileStore.fetchProfile().catch(() => {
          // Profile fetch may fail (e.g. 500) - still allow navigation
        }),
      ]

      if (authStore.normalizedRole === 'shop_owner' || authStore.normalizedRole === 'staff') {
        pendingTasks.push(shopStore.fetchMyShops())
      }

      await Promise.all(pendingTasks)
      const redirect = normalizeAuthRedirect(
        typeof route.query.next === 'string' ? route.query.next : typeof route.query.redirect === 'string' ? route.query.redirect : undefined,
      )
      const path = resolvePostLoginRedirectPath(u, (shopStore.myShops?.length ?? 0) > 0, redirect)
      await router.push(path)
    }
    return result
  }

  async function signup(data: SignupCredentials) {
    const result = await authStore.signup(data)
    if (result.success) {
      // Backend requires email verification; redirect to the email-help page.
      await router.push({ path: '/auth/verify-email', query: { email: data.email } })
    }
    return result
  }

  function logout() {
    authStore.logout()
    router.push('/auth/login')
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
  }
}
