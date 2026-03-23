<template>
  <DashboardSectionCard title="Quote Funnel" :col-span="12">
    <div v-if="loading && !data" class="space-y-3">
      <DashboardSkeletonState variant="block" />
    </div>
    <div v-else-if="error && !data" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">Funnel analytics are unavailable.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else-if="data" class="space-y-5">
      <div class="flex flex-col gap-3 rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
            Overall conversion
          </p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">
            {{ formatPercent(data.overall_conversion_rate) }}
          </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Range</p>
            <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ formatRange(data.range) }}</p>
          </div>
          <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Submits</p>
            <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ formatNumber(data.quote_submits) }}</p>
          </div>
        </div>
      </div>

      <div class="grid gap-3 lg:grid-cols-5">
        <div
          v-for="stage in data.stages"
          :key="stage.key"
          class="rounded-2xl border border-[var(--p-border-dim)] bg-[var(--p-surface)] p-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
                {{ stage.label }}
              </p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">
                {{ formatNumber(stage.count) }}
              </p>
            </div>
            <UBadge
              :color="badgeColor(stage.conversion_from_previous)"
              variant="soft"
            >
              {{ stage.conversion_from_previous === null ? 'Start' : formatPercent(stage.conversion_from_previous) }}
            </UBadge>
          </div>
          <div class="mt-4 h-2 rounded-full bg-[var(--p-surface-sunken)]">
            <div
              class="h-2 rounded-full bg-sky-500 transition-[width] duration-300"
              :style="{ width: `${scaledWidth(stage.count)}%` }"
            />
          </div>
          <p class="mt-3 text-xs text-[var(--p-text-muted)]">
            {{ helperText(stage) }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
      No funnel activity has been recorded yet.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsFunnelResponse, AnalyticsFunnelStage } from '~/services/adminAnalytics'

const props = defineProps<{
  data: AnalyticsFunnelResponse | null
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')
const maxCount = computed(() => Math.max(...(props.data?.stages ?? []).map(stage => stage.count), 1))

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatRange(value: AnalyticsFunnelResponse['range']) {
  const labels: Record<AnalyticsFunnelResponse['range'], string> = {
    today: 'Today',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
  }

  return labels[value]
}

function scaledWidth(value: number) {
  return Math.max(10, Math.round((value / maxCount.value) * 100))
}

function badgeColor(value: number | null) {
  if (value === null) return 'neutral'
  if (value >= 50) return 'success'
  if (value >= 20) return 'warning'
  return 'error'
}

function helperText(stage: AnalyticsFunnelStage) {
  if (stage.conversion_from_previous === null) {
    return 'Top-of-funnel traffic entering the site.'
  }

  return `${formatPercent(stage.conversion_from_previous)} moved from the previous stage.`
}
</script>
