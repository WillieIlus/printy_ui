<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Turnaround</p>
    <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Managed timing</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">{{ value }}</p>
    <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
      Printy confirms the final production slot after artwork review, urgency checks, and assignment routing.
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  value: string
}>()
</script>
