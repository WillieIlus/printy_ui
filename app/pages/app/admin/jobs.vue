<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Jobs', to: '/app/admin/jobs' }],
})
</script>

<template>
  <AdminJobsView />
</template>
