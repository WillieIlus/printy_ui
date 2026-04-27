<!-- Purpose: Section wrapper used across dashboard content areas. -->
<template>
  <BaseCard :tone="tone" class="space-y-5">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold tracking-tight">{{ title }}</h3>
        <p v-if="description" class="text-sm text-[var(--p-text-muted)]">{{ description }}</p>
      </div>
      <slot name="action" />
    </div>
    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'

withDefaults(defineProps<{
  title: string
  description?: string
  tone?: 'default' | 'muted' | 'dark'
}>(), {
  description: '',
  tone: 'default',
})
</script>
