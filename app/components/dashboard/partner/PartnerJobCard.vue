<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <ManagedJobCard :job="job" counterparty-label="Partner-managed relationship" />
    <div class="mt-4 flex flex-wrap gap-2">
      <PaymentConfirmedBadge :status="job.payment_status || settlement?.status" />
    </div>
    <div class="mt-4 grid gap-3 md:grid-cols-4">
      <SafePriceBlock label="Production estimate" :value="formatWorkflowMoney(settlement?.production_amount)" caption="Managed production estimate shown to the partner." />
      <SafePriceBlock label="Your margin" :value="formatWorkflowMoney(settlement?.partner_commission)" caption="Tracked partner commission on this job." />
      <SafePriceBlock label="Client price" :value="formatWorkflowMoney(settlement?.client_total)" caption="Final client-facing total attached to the job." />
      <SafePriceBlock label="Payment state" :value="humanizeWorkflowValue(job.payment_status || settlement?.status)" caption="Payment confirmation state for this managed job." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobSettlementRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'
import PaymentConfirmedBadge from '~/components/workflow/PaymentConfirmedBadge.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { formatWorkflowMoney, humanizeWorkflowValue } from '~/utils/workflowUi'

defineProps<{
  job: ManagedJobRecord
  settlement?: JobSettlementRecord | null
}>()
</script>
