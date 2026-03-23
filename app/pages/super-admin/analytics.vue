<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]">
          Super Admin
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]">
          Analytics dashboard
        </h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--p-text-dim)]">
          Monitor traffic, quote intent, discovery patterns, geo activity, and operational issues from one view.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton color="neutral" variant="soft" :loading="isLoading" @click="reloadAll">
          Refresh data
        </UButton>
      </div>
    </div>

    <UAlert
      v-if="hasBlockingError"
      color="error"
      variant="soft"
      title="Analytics could not be loaded"
      :description="error || 'The analytics endpoints did not return usable data.'"
    >
      <template #actions>
        <UButton color="error" variant="soft" size="sm" @click="reloadAll">
          Retry
        </UButton>
      </template>
    </UAlert>

    <SuperAdminSummaryCards
      v-if="!isInitialLoading"
      :summary="summary"
      :loading="loading.summary"
    />
    <DashboardSkeletonState v-else variant="kpi" />

    <SuperAdminRangeControls
      :range="selectedRange"
      :interval="selectedInterval"
      @update:range="selectedRange = $event"
      @update:interval="selectedInterval = $event"
    />

    <SuperAdminTimeSeriesChart
      :time-series="timeSeries"
      :loading="loading.timeSeries"
      :error="errors.timeSeries"
      :range-label="currentRangeLabel"
      @retry="reloadAll"
    />

    <SuperAdminFunnelSection
      :data="funnel"
      :loading="loading.funnel"
      :error="errors.funnel"
      @retry="reloadAll"
    />

    <div class="grid gap-6 xl:grid-cols-2">
      <SuperAdminTopSearches
        :items="topMetrics?.top_searched_keywords ?? []"
        :loading="loading.topMetrics"
        :error="errors.topMetrics"
        @retry="reloadAll"
      />

      <SuperAdminMetricListCard
        title="Top Paths"
        :items="summary?.top_paths ?? []"
        :loading="loading.summary"
        :error="errors.summary"
        error-title="Path analytics are unavailable."
        empty-message="No path activity yet."
        @retry="reloadAll"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <SuperAdminTopProducts
        :items="topMetrics?.top_viewed_products ?? []"
        :loading="loading.topMetrics"
        :error="errors.topMetrics"
        @retry="reloadAll"
      />
      <SuperAdminTopShops
        :items="topMetrics?.top_viewed_shops ?? []"
        :loading="loading.topMetrics"
        :error="errors.topMetrics"
        @retry="reloadAll"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <SuperAdminMetricListCard
        title="Top Countries"
        :items="locationBreakdown?.countries ?? []"
        :loading="loading.locationBreakdown"
        :error="errors.locationBreakdown"
        error-title="Country analytics are unavailable."
        empty-message="No country data yet."
        @retry="reloadAll"
      />

      <SuperAdminMetricListCard
        title="Top Cities"
        :items="locationBreakdown?.cities ?? []"
        :loading="loading.locationBreakdown"
        :error="errors.locationBreakdown"
        error-title="City analytics are unavailable."
        empty-message="No city data yet."
        @retry="reloadAll"
      />
    </div>

    <SuperAdminLocationTable
      :data="locationBreakdown"
      :page="locationPage"
      :loading="loading.locationBreakdown"
      :error="errors.locationBreakdown"
      @update:page="locationPage = $event"
      @retry="reloadAll"
    />

    <SuperAdminErrorPanel
      :data="errorAnalytics"
      :loading="loading.errorAnalytics"
      :error="errors.errorAnalytics"
      @retry="reloadAll"
    />
  </div>
</template>

<script setup lang="ts">
import { useSuperAdminAnalytics } from '~/composables/useSuperAdminAnalytics'
import type { AnalyticsInterval, AnalyticsRange } from '~/services/adminAnalytics'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'super-admin'],
})

const selectedRange = ref<AnalyticsRange>('7d')
const selectedInterval = ref<AnalyticsInterval>('day')
const locationPage = ref(1)
const hasLoaded = ref(false)
const syncWatchLocked = ref(false)

const {
  summary,
  timeSeries,
  topMetrics,
  funnel,
  locationBreakdown,
  errorAnalytics,
  loading,
  errors,
  isLoading,
  error,
  getSummary,
  getTimeSeries,
  getTopMetrics,
  getFunnel,
  getLocationBreakdown,
  getErrorAnalytics,
} = useSuperAdminAnalytics()

const isInitialLoading = computed(() => !hasLoaded.value && isLoading.value)
const hasBlockingError = computed(() => !isInitialLoading.value && !hasAnyData.value && Boolean(error.value))
const hasAnyData = computed(() => Boolean(
  summary.value
  || timeSeries.value
  || topMetrics.value
  || funnel.value
  || locationBreakdown.value
  || errorAnalytics.value
))

const currentRangeLabel = computed(() => {
  const labels: Record<AnalyticsRange, string> = {
    today: 'Today',
    '7d': '7 days',
    '30d': '30 days',
    '90d': '90 days',
  }
  return labels[selectedRange.value]
})

async function loadOverview() {
  await Promise.all([
    getSummary(),
    getTimeSeries({ range: selectedRange.value, interval: selectedInterval.value }),
    getTopMetrics(),
    getFunnel({ range: selectedRange.value }),
    getErrorAnalytics(),
  ])

  if (timeSeries.value?.interval && timeSeries.value.interval !== selectedInterval.value) {
    syncWatchLocked.value = true
    selectedInterval.value = timeSeries.value.interval
    await nextTick()
    syncWatchLocked.value = false
  }
}

async function loadLocations() {
  await getLocationBreakdown({ page: locationPage.value, page_size: 25 })
}

async function reloadAll() {
  await Promise.all([
    loadOverview(),
    loadLocations(),
  ])
  hasLoaded.value = true
}

watch([selectedRange, selectedInterval], async () => {
  if (syncWatchLocked.value) return
  locationPage.value = 1
  await reloadAll()
})

watch(locationPage, async () => {
  if (!hasLoaded.value) return
  await loadLocations()
})

onMounted(async () => {
  await reloadAll()
})
</script>
