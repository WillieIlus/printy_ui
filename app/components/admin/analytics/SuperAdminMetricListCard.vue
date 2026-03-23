<template>
  <DashboardSectionCard :title="title" :col-span="12">
    <div v-if="loading && !items.length" class="space-y-3">
      <DashboardSkeletonState variant="block" />
    </div>
    <div v-else-if="error && !items.length" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">{{ errorTitle }}</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else-if="items.length" class="space-y-3">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3"
      >
        <span class="truncate text-sm text-[var(--p-text)]">{{ item.label }}</span>
        <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ formatNumber(item.count) }}</span>
      </div>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-center text-sm text-[var(--p-text-muted)]">
      {{ emptyMessage }}
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsCountByLabel } from '~/services/adminAnalytics'

defineProps<{
  title: string
  items: AnalyticsCountByLabel[]
  loading?: boolean
  error?: string | null
  errorTitle?: string
  emptyMessage: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')

function formatNumber(value: number) {
  return numberFormatter.format(value)
}
</script>
