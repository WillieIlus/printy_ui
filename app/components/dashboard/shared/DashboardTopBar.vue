<!-- Purpose: Shared top bar for dashboard layouts and pages. -->
<template>
  <div class="flex flex-col gap-4 border-b border-[var(--p-border)] pb-5 md:flex-row md:items-center md:justify-between">
    <div class="space-y-1">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--p-secondary)]">{{ eyebrow }}</p>
      <h1 class="text-2xl font-semibold tracking-tight text-[var(--p-text)] md:text-3xl">{{ title }}</h1>
      <p class="max-w-2xl text-sm text-[var(--p-text-muted)]">{{ description }}</p>
    </div>
    <div class="flex items-center gap-3">
      <BaseButton variant="secondary" size="sm" @click="emit('help')">Need help</BaseButton>
      <BaseButton v-if="actionLabel" variant="primary" size="sm" @click="emit('action')">{{ actionLabel }}</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description: string
  actionLabel?: string
}>(), {
  eyebrow: 'Dashboard',
  actionLabel: undefined,
})

const emit = defineEmits<{
  action: []
  help: []
}>()
</script>
