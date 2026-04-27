<!-- Purpose: Reusable badge primitive for status and highlight labels. -->
<template>
  <span :class="badgeClass">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'dark'
}>(), {
  tone: 'neutral',
})

const badgeClass = computed(() => {
  const tones = {
    primary: 'border-[var(--p-primary-border)] bg-[var(--p-primary-soft)] text-[var(--p-primary-hover)]',
    secondary: 'border-[var(--p-border-strong)] bg-[var(--p-secondary-soft)] text-[var(--p-secondary-hover)]',
    neutral: 'border-[var(--p-border)] bg-[var(--p-bg-soft)] text-[var(--p-text-muted)]',
    success: 'border-transparent bg-[var(--p-success-soft)] text-[var(--p-success)]',
    warning: 'border-transparent bg-[var(--p-warning-soft)] text-[var(--p-warning)]',
    error: 'border-transparent bg-[var(--p-error-soft)] text-[var(--p-error)]',
    info: 'border-transparent bg-[var(--p-info-soft)] text-[var(--p-info)]',
    dark: 'border-[var(--p-border)] bg-[var(--p-surface-dark)] text-[var(--p-text-on-dark)]',
  }

  return ['inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold', tones[props.tone]]
})
</script>
