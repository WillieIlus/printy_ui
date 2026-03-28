import type { SignupCredentials } from '~/shared/types'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

type AppRole = 'client' | 'shop_owner' | 'staff' | null

function normalizeRole(role?: string | null): AppRole {
  if (role === 'PRINTER') return 'shop_owner'
  if (role === 'CUSTOMER') return 'client'
  if (role === 'client' || role === 'shop_owner' || role === 'staff') return role
  return null
}

/** Redirect path based on backend user role and shop ownership */
export function getPostLoginRedirectPath(user: { role?: string } | null, hasShops: boolean): string {
  const role = normalizeRole(user?.role)
  if (!role) return '/'
  if (role === 'shop_owner') {
    return hasShops ? '/dashboard' : '/dashboard/shops/create'
  }
  if (role === 'staff') {
    return '/dashboard'
  }
  return '/quote-draft'
}

function isRoleAllowedPath(path: string, role: AppRole, hasShops: boolean): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('/auth')) return false
  if (role === 'client') return !path.startsWith('/dashboard')
  if (role === 'staff') {
    if (path.startsWith('/quote-draft')) return false
    if (path.startsWith('/dashboard/shops/create')) return false
    return true
  }
  if (role === 'shop_owner') {
    if (!hasShops) return false
    return !path.startsWith('/quote-draft')
  }
  return true
}

export function resolvePostLoginRedirectPath(
  user: { role?: string } | null,
  hasShops: boolean,
  requestedRedirect?: string | null,
): string {
  const role = normalizeRole(user?.role)
  const defaultPath = getPostLoginRedirectPath(user, hasShops)
  if (!requestedRedirect || !role) return defaultPath
  return isRoleAllowedPath(requestedRedirect, role, hasShops) ? requestedRedirect : defaultPath
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
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
      const path = resolvePostLoginRedirectPath(u, (shopStore.myShops?.length ?? 0) > 0, redirect)
      await router.push(path)
    }
    return result
  }

  async function signup(data: SignupCredentials) {
    const result = await authStore.signup(data)
    if (result.success) {
      // Backend requires email verification; redirect to verify-email page
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
