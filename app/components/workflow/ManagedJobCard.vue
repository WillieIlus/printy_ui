<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="space-y-2">
        <ParticipantProjectionLabel :label="counterpartyLabel" />
        <div>
          <p class="text-lg font-semibold tracking-tight text-slate-950">{{ job.title || job.managed_reference || `Job #${job.id}` }}</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{{ job.managed_reference || `Job #${job.id}` }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <OperationalPriorityBadge v-if="job.urgency_label || job.operational_priority_level" :label="job.urgency_label" :level="job.operational_priority_level" />
        <span class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold" :class="workflowToneClass(job.workflow_projection?.tone)">
          {{ workflowHeadline(job.workflow_projection, humanizeWorkflowValue(job.status)) }}
        </span>
      </div>
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Payment" :value="humanizeWorkflowValue(job.payment_status)" caption="Current payment state for this job." />
      <SafePriceBlock label="Assignment" :value="humanizeWorkflowValue(job.assignment_status)" caption="Shows whether production has already been assigned." />
      <SafePriceBlock label="Updated" :value="formatWorkflowDate(job.updated_at || job.created_at)" caption="Latest update on this job." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ManagedJobRecord } from '~/stores/workflowSpine'
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
  job: ManagedJobRecord
  counterpartyLabel?: string
}>(), {
  counterpartyLabel: 'Managed by Printy',
})
</script>
