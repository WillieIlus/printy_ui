<template>
  <article class="rounded-[2rem] border border-slate-200 bg-[#101828] p-6 text-white shadow-[0_24px_50px_rgba(15,23,42,0.25)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">Managed estimate</p>
    <h3 class="mt-3 text-2xl font-semibold tracking-tight">{{ title }}</h3>
    <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{{ description }}</p>

    <div class="mt-6 grid gap-3 md:grid-cols-3">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Market range</p>
        <p class="mt-2 text-lg font-semibold">{{ rangeText }}</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Verified production options</p>
        <p class="mt-2 text-lg font-semibold">{{ routeCount }}</p>
      </div>
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Confidence</p>
        <p class="mt-2 text-lg font-semibold">{{ confidence }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  rangeText: string
  routeCount: string | number
  confidence: string
}>()
</script>
