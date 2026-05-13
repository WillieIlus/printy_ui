<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Workflow board</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">Queue by production state</h3>
      </div>
      <span class="text-xs font-semibold text-slate-500">Factory view</span>
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-4">
      <article
        v-for="column in columns"
        :key="column.label"
        class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ column.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-slate-950">{{ column.count }}</p>
        <p class="mt-2 text-sm text-slate-500">{{ column.helper }}</p>
      </article>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobAssignmentRecord } from '~/stores/workflowSpine'

const props = defineProps<{
  assignments: JobAssignmentRecord[]
}>()

const columns = computed(() => [
  { label: 'Queued', count: props.assignments.filter(item => String(item.status ?? '') === 'pending').length, helper: 'Awaiting production acceptance.' },
  { label: 'Accepted', count: props.assignments.filter(item => String(item.status ?? '') === 'accepted').length, helper: 'Accepted and scheduled.' },
  { label: 'In production', count: props.assignments.filter(item => String(item.status ?? '') === 'in_production').length, helper: 'Live on the production floor.' },
  { label: 'Ready', count: props.assignments.filter(item => ['ready', 'completed'].includes(String(item.status ?? ''))).length, helper: 'Ready for release or already completed.' },
])
</script>
