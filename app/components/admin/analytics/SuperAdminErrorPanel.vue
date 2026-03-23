<template>
  <div class="grid gap-6 xl:grid-cols-2">
    <DashboardSectionCard title="Latest Errors" :col-span="12">
      <div v-if="loading && !data" class="space-y-3">
        <DashboardSkeletonState variant="block" />
      </div>
      <div v-else-if="data?.latest_errors?.results?.length" class="space-y-3">
        <div v-for="item in data.latest_errors.results" :key="item.id" class="rounded-xl border border-[var(--p-border-dim)] p-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-[var(--p-text)]">{{ item.path || 'Unknown path' }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ item.event_type }} | {{ item.status_code ?? 'unknown' }} | {{ formatDateTime(item.created_at) }}</p>
            </div>
            <UBadge color="error" variant="soft">{{ item.status_code ?? 'n/a' }}</UBadge>
          </div>
          <p class="mt-3 text-sm text-[var(--p-text-dim)]">{{ item.message || 'No error message captured.' }}</p>
        </div>
      </div>
      <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
        No recent errors captured.
      </div>
    </DashboardSectionCard>

    <DashboardSectionCard title="Grouped Error Counts" :col-span="12">
      <div v-if="loading && !data" class="space-y-3">
        <DashboardSkeletonState variant="block" />
      </div>
      <div v-else-if="error && !data" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
        <p class="text-sm font-medium text-[var(--p-text)]">Error analytics are unavailable.</p>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
        <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
          Retry
        </UButton>
      </div>
      <div v-else-if="data" class="space-y-5">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">By path</p>
          <div class="space-y-2">
            <div v-for="item in data.counts_by_path" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
              <span class="truncate text-sm text-[var(--p-text)]">{{ item.label }}</span>
              <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ formatNumber(item.count) }}</span>
            </div>
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">By status code</p>
            <div class="space-y-2">
              <div v-for="item in data.counts_by_status_code" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
                <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
                <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ formatNumber(item.count) }}</span>
              </div>
            </div>
          </div>
          <div>
            <p class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">By event type</p>
            <div class="space-y-2">
              <div v-for="item in data.counts_by_event_type" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
                <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
                <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ formatNumber(item.count) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
        No grouped error counts yet.
      </div>
    </DashboardSectionCard>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsErrorsResponse } from '~/services/adminAnalytics'

defineProps<{
  data: AnalyticsErrorsResponse | null
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatDateTime(value: string | null) {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}
</script>
