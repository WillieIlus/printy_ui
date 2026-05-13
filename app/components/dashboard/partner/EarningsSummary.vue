<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Earnings</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Markup and commission</h3>
    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <SafePriceBlock label="Quoted markup" :value="quotedMarkup" caption="Markup attached to sourced quotes." />
      <SafePriceBlock label="Tracked commission" :value="trackedCommission" caption="Commission recorded on completed jobs." />
      <SafePriceBlock label="Release-ready jobs" :value="String(releaseReady)" caption="Jobs that are ready for payout release after completion." />
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
