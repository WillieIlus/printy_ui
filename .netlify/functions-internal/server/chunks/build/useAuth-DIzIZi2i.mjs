import { c as useAuthStore, G as useRouter } from './server.mjs';
import { u as useProfileStore } from './profile-BrbBxAQk.mjs';
import { u as useShopStore } from './shop-COPLd96Y.mjs';
import { computed } from 'vue';

function getPostLoginRedirectPath(user, hasShops) {
  if (!user) return "/";
  if (user.role === "shop_owner" || user.role === "PRINTER") {
    return hasShops ? "/dashboard" : "/dashboard/shops/create";
  }
  if (user.role === "staff") {
    return "/dashboard";
  }
  return "/quote-draft";
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
      const u = authStore.user;
      const pendingTasks = [
        profileStore.fetchProfile().catch(() => {
        })
      ];
      if (authStore.normalizedRole === "shop_owner" || authStore.normalizedRole === "staff") {
        pendingTasks.push(shopStore.fetchMyShops());
      }
      await Promise.all(pendingTasks);
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
//# sourceMappingURL=useAuth-DIzIZi2i.mjs.map
