<template>
  <WorkflowDeliveryStatusCard :job="job" :events="events" />
</template>

<script setup lang="ts">
import type { ManagedJobEventRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import WorkflowDeliveryStatusCard from '~/components/workflow/DeliveryStatusCard.vue'

defineProps<{
  job: ManagedJobRecord
  events: ManagedJobEventRecord[]
}>()
</script>
