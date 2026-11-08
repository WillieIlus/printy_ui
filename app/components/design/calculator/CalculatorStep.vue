<script setup lang="ts">
/**
 * Design-styled calculator step, ported from the design's CalculatorStep card
 * (number badge, title, helper and chosen value). Presentational only: it keeps
 * the existing Printy Step props so the calculator template can swap it in.
 */
defineProps<{
  n: string
  title: string
  hint?: string
  value?: string
}>()
</script>

<template>
  <section class="crop-marks relative overflow-hidden rounded-2xl border border-line bg-card p-5 shadow-card">
    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span class="tabular flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-mint px-2 font-mono text-[11px] font-bold text-brand-deep">
        {{ n }}
      </span>
      <h3 class="text-[15px] font-semibold tracking-tight text-ink">
        {{ title }}
      </h3>
      <span v-if="value" class="ml-auto max-w-[55%] truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
        {{ value }}
      </span>
    </div>
    <p v-if="hint" class="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
      {{ hint }}
    </p>
    <div class="mt-4">
      <slot />
    </div>
  </section>
</template>
