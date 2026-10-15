<template>
  <div>
    <div v-if="summary" class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em]" :style="{ color: timeline.is_late ? '#C81E44' : 'var(--sub)' }">
        {{ summary }}
      </span>
      <span v-if="timeline.is_late" class="rounded-full px-2 py-[1px] font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em]" style="background: rgba(200,30,68,.14); color: #C81E44">
        late {{ latenessText }}
      </span>
    </div>

    <ol class="space-y-3">
      <li v-for="stage in timeline.stages" :key="stage.key" class="flex gap-3">
        <span class="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: dotColor(stage), boxShadow: stage.state === 'current' || stage.state === 'overdue' ? '0 0 0 3px color-mix(in srgb, currentColor 18%, transparent)' : 'none' }" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span class="text-[12.5px] font-semibold" :style="{ color: stage.is_overdue ? '#C81E44' : 'var(--ink)' }">{{ stage.label }}</span>
            <span class="rounded-full px-2 py-[1px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ ownerLabel(stage.owner) }}</span>
            <span v-if="stage.is_overdue" class="font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em]" style="color: #C81E44">overdue</span>
            <span v-else-if="stage.state === 'current'" class="font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.12em]" style="color: var(--accent)">in progress</span>
          </div>
          <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
            <span>SLA <span class="text-[var(--ink)]">{{ formatSla(stage.sla_hours) }}</span></span>
            <span v-if="stage.started_at">started <span class="text-[var(--ink)]">{{ formatDate(stage.started_at) }}</span></span>
            <span v-if="stage.due_at">due <span class="text-[var(--ink)]">{{ formatDate(stage.due_at) }}</span></span>
            <span v-if="stage.completed_at">done <span class="text-[var(--ink)]">{{ formatDate(stage.completed_at) }}</span></span>
          </div>
          <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono2 text-[9.5px] uppercase tracking-[0.1em]">
            <span class="text-[var(--sub)]">taken <span class="text-[var(--ink)]">{{ formatMinutes(stage.time_taken_minutes) || '—' }}</span></span>
            <span v-if="stage.state !== 'completed'" class="text-[var(--sub)]">remaining <span :style="stage.is_overdue ? { color: '#C81E44' } : { color: 'var(--ink)' }">{{ remainingText(stage) }}</span></span>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatMinutes, timelineSummary } from '~/shared/list-sections'
import type { JobStageTimeline, JobStageTimelineLine } from '~/shared/types'

const props = defineProps<{ timeline: JobStageTimeline }>()

const summary = computed(() => timelineSummary(props.timeline))

const latenessText = computed(() => formatMinutes(props.timeline.lateness_minutes))

function ownerLabel(owner: string | null | undefined): string {
  if (owner === 'buyer') return 'Client'
  if (owner === 'manager') return 'Print manager'
  if (owner === 'printer') return 'Printer'
  return owner || ''
}

function dotColor(stage: JobStageTimelineLine): string {
  if (stage.state === 'completed') return '#1E8E52'
  if (stage.is_overdue) return '#C81E44'
  if (stage.state === 'current') return 'var(--accent)'
  return 'var(--line)'
}

function remainingText(stage: JobStageTimelineLine): string {
  const minutes = stage.time_remaining_minutes
  if (minutes === null || minutes === undefined) return '—'
  if (minutes <= 0) return stage.is_overdue ? 'overdue' : 'due now'
  return formatMinutes(minutes)
}

function formatSla(value: number | string | null): string {
  if (value === null || value === undefined || value === '') return '—'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  if (numeric < 1) return `${Math.round(numeric * 60)}m`
  return `${numeric}h`
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>
