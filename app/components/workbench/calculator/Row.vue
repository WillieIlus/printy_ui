<script setup lang="ts">
import { ksh } from '~/shared/workflow/pricing'

defineProps<{ label: string; detail?: string; amount: number; bold?: boolean; accent?: boolean }>()
</script>

<template>
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <div class="text-[12px]" :class="{ 'font-semibold': bold }">{{ label }}</div>
      <div v-if="detail" class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ detail }}</div>
    </div>
    <span class="shrink-0 font-mono2" :class="bold ? 'text-[14px] font-bold' : 'text-[11.5px]'" :style="{ color: accent ? 'var(--accent)' : 'var(--ink)' }">
      {{ ksh(amount) }}
    </span>
  </div>
</template>