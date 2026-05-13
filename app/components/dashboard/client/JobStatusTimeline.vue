<template>
  <WorkflowTimeline eyebrow="Job progress" title="Job timeline" :items="items">
    <template #badge>
      <PaymentStatusBadge :status="job.payment_status" />
    </template>
  </WorkflowTimeline>
</template>

<script setup lang="ts">
import type { ManagedJobRecord } from '~/stores/workflowSpine'
import PaymentStatusBadge from '~/components/workflow/PaymentStatusBadge.vue'
import WorkflowTimeline from '~/components/workflow/WorkflowTimeline.vue'
import { buildManagedJobTimeline } from '~/utils/workflowUi'

const props = defineProps<{
  job: ManagedJobRecord
}>()

const items = computed(() => buildManagedJobTimeline(props.job))
</script>
