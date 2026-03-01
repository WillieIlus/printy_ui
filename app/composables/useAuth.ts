import type { SignupCredentials } from '~/shared/types'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

/** Redirect path based on user role and shop ownership */
export function getPostLoginRedirectPath(user: { role?: string } | null, hasShops: boolean): string {
  if (!user) return '/gallery'
  if (user.role === 'PRINTER') {
    return hasShops ? '/dashboard' : '/onboarding/printer'
  }
  return '/gallery'
}

export function useAuth() {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const shopStore = useShopStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)

  async function login(email: string, password: string, rememberMe = false) {
    const result = await authStore.login(email, password, rememberMe)
    if (result.success) {
      try {
        await profileStore.fetchProfile()
      } catch {
        // Profile fetch may fail (e.g. 500) - still allow navigation
      }
      const u = authStore.user
      if (u?.role === 'PRINTER') {
        await shopStore.fetchMyShops()
      }
      const path = getPostLoginRedirectPath(u, (shopStore.myShops?.length ?? 0) > 0)
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
