<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center justify-between">
      <span class="flex items-center gap-1.5 text-sm font-medium text-[var(--p-text-dim)]">
        <UIcon :name="icon" class="h-4 w-4 text-[var(--p-text-muted)]" />
        {{ label }}
      </span>
      <span class="text-sm font-semibold text-[var(--p-text)]">
        <span :class="overLimit ? 'text-red-600 dark:text-red-400' : ''">{{ used }}</span>
        <span class="text-[var(--p-text-muted)]">{{ limitDisplay }}</span>
      </span>
    </div>

    <!-- Progress bar -->
    <div class="h-2 w-full overflow-hidden rounded-full bg-[var(--p-surface-sunken)]">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="barColor"
        :style="{ width: `${barWidth}%` }"
      />
    </div>

    <p v-if="overLimit" class="text-xs font-medium text-red-600 dark:text-red-400">
      Over limit — upgrade to expand
    </p>
  </div>
</template>

<script setup lang="ts">
import { useBilling } from '~/composables/useBilling'

const props = defineProps<{
  label: string
  icon: string
  used: number
  limit: number | null
}>()

const { usagePercent } = useBilling()

const overLimit = computed(() => props.limit !== null && props.used > props.limit)
const isUnlimited = computed(() => props.limit === null)
const percent = computed(() => usagePercent(props.used, props.limit))
const barWidth = computed(() => isUnlimited.value ? Math.min(props.used * 5, 60) : percent.value)

const limitDisplay = computed(() => {
  if (isUnlimited.value) return ' / ∞'
  return ` / ${props.limit}`
})

const barColor = computed(() => {
  if (overLimit.value) return 'bg-red-500'
  if (isUnlimited.value) return 'bg-[var(--color-primary-600)]/60'
  if (percent.value >= 90) return 'bg-amber-500'
  if (percent.value >= 70) return 'bg-amber-400'
  return 'bg-[var(--color-primary-600)]'
})
</script>
