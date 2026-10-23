<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Jobs', to: '/app/manager/jobs' }],
})
</script>

<template>
  <ManagerJobsView />
</template>