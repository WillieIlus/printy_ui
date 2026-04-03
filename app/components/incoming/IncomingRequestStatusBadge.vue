<template>
  <div
    class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-semibold"
    :class="containerClass"
  >
    <span class="flex h-2 w-2 rounded-full" :class="dotClass" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestStatus } from '~/shared/types/incomingRequest'

const props = defineProps<{
  status: IncomingRequestStatus
}>()

const statusMap: Record<string, { label: string; color: 'neutral' | 'primary' | 'warning' | 'success' | 'error' }> = {
  submitted: { label: 'New', color: 'primary' },
  awaiting_shop_action: { label: 'Awaiting action', color: 'warning' },
  awaiting_client_reply: { label: 'Awaiting reply', color: 'warning' },
  viewed: { label: 'Opened', color: 'neutral' },
  quoted: { label: 'Quoted', color: 'success' },
  accepted: { label: 'Opened', color: 'neutral' },
  rejected: { label: 'Closed', color: 'error' },
  expired: { label: 'Closed', color: 'error' },
  closed: { label: 'Closed', color: 'neutral' },
  cancelled: { label: 'Closed', color: 'error' },
  draft: { label: 'Opened', color: 'neutral' },
}

const label = computed(() => statusMap[props.status]?.label ?? props.status)
const color = computed(() => statusMap[props.status]?.color ?? 'neutral')

const containerClass = computed(() => {
  if (color.value === 'primary') return 'border-flamingo-200 bg-flamingo-50 text-flamingo-800 dark:border-flamingo-400/25 dark:bg-flamingo-500/10 dark:text-flamingo-100'
  if (color.value === 'warning') return 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-100'
  if (color.value === 'success') return 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-100'
  if (color.value === 'error') return 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200'
  return 'border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-dim)]'
})

const dotClass = computed(() => {
  if (color.value === 'primary') return 'bg-flamingo-500'
  if (color.value === 'warning') return 'bg-amber-500'
  if (color.value === 'success') return 'bg-emerald-500'
  if (color.value === 'error') return 'bg-slate-400'
  return 'bg-slate-400 dark:bg-slate-500'
})
</script>
