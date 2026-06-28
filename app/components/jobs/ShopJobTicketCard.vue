<template>
  <UiCard>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Managed job</p>
        <h2 class="mt-3 text-3xl font-black text-slate-950">{{ job.title || job.managed_reference }}</h2>
        <p class="mt-2 text-sm text-slate-600">Reference: {{ job.managed_reference || job.id }}</p>
      </div>
      <StatusBadge :value="job.status" />
    </div>
    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <MetricCard label="Payment" :value="job.payment_status || '-'" />
      <MetricCard label="Assignment" :value="job.assignment_status || '-'" />
      <MetricCard label="Files" :value="job.file_count ?? 0" />
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import MetricCard from '~/components/ui/MetricCard.vue'
import StatusBadge from '~/components/ui/UiStatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'

defineProps<{
  job: Record<string, any>
}>()
</script>
