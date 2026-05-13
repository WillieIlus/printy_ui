<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="space-y-2">
        <ParticipantProjectionLabel :label="label" icon="lucide:factory" />
        <div>
          <p class="text-lg font-semibold tracking-tight text-slate-950">{{ assignment.managed_reference || `Assignment #${assignment.id}` }}</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{{ humanizeWorkflowValue(assignment.managed_job_status) }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <OperationalPriorityBadge v-if="assignment.urgency_label || assignment.operational_priority_level" :label="assignment.urgency_label" :level="assignment.operational_priority_level" />
        <span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold" :class="workflowToneClass(assignment.workflow_projection?.tone)">
          {{ humanizeWorkflowValue(assignment.status) }}
        </span>
      </div>
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Payment state" :value="humanizeWorkflowValue(assignment.managed_job_payment_status)" caption="Shows whether payment has been confirmed for production." />
      <SafePriceBlock label="Deadline" :value="formatWorkflowDate(assignment.due_at || assignment.requested_deadline)" caption="Use this operational deadline for proof and production planning." />
      <SafePriceBlock label="Job status" :value="workflowHeadline(assignment.workflow_projection, humanizeWorkflowValue(assignment.managed_job_status))" caption="Current job stage linked to this assignment." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobAssignmentRecord } from '~/stores/workflowSpine'
import OperationalPriorityBadge from '~/components/workflow/OperationalPriorityBadge.vue'
import ParticipantProjectionLabel from '~/components/workflow/ParticipantProjectionLabel.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import {
  formatWorkflowDate,
  humanizeWorkflowValue,
  workflowHeadline,
  workflowToneClass,
} from '~/utils/workflowUi'

withDefaults(defineProps<{
  assignment: JobAssignmentRecord
  label?: string
}>(), {
  label: 'Production assignment',
})
</script>
