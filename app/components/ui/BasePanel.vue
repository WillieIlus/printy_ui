<!-- Purpose: Reusable surface wrapper for grouped content on tactile and default layouts. -->
<template>
  <section :class="panelClass">
    <slot />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'console' | 'display'
}>(), {
  variant: 'default',
})

const panelClass = computed(() => {
  const base = 'rounded-[1.6rem] border'
  const variants = {
    default: 'border-[color:color-mix(in_srgb,var(--p-border)_84%,transparent)] bg-[var(--p-surface)] shadow-[0_8px_18px_rgba(15,23,42,0.06)]',
    console: 'border-[color:color-mix(in_srgb,var(--p-border)_88%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_96%,white)] shadow-[0_10px_22px_rgba(15,23,42,0.07)]',
    display: 'border-[color:color-mix(in_srgb,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_srgb,var(--p-bg)_22%,var(--p-surface))] shadow-[0_12px_24px_rgba(15,23,42,0.09)]',
  }

  return [base, variants[props.variant]]
})
</script>
