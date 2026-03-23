<template>
  <DashboardSectionCard title="Top Searches" :col-span="12">
    <div v-if="loading && !items.length" class="space-y-3">
      <DashboardSkeletonState variant="block" />
    </div>
    <div v-else-if="error && !items.length" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">Search analytics are unavailable.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else-if="items.length" class="space-y-3">
      <div v-for="item in items" :key="item.label" class="space-y-1">
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="truncate text-[var(--p-text)]">{{ item.label }}</span>
          <span class="font-medium text-[var(--p-text-muted)]">{{ formatNumber(item.count) }}</span>
        </div>
        <div class="h-2 rounded-full bg-[var(--p-surface-sunken)]">
          <div class="h-2 rounded-full bg-emerald-500" :style="{ width: `${scaledWidth(item.count)}%` }" />
        </div>
      </div>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
      No search analytics yet.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsCountByLabel } from '~/services/adminAnalytics'

const props = defineProps<{
  items: AnalyticsCountByLabel[]
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')
const maxCount = computed(() => Math.max(...props.items.map(item => item.count), 1))

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function scaledWidth(value: number) {
  return Math.max(8, Math.round((value / maxCount.value) * 100))
}
</script>
