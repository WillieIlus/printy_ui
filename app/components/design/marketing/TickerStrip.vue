<script setup lang="ts">
const ticker = [
  'ESCROW ON EVERY ORDER',
  'FAIR-PRICE CAP ACTIVE',
  'PRT-2081 - QC PASSED',
  'SAMPLE-1042 - PRINTING',
  '7-STAGE LIVE LINE',
  'NAIROBI - NATIONWIDE',
  'PRT-2077 - OUT FOR DELIVERY',
  'VERIFIED MANAGERS ONLY',
]
const items = [...ticker, ...ticker]
</script>

<template>
  <div class="overflow-hidden border-y border-ink bg-ink py-3" aria-hidden="true">
    <div class="animate-marquee flex w-max items-center gap-8 pr-8">
      <span v-for="(text, index) in items" :key="index" class="flex items-center gap-8 font-mono text-[11px] font-medium tracking-[0.22em] whitespace-nowrap text-paper/70">
        {{ text }}
        <span class="inline-block h-1.5 w-1.5 rotate-45 bg-brand-bright" />
      </span>
    </div>
  </div>
</template>
