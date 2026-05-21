<template>
  <DashboardDetailPanel :title="title" :subtitle="subtitle" padding="md">
    <template #actions>
      <slot name="badge">
        <BaseBadge v-if="badge" :variant="badgeVariant">{{ badge }}</BaseBadge>
      </slot>
    </template>

    <div class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <slot />
      </div>
      <div v-if="showProgress" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p class="text-xs font-semibold text-slate-500">{{ progressLabel }}</p>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div class="h-2 rounded-full transition-all" :class="progressClass" :style="{ width: `${progressValue}%` }"></div>
        </div>
        <div class="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{{ progressText }}</span>
          <span v-if="progressMeta" class="font-semibold text-slate-600">{{ progressMeta }}</span>
        </div>
      </div>
    </div>
  </DashboardDetailPanel>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/base/BaseBadge.vue'
import DashboardDetailPanel from '~/components/dashboard/DashboardDetailPanel.vue'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  badge?: string
  badgeVariant?: 'default' | 'orange' | 'dark' | 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'verified' | 'pending' | 'accepted' | 'rejected' | 'active' | 'completed'
  showProgress?: boolean
  progressLabel?: string
  progressText?: string
  progressMeta?: string
  progressValue?: number
  progressClass?: string
}>(), {
  title: '',
  subtitle: '',
  badge: '',
  badgeVariant: 'green',
  showProgress: false,
  progressLabel: 'Status mirror',
  progressText: '',
  progressMeta: '',
  progressValue: 0,
  progressClass: 'bg-slate-400',
})
</script>
