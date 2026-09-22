<template>
  <div
    class="relative shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :title="`${job.owner.waitingHrs}h of ${job.owner.slaHrs}h`"
  >
    <svg :width="size" :height="size" class="-rotate-90">
      <circle :cx="size / 2" :cy="size / 2" :r="r" fill="none" stroke="var(--line)" stroke-width="4" />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        fill="none"
        :stroke="color"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="c"
        :stroke-dashoffset="c * (1 - displayRatio)"
        style="transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.3s ease"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center font-mono2 text-[9px] font-semibold" :style="{ color }">
      {{ job.owner.waitingHrs }}h
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '~/shared/workflow/printy'
import { slaRatio, slaTone } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{ job: Job; size?: number }>(), { size: 46 })

const ratio = computed(() => Math.min(slaRatio(props.job), 1))
const tone = computed(() => slaTone(props.job))
const color = computed(() =>
  tone.value === 'breach' ? '#C81E44' : tone.value === 'tight' ? '#B45309' : 'var(--accent)',
)
const r = (props.size - 6) / 2
const c = 2 * Math.PI * r
const displayRatio = computed(() => (tone.value === 'breach' ? 1 : ratio.value))
</script>