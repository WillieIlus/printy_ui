<template>
  <div class="grid gap-4 md:grid-cols-3">
    <MetricCard label="Active quotes" :value="quoteCount" hint="Requests and responses that still need attention." />
    <MetricCard label="Active jobs" :value="jobCount" hint="Live jobs tied to your accepted quotes." />
    <MetricCard label="Unread messages" :value="messageCount" hint="Inbox items from shops or Printy workflow events." />
  </div>
</template>

<script setup lang="ts">
import MetricCard from '~/components/ui/MetricCard.vue'

defineProps<{
  quoteCount: number
  jobCount: number
  messageCount: number
}>()
</script>
