<script setup lang="ts">
import DesignSectionLabel from '../ui/SectionLabel.vue'
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  index?: string
  eyebrow: string
  title?: string
  copy?: string
  tone?: 'ink' | 'paper'
  align?: 'left' | 'center'
  class?: string
}>(), {
  index: undefined,
  title: undefined,
  copy: undefined,
  tone: 'ink',
  align: 'left',
  class: undefined,
})
</script>

<template>
  <div :class="cx('max-w-2xl', props.align === 'center' && 'mx-auto text-center', props.class)">
    <DesignSectionLabel :index="props.index" :tone="props.tone === 'paper' ? 'paper' : 'brand'" :class="props.align === 'center' ? 'justify-center' : ''">
      {{ props.eyebrow }}
    </DesignSectionLabel>
    <h2 :class="cx('mt-4 text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl', props.tone === 'paper' ? 'text-paper' : 'text-ink')">
      <slot name="title">{{ props.title }}</slot>
    </h2>
    <p v-if="props.copy" :class="cx('mt-4 text-[17px] leading-relaxed text-pretty', props.tone === 'paper' ? 'text-paper/65' : 'text-ink-2')">
      {{ props.copy }}
    </p>
  </div>
</template>
