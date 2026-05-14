<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Client relationship</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Keep the client experience clear</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">
      Share one clear quote with the client while Printy coordinates production, updates, and delivery behind the scenes.
    </p>
    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Relationship owner</p>
        <p class="mt-2 text-sm font-semibold text-slate-950">Partner-led client communication</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">You stay in front of the client while production coordination remains managed behind the scenes.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Production handoff</p>
        <p class="mt-2 text-sm font-semibold text-slate-950">Printy handles routing and updates</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">Production assignment, workflow tracking, and shop-side updates stay coordinated through Printy.</p>
      </div>
      <SafePriceBlock label="You can track" value="Estimate, markup, client price" caption="Everything you need to quote confidently." />
      <SafePriceBlock label="Protected from exposure" value="No direct shop exposure" caption="The partner view stays focused on the client relationship, quote, and progress." />
    </div>
  </article>
</template>

<script setup lang="ts">
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
</script>
