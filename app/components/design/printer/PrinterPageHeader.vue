<script setup lang="ts">
import { cx } from '../../../utils/design/cx'
import DesignSectionLabel from '../ui/SectionLabel.vue'

/**
 * Printer workspace page heading: design section label, display title and the
 * existing page copy. Actions live in the caller through the actions slot.
 */
const props = withDefaults(defineProps<{
  index: string
  kicker: string
  title: string
  subtitle?: string
  description?: string
  class?: string
}>(), {
  subtitle: undefined,
  description: undefined,
  class: undefined,
})
</script>

<template>
  <header :class="cx('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', props.class)">
    <div class="min-w-0">
      <DesignSectionLabel :index="props.index" tone="brand">{{ props.kicker }}</DesignSectionLabel>
      <h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {{ props.title }}<span v-if="props.subtitle" class="block text-ink-2">{{ props.subtitle }}</span>
      </h1>
      <p v-if="props.description" class="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-2">
        {{ props.description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2 sm:justify-end">
      <slot name="actions" />
    </div>
  </header>
</template>
