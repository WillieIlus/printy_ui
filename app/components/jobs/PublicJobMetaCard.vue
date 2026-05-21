<template>
  <UiCard>
    <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">What this page can confirm</p>
    <ul class="mt-4 space-y-3 text-sm text-slate-700">
      <li>Current public job status: <span class="font-semibold">{{ job.status_label || job.status }}</span></li>
      <li>Machine type: <span class="font-semibold">{{ job.machine_type || 'Not publicly exposed' }}</span></li>
      <li>Finishing capabilities: <span class="font-semibold">{{ finishingText }}</span></li>
    </ul>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
  job: Record<string, any>
}>()

const finishingText = computed(() => {
  const value = props.job.finishing_capabilities
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value || 'Not publicly exposed'
})
</script>
