<template>
  <DashboardSectionCard title="Filters" :col-span="12">
    <div class="grid gap-5 lg:grid-cols-2">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Range</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <UButton
            v-for="option in rangeOptions"
            :key="option.value"
            :variant="range === option.value ? 'solid' : 'soft'"
            :color="range === option.value ? 'primary' : 'neutral'"
            size="sm"
            @click="emit('update:range', option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Interval</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <UButton
            v-for="option in intervalOptions"
            :key="option.value"
            :variant="interval === option.value ? 'solid' : 'soft'"
            :color="interval === option.value ? 'primary' : 'neutral'"
            size="sm"
            @click="emit('update:interval', option.value)"
          >
            {{ option.label }}
          </UButton>
        </div>
      </div>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
type AnalyticsRange = 'today' | '7d' | '30d' | '90d'
type AnalyticsInterval = 'hour' | 'day' | 'week'

defineProps<{
  range: AnalyticsRange
  interval: AnalyticsInterval
}>()

const emit = defineEmits<{
  'update:range': [value: AnalyticsRange]
  'update:interval': [value: AnalyticsInterval]
}>()

const rangeOptions: Array<{ label: string; value: AnalyticsRange }> = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
]

const intervalOptions: Array<{ label: string; value: AnalyticsInterval }> = [
  { label: 'Hour', value: 'hour' },
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
]
</script>
