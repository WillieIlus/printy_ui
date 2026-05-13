<template>
  <SettlementSummary
    eyebrow="Production payout"
    title="Payout summary"
    :settlement="settlement"
    audience="shop"
  />
</template>

<script setup lang="ts">
import type { JobSettlementRecord } from '~/stores/workflowSpine'
import SettlementSummary from '~/components/workflow/SettlementSummary.vue'

defineProps<{
  settlement?: JobSettlementRecord | null
}>()
</script>
