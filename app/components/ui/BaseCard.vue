<!-- Purpose: Reusable surface wrapper with consistent rounded panel styling. -->
<template>
  <section :class="cardClass">
    <slot />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'default' | 'muted' | 'soft' | 'dark' | 'elevated'
  padded?: boolean
}>(), {
  tone: 'default',
  padded: true,
})

const cardClass = computed(() => {
  const tones = {
    default: 'bg-[var(--p-surface)] text-[var(--p-text)] ring-1 ring-[var(--p-border)] shadow-[var(--shadow-control)]',
    muted: 'bg-[var(--p-surface-soft)] text-[var(--p-text)] ring-1 ring-[var(--p-border)]',
    soft: 'bg-[var(--p-surface-soft)] text-[var(--p-text)] ring-1 ring-[var(--p-border)]',
    dark: 'bg-[var(--p-surface-dark)] text-[var(--p-text-on-dark)] ring-1 ring-[var(--p-border)] shadow-[var(--shadow-panel)]',
    elevated: 'bg-[var(--p-surface)] text-[var(--p-text)] ring-1 ring-[var(--p-border)] shadow-[var(--shadow-panel)]',
  }

  return [
    'rounded-[1.75rem] backdrop-blur-sm',
    tones[props.tone],
    props.padded ? 'p-6 md:p-7' : '',
  ]
})
</script>
