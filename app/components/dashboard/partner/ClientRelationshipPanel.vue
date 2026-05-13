<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Client relationship</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Keep the client experience clear</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">
      Share one clear quote with the client while Printy coordinates production, updates, and delivery behind the scenes.
    </p>
    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock label="You can track" value="Estimate, markup, client price" caption="Everything you need to quote confidently." />
      <SafePriceBlock label="Printy handles" value="Production routing and updates" caption="The client gets one coordinated experience from quote to delivery." />
    </div>
  </article>
</template>

<script setup lang="ts">
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
</script>
