<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Custody', to: '/app/admin/custody' }],
})
</script>

<template>
  <AdminCustodyView />
</template>
