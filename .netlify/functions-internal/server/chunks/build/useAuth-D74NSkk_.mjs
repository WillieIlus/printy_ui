import { d as useAuthStore, I as useRouter, f as useRoute } from './server.mjs';
import { u as useProfileStore } from './profile-v5Kfn5BI.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { computed } from 'vue';

function normalizeRole(role) {
  if (role === "PRINTER") return "shop_owner";
  if (role === "CUSTOMER") return "client";
  if (role === "client" || role === "shop_owner" || role === "staff") return role;
  return null;
}
function getPostLoginRedirectPath(user, hasShops) {
  const role = normalizeRole(user?.role);
  if (!role) return "/";
  if (role === "shop_owner") {
    return hasShops ? "/dashboard" : "/dashboard/shops/create";
  }
  if (role === "staff") {
    return "/dashboard";
  }
  return "/quote-draft";
}
function isRoleAllowedPath(path, role, hasShops) {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/auth")) return false;
  if (role === "client") return !path.startsWith("/dashboard");
  if (role === "staff") {
    if (path.startsWith("/quote-draft") || path.startsWith("/quotes") || path.startsWith("/account") || path.startsWith("/inbox")) return false;
    if (path.startsWith("/dashboard/shops/create")) return false;
    return true;
  }
  if (role === "shop_owner") {
    if (!hasShops) return false;
    return !(path.startsWith("/quote-draft") || path.startsWith("/quotes") || path.startsWith("/account") || path.startsWith("/inbox"));
  }
  return true;
}
function resolvePostLoginRedirectPath(user, hasShops, requestedRedirect) {
  const role = normalizeRole(user?.role);
  const defaultPath = getPostLoginRedirectPath(user, hasShops);
  if (!requestedRedirect || !role) return defaultPath;
  return isRoleAllowedPath(requestedRedirect, role, hasShops) ? requestedRedirect : defaultPath;
}
function useAuth() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const shopStore = useShopStore();
  const router = useRouter();
  const route = useRoute();
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
      const redirect = typeof route.query.redirect === "string" ? route.query.redirect : null;
      const path = resolvePostLoginRedirectPath(u, (shopStore.myShops?.length ?? 0) > 0, redirect);
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

export { getPostLoginRedirectPath as g, resolvePostLoginRedirectPath as r, useAuth as u };
//# sourceMappingURL=useAuth-D74NSkk_.mjs.map
