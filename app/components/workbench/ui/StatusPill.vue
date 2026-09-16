<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-mono2 uppercase tracking-[0.14em]"
    :class="size === 'sm' ? 'px-2 py-[3px] text-[9px]' : 'px-2.5 py-1 text-[10px]'"
    :style="{ background: m.soft, color: m.color, boxShadow: `inset 0 0 0 1px ${m.color}33` }"
  >
    <span class="h-1.5 w-1.5 rounded-full" :style="{ background: m.color }" />
    {{ m.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Status } from '~/shared/workflow/printy'
import { STATUS_META } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{ status: Status; size?: 'sm' | 'md' }>(), { size: 'md' })
const m = computed(() => STATUS_META[props.status])
</script>