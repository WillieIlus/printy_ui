<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Printers', to: '/app/admin/printers' }],
})
</script>

<template>
  <AdminPrintersView />
</template>
