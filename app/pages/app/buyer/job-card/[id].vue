<script setup lang="ts">
import { computed } from 'vue'
import JobCardPage from '~/components/workbench/JobCardPage.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'My jobs', to: '/app/buyer' },
    { label: 'Job card', to: '' },
  ],
})

useHead({
  title: 'Job card',
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
  <JobCardPage
    :job-id="jobId"
    viewer-role="buyer"
    back-to="/app/buyer"
    back-label="Back to my jobs"
    :fallback-target="`/app/buyer/jobs/${jobId}#artwork`"
  />
</template>
