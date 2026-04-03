import { m as useNuxtApp, A as API } from './server.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useClaimStore = defineStore("claim", () => {
  const claims = ref([]);
  const currentClaim = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    count: 0,
    next: null,
    previous: null
  });
  async function fetchClaims(params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.claims(), { params });
      claims.value = response.results;
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch claims";
    } finally {
      loading.value = false;
    }
  }
  async function fetchClaim(pk) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      currentClaim.value = await $api(API.claimDetail(pk));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch claim";
    } finally {
      loading.value = false;
    }
  }
  async function createClaim(data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const claim = await $api(API.claims(), {
        method: "POST",
        body: data
      });
      claims.value.push(claim);
      return { success: true, claim };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create claim";
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function verifyClaim(verificationCode) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      await $api(API.claimVerify(), {
        method: "POST",
        body: { verification_code: verificationCode }
      });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function reviewClaim(pk, status, notes) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const claim = await $api(API.claimReview(pk), {
        method: "POST",
        body: { status, notes }
      });
      currentClaim.value = claim;
      const idx = claims.value.findIndex((c) => c.id === pk);
      if (idx !== -1) claims.value[idx] = claim;
      return { success: true, claim };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to review claim";
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  return {
    claims,
    currentClaim,
    loading,
    error,
    pagination,
    fetchClaims,
    fetchClaim,
    createClaim,
    verifyClaim,
    reviewClaim
  };
});

export { useClaimStore as u };
//# sourceMappingURL=claim-DnKssOdl.mjs.map
