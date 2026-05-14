<template>
  <div class="flex h-full flex-col justify-between gap-6">
    <div class="space-y-6">
      <div class="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Partner mode</p>
        <h2 class="mt-3 text-2xl font-semibold tracking-tight">Operate quotes, jobs, and margin with clarity.</h2>
        <p class="mt-3 text-sm leading-6 text-slate-300">
          Built for agencies, sourcing teams, and hybrid operators managing client demand and production handoff.
        </p>
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

      <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Margin visibility</p>
        <p class="mt-3 text-sm leading-6 text-slate-600">
          Partners can see the production estimate, their margin, and the client-facing total while Printy keeps the production chain coordinated in the background.
        </p>
      </div>
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
  { label: 'Quick Quote', to: '/dashboard/partner#quote-builder', icon: 'lucide:square-pen', badge: 0 },
  { label: 'Managed Jobs', to: '/dashboard/partner#managed-jobs', icon: 'lucide:briefcase-business', badge: openJobs.value || 0 },
  { label: 'Earnings', to: '/dashboard/partner#earnings', icon: 'lucide:badge-dollar-sign', badge: 0 },
  { label: 'Quotes', to: '/dashboard/partner#partner-quotes', icon: 'lucide:file-text', badge: partnerQuotes.value.length || 0 },
])
</script>
