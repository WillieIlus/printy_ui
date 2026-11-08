<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Quotes', to: '/app/manager/quotes' }],
})
</script>

<template>
  <ManagerQuotesView />
</template>
