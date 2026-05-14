<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Earnings</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Markup and commission</h3>
    <p class="mt-3 text-sm leading-6 text-slate-500">Monitor quoted margin, tracked commission, and which jobs are ready for payout release after completion.</p>
    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Quoted markup" :value="quotedMarkup" caption="Markup attached to sourced quotes." />
      <SafePriceBlock label="Tracked commission" :value="trackedCommission" caption="Commission recorded on completed jobs." />
      <SafePriceBlock label="Release-ready jobs" :value="String(releaseReady)" caption="Jobs that are ready for payout release after completion." />
    </div>
    <div class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <p class="text-sm font-semibold text-rose-700">Commission release stays tied to managed completion.</p>
      <p class="mt-2 text-sm leading-6 text-rose-700/90">
        Production payout and partner commission move only after the job is completed and confirmed inside the managed workflow.
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'

defineProps<{
  quotedMarkup: string
  trackedCommission: string
  releaseReady: number
}>()
</script>
