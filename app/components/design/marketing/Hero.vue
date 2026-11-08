<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import DesignButtonLink from '../ui/ButtonLink.vue'
import DesignTrackerDemo from './TrackerDemo.vue'

const props = withDefaults(defineProps<{
  badge?: string
  title?: string
  accent?: string
  copy?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  meta?: string[]
}>(), {
  badge: "Kenya's verified printing manager network",
  title: "Where's my job? Never call again.",
  accent: 'Never call',
  copy: 'Every Printy order runs on a live seven-stage line - with escrow on every shilling and a fair-price cap on every job. Pay, then watch it print.',
  primaryCtaLabel: 'Get my exact quote',
  primaryCtaHref: '#quote',
  secondaryCtaLabel: 'Track my job',
  secondaryCtaHref: '/track',
  meta: () => ['No signup to start', 'Prices from the live network', 'Escrow on every order'],
})

const primaryCtaHref = computed(() => props.primaryCtaHref)
const secondaryCtaHref = computed(() => props.secondaryCtaHref)
const metaLines = computed(() => props.meta)
</script>

<template>
  <section class="paper-noise relative overflow-hidden">
    <div class="dot-grid absolute inset-y-0 right-0 hidden w-1/2 opacity-70 lg:block" aria-hidden="true" />
    <div class="reg-mark absolute top-16 right-10 hidden rotate-12 opacity-60 lg:block" aria-hidden="true" />
    <div class="relative z-10 mx-auto grid max-w-6xl gap-14 px-5 pt-16 pb-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-20">
      <div class="reveal-up lg:col-span-6">
        <p class="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-mint px-3.5 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.16em] text-brand-deep uppercase">
          <component :is="getIcon('ShieldCheck')" class="h-3.5 w-3.5" />
          {{ props.badge }}
        </p>
        <h1 class="mt-6 max-w-xl text-[clamp(44px,7.2vw,76px)] leading-[0.98] font-bold tracking-[-0.03em] text-balance">
          {{ props.title }}
          <span v-if="props.accent" class="relative inline-block text-brand">
            {{ props.accent }}
            <svg viewBox="0 0 240 14" class="absolute -bottom-2 left-0 w-full text-brand-bright" aria-hidden="true">
              <path d="M3 10 Q 60 2 120 8 T 237 7" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            </svg>
          </span>
        </h1>
        <p class="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-ink-2">
          {{ props.copy }}
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <DesignButtonLink :href="primaryCtaHref" tone="primary" size="lg">
            {{ props.primaryCtaLabel }}
            <component :is="getIcon('ArrowRight')" class="h-4 w-4" />
          </DesignButtonLink>
          <DesignButtonLink :href="secondaryCtaHref" tone="outline" size="lg">Track my job</DesignButtonLink>
        </div>
        <p class="mt-6 font-mono text-[11px] tracking-[0.1em] text-ink-3 uppercase">
          <span v-for="(line, index) in metaLines" :key="index">{{ line }}</span>
        </p>
      </div>
      <div class="reveal-up lg:col-span-6 lg:pl-6" style="animation-delay: 120ms">
        <div class="crop-marks relative mx-auto max-w-md lg:ml-auto">
          <div class="halftone absolute -top-8 -right-8 -z-10 h-40 w-40 rounded-full opacity-60" aria-hidden="true" />
          <DesignTrackerDemo />
        </div>
      </div>
    </div>
  </section>
</template>
