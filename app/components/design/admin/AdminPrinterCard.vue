<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { cx } from '~/utils/design/cx'
import type { Printer } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{
  printer: Printer
  pending?: boolean
  disputed?: boolean
  floorLabel: string
}>(), {
  pending: false,
  disputed: false,
})

const emit = defineEmits<{ open: [printer: Printer] }>()

const badgeIcon = computed(() => getIcon(props.pending ? 'AlertTriangle' : 'BadgeCheck'))
const borderClass = computed(() => {
  if (props.pending) return 'border-dashed border-amber/50'
  if (props.disputed) return 'border-red/50'
  return 'border-line'
})
</script>

<template>
  <button
    type="button"
    data-test="admin-printer-card"
    :class="cx('rounded-xl border bg-card p-4 text-left transition-transform hover:-translate-y-0.5', borderClass)"
    @click="emit('open', props.printer)"
  >
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[11px] font-bold text-brand-deep">
        {{ props.printer.initials }}
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 truncate text-[14.5px] font-semibold tracking-tight text-ink">
          {{ props.printer.name }}
          <component :is="badgeIcon" :class="cx('h-3.5 w-3.5 shrink-0', props.pending ? 'text-amber' : 'text-brand')" :stroke-width="2" />
        </div>
        <div class="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">{{ props.printer.city }} · {{ props.printer.contact }}</div>
      </div>
      <div v-if="!props.pending" class="text-right font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">
        <div>{{ props.printer.rating }} rating</div>
        <div>{{ props.printer.onTime }}% on-time</div>
      </div>
    </div>

    <div class="mt-3 flex flex-wrap gap-1">
      <span
        v-for="cap in props.printer.caps"
        :key="cap"
        class="rounded-full border border-line bg-paper-2 px-2 py-0.5 font-mono text-[8.5px] tracking-[0.08em] text-ink-2 uppercase"
      >{{ cap }}</span>
    </div>

    <div
      :class="cx(
        'mt-3 border-t pt-2.5 font-mono text-[9px] tracking-[0.1em] uppercase',
        props.pending ? 'text-amber' : props.disputed ? 'text-red' : 'text-ink-3',
      )"
    >
      {{ props.floorLabel }}
    </div>
  </button>
</template>
