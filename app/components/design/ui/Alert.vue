<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'

/**
 * Shared inline alert for form validation and server feedback. It only styles
 * the message the caller already renders; it never decides when a state shows.
 */
export type AlertTone = 'error' | 'success' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  tone?: AlertTone
  title?: string
  class?: string
}>(), {
  tone: 'info',
  title: undefined,
  class: undefined,
})

const TONES: Record<AlertTone, string> = {
  error: 'border-red/35 bg-red-soft text-red',
  success: 'border-green/35 bg-green-soft text-green',
  warning: 'border-amber/45 bg-amber-soft text-amber',
  info: 'border-line bg-paper-2 text-ink-2',
}

const ICONS = {
  error: OctagonAlert,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
} as const

const icon = computed(() => ICONS[props.tone])
const role = computed(() => (props.tone === 'error' || props.tone === 'warning' ? 'alert' : 'status'))
</script>

<template>
  <div
    :class="cx('flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[13px]', TONES[props.tone], props.class)"
    :role="role"
    data-design-alert
  >
    <component :is="icon" :size="16" class="mt-0.5 shrink-0" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p v-if="props.title" class="font-semibold">{{ props.title }}</p>
      <div :class="props.title ? 'mt-0.5' : ''">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
