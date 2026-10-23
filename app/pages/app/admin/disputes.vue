<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Disputes', to: '/app/admin/disputes' }],
})
</script>

<template>
  <AdminDisputesView />
</template>