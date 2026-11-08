<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Offline claim', to: '/app/offline-claim' }],
})
</script>

<template>
  <OfflineClaimView />
</template>
