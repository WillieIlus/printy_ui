<template>
  <div v-if="summary && summary.count > 0" class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
    <UIcon name="i-lucide-star" class="h-4 w-4 fill-current" />
    <span class="text-sm font-medium tabular-nums">{{ formatRating(summary.average) }}</span>
    <span class="text-xs text-stone-500 dark:text-stone-400">({{ summary.count }})</span>
  </div>
</template>

<script setup lang="ts">
import type { RatingSummary } from '~/services/ratings'

defineProps<{ summary: RatingSummary | null }>()

function formatRating(avg: number): string {
  return avg.toFixed(1)
}
</script>
