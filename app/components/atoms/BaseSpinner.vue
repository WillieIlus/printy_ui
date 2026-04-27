<!-- Purpose: Animated loading spinner atom. -->
<template>
  <svg
    :class="['animate-spin', sizes[size], colorClass]"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'current' | 'primary' | 'white' | 'muted'
}>(), {
  size: 'md',
  color: 'current',
})

const sizes: Record<string, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

const colorClass = computed(() => ({
  current: 'text-current',
  primary: 'text-primary-600',
  white:   'text-white',
  muted:   'text-[var(--p-text-muted)]',
})[props.color])
</script>
