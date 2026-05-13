<template>
  <div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{{ eyebrow }}</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">{{ title }}</h3>
      </div>
      <slot name="badge" />
    </div>

    <div class="mt-5 grid gap-4 md:grid-cols-5">
      <article
        v-for="item in items"
        :key="item.key"
        class="relative rounded-2xl border p-4"
        :class="item.current ? 'border-[var(--p-primary)]/35 bg-[var(--p-primary)]/6' : item.complete ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-slate-50/70'"
      >
        <div class="flex items-center gap-3">
          <span
            class="flex size-8 items-center justify-center rounded-full text-xs font-bold"
            :class="item.complete ? 'bg-emerald-500 text-white' : item.current ? 'bg-[var(--p-primary)] text-white' : 'bg-slate-200 text-slate-600'"
          >
            <Icon v-if="item.complete && !item.current" name="lucide:check" class="size-4" />
            <span v-else>{{ stepNumber(item.key) }}</span>
          </span>
          <p class="text-sm font-semibold text-slate-950">{{ item.label }}</p>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-500">{{ item.caption }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkflowTimelineItem } from '~/utils/workflowUi'

const props = defineProps<{
  eyebrow: string
  title: string
  items: WorkflowTimelineItem[]
}>()

function stepNumber(key: string) {
  const index = props.items.findIndex(item => item.key === key)
  return index >= 0 ? index + 1 : 1
}
</script>
