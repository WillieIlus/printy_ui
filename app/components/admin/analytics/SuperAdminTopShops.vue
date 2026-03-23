<template>
  <DashboardSectionCard title="Top Viewed Shops" :col-span="12">
    <div v-if="loading && !items.length" class="space-y-3">
      <DashboardSkeletonState variant="block" />
    </div>
    <div v-else-if="error && !items.length" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">Shop view analytics are unavailable.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else-if="items.length" class="space-y-3">
      <div v-for="item in items" :key="`${item.label}-${item.slug}`" class="rounded-xl border border-[var(--p-border-dim)] p-3">
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-[var(--p-text)]">{{ item.label }}</p>
            <p class="truncate text-xs text-[var(--p-text-muted)]">{{ item.path || item.slug || 'No path captured' }}</p>
          </div>
          <UBadge color="neutral" variant="soft">{{ formatNumber(item.count) }}</UBadge>
        </div>
      </div>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
      No shop views recorded yet.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsNamedMetric } from '~/services/adminAnalytics'

defineProps<{
  items: AnalyticsNamedMetric[]
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
</script>
