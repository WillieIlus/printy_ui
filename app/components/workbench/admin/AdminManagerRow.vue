<template>
  <button
    type="button"
    class="group flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors hover:border-[var(--accent)]"
    :style="{
      borderColor: needsHelp ? 'rgba(251,77,109,.45)' : 'var(--line)',
      background: 'var(--panel)',
    }"
    @click="emit('open', manager)"
  >
    <Avatar :initials="manager.initials" :hue="manager.hue" :size="40" />
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="truncate font-disp text-[14.5px] font-bold tracking-tight">{{ manager.name }}</span>
        <Flag v-if="stats.disputed > 0" :size="11" style="color: #C81E44" />
      </div>
      <div class="truncate font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ manager.tag }}</div>
    </div>

    <div class="hidden w-[110px] sm:block">
      <div class="mb-1 flex justify-between font-mono2 text-[8.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
        <span>on-time</span><span>{{ manager.onTime }}%</span>
      </div>
      <Meter :value="manager.onTime / 100" :color="onTimeColor" :h="4" />
    </div>

    <div class="text-right">
      <div class="font-disp text-[15px] font-bold">{{ stats.active }}<span class="text-[11px] text-[var(--sub)]"> live</span></div>
      <div class="font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ color: helpColor }">{{ helpText }}</div>
    </div>

    <ChevronRight :size="14" class="shrink-0 text-[var(--sub)] transition-transform group-hover:translate-x-0.5" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Flag } from 'lucide-vue-next'
import type { Manager } from '~/shared/workflow/printy'

interface ManagerStats {
  active: number
  risk: number
  disputed: number
}

const props = withDefaults(defineProps<{
  manager: Manager
  stats: ManagerStats
  needsHelp?: boolean
}>(), { needsHelp: false })

const emit = defineEmits<{ open: [manager: Manager] }>()

const onTimeColor = computed(() => (props.manager.onTime >= 92 ? '#2FBF71' : props.manager.onTime >= 87 ? '#B45309' : '#C2410C'))
const exposure = computed(() => props.stats.risk + props.stats.disputed)
const helpText = computed(() => (exposure.value ? `${exposure.value} need help` : 'clear desk'))
const helpColor = computed(() => (exposure.value ? '#C2410C' : 'var(--sub)'))
</script>