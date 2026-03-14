import { e as useAuthStore, r as useRouter } from './server.mjs';
import { u as useProfileStore } from './profile-CEiUsRUc.mjs';
import { u as useShopStore } from './shop-0Cyw6rqQ.mjs';
import { computed } from 'vue';

function getPostLoginRedirectPath(user, hasShops) {
  if (!user) return "/gallery";
  if (user.role === "PRINTER") {
    return hasShops ? "/dashboard" : "/onboarding/printer";
  }
  return "/gallery";
}
function useAuth() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const shopStore = useShopStore();
  const router = useRouter();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const loading = computed(() => authStore.loading);
  async function login(email, password, rememberMe = false) {
    const result = await authStore.login(email, password, rememberMe);
    if (result.success) {
      try {
        await profileStore.fetchProfile();
      } catch {
      }
      const u = authStore.user;
      if (u?.role === "PRINTER") {
        await shopStore.fetchMyShops();
      }
      const path = getPostLoginRedirectPath(u, (shopStore.myShops?.length ?? 0) > 0);
      await router.push(path);
    }
    return result;
  }
  async function signup(data) {
    const result = await authStore.signup(data);
    if (result.success) {
      await router.push({ path: "/auth/verify-email", query: { email: data.email } });
    }
    return result;
  }
  function logout() {
    authStore.logout();
    router.push("/auth/login");
  }
  return {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout
  };
}

export { getPostLoginRedirectPath as g, useAuth as u };
//# sourceMappingURL=useAuth-CuIEby6D.mjs.map
