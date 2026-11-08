<script setup lang="ts">
import { computed } from 'vue'
import { money } from '~/shared/workflow/printy'

/**
 * Escrow split bar in the design palette. It only renders totals the admin
 * store/workflow store already computed; no money is recalculated here.
 */
const props = defineProps<{ held: number; released: number; awaiting: number }>()

const total = computed(() => Math.max(props.held + props.released + props.awaiting, 1))
</script>

<template>
  <div class="space-y-2">
    <div class="flex h-3 w-full gap-[3px] overflow-hidden rounded-full bg-paper-2">
      <div class="h-full rounded-full bg-brand" :style="{ width: `${(held / total) * 100}%` }" />
      <div class="h-full rounded-full bg-green" :style="{ width: `${(released / total) * 100}%` }" />
      <div class="h-full rounded-full bg-paper-3" :style="{ width: `${(awaiting / total) * 100}%` }" />
    </div>
    <div class="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-brand" /> held {{ money(held) }}</span>
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-green" /> released {{ money(released) }}</span>
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-paper-3" /> awaiting {{ money(awaiting) }}</span>
    </div>
  </div>
</template>
