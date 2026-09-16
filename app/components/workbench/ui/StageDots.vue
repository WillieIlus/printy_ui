<template>
  <div class="flex items-center gap-[5px]">
    <span
      v-for="(i) in 10"
      :key="i"
      class="h-[7px] rounded-full transition-all duration-500"
      :style="{
        width: state(i - 1) === 'now' ? 18 : 7,
        background: state(i - 1) === 'done'
          ? 'var(--accent)'
          : state(i - 1) === 'now'
            ? disputed ? '#FB4D6D' : colors[job.status] ?? 'var(--accent)'
            : 'var(--line)',
        boxShadow: state(i - 1) === 'now' ? `0 0 8px ${disputed ? '#FB4D6D' : 'var(--accent)'}` : 'none',
        opacity: state(i - 1) === 'todo' ? 0.7 : 1,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '~/shared/workflow/printy'

const props = defineProps<{ job: Job }>()

const idx = computed(() => ['quote', 'artwork', 'approval', 'payment', 'production', 'printing', 'finishing', 'qc', 'delivery', 'completed'].indexOf(props.job.stage))
const disputed = computed(() => props.job.status === 'disputed')

const colors: Record<string, string> = {
  'on-track': 'var(--accent)',
  'at-risk': '#F5A623',
  overdue: '#FF6B4A',
  disputed: '#FB4D6D',
  completed: '#9BA3B4',
}

function state(i: number): 'done' | 'now' | 'todo' {
  return i < idx.value ? 'done' : i === idx.value ? 'now' : 'todo'
}
</script>