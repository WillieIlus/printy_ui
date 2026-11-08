<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Quotes', to: '/app/admin/quotes' }],
})
</script>

<template>
  <AdminQuotesView />
</template>
