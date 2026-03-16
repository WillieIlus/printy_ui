<template>
  <div class="rounded-lg border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/30 px-4 py-2">
    <p class="text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5">Working hours</p>
    <div class="space-y-1">
      <div
        v-for="h in hours"
        :key="h.id"
        class="flex justify-between text-sm"
      >
        <span class="text-stone-600 dark:text-stone-400">{{ h.weekday_display ?? dayLabel(h.weekday) }}</span>
        <span class="text-stone-700 dark:text-stone-300 tabular-nums">
          {{ h.is_closed ? 'Closed' : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OpeningHoursPublic } from '~/shared/types'

const props = defineProps<{ hours: OpeningHoursPublic[] }>()

const WEEKDAYS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
}

function dayLabel(weekday: number) {
  return WEEKDAYS[weekday] ?? `Day ${weekday}`
}

function formatTime(time: string | null) {
  if (!time) return '--'
  return time.length > 5 ? time.slice(0, 5) : time
}
</script>
