<script setup lang="ts">
import { cx } from '../../../utils/design/cx'
import DesignSectionLabel from './SectionLabel.vue'

/**
 * Shared presentational section frame for every workspace role. It renders a
 * slot only; all data and actions stay in the caller. Role-specific section
 * wrappers delegate here so buyer, manager and printer dashboards cannot drift
 * into separate designs.
 */
const props = defineProps<{
  id?: string
  index: string
  title: string
  hint?: string
  class?: string
}>()
</script>

<template>
  <section :id="props.id" :class="cx('min-w-0 scroll-mt-24', props.class)">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-wrap items-baseline gap-2">
        <DesignSectionLabel :index="props.index" tone="brand">
          {{ props.title }}
        </DesignSectionLabel>
        <span v-if="props.hint" class="font-mono text-[10.5px] tracking-[0.08em] text-ink-3">
          {{ props.hint }}
        </span>
      </div>
      <slot name="action" />
    </div>
    <slot />
  </section>
</template>
