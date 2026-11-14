<script setup lang="ts">
/**
 * The one numbered workflow card used by the calculator.
 *
 * It is the exact card from the homepage quote workflow: number badge, mono
 * eyebrow, selected-value chip and the controls below. Both the universal
 * calculator and the legacy detailed calculator render this component, so a
 * future change to the homepage card automatically reaches every calculator.
 */
withDefaults(defineProps<{
  n: string
  label?: string
  title?: string
  hint?: string
  value?: string
}>(), {
  label: undefined,
  title: undefined,
  hint: undefined,
  value: undefined,
})
</script>

<template>
  <section class="rounded-2xl border border-line bg-card px-5 py-4 shadow-card">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
        <span class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">
          {{ n }}
        </span>
        {{ label ?? title }}
      </p>
      <span v-if="value" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">
        {{ value }}
      </span>
    </div>
    <p v-if="hint" class="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
      {{ hint }}
    </p>
    <div class="mt-2">
      <slot />
    </div>
  </section>
</template>
