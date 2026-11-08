<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Jobs', to: '/app/manager/jobs' }],
})
</script>

<template>
  <ManagerJobsView />
</template>