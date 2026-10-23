<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Custody', to: '/app/admin/custody' }],
})
</script>

<template>
  <AdminCustodyView />
</template>