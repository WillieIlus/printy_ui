<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Clients & shops', to: '/app/manager/clients' }],
})
</script>

<template>
  <ManagerClientsView />
</template>