<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  label: string
  value: number | string
  accentColor?: string
  className?: string
}>(), {
  accentColor: 'text-[#e13515]',
  className: '',
})
</script>

<template>
  <div :class="cn('flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm', props.className)">
    <div :class="cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50', props.accentColor)">
      <slot name="icon" />
    </div>
    <div class="min-w-0">
      <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
      <p class="truncate text-sm text-slate-500">{{ label }}</p>
    </div>
  </div>
</template>
