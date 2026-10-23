<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Quotes', to: '/app/admin/quotes' }],
})
</script>

<template>
  <AdminQuotesView />
</template>