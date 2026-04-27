<!-- Purpose: Shop dashboard metric grid backed by live quote request counts. -->
<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <DashboardStatCard
      v-for="stat in stats"
      :key="stat.label"
      v-bind="stat"
      tone="dark"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardStatCard from '~/components/dashboard/shared/DashboardStatCard.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

const store = useQuoteInboxStore()
const { dashboard } = storeToRefs(store)

onMounted(async () => {
  if (!dashboard.value) {
    await store.fetchDashboard().catch(() => undefined)
  }
})

const stats = computed(() => {
  const summary = dashboard.value
  const total = summary?.received_quote_requests ?? 0
  const pending = summary?.status_counts?.pending ?? 0
  const modified = summary?.status_counts?.modified ?? 0
  const accepted = summary?.status_counts?.accepted ?? 0

  return [
    {
      label: 'New requests',
      value: String(summary?.new_quote_requests ?? total),
      helper: 'Quote requests currently in your dashboard',
      trend: pending ? `${pending} awaiting reply` : 'No new backlog',
      badgeTone: 'primary' as const,
    },
    {
      label: 'Pending responses',
      value: String(summary?.pending_responses_count ?? pending),
      helper: 'Requests that still need a response',
      trend: pending ? 'Respond next' : 'Up to date',
      badgeTone: 'dark' as const,
    },
    {
      label: 'Responded',
      value: String(summary?.responded_requests_count ?? 0),
      helper: 'Requests with a recorded shop response',
      trend: modified ? `${modified} need follow-up` : 'Replies sent',
      badgeTone: 'neutral' as const,
    },
    {
      label: 'Accepted quotes',
      value: String(summary?.accepted_quotes_count ?? accepted),
      helper: 'Requests converted into accepted quotes',
      trend: accepted ? 'Good momentum' : 'Waiting on approvals',
      badgeTone: 'success' as const,
    },
  ]
})
</script>
