<template>
  <div class="flex h-full flex-col justify-between gap-6">
    <div class="space-y-6">
      <div class="space-y-1.5">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Partner workspace</p>
        <h2 class="text-2xl font-semibold tracking-tight text-slate-950">Printy</h2>
        <p class="text-sm text-slate-500">Track sourced clients, quotes, jobs, and commission flow.</p>
      </div>

      <nav class="space-y-1">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          active-class="bg-primary-50 text-primary-700 ring-1 ring-primary-100"
        >
          <Icon :name="item.icon" class="size-4 shrink-0 opacity-60" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="flex size-5 items-center justify-center rounded-full bg-[var(--p-primary)] text-[10px] font-bold text-white"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </NuxtLink>
      </nav>
    </div>

    <div class="space-y-1 border-t border-slate-200 pt-4">
      <a
        href="/help"
        class="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
      >
        <Icon name="lucide:life-buoy" class="size-4 shrink-0 opacity-60" />
        <span>Help & support</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

const workflowStore = useWorkflowSpineStore()
const { managedJobs, partnerQuotes } = storeToRefs(workflowStore)

const openJobs = computed(() =>
  managedJobs.value.filter(job => !['completed', 'cancelled'].includes(String(job.status ?? ''))).length,
)

const items = computed(() => [
  { label: 'Overview', to: '/dashboard/partner', icon: 'lucide:layout-dashboard', badge: 0 },
  { label: 'Quotes', to: '/dashboard/partner', icon: 'lucide:file-text', badge: partnerQuotes.value.length || 0 },
  { label: 'Managed Jobs', to: '/dashboard/partner', icon: 'lucide:briefcase-business', badge: openJobs.value || 0 },
])
</script>
