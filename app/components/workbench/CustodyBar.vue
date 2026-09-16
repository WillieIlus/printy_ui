<template>
  <div class="space-y-2">
    <div class="flex h-3 w-full gap-[3px] overflow-hidden rounded-full">
      <div class="h-full rounded-full bg-[#F2622E]" :style="{ width: `${(held / total) * 100}%` }" />
      <div class="h-full rounded-full bg-[#2FBF71]" :style="{ width: `${(released / total) * 100}%` }" />
      <div class="h-full rounded-full" :style="{ width: `${(awaiting / total) * 100}%`, background: 'var(--line)' }" />
    </div>
    <div class="flex flex-wrap gap-x-4 gap-y-1 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-[#F2622E]" /> held {{ money(held) }}</span>
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-[#2FBF71]" /> released {{ money(released) }}</span>
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full" :style="{ background: 'var(--line)' }" /> awaiting {{ money(awaiting) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { money } from '~/shared/workflow/printy'

const props = defineProps<{ held: number; released: number; awaiting: number }>()

const total = computed(() => Math.max(props.held + props.released + props.awaiting, 1))
</script>