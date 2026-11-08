<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'

/**
 * Shared loading state. Panel and inline variants cover full sections and
 * one-line waits; the skeleton variant mirrors list-shaped content.
 */
type LoadingVariant = 'panel' | 'inline' | 'skeleton'

const props = withDefaults(defineProps<{
  label?: string
  variant?: LoadingVariant
  rows?: number
  class?: string
}>(), {
  label: 'Loading…',
  variant: 'panel',
  rows: 4,
  class: undefined,
})
</script>

<template>
  <div
    v-if="props.variant === 'skeleton'"
    :class="cx('space-y-3', props.class)"
    role="status"
    aria-live="polite"
    data-design-loading
  >
    <span class="sr-only">{{ props.label }}</span>
    <div
      v-for="i in props.rows"
      :key="i"
      class="h-16 animate-pulse rounded-2xl border border-line bg-card"
    />
  </div>

  <div
    v-else-if="props.variant === 'inline'"
    :class="cx('flex items-center gap-2 text-[13px] text-ink-2', props.class)"
    role="status"
    aria-live="polite"
    data-design-loading
  >
    <Loader2 :size="15" class="animate-spin text-brand" aria-hidden="true" />
    <span>{{ props.label }}</span>
  </div>

  <div
    v-else
    :class="cx('flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-card px-6 py-12 text-center', props.class)"
    role="status"
    aria-live="polite"
    data-design-loading
  >
    <Loader2 :size="22" class="animate-spin text-brand" aria-hidden="true" />
    <p class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">{{ props.label }}</p>
  </div>
</template>
