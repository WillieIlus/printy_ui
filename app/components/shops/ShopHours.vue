<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Business hours</h3>
    </template>
    <p class="text-sm text-gray-600 dark:text-gray-400">Configure opening hours per day. Use the dashboard shop detail page to edit.</p>
    <div v-if="hours?.length" class="mt-4 space-y-2">
      <div v-for="h in hours" :key="h.id" class="flex justify-between items-center rounded-lg border dark:border-gray-700 px-3 py-2">
        <span class="font-medium text-gray-900 dark:text-white">{{ h.weekday_display ?? dayLabel(h.weekday) }}</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ h.is_closed ? 'Closed' : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}` }}</span>
      </div>
    </div>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { OpeningHours } from '~/shared/types'

/** Backend: 1=Mon, 2=Tue, ..., 7=Sun */
const WEEKDAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

defineProps<{ hours?: OpeningHours[] }>()

function dayLabel(weekday: number) {
  return WEEKDAYS[weekday] ?? `Day ${weekday}`
}

function formatTime(time: string | null) {
  if (!time) return '--'
  return time.length > 5 ? time.slice(0, 5) : time
}
</script>
