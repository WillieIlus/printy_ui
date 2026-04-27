<!-- Purpose: Client dashboard compact stat grid — 3 cards connected to quoteInboxStore. -->
<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <template v-if="showLoadingState">
      <div
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 text-sm text-[var(--p-text-muted)] sm:col-span-3"
      >
        <div class="flex items-center gap-2">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading dashboard totals...
        </div>
      </div>
    </template>
    <template v-else>
      <DashboardStatCard
        v-for="stat in stats"
        :key="stat.label"
        v-bind="stat"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import DashboardStatCard from '~/components/dashboard/shared/DashboardStatCard.vue'

const store = useQuoteInboxStore()
const { clientRequests, draftFiles, loading, loaded } = storeToRefs(store)

const showLoadingState = computed(() => loading.value && !loaded.value && clientRequests.value.length === 0 && draftFiles.value.length === 0)

const responsesWaiting = computed(() =>
  clientRequests.value.filter(
    r => r.latest_response !== null
      && r.response_status !== 'accepted'
      && r.status !== 'accepted',
  ).length,
)

const activeRequests = computed(() =>
  clientRequests.value.filter(
    r => r.status !== 'accepted' && r.status !== 'cancelled',
  ).length,
)

const savedDrafts = computed(() => draftFiles.value.length)

const stats = computed(() => [
  {
    label: 'Responses waiting',
    value: String(responsesWaiting.value).padStart(2, '0'),
    helper: 'Shop quotes to review',
    trend: responsesWaiting.value > 0 ? 'Review now' : 'All caught up',
    badgeTone: (responsesWaiting.value > 0 ? 'primary' : 'neutral') as 'primary' | 'neutral',
  },
  {
    label: 'Active requests',
    value: String(activeRequests.value).padStart(2, '0'),
    helper: 'Awaiting shop responses',
    trend: 'In progress',
    badgeTone: 'primary' as const,
  },
  {
    label: 'Saved drafts',
    value: String(savedDrafts.value).padStart(2, '0'),
    helper: 'Incomplete quote setups',
    trend: 'Resume',
    badgeTone: 'neutral' as const,
  },
])
</script>
