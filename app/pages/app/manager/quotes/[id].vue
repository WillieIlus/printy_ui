<script setup lang="ts">
import ManagerQuotesView from '~/components/workbench/views/ManagerQuotesView.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'Quotes', to: '/app/manager/quotes' },
    { label: 'Quote', to: '' },
  ],
})
</script>

<template>
  <ManagerQuotesView />
</template>
