<template>
  <DashboardDetailPanel :title="title" :subtitle="subtitle" padding="none">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <BaseAlert v-if="error" variant="error" :message="error" class="m-5" />
    <div v-else-if="loading" class="px-5 py-6 text-sm text-slate-500">Loading...</div>
    <div v-else-if="!items.length" class="p-5">
      <DashboardEmptyState :title="emptyTitle" :description="emptyDescription" />
    </div>
    <div v-else class="space-y-4 p-5">
      <template v-for="item in items" :key="item.id">
        <slot name="item" :item="item">
          <div class="flex gap-3">
            <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" :style="{ background: item.avatarColor || '#e13515' }">
              {{ item.initials }}
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-xs font-bold text-slate-700">{{ item.title }}</p>
                <p class="text-xs text-slate-400">{{ item.meta }}</p>
              </div>
              <div class="mt-1 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
                <p class="text-sm leading-relaxed text-slate-700">{{ item.body }}</p>
              </div>
            </div>
          </div>
        </slot>
      </template>
    </div>
  </DashboardDetailPanel>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import DashboardDetailPanel from '~/components/dashboard/DashboardDetailPanel.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  items: Array<Record<string, any>>
  loading?: boolean
  error?: string
  emptyTitle?: string
  emptyDescription?: string
}>(), {
  title: '',
  subtitle: '',
  loading: false,
  error: '',
  emptyTitle: 'No updates yet.',
  emptyDescription: '',
})
</script>
