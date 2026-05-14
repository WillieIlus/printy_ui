<template>
  <PayoutReadinessCard :settlement="settlement" audience="shop" />
</template>

<script setup lang="ts">
import type { JobSettlementRecord } from '~/stores/workflowSpine'
import PayoutReadinessCard from '~/components/workflow/PayoutReadinessCard.vue'

defineProps<{
  settlement?: JobSettlementRecord | null
}>()
</script>
