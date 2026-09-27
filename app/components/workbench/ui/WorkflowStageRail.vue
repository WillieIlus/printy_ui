<script setup lang="ts">
import { AlertCircle, CheckCheck, Lock, Loader2 } from 'lucide-vue-next'
import type { JourneyStage, JourneyStageState } from '~/shared/journey'

const props = defineProps<{
  stages: JourneyStage[]
  note?: string | null
}>()

const STATE_COPY: Record<JourneyStageState, string> = {
  completed: 'done',
  active: 'in progress',
  available: 'next up',
  failed: 'needs attention',
  locked: 'locked',
}

function chipStyle(stage: JourneyStage) {
  if (stage.state === 'failed') {
    return { background: 'rgba(251,77,109,.12)', color: '#B4243F' }
  }
  if (stage.state === 'completed') {
    return { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }
  }
  if (stage.state === 'active') {
    return { background: 'var(--accent)', color: '#fff' }
  }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function ringStyle(stage: JourneyStage) {
  if (stage.state === 'completed') {
    return { background: 'var(--accent)', boxShadow: 'none' }
  }
  if (stage.state === 'failed') {
    return { background: 'transparent', boxShadow: 'inset 0 0 0 1.5px #FB4D6D' }
  }
  if (stage.state === 'active') {
    return { background: 'transparent', boxShadow: 'inset 0 0 0 1.5px var(--accent)' }
  }
  if (stage.state === 'available') {
    return { background: 'transparent', boxShadow: 'inset 0 0 0 1.5px var(--line)' }
  }
  return { background: 'transparent', boxShadow: 'inset 0 0 0 1.5px var(--line)' }
}

function rowStyle(stage: JourneyStage) {
  if (stage.state === 'active') {
    return { background: 'color-mix(in srgb, var(--accent) 9%, transparent)' }
  }
  if (stage.state === 'failed') {
    return { background: 'rgba(251,77,109,.06)' }
  }
  return { background: 'transparent' }
}
</script>

<template>
  <div>
    <ol class="space-y-1.5" aria-label="Your print job progress">
      <li
        v-for="(stage, index) in props.stages"
        :key="stage.key"
        class="stage-row flex items-start gap-3 rounded-xl px-3 py-2"
        :class="{ 'opacity-55': stage.state === 'locked' }"
        :style="rowStyle(stage)"
        :aria-current="stage.state === 'active' || stage.state === 'available' ? 'step' : undefined"
      >
        <span
          class="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          :style="ringStyle(stage)"
        >
          <CheckCheck v-if="stage.state === 'completed'" :size="10" class="text-white" />
          <span v-else-if="stage.state === 'active'" class="ball-ping h-1.5 w-1.5 rounded-full" style="background: var(--accent)" />
          <AlertCircle v-else-if="stage.state === 'failed'" :size="10" style="color: #FB4D6D" />
          <Lock v-else-if="stage.state === 'locked'" :size="9" style="color: var(--sub)" />
          <span v-else class="h-1.5 w-1.5 rounded-full" style="background: var(--line)" />
        </span>

        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-2">
            <span
              class="truncate font-disp text-[13px] font-semibold"
              :style="{ color: stage.state === 'locked' ? 'var(--sub)' : 'var(--ink)' }"
            >{{ stage.label }}</span>
            <span
              class="ml-auto shrink-0 rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.14em]"
              :style="chipStyle(stage)"
            >
              <Loader2 v-if="stage.state === 'active'" :size="8" class="mr-1 inline animate-spin" />
              {{ STATE_COPY[stage.state] }}
            </span>
          </span>
          <span class="mt-0.5 block text-[11.5px] leading-snug" :style="{ color: 'var(--sub)' }">
            {{ stage.detail || stage.hint }}
          </span>
        </span>
      </li>
    </ol>

    <p v-if="props.note" class="mt-3 flex items-start gap-1.5 text-[11px] leading-snug" style="color: var(--sub)">
      <AlertCircle :size="12" class="mt-px shrink-0" /> {{ props.note }}
    </p>
  </div>
</template>

<style scoped>
.stage-row {
  animation: stage-row-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.stage-row:nth-child(1) { animation-delay: 0.05s; }
.stage-row:nth-child(2) { animation-delay: 0.12s; }
.stage-row:nth-child(3) { animation-delay: 0.19s; }
.stage-row:nth-child(4) { animation-delay: 0.26s; }

@keyframes stage-row-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage-row {
    animation: none;
  }
}
</style>
