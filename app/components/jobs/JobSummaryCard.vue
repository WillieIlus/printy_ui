<template>
  <BaseCard variant="dashboard" padding="md" radius="xl" class="h-full">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate text-sm font-bold text-slate-800">{{ title }}</p>
        <p v-if="subtitle" class="mt-1 text-xs text-slate-400">{{ subtitle }}</p>
      </div>
      <StatusBadge v-if="status" :status="status" />
    </div>
    <div v-if="meta.length" class="mt-4 space-y-2">
      <div v-for="item in meta" :key="item.label" class="flex items-center justify-between gap-3 text-xs">
        <span class="text-slate-400">{{ item.label }}</span>
        <span class="font-semibold text-slate-700">{{ item.value }}</span>
      </div>
    </div>
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  status?: string
  meta?: Array<{ label: string, value: string }>
}>(), {
  subtitle: '',
  status: '',
  meta: () => [],
})
</script>
