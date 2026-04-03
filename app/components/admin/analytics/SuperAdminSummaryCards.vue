<template>
  <div>
    <DashboardSkeletonState v-if="loading && !summary" variant="kpi" />

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <DashboardStatCard
        label="Visits Today"
        :value="formatNumber(summary?.total_visits_today ?? 0)"
        icon="i-lucide-mouse-pointer-click"
        variant="flamingo"
      />
      <DashboardStatCard
        label="Unique Visitors Today"
        :value="formatNumber(summary?.unique_visitors_today ?? 0)"
        icon="i-lucide-users"
        variant="green"
      />
      <DashboardStatCard
        label="Quote Requests Today"
        :value="formatNumber(summary?.quote_requests_today ?? 0)"
        icon="i-lucide-file-text"
        variant="orange"
      />
      <DashboardStatCard
        label="Conversion Rate"
        :value="formatPercent(summary?.quote_conversion_rate_today ?? 0)"
        icon="i-lucide-badge-percent"
        variant="default"
      />
      <DashboardStatCard
        label="Errors Today"
        :value="formatNumber(summary?.recent_errors_count ?? 0)"
        icon="i-lucide-triangle-alert"
        variant="flamingo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsSummary } from '~/services/adminAnalytics'

defineProps<{
  summary: AnalyticsSummary | null
  loading?: boolean
}>()

const numberFormatter = new Intl.NumberFormat('en-US')

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}
</script>
