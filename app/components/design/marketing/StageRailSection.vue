<script setup lang="ts">
import { computed } from 'vue'
import DesignSectionHead from './SectionHead.vue'

export type DesignStageRailStage = {
  label: string
  window: string
  copy: string
}

const props = withDefaults(defineProps<{
  stages?: DesignStageRailStage[]
}>(), {
  stages: () => [
    { label: 'Payment received', window: 'secured', copy: 'Your shillings move into escrow - visible to you, untouchable by anyone else.' },
    { label: 'Artwork check', window: '2h 30m', copy: 'Bleed, resolution and colour get a human once-over before anything hits a plate.' },
    { label: 'Printing', window: '5h 20m', copy: 'Your job locks onto a verified shop press schedule - the longest block on the line.' },
    { label: 'Finishing', window: '3h', copy: 'Lamination, cutting, folding, binding. The part that makes it feel expensive.' },
    { label: 'Quality check', window: '1h 20m', copy: 'Counted, sampled and photographed before it is allowed to leave the shop.' },
    { label: 'Out for delivery', window: '1h 15m', copy: "Rider dispatches across Nairobi - or a courier if you're further out." },
    { label: 'Delivered', window: 'done', copy: 'You confirm, escrow releases, everyone gets paid. Job closed on the record.' },
  ],
})

const stages = computed(() => props.stages)
</script>

<template>
  <section class="border-y border-line bg-paper-2/60">
    <div class="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <DesignSectionHead
        index="01"
        eyebrow="The line"
        copy="Every job - from fifty cards to five thousand banners - moves down the same visible line. Live stage and time left, on every dashboard, for every role."
      >
        <template #title>One line. <span class="text-brand">Seven stages.</span></template>
      </DesignSectionHead>
      <div class="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible">
        <article v-for="(stage, index) in stages" :key="stage.label" class="group min-w-[210px] snap-start rounded-xl border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift lg:min-w-0">
          <p class="tabular font-mono text-4xl font-semibold text-paper-3 transition-colors duration-300 group-hover:text-brand/40">
            {{ String(index + 1).padStart(2, '0') }}
          </p>
          <h3 class="mt-3 text-[15px] font-semibold tracking-tight">{{ stage.label }}</h3>
          <p class="mt-0.5 font-mono text-[10px] tracking-[0.12em] text-brand uppercase">{{ stage.window }}</p>
          <p class="mt-2.5 text-[12.5px] leading-relaxed text-ink-2">{{ stage.copy }}</p>
        </article>
      </div>
      <p class="mt-6 font-mono text-[11px] tracking-[0.08em] text-ink-3">
        Sample stage windows - live SLAs and ready-by times come from the server. Pay, and your job appears at the top of your dashboard. No code needed.
      </p>
    </div>
  </section>
</template>
