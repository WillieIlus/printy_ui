<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Managers', to: '/app/admin/managers' }],
})
</script>

<template>
  <AdminManagersView />
</template>