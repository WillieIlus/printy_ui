<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Printers', to: '/app/admin/printers' }],
})
</script>

<template>
  <AdminPrintersView />
</template>