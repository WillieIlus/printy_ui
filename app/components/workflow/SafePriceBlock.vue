<template>
  <article class="rounded-[1.6rem] border border-slate-200/90 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{{ value }}</p>
    <p v-if="caption" class="mt-2 text-sm leading-6 text-slate-500">{{ caption }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  caption?: string
}>()
</script>
