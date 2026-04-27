<!-- Purpose: Generic button atom – foundation for all clickable actions. -->
<template>
  <component
    :is="to ? NuxtLink : tag"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <svg
      v-if="loading"
      class="size-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(defineProps<{
  to?: string
  tag?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), {
  tag: 'button',
  type: 'button',
  variant: 'primary',
  size: 'md',
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  const variants: Record<string, string> = {
    primary: 'bg-[var(--p-primary)] text-white shadow-[var(--shadow-control)] hover:bg-[var(--p-primary-hover)] active:bg-[var(--p-primary-hover)] focus-visible:outline-[var(--p-primary)]',
    secondary: 'bg-[var(--p-secondary)] text-white shadow-[var(--shadow-control)] hover:bg-[var(--p-secondary-hover)] active:bg-[var(--p-secondary-hover)] focus-visible:outline-[var(--p-secondary)]',
    outline: 'bg-transparent text-[var(--p-text)] ring-1 ring-[var(--p-border)] hover:bg-[var(--p-bg-soft)] hover:ring-[var(--p-border-strong)] focus-visible:outline-[var(--p-primary)]',
    ghost: 'bg-transparent text-[var(--p-text)] hover:bg-[var(--p-bg-soft)] focus-visible:outline-[var(--p-primary)]',
    danger: 'bg-[var(--p-error)] text-white shadow-[var(--shadow-control)] hover:brightness-95 active:brightness-90 focus-visible:outline-[var(--p-error)]',
    success: 'bg-[var(--p-success)] text-white shadow-[var(--shadow-control)] hover:brightness-95 active:brightness-90 focus-visible:outline-[var(--p-success)]',
    whatsapp: 'bg-[var(--p-whatsapp)] text-white shadow-[var(--shadow-control)] hover:bg-[var(--p-whatsapp-hover)] active:bg-[var(--p-whatsapp-hover)] focus-visible:outline-[var(--p-whatsapp)]',
  }
  return [base, sizes[props.size], variants[props.variant], props.block ? 'w-full' : ''].filter(Boolean)
})
</script>
