import { c as useAuthStore, s as useRouter, v as useNuxtApp, A as API, w as parseApiError } from './server.mjs';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { u as useShopStore } from './shop-C66L1Ma3.mjs';

const useProfileStore = defineStore("profile", () => {
  const profile = ref(null);
  const profiles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    count: 0,
    next: null,
    previous: null
  });
  async function fetchProfiles(params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.profiles(), { params });
      profiles.value = response.results;
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch profiles");
    } finally {
      loading.value = false;
    }
  }
  async function fetchProfile() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      profile.value = await $api(API.profileMe());
    } catch (err) {
      const e = err;
      const status = e?.statusCode ?? e?.status;
      if (status === 404) {
        const ok = await createProfile();
        if (!ok) error.value = parseApiError(err, "Failed to create profile");
      } else {
        error.value = parseApiError(err, "Failed to fetch profile");
      }
    } finally {
      loading.value = false;
    }
  }
  async function createProfile() {
    try {
      const { $api } = useNuxtApp();
      profile.value = await $api(API.profiles(), {
        method: "POST",
        body: {}
      });
      return true;
    } catch (err) {
      error.value = parseApiError(err, "Failed to create profile");
      return false;
    }
  }
  async function fetchProfileById(pk) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      profile.value = await $api(API.profileDetail(pk));
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch profile");
    } finally {
      loading.value = false;
    }
  }
  async function updateProfile(data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      profile.value = await $api(API.profileMe(), {
        method: "PATCH",
        body: data
      });
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to update profile");
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function addProfileSocialLink(profileId, link) {
    try {
      const { $api } = useNuxtApp();
      const newLink = await $api(API.profileSocialLinks(profileId), {
        method: "POST",
        body: link
      });
      if (profile.value?.id === profileId) {
        profile.value.social_links = profile.value.social_links || [];
        profile.value.social_links.push(newLink);
      }
      return { success: true, link: newLink };
    } catch (err) {
      const message = parseApiError(err, "Failed to add link");
      return { success: false, error: message };
    }
  }
  async function deleteSocialLink(pk) {
    try {
      const { $api } = useNuxtApp();
      await $api(API.socialLinkDetail(pk), { method: "DELETE" });
      if (profile.value) {
        profile.value.social_links = (profile.value.social_links || []).filter((l) => l.id !== pk);
      }
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to delete link");
      return { success: false, error: message };
    }
  }
  return {
    profile,
    profiles,
    loading,
    error,
    pagination,
    fetchProfiles,
    fetchProfile,
    fetchProfileById,
    createProfile,
    updateProfile,
    addProfileSocialLink,
    deleteSocialLink
  };
});
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
//# sourceMappingURL=useAuth-DFWapCJE.mjs.map
