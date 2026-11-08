<script setup lang="ts">
import { computed } from 'vue'
import DesignSectionHead from './SectionHead.vue'
import DesignButtonLink from '../ui/ButtonLink.vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  copy?: string
  ctaLabel?: string
  ctaHref?: string
}>(), {
  eyebrow: 'Speed options',
  title: 'Same job. Pick how fast.',
  copy: 'Choose a speed and the ready-by time and total update together. Every figure here is a sample and every time is an estimate - the exact, locked price comes with your quote.',
  ctaLabel: 'Get my exact quote',
  ctaHref: '/',
})

const ctaHref = computed(() => props.ctaHref)
</script>

<template>
  <section id="speed" class="scroll-mt-20 border-y border-line bg-paper-2/60">
    <div class="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <DesignSectionHead
        index="03"
        :eyebrow="props.eyebrow"
        :title="props.title"
        :copy="props.copy"
      >
        <template #title>Same job. <span class="text-brand">Pick how fast.</span></template>
      </DesignSectionHead>
      <div class="mt-8">
        <DesignButtonLink :href="ctaHref" tone="primary" size="lg">
          {{ props.ctaLabel }}
        </DesignButtonLink>
      </div>
    </div>
  </section>
</template>
