<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  onDark?: boolean
}>(), { onDark: false })
</script>

<template>
  <NuxtLink to="/" class="group flex items-center gap-2.5" aria-label="Printy home">
    <!-- brand identity stays Printy teal on every role surface -->
    <span class="relative flex h-8 w-8 items-center justify-center rounded-[9px] bg-logo text-white transition-transform duration-500 group-hover:-rotate-6">
      <svg viewBox="0 0 24 24" class="h-[18px] w-[18px]" fill="none" stroke="currentColor" stroke-width="2.4">
        <path d="M6 9V3h12v6" stroke-linecap="round" />
        <rect x="3" y="9" width="18" height="8" rx="1.6" />
        <path d="M6 15h12v6H6z" fill="currentColor" stroke="none" opacity="0.9" />
        <circle cx="17.6" cy="12.6" r="1" fill="#f6f2e7" stroke="none" />
      </svg>
    </span>
    <span :class="cx('text-[21px] font-bold tracking-tight', props.onDark ? 'text-paper' : 'text-ink')">
      printy<span class="text-logo">.</span>
    </span>
  </NuxtLink>
</template>
