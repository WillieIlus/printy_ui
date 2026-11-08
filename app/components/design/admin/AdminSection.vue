<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '~/utils/design/cx'
import DesignSectionLabel from '../ui/SectionLabel.vue'

/**
 * Presentational section frame for the admin workspace, ported from the design
 * PanelSection (index + title label + quiet hint) and extended with the count
 * chip the existing admin views already show.
 */
const props = defineProps<{
  id?: string
  index: string
  title: string
  hint?: string
  count?: number | string
  class?: string
}>()

const countLabel = computed(() => {
  if (props.count === undefined) return ''
  return typeof props.count === 'number'
    ? `${props.count} ${props.count === 1 ? 'item' : 'items'}`
    : props.count
})
</script>

<template>
  <section :id="props.id" :class="cx('min-w-0 scroll-mt-24', props.class)">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <DesignSectionLabel :index="props.index" tone="brand">
          {{ props.title }}
        </DesignSectionLabel>
        <span v-if="props.hint" class="font-mono text-[10.5px] tracking-[0.08em] text-ink-3">
          {{ props.hint }}
        </span>
        <span v-if="props.count !== undefined" class="rounded-full border border-line bg-paper-2 px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-ink-2 uppercase">
          {{ countLabel }}
        </span>
      </div>
      <slot name="action" />
    </div>
    <slot />
  </section>
</template>
