<!-- Purpose: Icon-only button atom. Always provide an aria-label for accessibility. -->
<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="label"
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  label: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'ghost' | 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  type: 'button',
  variant: 'ghost',
  size: 'md',
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
  const sizes: Record<string, string> = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-11',
  }
  const variants: Record<string, string> = {
    ghost: 'text-[var(--p-text-muted)] hover:bg-[var(--p-bg-soft)] hover:text-[var(--p-text)] focus-visible:outline-[var(--p-primary)]',
    primary: 'bg-[var(--p-primary)] text-white hover:bg-[var(--p-primary-hover)] focus-visible:outline-[var(--p-primary)]',
    secondary: 'bg-[var(--p-secondary)] text-white hover:bg-[var(--p-secondary-hover)] focus-visible:outline-[var(--p-secondary)]',
    outline: 'bg-transparent text-[var(--p-text)] ring-1 ring-[var(--p-border)] hover:bg-[var(--p-bg-soft)] focus-visible:outline-[var(--p-primary)]',
    danger: 'bg-[var(--p-error-soft)] text-[var(--p-error)] hover:bg-[var(--p-error)] hover:text-white focus-visible:outline-[var(--p-error)]',
  }
  return [base, sizes[props.size], variants[props.variant]]
})
</script>
