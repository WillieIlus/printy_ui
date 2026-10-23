<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Quotes', to: '/app/manager/quotes' }],
})
</script>

<template>
  <ManagerQuotesView />
</template>
