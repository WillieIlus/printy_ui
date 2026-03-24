import { x as useNuxtApp, A as API, w as parseApiError } from './server.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useUserStore = defineStore("user", () => {
  const users = ref([]);
  const currentUser = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    count: 0,
    next: null,
    previous: null
  });
  async function updateMe(payload) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      currentUser.value = await $api(API.userMe(), {
        method: "PATCH",
        body: payload
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
  async function fetchUsers(params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.users(), { params });
      users.value = response.results;
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch users";
    } finally {
      loading.value = false;
    }
  }
  async function fetchMe() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      currentUser.value = await $api(API.userMe());
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch current user";
    } finally {
      loading.value = false;
    }
  }
  async function fetchUser(pk) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      currentUser.value = await $api(API.userDetail(pk));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch user";
    } finally {
      loading.value = false;
    }
  }
  return {
    users,
    currentUser,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchMe,
    fetchUser,
    updateMe
  };
});

export { useUserStore as u };
//# sourceMappingURL=user-yk0wG_HM.mjs.map
