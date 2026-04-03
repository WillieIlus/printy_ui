import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { u as useNotifications } from './useNotifications-BB49WIYK.mjs';
import { s as setInterval } from './interval-DiSDr_Za.mjs';

const EMPTY_SUMMARY = {
  shop: {
    incoming_requests: 0,
    messages_replies: 0,
    pending_quote_actions: 0
  },
  client: {
    new_quotes: 0,
    shop_replies: 0,
    request_updates: 0
  },
  notifications: {
    unread_total: 0
  }
};
const useActivityBadgesStore = defineStore("activityBadges", () => {
  const summary = ref({ ...EMPTY_SUMMARY });
  const loading = ref(false);
  const lastShopSlug = ref(null);
  const pollingHandle = ref(null);
  const clientTotal = computed(
    () => summary.value.client.new_quotes + summary.value.client.shop_replies + summary.value.client.request_updates
  );
  async function fetchSummary(shopSlug) {
    const { getActivitySummary } = useNotifications();
    loading.value = true;
    try {
      summary.value = await getActivitySummary(shopSlug);
      lastShopSlug.value = shopSlug ?? null;
      return summary.value;
    } catch {
      summary.value = { ...EMPTY_SUMMARY };
      return summary.value;
    } finally {
      loading.value = false;
    }
  }
  function stopPolling() {
    if (pollingHandle.value) {
      clearInterval(pollingHandle.value);
      pollingHandle.value = null;
    }
  }
  function startPolling(shopSlug, intervalMs = 3e4) {
    stopPolling();
    pollingHandle.value = setInterval();
  }
  return {
    summary,
    loading,
    lastShopSlug,
    clientTotal,
    fetchSummary,
    startPolling,
    stopPolling
  };
});

export { useActivityBadgesStore as u };
//# sourceMappingURL=activityBadges-B_bMwbEc.mjs.map
