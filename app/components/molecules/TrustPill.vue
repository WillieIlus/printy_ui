<!-- Purpose: Small trust indicator pill for shops – verified, rating, turnaround, etc. -->
<template>
  <span class="inline-flex items-center gap-1 rounded-full bg-[var(--p-surface-container)] px-2.5 py-1 text-xs font-medium text-[var(--p-text-muted)]">
    <Icon v-if="verified" name="lucide:shield-check" class="size-3.5 text-green-500" />
    <Icon v-else-if="icon" :name="icon" class="size-3.5" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  icon?: string
  verified?: boolean
}>(), {})
</script>
