<template>
  <DashboardSectionCard title="Traffic" :col-span="12">
    <div v-if="loading && !timeSeries" class="space-y-4">
      <DashboardSkeletonState variant="block" />
    </div>
    <div v-else-if="timeSeries?.series?.length" class="space-y-5">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Selected range</p>
          <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">{{ rangeLabel }}</p>
        </div>
        <div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Visits</p>
          <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">{{ formatNumber(totalVisits) }}</p>
        </div>
        <div class="rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-xs uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Quote submissions</p>
          <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">{{ formatNumber(totalQuoteSubmits) }}</p>
        </div>
      </div>

      <AdminAnalyticsTrafficChart
        :points="timeSeries.series"
        :interval="timeSeries.interval"
      />
    </div>
    <div v-else-if="error" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">Traffic data is unavailable.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">No traffic points recorded yet.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">Once events are ingested, visits and quote submissions will appear here.</p>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsTimeSeriesResponse } from '~/services/adminAnalytics'

const props = defineProps<{
  timeSeries: AnalyticsTimeSeriesResponse | null
  loading?: boolean
  error?: string | null
  rangeLabel: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')

const totalVisits = computed(() => (props.timeSeries?.series ?? []).reduce((sum, point) => sum + point.visits, 0))
const totalQuoteSubmits = computed(() => (props.timeSeries?.series ?? []).reduce((sum, point) => sum + point.quote_submits, 0))

function formatNumber(value: number) {
  return numberFormatter.format(value)
}
</script>
