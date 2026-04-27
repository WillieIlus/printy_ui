<!-- Purpose: Compact metric card for dashboard overview grids. -->
<template>
  <BaseCard :tone="tone" class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm font-medium text-[var(--p-text-muted)]">{{ label }}</p>
      <BaseBadge :tone="badgeTone">{{ trend }}</BaseBadge>
    </div>
    <div class="space-y-1">
      <p class="text-3xl font-semibold tracking-tight">{{ value }}</p>
      <p class="text-sm text-[var(--p-text-muted)]">{{ helper }}</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

withDefaults(defineProps<{
  label: string
  value: string
  helper: string
  trend: string
  badgeTone?: 'primary' | 'neutral' | 'success' | 'dark'
  tone?: 'default' | 'muted' | 'dark'
}>(), {
  badgeTone: 'neutral',
  tone: 'default',
})
</script>
