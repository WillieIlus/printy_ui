<template>
  <div class="grid gap-4 md:grid-cols-3">
    <MetricCard label="Assignments" :value="assignments.length" hint="Current jobs routed to this shop." />
    <MetricCard label="Awaiting payment" :value="awaitingPayment" hint="Do not fake success; status comes from backend." />
    <MetricCard label="In production" :value="inProduction" hint="Only real workflow states shown." />
  </div>
</template>

<script setup lang="ts">
import MetricCard from '~/components/ui/MetricCard.vue'

const props = defineProps<{
  assignments: Array<Record<string, any>>
}>()

const awaitingPayment = computed(() => props.assignments.filter((item) => String(item.managed_job_payment_status || '').includes('pending')).length)
const inProduction = computed(() => props.assignments.filter((item) => String(item.status || '').includes('production')).length)
</script>
