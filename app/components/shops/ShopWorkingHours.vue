<template>
  <div class="rounded-lg border border-white/12 bg-white/10 px-4 py-2 backdrop-blur-sm dark:border-[var(--p-border)] dark:bg-[var(--p-surface-container-low)]/70">
    <p class="mb-1.5 text-xs font-medium text-white/72 dark:text-[var(--p-text-muted)]">Working hours</p>
    <div class="space-y-1">
      <div
        v-for="h in hours"
        :key="h.id"
        class="flex justify-between text-sm"
      >
        <span class="text-white/72 dark:text-[var(--p-text-muted)]">{{ h.weekday_display ?? dayLabel(h.weekday) }}</span>
        <span class="tabular-nums text-white/92 dark:text-[var(--p-text-dim)]">
          {{ h.is_closed ? 'Closed' : `${formatTime(h.from_hour)} – ${formatTime(h.to_hour)}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OpeningHoursPublic } from '~/shared/types'

defineProps<{ hours: OpeningHoursPublic[] }>()

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
