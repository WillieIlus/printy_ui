<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import DesignButtonLink from '../ui/ButtonLink.vue'

const props = withDefaults(defineProps<{
  quoteHref?: string
  trackHref?: string
}>(), {
  quoteHref: '/',
  trackHref: '/track',
})

const quoteHref = computed(() => props.quoteHref)
const trackHref = computed(() => props.trackHref)
</script>

<template>
  <section class="px-5 pb-20 sm:px-8">
    <div class="paper-noise relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-deep px-6 py-16 text-center sm:px-12 sm:py-20">
      <div class="halftone absolute -top-10 -left-10 h-48 w-48 rounded-full opacity-30" aria-hidden="true" />
      <div class="reg-mark absolute right-8 bottom-8 rotate-45 opacity-40" aria-hidden="true" />
      <p class="font-mono text-[10.5px] tracking-[0.2em] text-brand-bright uppercase">Instant price - Escrow - Live tracking</p>
      <h2 class="mx-auto mt-4 max-w-2xl text-4xl leading-[1.02] font-bold tracking-tight text-paper text-balance sm:text-5xl">Get your quote in seconds.</h2>
      <p class="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-paper/70">
        Tell us what you need. You'll see a clear, server-verified price, pick a verified manager if you'd like, and track every stage along the way.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <DesignButtonLink :href="quoteHref" tone="paper" size="lg">
          Get my exact quote
          <component :is="getIcon('ArrowRight')" class="h-4 w-4" />
        </DesignButtonLink>
        <DesignButtonLink :href="trackHref" tone="outline" size="lg" class="border-paper/30 text-paper hover:bg-paper/10 hover:border-paper">Track a job</DesignButtonLink>
      </div>
    </div>
  </section>
</template>
