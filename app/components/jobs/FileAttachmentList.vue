<template>
  <DashboardDetailPanel :title="title" :subtitle="subtitle" padding="none">
    <template #actions>
      <slot name="actions">
        <BaseBadge v-if="badge" :variant="badgeVariant">{{ badge }}</BaseBadge>
      </slot>
    </template>

    <div class="divide-y divide-slate-100">
      <div v-for="file in files" :key="file.id" class="px-5 py-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-slate-800">{{ file.name }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ file.meta }}</p>
            <p v-if="file.notes" class="mt-2 text-xs leading-relaxed text-slate-500">{{ file.notes }}</p>
          </div>
          <div class="shrink-0 text-right">
            <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" :class="file.badgeClass">{{ file.badge }}</span>
            <a v-if="file.url" :href="file.url" target="_blank" rel="noreferrer" class="mt-2 block text-xs font-semibold text-[#e13515] hover:underline">Download</a>
          </div>
        </div>
      </div>
      <div v-if="!files.length" class="px-5 py-6 text-sm text-slate-500">
        {{ emptyText }}
      </div>
    </div>

    <div v-if="$slots.footer" class="border-t border-slate-100 bg-slate-50 px-5 py-4">
      <slot name="footer" />
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
  emptyText?: string
  files: Array<{
    id: string | number
    name: string
    meta: string
    notes?: string
    badge: string
    badgeClass: string
    url?: string | null
  }>
}>(), {
  title: '',
  subtitle: '',
  badge: '',
  badgeVariant: 'orange',
  emptyText: 'No files available.',
})
</script>
