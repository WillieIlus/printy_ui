<!-- Purpose: Color-coded badge/pill atom for labels, statuses, and counts. -->
<template>
  <span :class="classes">
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'ghost'
  size?: 'sm' | 'md'
}>(), {
  variant: 'neutral',
  size: 'sm',
})

const classes = computed(() => {
  const base = 'inline-flex items-center gap-1 rounded-full border font-medium'
  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }
  const variants: Record<string, string> = {
    primary: 'border-[var(--p-primary-border)] bg-[var(--p-primary-soft)] text-[var(--p-primary-hover)]',
    secondary: 'border-[var(--p-border-strong)] bg-[var(--p-secondary-soft)] text-[var(--p-secondary-hover)]',
    success: 'border-transparent bg-[var(--p-success-soft)] text-[var(--p-success)]',
    error: 'border-transparent bg-[var(--p-error-soft)] text-[var(--p-error)]',
    warning: 'border-transparent bg-[var(--p-warning-soft)] text-[var(--p-warning)]',
    info: 'border-transparent bg-[var(--p-info-soft)] text-[var(--p-info)]',
    neutral: 'border-[var(--p-border)] bg-[var(--p-bg-soft)] text-[var(--p-text-muted)]',
    ghost: 'border-[var(--p-border)] bg-transparent text-[var(--p-text-muted)]',
  }
  return [base, sizes[props.size], variants[props.variant]]
})
</script>
