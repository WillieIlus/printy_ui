<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Offline claim', to: '/app/offline-claim' }],
})
</script>

<template>
  <OfflineClaimView />
</template>
