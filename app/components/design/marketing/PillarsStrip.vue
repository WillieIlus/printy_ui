<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import type { IconName } from '../../../utils/design/icon-registry'

export type DesignPillar = {
  icon: IconName
  title: string
  copy: string
}

const props = withDefaults(defineProps<{
  pillars?: DesignPillar[]
}>(), {
  pillars: () => [
    { icon: 'ShieldCheck', title: 'Your money stays safe in escrow', copy: 'Payment lands in escrow the moment you pay, and only reaches the shop when you have your print in hand.' },
    { icon: 'Lock', title: 'Price lock - what you see is what you pay', copy: 'The instant price is locked at order. No re-quotes, no surprise paper cost calls mid-run.' },
    { icon: 'Gauge', title: 'Fair-price cap on every job', copy: 'A hard ceiling on what a manager can charge for your job size. Markup room exists - greed does not.' },
    { icon: 'BadgeCheck', title: 'Verified printing managers', copy: 'Every manager and shop on the network is vetted, rate-checked and reviewed after each delivery.' },
  ],
})

const pillars = computed(() => props.pillars)
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
    <div class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      <article v-for="pillar in pillars" :key="pillar.title" class="group bg-card p-6 transition-colors duration-300 hover:bg-paper-2">
        <component :is="getIcon(pillar.icon)" class="h-6 w-6 text-brand transition-transform duration-500 group-hover:-translate-y-1" :stroke-width="1.8" />
        <h3 class="mt-4 text-[15.5px] leading-snug font-semibold tracking-tight">{{ pillar.title }}</h3>
        <p class="mt-2 text-[13px] leading-relaxed text-ink-2">{{ pillar.copy }}</p>
      </article>
    </div>
  </section>
</template>
