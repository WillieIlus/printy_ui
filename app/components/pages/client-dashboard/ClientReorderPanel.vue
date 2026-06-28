<template>
  <BaseCard :id="id" variant="dashboard" padding="none" radius="xl" class="flex h-full flex-col overflow-hidden">
    <div class="border-b border-slate-100 px-6 py-4">
      <p class="text-base font-bold text-slate-800">{{ title }}</p>
      <p class="mt-0.5 text-xs font-medium text-slate-400">{{ subtitle }}</p>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div
        v-for="item in items"
        :key="item.id"
        class="group cursor-pointer rounded-2xl border border-slate-200 p-4 transition-all hover:border-orange-300 hover:bg-[#fdf1ee]"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-orange-100">
              <svg class="h-5 w-5 text-slate-500 transition-colors group-hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800">{{ item.title }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ item.meta }}</p>
            </div>
          </div>
          <NuxtLink :to="item.reorderTo" class="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all group-hover:border-orange-400 group-hover:bg-[#e13515] group-hover:text-white">
            Reorder
          </NuxtLink>
        </div>
        <div class="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
          <span class="text-xs text-slate-400">Last ordered: <span class="font-medium text-slate-600">{{ item.lastOrdered }}</span></span>
          <span class="text-xs text-slate-400">.</span>
          <span class="text-xs text-slate-400">Job <span class="font-mono font-semibold text-slate-600">{{ item.reference }}</span></span>
        </div>
      </div>

      <div v-if="!items.length" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-sm font-semibold text-slate-700">{{ emptyTitle }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ emptyDescription }}</p>
      </div>

      <NuxtLink :to="historyTo" class="w-full pt-1 text-center text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800">
        {{ historyLabel }}
      </NuxtLink>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

interface ReorderItem {
  id: string | number
  title: string
  meta: string
  lastOrdered: string
  reference: string
  reorderTo: string
}

withDefaults(defineProps<{
  id?: string
  title?: string
  subtitle?: string
  items: ReorderItem[]
  emptyTitle?: string
  emptyDescription?: string
  historyTo: string
  historyLabel?: string
}>(), {
  id: '',
  title: 'Quick Reorder',
  subtitle: 'Repeat a previous job',
  emptyTitle: 'No completed jobs to reorder yet.',
  emptyDescription: 'Completed managed jobs will appear here automatically.',
  historyLabel: 'View all previous orders ->',
})
</script>
