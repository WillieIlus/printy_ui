<template>
  <div class="rounded-lg border border-white/12 bg-white/10 px-4 py-2 backdrop-blur-sm dark:border-[var(--p-border)] dark:bg-[var(--p-surface-container-low)]/70">
    <p class="mb-1.5 text-xs font-medium text-white/72 dark:text-[var(--p-text-muted)]">{{ t('shop.workingHours') }}</p>
    <div class="space-y-1">
      <div
        v-for="h in hours"
        :key="h.id"
        class="flex justify-between text-sm"
      >
        <span class="text-white/72 dark:text-[var(--p-text-muted)]">{{ h.weekday_display ?? dayLabel(h.weekday) }}</span>
        <span class="tabular-nums text-white/92 dark:text-[var(--p-text-dim)]">
          {{ h.is_closed ? t('shop.closed') : `${formatTime(h.from_hour)} - ${formatTime(h.to_hour)}` }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { OpeningHoursPublic } from '~/shared/types'

defineProps<{ hours: OpeningHoursPublic[] }>()

const { t } = useI18n()

function dayLabel(weekday: number) {
  const weekdayKey = `weekdays.${weekday}`
  const translated = t(weekdayKey)
  return translated === weekdayKey ? t('shop.dayFallback', { day: weekday }) : translated
}

function formatTime(time: string | null) {
  if (!time) return '--'
  return time.length > 5 ? time.slice(0, 5) : time
}
</script>
