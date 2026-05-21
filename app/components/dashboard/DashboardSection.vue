<template>
  <BaseCard variant="dashboard" padding="none" radius="xl" class="overflow-hidden">
    <div v-if="title || subtitle || $slots.actions" class="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
      <div>
        <p v-if="title" class="text-base font-bold text-slate-900">{{ title }}</p>
        <p v-if="subtitle" class="mt-0.5 text-xs font-medium text-slate-400">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

defineProps<{
  title?: string
  subtitle?: string
}>()
</script>
