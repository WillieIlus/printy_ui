import { m as useNuxtApp, A as API } from './server.mjs';
import { getQuoteDraftFile, listQuoteDraftFiles } from './quoteDraft-5mvcgeM-.mjs';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const useQuoteInboxStore = defineStore("quoteInbox", () => {
  const dashboard = ref(null);
  const drafts = ref([]);
  const draftFiles = ref([]);
  const activeDraftFile = ref(null);
  const clientRequests = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref(null);
  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      dashboard.value = await $api(API.dashboardShopHome());
      loaded.value = true;
      return dashboard.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load dashboard.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchDrafts() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      drafts.value = await $api(API.calculatorDrafts());
      return drafts.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load drafts.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchClientRequests() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const requests = await $api(API.quoteRequests());
      const requestList = Array.isArray(requests) ? requests : requests.results ?? [];
      const requestWithResponses = await Promise.all(requestList.map(async (request) => {
        const responses = await $api(API.quoteRequestResponses(request.id));
        const responseList = Array.isArray(responses) ? responses : responses.results ?? [];
        const latestResponse = [...responseList].sort(
          (left, right) => new Date(right.created_at ?? right.sent_at ?? 0).getTime() - new Date(left.created_at ?? left.sent_at ?? 0).getTime()
        )[0] ?? null;
        return {
          ...request,
          latest_response: latestResponse,
          response_status: latestResponse?.status ?? "pending"
        };
      }));
      clientRequests.value = requestWithResponses;
      loaded.value = true;
      return clientRequests.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load requests.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchDraftFiles(scope = "dashboard") {
    loading.value = true;
    error.value = null;
    try {
      draftFiles.value = await listQuoteDraftFiles(void 0, scope);
      if (!activeDraftFile.value || !draftFiles.value.some((file) => file.id === activeDraftFile.value?.id)) {
        activeDraftFile.value = draftFiles.value[0] ?? null;
      }
      return draftFiles.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load quote files.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  async function fetchDraftFile(fileId, scope = "dashboard") {
    loading.value = true;
    error.value = null;
    try {
      activeDraftFile.value = await getQuoteDraftFile(fileId, void 0, scope);
      return activeDraftFile.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load quote file.";
      throw err;
    } finally {
      loading.value = false;
    }
  }
  const quoteBuilderItemCount = computed(
    () => draftFiles.value.reduce((total, file) => total + (file.item_count || 0), 0)
  );
  async function saveDraft(payload) {
    const { $api } = useNuxtApp();
    const draft = await $api(API.calculatorDrafts(), {
      method: "POST",
      body: payload
    });
    await Promise.all([
      fetchDrafts(),
      fetchDraftFiles("dashboard")
    ]);
    return draft;
  }
  async function sendDraft(id, shops, requestDetailsSnapshot) {
    const { $api } = useNuxtApp();
    const responses = await $api(API.calculatorDraftSend(id), {
      method: "POST",
      body: {
        shops,
        request_details_snapshot: requestDetailsSnapshot ?? {}
      }
    });
    await Promise.all([
      fetchDrafts(),
      fetchDraftFiles("dashboard"),
      fetchClientRequests()
    ]);
    return responses;
  }
  return {
    dashboard,
    drafts,
    draftFiles,
    activeDraftFile,
    clientRequests,
    loading,
    loaded,
    error,
    quoteBuilderItemCount,
    fetchDashboard,
    fetchDrafts,
    fetchDraftFiles,
    fetchDraftFile,
    fetchClientRequests,
    saveDraft,
    sendDraft
  };
});

export { useQuoteInboxStore as u };
//# sourceMappingURL=quoteInbox-BZeZ2Gtb.mjs.map
