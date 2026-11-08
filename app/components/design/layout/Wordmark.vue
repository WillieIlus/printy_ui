<script setup lang="ts">
import { cx } from '../../../utils/design/cx'
import PrintyMark from '../../workbench/ui/Mark.vue'

const props = withDefaults(defineProps<{
  onDark?: boolean
}>(), { onDark: false })
</script>

<template>
  <NuxtLink to="/" class="group flex items-center gap-2.5" aria-label="Printy home">
    <!-- Phase 1f: the design's recreated mark glyph is replaced by the original
         Printy mark component used by the original layouts (layouts/default.vue).
         The component itself is untouched; it reads --accent, which is provided
         here from the design's role-independent logo colour token. -->
    <span class="flex h-8 w-8 items-center justify-center" :style="{ '--accent': 'var(--color-logo, #0e7c5f)' }">
      <PrintyMark :size="26" />
    </span>
    <span :class="cx('text-[21px] font-bold tracking-tight', props.onDark ? 'text-paper' : 'text-ink')">
      printy<span class="text-logo">.</span>
    </span>
  </NuxtLink>
</template>
