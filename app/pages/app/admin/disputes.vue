<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Disputes', to: '/app/admin/disputes' }],
})
</script>

<template>
  <AdminDisputesView />
</template>
