<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production actions</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">Controlled assignment actions</h3>
      </div>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700">
        {{ statusLabel }}
      </span>
    </div>

    <p class="mt-4 text-sm leading-6 text-slate-500">
      Advance the assignment without exposing client selling price, partner margin, or direct unmanaged client contact.
    </p>

    <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="action in availableActions"
        :key="action.key"
        type="button"
        class="rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="action.tone"
        :disabled="disabled"
        @click="$emit('action', action.key)"
      >
        <p class="text-sm font-semibold">{{ action.label }}</p>
        <p class="mt-1 text-xs leading-5 opacity-80">{{ action.helper }}</p>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  status?: string | null
  disabled?: boolean
}>(), {
  status: 'pending',
  disabled: false,
})

defineEmits<{
  (e: 'action', action: 'accept' | 'reject' | 'in_production' | 'ready' | 'completed' | 'issue'): void
}>()

const statusLabel = computed(() =>
  String(props.status ?? 'pending')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase()),
)

const actionMap = {
  accept: {
    key: 'accept',
    label: 'Accept assignment',
    helper: 'Confirm the shop can take ownership of production.',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100',
  },
  reject: {
    key: 'reject',
    label: 'Reject assignment',
    helper: 'Return the job for reassignment when capacity or fit is wrong.',
    tone: 'border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100',
  },
  in_production: {
    key: 'in_production',
    label: 'Start production',
    helper: 'Move the assignment from accepted into live floor work.',
    tone: 'border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100',
  },
  ready: {
    key: 'ready',
    label: 'Mark ready',
    helper: 'Signal the job is ready for rider, pickup, or release.',
    tone: 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100',
  },
  completed: {
    key: 'completed',
    label: 'Complete assignment',
    helper: 'Close production work and keep payout release aligned.',
    tone: 'border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200',
  },
  issue: {
    key: 'issue',
    label: 'Report issue',
    helper: 'Escalate blockers inside the managed workflow.',
    tone: 'border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100',
  },
} as const

const availableActions = computed(() => {
  const status = String(props.status ?? 'pending')

  if (status === 'pending') return [actionMap.accept, actionMap.reject, actionMap.issue]
  if (status === 'accepted') return [actionMap.in_production, actionMap.reject, actionMap.issue]
  if (status === 'in_production') return [actionMap.ready, actionMap.issue]
  if (status === 'ready') return [actionMap.completed, actionMap.issue]
  if (status === 'completed') return [actionMap.issue]

  return [actionMap.accept, actionMap.in_production, actionMap.ready, actionMap.completed, actionMap.issue]
})
</script>
