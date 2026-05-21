<template>
  <BaseCard variant="dashboard" padding="none" radius="xl" class="overflow-hidden">
    <div class="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style="background:#e13515;">
          <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
          </svg>
        </div>
        <div>
          <p class="font-bold text-slate-900">{{ title }}</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <StatusBadge :status="status" :label="statusLabel" />
        <NuxtLink v-if="trackTo" :to="trackTo" class="text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800">
          View details ->
        </NuxtLink>
      </div>
    </div>

    <div class="px-6 py-8">
      <DashboardTimeline :items="timelineItems" :framed="false" class="px-2" />

      <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ stat.label }}</p>
          <p class="mt-2 text-base font-bold text-slate-900">{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'
import DashboardTimeline from '~/components/dashboard/DashboardTimeline.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'

interface TimelineItem {
  label: string
  done: boolean
  date: string
  circleClass: string
  dotClass: string
  labelClass: string
}

interface HeroStat {
  label: string
  value: string
}

defineProps<{
  title: string
  subtitle: string
  status?: string
  statusLabel: string
  trackTo?: string
  timelineItems: TimelineItem[]
  stats: HeroStat[]
}>()
</script>
