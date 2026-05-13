<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Operational load</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Utilization proxy</h3>
    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Priority work" :value="String(priorityCount)" caption="Assignments with elevated urgency handling." />
      <SafePriceBlock label="Waiting action" :value="String(waitingCount)" caption="Assignments still awaiting a production decision." />
      <SafePriceBlock label="Live floor" :value="String(liveCount)" caption="Assignments currently marked in production." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobAssignmentRecord } from '~/stores/workflowSpine'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'

const props = defineProps<{
  assignments: JobAssignmentRecord[]
}>()

const priorityCount = computed(() => props.assignments.filter(item => Number(item.operational_priority_level ?? 1) > 1).length)
const waitingCount = computed(() => props.assignments.filter(item => ['pending', 'accepted'].includes(String(item.status ?? ''))).length)
const liveCount = computed(() => props.assignments.filter(item => String(item.status ?? '') === 'in_production').length)
</script>
