<template>
  <UiCard>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Current status</p>
        <h2 class="mt-3 text-3xl font-black text-slate-950">{{ job.title }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ job.location || 'Kenya' }}</p>
      </div>
      <StatusBadge :value="job.status" />
    </div>
    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Specs</p>
        <p class="mt-3 text-sm text-slate-700">{{ job.specs || 'No public spec summary provided.' }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Deadline</p>
        <p class="mt-3 text-sm text-slate-700">{{ formattedDeadline }}</p>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/StatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
  job: Record<string, any>
}>()

const formattedDeadline = computed(() => {
  if (!props.job.deadline) return 'No public deadline available yet.'
  return new Date(props.job.deadline).toLocaleString()
})
</script>
