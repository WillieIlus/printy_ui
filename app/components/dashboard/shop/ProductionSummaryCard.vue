<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production summary</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Operational brief</h3>
    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Assignment" :value="humanizeWorkflowValue(assignment.status)" caption="Current production state for this assignment." />
      <SafePriceBlock label="Job payment" :value="humanizeWorkflowValue(assignment.managed_job_payment_status)" caption="Shows whether payment has been confirmed." />
      <SafePriceBlock label="Deadline" :value="formatWorkflowDate(assignment.due_at || assignment.requested_deadline)" caption="Current deadline for this assignment." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobAssignmentRecord } from '~/stores/workflowSpine'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { formatWorkflowDate, humanizeWorkflowValue } from '~/utils/workflowUi'

defineProps<{
  assignment: JobAssignmentRecord
}>()
</script>
