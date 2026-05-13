<template>
  <ManagedJobCard :job="job" counterparty-label="Partner-managed relationship" />
</template>

<script setup lang="ts">
import type { ManagedJobRecord } from '~/stores/workflowSpine'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'

defineProps<{
  job: ManagedJobRecord
}>()
</script>
