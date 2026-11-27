<script setup lang="ts">
/**
 * The dark live-price panel used by every calculator viewer. It renders the
 * same server range as the summary — no pricing happens here.
 */
import { BadgeCheck, Loader2, ShieldCheck } from 'lucide-vue-next'

withDefaults(defineProps<{
  priceText: string
  loading?: boolean
  spectrum?: string
  specSummary?: string
  perPieceText?: string
  deliveryText?: string
  /** Production desk only: how many configured prices this spec matched. */
  countText?: string
  note?: string
  detailSlotNote?: string
}>(), {
  loading: false,
  spectrum: 'Your price',
  specSummary: '',
  perPieceText: '',
  deliveryText: '',
  countText: '',
  note: 'Your price covers your selected spec and speed. A verified Printy manager will confirm the final price, and you only pay when you are happy to go ahead.',
  detailSlotNote: 'No payment here — build your exact quote next',
})
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl border border-ink bg-ink p-6 text-paper shadow-lift sm:p-7">
    <div class="halftone absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-25" aria-hidden="true" />
    <div class="flex items-center justify-between">
      <p class="font-mono text-[10.5px] tracking-[0.18em] text-paper/50 uppercase">
        {{ spectrum }}
      </p>
      <Loader2 v-if="loading" class="h-4 w-4 animate-spin text-brand-bright" aria-hidden="true" />
      <BadgeCheck v-else class="h-4 w-4 text-brand-bright" aria-hidden="true" />
    </div>

    <p class="mt-3 text-sm text-paper/60">{{ specSummary || 'Your selected spec' }}</p>

    <p v-if="loading" class="tabular mt-1 inline-flex items-center gap-2 font-mono text-[22px] leading-none font-semibold tracking-tight">
      <Loader2 :size="18" class="animate-spin" aria-hidden="true" /> Pricing…
    </p>
    <p v-else-if="priceText" class="tabular mt-1 font-mono text-[34px] leading-none font-semibold tracking-tight sm:text-[40px]">
      {{ priceText }}
    </p>
    <p v-else class="tabular mt-1 font-mono text-[40px] leading-none font-semibold tracking-tight">—</p>

    <p v-if="perPieceText" class="tabular mt-2 font-mono text-[12.5px] text-paper/60">
      {{ perPieceText }}
    </p>
    <p v-if="deliveryText" class="mt-2 font-mono text-[11.5px] text-paper/55">
      Ready {{ deliveryText }}
    </p>
    <p v-if="countText" class="tabular mt-2 font-mono text-[11.5px] text-paper/55">
      {{ countText }}
    </p>

    <p class="mt-5 border-t border-paper/15 pt-4 text-[12.5px] leading-relaxed text-paper/55">
      {{ note }}
    </p>

    <div class="mt-5">
      <slot />
    </div>

    <p v-if="detailSlotNote" class="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-paper/45">
      <ShieldCheck class="h-3.5 w-3.5" aria-hidden="true" /> {{ detailSlotNote }}
    </p>
  </div>
</template>
