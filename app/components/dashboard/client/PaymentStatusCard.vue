<template>
  <WorkflowPaymentStatusCard
    :job="job"
    :settlement="settlement"
    :payments="payments"
    :submitting="submitting"
    @stk-push="$emit('stk-push', $event)"
    @query="$emit('query', $event)"
  />
</template>

<script setup lang="ts">
import type { JobPaymentRecord, JobSettlementRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import WorkflowPaymentStatusCard from '~/components/workflow/PaymentStatusCard.vue'

defineProps<{
  job: ManagedJobRecord
  settlement?: JobSettlementRecord | null
  payments?: JobPaymentRecord[]
  submitting?: boolean
}>()

defineEmits<{
  (e: 'stk-push', phone: string): void
  (e: 'query', checkoutRequestId: string): void
}>()
</script>
