<template>
  <div
    class="overflow-hidden rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-md backdrop-blur-xl"
    :class="colSpanClass"
  >
    <div
      v-if="title || $slots['card-header']"
      class="border-b border-[var(--p-border-dim)] px-5 py-3.5"
    >
      <slot name="card-header">
        <h3 class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
          {{ title }}
        </h3>
      </slot>
    </div>
    <div class="p-4 sm:p-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    colSpan?: number
  }>(),
  {
    title: undefined,
    colSpan: 12,
  }
)

const colSpanClass = computed(() => {
  const span = Math.min(12, Math.max(1, props.colSpan))
  const map: Record<number, string> = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
  }
  return `col-span-12 ${map[span] ?? 'lg:col-span-12'}`
})
</script>
