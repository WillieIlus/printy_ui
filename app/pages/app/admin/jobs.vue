<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Jobs', to: '/app/admin/jobs' }],
})
</script>

<template>
  <AdminJobsView />
</template>