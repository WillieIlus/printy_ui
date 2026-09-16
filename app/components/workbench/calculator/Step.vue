<script setup lang="ts">
defineProps<{ n: string; title: string; hint?: string; value?: string }>()
</script>

<template>
  <section class="calc-step relative border-t pt-6 first:border-t-0 first:pt-0" style="border-color: var(--line)">
    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span class="font-mono2 text-[10px] font-semibold tracking-[0.2em]" style="color: var(--accent)">{{ n }}</span>
      <h3 class="font-disp text-[17px] font-bold tracking-tight">{{ title }}</h3>
      <span v-if="value" class="ml-auto max-w-[55%] truncate font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ value }}</span>
    </div>
    <p v-if="hint" class="mt-1 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ hint }}</p>
    <div class="mt-3.5"><slot /></div>
  </section>
</template>