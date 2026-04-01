import type { ActivityBadgeSummary } from '~/shared/types/activityBadges'

const EMPTY_SUMMARY: ActivityBadgeSummary = {
  shop: {
    incoming_requests: 0,
    messages_replies: 0,
    pending_quote_actions: 0,
  },
  client: {
    new_quotes: 0,
    shop_replies: 0,
    request_updates: 0,
  },
  notifications: {
    unread_total: 0,
  },
}

export const useActivityBadgesStore = defineStore('activityBadges', () => {
  const summary = ref<ActivityBadgeSummary>({ ...EMPTY_SUMMARY })
  const loading = ref(false)
  const lastShopSlug = ref<string | null>(null)
  const pollingHandle = ref<ReturnType<typeof setInterval> | null>(null)

  const clientTotal = computed(() =>
    summary.value.client.new_quotes + summary.value.client.shop_replies + summary.value.client.request_updates
  )

  async function fetchSummary(shopSlug?: string | null) {
    const { getActivitySummary } = useNotifications()
    loading.value = true
    try {
      summary.value = await getActivitySummary(shopSlug)
      lastShopSlug.value = shopSlug ?? null
      return summary.value
    } catch {
      summary.value = { ...EMPTY_SUMMARY }
      return summary.value
    } finally {
      loading.value = false
    }
  }

  function stopPolling() {
    if (pollingHandle.value) {
      clearInterval(pollingHandle.value)
      pollingHandle.value = null
    }
  }

  function startPolling(shopSlug?: string | null, intervalMs = 30000) {
    stopPolling()
    pollingHandle.value = setInterval(() => {
      void fetchSummary(shopSlug ?? lastShopSlug.value)
    }, intervalMs)
  }

  return {
    summary,
    loading,
    lastShopSlug,
    clientTotal,
    fetchSummary,
    startPolling,
    stopPolling,
  }
})
