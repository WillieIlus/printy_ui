<script setup lang="ts">
import { computed } from 'vue'
import DesignSectionHead from './SectionHead.vue'
import DesignButtonLink from '../ui/ButtonLink.vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  copy?: string
  quoteCtaLabel?: string
  quoteCtaHref?: string
}>(), {
  eyebrow: 'Instant quote',
  title: 'What does your job cost?',
  copy: 'Server-verified prices from the live network. Locked at order, escrow on every order.',
  quoteCtaLabel: 'Get my exact quote',
  quoteCtaHref: '/',
})

const quoteCtaHref = computed(() => props.quoteCtaHref)
</script>

<template>
  <section id="quote" class="paper-noise relative scroll-mt-20">
    <div class="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <DesignSectionHead
          :eyebrow="props.eyebrow"
          :title="props.title"
          :copy="props.copy"
        />
        <span class="stamp border-brand bg-mint text-brand-deep">No login needed</span>
      </div>
      <div class="mt-8">
        <DesignButtonLink :href="quoteCtaHref" tone="primary" size="lg">
          {{ props.quoteCtaLabel }}
        </DesignButtonLink>
      </div>
    </div>
  </section>
</template>
