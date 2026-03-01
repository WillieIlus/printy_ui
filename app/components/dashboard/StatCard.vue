<template>
  <div
    class="group relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
  >
    <div class="flex items-start justify-between">
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        :class="iconBgClass"
      >
        <UIcon :name="icon" class="h-5 w-5" :class="iconColorClass" />
      </div>
      <span
        v-if="delta !== undefined && delta !== null"
        class="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="deltaClass"
      >
        <UIcon v-if="delta > 0" name="i-lucide-trending-up" class="h-3 w-3" />
        <UIcon v-else-if="delta < 0" name="i-lucide-trending-down" class="h-3 w-3" />
        {{ delta > 0 ? '+' : '' }}{{ delta }}%
      </span>
    </div>
    <p class="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
      {{ value }}
    </p>
    <p class="mt-0.5 text-sm font-medium text-gray-500 dark:text-gray-400">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: string
    delta?: number | null
    variant?: 'default' | 'flamingo' | 'green' | 'blue' | 'purple' | 'orange'
  }>(),
  { icon: 'i-lucide-bar-chart-2', variant: 'default' }
)

const iconBgClass = computed(() => {
  const map: Record<string, string> = {
    default: 'bg-gray-100 dark:bg-gray-700/50',
    flamingo: 'bg-flamingo-50 dark:bg-flamingo-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
  }
  return map[props.variant] ?? map.default
})

const iconColorClass = computed(() => {
  const map: Record<string, string> = {
    default: 'text-gray-600 dark:text-gray-400',
    flamingo: 'text-flamingo-600 dark:text-flamingo-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
  }
  return map[props.variant] ?? map.default
})

const deltaClass = computed(() => {
  if (props.delta === undefined || props.delta === null) return ''
  if (props.delta > 0) return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (props.delta < 0) return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
})
</script>
