<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Pricing guidance', to: '/app/manager/rates' }],
})
</script>

<template>
  <ManagerRatesView />
</template>