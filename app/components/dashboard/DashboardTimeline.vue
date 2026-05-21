<template>
  <component :is="framed ? DashboardDetailPanel : 'div'" v-bind="framed ? { title, subtitle, padding: 'lg' } : {}">
    <div v-if="loading" class="text-sm text-slate-500">Loading...</div>
    <DashboardEmptyState v-else-if="!items.length" :title="emptyTitle" />
    <div v-else class="relative flex items-start justify-between gap-2">
      <div class="absolute left-[10%] right-[10%] top-4 z-0 h-0.5 bg-slate-200"></div>
      <div class="absolute left-[10%] top-4 z-0 h-0.5 bg-green-400" :style="{ width: `${progressWidth}%` }"></div>
      <div v-for="item in items" :key="item.label" class="z-10 flex flex-1 flex-col items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full ring-4" :class="item.circleClass">
          <svg v-if="item.done" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else class="h-2.5 w-2.5 rounded-full" :class="item.dotClass"></span>
        </div>
        <div class="text-center">
          <p class="text-xs font-bold" :class="item.labelClass">{{ item.label }}</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ item.date }}</p>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import DashboardDetailPanel from '~/components/dashboard/DashboardDetailPanel.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  items: Array<{
    label: string
    date: string
    done: boolean
    circleClass: string
    dotClass: string
    labelClass: string
  }>
  loading?: boolean
  emptyTitle?: string
  framed?: boolean
}>(), {
  title: '',
  subtitle: '',
  loading: false,
  emptyTitle: 'No timeline data yet.',
  framed: true,
})

const progressWidth = computed(() => {
  const completed = props.items.filter((item) => item.done).length
  return completed <= 1 ? 0 : Math.min(100, ((completed - 1) / (props.items.length - 1)) * 100)
})
</script>
