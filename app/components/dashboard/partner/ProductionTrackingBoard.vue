<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production tracking</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Jobs by stage</h3>
    <div class="mt-5 grid gap-3 md:grid-cols-4">
      <SafePriceBlock label="Quoted" :value="String(quoted)" caption="Jobs still at quote or payment stage." />
      <SafePriceBlock label="Assigned" :value="String(assigned)" caption="Jobs already placed with production." />
      <SafePriceBlock label="In flight" :value="String(inFlight)" caption="Live jobs moving through production or finishing." />
      <SafePriceBlock label="Completed" :value="String(completed)" caption="Jobs finished and ready for payout release." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ManagedJobRecord } from '~/stores/workflowSpine'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'

const props = defineProps<{
  jobs: ManagedJobRecord[]
}>()

const quoted = computed(() => props.jobs.filter(job => ['quoted', 'awaiting_payment', 'payment_confirmed'].includes(String(job.status ?? ''))).length)
const assigned = computed(() => props.jobs.filter(job => ['assigned'].includes(String(job.status ?? ''))).length)
const inFlight = computed(() => props.jobs.filter(job => ['in_production', 'finishing', 'ready', 'delivered'].includes(String(job.status ?? ''))).length)
const completed = computed(() => props.jobs.filter(job => ['completed'].includes(String(job.status ?? ''))).length)
</script>
