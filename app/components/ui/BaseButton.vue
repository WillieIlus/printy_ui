<!-- Purpose: Reusable button primitive for public and dashboard surfaces. -->
<template>
  <component
    :is="to ? NuxtLink : tag"
    :to="to"
    :type="to ? undefined : type"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : undefined"
    :class="buttonClass"
  >
    <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const NuxtLink = resolveComponent('NuxtLink')

const props = withDefaults(defineProps<{
  to?: RouteLocationRaw
  tag?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'whatsapp' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  disabled?: boolean
  loading?: boolean
}>(), {
  to: undefined,
  tag: 'button',
  type: 'button',
  variant: 'primary',
  size: 'md',
  block: false,
  disabled: false,
  loading: false,
})

const isDisabled = computed(() => props.disabled || props.loading)

const buttonClass = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60'
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }
  const variants = {
    primary: 'bg-[var(--p-primary)] text-white shadow-[0_10px_18px_rgba(225,53,21,0.24)] hover:-translate-y-px hover:bg-[var(--p-primary-hover)] focus-visible:outline-[var(--p-primary)]',
    secondary: 'bg-[var(--p-secondary)] text-white shadow-[0_8px_16px_rgba(15,23,42,0.16)] hover:-translate-y-px hover:bg-[var(--p-secondary-hover)] focus-visible:outline-[var(--p-secondary)]',
    outline: 'bg-[var(--p-surface)] text-[var(--p-text)] ring-1 ring-[color:color-mix(in_srgb,var(--p-border)_92%,transparent)] shadow-[0_4px_10px_rgba(15,23,42,0.04)] hover:-translate-y-px hover:bg-[var(--p-bg-soft)] focus-visible:outline-[var(--p-primary)]',
    ghost: 'bg-transparent text-[var(--p-text)] hover:bg-[color:color-mix(in_srgb,var(--p-bg-soft)_86%,transparent)] focus-visible:outline-[var(--p-primary)]',
    danger: 'bg-[var(--p-error)] text-white shadow-[0_8px_16px_rgba(220,38,38,0.18)] hover:-translate-y-px hover:brightness-[0.98] focus-visible:outline-[var(--p-error)]',
    whatsapp: 'bg-[var(--p-whatsapp)] text-white shadow-[0_8px_16px_rgba(34,197,94,0.2)] hover:-translate-y-px hover:bg-[var(--p-whatsapp-hover)] focus-visible:outline-[var(--p-whatsapp)]',
    dark: 'bg-[var(--p-surface-dark)] text-[var(--p-text-on-dark)] shadow-[0_10px_18px_rgba(2,6,23,0.3)] hover:-translate-y-px hover:bg-[var(--p-secondary-dark)] focus-visible:outline-[var(--p-secondary)]',
  }

  return [
    base,
    sizes[props.size],
    variants[props.variant],
    props.block ? 'w-full' : '',
  ]
})
</script>
