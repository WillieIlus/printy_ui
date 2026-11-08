<script setup lang="ts">
import { computed } from 'vue'
import DesignSectionHead from './SectionHead.vue'

const props = withDefaults(defineProps<{
  lockedPrice?: number
  cap?: number
  headroom?: number
  sampleLabel?: string
}>(), {
  lockedPrice: 14300,
  cap: 17900,
  headroom: 3600,
  sampleLabel: 'Sample - 1,000 flyers',
})

const locked = computed(() => props.lockedPrice ?? 0)
const cap = computed(() => props.cap ?? 0)
const headroom = computed(() => props.headroom ?? 0)
const lockedPct = computed(() => (cap.value > 0 ? Math.round((locked.value / cap.value) * 100) : 0))
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
    <div class="grid items-center gap-10 lg:grid-cols-2">
      <DesignSectionHead
        index="05"
        eyebrow="Protection"
        copy="Managers keep your job moving and can adjust spoilage, paper or markup - but a server-enforced ceiling sits on every job size. You pay the locked price, never a shilling over the cap."
      >
        <template #title>There's a <span class="text-amber">hard cap</span> on what a manager can charge.</template>
      </DesignSectionHead>
      <div class="crop-marks rounded-2xl border border-line bg-card p-6 shadow-card">
        <div class="flex items-baseline justify-between">
          <p class="font-mono text-[10.5px] tracking-[0.16em] text-ink-3 uppercase">{{ props.sampleLabel }}</p>
          <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Server-verified</span>
        </div>
        <div class="mt-5 space-y-4">
          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-sm text-ink-2">Locked instant price</span>
              <span class="tabular font-mono text-lg font-semibold text-brand">KES {{ locked }}</span>
            </div>
            <div class="mt-1.5 h-2.5 rounded-full bg-paper-2">
              <div class="h-full rounded-full bg-brand" :style="{ width: `${lockedPct}%` }" />
            </div>
          </div>
          <div>
            <div class="flex items-baseline justify-between">
              <span class="text-sm text-ink-2">Fair-price cap</span>
              <span class="tabular font-mono text-lg font-semibold text-amber">KES {{ cap }}</span>
            </div>
            <div class="mt-1.5 h-2.5 rounded-full bg-paper-2">
              <div class="h-full rounded-full bg-amber/80" :style="{ width: `${cap > 0 ? Math.min(100, (cap / (cap || 1)) * 100) : 0}%` }" />
            </div>
          </div>
          <div class="ticket-divider" />
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Your headroom</span>
            <span class="rounded-full bg-green-soft px-3 py-1 font-mono text-[11px] font-semibold text-green">KES {{ headroom }} under the cap</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
