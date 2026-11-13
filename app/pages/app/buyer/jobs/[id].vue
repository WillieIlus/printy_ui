<script setup lang="ts">
import { computed } from 'vue'
import BuyerJobTimeline from '~/components/workbench/tracker/BuyerJobTimeline.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
})

useHead({
  title: 'Job timeline',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const route = useRoute()

const jobId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  return /^\d+$/.test(String(value ?? '')) ? Number(value) : 0
})
</script>

<template>
  <BuyerJobTimeline :job-id="jobId" />
</template>
